//Requirements
const Mustache = require('mustache');
const fs = require('fs');
const mustache = require("mustache");

/* Description :
Iterating through the schema_org folder,
for each schema found, it will render the data with mustache
into the the default_card.html file and saving the HTML file in the ouptput folder

 */


// Data Object used as trasnfer between data_object from jsonld file and the mustache template
function Card(_type, _pictureURL, _iconName = "image", _title, _content, _footer) {
    this.type = _type;
    this.pictureURL = _pictureURL;
    this.iconName = _iconName;
    this.title = _title;
    this.content = _content;
    this.footer = _footer;

}


function findNestedObj(entireObj, keyToFind, valToFind) {
    let foundObj;
    JSON.stringify(entireObj, (_, nestedValue) => {
        if (nestedValue && nestedValue[keyToFind] === valToFind) {
            foundObj = nestedValue;
        }
        return nestedValue;
    });
    return foundObj;
}



function buildHtml(_html_header_string, _html_content_string) {


    return '<!DOCTYPE html>'
        + '<html><head>' + _html_header_string + '</head><body>' + _html_content_string +  '</body></html>';
}


// Location of the Template and Location of Schema json-ld sample data
const template_file_path = "../templates/component_breadcrumblist.html";
const schemas_dir_path = "schema_org/";

// Header for building the HTML file
let default_header = '<meta charSet="UTF-8"> <title>default_tab_bar</title> <link rel="stylesheet" href="../../templates/component_breadcrumblist.css"> <script src="https://kit.fontawesome.com/4f20261f74.js" crossorigin="anonymous"></script>';

// loading the HTML mustache template
let template = fs.readFileSync(template_file_path).toString();

// Reading Schema.org Object (Json-ld Object) from schema_org
let data_object = fs.readFileSync(schemas_dir_path + "article_nytimes.com.json");
let html_content = "";

data_object = JSON.parse(data_object);





let breadcrumbListObj = new Object();


breadcrumbListObj = findNestedObj(data_object,"@type","BreadcrumbList")
console.log(breadcrumbListObj);




html_content = mustache.render(template,breadcrumbListObj);












let outputHTML = buildHtml(default_header, html_content);

var fileName = 'output/rendered_breadcrumblist.html';
var stream = fs.createWriteStream(fileName);
stream.once('open', function (fd) {
    let html = outputHTML;

    stream.end(html);
})

