// module.exports = () => {
//   // ...
// };

//------------ejemplo leyendo archivo readme.md ---------

const fs = require('fs');                     // El método readFile recibe 3 argumentos: la ruta al archivo, la codificación y una función 

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

                     console.log(links);       
// console.log(myObjectUrl);

        } // -------fin ciclo while-----------
     
}
)};
searchLinks('./README.md');   // esto lo cambiare mas adelante, para que no quede fijo, desde cualquier parte debo 
                              // lograr que sea llamada mi funcion y que se le pase cualquier archivo

