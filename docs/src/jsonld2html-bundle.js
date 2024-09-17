(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('mustache')) :
    typeof define === 'function' && define.amd ? define(['mustache'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Jsonld2html = factory(global.Mustache));
})(this, (function (mustache) { 'use strict';

    // The purpose of this module is to determine the main schema type of the given input
    // This main schema type is needed to identify its corresponding template

    function findObjectWithKey(jsonLd, key){
        if(key in jsonLd){
            return jsonLd;
        }
        else if(Array.isArray(jsonLd)){
            for (const jsonLdObject of jsonLd) {
                if(key in jsonLdObject){
                    return jsonLdObject
                }
            }
        }
    }

    /**
     * Transform each array property of a JSON object into its first element.
     * This is because each JSON-LD property may be an array or not.
     * @param object jsonObject - original JSON object
     * @return object JSON object with no more arrays as values
     */
    function transformArrayProperties(jsonObject) {
        for (const key in jsonObject) {
            if (Array.isArray(jsonObject[key])) {
                jsonObject[key] = jsonObject[key][0];
            }
        }
        return jsonObject;
    }

    function getMainEntity(jsonLd){
        if(Array.isArray(jsonLd))
        {   
            let possibleMainEntity = findObjectWithKey(jsonLd,"mainEntityOfPage");
            if(possibleMainEntity != null)
            {
                return possibleMainEntity;
            }
            else return jsonLd[0];
        }
        else if(jsonLd["@graph"] != null
            && jsonLd["@graph"] !== undefined
            && Array.isArray(jsonLd["@graph"]))
        {   
            let possibleGraph = jsonLd["@graph"];
            let possibleMainEntity = getMainEntity(possibleGraph);
            
            return possibleMainEntity;
        }
        else return jsonLd;
    }

    // This function extracts a "usable" image from the different cases of a json-ld
    //  into the thumbnail or thumbnailUrl property

    function extractImage(json_object){

        // first check for the thumbnailUrl property
        if(json_object["thumbnailUrl"] !== undefined)          
        {   
            // case single item, no array
            if(!Array.isArray(json_object["thumbnailUrl"]) &&
                typeof json_object["thumbnailUrl"] === 'string')
            {
                return json_object;
            }
            // case array
            else
            {   
                // take the first element
                if(json_object["thumbnailUrl"][0] !== undefined && typeof json_object["thumbnailUrl"][0] === 'string')
                {
                    json_object["thumbnailUrl"] = json_object["thumbnailUrl"][0];
                    return json_object;
                }
            }
        }
        // second check for the thumbnail property
        if(json_object["thumbnail"] !== undefined)
        {   
            // case single item, no array
            if(!Array.isArray(json_object["thumbnail"]) &&
                typeof json_object["thumbnail"] === 'string')
            {
                return json_object;
            }
            // case array
            else
            {   
                // take the first element
                if(json_object["thumbnail"][0] !== undefined && typeof json_object["thumbnail"][0] === 'string')
                {
                    json_object["thumbnail"] = json_object["thumbnail"][0];
                    return json_object;
                }
            }
        }
        // second check for the image property
        if(json_object["image"] !== undefined)
        {   
            // case url value directly behind the image key
            if(typeof json_object["image"] === "string")
            {
       
                json_object["thumbnailUrl"] = json_object["image"];
                return json_object;
                
            }
            // case array
            else if(Array.isArray(json_object["image"]))
            {
                // case array of string "urls"
                if(json_object["image"][0] !== undefined &&
                        typeof json_object["image"][0] === 'string')
                {
            
                    json_object["thumbnailUrl"] = json_object["image"][0];
                    return json_object;
                    
                }
                // case array of "imageObjects"
                // take first element for now
                if(json_object["image"][0] !== undefined &&
                        typeof json_object["image"][0] === 'object')
                {
                    if(json_object["image"][0]["url"] !== undefined &&
                        typeof json_object["image"][0]["url"] === 'string')
                    {
                        // take first element for now
                        json_object["thumbnailUrl"] = json_object["image"][0]["url"];
                        return json_object;
                    }
                }
                
            }
            // case "object" - caution an array is also of type object! So check that before
            else if(typeof json_object["image"] === 'object')
            {
                if(json_object["image"]["url"] !== undefined &&
                        typeof json_object["image"]["url"] === 'string')
                {
                    
                    json_object["thumbnailUrl"] = json_object["image"]["url"];
                    return json_object;
                    
                }
                 // case base64
                else if(json_object["image"]["contentUrl"] !== undefined &&
                        typeof json_object["image"]["contentUrl"] === 'string')
                {
                    json_object["thumbnail"] = json_object["image"]["contentUrl"];
                    return json_object;
                }
            }
            
        }
        // If nothing happened return json_object
        return json_object;
    }

    // This function creates an "artificial" view Action object if there is none given.
    // To do so it takes the URL of a possible given mainEntityOfPage and creates a view Action
    // Object with that.

    function createPotentialViewAction(json_object){
        if(json_object["@type"] !== undefined &&
                json_object["potentialAction"] === undefined)
        {
            // TODO validate what happens if json_object["mainEntityOfPage"] is not set
            let possibleMainEntityOfPage = json_object["mainEntityOfPage"];
            if(possibleMainEntityOfPage !== undefined && possibleMainEntityOfPage !== null)
            {    
                let urlOfMainPage;
                if(typeof possibleMainEntityOfPage === 'string')
                {
                    urlOfMainPage = possibleMainEntityOfPage;
                }
                if(possibleMainEntityOfPage["@id"] !== undefined &&
                            typeof possibleMainEntityOfPage["@id"] === 'string')
                {
                    urlOfMainPage = possibleMainEntityOfPage["@id"];
                }
                if(typeof urlOfMainPage === 'string' &&
                            urlOfMainPage !== undefined &&
                            urlOfMainPage !== null)
                {
                    let viewActionObject = 
                    {
                        "@type": "ViewAction",
                        "target": urlOfMainPage
                    };
                    json_object["potentialAction"] = viewActionObject;
                }
                return json_object
            }
            else
            {
                return json_object;     
            }
        }
        else
        {
            return json_object;
        }
    }

    var headerIconTemplate$4 = "<i class='fa-solid fa-{{iconName}} fa-1x'></i>";
    var imageIconTemplate$4 = "<i class='fa-solid fa-{{iconName}} fa-5x'></i>";
    var transportIconTemplate$4 = "<i class='fa-solid fa-{{iconName}} fa-3x ld2hTransIcon'></i>";
    var iconMap$3 = {
    	Article: "comment",
    	AudioObject: "music",
    	Book: "book",
    	BusinessEvent: "business-time",
    	BusReservation: "bus",
    	City: "city",
    	CreativeWork: "paintbrush",
    	EmailMessage: "envelope",
    	Event: "calendar",
    	EventReservation: "calendar",
    	FoodEstablishmentReservation: "utensils",
    	FlightReservation: "plane",
    	Invoice: "file-invoice-dollar",
    	Movie: "video",
    	MusicAlbum: "music",
    	MusicGroup: "music",
    	MusicRecording: "music",
    	NewsArticle: "newspaper",
    	NewsMediaOrganization: "newspaper",
    	Order: "truck",
    	ParcelDelivery: "truck",
    	Person: "person",
    	Place: "location-dot",
    	PodcastSeries: "podcast",
    	Product: "cart-shopping",
    	ProfilePage: "user",
    	Recipe: "utensils",
    	RentalCarReservation: "car-side",
    	SoftwareApplication: "code",
    	TVSeries: "tv",
    	TrainReservation: "train",
    	WebSite: "globe",
    	Webpage: "globe",
    	"https://ld2h/Default": "image",
    	"https://ld2h/EventReservations": "calendar",
    	"https://ld2h/FlightReservations": "plane",
    	"https://ld2h/TrainReservations": "train",
    	"https://ld2h/BusReservations": "bus"
    };
    var fontAwesome = {
    	headerIconTemplate: headerIconTemplate$4,
    	imageIconTemplate: imageIconTemplate$4,
    	transportIconTemplate: transportIconTemplate$4,
    	iconMap: iconMap$3
    };

    var headerIconTemplate$3 = "<span style='vertical-align: sub;font-size: 20px;' class='material-icons'>{{iconName}}</span>";
    var imageIconTemplate$3 = "<span style='vertical-align: middle;font-size: 100px;' class='material-icons'>{{iconName}}</span>";
    var transportIconTemplate$3 = "<span style='vertical-align: middle;font-size: 60px;' class='material-icons ld2hTransIcon'>{{iconName}}</span>";
    var iconMap$2 = {
    	Article: "news",
    	BusReservation: "directions_bus",
    	EmailMessage: "mail",
    	FoodEstablishmentReservation: "restaurant",
    	FlightReservation: "flight",
    	Movie: "videocam",
    	MusicRecording: "music_note",
    	NewsArticle: "newspaper",
    	TVSeries: "live_tv",
    	TrainReservation: "train",
    	"https://ld2h/Default": "add_photo_alternate",
    	"https://ld2h/FlightReservations": "flight",
    	"https://ld2h/TrainReservations": "train",
    	"https://ld2h/BusReservations": "directions_bus"
    };
    var materiaDesignIcons = {
    	headerIconTemplate: headerIconTemplate$3,
    	imageIconTemplate: imageIconTemplate$3,
    	transportIconTemplate: transportIconTemplate$3,
    	iconMap: iconMap$2
    };

    var headerIconTemplate$2 = "<span style='vertical-align: sub;font-size: 20px;' class='material-symbols-outlined'>{{iconName}}</span>";
    var imageIconTemplate$2 = "<span style='vertical-align: middle;font-size: 100px;' class='material-symbols-outlined'>{{iconName}}</span>";
    var transportIconTemplate$2 = "<span style='vertical-align: middle;font-size: 60px;' class='material-icons ld2hTransIcon'>{{iconName}}</span>";
    var iconMap$1 = {
    	Article: "news",
    	BusReservation: "directions_bus",
    	EmailMessage: "mail",
    	FoodEstablishmentReservation: "restaurant",
    	FlightReservation: "flight",
    	Movie: "videocam",
    	MusicRecording: "music_note",
    	NewsArticle: "newspaper",
    	TVSeries: "live_tv",
    	TrainReservation: "train",
    	"https://ld2h/Default": "add_photo_alternate",
    	"https://ld2h/FlightReservations": "flight",
    	"https://ld2h/TrainReservations": "train",
    	"https://ld2h/BusReservations": "directions_bus"
    };
    var materialDesignSymbols = {
    	headerIconTemplate: headerIconTemplate$2,
    	imageIconTemplate: imageIconTemplate$2,
    	transportIconTemplate: transportIconTemplate$2,
    	iconMap: iconMap$1
    };

    var headerIconTemplate$1 = "<svg class='material-design-icon__svg' style='width:20px;height:20px;margin-top:-3px;margin-bottom: -4px;' viewBox='0 0 24 24'> <path d='{{iconName}}'> </path> </svg>";
    var imageIconTemplate$1 = "<svg class='material-design-icon__svg' style='width:98px;height:98px;' viewBox='0 0 24 24'> <path d='{{iconName}}'> </path> </svg>";
    var transportIconTemplate$1 = "<svg class='material-design-icon__svg ld2hTransIcon__NextCloud' style='width:48px;height:48px;' viewBox='0 0 24 24'> <path d='{{iconName}}'> </path> </svg>";
    var iconMap = {
    	Article: "M20 5L20 19L4 19L4 5H20M20 3H4C2.89 3 2 3.89 2 5V19C2 20.11 2.89 21 4 21H20C21.11 21 22 20.11 22 19V5C22 3.89 21.11 3 20 3M18 15H6V17H18V15M10 7H6V13H10V7M12 9H18V7H12V9M18 11H12V13H18V11Z",
    	BusReservation: "M18,11H6V6H18M16.5,17A1.5,1.5 0 0,1 15,15.5A1.5,1.5 0 0,1 16.5,14A1.5,1.5 0 0,1 18,15.5A1.5,1.5 0 0,1 16.5,17M7.5,17A1.5,1.5 0 0,1 6,15.5A1.5,1.5 0 0,1 7.5,14A1.5,1.5 0 0,1 9,15.5A1.5,1.5 0 0,1 7.5,17M4,16C4,16.88 4.39,17.67 5,18.22V20A1,1 0 0,0 6,21H7A1,1 0 0,0 8,20V19H16V20A1,1 0 0,0 17,21H18A1,1 0 0,0 19,20V18.22C19.61,17.67 20,16.88 20,16V6C20,2.5 16.42,2 12,2C7.58,2 4,2.5 4,6V16Z",
    	EmailMessage: "M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z",
    	FlightReservation: "M20.56 3.91C21.15 4.5 21.15 5.45 20.56 6.03L16.67 9.92L18.79 19.11L17.38 20.53L13.5 13.1L9.6 17L9.96 19.47L8.89 20.53L7.13 17.35L3.94 15.58L5 14.5L7.5 14.87L11.37 11L3.94 7.09L5.36 5.68L14.55 7.8L18.44 3.91C19 3.33 20 3.33 20.56 3.91Z",
    	FoodEstablishmentReservation: "M3,3A1,1 0 0,0 2,4V8L2,9.5C2,11.19 3.03,12.63 4.5,13.22V19.5A1.5,1.5 0 0,0 6,21A1.5,1.5 0 0,0 7.5,19.5V13.22C8.97,12.63 10,11.19 10,9.5V8L10,4A1,1 0 0,0 9,3A1,1 0 0,0 8,4V8A0.5,0.5 0 0,1 7.5,8.5A0.5,0.5 0 0,1 7,8V4A1,1 0 0,0 6,3A1,1 0 0,0 5,4V8A0.5,0.5 0 0,1 4.5,8.5A0.5,0.5 0 0,1 4,8V4A1,1 0 0,0 3,3M19.88,3C19.75,3 19.62,3.09 19.5,3.16L16,5.25V9H12V11H13L14,21H20L21,11H22V9H18V6.34L20.5,4.84C21,4.56 21.13,4 20.84,3.5C20.63,3.14 20.26,2.95 19.88,3Z",
    	Movie: "M14.75 7.46L12 3.93L13.97 3.54L16.71 7.07L14.75 7.46M21.62 6.1L20.84 2.18L16.91 2.96L19.65 6.5L21.62 6.1M4.16 5.5L3.18 5.69C2.1 5.91 1.4 6.96 1.61 8.04L2 10L6.9 9.03L4.16 5.5M11.81 8.05L9.07 4.5L7.1 4.91L9.85 8.44L11.81 8.05M2 10V20C2 21.11 2.9 22 4 22H13.81C13.3 21.12 13 20.1 13 19C13 15.69 15.69 13 19 13C20.1 13 21.12 13.3 22 13.81V10H2M17 22L22 19L17 16V22Z",
    	MusicRecording: "M21,3V15.5A3.5,3.5 0 0,1 17.5,19A3.5,3.5 0 0,1 14,15.5A3.5,3.5 0 0,1 17.5,12C18.04,12 18.55,12.12 19,12.34V6.47L9,8.6V17.5A3.5,3.5 0 0,1 5.5,21A3.5,3.5 0 0,1 2,17.5A3.5,3.5 0 0,1 5.5,14C6.04,14 6.55,14.12 7,14.34V6L21,3Z",
    	NewsArticle: "M20 5L20 19L4 19L4 5H20M20 3H4C2.89 3 2 3.89 2 5V19C2 20.11 2.89 21 4 21H20C21.11 21 22 20.11 22 19V5C22 3.89 21.11 3 20 3M18 15H6V17H18V15M10 7H6V13H10V7M12 9H18V7H12V9M18 11H12V13H18V11Z",
    	TVSeries: "M9 20C9 17.44 10.87 12.42 13.86 7.25C14.29 6.5 15.08 6 16 6C17.12 6 18 6.88 18 8V20H20V8C20 5.8 18.2 4 16 4C14.34 4 12.9 4.92 12.13 6.25C10.56 8.96 9.61 11.15 9 13.03V6.5C9 5.13 7.87 4 6.5 4C5.13 4 4 5.13 4 6.5C4 7.87 5.13 9 6.5 9C6.67 9 6.84 9 7 8.95V20M6.5 6C6.79 6 7 6.21 7 6.5C7 6.79 6.79 7 6.5 7C6.21 7 6 6.79 6 6.5C6 6.21 6.21 6 6.5 6Z",
    	TrainReservation: "M12,2C8,2 4,2.5 4,6V15.5A3.5,3.5 0 0,0 7.5,19L6,20.5V21H8.23L10.23,19H14L16,21H18V20.5L16.5,19A3.5,3.5 0 0,0 20,15.5V6C20,2.5 16.42,2 12,2M7.5,17A1.5,1.5 0 0,1 6,15.5A1.5,1.5 0 0,1 7.5,14A1.5,1.5 0 0,1 9,15.5A1.5,1.5 0 0,1 7.5,17M11,10H6V6H11V10M13,10V6H18V10H13M16.5,17A1.5,1.5 0 0,1 15,15.5A1.5,1.5 0 0,1 16.5,14A1.5,1.5 0 0,1 18,15.5A1.5,1.5 0 0,1 16.5,17Z",
    	"https://ld2h/BusReservations": "M18,11H6V6H18M16.5,17A1.5,1.5 0 0,1 15,15.5A1.5,1.5 0 0,1 16.5,14A1.5,1.5 0 0,1 18,15.5A1.5,1.5 0 0,1 16.5,17M7.5,17A1.5,1.5 0 0,1 6,15.5A1.5,1.5 0 0,1 7.5,14A1.5,1.5 0 0,1 9,15.5A1.5,1.5 0 0,1 7.5,17M4,16C4,16.88 4.39,17.67 5,18.22V20A1,1 0 0,0 6,21H7A1,1 0 0,0 8,20V19H16V20A1,1 0 0,0 17,21H18A1,1 0 0,0 19,20V18.22C19.61,17.67 20,16.88 20,16V6C20,2.5 16.42,2 12,2C7.58,2 4,2.5 4,6V16Z",
    	"https://ld2h/Default": "M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z",
    	"https://ld2h/FlightReservations": "M20.56 3.91C21.15 4.5 21.15 5.45 20.56 6.03L16.67 9.92L18.79 19.11L17.38 20.53L13.5 13.1L9.6 17L9.96 19.47L8.89 20.53L7.13 17.35L3.94 15.58L5 14.5L7.5 14.87L11.37 11L3.94 7.09L5.36 5.68L14.55 7.8L18.44 3.91C19 3.33 20 3.33 20.56 3.91Z",
    	"https://ld2h/TrainReservations": "M12,2C8,2 4,2.5 4,6V15.5A3.5,3.5 0 0,0 7.5,19L6,20.5V21H8.23L10.23,19H14L16,21H18V20.5L16.5,19A3.5,3.5 0 0,0 20,15.5V6C20,2.5 16.42,2 12,2M7.5,17A1.5,1.5 0 0,1 6,15.5A1.5,1.5 0 0,1 7.5,14A1.5,1.5 0 0,1 9,15.5A1.5,1.5 0 0,1 7.5,17M11,10H6V6H11V10M13,10V6H18V10H13M16.5,17A1.5,1.5 0 0,1 15,15.5A1.5,1.5 0 0,1 16.5,14A1.5,1.5 0 0,1 18,15.5A1.5,1.5 0 0,1 16.5,17Z"
    };
    var materialDesignRawSvg = {
    	headerIconTemplate: headerIconTemplate$1,
    	imageIconTemplate: imageIconTemplate$1,
    	transportIconTemplate: transportIconTemplate$1,
    	iconMap: iconMap
    };

    // Mapping the fallback icon to schema type
    const typeToIconMap = new Map();
    var headerIconTemplate;
    var imageIconTemplate;
    var transportIconTemplate;

    // Available icons
    const icons = {
      FontAwesome: "FontAwesome",
      MaterialDesignIcons: "MaterialDesignIcons",
      MaterialDesignSymbols: "MaterialDesignSymbols",
      MaterialDesignRawSvg: "MaterialDesignRawSvg"
    };

    /**
     * Set icons to use. Currently available:
     *  * FontAwesome
     *  * MaterialDesignIcons
     *  * MaterialDesignSymbols
     *
     * @param string fontName - Sets the font name if set to one of above's strings.
     */
    function setIcons(fontName){
        var icon;
        if (fontName == icons.FontAwesome) {
            icon = fontAwesome;
        } else if (fontName == icons.MaterialDesignIcons) {
            icon = materiaDesignIcons;
        } else if (fontName == icons.MaterialDesignSymbols) {
            icon = materialDesignSymbols;
        } else if (fontName == icons.MaterialDesignRawSvg) {
            icon = materialDesignRawSvg;
        }
        else {
          console.error(fontName + ' is unsupported!');
        }
        Object.entries(icon["iconMap"]).forEach(element => {
            typeToIconMap.set(element[0],element[1]);
        });
        headerIconTemplate = icon["headerIconTemplate"];
        imageIconTemplate = icon["imageIconTemplate"];
        transportIconTemplate = icon["transportIconTemplate"];
    }

    var cardDefaultFluent = "<fluent-card class=\"ld-card\">\n    <div class=\"ld-card__header\">\n        <!--  Experimental breadcrumblist support:   -->\n        \n        <!-- {{^ itemListElement}} {{@type}} {{> headerIconTemplate}} {{/ itemListElement}} -->\n        <!-- <ul class=\"ld-card__breadcrumb\"> {{# itemListElement}} <li><a href= {{item}} >{{name}}</a></li> {{/ itemListElement}}\n        </ul> -->\n\n        <!-- No breadcrumblist:  -->\n        {{#thumbnailUrl}}{{> headerIconTemplate}}{{/thumbnailUrl}}\n        {{#thumbnail}}{{> headerIconTemplate}}{{/thumbnail}}\n        \n    </div>\n    <div class=\"ld-card__row\">\n        <div class=\"image-column\">\n            <!-- First try the thumbnailUrl property which stores urls-->\n            {{#thumbnailUrl}}<img src=\"{{&thumbnailUrl}}\" alt=\"Picture showing {{@type}}\">{{/thumbnailUrl}}\n            <!-- Then try the thumbnail property which stores base64 pictures-->\n            {{#thumbnail}}<img src=\"{{&thumbnail}}\" alt=\"Picture showing {{@type}}\">{{/thumbnail}}\n            <!-- If both of them dont exist, render the i frame with the iconName -->\n            {{^thumbnailUrl}} {{^thumbnail}} {{> imageIconTemplate}}{{/thumbnail}}{{/thumbnailUrl}}\n        </div>\n        <div class=\"text-column\">\n            <!--This part is filled with subtemplates-->\n        {{#ld2hSubtemplateContent}}\n            {{{ld2hSubtemplateContent}}}\n        {{/ld2hSubtemplateContent}}\n        </div>\n    </div>\n        <div class=\"ld-card__footer\">\n            {{#potentialAction}}<fluent-button class=\"ld-card__action-button--fui\" appearance=\"accent\" onclick=\"window.open('{{target}}', '_blank');\">{{@type}}</fluent-button>{{/potentialAction}}\n        </div>\n\n        \n\n</fluent-card>\n    \n";

    var cardDefault = "<div class=\"ld-card\">\n    <div class=\"ld-card__header\">\n        <!--  Experimental breadcrumblist support:   -->\n        \n        <!-- {{^ itemListElement}} {{@type}} {{> headerIconTemplate}} {{/ itemListElement}} -->\n        <!-- <ul class=\"ld-card__breadcrumb\"> {{# itemListElement}} <li><a href= {{item}} >{{name}}</a></li> {{/ itemListElement}}\n        </ul> -->\n\n        <!-- No breadcrumblist:  -->\n        {{#thumbnailUrl}}{{> headerIconTemplate}}{{/thumbnailUrl}}\n        {{#thumbnail}}{{> headerIconTemplate}}{{/thumbnail}}\n        \n    </div>\n    <div class=\"ld-card__row\">\n        <div class=\"image-column\">\n            <!-- First try the thumbnailUrl property which stores urls-->\n            {{#thumbnailUrl}}<img src=\"{{&thumbnailUrl}}\" alt=\"Picture showing {{@type}}\">{{/thumbnailUrl}}\n            <!-- Then try the thumbnail property which stores base64 pictures-->\n            {{#thumbnail}}<img src=\"{{&thumbnail}}\" alt=\"Picture showing {{@type}}\">{{/thumbnail}}\n            <!-- If both of them dont exist, render the i frame with the iconName -->\n            {{^thumbnailUrl}} {{^thumbnail}} {{> imageIconTemplate}}{{/thumbnail}}{{/thumbnailUrl}}\n        </div>\n        <div class=\"text-column\">\n            <!--This part is filled with subtemplates-->\n        {{#ld2hSubtemplateContent}}\n            {{{ld2hSubtemplateContent}}}\n        {{/ld2hSubtemplateContent}}\n        </div>\n    </div>\n        <div class=\"ld-card__footer\">\n            {{#potentialAction}}<button type=\"button\" class=\"ld-card__action-button\" onclick=\"window.open('{{target}}', '_blank');\">{{@type}}</button>{{/potentialAction}}\n        </div>\n</div>\n    \n";

    var subDefault = "<h1 class=\"title\">{{name}}</h1>\n\n<p class=\"ld-card--content\">{{{description}}}</p>\n";

    var cardPromotionCards = "\n<div class=\"ld-card\">\n<div class=\"ld-card__header\">\n    {{^breadcrumbList.itemListElement}} {{@type}}   {{#iconName}}<i class=\"fa-solid fa-{{iconName}} fa-1x\"></i>{{/iconName}}  {{/breadcrumbList.itemListElement}}\n    <ul class=\"ld-card__breadcrumb\">\n        {{#breadcrumbList.itemListElement}}<li><a href=\"{{item.id}}\">{{item.name}}</a></li>{{/breadcrumbList.itemListElement}}\n    </ul>\n\n\n</div>\n\n<div class=\"ld-card__row--promotion-cards\">\n    <div class=\"image-column\">\n\n        <img src=\"{{logo}}\">\n\n\n    </div>\n\n    <div class=\"ld-card__text-column--promotion-cards\">\n\n        <h4 class=\"ld-card__title--promotion-cards\">{{subjectLine}}</h4>\n        <p class=\"ld-card__description--promotion-cards\">{{description}}</p>\n        <p class=\"ld-card__promotion-code--promotion-cards\">Code {{discountCode}}</p>\n\n    </div>\n\n    <div class=\"tabs-row\">\n\n        {{#promotionCards}}\n        {{{.}}}\n        {{/promotionCards}}\n\n    </div>\n\n\n\n\n</div>\n    <div class=\"ld-card__footer\">\n        {{#potentialAction}}<button type=\"button\" class=\"ld-card__action-button\" onclick=\"window.open('{{target}}', '_blank');\">{{@type}}</button>{{/potentialAction}}\n\n    </div>\n\n\n</div>\n\n";

    var cardPromotionCardsFluent = "\n<fluent-card class=\"ld-card\">\n<div class=\"ld-card__header\">\n    {{^breadcrumbList.itemListElement}} {{@type}}   {{#iconName}}<i class=\"fa-solid fa-{{iconName}} fa-1x\"></i>{{/iconName}}  {{/breadcrumbList.itemListElement}}\n    <ul class=\"ld-card__breadcrumb\">\n        {{#breadcrumbList.itemListElement}}<li><a href=\"{{item.id}}\">{{item.name}}</a></li>{{/breadcrumbList.itemListElement}}\n    </ul>\n\n\n</div>\n\n<div class=\"ld-card__row--promotion-cards\">\n    <div class=\"image-column\">\n\n        <img src=\"{{logo}}\">\n\n\n    </div>\n\n    <div class=\"ld-card__text-column--promotion-cards\">\n\n        <h4 class=\"ld-card__title--promotion-cards\">{{subjectLine}}</h4>\n        <p class=\"ld-card__description--promotion-cards\">{{description}}</p>\n        <p class=\"ld-card__promotion-code--promotion-cards\">Code {{discountCode}}</p>\n\n    </div>\n\n    <div class=\"tabs-row\">\n\n        {{#promotionCards}}\n        {{{.}}}\n        {{/promotionCards}}\n\n    </div>\n\n\n\n</div>\n    <div class=\"ld-card__footer\">\n        {{#potentialAction}}<fluent-button class=\"ld-card__action-button--fui\" appearance=\"accent\" onclick=\"window.open('{{target}}', '_blank');\">{{@type}}</fluent-button>{{/potentialAction}}\n\n    </div>\n\n\n</fluent-card>\n\n";

    var cardReservations = "<div class=\"ld-card\">\n    <div class=\"ld-card__header\">\n        <script>\n            function openCard(evt, tabId, tabBarId) {\n                var i, tabcontent, tablinks;\n\n                // Get all elements with class=\"tabcontent\" and \"barClass\" and hide them\n                tabcontent = document.getElementsByClassName(\"tabcontent \" + tabBarId);\n                for (i = 0; i < tabcontent.length; i++) {\n                    tabcontent[i].style.display = \"none\";\n                }\n\n                // Get all elements with class=\"tablinks and \"barClass\" and remove the class \"active\"\n                tablinks = document.getElementsByClassName(\"tablinks \" + tabBarId);\n                for (i = 0; i < tablinks.length; i++) {\n                    tablinks[i].classList.remove(\"active\");\n                }\n\n                // Show the current tab, and add an \"active\" class to the button that opened the tab\n                document.getElementById(tabId).style.display = \"flex\";\n                evt.currentTarget.classList.add(\"active\");\n            }\n        </script>\n        <!-- Tab links -->\n        <div class=\"tab\">\n        {{#.}}\n            {{#ld2hIsArray}}\n            <button type=\"button\" class=\"tablinks {{ld2hTabBarId}} {{#ld2hIsFirst}}active{{/ld2hIsFirst}}{{^ld2hIsFirst}}{{/ld2hIsFirst}}\" onclick='openCard(event, \"{{ld2hTabId}}\", \"{{ld2hTabBarId}}\");'>{{underName.name}} {{#reservationFor.departureAirport.iataCode}}{{reservationFor.departureAirport.iataCode}}-{{reservationFor.arrivalAirport.iataCode}}{{/reservationFor.departureAirport.iataCode}}{{#reservationFor.trainNumber}}{{reservationFor.trainNumber}}{{/reservationFor.trainNumber}}{{^reservationFor.departureAirport.iataCode}}{{^reservationFor.trainNumber}}{{ld2hElementNumber}}{{/reservationFor.trainNumber}}{{/reservationFor.departureAirport.iataCode}}</button>\n            {{/ld2hIsArray}}\n        {{/.}}\n        </div>\n    </div>\n    <div class=\"ld-card__row--reservations\">\n        <div class=\"smlCardFlightReservationTextColumn\">\n        {{^ld2hSubtemplateContent}}\n            {{> tabContent}}\n        {{/ld2hSubtemplateContent}}\n        {{#ld2hSubtemplateContent}}\n            {{{ld2hSubtemplateContent}}}\n        {{/ld2hSubtemplateContent}}\n        </div>\n    </div>\n</div>\n";

    var cardReservationsFluent = "<fluent-card class=\"ld-card\">\n    <div class=\"ld-card__header\">\n        <script>\n            function openCard(evt, tabId, tabBarId) {\n                var i, tabcontent, tablinks;\n\n                // Get all elements with class=\"tabcontent\" and \"barClass\" and hide them\n                tabcontent = document.getElementsByClassName(\"tabcontent \" + tabBarId);\n                for (i = 0; i < tabcontent.length; i++) {\n                    tabcontent[i].style.display = \"none\";\n                }\n\n                // Get all elements with class=\"tablinks and \"barClass\" and remove the class \"active\"\n                tablinks = document.getElementsByClassName(\"tablinks \" + tabBarId);\n                for (i = 0; i < tablinks.length; i++) {\n                    tablinks[i].classList.remove(\"active\");\n                }\n\n                // Show the current tab, and add an \"active\" class to the button that opened the tab\n                document.getElementById(tabId).style.display = \"flex\";\n                evt.currentTarget.classList.add(\"active\");\n            }\n        </script>\n        <!-- Tab links -->\n        <div class=\"tab\">\n        {{#.}}\n            {{#ld2hIsArray}}\n            <button type=\"button\" class=\"tablinks {{ld2hTabBarId}} {{#ld2hIsFirst}}active{{/ld2hIsFirst}}{{^ld2hIsFirst}}{{/ld2hIsFirst}}\" onclick='openCard(event, \"{{ld2hTabId}}\", \"{{ld2hTabBarId}}\");'>{{underName.name}} {{#reservationFor.departureAirport.iataCode}}{{reservationFor.departureAirport.iataCode}}-{{reservationFor.arrivalAirport.iataCode}}{{/reservationFor.departureAirport.iataCode}}{{#reservationFor.trainNumber}}{{reservationFor.trainNumber}}{{/reservationFor.trainNumber}}{{^reservationFor.departureAirport.iataCode}}{{^reservationFor.trainNumber}}{{ld2hElementNumber}}{{/reservationFor.trainNumber}}{{/reservationFor.departureAirport.iataCode}}</button>\n            {{/ld2hIsArray}}\n        {{/.}}\n        </div>\n    </div>\n    <div class=\"ld-card__row--reservations\">\n        <div class=\"smlCardFlightReservationTextColumn\">\n        {{^ld2hSubtemplateContent}}\n            {{> tabContent}}\n        {{/ld2hSubtemplateContent}}\n        {{#ld2hSubtemplateContent}}\n            {{{ld2hSubtemplateContent}}}\n        {{/ld2hSubtemplateContent}}\n        </div>\n    </div>\n</fluent-card>\n";

    var subArticle = "<h1 class=\"title\">{{headline}}</h1>\n{{#articleBody}}\n    <p class=\"ld-card--content\">{{articleBody}}</p>\n{{/articleBody}}\n\n{{^articleBody}}\n    <p class=\"ld-card--content\">{{description}}</p>\n{{/articleBody}}\n\n";

    var subEmailMessage = "<p class=\"ld-card--content\"><strong>Confirmation code:</strong> <span class=\"data_to_copy\">{{potentialAction.description}}</span>\n\n</p>\n<p class=\"ld-card--content\"><strong>Expires:</strong> {{expires}}\n\n</p>\n";

    var subFoodEstablishmentReservation = "<h1 class=\"title\">{{reservationFor.name}}</h1>\n<p class=\"ld-card--content\">\n    <span>{{reservationFor.name}}</span>\n    <span>{{reservationFor.address.streetAddress}}</span>\n    <span>{{reservationFor.address.addressLocality}}</span>\n    <span>{{reservationFor.address.addressRegion}}</span>\n    <span>{{reservationFor.address.postalCode}}</span>\n    <span>{{reservationFor.address.addressCountry}}</span>\n\n    <br>\n    <span>{{reservationNumber}}</span>\n    <span>{{underName.name}}</span>\n    <span>{{startTime}}</span>\n</p>\n";

    var subNewsArticle = "<h1 class=\"title\"> {{headline}}</h1>\n{{#articleBody}}\n    <p class=\"ld-card--content\">{{articleBody}}</p>\n{{/articleBody}}\n\n{{^articleBody}}\n    <p class=\"ld-card--content\">{{description}}</p>\n{{/articleBody}}\n\n";

    var subParcelDelivery = "<h1 class=\"title\">{{partOfOrder.merchant.name}}\n</h1>\n<p class=\"ld-card--content\">\n    <span>{{partOfOrder.@type}}</span>\n    <span>{{partOfOrder.orderNumber}}</span>\n    <span>{{itemShipped.description}}</span>\n\n    <br>\n\n    <span>{{pickupTime}}</span>\n    <span>{{deliveryAddress.name}}</span>\n    <span>{{deliveryAddress.streetAddress}}</span>\n    <span>{{deliveryAddress.addressLocality}}</span>\n    <span>{{deliveryAddress.addressRegion}}</span>\n    <span>{{deliveryAddress.postalCode}}</span>\n    <span>{{deliveryAddress.addressCountry}}</span>\n\n    <br>\n\n    <span>{{expectedArrivalFrom}} - </span>\n    <span>{{expectedArrivalUntil}}</span>\n    \n</p>\n\n";

    var subPlace = "<h1 class=\"title\">{{name}}\n</h1>\n\n<p class=\"ld-card--content\">{{address}}</p>\n<p class=\"ld-card--content\">\n    <span>{{geo.latitude}}</span>\n    <span>{{geo.longitude}}</span>\n</p>\n\n";

    var subPromotionCards = "\n<div class=\"ld-card__promotion-card\">\n\n    <div class=\"image-row\">\n        <img src=\"{{image}}\" alt=\"picture\">\n    </div>\n\n    <div class=\"ld-card__text-row--promotion-cards\">\n        <h4 class=\"ld-card__headline--promotion-cards\">{{headline}}</h4>\n        <div class=\"ld-card__footer-price--promotion-cards\">\n            <div class=\"price\"><p class=\"price\">{{oldPrice}}</p></div>\n            <div class=\"discount\"><p class=\"discountedPrice\">{{newPrice}}</p></div>\n        </div>\n    </div>\n    \n</div>\n\n";

    var subRentalCarReservation = "<h1 class=\"title\">{{reservationFor.rentalCompany.name}}</h1>\n<p class=\"ld-card--content\">\n    <span>{{reservationFor.name}}</span>\n    <span>{{reservationFor.brand.name}}</span>\n    <span>{{reservationFor.model}}</span>\n    <span>{{reservationNumber}}</span>\n    <span>{{underName.name}}</span>\n\n    <br>\n    \n    <span>{{pickupTime}}</span>\n    <span>{{pickupLocation.name}}</span>\n    <span>{{pickupLocation.address.streetAddress}}</span>\n    <span>{{pickupLocation.address.addressLocality}}</span>\n    <span>{{pickupLocation.address.addressRegion}}</span>\n    <span>{{pickupLocation.address.postalCode}}</span>\n    <span>{{pickupLocation.address.addressCountry}}</span>\n</p>\n";

    var subFlightReservation = "<!-- the part underneath enables \"tabs\" in case of multiple instances -->\n{{#ld2hIsArray}}\n<div id=\"{{ld2hTabId}}\" class=\"tabcontent {{ld2hTabBarId}}\" style=\"display: {{#ld2hIsFirst}}flex{{/ld2hIsFirst}}{{^ld2hIsFirst}}none{{/ld2hIsFirst}};\">\n{{/ld2hIsArray}}\n    <div class=\"flightReservationFirstColumn\">\n        <!-- <p style=\"margin: 0;font-weight: bold; margin-bottom: 5px;\">Departure :</p> -->\n        <h4 style=\"margin: 0;\">{{reservationFor.departureAirport.name}}</h4>\n        <p class=\"ld-card--content\" style=\"margin: 0!important;\">{{reservationFor.departureAirport.iataCode}}</p>\n        <p class=\"ld-card--content\" style=\"margin: 0!important;\">{{reservationFor.ld2hStartDate}} <br> {{reservationFor.ld2hStartTime}}</p>\n    </div>\n    <div class=\"flightReservationMidColumn\">\n        {{> transportIconTemplate}}\n        <br>\n        <p class=\"ld-card--content\" style=\"margin: 0!important;\">{{reservationFor.flightNumber}}</p>\n        <p class=\"ld-card--content\" style=\"margin: 0!important;\">{{reservationFor.airline.name}}</p>\n        <p class=\"ld-card--content\" style=\"margin: 0!important;\">{{reservationNumber}}</p>\n    </div>\n    <div class=\"flightReservationLastColumn\">\n        <!-- <p style=\"margin: 0;font-weight: bold;margin-bottom: 5px;\">Arrival :</p> -->\n        <h4 style=\"margin: 0;\">{{reservationFor.arrivalAirport.name}}</h4>\n        <p class=\"ld-card--content\" style=\"margin: 0!important;\">{{reservationFor.arrivalAirport.iataCode}}</p>\n        <p class=\"ld-card--content\" style=\"margin: 0!important;\">{{reservationFor.ld2hEndDate}}<br> {{reservationFor.ld2hEndTime}} </p>\n    </div>\n{{#ld2hIsArray}}\n</div>\n{{/ld2hIsArray}}\n";

    var subEventReservation = "{{#ld2hIsArray}}\n<div id=\"{{ld2hTabId}}\" class=\"tabcontent {{ld2hTabBarId}}\" style=\"display: {{#ld2hIsFirst}}flex{{/ld2hIsFirst}}{{^ld2hIsFirst}}none{{/ld2hIsFirst}};\">\n{{/ld2hIsArray}}\n    <div class=\"flightReservationFirstColumn\">\n        {{> imageIconTemplate}}\n    </div>\n    <div class=\"flightReservationMidColumn\" style=\"flex-direction: column;align-items: flex-start;\">\n        <h1 class=\"title\">{{reservationFor.name}}</h1>\n        \n        <p class=\"ld-card--content\" style=\"padding-left: 0;\">{{{reservationFor.location.name}}}</p>\n        <p class=\"ld-card--content\" style=\"padding-left: 0;\">{{{reservationFor.ld2hStartDate}}}</p>\n        <p class=\"ld-card--content\" style=\"padding-left: 0;\">{{{reservationFor.ld2hStartTime}}}</p>\n    </div>\n{{#ld2hIsArray}}\n</div>\n{{/ld2hIsArray}}\n";

    var subReservation = "<h1 class=\"title\">{{reservationFor.name}}</h1>\n\n<p class=\"ld-card--content\">{{{reservationFor.description}}}</p>\n";

    var subTrainReservation = "<!-- the part underneath enables \"tabs\" in case of multiple instances -->\n{{#ld2hIsArray}}\n<div id=\"{{ld2hTabId}}\" class=\"tabcontent {{ld2hTabBarId}}\" style=\"display: {{#ld2hIsFirst}}flex{{/ld2hIsFirst}}{{^ld2hIsFirst}}none{{/ld2hIsFirst}};\">\n{{/ld2hIsArray}}\n    <div class=\"flightReservationFirstColumn\">\n        <!-- <p style=\"margin: 0;font-weight: bold; margin-bottom: 5px;\">Departure :</p> -->\n        <h4 style=\"margin: 0;\">{{reservationFor.departureStation.name}}</h4>\n        <p class=\"ld-card--content\" style=\"margin: 0!important;\">{{reservationFor.ld2hStartDate}} <br> {{reservationFor.ld2hStartTime}}</p>\n    </div>\n    <div class=\"flightReservationMidColumn\">\n        {{> transportIconTemplate}}\n        <br>\n        <p class=\"ld-card--content\" style=\"margin: 0!important;padding-top: 2px!important;\">{{reservationNumber}}</p>\n    </div>\n    <div class=\"flightReservationLastColumn\">\n        <!-- <p style=\"margin: 0;font-weight: bold;margin-bottom: 5px;\">Arrival :</p> -->\n        <h4 style=\"margin: 0;\">{{reservationFor.arrivalStation.name}}</h4>\n        <p class=\"ld-card--content\" style=\"margin: 0!important;\">{{reservationFor.ld2hEndDate}}<br> {{reservationFor.ld2hEndTime}} </p>\n    </div>\n{{#ld2hIsArray}}\n</div>\n{{/ld2hIsArray}}\n";

    var subBusReservation = "<!-- the part underneath enables \"tabs\" in case of multiple instances -->\n{{#ld2hIsArray}}\n<div id=\"{{ld2hTabId}}\" class=\"tabcontent {{ld2hTabBarId}}\" style=\"display: {{#ld2hIsFirst}}flex{{/ld2hIsFirst}}{{^ld2hIsFirst}}none{{/ld2hIsFirst}};\">\n{{/ld2hIsArray}}\n    <div class=\"flightReservationFirstColumn\">\n        <!-- <p style=\"margin: 0;font-weight: bold; margin-bottom: 5px;\">Departure :</p> -->\n        <h4 style=\"margin: 0;\">{{reservationFor.departureBusStop.name}}</h4>\n        <p class=\"ld-card--content\" style=\"margin: 0!important;\">{{reservationFor.ld2hStartDate}} <br> {{reservationFor.ld2hStartTime}}</p>\n    </div>\n    <div class=\"flightReservationMidColumn\">\n        {{> transportIconTemplate}}\n        <p class=\"ld-card--content\" style=\"margin: 0!important;\">{{reservationNumber}}</p>\n        <p class=\"ld-card--content\" style=\"margin: 0!important;\">{{underName.name}}</p>\n    </div>\n    <div class=\"flightReservationLastColumn\">\n        <!-- <p style=\"margin: 0;font-weight: bold;margin-bottom: 5px;\">Arrival :</p> -->\n        <h4 style=\"margin: 0;\">{{reservationFor.arrivalBusStop.name}}</h4>\n        <p class=\"ld-card--content\" style=\"margin: 0!important;\">{{reservationFor.ld2hEndDate}}<br> {{reservationFor.ld2hEndTime}} </p>\n    </div>\n{{#ld2h.IsArray}}\n</div>\n{{/ld2h.IsArray}}\n";

    /*
     * Exports all available templates to be used for rendering
     */


    // Available templates for exporting
    const allTemplates = {
        cardDefault,
        cardDefaultFluent,
        cardReservationsFluent,
    //    cardDefaultBackgroundImage,
    //    cardDefaultPlaceholder,
    //    cardDefaultSlim,
    //    subDefaultArraySupport,
        cardReservations,
        cardPromotionCards,
        cardPromotionCardsFluent
    };

    // Available subtemplates for exporting
    const allSubtemplates = {
        subDefault,
        subArticle,
        subEmailMessage,
        subEventReservation,
        subFlightReservation,
        subFoodEstablishmentReservation,
        subNewsArticle,
        subParcelDelivery,
        subPlace,
        subPromotionCards,
        subTrainReservation,
        subRentalCarReservation,
        subReservation
    };

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

    // Custom templates for specific schema.org types
    {
        availableTemplates.set("https://ld2h/PromotionCards", cardPromotionCards);
    }
    {
        availableTemplates.set("https://ld2h/Reservations", cardReservations);
        availableTemplates.set("Reservation", cardReservations);
        availableTemplates.set("EventReservation", cardReservations);
        availableTemplates.set("FlightReservation", cardReservations);
        availableTemplates.set("TrainReservation", cardReservations);
        availableTemplates.set("BusReservation", cardReservations);
    }


    /// Mapping schema type to subtemplate file
    const availableSubtemplates = new Map();
    availableSubtemplates.set("https://ld2h/Default", subDefault);

    // Custom generic sub templates. Suitable for more than one type
    if (typeof subDefaultArraySupport !== 'undefined') {
        availableSubtemplates.set("???", subDefaultArraySupport);
    }

    // Custom subtemplates for specific JSON-LD types
    {
        availableSubtemplates.set("https://ld2h/PromotionCards", subPromotionCards);
    }
    {
        availableSubtemplates.set("RentalCarReservation", subRentalCarReservation);
    }
    {
        availableSubtemplates.set("ParcelDelivery", subParcelDelivery);
    }
    {
        availableSubtemplates.set("FoodEstablishmentReservation", subFoodEstablishmentReservation);
    }
    {
        availableSubtemplates.set("NewsArticle", subNewsArticle);
    }
    {
        availableSubtemplates.set("Article", subArticle);
    }
    {
        availableSubtemplates.set("Place", subPlace);
    }
    {
        availableSubtemplates.set("EmailMessage", subEmailMessage);
    }
    {
        availableSubtemplates.set("FlightReservation", subFlightReservation);
        availableSubtemplates.set("https://ld2h/FlightReservations", subFlightReservation);
    }
    {
        availableSubtemplates.set("EventReservation", subEventReservation);
        availableSubtemplates.set("https://ld2h/EventReservations", subEventReservation);
    }
    {
        availableSubtemplates.set("Reservation", subReservation);
        availableSubtemplates.set("https://ld2h/Reservations", subReservation);
    }
    {
        availableSubtemplates.set("TrainReservation", subTrainReservation);
        availableSubtemplates.set("https://ld2h/TrainReservations", subTrainReservation);
    }
    {
        availableSubtemplates.set("BusReservation", subBusReservation);
        availableSubtemplates.set("https://ld2h/BusReservations", subBusReservation);
    }




    /* Edit above in case you added your own templates. */



    /**
     * Get subtemplate for a JSON-LD type. Use https://ld2h/Default as fallback.
     * The subtemplate is supposed to be as part of a template.
     *
     * @param {string} jsonLdType: @type of a JSON-LD
     * @returns {string} HTML mustache template
     */
    function getSubtemplateOfType(jsonLdType){
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
    function getTemplateOfType(jsonLdType) {
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
    function setTemplateOfType(jsonLdType, template) {
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
    function setSubtemplateOfType(jsonLdType, template) {
        availableSubtemplates.set(jsonLdType, template);
    }


    function hasSubtemplateOfType(jsonLdType){

        return availableSubtemplates.has(jsonLdType)
     
    }
    function hasTemplateOfType(jsonLdType){

        return availableTemplates.has(jsonLdType)
     
    }

    /*!
     * Renders JSON-LD as HTML
     */

    var jsonld2html = {
        name: 'jsonld2html.js',
        version: '0.0.1'
    };

    /**
    * Find values for a specified key in an array of json objects
    * @param object object - the object to be searched
    * @return object Returns the value matching to the provided key
    */
    function findValueInArray(object,key){
        // case object is array
        if(Array.isArray(object)){
            for (const iterator of object) {
                if(key in iterator){
                    return iterator[key];
                }
            }
        }
    }

    /**
     * Create two dedicated properties from startDate of Reservation object
     * @param object jsonObject - JSON-LD object of type Reservation
     * @return object Returns JSON-LD object with two addtional properties
     */
    function splitStartDateTime(jsonObject) {
        if("reservationFor" in jsonObject)
        {    if ("startDate" in jsonObject.reservationFor) {
                const startDate = jsonObject.reservationFor.startDate.toString();
                const iDate = new Date(Date.parse(startDate.split('T')[0]));
                const iDateTime = new Date(Date.parse(startDate));
                jsonObject["reservationFor"]["ld2hStartDate"] = iDate.toLocaleDateString();// TODO I18N
                jsonObject["reservationFor"]["ld2hStartTime"] = iDateTime.toLocaleTimeString([], { timeStyle: 'short' }); // TODO I18N
            }
            if("arrivalTime" in jsonObject.reservationFor) {
                const arrivalTime = jsonObject.reservationFor.arrivalTime.toString();
                const iDate = new Date(Date.parse(arrivalTime.split('T')[0]));
                const iDateTime = new Date(Date.parse(arrivalTime));
                jsonObject["reservationFor"]["ld2hEndDate"] = iDate.toLocaleDateString();
                jsonObject["reservationFor"]["ld2hEndTime"] = iDateTime.toLocaleTimeString([], { timeStyle: 'short' }); // TODO I18N

            }
            if("departureTime" in jsonObject.reservationFor) {
                const departureTime = jsonObject.reservationFor.departureTime.toString();
                const iDate = new Date(Date.parse(departureTime.split('T')[0]));
                const iDateTime = new Date(Date.parse(departureTime));
                jsonObject["reservationFor"]["ld2hStartDate"] = iDate.toLocaleDateString();
                jsonObject["reservationFor"]["ld2hStartTime"] = iDateTime.toLocaleTimeString([], { timeStyle: 'short' }); // TODO I18N

            }
        }

        return jsonObject;
    }

    /**
     * Preprocess a JSON-LD by doing:
     *  * Only return the JSON-LD Object with the mainEntityOfPage property
     *  * Creates an additional viewAction for mainEntityOfPage property
     *  * Extract the image into either the thumbnail or thumbnailUrl property
     * @param object jsonld       - JSON-LD object
     * @param bool   stripActions - Whether to strip actions from the JSON-LD. This will avoid rendering buttons.
     * @return object Returns the preprocessed JSON-LD object
     */
    function preprocess(jsonLd, stripActions = false) {
        jsonLd = getMainEntity(jsonLd);
        if (stripActions) {
            delete jsonLd["potentialAction"];
        } else {
            jsonLd = createPotentialViewAction(jsonLd);
        }
        return extractImage(jsonLd);
    }

    /**
     * @param {object} jsonLd - As a parsed object
     * @param {string} template - The mustache template as a string
     * @param {string} arrayType - Optional type if the provided jsonLd dont have one. For example if arrays of Objects need to be rendered
     * @returns {string} Returns rendered card template
     */
    function renderFromTemplate(jsonLd, template, arrayType = "") {
        let partials = {headerIconTemplate, imageIconTemplate,transportIconTemplate};

        // Determine icon based on schema type
        // Prefer arrayType over actual @type, fallback to https://ld2h/Default
        if(arrayType !== ""){
            for (const jsonLditem of jsonLd) {
                jsonLditem["iconName"] = typeToIconMap.get(arrayType);
            }
        } else if(jsonLd["@type"] !== undefined && typeToIconMap.has(jsonLd["@type"])) {
            jsonLd["iconName"] = typeToIconMap.get(jsonLd["@type"]);
        } else {
            jsonLd["iconName"] = typeToIconMap.get("https://ld2h/Default");
        }
        
        
        // ===== Special case "PromotionCards" =====
        if(arrayType === "https://ld2h/PromotionCards" &&
            getSubtemplateOfType("https://ld2h/PromotionCards") == allSubtemplates.subPromotionCards){

            let mustacheDataObj = new Object();
            mustacheDataObj["promotionCards"] = [];
            mustacheDataObj["logo"] = findValueInArray(jsonLd,"logo");
            mustacheDataObj["subjectLine"] = findValueInArray(jsonLd,"subjectLine");
            mustacheDataObj["description"] = findValueInArray(jsonLd,"description");
            mustacheDataObj["discountCode"] = findValueInArray(jsonLd,"discountCode");   
            let foundObjects = [];
            for (const iterator of jsonLd) {
                if(iterator["@type"] === "PromotionCard"){
                    foundObjects.push(iterator);
                }
            }
            for (const obj of foundObjects){   
                let promoCard = {
                    image: obj["image"],
                    headline: obj["headline"],
                    discountValue: obj["discountValue"],
                    newPrice: String(obj["price"] - obj["discountValue"]),
                    oldPrice: String(obj["price"]),
                    priceCurrency: obj["priceCurrency"]
                };
                mustacheDataObj["promotionCards"].push(mustache.render(getSubtemplateOfType(arrayType), transformArrayProperties(promoCard)));
            }
            // Do not transform Arrays here as PromotionCards are inside an array
            let finalCard = mustache.render(template, mustacheDataObj, partials);
            return finalCard;
        }
        
        // ===== Custom base template with custom subtemplate
        // Case: Reservation base template with Reservation subtemplate
        if (arrayType != "" && arrayType.endsWith("Reservations")){
            console.log("Applying special rendering for Reservations");
            // Creating ID for the bar to wire it with its tabs
            let tabBarId = "bar" + Math.floor(Math.random() * 1000000000000001);

            // adding an synthetic ID to the instances
            let i = 1;
            let first = true;
            let output = "";

            // wire the IDs to each Reservation item
            for (let iterator of jsonLd) {
                // Creating tab specific values
                iterator["ld2hTabBarId"] = tabBarId;

                if (first) {
                    iterator["ld2hIsFirst"] = true;
                    first = false;
                    iterator["ld2hIsArray"] = false;
                }
                // TODO move this flag assignment to "preprocessing", we check there anyway,
                iterator["ld2hIsArray"] = true;
                iterator["ld2hTabId"] = tabBarId + i;
                iterator["ld2hElementNumber"] = i;

                iterator = transformArrayProperties(iterator);
                iterator = splitStartDateTime(iterator);

                // Fallbak to https://ld2h/Reservations for Reservations without dedicated subtemplate
                if (hasSubtemplateOfType(arrayType)) {
                    output += mustache.render(getSubtemplateOfType(arrayType), transformArrayProperties(iterator), partials);
                } else {
                    output += mustache.render(getSubtemplateOfType("https://ld2h/Reservations"), transformArrayProperties(iterator), partials);
                }
                i++;
            }

            partials["tabContent"] = output;

            if (arrayType.endsWith("Reservations") && !hasTemplateOfType(arrayType)) {
                return mustache.render(getTemplateOfType("https://ld2h/Reservations"), jsonLd, partials);
            }

            // Do not transform Arrays here as FlightReservations are inside an array
            return mustache.render(getTemplateOfType(arrayType), jsonLd, partials);
        }

        jsonLd = transformArrayProperties(jsonLd);
        let subTemplate;
        if (jsonLd["@type"].endsWith("Reservation")){
            if (jsonLd["@type"] === "EventReservation") {
                jsonLd = splitStartDateTime(jsonLd);
            }
            if (!hasSubtemplateOfType(jsonLd["@type"])) {
                subTemplate = getSubtemplateOfType("https://ld2h/Reservations");
            }
            if(jsonLd["@type"] === "FlightReservation"){
                jsonLd = splitStartDateTime(jsonLd);
            }
            if(jsonLd["@type"] === "TrainReservation"){
                jsonLd = splitStartDateTime(jsonLd);
            }
            if(jsonLd["@type"] === "BusReservation"){
                jsonLd = splitStartDateTime(jsonLd);
            }
        }

        subTemplate = getSubtemplateOfType(jsonLd["@type"]);
        let output =  mustache.render(subTemplate, jsonLd, partials);
        jsonLd["ld2hSubtemplateContent"] = output;

        // Log unmatched fields
        if(jsonLd["name"] === undefined || jsonLd["name"] === ""){
            console.log(`in ${jsonLd["@type"]}[name] property not found`);
        }
        if(jsonLd["description"] === undefined || jsonLd["description"] === ""){
            console.log(`in ${jsonLd["@type"]}[description] property not found`);
        }

        return mustache.render(template, jsonLd, partials);
    }

    /**
     * Return HTML of an input JSON-LD. Inlcudes preprocessing.
     *
     * @param object jsonld        - JSON-LD object
     * @param bool   doPreprocess  - Whether to do some preprocessing in general.
     * @param bool   renderButtons - Whether to strip actions from the JSON-LD. This will avoid rendering buttons.
     * @return object Returns the preprocessed JSON-LD object
     */
    function render(jsonLdin, renderButtons = true, doPreprocess = true) {
        // Fallback to FontAwesome in case no icon
        if (typeToIconMap.size == 0) {
            setIcons(icons.MaterialDesignRawSvg);
        }

        let jsonLd = structuredClone(jsonLdin);

        // Detect special json-lds which cannot be determined after getMainEntity
        // Bypass getMainEntity for special cases
        // Special case: Reservation
        if(Array.isArray(jsonLd)){
            let isReservationArray = false;
            // Check if all Elements are Reservations
            for (const iterator of jsonLd) {
                if(iterator["@type"] !== undefined
                        && iterator["@type"].endsWith("Reservation")){
                    isReservationArray = true;
                }
            }
            let type = `https://ld2h/${jsonLd[0]["@type"]}s`;
            if(isReservationArray) {
                console.log("Applying special rendering for JSON-LD array");
                if (hasSubtemplateOfType(type) && hasTemplateOfType(type)) {  
                    return renderFromTemplate(jsonLd, getTemplateOfType(type), type);
                } else {
                    return renderFromTemplate(jsonLd, getTemplateOfType("https://ld2h/Reservations"), type);
                }
            }
        }

        // Special case: "PromotionCard"
        if(Array.isArray(jsonLd))
        {   
            let promoCardCounter = 0;
            for (const iterator of jsonLd) {
                // The most noticeable attribute of a "PromotionCard" is: containing three of them
                if(iterator["@type"] === "PromotionCard"){
                    promoCardCounter +=1;
                }
            }
            if(promoCardCounter === 3){
                let arrayType = "https://ld2h/PromotionCards";
                return renderFromTemplate(jsonLd,getTemplateOfType(arrayType),arrayType);
            }
        }

        if (!doPreprocess && !renderButtons) {
            console.error("Not rendering buttons requires preprocessing. Will preprocess anyway.");
        }
        if (doPreprocess || !renderButtons) {
            jsonLd = preprocess(jsonLd, !renderButtons);
        }

        return renderFromTemplate(jsonLd, getTemplateOfType(jsonLd["@type"]));
    }

    jsonld2html.render = render;

    jsonld2html.renderFromTemplate = renderFromTemplate;

    jsonld2html.getMainEntity = getMainEntity;

    jsonld2html.createPotentialViewAction = createPotentialViewAction;

    jsonld2html.extractImage = extractImage;

    jsonld2html.preprocess = preprocess;

    jsonld2html.allTemplates = allTemplates;

    jsonld2html.allSubtemplates = allSubtemplates;

    jsonld2html.setTemplateOfType = setTemplateOfType;

    jsonld2html.setSubtemplateOfType = setSubtemplateOfType;

    jsonld2html.setIcons = setIcons;

    jsonld2html.icons = icons;

    return jsonld2html;

}));
