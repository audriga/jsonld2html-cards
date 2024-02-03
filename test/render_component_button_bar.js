/* Description :
Iterating through the schema_org folder,
for each schema found, it will render the data with mustache
into the the default_card.html file and saving the HTML file in the ouptput folder
 */

//Requirements
const Mustache = require('mustache');
const fs = require('fs');
const mustache = require("mustache");




// Location of the Template and Location of Schema json-ld sample data
const template_file_path = "../templates/component_button_bar.html";
const schemas_dir_path = "schema_org/";

// loading the HTML mustache template
let template = fs.readFileSync(template_file_path).toString();

// Reading Schema.org Object (Json-ld Object) from schema_org
let data_object = fs.readFileSync(schemas_dir_path + "flight_all_google_fields.json");






// Data Object used as trasnfer between data_object from jsonld file and the mustache template
function Card(_type, _pictureURL, _iconName = "image", _title, _content, _footer) {
    this.type = _type;
    this.pictureURL = _pictureURL;
    this.iconName = _iconName;
    this.title = _title;
    this.content = _content;
    this.footer = _footer;

}


function findNestedObjWithVal(entireObj, keyToFind, valToFind) {
    let foundObj= [];
    JSON.stringify(entireObj, (_, nestedValue) => {
        if (nestedValue && nestedValue[keyToFind] === valToFind)  {
            foundObj.push(nestedValue);
        }
        return nestedValue;
    });
    if(foundObj.length >= 1){
        return foundObj;
    }
    else return null;

}

function findNestedObjWithKey(entireObj, keyToFind) {
    let foundObj;
    JSON.stringify(entireObj, (_, nestedValue) => {
        if (nestedValue && nestedValue[keyToFind]){
            foundObj = (nestedValue[keyToFind]);
        }
        return nestedValue;
    });
    return foundObj;
}




function buildHtml(_html_header_string, _html_content_string) {


    return '<!DOCTYPE html>'
        + '<html><head>' + _html_header_string + '</head><body>' + _html_content_string +  '</body></html>';
}





// Header for building the HTML file
let default_header = '<meta charSet="UTF-8"> <title>default_cards</title> <link rel="stylesheet" href="../../templates/component_tab_bar.css"> <script src="https://kit.fontawesome.com/4f20261f74.js" crossorigin="anonymous"></script><script>\n' +
    '        function openCard(evt, cityName) {\n' +
    '            // Declare all variables\n' +
    '            var i, tabcontent, tablinks;\n' +
    '\n' +
    '            // Get all elements with class="tabcontent" and hide them\n' +
    '            tabcontent = document.getElementsByClassName("tabcontent");\n' +
    '            for (i = 0; i < tabcontent.length; i++) {\n' +
    '                tabcontent[i].style.display = "none";\n' +
    '            }\n' +
    '\n' +
    '            // Get all elements with class="tablinks" and remove the class "active"\n' +
    '            tablinks = document.getElementsByClassName("tablinks");\n' +
    '            for (i = 0; i < tablinks.length; i++) {\n' +
    '                tablinks[i].className = tablinks[i].className.replace(" active", "");\n' +
    '            }\n' +
    '\n' +
    '            // Show the current tab, and add an "active" class to the button that opened the tab\n' +
    '            document.getElementById(cityName).style.display = "block";\n' +
    '            evt.currentTarget.className += " active";\n' +
    '        }\n' +
    '    </script>';





let html_content = "";



data_object = JSON.parse(data_object);

obj = new Object();
obj["potentialAction"] = findNestedObjWithKey(data_object,"potentialAction");

console.log(obj);



html_content = mustache.render(template,obj);












let outputHTML = buildHtml(default_header, html_content);

var fileName = 'output/rendered_button_bar.html';
var stream = fs.createWriteStream(fileName);
stream.once('open', function (fd) {
    let html = outputHTML;

    stream.end(html);
})

