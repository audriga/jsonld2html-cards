/*!
 * Renders JSON-LD as HTML
 */
import mustache from 'mustache';
import getTemplate from './lib/template_exporter.js';
import getMainEntity from './lib/main_entity.js';
import extractImage from './lib/image_extraction.js';
import createPotentialViewAction from './lib/view_action.js'
import typeToIconMap from './lib/type_to_icon_map.js';
import {getDefaultCardSubtemplate, hasDefaultCardSubtemplate} from './lib/template_exporter.js';



/**
 * Data Object used as transfer between data_object from jsonld file and the mustache template
 */
function Card(_pictureURL, _iconName="image",_title, _content = [] ,
     _footer, _breadcrumbList, _dedicatedTextColumn, _urlAction,_copyAction){
    this.pictureURL = _pictureURL;
    this.iconName = _iconName;
    this.title = _title;
    this.content = _content;
    this.dedicatedTextColumn = _dedicatedTextColumn;
    this.footer = _footer;
    this.breadcrumbList = _breadcrumbList;
    this.urlAction = _urlAction;
    this.copyAction = _copyAction;
    
}

var jsonld2html = {
    name: 'jsonld2html.js',
    version: '0.0.1'
}


/**
 * @param {object} entireObj - Object to search
 * @þaram {string} keyToFind - the Key to search for a value
 * @return {string} if a key exists the value of the key will returned
 */
function findValueFromKey(entireObj, keyToFind) {
    let foundValue;

    for (let keysKey of Object.keys(entireObj)) {
        if (keysKey !== keyToFind) {
            continue;
        }
        foundValue = (entireObj[keysKey]);
    }
    return foundValue;
}

/**
 * finds Key Values in deep nests and returns the object, depth is not restricted !
 */
function findNestedObj(entireObj, keyToFind) {
    let foundObj;
    JSON.stringify(entireObj, (_, nestedValue) => {
        if (nestedValue && nestedValue[keyToFind]){
            foundObj = nestedValue;
        }
        return nestedValue;
    });
    if(foundObj != undefined) {return foundObj;}
    else return null;
}

/**
 * this function is used to find objects regardless of their location in the object
 * it returns the object in which to key and val matching
 */
function findNestedObjWithValue(entireObj, keyToFind, valToFind) {
    let foundObj;
    JSON.stringify(entireObj, (_, nestedValue) => {
        if (nestedValue && nestedValue[keyToFind] === valToFind) {
            foundObj = nestedValue;
        }
        return nestedValue;
    });
    return foundObj;
}

