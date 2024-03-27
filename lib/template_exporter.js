/*
 * Exports all available templates to be used for rendering
 */

// Default template and sub template, supposed to be always present.
// DO NOT COMMENT OUT
import cardDefault from '../templates/Default.html';
import subDefault from '../templates/sub_Default.html';

// Custom generic templates. Suitable for more than one type
//import cardDefaultBackgroundImage from '../templates/Default_background_image.html';
//import cardDefaultPlaceholder from '../templates/Default_placeholder.html';
//import cardDefaultSlim from '../templates/Default_slim.html';

// Custom generic subtemplates. Suitable for more than one type
//import subDefaultArraySupport from '../templates/sub_Default_array_support.html';

// Custom templates for specific schema.org types
import cardFlightReservations from '../templates/FlightReservations.html';
import cardPromotionCards from '../templates/PromotionCards.html';

// Custom subtemplates for specific JSON-LD types
import subArticle from '../templates/schema_org/sub_Article.html';
import subEmailMessage from '../templates/schema_org/sub_EmailMessage.html';
import subFoodEstablishmentReservation from '../templates/schema_org/sub_FoodEstablishmentReservation.html';
import subNewsArticle from '../templates/schema_org/sub_NewsArticle.html';
import subParcelDelivery from '../templates/schema_org/sub_ParcelDelivery.html';
import subPlace from '../templates/schema_org/sub_Place.html';
import subPromotionCards from '../templates/sub_PromotionCards.html';
import subRentalCarReservation from '../templates/schema_org/sub_RentalCarReservation.html';

// Available templates for exporting
export const allTemplates = {
    cardDefault,
//    cardDefaultBackgroundImage,
//    cardDefaultPlaceholder,
//    cardDefaultSlim,
//    subDefaultArraySupport,
    cardFlightReservations,
    cardPromotionCards
}

// Available subtemplates for exporting
export const allSubtemplates = {
    subDefault,
    subArticle,
    subEmailMessage,
    subFoodEstablishmentReservation,
    subNewsArticle,
    subParcelDelivery,
    subPlace,
    subPromotionCards,
    subRentalCarReservation
}

/* --- Comment out templates above that you do not want to include in the jsonld2html bundle --- */

/// Mapping schema type to template file
//   TODO provide function to build templates so leaving out templates works
//     programmatically with tree-shaking from users library
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


/// Mapping schema type to subtemplate file
const availableSubtemplates = new Map();
availableSubtemplates.set("https://ld2h/Default", subDefault);

// Custom generic sub templates. Suitable for more than one type
if (typeof subDefaultArraySupport !== 'undefined') {
    availableSubtemplates.set("???", subDefaultArraySupport);
}

// Custom subtemplates for specific JSON-LD types
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
if (typeof subEmailMessage !== 'undefined') {
    availableSubtemplates.set("EmailMessage", subEmailMessage);
}



/* Edit above in case you added your own templates. */



/**
 * Get subtemplate for a JSON-LD type. Use https://ld2h/Default as fallback.
 * The subtemplate is supposed to be as part of a template.
 *
 * @param {string} jsonLdType: @type of a JSON-LD
 * @returns {string} HTML mustache template
 */
export function getSubtemplateOfType(jsonLdType){
    if(availableSubtemplates.has(jsonLdType)){
        return availableSubtemplates.get(jsonLdType)
    } else {
        return availableSubtemplates.get("https://ld2h/Default");
    }
}

/**
 * Get template for a JSON-LD type. Use https://ld2h/Default as fallback.
 *
 * @param {string} jsonLdType: @type of a JSON-LD
 * @returns {string} HTML mustache template
 */
export function getTemplateOfType(jsonLdType) {
    if(availableTemplates.has(jsonLdType)){
        return availableTemplates.get(jsonLdType)
    }
    return availableTemplates.get("https://ld2h/Default");
}

/**
 * Set template for a JSON-LD type.
 * This will override mappings in case a mapping had already existed.
 *
 * @param {string} jsonLdType: @type of a JSON-LD
 * @param {object} template: mustache template to map to
 * @returns {Map} Map containing all template mappings
 */
export function setTemplateOfType(jsonLdType, template) {
    availableTemplates.set(jsonLdType, template);
}

/**
 * Set subtemplate for a JSON-LD type.
 * This will override mappings in case a mapping had already existed.
 *
 * @param {string} jsonLdType: @type of a JSON-LD
 * @param {object} template: mustache template to map to
 * @returns {Map} Map containing all subtemplate mappings
 */
export function setSubtemplateOfType(jsonLdType, template) {
    availableSubtemplates.set(jsonLdType, template);
}
