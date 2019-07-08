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



test('Debería retornar 2 links unicos para el archivo test2.md', async () => {
  await mdLinks.validateExtensionFile('test/test2.md');
  await mdLinks.readMarkdown();
  expect(mdLinks.uniqueLinks()).toEqual( 
    ["https://nejando-la-asincronia-en-javascript/",
     "https://www.js-y-npm"]);
    
});

test('Debería retornar una alerta en caso de error en Unique', async () => {
  
  await mdLinks.validateExtensionFile('test/test4.md');
  await mdLinks.readMarkdown();
  expect(mdLinks.uniqueLinks()).toEqual( 
    ["Algo ocurre, no podemos entregar tus links unicos"]);

});

test('Debería retornar 2 links del archivo test3.md al no ingresar opciones', async () => {
  await mdLinks.validateExtensionFile('test/test3.md');
  await mdLinks.readMarkdown();
  mdLinks.uniqueLinks();

    return mdLinks.validateLinks(false, false).then(data => {
      expect(data).toEqual(
        ["test/test3.md https://nodejs.org/api/path.html Path",
         "test/test3.md https://docs.npmjs.com/getting-started/publishing-npm-packages Crear módulos en Node.js"] )
  });
});

test('Debería retornar status validate de 2 links del archivo test3.md', async () => {
  await mdLinks.validateExtensionFile('test/test3.md');
  await mdLinks.readMarkdown();
  mdLinks.uniqueLinks();

    return mdLinks.validateLinks(true, false).then(data => {
      expect(data).toEqual(
        ["test/test3.md https://nodejs.org/api/path.html OK 200 Path",
          "test/test3.md https://docs.npmjs.com/getting-started/publishing-npm-packages OK 200 Crear módulos en Node.js"] )
  });
});

test('Debería retornar Fail 400 de 2 links rotos del archivo test1.md al usar validate', async () => {
  await mdLinks.validateExtensionFile('test/test1.md');
  await mdLinks.readMarkdown();
  mdLinks.uniqueLinks();

    return mdLinks.validateLinks(true, false).catch(data => {
      expect(data).toEqual(
        ["test/test1.md https://nejando-la-asincronia-en-javascript/ Fail 400 Asíncronía en js",
         "test/test1.md https://www.js-y-npm Fail 400 Node.js y npm"] )
  });
});

test('Debería retornar Total: 10 y Unique: 9 para el archivo ./prueba.md', async () => {
  await mdLinks.validateExtensionFile('./prueba.md');
  await mdLinks.readMarkdown();
  mdLinks.uniqueLinks();
  expect(mdLinks.statsLinks(false, true)).toEqual( 
    ["Total: 10",
      "Unique: 9"]);
    
});

test('Debería retornar Total: 10, Unique: 9, Broken: 3, Links ok: 7 para el archivo ./prueba.md', async () => {
  await mdLinks.validateExtensionFile('./prueba.md');
  await mdLinks.readMarkdown();
  mdLinks.uniqueLinks();
  await mdLinks.validateLinks();
  expect(mdLinks.statsLinks(true, true)).toEqual( 
    ["Total: 10",
      "Unique: 9",
      "Broken: 3",
      "Links ok: 7"]);   
});

test('Debería retornar una alerta en caso de error en la estadistica', async () => {
  // await mdLinks.validateExtensionFile('./prueba.md');
   await mdLinks.validateExtensionFile('test/test4.md');
   await mdLinks.readMarkdown();
   mdLinks.uniqueLinks();
  // await mdLinks.validateLinks();
  expect(mdLinks.statsLinks("", true)).toEqual( 
    ["Algo ocurre, no podemos entregar tus estadisticas"]);
});
});



