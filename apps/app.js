module.exports = function(server) {
  var PIR = server.where({ type: 'pir' });
  
  server.observe(PIR, function(pir) {
    pir.on('motion', function() {
      console.log('Motion Detected')
    });

    pir.on('no-motion', function() {
      console.log('Motion is gone')
    });
  });

};
