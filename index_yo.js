// ----- expresion de funcion anonima autoejecutable--------

// (function(){

// })();

// (function saludar(){
//     alert("hola");
// })
// saludar();

// // quedaria así ..
// (function(){
//     alert("hola");
// })();


//  Sirve para prevenir el hoisting
// proteger los datos

// patron chain (cadena)

// console.log('holaaaaa'); --> probando node


// const math = require('./math');

// // add
// console.log(math.add(1, 2));
// console.log(math.substract(1, 2));
// console.log(math.division(1, 2));
// console.log(math.division(1, 0));
// console.log(math.multiply(1, 2));



//-----------------Codigo asincrono-------------------------
// const fs = require('fs');

// fs.writeFile('./texto2.txt', 'hola cosito bonito', function(err){  // con esto creo un nuevo archivo
//     if(err){
//          console.log(err);       //callback (termina de crearse el archivo y se ejecuta la funcion)
//     }
//     console.log('archivo creado'); //codigo asincrono
// });
// console.log('ultima linea de codigo');

//----------puede seguir leyendo mas abajo, por lo que cuando 
//termine aparecera primero mis lineas de mas abajo y al final el 
//archivo creado--------------

//-----------codigo bloqueante------------------
//   const user =query('Select * from users');
// ----- no permite que siga leyendo hacia abajo, debe esperar
// a que termine de ejecutarse

//req quiere decir request , que es la peticion --> links
// res quiere decir response, que es la respuesta  --> links


//codigos de estado HTTP --> como responde el servidor al 
//navegador, devuelve en numeros.



//----------ejemplo leyendo archivo math.js-----------------
// var fs = require('fs');

// fs.readFile('math.j', 'utf8',           // --- recibe dos parametros y devuelve la funcion 
//    function(err, dati) {               // --- err y data lo llena la funcion readFile 
//         if (err) {                           // callback : devuelve una funcion(con todos los parametros llenos)
//             return console.log(err);
//         }
//          console.log(dati);
//     }
// );

//----SIN CICLO--------ejemplo leyendo archivo readme.md ---------

// var fs = require('fs');                     // El método readFile recibe 3 argumentos: la ruta al archivo, la codificación y una función 

// fs.readFile('README.md', 'utf8',            // que va a ser invocada cuando se lea el archivo (a esta función se le llama callback).
//    function(err, data) {               
//         if (err) {                           // callback : devuelve una funcion(con todos los parametros llenos)
//             return console.log(err);
//         }

//         let miLink = data.indexOf('http', 0);
//         let finLink = data.indexOf(')', miLink);
//          console.log(miLink);
//          console.log(data[miLink] + data[miLink + 1] + data[miLink + 2] + data[miLink + 3]);
//          console.log(finLink);

//          let myUrl = data.substring(miLink, finLink);
//          console.log(myUrl);

//     }
// );


// //------------ejemplo leyendo archivo readme.md ..el ciclo concatenó---------

// var fs = require('fs');                     // El método readFile recibe 3 argumentos: la ruta al archivo, la codificación y una función 

// fs.readFile('README.md', 'utf8',            // que va a ser invocada cuando se lea el archivo (a esta función se le llama callback).
//    function(err, data) {               
//         if (err) {                           // callback : devuelve una funcion(con todos los parametros llenos)
//             return console.log(err);
//         }

//         links = [];

//         let inicioLink = 0;
//         while(inicioLink < data.length){
//             inicioLink = data.indexOf('http', inicioLink);
//         if(inicioLink < 0){
//             return
//         }
//         let finLink = data.indexOf(')', inicioLink);
       

//          let myUrl = data.substring(inicioLink, finLink);
//          console.log(myUrl);
//          inicioLink ++;

//          myObjectUrl = {'href' : myUrl }
//          links.push(myObjectUrl);
//          console.log(links);              --> fue concatenando pasando por cada uno mil veces
//         }
       
        
//     }
    
// );

//------------ejemplo leyendo archivo readme.md ---------

