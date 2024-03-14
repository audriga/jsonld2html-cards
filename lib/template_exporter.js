/*!
 * Exports all available templates to be used for rendering
 */

// base templates
import default_card from '../templates/default_card.html';
import backgroundImage_default_card from '../templates/background_image_card.html'

// sub templates for the base templates
import RentalCarReservation from '../templates/subtemplate_RentalCarReservation.html';
import ParcelDelivery from '../templates/subtemplate_ParcelDelivery.html';
import FoodEstablishmentReservation from '../templates/subtemplate_FoodEstablishmentReservation.html';
import NewsArticle from '../templates/subtemplate_NewsArticle.html';
import Article from '../templates/subtemplate_Article.html';
import Place from '../templates/subtemplate_Place.html';
import Fallback from '../templates/subtemplate_Fallback.html';


// dedicated templates
import PromotionCards from '../templates/promotion_card.html';
import FlightReservationArray from '../templates/reservation_flight_card.html';

// dedicated sub templates
import PromotionCardsInner from '../templates/component_email_promotion.html';

// These are specific "sub templates" for the default_card
// with these one can specify the rendering of the default_card for different schema types
const default_card_subtemplates_map = new Map();
default_card_subtemplates_map.set("RentalCarReservation",RentalCarReservation);
default_card_subtemplates_map.set("ParcelDelivery",ParcelDelivery);
default_card_subtemplates_map.set("FoodEstablishmentReservation",FoodEstablishmentReservation);
default_card_subtemplates_map.set("NewsArticle",NewsArticle);
default_card_subtemplates_map.set("Article",Article);
default_card_subtemplates_map.set("Place",Place);
default_card_subtemplates_map.set("Fallback",Fallback);

// These are subtemplates for dedicated templates
const dedicated_subtemplates_map = new Map();
dedicated_subtemplates_map.set("artificial_PromotionCards", PromotionCardsInner);

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

export function hasDefaultCardSubtemplate (_type){
    if(default_card_subtemplates_map.has(_type)){
        return true;
    }
    else return false;
}

export function hasDedicatedSubtemplate(_type){
    if(dedicated_subtemplates_map.has(_type)){
        return true;
    }else return false;
}

export function getDedicatedSubtemplate(_type){
    if(dedicated_subtemplates_map.has(_type)){
        return dedicated_subtemplates_map.get(_type);
    }
}
/* Comment out templates above that you do not want to include in the jsonld2html-bundle.js file */

// Filling map to avoid using global variables (aka window) or eval()
const available_templates = new Map;
available_templates.set("default_card", default_card);
if(typeof PromotionCards !== 'undefined'){
    available_templates.set("PromotionCards", PromotionCards);
}
if (typeof FlightReservationArray !== 'undefined') {
    available_templates.set("FlightReservationArray", FlightReservationArray);
}
if (typeof backgroundImage_default_card !== 'undefined') {
    available_templates.set("backgroundImage_default_card", backgroundImage_default_card);
}

// Mapping schema type to dedicated template file
const dedicatedTemplateFiles = new Map();
if(typeof PromotionCards !== 'undefined'){
    dedicatedTemplateFiles.set("artificial_PromotionCards","PromotionCards");
}
if (typeof FlightReservationArray !== 'undefined') {
    dedicatedTemplateFiles.set("artificial_FlightReservationArray","FlightReservationArray");
}
if (typeof backgroundImage_default_card !== 'undefined') {
    dedicatedTemplateFiles.set("NewsArticle","backgroundImage_default_card");
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
