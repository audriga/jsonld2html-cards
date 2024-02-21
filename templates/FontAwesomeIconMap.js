// This is a map to connect FontAwesome Icons with schema.org types
// They are used as image fallback and as little visual indicator for the corresponding schema type

let json = `{
    "NewsArticle": "newspaper",
    "Article": "comment",
    "MusicAlbum": "compact-disc",
    "MusicRecording": "music",
    "BusReservation": "bus",
    "Place": "location-dot"
  }`;

let typeToIconMap = new Map();

let obj = JSON.parse(json);

Object.entries(obj).forEach(element => {
    typeToIconMap.set(element[0],element[1]);
});

export const iconMap = typeToIconMap;