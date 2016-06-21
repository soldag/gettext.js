var AjaxProvider = requireSrc('providers/AjaxProvider');
var LinkProvider = requireSrc('providers/LinkProvider');
var FileProvider = requireSrc('providers/FileProvider');
var StringProvider = requireSrc('providers/StringProvider');
var ProviderFactory = requireSrc('providers/ProviderFactory');
var DispatchingProvider = requireSrc('providers/DispatchingProvider');

describe('A ProviderFactory instance', function() {
    beforeEach(function() {
        this.poParserMock = 'foo';
        this.moParserMock = 'bar';
        this.parserFactorySpy = jasmine.createSpyObj('ParserFactory', ['createPoParser', 'createMoParser']);
        this.parserFactorySpy.createPoParser.and.returnValue(this.poParserMock);
        this.parserFactorySpy.createMoParser.and.returnValue(this.moParserMock);

        this.translatorFactory = new ProviderFactory(this.parserFactorySpy);
    });

    it('creates a StringProvider instance correctly', function() {
        var result = this.translatorFactory.createStringProvider();
        expect(result instanceof StringProvider).toBe(true);
        expect(result.parser).toBe(this.poParserMock);
    });

    it('creates a AjaxProvider instance correctly', function() {
        var result = this.translatorFactory.createAjaxProvider();
        expect(result instanceof AjaxProvider).toBe(true);
        expect(result.poParser).toBe(this.poParserMock);
        expect(result.moParser).toBe(this.moParserMock);
    });

    it('creates a LinkProvider instance correctly', function() {
        var result = this.translatorFactory.createLinkProvider();
        expect(result instanceof LinkProvider).toBe(true);
        expect(result.ajaxProvider instanceof AjaxProvider).toBe(true);
    });

    it('creates a FileProvider instance correctly', function() {
        var result = this.translatorFactory.createFileProvider();
        expect(result instanceof FileProvider).toBe(true);
        expect(result.poParser).toBe(this.poParserMock);
        expect(result.moParser).toBe(this.moParserMock);
    });

    it('creates a DispatchingProvider instance correctly', function() {
        var result = this.translatorFactory.createDispatchingProvider();
        expect(result instanceof DispatchingProvider).toBe(true);
        var providerConstructors = result.providers.map(function(provider) {
            return provider.constructor;
        });
        expect(providerConstructors).toEqual([StringProvider, AjaxProvider, LinkProvider, FileProvider]);
    });
});