var Translator = requireSrc('Translator');
var Translation = requireSrc('translations/Translation');
var DomainCollection = requireSrc('translations/DomainCollection');
var TranslationCollection = requireSrc('translations/TranslationCollection');


describe('A Translator instance', function() {
    beforeEach(function() {
        this.sprintfSpy = jasmine.createSpy('sprintf');
        this.sprintfSpy.and.returnValue('sprintf');
        this.vsprintfSpy = jasmine.createSpy('vsprintf');
        this.vsprintfSpy.and.returnValue('vsprintf');

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
            ready: function() {
                expect(providerSpy.loadFromOptions).toHaveBeenCalledWith({}, jasmine.any(Function));
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
            ready: function() {
                expect(providerSpy.loadFromOptions).toHaveBeenCalledWith({}, jasmine.any(Function));
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

    it('translates a simple key-value translation correctly (gettext)', function() {
        var translator = createTranslator('default', {
            default: [new Translation('message', 'Nachricht')]
        });

        // Existing translation
        expect(translator.gettext('message')).toBe('Nachricht');

        // Non-existing translation
        expect(translator.gettext('receiver')).toBe('receiver');
    });

    it('translates a domain-dependent key-value translation correctly (dgettext)', function() {
        var translator = createTranslator('default', {
            mail: [new Translation('message', 'Nachricht')],
            art: [new Translation('message', 'Aussage')]
        });

        // Existing translations
        expect(translator.dgettext('mail', 'message')).toBe('Nachricht');
        expect(translator.dgettext('art', 'message')).toBe('Aussage');

        // Non-existing translations
        expect(translator.dgettext('mail', 'receiver')).toBe('receiver');
        expect(translator.dgettext('technology', 'message')).toBe('message');
    });

    it('translates a context-dependent key-value translation correctly (cgettext)', function() {
        var translator = createTranslator('default', {
            default: [
                new Translation('message', 'Nachricht', 'mail'),
                new Translation('message', 'Aussage', 'art')
            ]
        });

        // Existing translations
        expect(translator.cgettext('mail', 'message')).toBe('Nachricht');
        expect(translator.cgettext('art', 'message')).toBe('Aussage');

        // Non-existing translations
        expect(translator.cgettext('mail', 'receiver')).toBe('receiver');
        expect(translator.cgettext('technology', 'message')).toBe('message');
    });

    it('translates a domain and context-dependent key-value translation correctly (dcgettext)', function() {
        var translator = createTranslator('default', {
            domain1: [
                new Translation('message', 'Nachricht', 'mail'),
                new Translation('message', 'Aussage', 'art')
            ],
            domain2: [
                new Translation('message', 'Brief', 'mail'),
                new Translation('message', 'Botschaft', 'art')
            ]
        });

        // Existing translations
        expect(translator.dcgettext('domain1', 'mail', 'message')).toBe('Nachricht');
        expect(translator.dcgettext('domain1', 'art', 'message')).toBe('Aussage');
        expect(translator.dcgettext('domain2', 'mail', 'message')).toBe('Brief');
        expect(translator.dcgettext('domain2', 'art', 'message')).toBe('Botschaft');

        // Non-existing translations
        expect(translator.dcgettext('domain3', 'mail', 'message')).toBe('message');
        expect(translator.dcgettext('domain1', 'technology', 'message')).toBe('message');
        expect(translator.dcgettext('domain1', 'mail', 'receiver')).toBe('receiver');
    });

    it('translates a simple plural translation correctly (ngettext)', function() {
        var translator = createTranslator('default', {
            default: [
                new Translation('message', null, null, 'messages', ['Nachricht', 'Nachrichten']),
                new Translation('sender', 'Absender')
            ]
        });

        // Existing translations
        expect(translator.ngettext('message', 'messages', 1)).toBe('Nachricht');
        expect(translator.ngettext('message', 'message', 2)).toBe('Nachrichten');

        // Non-existing translations
        expect(translator.ngettext('sender', 'senders', 1)).toBe('sender');
        expect(translator.ngettext('sender', 'senders', 2)).toBe('senders');
        expect(translator.ngettext('receiver', 'receivers', 1)).toBe('receiver');
        expect(translator.ngettext('receiver', 'receivers', 2)).toBe('receivers');
    });

    it('translates a domain-dependent plural translation correctly (dngettext)', function() {
        var translator = createTranslator('default', {
            mail: [
                new Translation('message', null, null, 'messages', ['Nachricht', 'Nachrichten']),
                new Translation('sender', 'Absender')
            ],
            art: [
                new Translation('message', null, null, 'messages', ['Aussage', 'Aussagen']),
            ]
        });

        // Existing translations
        expect(translator.dngettext('mail', 'message', 'messages', 1)).toBe('Nachricht');
        expect(translator.dngettext('mail', 'message', 'messages', 2)).toBe('Nachrichten');
        expect(translator.dngettext('art', 'message', 'messages', 1)).toBe('Aussage');
        expect(translator.dngettext('art', 'message', 'messages', 2)).toBe('Aussagen');

        // Non-existing translations
        expect(translator.dngettext('mail', 'sender', 'senders', 1)).toBe('sender');
        expect(translator.dngettext('mail', 'sender', 'senders', 2)).toBe('senders');
        expect(translator.dngettext('technology', 'message', 'messages', 1)).toBe('message');
        expect(translator.dngettext('technology', 'message', 'messages', 2)).toBe('messages');
        expect(translator.dngettext('mail', 'receiver', 'receivers', 1)).toBe('receiver');
        expect(translator.dngettext('mail', 'receiver', 'receivers', 2)).toBe('receivers');
    });

    it('translates a context-dependent plural translation correctly (cngettext)', function() {
        var translator = createTranslator('default', {
            default: [
                new Translation('message', null, 'mail', 'messages', ['Nachricht', 'Nachrichten']),
                new Translation('message', null, 'art', 'messages', ['Aussage', 'Aussagen'])
            ]
        });

        // Existing translations
        expect(translator.cngettext('mail', 'message', 'messages', 1)).toBe('Nachricht');
        expect(translator.cngettext('mail', 'message', 'messages', 2)).toBe('Nachrichten');
        expect(translator.cngettext('art', 'message', 'messages', 1)).toBe('Aussage');
        expect(translator.cngettext('art', 'message', 'messages', 2)).toBe('Aussagen');

        // Non-existing translations
        expect(translator.cngettext('mail', 'sender', 'senders', 1)).toBe('sender');
        expect(translator.cngettext('mail', 'sender', 'senders', 2)).toBe('senders');
        expect(translator.cngettext('technology', 'message', 'messages', 1)).toBe('message');
        expect(translator.cngettext('technology', 'message', 'messages', 2)).toBe('messages');
        expect(translator.cngettext('mail', 'receiver', 'receivers', 1)).toBe('receiver');
        expect(translator.cngettext('mail', 'receiver', 'receivers', 2)).toBe('receivers');
    });

    it('translates a domain and context-dependent plural translation correctly (dcngettext)', function() {
        var translator = createTranslator('default', {
            domain1: [
                new Translation('message', null, 'mail', 'messages', ['Nachricht', 'Nachrichten']),
                new Translation('message', null, 'art', 'messages', ['Aussage', 'Aussagen'])
            ],
            domain2: [
                new Translation('message', null, 'mail', 'messages', ['Brief', 'Briefe']),
                new Translation('message', null, 'art', 'messages', ['Botschaft', 'Botschaften'])
            ]
        });

        // Existing translations
        expect(translator.dcngettext('domain1', 'mail', 'message', 'messages', 1)).toBe('Nachricht');
        expect(translator.dcngettext('domain1', 'mail', 'message', 'messages', 2)).toBe('Nachrichten');
        expect(translator.dcngettext('domain1', 'art', 'message', 'messages', 1)).toBe('Aussage');
        expect(translator.dcngettext('domain1', 'art', 'message', 'messages', 2)).toBe('Aussagen');
        expect(translator.dcngettext('domain2', 'mail', 'message', 'messages', 1)).toBe('Brief');
        expect(translator.dcngettext('domain2', 'mail', 'message', 'messages', 2)).toBe('Briefe');
        expect(translator.dcngettext('domain2', 'art', 'message', 'messages', 1)).toBe('Botschaft');
        expect(translator.dcngettext('domain2', 'art', 'message', 'messages', 2)).toBe('Botschaften');

        // Non-existing translations
        expect(translator.dcngettext('domain1', 'mail', 'sender', 'senders', 1)).toBe('sender');
        expect(translator.dcngettext('domain1', 'mail', 'sender', 'senders', 2)).toBe('senders');
        expect(translator.dcngettext('domain1', 'technology', 'message', 'messages', 1)).toBe('message');
        expect(translator.dcngettext('domain1', 'technology', 'message', 'messages', 2)).toBe('messages');
        expect(translator.dcngettext('domain1', 'mail', 'receiver', 'receivers', 1)).toBe('receiver');
        expect(translator.dcngettext('domain1', 'mail', 'receiver', 'receivers', 2)).toBe('receivers');
        expect(translator.dcngettext('domain2', 'mail', 'sender', 'senders', 1)).toBe('sender');
        expect(translator.dcngettext('domain2', 'mail', 'sender', 'senders', 2)).toBe('senders');
        expect(translator.dcngettext('domain2', 'technology', 'message', 'messages', 1)).toBe('message');
        expect(translator.dcngettext('domain2', 'technology', 'message', 'messages', 2)).toBe('messages');
        expect(translator.dcngettext('domain2', 'mail', 'receiver', 'receivers', 1)).toBe('receiver');
        expect(translator.dcngettext('domain2', 'mail', 'receiver', 'receivers', 2)).toBe('receivers');
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

    it('replaces placeholders in translations correctly using sprintf', function() {
        var translator = createTranslator('default', {
            domain: [
                new Translation('Send to %s', 'An %s senden', 'mail'),
                new Translation('%i new message from %s', null, 'mail', '%i new messages from %s', ['%i neue Nachricht von %s', '%i neue Nachrichten von %s'])
            ]
        });

        var placeholders = ['John Doe'];
        expect(translator.dcgettext('domain', 'mail', 'Send to %s', placeholders)).toBe('vsprintf');
        expect(this.vsprintfSpy).toHaveBeenCalledWith('An %s senden', placeholders);

        placeholders = [1, 'John Doe'];
        expect(translator.dcngettext('domain', 'mail', '%i new message from %s', '%i new messages from %s', 1, placeholders)).toBe('vsprintf');
        expect(this.vsprintfSpy).toHaveBeenCalledWith('%i neue Nachricht von %s', placeholders);

        placeholders = [3, 'John Doe'];
        expect(translator.dcngettext('domain', 'mail', '%i new message from %s', '%i new messages from %s', 3, placeholders)).toBe('vsprintf');
        expect(this.vsprintfSpy).toHaveBeenCalledWith('%i neue Nachrichten von %s', placeholders);

        expect(this.sprintfSpy).not.toHaveBeenCalled();
    });

    it('replaces placeholders in translations correctly using vsprintf', function() {
        var translator = createTranslator('default', {
            domain: [
                new Translation('Send to %(receiver)s', 'An %(receiver)s senden', 'mail'),
                new Translation('%(num)i new message from %(sender)s', null, 'mail', '%(num)i new messages from %(sender)s', ['%(num)i neue Nachricht von %(sender)s', '%(num)i neue Nachrichten von %(sender)s'])
            ]
        });

        var placeholders = {
            receiver: 'John Doe'
        };
        expect(translator.dcgettext('domain', 'mail', 'Send to %(receiver)s', placeholders)).toBe('sprintf');
        expect(this.sprintfSpy).toHaveBeenCalledWith('An %(receiver)s senden', placeholders);


        placeholders = {
            num: 1,
            sender: 'John Doe'
        };
        expect(translator.dcngettext('domain', 'mail', '%(num)i new message from %(sender)s', '%(num)i new messages from %(sender)s', 1, placeholders)).toBe('sprintf');
        expect(this.sprintfSpy).toHaveBeenCalledWith('%(num)i neue Nachricht von %(sender)s', placeholders);

        placeholders = {
            num: 3,
            sender: 'John Doe'
        };
        expect(translator.dcngettext('domain', 'mail', '%(num)i new message from %(sender)s', '%(num)i new messages from %(sender)s', 3, placeholders)).toBe('sprintf');
        expect(this.sprintfSpy).toHaveBeenCalledWith('%(num)i neue Nachrichten von %(sender)s', placeholders);

        expect(this.vsprintfSpy).not.toHaveBeenCalled();
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