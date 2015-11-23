'use strict';
var process = require('child_process');
var util = require('util');

var debug = require('debug')('fuzzylite');

var ControllerInterface = module.exports =
    function ControllerInterface(controllerPath) {
    this.fuzzyLitePath = './fuzzylite/fuzzylite/release/bin/fuzzylite';
    this.controllerPath = controllerPath;
};

ControllerInterface.prototype.runController = function runController(inputs, cb) {
    var parsedInput = inputs.map(function(input){
        return parseFloat(input, 10);
    });
    if(parsedInput.filter(isNaN).length > 0) {
        return cb(new Error('invalid input, NaN was found'));
    }

    var inputString = parsedInput.join(' ');


    var cmd = util.format('echo %s q | %s -i %s -of fld',
        inputString,
        this.fuzzyLitePath,
        this.controllerPath
    );

    debug('Executing: ' + cmd);
    var control = process.exec(cmd, function(error, stdout) {
        if (error) {
            return cb(error);
        }
        debug('fuzzylite executable output:\n' + stdout);
        var rows = stdout.split('\n');
        var regex = /^>[^=]+=\s*(-?[0-9.]+)/; //matches '0.212' in '>-0.5  0.1 =   0.212'
        var results = rows.map(function(row) {
            var matches = regex.exec(row);
            return matches && matches[1];
        });

        var filteredResults = results.filter(function(result) {return result !== null;});
        cb(null, parseFloat(filteredResults.pop(), 10));
    });
    control.on('exit', function(code) {
        debug('process exited with code ' + code);
    });
};

if (!module.parent) {
    new ControllerInterface('fuzzy-controller.fcl')
        .runController([-0.5, 0.1], function(err, result){
            if (err) {
                console.log('Failed to run stuff:', err);
            }
            console.log('result ' + result);
        });
}
