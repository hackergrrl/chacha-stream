# chacha-stream

This module provides encryption and decryption streams for the sodium chacha20
implementation. It can be used to encrypt channels using a key already known to
both sides.

It manages communicating the stream nonce to the remote side, which is
transmitted in plaintext. This is safe information to leak (the nonce is used
to detect replay attacks).

## Usage

```js
const chacha = require('chacha-stream')
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
```

outputs

```
encrypted }�?�lx
encrypted z>��Un��4�
decrypted hello world
```

## API

```js
var chacha = require('chacha-stream')
```

### var encoder = chacha.encode(key)

Creates a Transform stream that accepts plaintexts written to it, and outputs encrypted ciphertext.

`key` is a 32-byte `Buffer`.

### var decoder = chacha.decode(key)

Creates a Transform stream that accepts ciphertext written to it, and outputs decrypted plaintext.

`key` is a 32-byte `Buffer`.

## Install

With [npm](https://npmjs.org/) installed, run

```
$ npm install chacha-stream
```

## License

ISC
