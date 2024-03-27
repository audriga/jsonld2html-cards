import icon from '../config/icon_map_FontAwesome.json';
//import icon from '../config/icon_map_MaterialDesignIcons.json';
//import icon from '../config/icon_map_MaterialDesignSymbols.json';

// Mapping the fallback icon to schema type
const typeToIconMap = new Map();

Object.entries(icon["iconMap"]).forEach(element => {
    typeToIconMap.set(element[0],element[1]);
});

const headerIconTemplate = icon["headerIconTemplate"];
const imageIconTemplate = icon["imageIconTemplate"];

export {typeToIconMap,imageIconTemplate,headerIconTemplate};
