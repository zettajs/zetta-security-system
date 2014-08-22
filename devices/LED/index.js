var LED = require('./led_driver.js');
var Scout = require('zetta-auto-scout');
module.exports = new AutoScout('led', LED);
