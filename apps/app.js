module.exports = function(server) {
  var PIR = server.where({ type: 'pir' });
  var Buzzer = server.where({ type: 'buzzer' });

  server.observe( [PIR, Buzzer], function(pir, buzzer) {
    console.log('Found buzzer and pir')
    pir.on('motion', function() {
      buzzer.call('turn-on', function() {});
      console.log('Motion Detected')
    });
    pir.on('no-motion', function() {
      buzzer.call('turn-off', function() {});
      console.log('Motion is gone')
    });
  });

};
