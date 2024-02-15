
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

function getMainEntity(json_object){
    if(Array.isArray(json_object))
    {   
        let possible_main_entity = findNestedObj(json_object,"mainEntityOfPage");
        if(possible_main_entity != null)
        {
            return possible_main_entity;
        }
        else return json_object[0];
    }
    else if(json_object["@graph"] !== "undefined" && Array.isArray(json_object["@graph"]))
    {   
        let possible_graph = json_object["@graph"]
        let possible_main_entity = getMainEntity(possible_graph);
        if(possible_main_entity != null)
        {
            return possible_main_entity;
        }
    }
    else return json_object;
}

if (typeof module !== 'undefined') {
    module.exports = getMainEntity;
}
