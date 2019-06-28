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
// let listFile = [];

//-----Funcion para leer archivos------------
const readMarkdown = (path) => {
  return new Promise((res, reject) => {
    // console.log(path);
    // // validar si es archivo o directorio
    // if (path.substr(-3) === '.md') {
    //   // console.log(path);
    //   listFile.push(path);
    // } else {

    //   fs.readdir(path, function (err, files) { //promesa!!!!!!!!!!!!!!!!!!
    //     console.log(files);
    //     listFile = files.filter(function (file) {
    //       return file.substr(-3) === '.md';
    //     })
    //   }); 
    // }
    // console.log(listFile.length);
    // for (let index = 0; index < listFile.length; index++) {


      fs.readFile(path, 'utf8',
        function (err, data) {
          if (err) {
            return console.log(err);
          }
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
                'file': path
              }
              links.push(myObjectUrl);
            }
          } // -------Fin ciclo while-----------
          // console.log(links.length);
          res('Terminado readFile');
        });
    // } final for
    // res('Terminado readFile');
  }); //--------------Fin promesa2---------
} //----Fin readMarkdown()-----------


/*Crear un array nuevo con los elementos unicos y este mostrar*/
//-----Contar UNIQUE----------
const uniqueLinks =()=>{
let urls = links.map(function (element) { return element.href; });
let sorted = urls.sort();

unique = sorted.filter(function (value, index) {
    return value !== sorted[index + 1];
});

// console.log(unique.length);
}

//-----------Promesa para validar-------------
const validateLinks =()=>{ 
  return new Promise((res, reject)=> {
      //Inicio contador de links ok y fail    
      addOk = 0;
      addFail = 0;

      //----------Declaración de la promesa--------------------------
      // let promesa = new Promise((res, rej) => {
        linkslarge = links.length;
        links.forEach(element => {
          fetch(element.href) //Ejecuta una url/links
            .then(function (response) {
              linkslarge--;
              addOk++;

              if (validate === false && stats === false) { // Sin ingreso de validate o stats
                console.log(element.file + ' ' + element.href + ' ' + element.text);
              }
              if (validate === true && stats === false) { // Ingresa --validate
                console.log(element.file + ' ' + element.href + ' ' + response.statusText + ' ' + response.status + ' ' + element.text); 
              }

              if (linkslarge === 0) {
                //   console.log('linkslarge: ' + linkslarge);
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
}//------Fin validateLinks()----------

//---------Funcion para SOLO leer archivos .md-------
const validateExtensionFile=(path)=>{
// console.log('Validando la extension del nombre'); 
}

//------------------Lectura de archivo---------------
const mdLinks = (path) => {
 
  validateExtensionFile(path); //Funcion para validar la extension


  readMarkdown(path) // Función Primera return promesa, me devuelve una promesa
    .then((respuesta) => { //dentro de mi then llamo a validteLinks
      // console.log('Promesa del readMarkdown');
      uniqueLinks();
      validateLinks() // Función Segunda promesa, debe estar aqui adentro por su demora en validar cada link. Estando afuera no es leida.
        .then((respuesta) => {

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
        });
    })
    .catch((error) => {
      console.log('error')
    });
}



/****************************************************************************************************************/
//-------Uso de process----------
process.argv.forEach((option, index, array) => {

  if (index > 1 && index < 5) {
    if (option == '--validate' || option == '--v') {
      validate = true;
    } else if (option == '--stats' || option == '--s') {
      stats = true;
    } else {
      console.log('No es valida esta opción', option);
    }
  }
});


mdLinks('./prueba.md'); //FALTA: lograr que sea llamada mi funcion y que se le pase cualquier archivo
// mdLinks('./archivos md/'); //FALTA: lograr que sea llamada mi funcion y que se le pase cualquier archivo
