/*!
 * Renders JSON-LD as HTML
 */
import mustache from 'mustache';
import {getMainEntity, transformArrayProperties} from './lib/main_entity.js';
import extractImage from './lib/image_extraction.js';
import createPotentialViewAction from './lib/view_action.js'
import {typeToIconMap,headerIconTemplate,imageIconTemplate,transportIconTemplate} from './lib/type_to_icon_map.js';
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
 * Create two dedicated properties from startDate of Reservation object
 * @param object jsonObject - JSON-LD object of type Reservation
 * @return object Returns JSON-LD object with two addtional properties
 */
function splitStartDateTime(jsonObject) {
    if("reservationFor" in jsonObject)
    {    if ("startDate" in jsonObject.reservationFor) {
            const iDate = new Date(Date.parse(jsonObject.reservationFor.startDate.split('T')[0]));
            const iDateTime = new Date(Date.parse(jsonObject.reservationFor.startDate));
            jsonObject["reservationFor"]["ld2hStartDate"] = iDate.toLocaleDateString();// TODO I18N
            jsonObject["reservationFor"]["ld2hStartTime"] = iDateTime.toLocaleTimeString([], { timeStyle: 'short' }); // TODO I18N
        }
        if("arrivalTime" in jsonObject.reservationFor) {
            const iDate = new Date(Date.parse(jsonObject.reservationFor.arrivalTime.split('T')[0]));
            const iDateTime = new Date(Date.parse(jsonObject.reservationFor.arrivalTime));
            jsonObject["reservationFor"]["ld2hStartDate"] = iDate.toLocaleDateString();
            jsonObject["reservationFor"]["ld2hStartTime"] = iDateTime.toLocaleTimeString([], { timeStyle: 'short' }); // TODO I18N

        }
        if("departureTime" in jsonObject.reservationFor) {
            const iDate = new Date(Date.parse(jsonObject.reservationFor.departureTime.split('T')[0]));
            const iDateTime = new Date(Date.parse(jsonObject.reservationFor.departureTime));
            jsonObject["reservationFor"]["ld2hEndDate"] = iDate.toLocaleDateString();
            jsonObject["reservationFor"]["ld2hEndTime"] = iDateTime.toLocaleTimeString([], { timeStyle: 'short' }); // TODO I18N

        }
    }
    
    return jsonObject;
}


/**
 * @param {object} jsonLd - As a parsed object
 * @param {string} template - The mustache template as a string
 * @param {string} artificialType - Optional type if the provided jsonLd dont have one. For example if arrays of Objects need to be rendered
 * @returns {string} Returns rendered card template
 */
