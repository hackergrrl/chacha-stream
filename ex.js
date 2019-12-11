const chacha = require('.')
const through = require('through2')
const crypto = require('crypto')

function printer (prefix) {
  return through(function (chunk, enc, next) {
    console.log(prefix, chunk.toString())
    next(null, chunk)
  })
}

let key = crypto.randomBytes(32)
let encode0 = chacha.encoder(key)
let decode0 = chacha.decoder(key)

encode0.write('hello world')

encode0.pipe(printer('encrypted')).pipe(decode0).pipe(printer('decrypted'))
