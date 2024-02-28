/*!
 * Exports all available templates to be used for rendering
 */

// TODO Maybe do that programmatically by using webpack with html-loader plugin or rollup with rollup-plugin-html / @web/rollup-plugin-html
import default_card from './templates/default_card.html';
import oof from './templates/oof.html.js';

import car from './templates/subtemplate_RentalCarReservation.html';
import delivery from './templates/subtemplate_ParcelDelivery.html';
import food from './templates/subtemplate_FoodEstablishmentReservation.html';
import news from './templates/subtemplate_NewsArticle.html';
import place from './templates/subtemplate_Place.html';
import fallback from './templates/subtemplate_Fallback.html';

// These are specific "subtemplates" for the default_card
// with these one can specify the rendering of the default_card for different schema types
const default_card_subtemplates_map = new Map();
default_card_subtemplates_map.set("RentalCarReservation",car);
default_card_subtemplates_map.set("ParcelDelivery",delivery);
default_card_subtemplates_map.set("FoodEstablishmentReservation",food);
default_card_subtemplates_map.set("NewsArticle",news);
default_card_subtemplates_map.set("Place",place);
default_card_subtemplates_map.set("Fallback",fallback);


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
if (typeof oof !== 'undefined') {
    available_templates.set("oof", oof);
}

// Mapping schema type to dedicated template file
const dedicatedTemplateFiles = new Map();
if (typeof oof !== 'undefined') {
    dedicatedTemplateFiles.set("OutOfOffice","oof");
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
