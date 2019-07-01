#!/usr/bin/env node

/*Uso de librerias de node.js*/
const fs = require('fs');
const fetch = require("node-fetch");

/*Variables globales*/
let links = [];
let startLink = 0;
let validate = false;
let stats = false;
let addOk = 0;
let addFail = 0;
let linkslarge = 0;
let unique = 0;
let listFile = [];
let path;

//----leyendo directorio o archivos con extension .md-------

const validateExtensionFile = (path) => {
  return new Promise((res, reject) => {
    // validar si es archivo o directorio
    if (path.substr(-3) === '.md') {
      listFile.push(path);
      res('Es un archivo');
    } else {

      fs.readdir(path, function (err, files) { //Callback
        if (files == undefined || files == '') {
          console.log('No es archivo con extension md');
          // res('No encontro archivo md');
          return;
        }
        // console.log(path);
        // console.log(files);
        listFile = files.filter(function (file) {
          return file.substr(-3) === '.md';
        })
        // console.log(path);
        for (let index = 0; index < listFile.length; index++) {
          listFile[index] = path + listFile[index];

        }
        // console.log(listFile);
        res('Es un directorio');
      });
    }
  }) //-----Fin promise
}; //-----Fin validateExtensionFile

//-----Funcion para leer archivos------------
const readMarkdown = () => {
  return new Promise((res, reject) => {
    let listFileLarge = listFile.length;

    for (let index = 0; index < listFile.length; index++) {
      fs.readFile(listFile[index], 'utf8',
        function (err, data) { //callback
          if (err) {
            return console.log(err);
          }
          listFileLarge--;
          // ------------ Inicio ciclo While----------
          /*Permite la búsqueda de los links, mediante el uso de Vanilla js*/
          startLink = 0;
          while (startLink < data.length) {
            startLink = data.indexOf('http', startLink);
            if (startLink < 0) {
              break;
            }

            let endLink = data.indexOf(')', startLink);
            let myUrl = data.substring(startLink, endLink);
            startLink++;

            let endTitle = data.lastIndexOf(']', startLink);
            let startTitle = data.lastIndexOf('[', endTitle);
            startTitle++;

            let myTitle = data.substring(startTitle, endTitle);
            //  Si en mi url encuentro un enter no realizo el push
            let searchEnter = myUrl.indexOf('\n', 0); // El comando \n  hace un salto de linea. 
            let searchParenthesis = startLink - 2;
            let searchExclamation = startTitle - 2;

            if (searchEnter < 0 && data[searchParenthesis] == '(' && data[searchExclamation] != '!') { // Si no encuentra un "enter" y una imagen
              let myObjectUrl = {
                'href': myUrl,
                'text': myTitle,
                'file': listFile[index]
              }
              links.push(myObjectUrl);
            }
          } // -------Fin ciclo while
          // if (listFile.length -1  === index)
          if (listFileLarge === 0)
            res('Terminado readFile');
        });
    } //---------final for
  }); //--------------Fin promesa2
} //----Fin readMarkdown()


//-----Contar UNIQUE----------
const uniqueLinks = () => {
  let urls = links.map(function (element) {
    return element.href;
  });
  let sorted = urls.sort();

  unique = sorted.filter(function (value, index) {
    return value !== sorted[index + 1];
  });
  // console.log(unique.length);
}

//-----Stats, Estadisticas---------------
const statsLinks = () => {
  if (stats === true && validate === false) { // Corresponde al ingreso de --s
    console.log('Total: ' + links.length);
    console.log('Unique: ' + unique.length)
  }

  if (stats === true && validate === true) { // Corresponde al ingreso de --s y --v
    console.log('Total: ' + links.length);
    console.log('Unique: ' + unique.length)
    console.log('Broken: ' + addFail);
    console.log('Links ok: ' + addOk);
  }
}

//----------validar Links-------------
const validateLinks = () => {
  return new Promise((res, reject) => {
    //Inicio contador de links ok y fail    
    addOk = 0;
    addFail = 0;
    linkslarge = links.length;
    links.forEach(element => {

      fetch(element.href) //Ejecuta una url/links
        .then(function (response) {
          addOk++;
          linkslarge--;
          if (validate === false && stats === false) { // Sin ingreso de validate o stats
            console.log(element.file + ' ' + element.href + ' ' + element.text);
          }
          if (validate === true && stats === false) { // Ingresa --validate
            console.log(element.file + ' ' + element.href + ' ' + response.statusText + ' ' + response.status + ' ' + element.text);
          }

          if (linkslarge === 0) {
            res('Termine de ejecutar la promesa');
          }
        })
        .then(function (data) { // Data de la url
          // console.log('data = ', data);
        })
        .catch(function (err) { // Url caida
          // console.log(err);
          linkslarge--;
          addFail++; // va sumando los errores
          // console.log('catch url fail : ' + element.href);
          // console.log('--------------------------------------------------------');
          if (validate === true && stats === false) {
            console.log(element.file + ' ' + element.href + ' ' + 'Fail' + ' ' + '400' + ' ' + element.text);
          }
          if (validate === false && stats === false) {
            console.log(element.file + ' ' + element.href + ' ' + element.text);
          }
          if (linkslarge === 0) {
            //   console.log(linkslarge);
            res('Termine el proceso');
          }
        });
    });
  });
} //------Fin validateLinks()----------


//------------------Lectura de archivo---------------
async function mdLinks(path, option) {
  let flagError  = false;
  option.forEach(element => {
    // if (element.validate === true)
    //   validate = true;
    // if (element.stats === true)
    //   stats = true;
      if (element == '--validate' || element == '--v') {
        validate = true;
  
      } else if (element == '--stats' || element == '--s') {
        stats = true;
  
      } else {
  
        console.log('No es valida esta opción', element);
        flagError = true;
        return;
      }
    })

   if (flagError){
     console.log("No  es posible procesar");
     return;
   }





  if (path == undefined || path == null || path == '') {
    console.log('El nombre del archivo esta vacio');
    return;
  }

  await validateExtensionFile(path); //Funcion para validar la extension y si es archivo o directorio 
  await readMarkdown();
  uniqueLinks();
  await validateLinks(); // Función Segunda promesa, debe estar aqui adentro por su demora en validar cada link. Estando afuera no es leida.
  statsLinks();
} // Fin funcion mdLinks

module.exports = mdLinks;
