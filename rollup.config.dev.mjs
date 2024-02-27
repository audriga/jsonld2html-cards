import json from '@rollup/plugin-json';
import html from "rollup-plugin-html";

export default {
    plugins: [json(), html()]
  };