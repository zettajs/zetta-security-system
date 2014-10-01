module.exports = function(server) {
  var buzzerQuery = server.where({type: 'buzzer'});
  var microphoneQuery = server.where({type: 'microphone'});
  var ledQuery = server.where({type: 'led'});

  server.observe([buzzerQuery, microphoneQuery, ledQuery], function(buzzer, microphone, led){

    microphone.streams.volume.on('data', function(msg){
      if (msg.data > 10) {
          buzzer.call('turn-on', function() {});
          led.call('turn-on', function(){});
        } else {
          buzzer.call('turn-off', function() {});
          led.call('turn-off', function(){});
        }
    });

  });
}