'use strict';

var assert = require('assert');
var ControllerInterface = require('../lib/controller-interface');

describe('controller-interface', function() {
    beforeEach(function() {
        this.controllerInterface = new ControllerInterface(
            './test-controller.fcl');
    });

    it('it should give an expected output on input', function(done) {
        this.controllerInterface.runController([-0.4, 3.1],
            function(err, result) {
                assertFloatEqual(result, 0.5);
                done();
        });
    });

    it('it should give an expected output on input', function(done) {
        this.controllerInterface.runController([0.2, 1.1],
            function(err, result) {
                assertFloatEqual(result, 1.5);
                done();
        });
    });
});

function assertFloatEqual(actual, expected) {
    assert(Math.abs(actual - expected) < 1e-5, 'expected ' + expected + ', got ' + actual);
}
