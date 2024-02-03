export default {
    input: 'jsonld2html.js',
    output: {
        file: 'jsonld2html-bundle.js',
        format: 'umd',
        name:'Jsonld2html',
        globals: {
            mustache: 'Mustache'
        }
    }
};
