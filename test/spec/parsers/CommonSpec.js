module.exports = function() {
    it('parses singular translations correctly', function() {
        expect(this.result.hasDomain(this.domain)).toBe(true);

        var translations = this.result.getDomain(this.domain).getTranslations('singular translation');
        expect(translations.length).toBe(1);
        expect(translations[0].getValue()).toBe('Singluar-Übersetzung');
        expect(translations[0].hasPlural()).toBe(false);
    });

    it('parses plural translations correctly', function() {
        var translations = this.result.getDomain(this.domain).getTranslations('plural translation');
        expect(translations.length).toBe(1);
        expect(translations[0].hasPlural()).toBe(true);
        expect(translations[0].getPluralKey()).toBe('plural translations');
        expect(translations[0].getPluralValue(0)).toBe('Plural-Übersetzung');
        expect(translations[0].getPluralValue(1)).toBe('Plural-Übersetzungen');
    });

    it('parses contextual translations correctly', function() {
        var translations = this.result.getDomain(this.domain).getTranslations('translation with context');
        expect(translations.length).toBe(2);
        for(var i = 0; i < translations.length; i++) {
            var translation = translations[i];
            expect(translation.hasContext()).toBe(true);
            expect(['context A', 'context B']).toContain(translation.getContext());

            if(translation.getContext() === 'context A') {
                expect(translation.getValue()).toBe('Übersetzung mit Kontext A');

            }
            else {
                expect(translation.getValue()).toBe('Übersetzung mit Kontext B');
            }
        }
    });

    it('parses contextual plural translations correctly', function() {
        var translations = this.result.getDomain(this.domain).getTranslations('plural translation with context');
        expect(translations.length).toBe(1);
        expect(translations[0].hasContext()).toBe(true);
        expect(translations[0].getContext()).toBe('context');
        expect(translations[0].hasPlural()).toBe(true);
        expect(translations[0].getPluralKey()).toBe('plural translations with context');
        expect(translations[0].getPluralValue(0)).toBe('Plural-Übersetzung mit Kontext');
        expect(translations[0].getPluralValue(1)).toBe('Plural-Übersetzungen mit Kontext');
    });

    it('parses multiline strings correctly', function() {
        var domainCollection = this.result.getDomain(this.domain);
        expect(domainCollection.hasTranslation('multi-line translation')).toBe(true);

        var translation = domainCollection.getTranslations('multi-line translation')[0];
        expect(translation.getValue()).toBe('mehrzeilige Übersetzung');
    });
};