var PoParser = requireSrc('parsers/PoParser');
var MoParser = requireSrc('parsers/MoParser');
var ParserFactory = requireSrc('parsers/ParserFactory');

describe('A ParserFactory instance', function() {
    beforeEach(function() {
        this.translatorFactory = new ParserFactory();
    });

    it('creates a PoParser instance correctly', function() {
        var result = this.translatorFactory.createPoParser();
        expect(result instanceof PoParser).toBe(true);
    });

    it('creates a MoParser instance correctly', function() {
        var result = this.translatorFactory.createMoParser();
        expect(result instanceof MoParser).toBe(true);
    });
});