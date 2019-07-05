#!/usr/bin/env node

const mdLinks = require('./mdlinks');
/*Variables globales*/
let path;
let optionFuction = [];

//-------Uso de process----------
process.argv.forEach((option, index) => {

  if (index > 1 && index < 5) {
    if (index === 2) {
      path = option;
      // console.log(path);
    } else {
      optionFuction.push(
        option
        // "opcion": option
      );
    }
  }
});

mdLinks.mdLinks(path,optionFuction)
