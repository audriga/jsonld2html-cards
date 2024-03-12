import icon_json from '../config/icon_map_FontAwesome.json';

// Mapping the fallback icon to schema type
const typeToIconMap = new Map();

Object.entries(icon_json).forEach(element => {
    typeToIconMap.set(element[0],element[1]);
});

export default typeToIconMap;