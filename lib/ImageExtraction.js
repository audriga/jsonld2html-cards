// This function extracts a "usable" image from the different cases of a json-ld
//  into the thumbnail property

export function extractImage(json_object){

    const overwriteThumbnail = true;
    
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
    // else if ??
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
            if(json_object["image"][0] !== undefined &&
                    typeof json_object["image"][0] === 'object')
            {
                if(json_object["image"][0]["url"] !== undefined &&
                    typeof json_object["image"][0]["url"] === 'string')
                {
                    json_object["thumbnailUrl"] = json_object["image"][0]["url"];
                    return json_object;
                }
            }
            
        }
        // case "object"
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
                json_object["thumbnailUrl"] = json_object["image"]["contentUrl"];
                return json_object;
            }
        }
        
    }

    // If nothing happend return json_object
    return json_object;
}
