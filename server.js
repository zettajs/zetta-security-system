var zetta = require('zetta');
var Buzzer = require('zetta-buzzer-bonescript-driver');
var PIR = require('zetta-pir-bonescript-driver');
var Microphone = require('zetta-microphone-bonescript-driver');
var WeMo = require('zetta-wemo-driver');
var LED = require('./devices/LED');

var app = require('./apps/app');

zetta()
  .use(Buzzer)
  .use(PIR)
  .use(Microphone, 'P9_36')
  .use(WeMo)
  .use(LED, 'P9_41')
  .use(app)
  .listen(1337);
