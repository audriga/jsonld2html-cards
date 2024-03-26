/*!
 * Exports all available templates to be used for rendering
 */

// base templates
import defaultCard from '../templates/default_card.html';
//import backgroundImageDefaultCard from '../templates/background_image_card.html'

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
const defaultCardSubtemplatesMap = new Map();
defaultCardSubtemplatesMap.set("RentalCarReservation",RentalCarReservation);
defaultCardSubtemplatesMap.set("ParcelDelivery",ParcelDelivery);
defaultCardSubtemplatesMap.set("FoodEstablishmentReservation",FoodEstablishmentReservation);
defaultCardSubtemplatesMap.set("NewsArticle",NewsArticle);
defaultCardSubtemplatesMap.set("Article",Article);
defaultCardSubtemplatesMap.set("Place",Place);
defaultCardSubtemplatesMap.set("Fallback",Fallback);

// These are subtemplates for dedicated templates
const dedicatedSubtemplatesMap = new Map();
dedicatedSubtemplatesMap.set("artificial_PromotionCards", PromotionCardsInner);

export function getDefaultCardSubtemplate(type){
    if(defaultCardSubtemplatesMap.has(type)){
        return defaultCardSubtemplatesMap.get(type);
    }
    else if(defaultCardSubtemplatesMap.has("Fallback")){
        return defaultCardSubtemplatesMap.has("Fallback")
    }
    //FIXME
    return "";
}

export function hasDefaultCardSubtemplate (type){
    if(defaultCardSubtemplatesMap.has(type)){
        return true;
    }
    else return false;
}

export function hasDedicatedSubtemplate(type){
    if(dedicatedSubtemplatesMap.has(type)){
        return true;
    }else return false;
}

export function getDedicatedSubtemplate(type){
    if(dedicatedSubtemplatesMap.has(type)){
        return dedicatedSubtemplatesMap.get(type);
    }
}
/* Comment out templates above that you do not want to include in the jsonld2html-bundle.js file */

// Filling map to avoid using global variables (aka window) or eval()
const availableTemplates = new Map;
availableTemplates.set("default_card", defaultCard);
if(typeof PromotionCards !== 'undefined'){
    availableTemplates.set("PromotionCards", PromotionCards);
}
if (typeof FlightReservationArray !== 'undefined') {
    availableTemplates.set("FlightReservationArray", FlightReservationArray);
}
if (typeof backgroundImageDefaultCard !== 'undefined') {
    availableTemplates.set("backgroundImage_default_card", backgroundImageDefaultCard);
}

// Mapping schema type to dedicated template file
const dedicatedTemplateFiles = new Map();
if(typeof PromotionCards !== 'undefined'){
    dedicatedTemplateFiles.set("artificial_PromotionCards","PromotionCards");
}
if (typeof FlightReservationArray !== 'undefined') {
    dedicatedTemplateFiles.set("artificial_FlightReservationArray","FlightReservationArray");
}
if (typeof backgroundImageDefaultCard !== 'undefined') {
    dedicatedTemplateFiles.set("NewsArticle","backgroundImage_default_card");
}

/* Edit above to in case you added your own templates. */

export default function getTemplate(type) {
    // loading the HTML mustache template
    // Use dedicated template for certain types only
    if(dedicatedTemplateFiles.has(type)) {
        let templateName = dedicatedTemplateFiles.get(type);
        return availableTemplates.get(templateName);
    }
    return availableTemplates.get("default_card");
}
