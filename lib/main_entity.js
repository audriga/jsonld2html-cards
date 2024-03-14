// The purpose of this module is to determine the main schema type of the given input
// This main schema type is needed to identify its corresponding template

function findObject(object, key){
    if(key in object){
        return object;
    }
    else if(Array.isArray(object)){
        for (const iterator of object) {
            if(key in iterator){
                return iterator
            }
        }
    }
}

export default function getMainEntity(json_object){
    if(Array.isArray(json_object))
    {   
        let possible_main_entity = findObject(json_object,"mainEntityOfPage");
        if(possible_main_entity != null)
        {
            return possible_main_entity;
        }
        else return json_object[0];
    }
    else if(json_object["@graph"] !== null
        && json_object["@graph"] !== undefined
        && Array.isArray(json_object["@graph"]))
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
