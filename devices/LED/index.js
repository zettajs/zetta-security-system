var Device = require('zetta').Device;
var util = require('util');
var bone = require('bonescript');

var Led = module.exports = function(pin) {
  Device.call(this);
  this.pin = "P9_41";
};
util.inherits(Led, Device);

Led.prototype.init = function(config) {
  config
    .state('off')
    .type('led')
    .name('LED')
    .when('on', { allow: ['turn-off', 'toggle'] })
    .when('off', { allow: ['turn-on', 'toggle'] })
    .map('turn-on', this.turnOn)
    .map('turn-off', this.turnOff)
    .map('toggle', this.toggle);
    
  //Everything is off to start
  bone.pinMode(this.pin, bone.OUTPUT);
  bone.digitalWrite(this.pin, 0);
};

Led.prototype.turnOn = function(cb) {
  var self = this;
  bone.digitalWrite(this.pin, 1, function() {
    self.state = 'on';
    cb();
  });
};

Led.prototype.turnOff = function(cb) {
  var self = this;
  bone.digitalWrite(this.pin, 0, function() {
    self.state = 'off';
    cb();
  });
};

Led.prototype.toggle = function(cb) {
  if (this.state === 'on') {
    this.call('turn-off', cb);
  } else {
    this.call('turn-on', cb);
  }
};