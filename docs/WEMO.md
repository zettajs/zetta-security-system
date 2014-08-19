#The WeMo

The WeMo is an off the shelf consumer device. If there is a way to interact with a device in Node.js we can use it in Zetta. We'll


##Contents

1. Circuit
2. Retrieving Driver
3. Adding code to Server
4. Adding to your app
5. API and Browser

###Circuit

No circuit will be required! Here we'll use an off the shelf consumer device in our Zetta app.

###Retrieving Driver

Again we'll use the npm command to install our driver. Type `npm install zetta-wemo-driver --save`. This will install our driver for us.

**TIP**: Every module you'll use in this tutorial is open source. This one can be found here https://github.com/zettajs/zetta-wemo-driver.

###Adding code to Server

Now it's time to actually wire up our Zetta driver into the server node.

```javascript
var zetta = require('zetta');
var piezo = require('zetta-buzzer-bonescript-driver');
var pir = require('zetta-pir-bonescript-driver');
var microphone = require('zetta-microphone-bonescript-driver');
var wemo = require('zetta-wemo-driver');
var app = require('./apps');

zetta()
  .use(piezo)
  .use(pir)
  .use(microphone)
  .use(wemo)
  .load(app)
  .listen(1337);
```

* Here we've updated our code to let Zetta know that we want to use our WeMo.

###Creating your first app

Now we'll wire up our sound sensor into our app.

```javascript
module.exports = function(server) {
  var buzzerQuery = server.where({type: 'buzzer'});
  var pirQuery = server.where({type: 'pir'});
  var microphoneQuery = server.where({type: 'microphone'});
  var wemoQuery = server.where({type: 'wemo'});

  server.observe([buzzerQuery, pirQuery, microphoneQuery, wemoQuery], function(buzzer, pir, microphone, wemo){
    var microphoneReading = 0;

    microphone.streams.amplitude.on('data', function(data){
      microphoneReading = data.data;

      if(microphoneReading < 100 && wemo.state === 'on') {
        wemo.call('off');
      }
    });

    pir.on('motion', function(){
      if(microphoneReading > 100) {
        buzzer.call('beep');
        wemo.call('on');
      }
    });
  });
}
```

* We've updated our app to listen for a wemo to also come online.
* We've also updated the app to turn on the WeMo

###API and Browser

Below is a sample API response for our WeMo.

```json
{FILL_IN:"SOON!"}
```
