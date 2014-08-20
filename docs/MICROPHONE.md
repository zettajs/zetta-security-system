#The Microphone sensor

Next up is our microphone sensor. This will detect sound of possible intruders, and serve as another characterisitic that
we can use to trigger our alarm. This section you'll learn about streaming sensor data values, and taking advantage of
those readings in your Zetta app.

##Contents

1. Circuit
2. Retrieving Driver
3. Adding code to Server
4. Adding to your app
5. API and Browser

###Circuit

Here is a simple fritzing diagram of what your circuit will look like on the BeagleBone Black.

**Insert Diagram**

###Retrieving Driver

Again we'll use the npm command to install our driver. Type `npm install zetta-microphone-bonescript-driver --save`. This will install our driver for us.


**TIP**: Ensure you install while on the BeagleBone operating system. The package
installation will fail if you use your native OS.

**TIP**: Every module you'll use in this tutorial is open source. This one can be found here https://github.com/zettajs/zetta-microphone-bonescript-driver.

###Adding code to Server

Now it's time to actually wire up our Zetta driver into the server node.

```javascript
var zetta = require('zetta');
var piezo = require('zetta-buzzer-bonescript-driver');
var pir = require('zetta-pir-bonescript-driver');
var microphone = require('zetta-microphone-bonescript-driver');
var app = require('./apps');

zetta()
  .use(piezo)
  .use(pir)
  .use(microphone)
  .load(app)
  .listen(1337);
```

* Here we've updated our code to let Zetta know that we want to use our Microphone sensor to detect sound.

###Creating your first app

Now we'll wire up our sound sensor into our app.

```javascript
module.exports = function(server) {
  var buzzerQuery = server.where({type: 'buzzer'});
  var pirQuery = server.where({type: 'pir'});
  var microphoneQuery = server.where({type: 'microphone'});

  server.observe([buzzerQuery, pirQuery, microphoneQuery], function(buzzer, pir, microphone){
    var microphoneReading = 0;

    microphone.streams.amplitude.on('data', function(data){
      microphoneReading = data.data;
    });

    pir.on('motion', function(){
      if(microphoneReading > 100) {
        buzzer.call('beep');
      }
    });
  });
}
```

* Here we've updated our app to search for our microphone sensor.
* We've also updated to read the `amplitude` stream that provides readings on sound amplitude to us.
* Now when the PIR sensor detects we check the `microphoneReading` variable, and if it's over 100 we'll buzz our buzzer.

###API and Browser

Below is a sample API response for our microphone.

```json
{FILL_IN:"SOON!"}
```

* The important difference between the device, and the others we've already used is that we include a link to monitor sensor readings over websockets.
  * Zetta makes it easy to get real time sensor readings quickly
