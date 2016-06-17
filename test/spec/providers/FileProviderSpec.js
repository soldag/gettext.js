var path = require('path');
var FileProvider = requireSrc('providers/FileProvider');
var EnvMockedFileProvider = requireSrc('providers/FileProvider', {
    'detect-node': false
});

describe('A FileProvider instance', function() {
    beforeEach(function() {
        this.parserResult = 'foobar';
        this.poParserSpy = jasmine.createSpyObj('PoParser', ['parse']);
        this.poParserSpy.parse.and.returnValue(this.parserResult);
        this.moParserSpy = jasmine.createSpyObj('MoParser', ['parse']);
        this.moParserSpy.parse.and.returnValue(this.parserResult);

        this.defaultDomain = 'foobar';
        this.provider = new FileProvider(this.defaultDomain, this.poParserSpy, this.moParserSpy);
        this.envMockedProvider = new EnvMockedFileProvider(this.defaultDomain, this.poParserSpy, this.moParserSpy);

        // Add custom matcher to compare typed arrays, because jasmine's implementation is buggy.
        jasmine.addMatchers({
            toTypedArrayEqual : function() {
                return {
                    compare: function(actual, expected) {
                        if (expected === undefined) {
                            expected = [];
                        }

                        var result = {
                            pass: actual.every(function(v, i) { return v === expected[i] })
                        };
                        if(result.pass) {
                            result.message = 'Expected ' + Array.from(actual) + ' to not equal ' + Array.from(expected) + '.';
                        }
                        else {
                            result.message = 'Expected ' + Array.from(actual) + ' to equal ' + Array.from(expected) + '.';
                        }

                        return result
                    }
                };
            }
        });
    });

    it('can load valid options', function() {
        var options = {
            mode: 'file',
            path: 'string'
        };
        expect(this.provider.canLoadFromOptions(options)).toBe(true);
    });

    it('cannot load options without path attribute', function() {
        var options = {
            text: 'foobar'
        };
        expect(this.provider.canLoadFromOptions(options)).toBe(false);
    });

    it('cannot load options with wrong mode attribute', function() {
        var options = {
            mode: 'text',
            data: 'foobar'
        };
        expect(this.provider.canLoadFromOptions(options)).toBe(false);
    });

    it('loads po files correctly', function(done) {
        var _this = this;

        this.provider.load('foo', path.resolve(__dirname, 'testdata/translations.po'), function(result) {
            expect(result).toBe(_this.parserResult);
            expect(_this.poParserSpy.parse).toHaveBeenCalledWith('foo', 'foobar');
            done();
        });
    });

    it('loads mo files correctly', function(done) {
        var _this = this;

        this.provider.load('foo', path.resolve(__dirname, 'testdata/translations.mo'), function(result) {
            expect(result).toBe(_this.parserResult);
            var callArgs = _this.moParserSpy.parse.calls.mostRecent().args;
            expect(callArgs[0]).toBe('foo');
            expect(callArgs[1]).toTypedArrayEqual(new Uint8Array([42]));
            done();
        });
    });

    it('throws an error for invalid file extensions', function() {
        var _this = this;
        expect(function() {
            _this.provider.load('foo', 'foobar.txt');
        }).toThrowError('Invalid file type!');
    });

    it('throws an error if not used in an node environment', function() {
        var _this = this;
        expect(function() {
            _this.envMockedProvider.load('foo', path.resolve(__dirname, 'testdata/translations.po'));
        }).toThrowError('Loading translations from the file system is only supported using Node.js.');
    });

    it('extracts required properties from options with specific domain', function() {
        var options = {
            mode: 'file',
            domain: 'foobar',
            path: 'foo.po'
        };
        var callback = 'foobar';

        spyOn(this.provider, 'load');
        this.provider.loadFromOptions(options, callback);
        expect(this.provider.load).toHaveBeenCalledWith(options.domain, options.path, callback);
    });

    it('extracts required properties from options without specific domain', function() {
        var options = {
            mode: 'file',
            path: 'foo.po'
        };
        var callback = 'foobar';

        spyOn(this.provider, 'load');
        this.provider.loadFromOptions(options, callback);
        expect(this.provider.load).toHaveBeenCalledWith(this.defaultDomain, options.path, callback);
    });
});