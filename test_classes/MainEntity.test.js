const jsonld2html = require('../jsonld2html-bundle.js');

const testCase1_input = JSON.parse(`{
    "@context": "https://schema.org",
    "@graph": [
      {
        "publisher": {
          "@type": "Organization",
          "name": "t-online",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.t-online.de/s/paper/_next/static/assets/t-online-mobile-a9e3b9d2cde84bae76536a505a3683d7.svg"
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "https://www.t-online.de/mobilitaet/recht-und-verkehr/id_100243974/autokauf-diese-assistenten-werden-pflicht-im-fahrzeug.html"
        },
        "alternativeHeadline": "Von EU verordnet - Diese Assistenten werden Pflicht im Auto",
        "keywords": "Auto,EU,Unfall,Pflichtausstattung,100213474",
        "datePublished": "2023-09-15T14:08:53.431Z",
        "dateModified": "2023-09-16T06:13:00.000Z",
        "@type": "Article",
        "headline": "Autokauf: Diese Assistenten werden Pflicht im Fahrzeug",
        "image": [
          {
            "@type": "ImageObject",
            "url": "https://images.t-online.de/2022/07/92351056v3/0x100:1920x1080/fit-in/1800x0/nie-wieder-tempo-tickets-ein-neuer-assistent-kann-zu-schnelle-autos-bremsen-allerdings-duerfen-die-hersteller-dafuer-in-zukunft-eine-gebuehr-verlangen.jpg"
          },
          {
            "@type": "ImageObject",
            "url": "https://images.t-online.de/2022/07/92351056v3/69x0:1280x1280/fit-in/1800x0/nie-wieder-tempo-tickets-ein-neuer-assistent-kann-zu-schnelle-autos-bremsen-allerdings-duerfen-die-hersteller-dafuer-in-zukunft-eine-gebuehr-verlangen.jpg"
          },
          {
            "@type": "ImageObject",
            "url": "https://images.t-online.de/2022/07/92351056v3/240x100:1440x1080/fit-in/1800x0/nie-wieder-tempo-tickets-ein-neuer-assistent-kann-zu-schnelle-autos-bremsen-allerdings-duerfen-die-hersteller-dafuer-in-zukunft-eine-gebuehr-verlangen.jpg"
          }
        ],
        "author": [
          {
            "@type": "Person",
            "name": "Markus Abrahamczyk",
            "url": "https://www.t-online.de/author/id_83634630/markus-abrahamczyk.html"
          },
          {
            "@type": "Organization",
            "name": "t-online"
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.t-online.de/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Mobilität",
            "item": "https://www.t-online.de/mobilitaet/"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Recht und Verkehr",
            "item": "https://www.t-online.de/mobilitaet/recht-und-verkehr/"
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": "Autokauf: Diese Assistenten werden Pflicht im Fahrzeug",
            "item": "https://www.t-online.de/mobilitaet/recht-und-verkehr/id_100243974/autokauf-diese-assistenten-werden-pflicht-im-fahrzeug.html"
          }
        ]
      }
    ]
  }
  `);