const fs = require('fs');                     // El método readFile recibe 3 argumentos: la ruta al archivo, la codificación y una función 
const fetch = require("node-fetch");
const searchLinks = (path) => {
fs.readFile(path, 'utf8',            // que va a ser invocada cuando se lea el archivo (a esta función se le llama callback).
   function(err, data) {               
        if (err) {                           // callback : devuelve una funcion(con todos los parametros llenos)
            return console.log(err);
        }

        let links = [];
        let inicioLink = 0;

        while (inicioLink < data.length) {
            inicioLink = data.indexOf('http', inicioLink);
            if (inicioLink < 0) {    // si el valor es -1 significa que no encontro mas url
                // return  ---> se sale de todo y no me pinta en la terminal el  console.log(links); que tengo abajo
                break; // sale solo del while, pero continua pintando (el console que tengo fuera del while)
            }
            

            let finLink = data.indexOf(')', inicioLink);
            let myUrl = data.substring(inicioLink, finLink);
            inicioLink++;
            
            let endTitle = data.lastIndexOf(']', inicioLink);
            let beginTitle = data.lastIndexOf('[', endTitle);
            beginTitle++;
            let myTitle = data.substring(beginTitle,endTitle);
            // console.log(myTitle);

            // si en mi url encuentro un enter no realizo el push 
             
           let searchEnter = myUrl.indexOf('\n',0); // el comando \n  hace un salto de linea
           let searchparentesis =  inicioLink - 2;
           let searchExclamacion =  beginTitle - 2;

        //    console.log(data[searchparentesis]);                     
           if(searchEnter<0  && data[searchparentesis] =='(' && data[searchExclamacion] != '!'){
               //significa que no encontro enter
               let myObjectUrl = {
                'href': myUrl,
                'title' : myTitle,
                'file' : path
            }
            links.push(myObjectUrl);
           }

            
// console.log(myObjectUrl);

        } // -------fin ciclo while-----------
        // console.log(links.length);
        // console.log(links.length);
        // console.log('el largo del array es' + links.length);
 
        //     console.log(links.length);     
        let addOk = 0;
        let addFail = 0;

//-----------nueva promesa-----------------------------------
        let promesa =  new Promise((res, rej) =>{
            // res('exito al procesar datos');              // en las promesas tengo res y rej
            // rej('existe un error');
            let linkslarge  = links.length; 
            links.forEach(element => {
                // console.log('titulo:' + element.title);
                //------------utilizando un feth----------
                // cargando fetch https://stackoverflow.com/questions/48433783/referenceerror-fetch-is-not-defined
                fetch(element.href)
                    .then(function (response) {
                        linkslarge--;
                        addOk++ ;
                    // console.log(addOk);
                    console.log('response.ok =', response.ok);
        console.log('response.status =', response.status);
        // console.log('response.statusText =', response.statusText);
        // console.log('response.url =', response.url);
                      if (linkslarge === 0){
                        console.log('linkslarge: '+linkslarge);
                          res('termine de las buenas');
                      }
                   
                    })
                    .then(function (data) {
                        // console.log('data = ', data);
                    })
                    .catch(function (err) {
                       
                        linkslarge--;
                        addFail++;
                        if (linkslarge === 0){
                            console.log(linkslarge);
                            res('termine de las malas');
                        }
                    });
                   
            });
            // res('fdfdgfd')
        });
        



        promesa.then((resultado)=> {       // con esto obtengo el resultado de mi promesa 
             console.log('ok : '+resultado);     
             console.log('las buenas son ' + addOk + ' y las malas son ' + addFail);
                      // puedo llamar al resultado 
        }, (error)=>{
            console.log('si hay:  ' + error);
        });


        // console.log('dessde afuera de promesa ' + addOk + ' y las malas son ' + addFail);

        }
    
);
}
searchLinks('./README.md');   // esto lo cambiare mas adelante, para que no quede fijo, desde cualquier parte debo 
                              // lograr que sea llamada mi funcion y que se le pase cualquier archivo