function renderFromTemplate(jsonLd, template, dedicatedType = "") {



    if(typeToIconMap.has(jsonLd["@type"])) {
        jsonLd["iconName"] = typeToIconMap.get(jsonLd["@type"]);
    }
    // in case we dont have a type specific icon we use a default icon
    else { jsonLd["iconName"] = "image";}
    

    // ===== Special case "FlightReservationArray" =====
    if(dedicatedType === "FlightReservationArray"){

        // Creating ID for the bar to wire it with its tabs
        let tab_bar_id = "bar" + Math.floor(Math.random() * 100);
        // adding an synthetic ID to the instances
        let i = Math.floor(Math.random() * 1000000000000001);

        // wire the IDs to each FlightReservation
        for (const iterator of jsonLd) {
            if(iterator["@type"] === "FlightReservation"){
                iterator["tab_id"] = iterator["@type"] + i;
                iterator["tab_bar"] = tab_bar_id;
                i++;
            }
        }
        return mustache.render(template,jsonLd);
    }
    
    // ===== Special case "PromotionCards" =====
    if(dedicatedType === "PromotionCards")
    {
        function findNestedObjectsWithVal(entireObj, keyToFind, valToFind) {
            let foundObj= [];
            JSON.stringify(entireObj, (_, nestedValue) => {
                if (nestedValue && nestedValue[keyToFind] === valToFind)  {
                    foundObj.push(nestedValue);
                }
                return nestedValue;
            });
            if(foundObj.length >= 1){
                return foundObj;
            }
            else return null;
        }
        
        function findNestedObjWithKey(entireObj, keyToFind) {
            let foundObj;
            JSON.stringify(entireObj, (_, nestedValue) => {
                if (nestedValue && nestedValue[keyToFind]){
                    foundObj = (nestedValue[keyToFind]);
                }
                return nestedValue;
            });
            return foundObj;
        }
        
        function getCurrencyChar(_symbol){
            if(_symbol === "USD"){
                return "$";
            }
            else {return _symbol;}
        }
        
        let mustacheDataObj = new Object();
        mustacheDataObj["promotionCards"] = [];
        mustacheDataObj["logo"] = findNestedObjWithKey(jsonLd,"logo");
        mustacheDataObj["subjectLine"] = findNestedObjWithKey(jsonLd,"subjectLine");
        mustacheDataObj["description"] = findNestedObjWithKey(jsonLd,"description");
        mustacheDataObj["discountCode"] = findNestedObjWithKey(jsonLd,"discountCode");
        
        let foundObjects= findNestedObjectsWithVal(jsonLd,"@type","PromotionCard");
        
        for (const obj of foundObjects){
            
            let promoCardTest = {
                image: obj["image"],
                headline: obj["headline"],
                discountValue: obj["discountValue"],
                newPrice: getCurrencyChar(obj["priceCurrency"]) + String(obj["price"] - obj["discountValue"]),
                oldPrice: getCurrencyChar(obj["priceCurrency"]) + String(obj["price"]),
                priceCurrency: obj["priceCurrency"]
            }
            mustacheDataObj["promotionCards"].push(mustache.render(getDefaultCardSubtemplate(dedicatedType),promoCardTest))
            
        }
        
        let finalCard = mustache.render(template, mustacheDataObj);
        return finalCard;
        
    }
    
    // ===== general using of sub templates 
    if(hasDefaultCardSubtemplate(jsonLd["@type"])){
        
        let output =  mustache.render(getDefaultCardSubtemplate(jsonLd["@type"]), jsonLd);
        jsonLd["dedicatedTextColumn"] = output;
    }

    // ===== Using of fallback if no subtemplate is set =====
    if(jsonLd["dedicatedTextColumn"] === undefined
        && hasDefaultCardSubtemplate("Fallback"))
    {
        let output =  mustache.render(getDefaultCardSubtemplate("Fallback"), jsonLd);
        jsonLd["dedicatedTextColumn"] = output;
    }

    return mustache.render(template, jsonLd);
}

jsonld2html.render = function render(jsonLd) {
    
    // Detect special json-lds which cannot be determined after getMainEntity
    
    // Special case: "PromotionCard"
    if(Array.isArray(jsonLd))
    {   
        let promoCardCounter = 0;
        for (const iterator of jsonLd) {
            // The most noticeable attribute of a "PromotionCard" is: containing three of them
            if(iterator["@type"] === "PromotionCard"){
                promoCardCounter +=1;
            }
        }
        if(promoCardCounter === 3){
            let artificialType = "PromotionCards";
            return renderFromTemplate(jsonLd,getTemplate(artificialType),artificialType);
        }
    }


    // Bypass getMainEntity in special case
    if(Array.isArray(jsonLd)){
        let isFlightReservationArray = true;
        // Check if all Elements are FlightReservations
        for (const iterator of jsonLd) {
            if(iterator["@type"] === undefined
                    || iterator["@type"] !== "FlightReservation"){
                isFlightReservationArray = false;
            }
        }

        if(isFlightReservationArray)
        {  
            let artificialType = "FlightReservationArray";
            
            return renderFromTemplate(jsonLd, getTemplate(artificialType), artificialType);
        }
    }

    // Preprocessing
    let preprocessedJson = extractImage(createPotentialViewAction(getMainEntity(jsonLd)));
    // TODO - replace "Find" function
    return renderFromTemplate(preprocessedJson, getTemplate(findValueFromKey(preprocessedJson,"@type")));
}

jsonld2html.renderFromTemplate = renderFromTemplate;

jsonld2html.getMainEntity = getMainEntity;

jsonld2html.createPotentialViewAction = createPotentialViewAction;

jsonld2html.extractImage = extractImage;

export default jsonld2html
