var zetta = require('zetta');
var Buzzer = require('zetta-buzzer-bonescript-driver');

zetta()
  .use(Buzzer, 'P9_14')
  .listen(1337, function(){
    console.log('Zetta is running at http://beaglebone.local:1337');
  });
