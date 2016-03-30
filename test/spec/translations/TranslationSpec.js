var Translation = requireSrc('translations/Translation');

describe('A Translation object', function() {
    it('is correctly created for a simple key-value translation', function() {
        var key = 'foobar', value = 'fubar';
        var translation = new Translation(key, value);

        expect(translation.getKey()).toBe(key);
        expect(translation.getValue()).toBe(value);
        expect(translation.hasContext()).toBe(false);
        expect(translation.hasPlural()).toBe(false);
        expect(translation.getFlags()).toEqual([]);
    });

    it('is correctly created for a simple key-value translation with context', function() {
        var key = 'foobar', value = 'fubar', context = 'context';
        var translation = new Translation(key, value, context);

        expect(translation.hasContext()).toBe(true);
        expect(translation.getContext()).toBe(context);
    });

    it('is correctly created for a simple key-value translation with flags', function() {
        var key = 'foobar', value = 'fubar', flags = ['fuzzy'];
        var translation = new Translation(key, value, null, null, null, flags);

        expect(translation.hasFlag('fuzzy')).toBe(true);
        expect(translation.hasFlag('c-format')).toBe(false);
        expect(translation.getFlags()).toEqual(flags);
    });

    it('is correctly created for a plural values translation', function() {
        var key = 'foobar', pluralKey = 'foobars', pluralValues = ['fubar', 'fubars'];
        var translation = new Translation(key, null, null, pluralKey, pluralValues);

        expect(translation.hasPlural()).toBe(true);
        expect(translation.getPluralKey()).toBe(pluralKey);
        expect(translation.getPluralValues()).toBe(pluralValues);
        expect(translation.getPluralValue(0)).toBe(pluralValues[0]);
        expect(translation.getPluralValue(1)).toBe(pluralValues[1]);
    });

    it('cannot be created without a key', function() {
        expect(function() {
            new Translation();
        }).toThrowError('Key of the translation has to be provided.');
    });

    it('cannot be created without any value', function() {
        expect(function() {
            var key = 'foobar', pluralKey = 'foobars', context = 'context';
            new Translation(key, null, context, pluralKey);
        }).toThrowError('Either a singular value or multiple plural values have to be provided.');
    });

    it('cannot be created with invalid plural values', function() {
        expect(function() {
            var key = 'foobar', pluralKey = 'foobars', pluralValues = ['fubar'];
            new Translation(key, null, null, pluralKey, pluralValues);
        }).toThrowError('Plural values must be provided as array with at least two elements.');

        expect(function() {
            var key = 'foobar', pluralKey = 'foobars', pluralValues = 'fubar,fubars';
            new Translation(key, null, null, pluralKey, pluralValues);
        }).toThrowError('Plural values must be provided as array with at least two elements.');
    });
});