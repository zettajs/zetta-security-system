#The PIR motion detector

The PIR sensor is used to detect motion, and will be a critical sensor needed for our security system. We'll install
the driver for this sensor through npm, and wire up an app that will have our buzzer sound off when motion detected.

##Contents

1. Circuit
2. Retrieving Driver
3. Adding code to Server
4. Creating your first app
5. API and Browser

###Circuit

Here is a simple fritzing diagram of what your circuit will look like on the BeagleBone Black.

**Insert Diagram**

###Retrieving Driver

Again we'll use the npm command to install our driver. Type `npm install zetta-pir-bonescript-driver --save`. This will install our driver for us.


**TIP**: Ensure you install while on the BeagleBone operating system. The package
installation will fail if you use your native OS.

**TIP**: Every module you'll use in this tutorial is open source. This one can be found here https://github.com/zettajs/zetta-pir-bonescript-driver.

###Adding code to Server

Now it's time to actually wire up our Zetta driver into the server node. Below is a snippet we'll go through line by line.

```javascript
var zetta = require('zetta');
var piezo = require('zetta-buzzer-bonescript-driver');
var pir = require('zetta-pir-bonescript-driver');

zetta()
  .use(piezo)
  .use(pir)
  .listen(1337);
```

* Here we've updated our code to let Zetta know that we want to use our PIR sensor to detect motion.

###Creating your first app

Next we'll want to wire up interactions in Zetta. This is done with apps. Apps are just simple code snippets that wait for devices to come online.
After devices come online we then orchestrate interactions between devices.

```javascript
module.exports = function(server) {
  var buzzerQuery = server.where({type: 'buzzer'});
  var pirQuery = server.where({type: 'pir'});

  server.observe([buzzerQuery, pirQuery], function(buzzer, pir){
      pir.on('motion', function(){
        buzzer.call('beep');
      });
  });
}
```

* The first line is an export statement in node. This is so that we can keep our apps modular and separated from the rest of our code.
  * The `server` variable is an instance of Zetta. We can use functionality attached to it to search for devices.
* The second line is where we create our first query. Zetta uses query to look for devices, or wait for devices to come online that fill all the parameters given.
  * This particular query tells Zetta to retrieve the buzzer for us
* The third line is a query for our PIR sensor.
* The fourth line is a call to the function `observe`. Zetta waits for devices that fit queries given in the first argument to come online, and then fires the callback.
  * We want the callback function to fire when `"buzzer"` and `"pir"` devices come online.
  * The function passes in the state machines of the devices in as individual arguments.
* The fifth line listens for a `"motion"` transition to occur on the PIR sensor. This is similar to the event emitter pattern in Node.js.
* The sixth line will call the `"beep"` transition on the buzzer.

After you write this code you need to make sure the app is included in your server file. Update your server to look like so.

```javascript
var zetta = require('zetta');
var piezo = require('zetta-buzzer-bonescript-driver');
var pir = require('zetta-pir-bonescript-driver');
var app = require('./apps');

zetta()
  .use(piezo)
  .use(pir)
  .load(app)
  .listen(1337);
```

The `load` function lets Zetta know that we have a particular app we want it to use. Run your code, and you should have an interaction happening when your sensor detects motion!

###API and Browser

Below is what a sample API response for your PIR module should look like. Only devices are exposed over the API by Zetta. Your apps are internal to your
IoT system.


```json
{
  "class": [
    "device"
  ],
  "properties": {
    "id": "b8622d08-8721-41f5-8ebc-706e17e8818a",
    "pin": "P9_12",
    "type": "pir",
    "name": "PIR Sensor",
    "state": "no-motion"
  },
  "actions": [
    {
      "name": "motion",
      "method": "POST",
      "href": "http://zetta-cloud-2.herokuapp.com/servers/38f645ed-73da-4742-8f20-c46317a48c19/devices/b8622d08-8721-41f5-8ebc-706e17e8818a",
      "fields": [
        {
          "name": "action",
          "type": "hidden",
          "value": "motion"
        }
      ]
    }
  ],
  "links": [
    {
      "rel": [
        "self"
      ],
      "href": "http://zetta-cloud-2.herokuapp.com/servers/38f645ed-73da-4742-8f20-c46317a48c19/devices/b8622d08-8721-41f5-8ebc-706e17e8818a"
    },
    {
      "title": "beaglebone",
      "rel": [
        "up",
        "http://rels.zettajs.io/server"
      ],
      "href": "http://zetta-cloud-2.herokuapp.com/servers/38f645ed-73da-4742-8f20-c46317a48c19"
    },
    {
      "title": "state",
      "rel": [
        "monitor",
        "http://rels.zettajs.io/object-stream"
      ],
      "href": "ws://zetta-cloud-2.herokuapp.com/servers/38f645ed-73da-4742-8f20-c46317a48c19/events?topic=pir%2Fb8622d08-8721-41f5-8ebc-706e17e8818a%2Fstate"
    },
    {
      "title": "logs",
      "rel": [
        "monitor",
        "http://rels.zettajs.io/object-stream"
      ],
      "href": "ws://zetta-cloud-2.herokuapp.com/servers/38f645ed-73da-4742-8f20-c46317a48c19/events?topic=pir%2Fb8622d08-8721-41f5-8ebc-706e17e8818a%2Flogs"
    }
  ]
}
```
