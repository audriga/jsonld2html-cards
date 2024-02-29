/*!
 * Exports all available templates to be used for rendering
 */

import default_card from './templates/default_card.html';
import confirmationCode from './templates/default_card_slim.html';

import RentalCarReservation from './templates/subtemplate_RentalCarReservation.html';
import ParcelDelivery from './templates/subtemplate_ParcelDelivery.html';
import FoodEstablishmentReservation from './templates/subtemplate_FoodEstablishmentReservation.html';
import NewsArticle from './templates/subtemplate_NewsArticle.html';
import Place from './templates/subtemplate_Place.html';
import Fallback from './templates/subtemplate_Fallback.html';
import EmailMessage from './templates/subtemplate_EmailMessage(ConfirmationCode).html';



// These are specific "subtemplates" for the default_card
// with these one can specify the rendering of the default_card for different schema types
const default_card_subtemplates_map = new Map();
default_card_subtemplates_map.set("RentalCarReservation",RentalCarReservation);
default_card_subtemplates_map.set("ParcelDelivery",ParcelDelivery);
default_card_subtemplates_map.set("FoodEstablishmentReservation",FoodEstablishmentReservation);
default_card_subtemplates_map.set("NewsArticle",NewsArticle);
default_card_subtemplates_map.set("Place",Place);
default_card_subtemplates_map.set("Fallback",Fallback);

// this is a subtemplate for the default_card_slim
default_card_subtemplates_map.set("EmailMessage",EmailMessage);

export function getDefaultCardSubtemplate(_type){
    if(default_card_subtemplates_map.has(_type)){
        return default_card_subtemplates_map.get(_type);
    }
    else if(default_card_subtemplates_map.has("Fallback")){
        return default_card_subtemplates_map.has("Fallback")
    }
    //FIXME
    return "";
}

/* Comment out templates above that you do not want to include in the jsonld2html-bundle.js file */

// Filling map to avoid using global variables (aka window) or eval()
const available_templates = new Map;
available_templates.set("default_card", default_card);
if (typeof confirmationCode !== 'undefined') {
    available_templates.set("confirmationCode", confirmationCode);
}

// Mapping schema type to dedicated template file
const dedicatedTemplateFiles = new Map();
if (typeof confirmationCode !== 'undefined') {
    dedicatedTemplateFiles.set("EmailMessage","confirmationCode");
}

/* Edit above to in case you added your own templates. */

export default function getTemplate(type) {
    // loading the HTML mustache template
    // Use dedicated template for certain types only
    if(dedicatedTemplateFiles.has(type)) {
        let template_name = dedicatedTemplateFiles.get(type);
        return available_templates.get(template_name);
    }
    return available_templates.get("default_card");
}
