const jsonld2html = require('../../jsonld2html-bundle.js');

test("Create View Action - testCase1: No potentialAction in the json, and value of mainEntityOfPage is a string", ()=>
{
    expect(jsonld2html.createPotentialViewAction(JSON.parse(`{
      "@type": "Article",
      "@context": "http://schema.org",
      "inLanguage": "en-US",
      "url": "https://www.nytimes.com/wirecutter/reviews/the-best-pen/",
      "mainEntityOfPage": "https://www.nytimes.com/wirecutter/reviews/the-best-pen/",
      "image": "https://cdn.thewirecutter.com/wp-content/media/2021/09/pens-2048px-6546-3x2-1.jpg?auto=webp&quality=75&crop=3:2&width=1024",
      "thumbnailUrl": "https://cdn.thewirecutter.com/wp-content/media/2021/09/pens-2048px-6546-3x2-1.jpg?auto=webp&quality=75&crop=3:2&width=1024",
      "name": "The Best Pen",
      "headline": "The Best Pen",
      "alternativeHeadline": "The 6 Best Pens of 2023",
      "description": "The Uni-ball Jetstream RT is the best pen for most people. It’s affordable and quick to dry. And it writes smoothly and won’t skip or bleed.",
      "datePublished": "November 30, 2015 at 12:00 a.m. ET",
      "dateModified": "2023-09-15T10:45:51.000-04:00",
      "author": [
        {
          "@type": "Person",
          "name": "Melanie Pinola",
          "email": "notes@wirecutter.com",
          "description": "Melanie Pinola covers home office, remote work, and productivity as a senior staff writer at Wirecutter. She has contributed to print and online publications such as The New York Times, Consumer Reports, Lifehacker, and PCWorld, specializing in tech, work, and lifestyle/family topics. She’s thrilled when those topics intersect—and when she gets to write about them in her PJs.",
          "jobTitle": null,
          "sameAs": "https://twitter.com/melaniepinola",
          "image": "https://cdn.thewirecutter.com/wp-content/uploads/2015/11/pinola-melanie.jpg?auto=webp&quality=60&crop=1:1"
        }
      ],
      "publisher": {
        "@type": "Organization",
        "name": "Wirecutter",
        "url": "https://www.nytimes.com/wirecutter/",
        "sameAs": [
          "https://www.facebook.com/thewirecutter/",
          "https://www.instagram.com/wirecutter/",
          "https://twitter.com/wirecutter/",
          "https://www.linkedin.com/company/the-wirecutter/",
          "https://www.youtube.com/wirecutter"
        ],
        "logo": {
          "@type": "ImageObject",
          "url": "https://cdn.thewirecutter.com/wp-content/uploads/2020/05/nytimes-wirecutter-logo.png",
          "width": 266,
          "height": 34
        }
      }
    }`)))
    .toStrictEqual(JSON.parse(`{
      "@type": "Article",
      "@context": "http://schema.org",
      "inLanguage": "en-US",
      "url": "https://www.nytimes.com/wirecutter/reviews/the-best-pen/",
      "mainEntityOfPage": "https://www.nytimes.com/wirecutter/reviews/the-best-pen/",
      "image": "https://cdn.thewirecutter.com/wp-content/media/2021/09/pens-2048px-6546-3x2-1.jpg?auto=webp&quality=75&crop=3:2&width=1024",
      "thumbnailUrl": "https://cdn.thewirecutter.com/wp-content/media/2021/09/pens-2048px-6546-3x2-1.jpg?auto=webp&quality=75&crop=3:2&width=1024",
      "name": "The Best Pen",
      "headline": "The Best Pen",
      "alternativeHeadline": "The 6 Best Pens of 2023",
      "description": "The Uni-ball Jetstream RT is the best pen for most people. It’s affordable and quick to dry. And it writes smoothly and won’t skip or bleed.",
      "datePublished": "November 30, 2015 at 12:00 a.m. ET",
      "dateModified": "2023-09-15T10:45:51.000-04:00",
      "author": [
        {
          "@type": "Person",
          "name": "Melanie Pinola",
          "email": "notes@wirecutter.com",
          "description": "Melanie Pinola covers home office, remote work, and productivity as a senior staff writer at Wirecutter. She has contributed to print and online publications such as The New York Times, Consumer Reports, Lifehacker, and PCWorld, specializing in tech, work, and lifestyle/family topics. She’s thrilled when those topics intersect—and when she gets to write about them in her PJs.",
          "jobTitle": null,
          "sameAs": "https://twitter.com/melaniepinola",
          "image": "https://cdn.thewirecutter.com/wp-content/uploads/2015/11/pinola-melanie.jpg?auto=webp&quality=60&crop=1:1"
        }
      ],
      "publisher": {
        "@type": "Organization",
        "name": "Wirecutter",
        "url": "https://www.nytimes.com/wirecutter/",
        "sameAs": [
          "https://www.facebook.com/thewirecutter/",
          "https://www.instagram.com/wirecutter/",
          "https://twitter.com/wirecutter/",
          "https://www.linkedin.com/company/the-wirecutter/",
          "https://www.youtube.com/wirecutter"
        ],
        "logo": {
          "@type": "ImageObject",
          "url": "https://cdn.thewirecutter.com/wp-content/uploads/2020/05/nytimes-wirecutter-logo.png",
          "width": 266,
          "height": 34
        }
      },
      "potentialAction": {
          "@type": "ViewAction",
          "target": "https://www.nytimes.com/wirecutter/reviews/the-best-pen/"
      }
  }`));
});

