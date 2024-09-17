import { fluentButton, fluentTextArea, provideFluentDesignSystem } from 'https://unpkg.com/@fluentui/web-components';



// Register the Fluent UI components
provideFluentDesignSystem().register(fluentTextArea());
provideFluentDesignSystem().register(fluentButton());

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {


    // ========= DEFAULT RENDERING ============
 
    const renderDefaultButton = document.getElementById("render-default-button");
    if(renderDefaultButton){
        renderDefaultButton.addEventListener("click", (event) => {

            removeStylesheet("style/ld2h_all_cards_fluent.css");
            loadStylesheet("style/ld2h_all_cards.css");

            const jsonInputField = document.getElementById("json-input-field");
        
            let possibleJsonObject = checkJsonLd(jsonInputField.value.valueOf()); 
            
            if(possibleJsonObject){
                    //document.getElementById("status-bar").innerHTML = "";
                     document.getElementById("output-target").innerHTML = Jsonld2html.render(possibleJsonObject);

                }
        })
    }


    // ========= FLUENT RENDERING ============

    const renderFluentButton = document.getElementById("render-fluent-button");
    if(renderFluentButton){
        renderFluentButton.addEventListener("click", (event) => {

            
            removeStylesheet("style/ld2h_all_cards.css");
            
            loadStylesheet("style/ld2h_all_cards_fluent.css");
            
            const jsonInputField = document.getElementById("json-input-field");
        
            let possibleJsonObject = checkJsonLd(jsonInputField.value.valueOf()); 

            if(possibleJsonObject){
                let finalCard = "";
                // changing the default template to the fluentUI template
                Jsonld2html.setTemplateOfType("https://ld2h/Default",Jsonld2html.allTemplates.cardDefaultFluent);
                Jsonld2html.setTemplateOfType("https://ld2h/Reservations",Jsonld2html.allTemplates.cardReservationsFluent);
                Jsonld2html.setTemplateOfType("https://ld2h/PromotionCards",Jsonld2html.allTemplates.cardPromotionCardsFluent);
                Jsonld2html.setTemplateOfType("TrainReservation",Jsonld2html.allTemplates.cardReservationsFluent);
                Jsonld2html.setTemplateOfType("FlightReservation",Jsonld2html.allTemplates.cardReservationsFluent);
                Jsonld2html.setTemplateOfType("BusReservation",Jsonld2html.allTemplates.cardReservationsFluent);
                Jsonld2html.setTemplateOfType("TrainReservation",Jsonld2html.allTemplates.cardReservationsFluent);
                Jsonld2html.setTemplateOfType("EventReservation",Jsonld2html.allTemplates.cardReservationsFluent);
                Jsonld2html.setTemplateOfType("Reservation",Jsonld2html.allTemplates.cardReservationsFluent);
            
                finalCard = Jsonld2html.render(possibleJsonObject);
                document.getElementById("output-target").innerHTML = finalCard;
            }

        })   
    }

    // Example of programmatically setting a value
    // const filledTextarea = document.querySelector('fluent-text-area[appearance="filled"]');
    // if (filledTextarea) {
    //     filledTextarea.value = "This is a pre-filled value";
    // }
});


function checkJsonLd(inputString) {

    let possibleObject;
    let success = false;

    try {

        possibleObject = JSON.parse(inputString);
        success = true;
        document.getElementById("status-bar").innerHTML = "";
    
    } catch (error) {

        document.getElementById("status-bar").innerHTML = error.message;
        console.error("JSON parsing error:", error);
    }

    if(success === false){

        return false;
    }

    else return possibleObject;
}

function loadStylesheet(stylesheetPath) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = stylesheetPath;
    document.head.appendChild(link);
}

function removeStylesheet(stylesheetPath) {
    const links = document.getElementsByTagName('link');
    for (let i = 0; i < links.length; i++) {
        if (links[i].href.includes(stylesheetPath)) {
            links[i].parentNode.removeChild(links[i]);
            break;
        }
    }
}


