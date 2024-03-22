const Jsonld2html = require('../../jsonld2html-bundle.js');

const newsArticleIn = JSON.parse(`{
    "@context": "http://schema.org",
    "@type": "NewsArticle",
    "headline": "Tag der Weichenstellung: Diese Bahnstrecken werden bald saniert",
    "publisher": {
        "@type": "Organization",
        "name": "Frankfurter Allgemeine Zeitung"
    },
    "description": "Die Bahn startet 2024 das größte Sanierungsprogramm ihrer Geschichte, der Bund stellt dafür mehr als 80 Milliarden Euro bereit. Für die Pendler werden die nächsten Jahre trotzdem hart.",
    "articleBody": "Der Fahrplan für eine verlässlichere Bahn beginnt pünktlich zum Weihnachtsfest 2024. So verspricht es Bundesverkehrsminister Volker Wissing (FDP) am Freitag sichtlich gut gelaunt auf dem Schienengipfel in Frankfurt, von dem, wie er findet, „Si­gnale des Optimismus“ ausgehen. Wenn alles so läuft wie geplant, wird dann nämlich die erste Etappe der Generalsanierung abgeschlossen sein: Die Riedbahn zwischen Frankfurt und Mannheim wird im neuen Glanz erstrahlen mit zusätzlichen Weichen, neuen Oberleitungen und einigen frisch sanierten Bahnhöfen entlang der Strecke. Schon diese Sanierungsmaßnahme, die mit 900 Millionen Euro zu Buche schlägt, werde die Qualität des Schienennetzes deutlich steigern, versichert auch Deutsche-Bahn-Vorstand Berthold Huber, zuständig für die Schieneninfrastruktur. Schließlich fahren 20 Prozent des deutschen Fernverkehrs über diesen Korridor, der in den vergangenen Jahren durch eine besondere Störanfälligkeit aufgefallen war: Eine ungeplante Störung pro Tag registrierte die Bahn dort..."
}`);

test("Will use special NewsArticle subtemplate by default", ()=> {
    expect(Jsonld2html.render(newsArticleIn)).toContain("Der Fahrplan");  // articleBody shall still be taken instead of description
});

test("Will not use special NewsArticle subtemplate", ()=> {
    Jsonld2html.setSubtemplateOfType("NewsArticle", Jsonld2html.allSubtemplates.subDefault);
    expect(Jsonld2html.render(newsArticleIn)).toContain("startet 2024");  // description shall be taken
});
