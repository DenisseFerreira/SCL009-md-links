const mdLinks = require('../mdlinks.js');
// const readMarkdown = require('../mdlinks.js');

describe('mdLinks', () => {

it('Debería retornar la ruta de 1 archivo', async (done) => {
  await expect(mdLinks.validateExtensionFile('test/test1.md')).resolves.toEqual(['test/test1.md']);
  done();
});

it('Debería retornar un error al no ingresar bien un archivo', async (done) => {
  await expect(mdLinks.validateExtensionFile('')).rejects.toEqual('No has ingresado un archivo');
  done();
});

it('Debería retornar la ruta de 2 archivos de un directorio', async (done) => {
  await expect(mdLinks.validateExtensionFile('prueba_md/')).resolves.toEqual(
    ['prueba_md/t1_prueba.md', 
     'prueba_md/t2_prueba.md'  
    ]);
    done();
});

it('Debería retornar un error al no ingresar bien un directorio', async (done) => {
  await expect(mdLinks.validateExtensionFile('no_directorio_md/')).rejects.toEqual(
    "Hay un error con tu directorio");
    done();
 });



test('Debería retornar 2 links para el archivo test1.md', async (done) => {
  await mdLinks.validateExtensionFile('test/test1.md');
   
  await expect(mdLinks.readMarkdown()).resolves.toEqual(
    [ { href: 'https://www.js-y-npm',
            text: 'Node.js y npm',
            file: 'test/test1.md' },
          { href: 'https://nejando-la-asincronia-en-javascript/',
            text: 'Asíncronía en js',
            file: 'test/test1.md' } ]
  );
  done();
});

// test('Debería retornar error para el archivo img.md que tiene imagenes', async () => {
//   await mdLinks.validateExtensionFile('test/img.md');
   
//   await expect(mdLinks.readMarkdown()).rejects.toEqual('No encuentro links');
// });


test('Debería retornar 2 links unicos para el archivo test2.md', async (done) => {
  await mdLinks.validateExtensionFile('test/test2.md');
  await mdLinks.readMarkdown();
  expect(mdLinks.uniqueLinks()).toEqual( 
    ["https://nejando-la-asincronia-en-javascript/",
     "https://www.js-y-npm"]);
     done();
});

// test('Debería retornar el status de 2 links test1.md', async () => {
//   await mdLinks.validateExtensionFile('test/test1.md');
//   await mdLinks.readMarkdown();
//   mdLinks.uniqueLinks();
//   await expect(mdLinks.validateLinks()).toEqual( 
//     {'element.file': "test/test1.md",
//     'element.href': "https://www.js-y-npm",
//     'response.statusText': "Fail", 
//     'response.status' :"400", 
//     'element.text': "Node.js y npm"}
//     // {"test/test1.md https://nejando-la-asincronia-en-javascript/ Fail 400 Asíncronía en js"}
   
 
//     );
// });

test('Debería retornar el status error de 2 links del archivo test1.md', async () => {
  await mdLinks.validateExtensionFile('test/test1.md');
  await mdLinks.readMarkdown();
  mdLinks.uniqueLinks();

    return mdLinks.validateLinks('', {validate:true,  stats: false}).then(data => {
      expect(data).toEqual(
        {"file": "test/test1.md", "href": "https://www.js-y-npm", "text": "Node.js y npm"},
        {"file": "test/test1.md",  "href": "https://nejando-la-asincronia-en-javascript/",
         "text": "Asíncronía en js"}
      )
  });
});


});


