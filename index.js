var through = require('through2')
var sodium = require('sodium-universal')
var duplexify = require('duplexify')

module.exports = function () {
  var writable = through(writeOut)
  var readable = through(writeIn)

  var nonce = Buffer.alloc(sodium.crypto_stream_chacha20_NONCEBYTES)

  // XXX: what is the right wya to generate a secret key?
  var key = Buffer.alloc(sodium.crypto_stream_chacha20_KEYBYTES)

  sodium.randombytes_buf(nonce)
  sodium.randombytes_buf(key)

  // XXX: how to send my xor nonce to remote & get theirs?
  //      oh! can we just use the projectKey?
  var instanceIn = sodium.crypto_stream_chacha20_xor_instance(nonce, key)
  var instanceOut = sodium.crypto_stream_chacha20_xor_instance(nonce, key)

  // encrypt outgoing
  function writeOut (chunk, enc, next) {
    var box = Buffer.alloc(chunk.length)
    chunk.copy(box)
    instanceOut.update(box, box)
    console.log('encrypting', chunk, 'to', box)
    next(null, box)
  }

  // decrypt incoming
  function writeIn (chunk, enc, next) {
    var box = Buffer.alloc(chunk.length)
    chunk.copy(box)
    instanceIn.update(box, box)
    console.log('decrypting', chunk, 'to', box)
    next(null, box)
  }

  // TODO: call instance.final() once stream ends

  return [writable, readable]
//   return duplexify(writable, readable)
}
