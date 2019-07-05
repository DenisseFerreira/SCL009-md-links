const mdLinks = require('../mdlinks.js');
// const readMarkdown = require('../mdlinks.js');

describe('mdLinks', () => {

it('Debería retornar la ruta de 1 archivo', async () => {
  await expect(mdLinks.validateExtensionFile('test/test1.md')).resolves.toEqual(['test/test1.md']);
});

it('Debería retornar un error al no ingresar bien un archivo', async () => {
  await expect(mdLinks.validateExtensionFile('')).rejects.toEqual('No has ingresado un archivo');
});

it('Debería retornar la ruta de 2 archivos de un directorio', async () => {
  await expect(mdLinks.validateExtensionFile('prueba_md/')).resolves.toEqual(
    ['prueba_md/t1_prueba.md', 
     'prueba_md/t2_prueba.md'  
    ]);
});

it('Debería retornar un error al no ingresar bien un directorio', async () => {
  await expect(mdLinks.validateExtensionFile('no_directorio_md/')).rejects.toEqual(
    "Hay un error con tu directorio");
});



test('Debería retornar 2 links para el archivo test1.md', async () => {
  await mdLinks.validateExtensionFile('test/test1.md');
   
  await expect(mdLinks.readMarkdown()).resolves.toEqual(
    [ { href: 'https://www.js-y-npm',
            text: 'Node.js y npm',
            file: 'test/test1.md' },
          { href: 'https://nejando-la-asincronia-en-javascript/',
            text: 'Asíncronía en js',
            file: 'test/test1.md' } ]
  );
});

// test('Debería retornar error para el archivo img.md que tiene imagenes', async () => {
//   await mdLinks.validateExtensionFile('test/img.md');
   
//   await expect(mdLinks.readMarkdown()).rejects.toEqual('No encuentro links');
// });


test('Debería retornar 2 links unicos para el archivo test2.md', async () => {
  await mdLinks.validateExtensionFile('test/test2.md');
  await mdLinks.readMarkdown();
  expect(mdLinks.uniqueLinks()).toEqual( 
    ["https://nejando-la-asincronia-en-javascript/",
     "https://www.js-y-npm"]);
});

// test('Debería retornar el status de 2 links test1.md', async () => {
//   await mdLinks.validateExtensionFile('test/test1.md');
//   await mdLinks.readMarkdown();
//   mdLinks.uniqueLinks();
//   await expect(mdLinks.validateLinks()).toEqual( 
//     ["test/test1.md https://www.js-y-npm Fail 400 Node.js y npm",
//     "test/test1.md https://nejando-la-asincronia-en-javascript/ Fail 400 Asíncronía en js"]);
// });


});


