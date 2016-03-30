var fs = require('fs');
var path = require('path');
var commonSpec = require('./CommonSpec.js');
var PoParser = requireSrc('parsers/PoParser');

describe('A PoParser instance', function() {
    beforeAll(function() {
        this.domain = 'domain';
        var po = fs.readFileSync(path.resolve(__dirname, 'testdata/valid.po'), 'utf-8');

        var parser = new PoParser();
        this.result = parser.parse(this.domain, po);
    });

    commonSpec();

    it('parses flags of translations correctly', function() {
        var translations = this.result.getDomain(this.domain).getTranslations('translation with flags');
        expect(translations.length).toBe(1);
        expect(translations[0].getFlags().sort()).toEqual(['flag1', 'flag2']);
    });
});