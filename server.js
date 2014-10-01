var zetta = require('zetta');
var Buzzer = require('zetta-buzzer-bonescript-driver');
var Microphone = require('zetta-microphone-bonescript-driver');
var LED = require('./devices/led');

var app = require('./apps/app');

zetta()
  .use(Buzzer, 'P9_14')
  .use(Microphone, 'P9_36')
  .use(LED, 'P9_41')
  .use(app)
  .listen(1337, function(){
    console.log('Zetta is running at http://192.168.7.2:1337');
  });