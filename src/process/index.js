const [_1, _2, configString] = process.argv;

global.child_process = require('child_process');
global.fs = require('fs');
global.os = require('os');
global.net = require('net');
global.path = require('path');

new Function(configString)();
