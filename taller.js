#!/usr/bin/env node
"use strict"  
// console.log("probando codigo");

const fetch = require('fetch');
const fetchUrl = fetch.fetchUrl;






 //funciones que retornan promesas
let myPromise = Promise.resolve('Hola taller');

myPromise
.then(res =>{
    console.log(res);
});

//nueva instancia
let myOtherPromise = new Promise ((resolve, reject) =>{
    setTimeout (()=> resolve(5),2000) //resolve tiene otro colo porque lo estamos ocupando
});

myOtherPromise
.then(res => {
    res += 5;
    console.log(res);
});


const getData =(url)=>{   //acepta una url como parametro
    return new Promise((resolve,reject)=>{
        fetchUrl(url, (error, meta, body) => {
            if(meta){
                // console.log(meta);
                resolve(meta.status);
                }else{
                    reject(error);
                }              
    });
});
};

let url = "https://github.com/";
getData(url)
 .then(res => {
     console.log('el estado del sitio', url, 'es:',res); //este res es el meta.status
 })
 .catch(error=>{
     console.log(error);
 }); 

//  // 
//  try {
     
//  } catch (error) {
     
//  } 

/*
testear:
then primero / funciones

jest y eslint dependencias que debo tener


mdLinks(path, options)--> path es el archivo o directorio / opstions: --v --s o ninguna
esta funcion me recoge lo que el usuario ingresa

md links hace la llamada a las otras funciones 


si en el directorio hay muchos archivos md??? devuelvo un arreglo que tiene muchos objetos y que debo unificar.
--s: hago un arreglo con links, los sumo y encuentro el total. Busco los unicos y hago el unique.
broken: recorrer el arreglo y contar los que estan malos (puedo crear un array auxiliar)

expresiones regulares para encontrar un archivo md?
1 chequear si el usuario escribio si es ruta es directorio o archivo
  1.1 usuario coloca un directorio(chuequear si es absoluta o relativa...la normalizamos, para que filehound la ejecute)--> ejecuto filehound o Fs(si es md o no)
      - obtengo un arreglo de archivos .md
      -leemos cada uno para obtener los links(marked,markdownextractor)
      - 
      
      2 que opciones ingreso el usuario
      -si no puso nada, muestro el objeto
      -si puso validate: muestro el status (con fetch) ok o fail
      -si puso stats : muestro el arreglo con el contador, que lo sume y muestre el total, y contador de unicos
      -si puso --s --v: muestro total, unicos y broken





*/