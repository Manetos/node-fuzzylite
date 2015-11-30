'use strict';

var proxyquire = require('proxyquire');
var sinon = require('sinon');
var assert = require('assert');

describe('controller-interface', function() {
    beforeEach(function() {
        this.binary = {
            exec: sinon.stub()
        };

        this.ControllerInterface = proxyquire.noCallThru()
        ('../lib/controller-interface', {
            './fuzzylite-bin': sinon.stub().returns(this.binary)
        });

        this.controllerInterface = new this.ControllerInterface();
    });

    it('should give error on string input', function(done) {
        var self = this;
        this.binary.exec.yields(null, '_');
        this.controllerInterface.runController(['string', 'input'],
            function(err) {
                assert(err);
                assert(!self.binary.exec.called);
                done();
        });
    });

    it('should call exec once given valid input', function(done) {
        var self = this;
        this.binary.exec.yields(null, '_');
        this.controllerInterface.runController([0.1, 0.2],
            function() {
                assert(self.binary.exec.calledOnce);
                done();
        });
    });

    it('should yield the result defined in this test', function(done) {
        var self = this;
        var expectedResult = '> 0.1 0.2 = 0.5';
        this.binary.exec.yields(null, expectedResult);
        this.controllerInterface.runController([0.1, 0.2],
            function(err, result) {
                assert(self.binary.exec.calledOnce);
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
        this.binary.exec.yields(null, fuzzyliteOutput);
        this.controllerInterface.runController([-0.5, 0.1],
            function(err, result) {
                assertFloatEqual(result, 0.212);
                done();
        });
    });

    it('should return result as a number', function(done) {
        this.binary.exec.yields(null, '>0.1 0.2 = 0.3');
        this.controllerInterface.runController([0.1, 0.2],
            function(err, result) {
                assert.equal(typeof result, 'number');
                done();
        });
    });

    it('should handle nan result', function(done) {
        this.binary.exec.yields(null, '>0.1 0.2 = nan');
        this.controllerInterface.runController([0.5, 0.2],
            function(err, result) {
                assert(isNaN(result));
                done();
        });
    });

    it('should handle negative inputs', function(done) {
        this.binary.exec.yields(null, '>-0.5 -0.2 = 0.2');
        this.controllerInterface.runController([-0.5, -0.2],
            function(err, result) {
                assertFloatEqual(result, 0.2);
                done();
        });
    });

    it('should handle negative outputs', function(done) {
        this.binary.exec.yields(null, '>0.5 0.2 = -0.2');
        this.controllerInterface.runController([0.5, 0.2],
            function(err, result) {
                assertFloatEqual(result, -0.2);
                done();
        });
    });
});

function assertFloatEqual(actual, expected) {
    assert(Math.abs(actual - expected) < 1e-5, 'expected ' + expected + ', got ' + actual);
}
