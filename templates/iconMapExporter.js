
let csv = `NewsArticle,newspaper
Article,comment
MusicAlbum,compact-disc
MusicRecording,music
BusReservation,bus
Place,location-dot`;


let typeToIconMap = new Map();

var lines = csv.split('\n')


lines.forEach(line => {
    typeToIconMap.set(line.split(",")[0],line.split(",")[1])

});
        





export const iconMap = typeToIconMap;