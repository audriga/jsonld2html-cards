/*!
 * Renders JSON-LD as HTML
 */
import mustache from 'mustache';
import getTemplate from './template_exporter.js';
import { getMainEntity } from './lib/MainEntity.js';
import { extractImage } from './lib/ImageExtraction.js';
import  { createPotentialViewAction } from './lib/ViewAction.js'
import icon_json from './config/FontAwesomeIconMap.json';
import {getDefaultCardSubtemplate} from './template_exporter.js';

import {hasDefaultCardSubtemplate} from './template_exporter.js';

/**
 * Data Object used as transfer between data_object from jsonld file and the mustache template
 */
function Card(_type, _pictureURL, _iconName="image",_title, _content = [] ,
     _footer, _breadcrumbList, _dedicated_text_column, _urlAction,_copyAction){
    //this.type = _type;
    this.pictureURL = _pictureURL;
    this.iconName = _iconName;
    this.title = _title;
    this.content = _content;
    this.dedicated_text_column = _dedicated_text_column;
    this.footer = _footer;
    this.breadcrumbList = _breadcrumbList;
    this.urlAction = _urlAction;
    this.copyAction = _copyAction;
    
}

var jsonld2html = {
    name: 'jsonld2html.js',
    version: '0.0.1'
}

// Mapping the fallback icon to schema type
const typeToIconMap = new Map();

Object.entries(icon_json).forEach(element => {
    typeToIconMap.set(element[0],element[1]);
});

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


    let temp_card_obj = new Card();

    temp_card_obj.type = jsonLd["@type"];
    // temp_card_obj.type = findValueFromKey(jsonLd,"@type");

    if(typeToIconMap.has(temp_card_obj.type)) {
        temp_card_obj.iconName = typeToIconMap.get(temp_card_obj.type);
    }
    
   // The extracted image is stored under the "thumbnailUrl" property
   // still we gonna doublecheck if it is a valid string (Url)
    if(jsonLd["thumbnailUrl"] !== undefined && typeof jsonLd["thumbnailUrl"] === 'string')
    {
        temp_card_obj.pictureURL = jsonLd["thumbnailUrl"];
    }
    if(jsonLd["thumbnailUrl"] === undefined && jsonLd["thumbnail"] !== undefined &&
    typeof jsonLd["thumbnail"] === 'string')
    {
        temp_card_obj.pictureURL = jsonLd["thumbnail"];
    }

    // ===== Special case "FlightReservationArray" =====
    if(dedicatedType === "FlightReservationArray"){

        let obj = new Object();
        obj["cardListElement"] = [];

        let tab_bar_id = "bar" + Math.floor(Math.random() * 100);

        // adding an synthetic ID to the instances
        let i = Math.floor(Math.random() * 1000000000000001);
        for (let ObjectElement of jsonLd) {
            ObjectElement["tab_id"] = ObjectElement["@type"] + i;
            ObjectElement["tab_bar"] = tab_bar_id;
            obj.cardListElement.push(ObjectElement);
                i++;
        }

        return mustache.render(template,obj);

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
    if(hasDefaultCardSubtemplate(temp_card_obj.type)){
        
        let output =  mustache.render(getDefaultCardSubtemplate(temp_card_obj.type), jsonLd);
        temp_card_obj.dedicated_text_column = output;
    }
    
    // ===== special case of sub templates =====
    if(temp_card_obj.type === "NewsArticle" || temp_card_obj.type === "Article")
    {   
        //TODO Find a better way to do the same rendering for NewsArticle and Article
        // The templates for NewsArticle and Article are the same but only found under "NewsArticle" in the map
        let typeIdentifier = "NewsArticle";
        let ded_template = getDefaultCardSubtemplate(typeIdentifier);
        let output = mustache.render(ded_template, jsonLd);
        temp_card_obj.dedicated_text_column = output;
    }


    // ===== Using of fallback if no subtemplate is set =====
    if(temp_card_obj.dedicated_text_column === undefined)
    {
        // Checking first in the "root" object for a value
        if(jsonLd["name"] !== undefined && typeof jsonLd["name"] === 'string')
        {
            temp_card_obj.title= jsonLd["name"];
        }
        else
        {
            // If not in the "root" object search in the whole object to find nested values
            let title_object = findNestedObj(jsonLd,"name");
            if(title_object !== null && temp_card_obj.title === undefined)
            {

                temp_card_obj.title = title_object.name;
            }
        }
        // Checking first in the "root" object for a value
        if(jsonLd["description"] !== undefined && typeof jsonLd["description"] === 'string')
        {
            temp_card_obj.content = jsonLd["description"];
        }
        else
        {
            // If not in the "root" object search in the whole object to find nested values
            let description_object = findNestedObj(jsonLd, "description");
            if(description_object !== null && temp_card_obj.content === undefined)
            {

                temp_card_obj.content = description_object.description;
            }
        }
    }

    // header
    // items can be nested or not! the template uses the nested items
    // finds objects inside a specific key/value object
    let breadcrumbList_object = findNestedObjWithValue(jsonLd,"@type","BreadcrumbList");
    if(breadcrumbList_object != null){
        temp_card_obj.breadcrumbList = breadcrumbList_object;

    }
    // footer
    let action_object = findNestedObj(jsonLd,"potentialAction");
    if(action_object !== null){
        if(action_object.potentialAction["@type"] === "CopyToClipboardAction")
        {   
            temp_card_obj.copyAction = action_object.potentialAction;
        }
        else
        {
            temp_card_obj.urlAction = action_object.potentialAction;
        }
    }

    // render the template with data
    // Used for the final rendering of the default card and its subtemplates
    // Used for "fallback" rendering
    return mustache.render(template, temp_card_obj);
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