let testCase1_output = JSON.parse(`{
    "publisher": {
      "@type": "Organization",
      "name": "t-online",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.t-online.de/s/paper/_next/static/assets/t-online-mobile-a9e3b9d2cde84bae76536a505a3683d7.svg"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.t-online.de/mobilitaet/recht-und-verkehr/id_100243974/autokauf-diese-assistenten-werden-pflicht-im-fahrzeug.html"
    },
    "alternativeHeadline": "Von EU verordnet - Diese Assistenten werden Pflicht im Auto",
    "keywords": "Auto,EU,Unfall,Pflichtausstattung,100213474",
    "datePublished": "2023-09-15T14:08:53.431Z",
    "dateModified": "2023-09-16T06:13:00.000Z",
    "@type": "Article",
    "headline": "Autokauf: Diese Assistenten werden Pflicht im Fahrzeug",
    "image": [
      {
        "@type": "ImageObject",
        "url": "https://images.t-online.de/2022/07/92351056v3/0x100:1920x1080/fit-in/1800x0/nie-wieder-tempo-tickets-ein-neuer-assistent-kann-zu-schnelle-autos-bremsen-allerdings-duerfen-die-hersteller-dafuer-in-zukunft-eine-gebuehr-verlangen.jpg"
      },
      {
        "@type": "ImageObject",
        "url": "https://images.t-online.de/2022/07/92351056v3/69x0:1280x1280/fit-in/1800x0/nie-wieder-tempo-tickets-ein-neuer-assistent-kann-zu-schnelle-autos-bremsen-allerdings-duerfen-die-hersteller-dafuer-in-zukunft-eine-gebuehr-verlangen.jpg"
      },
      {
        "@type": "ImageObject",
        "url": "https://images.t-online.de/2022/07/92351056v3/240x100:1440x1080/fit-in/1800x0/nie-wieder-tempo-tickets-ein-neuer-assistent-kann-zu-schnelle-autos-bremsen-allerdings-duerfen-die-hersteller-dafuer-in-zukunft-eine-gebuehr-verlangen.jpg"
      }
    ],
    "author": [
      {
        "@type": "Person",
        "name": "Markus Abrahamczyk",
        "url": "https://www.t-online.de/author/id_83634630/markus-abrahamczyk.html"
      },
      {
        "@type": "Organization",
        "name": "t-online"
      }
    ]
  }`);


  const testCase2_input = JSON.parse(`[
    {
      "description": "Keine Mediathek, Störungen im Fernsehprogramm – das ZDF kämpfte am Donnerstag mit technischen Schwierigkeiten. Der Grund: Grabungsarbeiten hatten mehrere ...",
      "image": [
        {
          "url": "https://image.stern.de/33829962/t/lw/v1/w1440/r1/-/zdf-stoerungen-mediathek.jpg",
          "width": "1440",
          "height": "1440",
          "@type": "ImageObject"
        },
        {
          "url": "https://image.stern.de/33829962/t/84/v1/w1440/r1.3333/-/zdf-stoerungen-mediathek.jpg",
          "width": "1440",
          "height": "1080",
          "@type": "ImageObject"
        },
        {
          "url": "https://image.stern.de/33829962/t/x3/v1/w1440/r1.7778/-/zdf-stoerungen-mediathek.jpg",
          "width": "1440",
          "height": "810",
          "@type": "ImageObject"
        }
      ],
      "mainEntityOfPage": {
        "@id": "https://www.stern.de/kultur/tv/zdf--nicht-einer--gleich-zwei-bagger-loesten-stoerungen-beim-sender-aus-33829960.html",
        "@type": "WebPage"
      },
      "headline": "ZDF: Nicht einer, gleich zwei Bagger lösten Störungen beim Sender aus",
      "datePublished": "2023-09-15T17:34:00+02:00",
      "dateModified": "2023-09-15T17:34:46+02:00",
      "author": {
        "name": "STERN.de",
        "logo": {
          "url": "https://image.stern.de/8409704/uncropped-0-0/518606a9f3f7eb58ec9c84d12fcd8610/ds/stern-logo-schema-org.png",
          "width": "173",
          "height": "60",
          "@type": "ImageObject"
        },
        "@type": "Organization"
      },
      "publisher": {
        "name": "STERN.de",
        "logo": {
          "url": "https://image.stern.de/8409704/uncropped-0-0/518606a9f3f7eb58ec9c84d12fcd8610/ds/stern-logo-schema-org.png",
          "width": "173",
          "height": "60",
          "@type": "ImageObject"
        },
        "@type": "Organization"
      },
      "speakable": {
        "xpath": [
          "/html/head/title",
          "/html/head/meta[@name='description']/@content"
        ],
        "@type": "SpeakableSpecification"
      },
      "@context": "http://schema.org",
      "@type": "NewsArticle"
    },
    {
      "@context": "http://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "position": 1,
          "item": {
            "name": "Home",
            "@id": "https://www.stern.de/",
            "@type": "WebPage"
          },
          "@type": "ListItem"
        },
        {
          "position": 2,
          "item": {
            "name": "Kultur",
            "@id": "https://www.stern.de/kultur/",
            "@type": "WebPage"
          },
          "@type": "ListItem"
        },
        {
          "position": 3,
          "item": {
            "name": "TV",
            "@id": "https://www.stern.de/kultur/tv/",
            "@type": "WebPage"
          },
          "@type": "ListItem"
        },
        {
          "position": 4,
          "item": {
            "name": "ZDF: Nicht einer, gleich zwei Bagger lösten Störungen beim Sender aus",
            "@id": "https://www.stern.de/kultur/tv/zdf--nicht-einer--gleich-zwei-bagger-loesten-stoerungen-beim-sender-aus-33829960.html",
            "@type": "WebPage"
          },
          "@type": "ListItem"
        }
      ]
    }
  ]
  `);
  const testCase2_output = JSON.parse(`{
    "description": "Keine Mediathek, Störungen im Fernsehprogramm – das ZDF kämpfte am Donnerstag mit technischen Schwierigkeiten. Der Grund: Grabungsarbeiten hatten mehrere ...",
    "image": [
      {
        "url": "https://image.stern.de/33829962/t/lw/v1/w1440/r1/-/zdf-stoerungen-mediathek.jpg",
        "width": "1440",
        "height": "1440",
        "@type": "ImageObject"
      },
      {
        "url": "https://image.stern.de/33829962/t/84/v1/w1440/r1.3333/-/zdf-stoerungen-mediathek.jpg",
        "width": "1440",
        "height": "1080",
        "@type": "ImageObject"
      },
      {
        "url": "https://image.stern.de/33829962/t/x3/v1/w1440/r1.7778/-/zdf-stoerungen-mediathek.jpg",
        "width": "1440",
        "height": "810",
        "@type": "ImageObject"
      }
    ],
    "mainEntityOfPage": {
      "@id": "https://www.stern.de/kultur/tv/zdf--nicht-einer--gleich-zwei-bagger-loesten-stoerungen-beim-sender-aus-33829960.html",
      "@type": "WebPage"
    },
    "headline": "ZDF: Nicht einer, gleich zwei Bagger lösten Störungen beim Sender aus",
    "datePublished": "2023-09-15T17:34:00+02:00",
    "dateModified": "2023-09-15T17:34:46+02:00",
    "author": {
      "name": "STERN.de",
      "logo": {
        "url": "https://image.stern.de/8409704/uncropped-0-0/518606a9f3f7eb58ec9c84d12fcd8610/ds/stern-logo-schema-org.png",
        "width": "173",
        "height": "60",
        "@type": "ImageObject"
      },
      "@type": "Organization"
    },
    "publisher": {
      "name": "STERN.de",
      "logo": {
        "url": "https://image.stern.de/8409704/uncropped-0-0/518606a9f3f7eb58ec9c84d12fcd8610/ds/stern-logo-schema-org.png",
        "width": "173",
        "height": "60",
        "@type": "ImageObject"
      },
      "@type": "Organization"
    },
    "speakable": {
      "xpath": [
        "/html/head/title",
        "/html/head/meta[@name='description']/@content"
      ],
      "@type": "SpeakableSpecification"
    },
    "@context": "http://schema.org",
    "@type": "NewsArticle"
  }`);

  const testCase3_input = JSON.parse(`{
    "@context": "http://schema.org",
    "@type": "NewsArticle",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.kicker.de/die-spinne-von-froettmaning-hradecky-stolz-bayern-hatte-vielleicht-sogar-ein-bisschen-schiss-vor-uns-968858/artikel"
    },
    "headline": "Hradecky: &quot;Bayern hatte vielleicht sogar ein bisschen Schiss vor uns&quot;",
    "datePublished": "2023-09-16T15:14:07+02:00",
    "dateModified": "2023-09-16T15:14:07+02:00",
    "author": {
      "@type": "Organization",
      "name": "kicker"
    },
    "image": [
      "https://derivates.kicker.de/image/upload/c_crop,x_0,y_507,w_4000,h_2250/w_1200,q_auto/v1/2023/09/16/df37d966-ff10-4da0-ac7c-305cd3672f85.jpeg"
    ],
    "publisher": {
      "@type": "Organization",
      "name": "kicker",
      "logo": {
        "@type": "ImageObject",
        "url": "https://secure-mediadb.kicker.de/content/img/kicker_amp_logo_v04.png"
      }
    }
  }`);
  const testCase3_output = JSON.parse(`{
    "@context": "http://schema.org",
    "@type": "NewsArticle",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.kicker.de/die-spinne-von-froettmaning-hradecky-stolz-bayern-hatte-vielleicht-sogar-ein-bisschen-schiss-vor-uns-968858/artikel"
    },
    "headline": "Hradecky: &quot;Bayern hatte vielleicht sogar ein bisschen Schiss vor uns&quot;",
    "datePublished": "2023-09-16T15:14:07+02:00",
    "dateModified": "2023-09-16T15:14:07+02:00",
    "author": {
      "@type": "Organization",
      "name": "kicker"
    },
    "image": [
      "https://derivates.kicker.de/image/upload/c_crop,x_0,y_507,w_4000,h_2250/w_1200,q_auto/v1/2023/09/16/df37d966-ff10-4da0-ac7c-305cd3672f85.jpeg"
    ],
    "publisher": {
      "@type": "Organization",
      "name": "kicker",
      "logo": {
        "@type": "ImageObject",
        "url": "https://secure-mediadb.kicker.de/content/img/kicker_amp_logo_v04.png"
      }
    }
  }
  `);

test("testCase1: If $json_input is a graph: unwrap and call getEntity() on result", ()=>
{
    expect(jsonld2html.getMainEntity(testCase1_input)).toStrictEqual(testCase1_output);
});

test("testCase2: If $json_input is array, return element with property 'mainEntityOfPage' set (if any)", ()=>
{
    expect(jsonld2html.getMainEntity(testCase2_input)).toStrictEqual(testCase2_output);
});

console.log(typeof testCase3_input);
console.log(testCase3_input["@graph"]);
test("testCase3: If $json_input is no array or graph: return $json_input", ()=>
{
    expect(jsonld2html.getMainEntity(testCase3_input)).toStrictEqual(testCase3_output);
})
