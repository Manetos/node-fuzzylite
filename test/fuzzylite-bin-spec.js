'use strict';

var assert = require('assert');
var util = require('util');

var proxyquire = require('proxyquire');
var sinon = require('sinon');

var child_process = {};
var FuzzyliteBin = proxyquire('../lib/fuzzylite-bin', {
    child_process: child_process
});

describe('FuzzyliteBin', function() {
    beforeEach(function() {
        child_process.exec = sinon.stub();
    });
    describe('getExecutableString', function() {
        it('should return "fuzzylite" if no errors were encountered when executing it',
                function(done) {
            child_process.exec.yields(null);
            var bin = new FuzzyliteBin();
            bin.getExecutableString(function(err, str) {
                assert.ifError(err);
                assert.strictEqual(str, 'fuzzylite');
                done();
            });
        });
        it('should return bundled fuzzylite if error were encountered when executing it',
                function(done) {
            child_process.exec.yields(new Error('Test error'));
            var bin = new FuzzyliteBin('test/path/fuzzylite');
            bin.getExecutableString(function(err, str) {
                assert.ifError(err);

                assert(/.*? test\/path\/fuzzylite$/.test(str),
                        util.format('"%s" should end in "test/path/fuzzylite"', str));
                done();
            });
        });
        it('should set LD_LIBRARY_PATH if using bundled binary',
                function(done) {
            child_process.exec.yields(new Error('Test error'));
            var bin = new FuzzyliteBin('test/path/fuzzylite');
            bin.getExecutableString(function(err, str) {
                assert.ifError(err);

                assert(/LD_LIBRARY_PATH="test\/path"/.test(str),
                        util.format('"%s" should contain "test/path', str));
                done();
            });
        });
    });

    describe('exec', function() {
        it('should call child_process.exec with correct arguments', function(done) {
            child_process.exec.withArgs('fuzzylite --help').yields(null);
            child_process.exec.yields();
            var bin = new FuzzyliteBin();
            bin.exec([1, 2], 'controller.fcl', function(err) {
                assert.ifError(err);
                // This is kind of fragile, if we run into problems with this
                // test we should probably refactor it
                assert(child_process.exec.calledWith(
                            'echo 1 2 q | fuzzylite -i "controller.fcl" -of fld'));
                done();
            });
        });
    });
});
