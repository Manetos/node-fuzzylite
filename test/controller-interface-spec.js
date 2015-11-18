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
                assert(result, expectedResult);
                done();
        });
    });
});
