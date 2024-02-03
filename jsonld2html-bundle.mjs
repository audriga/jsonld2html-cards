import mustache from 'mustache';

const template$1 = `
<div class="smlCard">
<div class = "header">
    {{^breadcrumbList.itemListElement}} {{type}}   {{#iconName}}<i class="fa-solid fa-{{iconName}} fa-1x" ></i>{{/iconName}}  {{/breadcrumbList.itemListElement}}
    <ul class="breadcrumb">
        {{#breadcrumbList.itemListElement}}<li><a href= {{item.id}} >{{item.name}}</a></li>{{/breadcrumbList.itemListElement}}
    </ul>


</div>
<div class="smlCardRow">
    <div class="image_column">

        <!-- If Picture is empty render the i frame with the iconName-->
        {{#pictureURL}}<img src="{{&pictureURL}}">{{/pictureURL}}
        <!-- If Picture is empty list, false or key doesnt exist render the i frame with the iconName -->
        {{^pictureURL}}<i class="fa-solid fa-{{iconName}} fa-6x" ></i>{{/pictureURL}}

    </div>

    <div class ="text_column">

        <h1 class="card_title"> {{title}}

        </h1>
        <p class="card_content">{{content}}
        </p>

        <div class="card_footnote">{{footer}}
        </div>


    </div>

</div>

    <div class="footer">
        {{#potentialAction}}<button type="button" class="actionButton" onclick="window.open('{{target}}', '_blank');">{{@type}}</button>{{/potentialAction}}

    </div>


</div>

<br>
<div class ="imageErrorMessage" id = "{{errorId}}"></div>
<br>
`;

const template = `
<table cellpadding="32">
    <tbody>
    <tr>
        <td>The user is out-of-office from {{ start }} till {{ end }}. Mails will {{#isForwarded}}{{/isForwarded}}{{^isForwarded}}not {{/isForwarded}}be forwarded.</td>
    </tr>
    <tr>
        <td>During absence, contact {{replacement.0.name}} ({{replacement.0.email}} / {{replacement.0.phone}}) for {{replacement.0.topic}} or {{replacement.1.name}} ({{replacement.1.email}} / {{replacement.1.phone}}) for {{replacement.1.topic}}.</td>
    </tr>
    </tbody>
    </table>
`;

/*!
 * Exports all available templates to be used for rendering
 */


/* Comment out templates above that you do not want to include in the jsonld2html-bundle.js file */

// Filling map to avoid using global variables (aka window) or eval()
const available_templates = new Map;
available_templates.set("default_card", template$1);
{
    available_templates.set("oof", template);
}

// Mapping schema type to dedicated template file
// TODO fill with sensible key-values
const dedicatedTemplateFiles = new Map();
{
    dedicatedTemplateFiles.set("OutOfOffice","oof");
}

/* Edit above to in case you added your own templates. */

function getTemplate(type) {
    // loading the HTML mustache template
    // Use dedicated template for certain types only
    if(dedicatedTemplateFiles.has(type)) {
        template_name = dedicatedTemplateFiles.get(type);
        return available_templates.get(template_name);
    }
    return available_templates.get("default_card");
}

/*!
 * Renders JSON-LD as HTML
 */

/**
 * Data Object used as transfer between data_object from jsonld file and the mustache template
 */
function Card(_type, _pictureURL, _iconName="image",_title, _content, _footer, _breadcrumbList){
    this.type = _type;
    this.pictureURL = _pictureURL;
    this.iconName = _iconName;
    this.title = _title;
    this.content = _content;
    this.footer = _footer;
    this.breadcrumbList = _breadcrumbList;
}

var jsonld2html = {
    name: 'jsonld2html.js',
    version: '0.0.1'
};

// Mapping the fallback icon to schema type
const typeToIconMap = new Map();
typeToIconMap.set("NewsArticle","newspaper");
typeToIconMap.set("Article","comment");
typeToIconMap.set("MusicAlbum","compact-disc");
typeToIconMap.set("MusicRecording","music");
typeToIconMap.set("BusReservation","bus");

/**
 * @param {object} entireObj - Object to search
 * @þaram {string} keyToFind - the Key to search for a value
 * @return {string} if a key exists the value of the key will returned
 */
function findValueFromKey(entireObj, keyToFind) {
    let foundValue;

    for (let keysKey of Object.keys(entireObj)) {
        if (keysKey !== keyToFind) {
            continue;
        }
        foundValue = (entireObj[keysKey]);
    }
    return foundValue;
}

/**
 * finds Key Values in deep nests and returns the object, depth is not restricted !
 */
function findNestedObj(entireObj, keyToFind) {
    let foundObj;
    JSON.stringify(entireObj, (_, nestedValue) => {
        if (nestedValue && nestedValue[keyToFind]){
            foundObj = nestedValue;
        }
        return nestedValue;
    });
    if(foundObj != undefined) {return foundObj;}
    else return null;
}

/**
 * this function is used to find objects inside a specific
 * it returns the object in which to key and val matching
 */
function findNestedObjWithValue(entireObj, keyToFind, valToFind) {
    let foundObj;
    JSON.stringify(entireObj, (_, nestedValue) => {
        if (nestedValue && nestedValue[keyToFind] === valToFind) {
            foundObj = nestedValue;
        }
        return nestedValue;
    });
    return foundObj;
}

function renderFromTemplate(jsonLd, template) {
    let temp_card_obj = new Card();
    temp_card_obj.type = findValueFromKey(jsonLd,"@type");

    if(typeToIconMap.has(temp_card_obj.type)) {
        temp_card_obj.iconName = typeToIconMap.get(temp_card_obj.type);
    }

    let logo_object = findNestedObj(jsonLd, "logo");
    if(logo_object != null) {
        temp_card_obj.pictureURL = logo_object.logo;
    }

    let image_object = findNestedObj(jsonLd,"image");
    if(image_object != null) {
        temp_card_obj.pictureURL = image_object.image;
    }

    let title_object = findNestedObj(jsonLd,"name");
    if(title_object != null){
        temp_card_obj.title = title_object.name;
    }

    let description_object = findNestedObj(jsonLd, "description");
    if(description_object != null){
        temp_card_obj.content = description_object.description;
    }

    let article_body_object = findNestedObj(jsonLd, "articleBody");
    if(description_object != null && article_body_object != null) {
        temp_card_obj.content = article_body_object.articleBody;
    }

    // items can be nested or not! the template uses the nested items
    // finds objects inside a specific key/value object
    let breadcrumbList_object = findNestedObjWithValue(jsonLd,"@type","BreadcrumbList");
    if(breadcrumbList_object != null){
        temp_card_obj.breadcrumbList = breadcrumbList_object;

    }

    let action_object = findNestedObj(jsonLd,"potentialAction");
    if(action_object!= null){
        temp_card_obj.potentialAction = action_object.potentialAction;
    }

    // render the template with data
    return mustache.render(template, temp_card_obj);
}

jsonld2html.render = function render(jsonLd) {
    return renderFromTemplate(jsonLd, getTemplate(findValueFromKey(jsonLd,"@type")));
};

jsonld2html.renderFromTemplate = renderFromTemplate;

export { jsonld2html as default };
