'use strict';

var proxyquire = require('proxyquire');
var sinon = require('sinon');
var assert = require('assert');

describe('controller-interface', function() {
    beforeEach(function() {
        this.process = {
            exec: sinon.stub().returns({
                on: sinon.spy()
            })
        };

        this.ControllerInterface = proxyquire.noCallThru()
        ('../lib/controller-interface', {
            'child_process': this.process,
        });

        this.controllerInterface = new this.ControllerInterface();
    });

    it('should give error on string input', function(done) {
        var self = this;
        this.process.exec.yields(null, '_');
        this.controllerInterface.runController(['string', 'input'],
            function(err) {
                assert(err);
                assert(!self.process.exec.called);
                done();
        });
    });

    it('should be called once with valid input', function(done) {
        var self = this;
        this.process.exec.yields(null, '_');
        this.controllerInterface.runController([0.1, 0.2],
            function() {
                assert(self.process.exec.calledOnce);
                done();
        });
    });

    it('should yield the result defined in this test', function(done) {
        var self = this;
        var expectedResult = '> 0.1 0.2 = 0.5';
        this.process.exec.yields(null, expectedResult);
        this.controllerInterface.runController([0.1, 0.2],
            function(err, result) {
                assert(self.process.exec.calledOnce);
                // FIXME this should probably be assert.equal
                assert(result, expectedResult);
                done();
        });
    });

    it('should have no issue ignoring lines starting with #', function(done) {
        var fuzzyliteOutput = [
            '#FuzzyLite Interactive Console (press H for help)',
            '#@Engine: simple-dimmer;',
            '#@InputVariable: Ambient;       @OutputVariable: Power;',
            '>-0.5  0.1 =   0.212',
        ].join('\n');
        this.process.exec.yields(null, fuzzyliteOutput);
        this.controllerInterface.runController([-0.5, 0.1],
            function(err, result) {
                assertFloatEqual(result, 0.212);
                done();
        });
    });

    it('should return result as a number', function(done) {
        this.process.exec.yields(null, '>0.1 0.2 = 0.3');
        this.controllerInterface.runController([0.1, 0.2],
            function(err, result) {
                assert.equal(typeof result, 'number');
                done();
        });
    });

    it('should handle nan result', function(done) {
        this.process.exec.yields(null, '>0.1 0.2 = nan');
        this.controllerInterface.runController([0.5, 0.2],
            function(err, result) {
                assert(isNaN(result));
                done();
        });
    });

    it('should handle negative inputs', function(done) {
        this.process.exec.yields(null, '>-0.5 -0.2 = 0.2');
        this.controllerInterface.runController([-0.5, -0.2],
            function(err, result) {
                assertFloatEqual(result, 0.2);
                done();
        });
    });

    it('should handle negative outputs', function(done) {
        this.process.exec.yields(null, '>0.5 0.2 = -0.2');
        this.controllerInterface.runController([0.5, 0.2],
            function(err, result) {
                assertFloatEqual(result, -0.2);
                done();
        });
    });
});

function assertFloatEqual(actual, expected) {
    assert(Math.abs(actual - expected) < 1e-5, 'expected ' + 0.212 + ', got ' + actual);
}