test("Create View Action - testCase1: No potentialAction in the json, value of mainEntityOfPage is a object with an id value of type string", ()=>
{
    expect(jsonld2html.createPotentialViewAction(JSON.parse(`{
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": "Die Luxus-Autos von Kane | Sport",
      "description": "Das ist ungewöhnlich für einen Bayern-Star!",
      "url": "https://www.bild.de/video/clip/sport-videos/seltener-auto-geschmack-die-luxus-karren-von-kane-85412832.bild.html",
      "datePublished": "2023-09-15T15:00:56.854Z",
      "dateModified": "2023-09-15T15:00:56.854Z",
      "author": {
          "@type": "Organization",
          "name": "BILD"
      },
      "keywords": "Autos, FC Bayern München, Harry Kane",
      "isFamilyFriendly": true,
      "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "https://www.bild.de/video/clip/sport-videos/seltener-auto-geschmack-die-luxus-karren-von-kane-85412832.bild.html"
      },
      "publisher": {
          "@type": "NewsMediaOrganization",
          "url": "https://www.bild.de/",
          "name": "BILD",
          "logo": {
              "@type": "ImageObject",
              "url": "https://article.bildstatic.de/img/BILD-Logo.6b1e9ea.png",
              "width": "148",
              "height": "149",
              "name": "BILD Logo"
          },
          "sameAs": [
              "https://twitter.com/bild",
              "https://www.facebook.com/bild",
              "https://de.wikipedia.org/wiki/Bild_(Zeitung)",
              "https://de.wikipedia.org/wiki/Bild.de",
              "https://de.wikipedia.org/wiki/Bild_(Fernsehsender)",
              "https://www.instagram.com/bild/",
              "https://www.youtube.com/@bild",
              "https://www.axelspringer.com/de/marken/bild"
          ]
      },
      "image": [
          {
              "@type": "ImageObject",
              "url": "https://images.bild.de/650343ec3a011448790b53a1/ec4c87d449bb5a0739d956a236eb68a8-landscape,255b4745?w=1280",
              "width": "1280",
              "height": "720",
              "name": "Das ist ungewöhnlich für einen Bayern-Star!"
          },
          {
              "@type": "ImageObject",
              "url": "https://images.bild.de/650343ec3a011448790b53a1/6edb096ed3063a54d495ae14abadcab2,8d3c7424?w=654",
              "width": "654",
              "height": "654",
              "name": "Teaser-Bild"
          }
      ]
  }`)))
  .toStrictEqual(JSON.parse(`{
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": "Die Luxus-Autos von Kane | Sport",
      "description": "Das ist ungewöhnlich für einen Bayern-Star!",
      "url": "https://www.bild.de/video/clip/sport-videos/seltener-auto-geschmack-die-luxus-karren-von-kane-85412832.bild.html",
      "datePublished": "2023-09-15T15:00:56.854Z",
      "dateModified": "2023-09-15T15:00:56.854Z",
      "author": {
          "@type": "Organization",
          "name": "BILD"
      },
      "keywords": "Autos, FC Bayern München, Harry Kane",
      "isFamilyFriendly": true,
      "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "https://www.bild.de/video/clip/sport-videos/seltener-auto-geschmack-die-luxus-karren-von-kane-85412832.bild.html"
      },
      "publisher": {
          "@type": "NewsMediaOrganization",
          "url": "https://www.bild.de/",
          "name": "BILD",
          "logo": {
              "@type": "ImageObject",
              "url": "https://article.bildstatic.de/img/BILD-Logo.6b1e9ea.png",
              "width": "148",
              "height": "149",
              "name": "BILD Logo"
          },
          "sameAs": [
              "https://twitter.com/bild",
              "https://www.facebook.com/bild",
              "https://de.wikipedia.org/wiki/Bild_(Zeitung)",
              "https://de.wikipedia.org/wiki/Bild.de",
              "https://de.wikipedia.org/wiki/Bild_(Fernsehsender)",
              "https://www.instagram.com/bild/",
              "https://www.youtube.com/@bild",
              "https://www.axelspringer.com/de/marken/bild"
          ]
      },
      "image": [
          {
              "@type": "ImageObject",
              "url": "https://images.bild.de/650343ec3a011448790b53a1/ec4c87d449bb5a0739d956a236eb68a8-landscape,255b4745?w=1280",
              "width": "1280",
              "height": "720",
              "name": "Das ist ungewöhnlich für einen Bayern-Star!"
          },
          {
              "@type": "ImageObject",
              "url": "https://images.bild.de/650343ec3a011448790b53a1/6edb096ed3063a54d495ae14abadcab2,8d3c7424?w=654",
              "width": "654",
              "height": "654",
              "name": "Teaser-Bild"
          }
      ],
      "potentialAction": {
          "@type": "ViewAction",
          "target": "https://www.bild.de/video/clip/sport-videos/seltener-auto-geschmack-die-luxus-karren-von-kane-85412832.bild.html"
      }
  }`));
});

test("Create View Action - testCase1: potentialAction in the json, do noting", ()=>
{
    expect(jsonld2html.createPotentialViewAction(JSON.parse(`{
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "The Atlantic",
      "url": "https://www.theatlantic.com",
      "inLanguage": "en-US",
      "issn": "1072-7825",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://www.theatlantic.com/search/?q={q}",
        "query-input": "required name=q"
      }
    }`))).toStrictEqual(JSON.parse(`{
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "The Atlantic",
      "url": "https://www.theatlantic.com",
      "inLanguage": "en-US",
      "issn": "1072-7825",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://www.theatlantic.com/search/?q={q}",
        "query-input": "required name=q"
      }
    }`));
});


