# denisse-md-links

Extrae los links de tus directorios y/o archivos markdown (.md), valida su status y obten algunos datos estadísticos.

## Instalación

```
npm install denisse-md-links
```

## Guía de uso
```js
const md-links = require ( 'denisse-md-links' ) ;   
```

**CLI (Command Line Interface)**

Para ejecutar esta librería debes hacerlo de la siguiente forma:
Primero escoger que es lo que necesitas analizar (un archivo o directorio):

* Lectura de archivos con extensión .md

`md-links <path-to-file>`

Por ejemplo:

```sh
$ md-links ./example.md
./example.md http://algo.com/2/3/ Link a algo
./example.md https://otra-cosa.net/algun-doc.html algún doc
```

* Lectura de un directorio

`md-links <path-to-directory>`

```
$ md-links ./some/example.md
./some/example.md http://algo.com/2/3/ Link a algo
./some/example.md https://otra-cosa.net/algun-doc.html algún doc
```

En ambos casos, se identifican el o los archivos markdown y se obtiene como resultado:

- `href`: link encontrado.
- `text`: descripción del link.
- `file`: archivo o ruta donde fue encontrado el link .

#### Options

##### `--validate`

Al usar esta opción podrás averiguar si el link funciona o no a través de su status y además puedes conocer el texto del link validado.

```
$ md-links ./some/example.md --validate
./some/example.md http://algo.com/2/3/ ok 200 Link a algo
./some/example.md https://otra-cosa.net/algun-doc.html fail 404 algún doc
```

##### `--stats`

Esta opción permite obtener estadísticas
básicas de los links, en este caso los links totales (Total) y si son unicos (Unique) .

```
$ md-links ./some/example.md --stats
Total: 2
Unique: 2
```

##### `--stats` `--validate`

Si combinas ambas opciones, podrás obtener aquellos links rotos (Broken), links totales (Total) y si son unicos (Unique) .

```
$ md-links ./some/example.md --stats
Total: 2
Unique: 2
Broken: 1
```
