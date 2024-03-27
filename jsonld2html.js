/*!
 * Renders JSON-LD as HTML
 */
import mustache from 'mustache';
import getMainEntity from './lib/main_entity.js';
import extractImage from './lib/image_extraction.js';
import createPotentialViewAction from './lib/view_action.js'
import {typeToIconMap,headerIconTemplate,imageIconTemplate} from './lib/type_to_icon_map.js';
import * as tmpExp from './lib/template_exporter.js';

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

    // Determine icon based on schema type
    // Prefer artificialType over actual @type, fallback to https://ld2h/Default
    if(artificialType !== ""){
        jsonLd["iconName"] = typeToIconMap.get(artificialType);
    } else if(jsonLd["@type"] !== undefined && typeToIconMap.has(jsonLd["@type"])) {
        jsonLd["iconName"] = typeToIconMap.get(jsonLd["@type"]);
    } else {
        jsonLd["iconName"] = typeToIconMap.get("https://ld2h/Default");
    }
    
    
    // ===== Special case "PromotionCards" =====
    if(artificialType === "https://ld2h/PromotionCards" &&
        tmpExp.getSubtemplateOfType("https://ld2h/PromotionCards") == tmpExp.allSubtemplates.subPromotionCards){

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
            mustacheDataObj["promotionCards"].push(mustache.render(tmpExp.getSubtemplateOfType(artificialType),promoCard))
        }
        let finalCard = mustache.render(template, mustacheDataObj, partials);
        return finalCard;
    }
    
    // ===== Custom base template with custom subtemplate
    if(
        tmpExp.hasTemplateOfType(artificialType) 
        && tmpExp.hasSubtemplateOfType(artificialType))
    {
       
       

        // Creating ID for the bar to wire it with its tabs
        partials["tabBarId"] = "bar" + Math.floor(Math.random() * 100);

        // adding an synthetic ID to the instances
        let i = Math.floor(Math.random() * 1000000000000001);
        let first = true;
        let output = "";

        // wire the IDs to each Reservation item
        for (const iterator of jsonLd) {

                // Creating tab specific values
                let tabValues;
                iterator["tabBarId"] = partials["tabBarId"] 
                
                if (first) {
                    iterator["isFirst"] = true;
                    first = false;
                    iterator["isArray"] = false;
                }
                // TODO move this flag assignment to "preprocessing", we check there anyway,
                iterator["isArray"] = true;
                iterator["tabId"] = iterator["@type"] + i;
                iterator["tabValues"] = tabValues;

                output += mustache.render(tmpExp.getSubtemplateOfType(artificialType), iterator);
              
                i++;

            }
        

        partials["tabContent"] = output;
        

        return mustache.render(tmpExp.getTemplateOfType(artificialType), jsonLd, partials);
    }

    let output =  mustache.render(tmpExp.getSubtemplateOfType(jsonLd["@type"]), jsonLd);
    jsonLd["subTemplateContent"] = output;

    // Log unmatched fields
    if(jsonLd["name"] === undefined || jsonLd["name"] === ""){
        console.log(`in ${jsonLd["@type"]}[name] property not found`)
    }
    if(jsonLd["description"] === undefined || jsonLd["description"] === ""){
        console.log(`in ${jsonLd["@type"]}[description] property not found`)
    }

    return mustache.render(template, jsonLd,partials);
}

jsonld2html.render = function render(jsonLd) {
    
    // Detect special json-lds which cannot be determined after getMainEntity
    

    // Bypass getMainEntity in special case
    if(Array.isArray(jsonLd)){
        let isReservationArray = false;
        // Check if all Elements are Reservations
        for (const iterator of jsonLd) {
            if(iterator["@type"] !== undefined
                    && iterator["@type"].includes("Reservation")){
                isReservationArray = true;
            }
        }
        console.log(" =========== array detection")
        let Type = `https://ld2h/${jsonLd[0]["@type"]}`;
        console.log(Type)
        console.log(isReservationArray)
        if(isReservationArray && tmpExp.hasSubtemplateOfType(Type) && tmpExp.hasTemplateOfType(Type))
        {  
            return renderFromTemplate(jsonLd, tmpExp.getTemplateOfType(Type), Type);
        }
    }

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
            let artificialType = "https://ld2h/PromotionCards";
            return renderFromTemplate(jsonLd,tmpExp.getTemplateOfType(artificialType),artificialType);
        }
    }

    

    let preprocessedJson = extractImage(createPotentialViewAction(getMainEntity(jsonLd)));
    return renderFromTemplate(preprocessedJson, tmpExp.getTemplateOfType(preprocessedJson["@type"]));
}

jsonld2html.renderFromTemplate = renderFromTemplate;

jsonld2html.getMainEntity = getMainEntity;

jsonld2html.createPotentialViewAction = createPotentialViewAction;

jsonld2html.extractImage = extractImage;

jsonld2html.allTemplates = tmpExp.allTemplates;

jsonld2html.allSubtemplates = tmpExp.allSubtemplates;

jsonld2html.setTemplateOfType = tmpExp.setTemplateOfType;

jsonld2html.setSubtemplateOfType = tmpExp.setSubtemplateOfType;

export default jsonld2html
