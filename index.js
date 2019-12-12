const through = require('through2')
const sodium = require('sodium-universal')
const debug = require('debug')('chacha-stream')

module.exports = {
  encoder: encrypt,
  decoder: decrypt
}

function encrypt (key) {
  let stream = through(write, flush)

  let nonce = Buffer.alloc(sodium.crypto_stream_chacha20_NONCEBYTES)
  sodium.randombytes_buf(nonce)

  let instance = sodium.crypto_stream_chacha20_xor_instance(nonce, key)
  let firstWrite = true

  function write (chunk, enc, next) {
    if (firstWrite) {
      this.push(nonce)
      debug('sent nonce', nonce.toString('hex'))
      firstWrite = false
    }

    let box = Buffer.alloc(chunk.length)
    chunk.copy(box)
    instance.update(box, box)
    debug('encrypting', chunk, 'to', box)
    next(null, box)
  }

  function flush (cb) {
    debug('finalizing encrypt stream')
    instance.final()
    cb()
  }

  return stream
}

function decrypt (key) {
  const NLEN = sodium.crypto_stream_chacha20_NONCEBYTES
  let stream = through(write, flush)
  let nonce = Buffer.alloc(0)
  let instance

  function write (chunk, enc, next) {
    if (nonce.length < NLEN) {
      if (nonce.length + chunk.length >= NLEN) {
        let bytesToTake = NLEN - nonce.length
        nonce = Buffer.concat([nonce, chunk.slice(0, bytesToTake)])
        chunk = chunk.slice(bytesToTake)
        instance = sodium.crypto_stream_chacha20_xor_instance(nonce, key)
        debug('received nonce', nonce.toString('hex'))
      } else {
        nonce = Buffer.concat([nonce, chunk])
        return next()
      }
    }

    let box = Buffer.alloc(chunk.length)
    chunk.copy(box)
    instance.update(box, box)
    debug('decrypting', chunk, 'to', box)
    next(null, box)
  }

  function flush (cb) {
    debug('finalizing decrypt stream')
    instance.final()
    cb()
  }

  return stream
}

