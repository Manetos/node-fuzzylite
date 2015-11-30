'use strict';

var child_process = require('child_process');
var path = require('path');
var util = require('util');

var debug = require('debug')('fuzzylite');

var FuzzyliteBin = module.exports = function FuzzyliteBin(bundledPath) {
    this.bundledFuzzylitePath = path.join(__dirname, '..', 'fuzzylite', 'fuzzylite',
            'release', 'bin', 'fuzzylite');
    if (bundledPath) {
        // This is mainly used for testing
        this.bundledFuzzylitePath = bundledPath;
    }

    this.fuzzyLiteExecString = null;
};

FuzzyliteBin.prototype.getExecutableString = function getExecutableString(cb) {
    var self = this;
    function getExecString(err) {
        if (err) {
            return util.format('LD_LIBRARY_PATH="%s" %s',
                    path.dirname(self.bundledFuzzylitePath),
                    self.bundledFuzzylitePath
                    );
        }
        return 'fuzzylite';
    }

    if (this.fuzzyLiteExecString !== null) {
        return cb(null, this.fuzzyLiteExecString);
    }
    child_process.exec('fuzzylite --help', function(err) {
        var execString = getExecString(err);
        self.fuzzyLiteExecString = execString;
        cb(null, self.fuzzyLiteExecString);
    });
};

FuzzyliteBin.prototype.exec = function exec(inputs, controllerPath, cb) {
    this.getExecutableString(function (err, execString) {
        if (err) {
            return cb(err);
        }

        var inputString = inputs.join(' ');

        var cmd = util.format('echo %s q | %s -i "%s" -of fld',
                inputString,
                execString,
                controllerPath
                );
        debug('Executing: ' + cmd);

        child_process.exec(cmd, cb);
    });
};
