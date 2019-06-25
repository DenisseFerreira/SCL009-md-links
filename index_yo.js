//------------ejemplo leyendo archivo readme.md ---------

const fs = require('fs');                     // El método readFile recibe 3 argumentos: la ruta al archivo, la codificación y una función 
const fetch = require("node-fetch");
let validate = false;
let stats = false; 
const searchLinks = (path) => {
fs.readFile(path, 'utf8',            // que va a ser invocada cuando se lea el archivo (a esta función se le llama callback).
   function(err, data) {               
        if (err) {                           // callback : devuelve una funcion(con todos los parametros llenos)
            return console.log(err);
        }

        let links = [];     // array con el objeto de url. path, title
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
                'text' : myTitle,
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
            links.forEach(element => {    //element es mi objeto y tiene tres cosas: element.href, element.title, element.path
                // console.log('titulo:' + element.title);
                //------------utilizando un feth----------
                // cargando fetch https://stackoverflow.com/questions/48433783/referenceerror-fetch-is-not-defined
                fetch(element.href)       //ejecuto una url, por lo que se la debo pasar. Si esta mala se irá al catch (es como hacerle click a la url)
                  .then(function (response) {  // datos de cabecera (titulos, estatus, url, etc)
                    linkslarge--;                // en este then cae si la pagina responde, pero luego puede ser false, al entrar puede estar mala, pero genero una respuesta 
                   
                    // console.log(addOk);
                    // console.log('response.statusText =', response.statusText);
                    // if (response.ok === true && element.href === response.url) {
                    //     addOk++;
                    // }else{         //la pagina no esta en buen estado, no funciona.
                    //     console.log('response.ok =', response.ok);
                    //     console.log('response.status =', response.status); 
                    //     if(element.href != response.url){
                    //         console.log('mi url enviada es : ' +  element.href);
                    //     }
                    //     console.log('url que me trae es =', response.url); // aqui me llega la que el servidor responde (lo que abre, lo cual aveces cambia)
                    //     addFail++;  
                    //     console.log('------------------------------------------------------------------');
                    // }
                    // if (response.ok === false) {  //la pagina no esta en buen estado, no funciona.
                    //     console.log('response.ok =', response.ok);
                    //     console.log('response.status =', response.status);
                    //     console.log('mi url enviada es : ' +  element.href);
                    //      addFail++; 
                    //      console.log('------------------------------------------------------------------');
                    // }else{        
                    //     addOk++;

                    // }
                        addOk++; 
                        if(validate=== false && stats === false){
                             console.log(element.file + ' ' + element.href + ' ' + element.text);  // primera ejecucion solo archivos ----> cuando no ingresan paramtros (validate o stats)
                        }
                        if(validate === true && stats === false){
                             console.log(element.file + ' ' + element.href + ' ' + response.statusText + ' ' + response.status + ' ' + element.text);  // corresponde a validate
                       }
                        



                    if (linkslarge === 0) {
                    //   console.log('linkslarge: ' + linkslarge);
                      res('termine de ejecutar la promesa');
                    }

                  })
                  .then(function (data) {   // cuando trae datos ingresa acá (data)
                    // console.log('data = ', data);
                  })
                  .catch(function (err) { // aqui cae cuando la url esta completamente caida

                    linkslarge--;
                    addFail++;    // va sumando los errores
                    // console.log('catch url fail : ' + element.href);
                    // console.log('--------------------------------------------------------');
                    if (linkslarge === 0) {
                    //   console.log(linkslarge);
                      res('termine el proceso');
                    }
                  });

                });
        });
        



        promesa.then((respuesta)=> {       // con esto obtengo el resultado de mi promesa    // responde al resolve
            //  console.log('resultado : '+ respuesta);     
            if(stats === true && validate === false){
                console.log('Total: '+ links.length);
                console.log('Correctas/UNIQUE: ' + addOk) 
            }
            if(stats === true && validate === true){
             console.log('Total: '+ links.length);
             console.log('Correctas/UNIQUE: ' + addOk) 
             console.log('Broken: ' + addFail);     // corresponde a estadistica
                      // puedo llamar al resultado 
            }
        }, (error)=>{                 // es el reject
            console.log('si hay:  ' + error);
        });


        // console.log('dessde afuera de promesa ' + addOk + ' y las malas son ' + addFail);

        }
    
);
}

//****************************************************************************************************************

process.argv.forEach((option, index, array)=>{
    // console.log('index : ', index , 'value' , option);
    if(index > 1 && index < 5){
      if(option == '--validate' || option == '--v') {
        validate = true;
      }else if (option == '--stats' || option == '--s'){
        stats = true;
      }else {
        console.log('opncion no valida', option);
      }
    }
  });





searchLinks('./README.md');   // esto lo cambiare mas adelante, para que no quede fijo, desde cualquier parte debo 
                              // lograr que sea llamada mi funcion y que se le pase cualquier archivo

