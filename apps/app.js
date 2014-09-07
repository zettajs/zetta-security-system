module.exports = function(server) {
  var buzzerQuery = server.where({type: 'buzzer'});
  var pirQuery = server.where({type: 'pir'});
  var microphoneQuery = server.where({type: 'microphone'});
  var twilioQuery = server.where({ type: 'twilio' });

  server.observe([buzzerQuery, pirQuery, microphoneQuery, twilioQuery], function(buzzer, pir, microphone, twilio){
    var microphoneReading = 0;

    microphone.streams.volume.on('data', function(msg){
      if (msg.data > 10) {
        if (pir.state === 'motion') {
          buzzer.call('turn-on', function() {});
          twilio.call('send-sms', '+17346345472', 'Detected potential intruder!', function(){});
        } else {
          buzzer.call('turn-off', function() {});
        }
      }
    });

    pir.on('no-motion', function() {
      buzzer.call('turn-off', function() {});
    });

  });
}
