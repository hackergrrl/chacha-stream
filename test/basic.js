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

test('can\'t decrypt with different key', function (t) {
  t.plan(1)

  let key0 = crypto.randomBytes(32)
  let key1 = crypto.randomBytes(32)
  let encode0 = Salsa.encoder(key0)
  let decode0 = Salsa.decoder(key1)

  encode0.write('hello world')

  encode0.pipe(decode0)

  decode0.once('data', function (data) {
    t.notSame(data.toString(), 'hello world')
  })
})
