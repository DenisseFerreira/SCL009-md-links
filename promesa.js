let promesa =  new Promise((res, rej) =>{      // resolve y reject
    // res('exito al procesar datos');              // en las promesas tengo res y rej
    // rej('existe un error');
});

promesa.then((resultado) => 
                    { // con esto obtengo el resultado de mi promesa 
                        console.log(resultado); // puedo llamar al resultado 
                    }                   
                    , 
                (error) => {
                        console.log('si hay:  ' + error);
                    }
            );

// puedo definir funciones que retornen promesas, puedo exportar esa funcion 
//con module.exports y llamarla desde otro archivo usando require.
// Esencialmente, una promesa es un objeto devuelto al cuál se adjuntan funciones callback, en lugar de pasar callbacks a una función.

//---------------Usando fetch-------------------------
// const fetch = require ('node-fetch');

// fetch('https://developer.mozilla.org/es/docs/Web/API/Fetch_API')
// .then((res)=>{
//     return res.json();
// }).then((json)=>{
//     console.log(json);
// });
