var Salsa = require('.')
var crypto = require('crypto')

var key = crypto.randomBytes(32)

var encode0 = Salsa.encoder(key)
var decode0 = Salsa.decoder(key)

var encode1 = Salsa.encoder(key)
var decode1 = Salsa.decoder(key)

encode0.write('hello world')
encode0.write('how goes it?')
encode0.write('what the whaaaaat')

encode0.pipe(decode0)
encode1.pipe(decode1)

encode1.write('test?')

