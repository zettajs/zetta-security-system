var zetta = require('zetta');
var Buzzer = require('zetta-buzzer-bonescript-driver');
var PIR = require('zetta-pir-bonescript-driver');
var Microphone = require('zetta-microphone-bonescript-driver');
var WeMo = require('zetta-wemo-driver');
var AutoScout = require('zetta-auto-scout');
var Led = require('./devices/led');

var app = require('./apps/app');

zetta()
  .use(Buzzer)
  .use(PIR)
  .use(Microphone)
  .use(WeMo)
  .use(new AutoScout('led', Led, 'P8_39'))
  .load(app)
  .listen(1337)
