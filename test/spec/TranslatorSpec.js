var Translator = requireSrc('Translator');
var Translation = requireSrc('translations/Translation');
var DomainCollection = requireSrc('translations/DomainCollection');
var TranslationCollection = requireSrc('translations/TranslationCollection');

var testData = require('./testdata/translator');


describe('A Translator instance', function() {
    beforeEach(function() {
        this.sprintfSpy = jasmine.createSpy('sprintf');
        this.sprintfSpy.and.callFake(function(format) {
            return format;
        });
        this.vsprintfSpy = jasmine.createSpy('vsprintf');
        this.vsprintfSpy.and.callFake(function(format) {
            return format;
        });

        Translator = requireSrc('Translator', {
            'sprintf-js': {
                sprintf: this.sprintfSpy,
                vsprintf: this.vsprintfSpy
            }
        });
    });


    it('is created correctly with ignoreFuzzy argument', function() {
        var provider = 'foo', defaultDomain = 'foobar', ignoreFuzzy = false;
        var translator = new Translator(provider, defaultDomain, ignoreFuzzy);

        expect(translator.provider).toBe(provider);
        expect(translator.defaultDomain).toBe(defaultDomain);
        expect(translator.ignoreFuzzy).toBe(ignoreFuzzy);
    });


    it('is created correctly without ignoreFuzzy argument', function() {
        var provider = 'foo', defaultDomain = 'foobar';
        var translator = new Translator(provider, defaultDomain);

        expect(translator.provider).toBe(provider);
        expect(translator.defaultDomain).toBe(defaultDomain);
        expect(translator.ignoreFuzzy).toBe(translator.DEFAULT_IGNORE_FUZZY);
    });


    it('loads from valid options correctly', function(done) {
        var translations = createDomainCollection({
            foo: [new Translation('foo', 'fu')]
        });
        var providerSpy = jasmine.createSpyObj('Provider', ['canLoadFromOptions', 'loadFromOptions']);
        providerSpy.canLoadFromOptions.and.returnValue(true);
        providerSpy.loadFromOptions.and.callFake(function(options, callback) {
            callback(translations);
        });

        var translator = new Translator(providerSpy, 'foobar');
        translator.load({
            domain: 'fubar',
            ready: function() {
                expect(providerSpy.loadFromOptions).toHaveBeenCalledWith({domain: 'fubar'}, jasmine.any(Function));
                expect(translator.domains).toEqual(translations);
                done();
            }
        });
    });


    it('uses default domain, if loading options do not contain a domain', function(done) {
        var translations = createDomainCollection({
            foo: [new Translation('foo', 'fu')]
        });
        var providerSpy = jasmine.createSpyObj('Provider', ['canLoadFromOptions', 'loadFromOptions']);
        providerSpy.canLoadFromOptions.and.returnValue(true);
        providerSpy.loadFromOptions.and.callFake(function(options, callback) {
            callback(translations);
        });

        var translator = new Translator(providerSpy, 'foobar');
        translator.load({
            ready: function() {
                expect(providerSpy.loadFromOptions).toHaveBeenCalledWith({domain: 'foobar'}, jasmine.any(Function));
                expect(translator.domains).toEqual(translations);
                done();
            }
        });
    });


    it('adds newly loaded translations to existing ones correctly', function(done) {
        var existingTranslations = createDomainCollection({
            foo: [new Translation('foo', 'foo')],
            foobar: [new Translation('foobar', 'fubar')]
        });
        var newTranslations = createDomainCollection({
            foo: [new Translation('foo', 'fu')],
            bar: [new Translation('bar', 'bar')]
        });
        var expectedTranslations = createDomainCollection({
            foo: [new Translation('foo', 'fu')],
            bar: [new Translation('bar', 'bar')],
            foobar: [new Translation('foobar', 'fubar')]
        });

        var providerSpy = jasmine.createSpyObj('Provider', ['canLoadFromOptions', 'loadFromOptions']);
        providerSpy.canLoadFromOptions.and.returnValue(true);
        providerSpy.loadFromOptions.and.callFake(function(options, callback) {
            callback(newTranslations);
        });

        var translator = new Translator(providerSpy, 'foobar');
        translator.domains = existingTranslations;
        translator.load({
            domain: 'fubar',
            ready: function() {
                expect(providerSpy.loadFromOptions).toHaveBeenCalledWith({domain: 'fubar'}, jasmine.any(Function));
                expect(translator.domains).toEqual(expectedTranslations);
                done();
            }
        });
    });


    it('throws an error when loading from options the provider can not load from', function() {
        var providerSpy = jasmine.createSpyObj('Provider', ['canLoadFromOptions']);
        providerSpy.canLoadFromOptions.and.returnValue = false;
        var translator = new Translator(providerSpy, 'foobar');

        expect(function() {
            translator.load({});
        }).toThrowError('No valid options provided for loading translation domains.');
    });


    describe('redirect appropriate calls to "translate" function to', function() {
        function testMethod(method, baseArgs) {
            it('"' + method + '" function', function() {
                var translator = createTranslator('default', []);
                spyOn(translator, method);

                // Test all combinations of placeholders (not present, array, object)
                var allArgs = [baseArgs, baseArgs.concat([['bar']]), baseArgs.concat({foo: 'bar'})];
                for(var i = 0; i < allArgs.length; i++) {
                    translator.translate.apply(translator, allArgs[i]);
                }

                expect(translator[method].calls.allArgs()).toEqual(allArgs)
            });
        }

        var args = {
            'gettext': ['foo'],
            'dgettext': ['foo', 'bar'],
            'dcgettext': ['foo', 'bar', 'foobar'],
            'ngettext': ['foo', 'bar', 42],
            'dngettext': ['foo', 'bar', 'foobar', 42],
            'dcngettext': ['foo', 'bar', 'foobar', 'fubar', 42]
        };
        for(var method in args) {
            testMethod(method, args[method]);
        }
    });


    describe('throws an error when calling "translate" function', function() {
        it('with too much arguments', function() {
            var translator = createTranslator('default', []);
            expect(function() {
                translator.translate('foo', 'fu', 'bar', 'foobar');
            }).toThrowError('Arguments are not valid for any of the gettext functions.');
        });

        it('with invalid arguments', function() {
            var translator = createTranslator('default', []);
            expect(function() {
                translator.translate(42, 'foo');
            }).toThrowError('Arguments are not valid for any of the gettext functions.');
        });

        it('with no arguments', function() {
            var translator = createTranslator('default', []);
            expect(function() {
                translator.translate();
            }).toThrowError('Arguments are not valid for any of the gettext functions.');
        });
    });


    describe('translates correctly using', function() {
        function testMethod(method) {
            it(method, function() {
                var translator = createTranslator('default', testData[method].translations);

                for (var i = 0; i < testData[method].cases.length; i++) {
                    var testCase = testData[method].cases[i];
                    args = testCase.arguments;
                    if ('placeholderValues' in testCase) {
                        args.push(testCase.placeholderValues);
                    }

                    // Assert, that translation is correct
                    var translation = translator[method].apply(translator, args);
                    expect(translation).toBe(testCase.translation);

                    // Assert, that (v)sprintf is correctly called according to placeholderValues
                    if ('placeholderValues' in testCase) {
                        if (Array.isArray(testCase.placeholderValues)) {
                            expect(this.sprintfSpy).not.toHaveBeenCalled();
                            expect(this.vsprintfSpy).toHaveBeenCalledWith(translation, testCase.placeholderValues);
                        }
                        else if (typeof testCase.placeholderValues === 'object') {
                            expect(this.sprintfSpy).toHaveBeenCalledWith(translation, testCase.placeholderValues);
                            expect(this.vsprintfSpy).not.toHaveBeenCalled();
                        }
                        else {
                            expect(this.sprintfSpy).not.toHaveBeenCalled();
                            expect(this.vsprintfSpy).not.toHaveBeenCalled();
                        }

                        // Reset spies
                        this.sprintfSpy.calls.reset();
                        this.vsprintfSpy.calls.reset();
                    }
                }
            });
        }

        for (var method in testData) {
            testMethod(method);
        }
    });


    it('uses default plural form if according header is not set', function() {
        var translator = createTranslator('default', {
            default: [new Translation('message', null, null, 'messages', ['Nachricht', 'Nachrichten', 'mehr Nachrichten'])]
        }, {});

        expect(translator.ngettext('message', 'messages', 1)).toBe('Nachricht');
        expect(translator.ngettext('message', 'messages', 2)).toBe('Nachrichten');
        expect(translator.ngettext('message', 'messages', 3)).toBe('Nachrichten');
    });


    it('returns singular forms if plural-forms header is invalid', function() {
        var translator = createTranslator('default', {
            default: [new Translation('message', null, null, 'messages', ['Nachricht', 'Nachrichten'])]
        }, {
            'Plural-Forms': 'nplurals=2'
        });

        expect(translator.ngettext('message', 'messages', 1)).toBe('Nachricht');
        expect(translator.ngettext('message', 'messages', 2)).toBe('Nachricht');
    });


    it('supports plural-forms that use boolean instead of integer values to determine the plural form', function() {
        var translator = createTranslator('default', {
            default: [new Translation('message', null, null, 'messages', ['Nachricht', 'Nachrichten'])]
        }, {
            'Plural-Forms': 'nplurals=2; plural=(n != 1)'
        });

        expect(translator.ngettext('message', 'messages', 1)).toBe('Nachricht');
        expect(translator.ngettext('message', 'messages', 2)).toBe('Nachrichten');
        expect(translator.ngettext('message', 'messages', 3)).toBe('Nachrichten');
    });


    it('does not replace placeholders if values argument is invalid', function() {
        var translator = createTranslator('default', {
            default: [
                new Translation('Send to %s', 'An %s senden')
            ]
        });

        expect(translator.gettext('Send to %s', 'John Doe')).toBe('An %s senden');
        expect(this.sprintfSpy).not.toHaveBeenCalled();
        expect(this.vsprintfSpy).not.toHaveBeenCalled();
    });


    it('ignores fuzzy translations, if configured', function() {
        var translator = createTranslator('default', {
            default: [
                new Translation('foobar', 'fubar', null, null, null, ['fuzzy'])
            ]
        });
        translator.setIgnoreFuzzy(true);

        expect(translator.gettext('foobar')).toBe('foobar');
    });


    it('does not ignore fuzzy translations, if configured', function() {
        var translator = createTranslator('default', {
            default: [
                new Translation('foobar', 'fubar', null, null, null, ['fuzzy'])
            ]
        });
        translator.setIgnoreFuzzy(false);

        expect(translator.gettext('foobar')).toBe('fubar');
    });


    // Helper functions
    function createTranslator(defaultDomain, domainTranslations, headers) {
        var domainCollection;
        if(domainTranslations) {
            domainCollection = createDomainCollection(domainTranslations, headers);
        }
        else {
            domainCollection = new DomainCollection();
        }

        var translator = new Translator(null, defaultDomain);
        translator.domains = domainCollection;

        return translator;
    }

    function createDomainCollection(domainTranslations, headers) {
        if(typeof headers === 'undefined') {
            headers = {
                'Plural-Forms': 'nplurals=2; plural=(n == 1 ? 0 : 1);'
            };
        }

        var domains = {};
        for (var domain in domainTranslations) {
            if (domainTranslations.hasOwnProperty(domain)) {
                var translations = {};
                for(var i = 0; i < domainTranslations[domain].length; i++) {
                    var translation = domainTranslations[domain][i];
                    if(!(translation.getKey() in translations)) {
                        translations[translation.getKey()] = [];
                    }
                    translations[translation.getKey()].push(translation);
                }
                domains[domain] = new TranslationCollection(headers, translations);
            }
        }

        return new DomainCollection(domains);
    }
});