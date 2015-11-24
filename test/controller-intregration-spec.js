'use strict';

//var proxyquire = require('proxyquire');
//var sinon = require('sinon');
var assert = require('assert');
var ControllerInterface = require('../lib/controller-interface');

describe('controller-interface', function() {
    beforeEach(function() {
        this.controllerInterface = new ControllerInterface('./test-controller.fcl');
    });

    it('it should give an expected output on input', function(done) {
        //var self = this;
        this.controllerInterface.runController([0.2],
            function(err, result) {
                assertFloatEqual(result, 1.5);
                done();
        });
    });

    it('it should give an expected output on input', function(done) {
        //var self = this;
        this.controllerInterface.runController([0.8],
            function(err, result) {
                assertFloatEqual(result, 0.5);
                done();
        });
    });
});

function assertFloatEqual(actual, expected) {
    assert(Math.abs(actual - expected) < 1e-5, 'expected ' + expected + ', got ' + actual);
}
