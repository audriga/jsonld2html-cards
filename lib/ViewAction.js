
export function createPotentialViewAction(json_object){
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
