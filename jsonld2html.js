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

/**
 * Data Object used as transfer between data_object from jsonld file and the mustache template
 */
function Card(_type, _pictureURL, _iconName="image",_title, _content = [] , _footer, _breadcrumbList, _dedicated_text_column){
    //this.type = _type;
    this.pictureURL = _pictureURL;
    this.iconName = _iconName;
    this.title = _title;
    this.content = _content;
    this.dedicated_text_column = _dedicated_text_column;
    this.footer = _footer;
    this.breadcrumbList = _breadcrumbList;
    
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
 * this function is used to find objects inside a specific
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

function renderFromTemplate(jsonLd, template) {


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

    //===== Using of subtemplates =====
    if(temp_card_obj.type === "NewsArticle" || temp_card_obj === "Article")
    {
        let ded_template = getDefaultCardSubtemplate(temp_card_obj.type);
        let output = mustache.render(ded_template, jsonLd);
        temp_card_obj.dedicated_text_column = output;
    }

    if(temp_card_obj.type === "FoodEstablishmentReservation")
    {
        let ded_template = getDefaultCardSubtemplate(temp_card_obj.type);
        let output = mustache.render(ded_template, jsonLd);
        temp_card_obj.dedicated_text_column = output;

    }

    if(temp_card_obj.type === "RentalCarReservation")
    {   
        let ded_template = getDefaultCardSubtemplate(temp_card_obj.type);
        let output = mustache.render(ded_template, jsonLd);
        temp_card_obj.dedicated_text_column = output;
    }

    if(temp_card_obj.type === "ParcelDelivery")
    {
        let ded_template = getDefaultCardSubtemplate(temp_card_obj.type);
        let output = mustache.render(ded_template,jsonLd);
        temp_card_obj.dedicated_text_column = output;
    }

    if(temp_card_obj.type == "Place")
    {
        let ded_template = getDefaultCardSubtemplate(temp_card_obj.type);
        let output = mustache.render(ded_template, jsonLd);
        temp_card_obj.dedicated_text_column = output;
    }

    // TODO construct better structure for dealing with dedicated templates
    // Maybe create base + subtemplate structure
    if(temp_card_obj.type === "EmailMessage")
    {
        temp_card_obj.content = jsonLd["expires"];
    }
    
    //===== Using of fallback if no subtemplate is set =====
    if(temp_card_obj.dedicated_text_column === undefined)
    {
        // Checking first in the "root" object for a value
        if(jsonLd["name"] !== undefined && typeof jsonLd["name"] === 'string')
        {
            temp_card_obj.name = jsonLd["name"];
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
            temp_card_obj.description = jsonLd["description"];
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
    if(action_object!= null){
        temp_card_obj.potentialAction = action_object.potentialAction;
    }

    // render the template with data
    return mustache.render(template, temp_card_obj);
}

jsonld2html.render = function render(jsonLd) {
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
