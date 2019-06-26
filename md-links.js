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

const readMarkdown = (path) =>{  //Funcion para leer archivos
  let promesa2 = new Promise((res, rej) => {  //-----Inicio promesa2-----------
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
      res('Terminado readFile');
    });
  });//--------------Fin promesa2---------
  
 
      //----------LLamando a la promesa2--------------------------
      promesa2.then((respuesta) => { // Obtengo el resultado de mi promesa (resolve)
// console.log(respuesta); ---> respuesta recoge lo que entrega 'res'
        validateLinks(); // Llamo la que esta arriba
      }, (error) => { // Es el reject
        console.log('si hay:  ' + error);
      }); //------fin llamado promesa2--------

}//----Fin readMarkdown()-----------

const validateLinks =()=>{ //Promesa para validar
      //Inicio contador de links ok y fail    
      addOk = 0;
      addFail = 0;

      //----------Declaración de la promesa--------------------------
      let promesa = new Promise((res, rej) => {
        linkslarge = links.length;
        links.forEach(element => {
          fetch(element.href) //Ejecuta una url/links
            .then(function (response) {
              linkslarge--;
              addOk++;

              if (validate === false && stats === false) {
                console.log(element.file + ' ' + element.href + ' ' + element.text); // Sin ingreso de validate o stats
              }
              if (validate === true && stats === false) {
                console.log(element.file + ' ' + element.href + ' ' + response.statusText + ' ' + response.status + ' ' + element.text); // Ingresa --validate
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
              linkslarge--;
              addFail++; // va sumando los errores
              // console.log('catch url fail : ' + element.href);
              // console.log('--------------------------------------------------------');
              if (linkslarge === 0) {
                //   console.log(linkslarge);
                res('Termine el proceso');
              }
            });

        });
      });

      //----------LLamando a la promesa--------------------------
      promesa.then((respuesta) => { // Obtengo el resultado de mi promesa (resolve)

        if (stats === true && validate === false) { // Corresponde al ingreso de --s
          console.log('Total: ' + links.length);
          console.log('Unique: ' + addOk)
        }

        if (stats === true && validate === true) { // Corresponde al ingreso de --s y --v
          console.log('Total: ' + links.length);
          console.log('Unique: ' + addOk)
          console.log('Broken: ' + addFail);
        }
      }, (error) => { // Es el reject
        console.log('si hay:  ' + error);
      });
}//------Fin validateLinks()----------
const validateExtensionFile=(path)=>{
console.log('Validando la extension del nombre'); //que solo lea archivos md
}

//------------------Lectura de archivo---------------
const searchLinks = (path) => {
  validateExtensionFile(path); //Funcion para validar la extension
  readMarkdown(path);
  
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


searchLinks('./prueba.md'); //FALTA: lograr que sea llamada mi funcion y que se le pase cualquier archivo
