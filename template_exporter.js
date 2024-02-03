/*!
 * Exports all available templates to be used for rendering
 */

// TODO Maybe do that programmatically by using webpack with html-loader plugin or rollup with rollup-plugin-html / @web/rollup-plugin-html
import default_card from './templates/default_card.html.js';
import oof from './templates/oof.html.js';

/* Comment out templates above that you do not want to include in the jsonld2html-bundle.js file */

// Filling map to avoid using global variables (aka window) or eval()
const available_templates = new Map;
available_templates.set("default_card", default_card);
if (typeof oof !== 'undefined') {
    available_templates.set("oof", oof);
}

// Mapping schema type to dedicated template file
// TODO fill with sensible key-values
const dedicatedTemplateFiles = new Map();
if (typeof oof !== 'undefined') {
    dedicatedTemplateFiles.set("OutOfOffice","oof");
}

/* Edit above to in case you added your own templates. */

export default function getTemplate(type) {
    // loading the HTML mustache template
    // Use dedicated template for certain types only
    if(dedicatedTemplateFiles.has(type)) {
        template_name = dedicatedTemplateFiles.get(type);
        return available_templates.get(template_name);
    }
    return available_templates.get("default_card");
}
