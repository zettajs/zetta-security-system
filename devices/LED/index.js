var LED = require('./led_driver.js');
var AutoScout = require('zetta-auto-scout');
module.exports = new AutoScout('led', LED);