function renderFromTemplate(jsonLd, template, artificialType = "") {
    let partials = {headerIconTemplate, imageIconTemplate,transportIconTemplate};

    // Determine icon based on schema type
    // Prefer artificialType over actual @type, fallback to https://ld2h/Default
    if(artificialType !== ""){
        jsonLd["iconName"] = typeToIconMap.get(artificialType);
        // NOTE Render the icon globally because of limited access to the iconName in array renderings
        let iconNameObj = {"iconName":typeToIconMap.get(artificialType)};
        partials["headerIconTemplate"] = mustache.render(partials["headerIconTemplate"], iconNameObj);
        partials["imageIconTemplate"] = mustache.render(partials["imageIconTemplate"], iconNameObj);
        partials["transportIconTemplate"] = mustache.render(partials["transportIconTemplate"], iconNameObj);
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
            mustacheDataObj["promotionCards"].push(mustache.render(tmpExp.getSubtemplateOfType(artificialType), transformArrayProperties(promoCard)))
        }
        // Do not transform Arrays here as PromotionCards are inside an array
        let finalCard = mustache.render(template, mustacheDataObj, partials);
        return finalCard;
    }
    
    // ===== Custom base template with custom subtemplate
    // Case: Reservation base template with Reservation subtemplate
    if (artificialType != "" && artificialType.endsWith("Reservations")){
        console.log("Applying special rendering for Reservations")
        // Creating ID for the bar to wire it with its tabs
        partials["tabBarId"] = "bar" + Math.floor(Math.random() * 100);

        // adding an synthetic ID to the instances
        let i = Math.floor(Math.random() * 1000000000000001);
        let first = true;
        let output = "";

        // wire the IDs to each Reservation item
        for (let iterator of jsonLd) {
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

            iterator = transformArrayProperties(iterator);
            iterator = splitStartDateTime(iterator);

            // Fallbak to https://ld2h/Reservations for Reservations without dedicated subtemplate
            if (tmpExp.hasSubtemplateOfType(artificialType)) {
                output += mustache.render(tmpExp.getSubtemplateOfType(artificialType), transformArrayProperties(iterator),partials);
            } else {
                output += mustache.render(tmpExp.getSubtemplateOfType("https://ld2h/Reservations"), transformArrayProperties(iterator), partials);
            }
            i++;
        }

        partials["tabContent"] = output;

        if (artificialType.endsWith("Reservations") && !tmpExp.hasTemplateOfType(artificialType)) {
            return mustache.render(tmpExp.getTemplateOfType("https://ld2h/Reservations"), jsonLd, partials);
        }

        // Do not transform Arrays here as FlightReservations are inside an array
        return mustache.render(tmpExp.getTemplateOfType(artificialType), jsonLd, partials);
    }

    jsonLd = transformArrayProperties(jsonLd);
    let subTemplate;
    if (jsonLd["@type"].endsWith("Reservation")){
        if (jsonLd["@type"] === "EventReservation") {
            jsonLd = splitStartDateTime(jsonLd);
        }
        if (!tmpExp.hasSubtemplateOfType(jsonLd["@type"])) {
            subTemplate = tmpExp.getSubtemplateOfType("https://ld2h/Reservations");
        }
        if(jsonLd["@type"] === "FlightReservation"){
            jsonLd = splitStartDateTime(jsonLd);
        }
        if(jsonLd["@type"] === "TrainReservation"){
            jsonLd = splitStartDateTime(jsonLd);
        }
        if(jsonLd["@type"] === "BusReservation"){
            jsonLd = splitStartDateTime(jsonLd);
        }
    }

    subTemplate = tmpExp.getSubtemplateOfType(jsonLd["@type"]);
    let output =  mustache.render(subTemplate, jsonLd, partials);
    jsonLd["subTemplateContent"] = output;

    // Log unmatched fields
    if(jsonLd["name"] === undefined || jsonLd["name"] === ""){
        console.log(`in ${jsonLd["@type"]}[name] property not found`)
    }
    if(jsonLd["description"] === undefined || jsonLd["description"] === ""){
        console.log(`in ${jsonLd["@type"]}[description] property not found`)
    }

    return mustache.render(template, jsonLd, partials);
}

jsonld2html.render = function render(jsonLd) {
    
    // Detect special json-lds which cannot be determined after getMainEntity
    

    // Bypass getMainEntity for special cases
    // Special case: Reservation
    if(Array.isArray(jsonLd)){
        let isReservationArray = false;
        // Check if all Elements are Reservations
        for (const iterator of jsonLd) {
            if(iterator["@type"] !== undefined
                    && iterator["@type"].endsWith("Reservation")){
                isReservationArray = true;
            }
        }
        let type = `https://ld2h/${jsonLd[0]["@type"]}s`;
        console.log(type)  // TODO remove
        console.log(isReservationArray) // TODO remove
        if(isReservationArray) {
            console.log("Applying special rendering for JSON-LD array")
            if (tmpExp.hasSubtemplateOfType(type) && tmpExp.hasTemplateOfType(type)) {  
                return renderFromTemplate(jsonLd, tmpExp.getTemplateOfType(type), type);
            } else {
                return renderFromTemplate(jsonLd, tmpExp.getTemplateOfType("https://ld2h/Reservations"), type);
            }
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
