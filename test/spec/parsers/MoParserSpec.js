var fs = require('fs');
var path = require('path');
var commonSpec = require('./CommonSpec.js');
var MoParser = requireSrc('parsers/MoParser');

describe('A MoParser instance', function() {
    it('throws an error when parsing an invalid mo file', function() {
        var mo = fs.readFileSync(path.resolve(__dirname, 'testdata/invalid.mo'));
        var parser = new MoParser();

        expect(function() {
            parser.parse('foobar', mo);
        }).toThrowError('Invalid mo file!');
    });

    describe('reads little-endian mo file and', function() {
        runCommonSpecs('testdata/valid-le.mo');
    });

    describe('reads big-endian mo file and', function() {
        runCommonSpecs('testdata/valid-be.mo');
    });


    function runCommonSpecs(file) {
        beforeAll(function() {
            this.domain = 'domain';
            var mo = fs.readFileSync(path.resolve(__dirname, file));

            var parser = new MoParser();
            this.result = parser.parse(this.domain, mo);
        });

        commonSpec();
    }
});