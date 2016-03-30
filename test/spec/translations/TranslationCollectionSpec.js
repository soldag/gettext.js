var TranslationCollection = requireSrc('translations/TranslationCollection');

describe('A TranslationCollection object', function() {
    it('is created correctly without arguments', function() {
        var collection = new TranslationCollection();

        expect(collection.getHeaders()).toEqual({});
        expect(collection.getTranslations()).toEqual({});
    });

    it('returns the correct headers', function() {
        var  headers = {
            foo: 'bar'
        };
        var collection = new TranslationCollection(headers);

        expect(collection.hasHeader('foo')).toBe(true);
        expect(collection.hasHeader('fu')).toBe(false);
        expect(collection.getHeader('foo')).toBe(headers.foo);
        expect(collection.getHeader('fu')).toBeUndefined();
        expect(collection.getHeaders()).toEqual(headers);
    });

    it('returns the correct domains', function() {
        var translations = {
            'foo': ['bar', 'baz']
        };
        var collection = new TranslationCollection(null, translations);

        expect(collection.hasTranslation('foo')).toBe(true);
        expect(collection.hasTranslation('fu')).toBe(false);
        expect(collection.getTranslations('foo')).toEqual(translations.foo);
        expect(collection.getTranslations('fu')).toBeUndefined();
        expect(collection.getTranslations()).toEqual(translations);
    });
});