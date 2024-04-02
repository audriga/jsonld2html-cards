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
export function transformArrayProperties(jsonObject) {
    for (const key in jsonObject) {
        if (Array.isArray(jsonObject[key])) {
            jsonObject[key] = jsonObject[key][0];
        }
    }
    return jsonObject;
}

export function getMainEntity(jsonLd){
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
        let possibleGraph = jsonLd["@graph"]
        let possibleMainEntity = getMainEntity(possibleGraph);
        
        return possibleMainEntity;
    }
    else return jsonLd;
}
