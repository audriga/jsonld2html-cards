const jsonld2html = require("../../jsonld2html-bundle.js");

// ===== Test Cases for ImageExtraction =====

// ===== Test Case 1 ======

test("Extract Image - testCase1: image url located in an Array of ImageObjects", ()=> 
{
  expect(jsonld2html.extractImage(JSON.parse(`{
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
    "thumbnailUrl": "https://images.bild.de/650343ec3a011448790b53a1/ec4c87d449bb5a0739d956a236eb68a8-landscape,255b4745?w=1280"
  }`));
});


// ===== Test Case 2 ======

test("Extract Image - testCase2: image url located in an Array of Urls", ()=> 
{
  expect(jsonld2html.extractImage(JSON.parse(`{
    "@context": "http://schema.org/",
    "@type": "Product",
    "name": "Slim Fit Poloshirt",
    "description": "Dieses Poloshirt mit schmaler Passform passt perfekt zu deinem Casual Style.",
    "mpn": "993EE2K301",
    "sku": "993EE2K301",
    "brand": {
        "@type": "Brand",
        "name": "ESPRIT"
    },
    "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.5",
        "reviewCount": 4
    },
    "image": [
        "https://www.esprit.de/dw/image/v2/BDSS_PRD/on/demandware.static/-/Sites-esprit-master/default/dw7791434a/images/10/993/993EE2K301_430_10.jpg?sfrm=jpg",
        "https://www.esprit.de/dw/image/v2/BDSS_PRD/on/demandware.static/-/Sites-esprit-master/default/dw252a14b7/images/14/993/993EE2K301_430_14.jpg?sfrm=jpg",
        "https://www.esprit.de/dw/image/v2/BDSS_PRD/on/demandware.static/-/Sites-esprit-master/default/dw941959db/images/16/993/993EE2K301_430_16.jpg?sfrm=jpg",
        "https://www.esprit.de/dw/image/v2/BDSS_PRD/on/demandware.static/-/Sites-esprit-master/default/dwdb362026/images/11/993/993EE2K301_430_11.jpg?sfrm=jpg",
        "https://www.esprit.de/dw/image/v2/BDSS_PRD/on/demandware.static/-/Sites-esprit-master/default/dw1ea7bf59/images/15/993/993EE2K301_430_15.jpg?sfrm=jpg",
        "https://www.esprit.de/dw/image/v2/BDSS_PRD/on/demandware.static/-/Sites-esprit-master/default/dw24177657/images/17/993/993EE2K301_430_17.jpg?sfrm=jpg",
        "https://www.esprit.de/dw/image/v2/BDSS_PRD/on/demandware.static/-/Sites-esprit-master/default/dwd0b7c954/images/20/993/993EE2K301_430_20.jpg?sfrm=jpg"
    ],
    "offers": {
        "url": "https://www.esprit.de/p/slim-fit-poloshirt-993EE2K301.html",
        "@type": "AggregateOffer",
        "lowprice": 19.99,
        "highprice": 29.99,
        "priceCurrency": "EUR",
        "itemCondition": "https://schema.org/NewCondition",
        "availability": "http://schema.org/InStock"
    }
}`)))
  .toStrictEqual(JSON.parse(`{
    "@context": "http://schema.org/",
    "@type": "Product",
    "name": "Slim Fit Poloshirt",
    "description": "Dieses Poloshirt mit schmaler Passform passt perfekt zu deinem Casual Style.",
    "mpn": "993EE2K301",
    "sku": "993EE2K301",
    "brand": {
        "@type": "Brand",
        "name": "ESPRIT"
    },
    "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.5",
        "reviewCount": 4
    },
    "image": [
        "https://www.esprit.de/dw/image/v2/BDSS_PRD/on/demandware.static/-/Sites-esprit-master/default/dw7791434a/images/10/993/993EE2K301_430_10.jpg?sfrm=jpg",
        "https://www.esprit.de/dw/image/v2/BDSS_PRD/on/demandware.static/-/Sites-esprit-master/default/dw252a14b7/images/14/993/993EE2K301_430_14.jpg?sfrm=jpg",
        "https://www.esprit.de/dw/image/v2/BDSS_PRD/on/demandware.static/-/Sites-esprit-master/default/dw941959db/images/16/993/993EE2K301_430_16.jpg?sfrm=jpg",
        "https://www.esprit.de/dw/image/v2/BDSS_PRD/on/demandware.static/-/Sites-esprit-master/default/dwdb362026/images/11/993/993EE2K301_430_11.jpg?sfrm=jpg",
        "https://www.esprit.de/dw/image/v2/BDSS_PRD/on/demandware.static/-/Sites-esprit-master/default/dw1ea7bf59/images/15/993/993EE2K301_430_15.jpg?sfrm=jpg",
        "https://www.esprit.de/dw/image/v2/BDSS_PRD/on/demandware.static/-/Sites-esprit-master/default/dw24177657/images/17/993/993EE2K301_430_17.jpg?sfrm=jpg",
        "https://www.esprit.de/dw/image/v2/BDSS_PRD/on/demandware.static/-/Sites-esprit-master/default/dwd0b7c954/images/20/993/993EE2K301_430_20.jpg?sfrm=jpg"
    ],
    "offers": {
        "url": "https://www.esprit.de/p/slim-fit-poloshirt-993EE2K301.html",
        "@type": "AggregateOffer",
        "lowprice": 19.99,
        "highprice": 29.99,
        "priceCurrency": "EUR",
        "itemCondition": "https://schema.org/NewCondition",
        "availability": "http://schema.org/InStock"
    },
    "thumbnailUrl": "https://www.esprit.de/dw/image/v2/BDSS_PRD/on/demandware.static/-/Sites-esprit-master/default/dw7791434a/images/10/993/993EE2K301_430_10.jpg?sfrm=jpg"
}`));
});


// ===== Test Case 3 ======

test("Extract Image - testCase3: thumbnailUrl exists already, nothing to change", ()=> 
{
  expect(jsonld2html.extractImage(JSON.parse(`{
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": "Scientists spin theory that incy wincy spiders are dreaming",
    "publisher": {
      "@type": "Organization",
      "name": "The Times",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.thetimes.co.uk/d/img/dual_masthead_small-8c204c6cb9.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.thetimes.co.uk/article/scientists-spin-theory-that-incy-wincy-spiders-are-dreaming-nwhnffrpd"
    },
    "dateCreated": "2023-09-15T10:00:00.000Z",
    "datePublished": "2023-09-15T10:00:00.000Z",
    "isAccessibleForFree": false,
    "hasPart": {
      "@type": "WebPageElement",
      "isAccessibleForFree": false,
      "cssSelector": ".paywall-EAB47CFD"
    },
    "image": {
      "@type": "ImageObject",
      "url": "https://www.thetimes.co.uk/imageserver/image/%2Fmethode%2Ftimes%2Fprod%2Fweb%2Fbin%2F3c960d32-539b-11ee-a518-203f78f24415.jpg?crop=4204%2C2365%2C0%2C219&resize=1200",
      "caption": "Jumping spiders may be experiencing the sleep phase that is closely associated with dreaming"
    },
    "thumbnailUrl": "https://www.thetimes.co.uk/imageserver/image/%2Fmethode%2Ftimes%2Fprod%2Fweb%2Fbin%2F3c960d32-539b-11ee-a518-203f78f24415.jpg?crop=4204%2C2365%2C0%2C219",
    "dateModified": "2023-09-15T10:01:56.000Z",
    "author": [
      {
        "@type": "Person",
        "name": "Keiran Southern",
        "jobTitle": "Contributor",
        "sameAs": [
          "https://thetimes.co.uk/profile/keiran-southern",
          "https://twitter.com/KeiranSouthern"
        ]
      }
    ],
    "articleSection": "World",
    "keywords": "Section:World",
    "articleId": "6e9117de-5399-11ee-a518-203f78f24415",
    "url": "https://www.thetimes.co.uk/article/scientists-spin-theory-that-incy-wincy-spiders-are-dreaming-nwhnffrpd",
    "isPartOf": {
      "@type": [
        "CreativeWork",
        "Product"
      ],
      "name": "The Times & The Sunday Times",
      "productID": "thetimes.co.uk:basic"
    }
  }
  `)))
  .toStrictEqual(JSON.parse(`{
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": "Scientists spin theory that incy wincy spiders are dreaming",
    "publisher": {
      "@type": "Organization",
      "name": "The Times",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.thetimes.co.uk/d/img/dual_masthead_small-8c204c6cb9.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.thetimes.co.uk/article/scientists-spin-theory-that-incy-wincy-spiders-are-dreaming-nwhnffrpd"
    },
    "dateCreated": "2023-09-15T10:00:00.000Z",
    "datePublished": "2023-09-15T10:00:00.000Z",
    "isAccessibleForFree": false,
    "hasPart": {
      "@type": "WebPageElement",
      "isAccessibleForFree": false,
      "cssSelector": ".paywall-EAB47CFD"
    },
    "image": {
      "@type": "ImageObject",
      "url": "https://www.thetimes.co.uk/imageserver/image/%2Fmethode%2Ftimes%2Fprod%2Fweb%2Fbin%2F3c960d32-539b-11ee-a518-203f78f24415.jpg?crop=4204%2C2365%2C0%2C219&resize=1200",
      "caption": "Jumping spiders may be experiencing the sleep phase that is closely associated with dreaming"
    },
    "thumbnailUrl": "https://www.thetimes.co.uk/imageserver/image/%2Fmethode%2Ftimes%2Fprod%2Fweb%2Fbin%2F3c960d32-539b-11ee-a518-203f78f24415.jpg?crop=4204%2C2365%2C0%2C219",
    "dateModified": "2023-09-15T10:01:56.000Z",
    "author": [
      {
        "@type": "Person",
        "name": "Keiran Southern",
        "jobTitle": "Contributor",
        "sameAs": [
          "https://thetimes.co.uk/profile/keiran-southern",
          "https://twitter.com/KeiranSouthern"
        ]
      }
    ],
    "articleSection": "World",
    "keywords": "Section:World",
    "articleId": "6e9117de-5399-11ee-a518-203f78f24415",
    "url": "https://www.thetimes.co.uk/article/scientists-spin-theory-that-incy-wincy-spiders-are-dreaming-nwhnffrpd",
    "isPartOf": {
      "@type": [
        "CreativeWork",
        "Product"
      ],
      "name": "The Times & The Sunday Times",
      "productID": "thetimes.co.uk:basic"
    }
  }
  `));
  
});




