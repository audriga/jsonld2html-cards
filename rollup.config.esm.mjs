import json from '@rollup/plugin-json';
import html from "rollup-plugin-html";

export default {
  input: "jsonld2html.js",
  output: {
    file: "jsonld2html-bundle.mjs",
    format: "esm"
  },
    plugins: [json(), html()]
  };