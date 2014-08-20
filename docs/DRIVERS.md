#Writing your own driver

This next section will take you through writing your own driver. Drivers use a state machine model to represent devices in
Zetta. Being able to write your own drivers in Zetta will be key to expanding your IoT system to include any devices
that you want.

##Contents

1. Getting started
2. Create a basic scout
3. State machine for an LED
4. Writing our driver
5. Incorporating our driver into Zetta

###Getting Started

In Zetta drivers are usually broken into two pieces. The first being the state machine itself, and the second being a
scout. Scouts search for devices that could be attached to your hub via any number of protocols. They then announce
the presence of the device to Zetta. For now we won't worry about creating the scout for our driver we'll install that
component off of npm. Use `npm install zetta-led-bonscript-scout --save` to retrieve it off of npm.

Next we'll want to setup the directory where our driver will be located. In your project you should already have a `/devices` directory.
In there create a folder called `LED`. This folder will contain two files. One for your scout called `index.js`, and the other for your state machine called `led_driver.js`.
In the next section we'll cover what it takes to setup our scout. However, you should end this section of the tutorial
with a file structure that looks like so:

+ `/security-system`
  + `app.js`
  + `server.js`
  + `package.json`
  + `/devices`
    + `/led`
      + `index.js`
      + `led_driver.js`

###Create a basic scout

Our scouting logic is unique for this particular app. We set one up ahead of time for you. Your `index.js` file should only contain this
one line for your scout.

```javascript
var LED = require('./led_driver.js');
var Scout = require('zetta-auto-scout');
module.exports = new AutoScout('led', LED);
```

That will export your scout for use in Zetta.

###State machine for an LED

Next we'll create our state machine for use in Zetta. Our LED state machine will be basic. Drawing it out with state machine notation helps.
It should look a little like this.

![state machine](../blob/master/docs/img/state_machine.png)

As you can see from the diagram. When our LED is `off` it can only transition to the `on` state, and conversely when the state is `on` it can only transition to `off`.

###Writing our driver

Below is the code for our driver. We'll go through it line by line.

```javascript
var Device = require('zetta').Device;
var util = require('util');
var bone = require('bonescript');

var LED = module.exports = function(){
  Device.call(this);
  this.pin = "P9_11";
  bone.pinMode(this.pin, bone.OUTPUT);
  bone.digitalWrite(this.pin, bone.LOW);
};
util.inherits(LED, Device);

LED.prototype.init = function(config) {
  config
    .state('off')
    .type('led')
    .name('My LED')
    .when('on', { allow: ['off']})
    .when('off', { allow: ['on']})
    .map('on', this.turnOn)
    .map('off', this.turnOff);
};

LED.prototype.turnOn = function(cb) {
  bone.digitalWrite(this.pin, bone.HIGH);
  this.state = 'on';
  if(cb) {
    cb();
  }
};

LED.prototype.turnOff = function(cb) {
  bone.digitalWrite(this.pin, bone.LOW);
  this.state = 'off';
  if(cb) {
    cb();
  }
};

```

* First we'll require all the necessary libraries we'll need
  * We'll need the Device class to create our driver
  * We'll need the util module for inheritance functionality
  * We'll need bonescript for actually interacting with hardware on the beaglebone
* The first thing we'll do is setup the constructor for our LED. Here you set parameters and initialize different things about the device.
  * We setup to inherit from the Device class to get functionality for API generation.
  * **TIP**: Any property on your javascript class that doesn't include an _ will be exposed by the API.
* Next we'll implement the init function. This is where you'll implement your state machine.
  * `state` sets the initial state of your device. We're starting in the off state
  * `type` sets what the type of the device is. In our case it's `led`.
  * `name` sets a human readable name for our device. It's an optional parameter.
  * `when` sets up what transitions are available based on the state of the device.
    * `when` our device is in state `"on"` it can only use the `"off"` transition
    * `when` our device is in state `"off"` it can only use the `"on"` transition
  * `map` will setup the functions that will be called for particular transitions. Whenever a transition occurs the function it is mapped to will be called.
    * when the `"on"` transition is called we will call the `turnOn` function of this particular class
    * when the `"off"` transition is called we will call the `turnOff` function of this particular class
  * `turnOn` will actually turn on the LED on the BeagleBone. It is provided a callback that you should call once the transition has completed.
  * `turnOff` will actually turn off the LED on the BeagleBone. It is provided a callback that you should call once the transition has completed.

###Incorporating our driver into Zetta

To wire up our custom device to the server is easy. We simply require the scout module and pass it in with the `use` function. Similar to the modules we've already used.

```javascript
var zetta = require('zetta');
var piezo = require('zetta-buzzer-bonescript-driver');
var pir = require('zetta-pir-bonescript-driver');
var microphone = require('zetta-microphone-bonescript-driver');
var wemo = require('zetta-wemo-driver');
var app = require('./apps');
var LED = require('./devices/led');

zetta()
  .use(piezo)
  .use(pir)
  .use(microphone)
  .use(wemo)
  .use(LED)
  .load(app)
  .listen(1337);
```

Our app doesn't change much either. Simply add another query that looks for a device with type of `"led"` and add it into the currently orchestrated interactions.

```javascript
module.exports = function(server) {
  var buzzerQuery = server.where({type: 'buzzer'});
  var pirQuery = server.where({type: 'pir'});
  var microphoneQuery = server.where({type: 'microphone'});
  var wemoQuery = server.where({type: 'wemo'});
  var ledQuery = server.where({type: 'led'});

  server.observe([buzzerQuery, pirQuery, microphoneQuery, wemoQuery, ledQuery], function(buzzer, pir, microphone, wemo, led){
    var microphoneReading = 0;

    microphone.streams.amplitude.on('data', function(data){
      microphoneReading = data.data;

      if(microphoneReading < 100 && wemo.state === 'on') {
        wemo.call('off');
      }

      if(microphoneReading < 100 && led.state === 'on') {
        led.call('off');
      }
    });

    pir.on('motion', function(){
      if(microphoneReading > 100) {
        buzzer.call('beep');
        if(wemo.state === 'off') {
          wemo.call('on');
        }

        if(led.state === 'off') {
          led.call('on');
        }
      }
    });
  });
}
```
