const test = require('tape')
const crypto = require('crypto')
const Salsa = require('..')

test('can encrypt + decrypt', function (t) {
  t.plan(1)

  let key = crypto.randomBytes(32)
  let encode0 = Salsa.encoder(key)
  let decode0 = Salsa.decoder(key)

  encode0.write('hello world')

  encode0.pipe(decode0)

  decode0.once('data', function (data) {
    t.same(data.toString(), 'hello world')
  })
})
