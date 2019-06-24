// module.exports = () => {
//   // ...
// };

// import { fstat } from "fs"; no sé

// module.exports = () => {
//   // ...
// };

const marked = require("marked");

const fs = require('fs');

// fs.readFile("./prueba.md", "utf8",(err, data) => {
//   if(err){
//     throw err
//   }
  
//     console.log(data);
  
// })


const links = (path) =>{
  fs.readFile(path,"utf8", (err,data) =>{
    if(err){
      throw err;
    }
    let links =[];

    const renderer = new marked.Renderer();

    renderer.link = function(href, title, text){

      links.push({
        
        href:href,
        text:text,
        file:path
      
      })

    }
    marked(data, {renderer:renderer})
      console.log(links.length)
  })

}

console.log(links("./README.md"));

//------------ejemplo ayudantia-------------

// si n/5 = fizz
// si n/3 = buzz
// Si n/5 || n/3 = fizzbuzz
// const fizzbuzz =(number)=>{
//   if(number%5===0 && number%3===0){
//     console.log("fizz");
//   }else it (number...c)
// }

// const md-links(ruta, validate, stats){
// if (v)
// }

// ----------Usando process, ejemplo ayudantia-------------
let validate = false;
let stats = false;

process.argv.forEach((option, index, array)=>{
  console.log('index : ', index , 'value' , option);
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


//-------promesas-------
//then y catch retornan promesas 

//--------ejemplo promesas del lms--------
let procesoLento = new Promise((resolve, reject) => {
  let datos = {};
  //...
  //muchas lineas de código
  //...
  if (error) {
    //uh oh, las cosas no salieron tan bien
    reject(new Error('Fallamos, lo siento'));
  }
  //...
  resolve(datos);
});

// usar path.normalize***************************

// cuando invocamos el método promise.then() podemos retornar

// o un valor al que resuelve la promesa
// u otra promesa, que resolverá a otro valor
