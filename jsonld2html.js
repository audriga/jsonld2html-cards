/*!
 * Renders JSON-LD as HTML
 */
import mustache from 'mustache';
import getTemplate from './lib/template_exporter.js';
import getMainEntity from './lib/main_entity.js';
import extractImage from './lib/image_extraction.js';
import createPotentialViewAction from './lib/view_action.js'
import {typeToIconMap,defaultIcon,headerIconTemplate,imageIconTemplate} from './lib/type_to_icon_map.js';
import {getDefaultCardSubtemplate, hasDefaultCardSubtemplate} from './lib/template_exporter.js';
import {hasDedicatedSubtemplate, getDedicatedSubtemplate} from './lib/template_exporter.js';



var jsonld2html = {
    name: 'jsonld2html.js',
    version: '0.0.1'
}

        /** 
* Find values for a specified key in an array of json objects
* @param object object - the object to be searched
* @return object Returns the value matching to the provided key
*/
function findValueInArray(object,key){
    // case object is array
    if(Array.isArray(object)){
        for (const iterator of object) {
            if(key in iterator){
                return iterator[key];
            }
        }
    }
}


/**
 * @param {object} jsonLd - As a parsed object
 * @param {string} template - The mustache template as a string
 * @param {string} artificialType - Optional type if the provided jsonLd dont have one. For example if arrays of Objects need to be rendered
 * @returns {string} Returns rendered card template
 */
function renderFromTemplate(jsonLd, template, artificialType = "") {


    let partials = {headerIconTemplate, imageIconTemplate};

    
    if(jsonLd["@type"] !== undefined && typeToIconMap.has(jsonLd["@type"])) {
        jsonLd["iconName"] = typeToIconMap.get(jsonLd["@type"]);
    }
    // render the icon Template directly, due the lack of an global iconName property in artificial types
    else if(artificialType !== ""){

        let cleanedType = artificialType.replace("artificial_","");
        let iconNameObj;

        if(typeToIconMap.has(cleanedType)){
            iconNameObj = {"iconName":typeToIconMap.get(cleanedType)}
        }
        else{iconNameObj = defaultIcon;}

        let renderedImageIconTemplate = mustache.render(imageIconTemplate,iconNameObj);
        let renderedHeaderIconTemplate = mustache.render(headerIconTemplate,iconNameObj);
        partials["imageIconTemplate"] = renderedImageIconTemplate;
        partials["headerIconTemplate"] = renderedHeaderIconTemplate;
    }
    // in case we dont have a schema type at all specific icon we use a default icon
    else { jsonLd["iconName"] = defaultIcon;}
    

    // ===== Special case "FlightReservation" array=====
    if(artificialType === "artificial_FlightReservation"){
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
        return mustache.render(template,jsonLd, partials);
    }
    

    // ===== Special case "PromotionCards" =====
    if( artificialType === "artificial_PromotionCards" &&
        hasDedicatedSubtemplate("artificial_PromotionCards")){

        let mustacheDataObj = new Object();
        mustacheDataObj["promotionCards"] = [];
        mustacheDataObj["logo"] = findValueInArray(jsonLd,"logo");
        mustacheDataObj["subjectLine"] = findValueInArray(jsonLd,"subjectLine");
        mustacheDataObj["description"] = findValueInArray(jsonLd,"description");
        mustacheDataObj["discountCode"] = findValueInArray(jsonLd,"discountCode");   
        let foundObjects = [];
        for (const iterator of jsonLd) {
            if(iterator["@type"] === "PromotionCard"){
                foundObjects.push(iterator);
            }
        }
        for (const obj of foundObjects){   
            let promoCard = {
                image: obj["image"],
                headline: obj["headline"],
                discountValue: obj["discountValue"],
                newPrice: String(obj["price"] - obj["discountValue"]),
                oldPrice: String(obj["price"]),
                priceCurrency: obj["priceCurrency"]
            }
            mustacheDataObj["promotionCards"].push(mustache.render(getDedicatedSubtemplate(artificialType),promoCard))
        }
        let finalCard = mustache.render(template, mustacheDataObj,partials);
        return finalCard;
    }
    
    // ===== general using of sub templates 
    if(hasDefaultCardSubtemplate(jsonLd["@type"])){
        let output =  mustache.render(getDefaultCardSubtemplate(jsonLd["@type"]), jsonLd);
        jsonLd["subTemplateContent"] = output;
    }

    // ===== Using of fallback if no subtemplateContent is set =====
    if(jsonLd["subTemplateContent"] === undefined
        && hasDefaultCardSubtemplate("Fallback")){
        
        let output =  mustache.render(getDefaultCardSubtemplate("Fallback"), jsonLd);
        jsonLd["subTemplateContent"] = output;

        // Log unmatched fields
        if(jsonLd["name"] === undefined || jsonLd["name"] === ""){
            console.log(`in ${jsonLd["@type"]}[name] property not found`)
        }
        if(jsonLd["description"] === undefined || jsonLd["description"] === ""){
            console.log(`in ${jsonLd["@type"]}[description] property not found`)
        }
    }

    return mustache.render(template, jsonLd,partials);
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
            let artificialType = "artificial_PromotionCards";
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
            let artificialType = "artificial_FlightReservation";
            
            return renderFromTemplate(jsonLd, getTemplate(artificialType), artificialType);
        }
    }

    let preprocessedJson = extractImage(createPotentialViewAction(getMainEntity(jsonLd)));

    return renderFromTemplate(preprocessedJson, getTemplate(preprocessedJson["@type"]));
}

jsonld2html.renderFromTemplate = renderFromTemplate;

jsonld2html.getMainEntity = getMainEntity;

jsonld2html.createPotentialViewAction = createPotentialViewAction;

jsonld2html.extractImage = extractImage;

export default jsonld2html
