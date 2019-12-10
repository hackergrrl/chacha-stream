var Salsa = require('.')
var through = require('through2')

var t = through(function (chunk, enc, next) {
  console.log('passing', chunk)
  next(null, chunk)
})

var salsa = Salsa()

salsa[0].write('hello world')

salsa[0].pipe(t).pipe(salsa[1]).pipe(process.stdout)

