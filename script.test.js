'use strict';

const { JSDOM } = require('jsdom');

const options = {
  resources: 'usable',
  runScripts: 'dangerously',
};

JSDOM.fromFile('index.html', options).then((dom) => {
  dom.window.document.addEventListener('DOMContentLoaded', () => {
    console.log(dom.window.document.body.textContent.trim());
  });  
});
