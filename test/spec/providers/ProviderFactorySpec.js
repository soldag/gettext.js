var AjaxProvider = requireSrc('providers/AjaxProvider');
var LinkProvider = requireSrc('providers/LinkProvider');
var FileProvider = requireSrc('providers/FileProvider');
var StringProvider = requireSrc('providers/StringProvider');
var ProviderFactory = requireSrc('providers/ProviderFactory');
var DispatchingProvider = requireSrc('providers/DispatchingProvider');

describe('A ProviderFactory instance', function() {
    beforeAll(function() {
        this.defaultDomain = 'foobar';
        this.poParserSpy = jasmine.createSpyObj('PoParser', ['parse']);
        this.moParserSpy = jasmine.createSpyObj('MoParser', ['parse']);
        this.providerFactory = new ProviderFactory(this.defaultDomain, this.poParserSpy, this.moParserSpy);
    });

    it('creates a StringProvider instance correctly', function() {
        var result = this.providerFactory.createStringProvider();
        expect(result instanceof StringProvider).toBe(true);
        expect(result.defaultDomain).toBe(this.defaultDomain);
        expect(result.parser).toBe(this.poParserSpy);
    });

    it('creates a AjaxProvider instance correctly', function() {
        var result = this.providerFactory.createAjaxProvider();
        expect(result instanceof AjaxProvider).toBe(true);
        expect(result.defaultDomain).toBe(this.defaultDomain);
        expect(result.poParser).toBe(this.poParserSpy);
        expect(result.moParser).toBe(this.moParserSpy);
    });

    it('creates a LinkProvider instance correctly', function() {
        var result = this.providerFactory.createLinkProvider();
        expect(result instanceof LinkProvider).toBe(true);
        expect(result.defaultDomain).toBe(this.defaultDomain);
        expect(result.ajaxProvider instanceof AjaxProvider).toBe(true);
    });

    it('creates a FileProvider instance correctly', function() {
        var result = this.providerFactory.createFileProvider();
        expect(result instanceof FileProvider).toBe(true);
        expect(result.defaultDomain).toBe(this.defaultDomain);
        expect(result.poParser).toBe(this.poParserSpy);
        expect(result.moParser).toBe(this.moParserSpy);
    });

    it('creates a DispatchingProvider instance correctly', function() {
        var result = this.providerFactory.createDispatchingProvider();
        expect(result instanceof DispatchingProvider).toBe(true);
        var providerConstructors = result.providers.map(function(provider) {
            return provider.constructor;
        });
        expect(providerConstructors).toEqual([StringProvider, AjaxProvider, LinkProvider, FileProvider]);
    });
});