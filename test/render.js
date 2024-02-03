// Requirements
const Jsonld2html = require('../jsonld2html-bundle');
const fs = require('fs');
const path = require('path');

/* Description :
Iterating through the schema_org folder,
for each schema found, it will render the data with mustache
into the the default_card.html file and saving the HTML file in the ouptput folder
 */

async function buildTemplatesToString(_schemas_dir_path) {

    // getting list of schema data
    let schema_files = fs.readdirSync(_schemas_dir_path);
    console.log(schema_files.length + " files");

    // loading the HTML mustache template
    let html_content= "";
    let anchored_list = "";
    let error_files =  [];

    for (let file of schema_files) {

        let data_object;
        if(!(file.endsWith(".json"))) {break;}

        try {
            // Reading Schema.org Object (Json-ld Object) from schema_org
            data_object = fs.readFileSync(_schemas_dir_path + file);
            // Parsing to JSON
            data_object = JSON.parse(data_object);

            let rendered_ld = await Jsonld2html.render(data_object)
            let expandable_data_details = `
                        <br>
                        <br>
                         <details>
                            <summary>
                                Show me the JSON
                                <span class="icon">👇</span>
                            </summary>
                            <p><pre><code>
                                ${JSON.stringify(data_object,null,4)}
                                </code>
                                </pre>
                            </p>
                        </details>`



            anchored_list += ("<a href=#"+file+ ">" + file+ "</a><br>");

            // TODO make the heading also to a ref link, like in the example in ticket
            // TODO add a copy link icon

            // a heading used as divider and base for anchored links aswell as the copy link button
            let card_divider_heading = `<a href=#${file}><h3 id = ${file}> ${file} <button onclick=copyLinkFunction("${file}")><i class="fa-solid fa-link"></i> copy link </button></h3></a>`;

            // render the template with data
            html_content = html_content + card_divider_heading + (rendered_ld + expandable_data_details);

        }
        catch (error){
            console.error(error.name);

            console.error(error.message);
            error_files.push(file);
        }


        data_object = null;

    }
    console.log("\n" + "error files : " + "\n" + error_files);


    anchored_list = "<p>"+ anchored_list +"</p>"



    return anchored_list+ html_content;

}


function buildHtml(_html_header_string,_html_content_string) {
    return '<!DOCTYPE html>'
        + '<html><head>' + _html_header_string + '</head><body>' + _html_content_string + '</body></html>';
}


// Location of Schema json-ld sample data
const schemas_dir_path = "schema_org/";

// Output file
const outFolderPath = 'output/';
const outFileName = 'rendered_cards.html';

const outFilePath = path.join(outFolderPath, outFileName);
console.log('Storing to file path:', outFilePath);

// navgation bar

// Header for building the HTML file
let default_header = `<meta charSet="UTF-8"> 
        <title>default_cards</title> 
        <link rel="stylesheet" href="../../style/default_card.css"> 
        <script src="https://kit.fontawesome.com/4f20261f74.js" crossorigin="anonymous">
         
        </script>
        <script>
        function imageError(id) {
            document.getElementById(id).innerHTML ="Image failed";            
        }
        function copyLinkFunction(fileID){
            
            navigator.clipboard.writeText(window.location.href);
            
        }

        function goThroughAllImages() {

            var images = document.getElementsByTagName('img');
            var srcList = [];

            for(var i = 0; i < images.length; i++) {
                srcList.push(images[i].src);
                testImage(images[i].src).then(

                    function fulfilled(img) {
                        // need to catch this unwanted promise also
                    },

                    function rejected(img) {
                        console.log('That image was not found', img);
                    }

                );

            }
        }
        
        function testImage(url) {
            // Define the promise
            const imgPromise = new Promise(function imgPromise(resolve, reject) {

                // Create the image
                const imgElement = new Image();

                // When image is loaded, resolve the promise
                imgElement.addEventListener('load', function imgOnLoad() {
                    resolve(this);
                });

                // When there's an error during load, reject the promise
                imgElement.addEventListener('error', function imgOnError() {
                    reject(this);
                })

                // Assign URL
                imgElement.src = url;

            });

            return imgPromise;
        }

        window.addEventListener('load', function () {
                goThroughAllImages();
        })
        
    </script>
    
`
;

buildTemplatesToString(schemas_dir_path).then(template_out => {
    let outputHTML = buildHtml(default_header,template_out);

    fs.mkdir(outFolderPath, (err) => {
      if (err) {
          // Handle if the error is due to the folder already existing
        if (err.code ==! 'EEXIST') {
          console.error('Error creating folder:', err);
        }
      }
    });

    var stream = fs.createWriteStream(outFilePath);
    stream.once('open', function(fd) {
        let html = outputHTML;

        stream.end(html);
    })
})

