

//Requirements
const Mustache = require('mustache');
const fs = require('fs');


// ===== INPUT ======

// location of the promo card template
const promotion_card_template_file_path = "../templates/component_email_promotion.html";
// location of the default_card_template
const card_container_path = "../templates/promotion_card.html";
const schemas_dir_path = "schema_org/";
const file = schemas_dir_path + "promotionCard_google.com.json";

// ===== OUTPUT =====

var outputFileNameComponent = 'output/rendered_component_email_promotion.html';
var outputFileNameFinishedCard = 'output/rendered_promotion_card.html';


// ===== File Reading =====

// loading the HTML mustache template
let promotion_card_template = fs.readFileSync(promotion_card_template_file_path).toString();
// Reading Schema.org Object (Json-ld Object) from schema_org
let readInJson = fs.readFileSync(file);
// reading the target card template
let cardContainer_template = fs.readFileSync(card_container_path).toString();

let default_header = `
    <meta charSet="UTF-8"> 
    <title>promoTabs</title>
    <link rel="stylesheet" href="../../templates/default_card.css"> 
    <link rel="stylesheet" href="../../templates/component_email_promotion.css">
    <script src="https://kit.fontawesome.com/4f20261f74.js" crossorigin="anonymous">
    </script>`;



// Data Object used as trasnfer between data_object from jsonld file and the mustache template
function promoCard(_image,_headline,_discountValue,_price,_priceCurrency) {
    this.image = _image;
    this.headline = _headline;
    this.discountValue = _discountValue;
    this.newPrice = getCurrencyChar(_priceCurrency) + String(_price - _discountValue);
    this.oldPrice = getCurrencyChar(_priceCurrency) + String(_price) ;
    this.priceCurrency = _priceCurrency;
    return this;
}

function getCurrencyChar(_symbol){
    if(_symbol === "USD"){
        return "$";
    }
    else {return _symbol;}

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

function findNestedObjectsWithVal(entireObj, keyToFind, valToFind) {
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






data_object = JSON.parse(readInJson);

let html_content = "";

let mustacheDataObj = new Object();
mustacheDataObj["promotionCards"] = [];
mustacheDataObj["logo"] = findNestedObjWithKey(data_object,"logo");
mustacheDataObj["subjectLine"] = findNestedObjWithKey(data_object,"subjectLine");
mustacheDataObj["description"] = findNestedObjWithKey(data_object,"description");
mustacheDataObj["discountCode"] = findNestedObjWithKey(data_object,"discountCode");


let foundObjects= findNestedObjectsWithVal(data_object,"@type","PromotionCard");

// render the promo cards
for (const obj of foundObjects) {
    let promoCardObj = promoCard(
        obj["image"],
        obj["headline"],
        obj["discountValue"],
        obj["price"],
        obj["priceCurrency"]);
    mustacheDataObj["promotionCards"].push(Mustache.render(promotion_card_template,promoCardObj))

}



let finalCard = Mustache.render(cardContainer_template, mustacheDataObj);
console.log(finalCard);




let outputHTML = buildHtml(default_header, finalCard);


saveFile(outputFileNameComponent, mustacheDataObj["promotionCards"].toString());
saveFile(outputFileNameFinishedCard,outputHTML);

function saveFile(_fileName,_dataString) {
    var stream = fs.createWriteStream(_fileName);
    stream.once('open', function (fd) {
        let html = _dataString;

        stream.end(html);
    })
}

