/*
 * Exports all available templates to be used for rendering
 */

// Custom generic templates. Suitable for more than one type
//import cardDefaultBackgroundImage from '../templates/Default_background_image.html';
//import cardDefaultPlaceholder from '../templates/Default_placeholder.html';
//import cardDefaultSlim from '../templates/Default_slim.html';

// Custom generic sub templates. Suitable for more than one type
//import subDefaultArraySupport from '../templates/sub_Default_array_support.html';

// Custom templates for specific schema.org types
import cardFlightReservations from '../templates/FlightReservations.html';
import cardPromotionCards from '../templates/PromotionCards.html';

// Custom sub templates for specific JSON-LD types
import subArticle from '../templates/schema_org/sub_Article.html';
import subEmailMessage from '../templates/schema_org/sub_EmailMessage.html';
import subFoodEstablishmentReservation from '../templates/schema_org/sub_FoodEstablishmentReservation.html';
import subNewsArticle from '../templates/schema_org/sub_NewsArticle.html';
import subParcelDelivery from '../templates/schema_org/sub_ParcelDelivery.html';
import subPlace from '../templates/schema_org/sub_Place.html';
import subPromotionCards from '../templates/sub_PromotionCards.html';
import subRentalCarReservation from '../templates/schema_org/sub_RentalCarReservation.html';

/* --- Comment out templates above that you do not want to include in the jsonld2html-bundle.js file --- */



// Default template and sub template, supposed to be always present
import cardDefault from '../templates/Default.html';
import subDefault from '../templates/sub_Default.html';

// Mapping schema type to template file
const availableTemplates = new Map;
availableTemplates.set("https://ld2h/Default", cardDefault);
// Custom generic templates. Suitable for more than one type
if (typeof cardDefaultBackgroundImage !== 'undefined') {
    availableTemplates.set("NewsArticle", cardDefaultBackgroundImage);
}
if (typeof cardDefaultSlim !== 'undefined') {
    // No types yet
}
if (typeof cardDefaultPlaceholder !== 'undefined') {
    // No types yet
}
// Custom templates for specific schema.org types
if(typeof cardPromotionCards !== 'undefined'){
    availableTemplates.set("https://ld2h/PromotionCards", cardPromotionCards);
}
if (typeof cardFlightReservations !== 'undefined') {
    availableTemplates.set("https://ld2h/FlightReservations", cardFlightReservations);
}

// These are specific "sub templates"
// with these one can specify the rendering of the default_card for different schema types
const availableSubtemplates = new Map();
availableSubtemplates.set("https://ld2h/Default", subDefault);
if (typeof subPromotionCards !== 'undefined') {
    availableSubtemplates.set("https://ld2h/PromotionCards", subPromotionCards);
}
if (typeof subRentalCarReservation !== 'undefined') {
    availableSubtemplates.set("RentalCarReservation", subRentalCarReservation);
}
if (typeof subParcelDelivery !== 'undefined') {
    availableSubtemplates.set("ParcelDelivery", subParcelDelivery);
}
if (typeof subFoodEstablishmentReservation !== 'undefined') {
    availableSubtemplates.set("FoodEstablishmentReservation", subFoodEstablishmentReservation);
}
if (typeof subNewsArticle !== 'undefined') {
    availableSubtemplates.set("NewsArticle", subNewsArticle);
}
if (typeof subArticle !== 'undefined') {
    availableSubtemplates.set("Article", subArticle);
}
if (typeof subPlace !== 'undefined') {
    availableSubtemplates.set("Place", subPlace);
}
//if (typeof subDefaultArraySupport !== 'undefined') {
//    availableSubtemplates.set("???", subDefaultArraySupport);
//}
if (typeof subEmailMessage !== 'undefined') {
    availableSubtemplates.set("EmailMessage", subEmailMessage);
}

/* Edit above to in case you added your own templates. */

/* Check if dedicated subtempate is available */
export function hasDedicatedSubtemplate(type){
    let template = availableSubtemplates.get(type)
    return template != subDefault;
}

/*
 * Determine the correct subtemplate for a certain type.
 * Using https://ld2h/Default as fallback
 * */
export function getSubtemplate(type){
    if(availableSubtemplates.has(type)){
        return availableSubtemplates.get(type)
    } else {
        return availableSubtemplates.get("https://ld2h/Default");
    }
}

/* Determine correct template. */
export function getTemplate(type) {
    if(availableTemplates.has(type)){
        return availableTemplates.get(type)
    }
    return availableTemplates.get("https://ld2h/Default");
}
