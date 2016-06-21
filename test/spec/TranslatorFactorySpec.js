var Translator = requireSrc('Translator');
var TranslatorFactory = requireSrc('TranslatorFactory');

describe('A TranslatorFactory instance', function() {
    beforeEach(function() {
        this.defaultDomain = 'foobar';
        this.providerMock = 'foobar';
        this.providerFactorySpy = jasmine.createSpyObj('ProviderFactorySpy', ['createDispatchingProvider']);
        this.providerFactorySpy.createDispatchingProvider.and.returnValue(this.providerMock);

        this.translatorFactory = new TranslatorFactory(this.defaultDomain, this.providerFactorySpy);
    });

    it('creates a Translator instance correctly without setting ignoreFuzzy', function() {
        var result = this.translatorFactory.createTranslator();
        expect(result instanceof Translator).toBe(true);
        expect(result.defaultDomain).toBe(this.defaultDomain);
        expect(result.provider).toBe(this.providerMock);
    });

    it('creates a Translator instance correctly with ignoreFuzzy', function() {
        var ignoreFuzzy = false;
        var result = this.translatorFactory.createTranslator(ignoreFuzzy);
        expect(result instanceof Translator).toBe(true);
        expect(result.defaultDomain).toBe(this.defaultDomain);
        expect(result.provider).toBe(this.providerMock);
        expect(result.ignoreFuzzy).toBe(ignoreFuzzy);
    });
});