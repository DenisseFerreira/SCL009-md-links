// let links = [ { href: 'https://www.js-y-npm',
// text: 'Node.js y npm',
// file: './prueba.md' },
// { href: 'https://www.js-y-npm',
// text: 'Node.js y npm',
// file: './prueba.md' },
// { href: 'https://www.js-y-npm',
// text: 'Node.js y npm',
// file: './prueba.md' },
// { href: 'http://community.laboratoria.la/t/modulos-librerias-paquetes-frameworks-cual-es-la-diferencia/175',
// text: 'Módulos, librerías, paquetes, frameworks... ¿cuál es la diferencia?',
// file: './prueba.md' },
// { href: 'https://nejando-la-asincronia-en-javascript/',
// text: 'Asíncronía en js',
// file: './prueba.md' },
// { href: 'https://docs.npmjs.com/getting-started/what-is-npm',
// text: 'NPM',
// file: './prueba.md' },
// { href: 'https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback',
// text: 'Leer un archivo',
// file: './prueba.md' },
// { href: 'https://nodejs.org/api/fs.html#fs_fs_readdir_path_options_callback',
// text: 'Leer un directorio',
// file: './prueba.md' },
// { href: 'https://nodejs.org/api/path.html',
// text: 'Path',
// file: './prueba.md' },
// { href: 'https://m-command-line-package-c2166ad0452e',
// text: 'Linea de comando CLI',
// file: './prueba.md' }];

// let urls = links.map(function (element) { return element.href; });
// let sorted = urls.sort();

// let unique = sorted.filter(function (value, index) {
//     return value !== sorted[index + 1];
// });

// console.log(unique.length);



// ---directorio----
let fs = require('fs');

let path = './archivos md/'
// let path = './prueba.md';
// si mi path tiene extension .md corresponde a un archivo
//  sino, es un directorio
if(path.substr(-3) === '.md'){
    console.log(path);
}else{

fs.readdir(path, function (err, files) {
  // console.log(files);
  files
    .filter(function (file) {
      return file.substr(-3) === '.md';
    })
    .forEach(function (file) {
      console.log(file);
    });
});
}
