#!/usr/bin/env node

/*Uso de librerias de node.js*/
const fs = require('fs');
const fetch = require("node-fetch");
// const chalk = require('chalk');

/*Variables globales*/
let links = [];
let startLink = 0;
let validate = false;
let stats = false;
let addOk = 0;
let addFail = 0;
let linkslarge = 0;
let unique = [];
let listFile = [];
let path;

//----leyendo directorio o archivos con extension .md-------
const returnLinks = ()=>{
   return links;
}

const validateExtensionFile = (path) => {
  links = [];
  return new Promise((res, reject) => {
    listFile = [];
    // validar si es archivo o directorio
    if (path == '' || path == undefined || path == null) {
      reject("No has ingresado un archivo");
      console.log("Te falta ingresar un archivo");  // nuevas, pero esta en options, subio el branch
      return;
    } 
    if (path.substr(-3) === '.md') {
      listFile.push(path);
      res(listFile);
      return;
    } 
  
    else {
      fs.readdir(path, function (err, files) { //Callback
        if(err){
          // console.log(err);
          // console.log("Hay un error con tu directorio"); 
          reject("Hay un error con tu directorio"); 
          // return 
            // break;
        }
        if (files == undefined || files == '') {
          console.log('No es archivo con extension md');
          // res('No encontro archivo md');
          reject("Error al leer directorio");
          return;
        }
        listFile = files.filter(function (file) {
          return file.substr(-3) === '.md';
        })
        if(listFile.length == 0){
          reject("No hay archivo .md");
          console.log("No encontró archivo .md");
        }
        for (let index = 0; index < listFile.length; index++) {
          listFile[index] = path + listFile[index];
        }
        res(listFile);
      });
  }
  }) //-----Fin promise
}; //-----Fin validateExtensionFile

//-----Funcion para leer archivos------------
const readMarkdown = () => {
  return new Promise((res, reject) => {
    links = [];
    let listFileLarge = listFile.length;
    // console.log("busco archivo en readMarkdown", res);
    for (let index = 0; index < listFile.length; index++) {
      fs.readFile(listFile[index], 'utf8',
        function (err, data) { //callback
          if (err) {  
            reject('No hay links en este archivo');      
            // console.log(err);    
            return 
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
        
          if (listFileLarge === 0){
            if(links.length === 0){
              console.log("No encuentro links en este archivo");
              res('No encuentro links en este archivo"');      
              return ;
              
            }else{
              res(links);
            }
          }
            // console.log(links);
        });
    } //---------final for
  }); //--------------Fin promesa2
} //----Fin readMarkdown()


//-----Contar UNIQUE----------
const uniqueLinks = () => {
  unique = [];
  
  let urls = links.map(function (element) {
    return element.href;
  });
  let sorted = urls.sort();

  unique = sorted.filter(function (value, index) { //Array "escondido"
    return value !== sorted[index + 1];
  });
  // return unique;  // Es un array
  // console.log(unique.length);

  if(unique.length === 0){
    unique.push("Algo ocurre, no podemos entregar tus links unicos");
    console.log("Algo ocurre, no podemos entregar tus links unicos");
    return unique;// Es un array
  }else{
    return unique;// Es un array
  }
  
}

//-----Stats, Estadisticas---------------
const statsLinks = (validate, stats) => {
  let resultStats = [];
  if (stats === true && validate === false) { // Corresponde al ingreso de --s
    resultStats.push('Total: ' + links.length);
    resultStats.push('Unique: ' + unique.length)
    console.log('Total: ' + links.length);
    console.log('Unique: ' + unique.length)
  }

  if (stats === true && validate === true) { // Corresponde al ingreso de --s y --v
    resultStats.push('Total: ' + links.length);
    resultStats.push('Unique: ' + unique.length)
    resultStats.push('Broken: ' + addFail);
    resultStats.push('Links ok: ' + addOk);
    console.log('Total: ' + links.length);
    console.log('Unique: ' + unique.length)
    console.log('Broken: ' + addFail);
    console.log('Links ok: ' + addOk);
  }

  if (stats === true){
    if (resultStats.length === 0) {
      resultStats.push("Algo ocurre, no podemos entregar tus estadisticas");
      console.log("Algo ocurre, no podemos entregar tus estadisticas");
      return resultStats;
    } else {
      return resultStats;
    }
  }else{
    return;
  }
};

//----------validar Links-------------
const validateLinks = (validate, stats) => {
  let resultArray = []; // array para realizar test

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
            resultArray.push(element.file + ' ' + element.href + ' ' + element.text);
            console.log(element.file + ' ' + element.href + ' ' + element.text);     
          }
          if (validate === true && stats === false) { // Ingresa --validate
            resultArray.push(element.file + ' ' + element.href + ' ' + response.statusText + ' ' + response.status + ' ' + element.text);
            console.log(element.file + ' ' + element.href + ' ' + response.statusText + ' ' + response.status + ' ' + element.text);
          }

          if (linkslarge === 0) {
            res(resultArray);
          }
        })
        .catch(function (err) { // Url caida
          // console.log("Tienes un error en tu status", err);
          linkslarge--;
          addFail++; // va sumando los errores

          if (validate === true && stats === false) {
            resultArray.push(element.file + ' ' + element.href + ' ' + 'Fail' + ' ' + '400' + ' ' + element.text);
            console.log(element.file + ' ' + element.href + ' ' + 'Fail' + ' ' + '400' + ' ' + element.text);
          }
          if (validate === false && stats === false) {  
            resultArray.push(element.file + ' ' + element.href + ' ' + element.text);
            console.log(element.file + ' ' + element.href + ' ' + element.text);
          }
          if (linkslarge === 0) {
            res(resultArray);      
          }
          if(resultArray === '') {
            reject('Hay errores en tus links');
          }
        });

    }); //----termina foreach 
  });
}; 
//------Fin validateLinks()----------


//------------------Lectura de archivo---------------

async function mdLinks(path, option) { //recibe el array //puedo cambiar el "nombre"
  let flagError  = false;
  option.forEach(element => {
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
  await validateLinks(validate, stats); // Función Segunda promesa, debe estar aqui adentro por su demora en validar cada link. Estando afuera no es leida.
  statsLinks(validate, stats);
} // Fin funcion mdLinks

module.exports.mdLinks = mdLinks;
module.exports.validateLinks = validateLinks;
module.exports.returnLinks = returnLinks;
module.exports.readMarkdown = readMarkdown;
module.exports.uniqueLinks = uniqueLinks;
module.exports.statsLinks = statsLinks;
module.exports.validateExtensionFile = validateExtensionFile;

// module.exports = {
//   method: readMarkdown()
// }

// exports.method = readMarkdown() {};


// module.exports= mdLinks;

// module.exports = {
//   mdLinks 
// }