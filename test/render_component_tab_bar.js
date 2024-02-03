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
const template_file_path = "../templates/component_tab_bar.html";
const schemas_dir_path = "schema_org/";

// loading the HTML mustache template
let template = fs.readFileSync(template_file_path).toString();

// Reading Schema.org Object (Json-ld Object) from schema_org
let data_object = fs.readFileSync(schemas_dir_path + "flight_multi_passenger.json");






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


let default_header = `<meta charSet="UTF-8"> 
    <title>cardWithTabs</title>
    <link rel="stylesheet" href="../../templates/default_card.css"> 
    <link rel="stylesheet" href="../../templates/component_tab_bar.css">
    <script src="https://kit.fontawesome.com/4f20261f74.js" crossorigin="anonymous">
    </script>
    <script>
        function openCard(evt, contentID) {
            // Declare all variables
            var i, tabcontent, tablinks;

            // Get all elements with class="tabcontent" and hide them
            tabcontent = document.getElementsByClassName("tabcontent");
            for (i = 0; i < tabcontent.length; i++) {
                tabcontent[i].style.display = "none";
            }

            // Get all elements with class="tablinks" and remove the class "active"
            tablinks = document.getElementsByClassName("tablinks");
            for (i = 0; i < tablinks.length; i++) {
                tablinks[i].className = tablinks[i].className.replace(" active", "");
            }

            // Show the current tab, and add an "active" class to the button that opened the tab
            document.getElementById(contentID).style.display = "flex";
            evt.currentTarget.className += " active";
        }
    </script>`;


// Header for building the HTML file

let html_content = "";



data_object = JSON.parse(data_object);


let obj = new Object();
obj["cardListElement"] = [];

// adding an id to the instances
let i = 0;
for (let ObjectElement of data_object) {
    ObjectElement["id"] = ObjectElement["@type"] + i;
    obj.cardListElement.push(ObjectElement);
        i++;
}



//arrayObject["cardListElement"] = [data_object[0],data_object[1]];

html_content = mustache.render(template,obj);



console.log(data_object);








let outputHTML = buildHtml(default_header, html_content);

var fileName = 'output/rendered_tab_bar.html';

saveFile(fileName,outputHTML);

function saveFile(_fileName,_dataString) {
    var stream = fs.createWriteStream(_fileName);
    stream.once('open', function (fd) {
        let html = _dataString;

        stream.end(html);
    })
}

