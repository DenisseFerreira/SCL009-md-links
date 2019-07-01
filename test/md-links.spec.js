const mdLinks = require('../md-links2.js');


describe('mdLinks', () => {

  it('should...', () => {
    console.log('FIX ME!');
  });

});


// Debo testear: las promesas, el catch, el then.
// path file y opciones debe recibir mdLinks


//stats de un directorio
test("mdLinks, deberia entregar Total Links: 7 Unique Links: 6 para la ruta test/md-files-test con stats true",  () =>{
   expect(mdLinks.mdLinks("test/md-files-test",{stats:true})).resolves.toEqual("Total Links:"+7+"\n"+"Unique Links:"+6)
});

//stats de un archivo
test("mdLinks, deberia entregar Total Links: 3 Unique Links: 2 para el archivo test-file-1 con stats true",  () =>{
  expect(mdLinks.mdLinks("test/md-files-test/test-file-1.md",{stats:true})).resolves.toEqual("Total Links:"+3+"\n"+"Unique Links:"+2)
});