var DomainCollection = requireSrc('translations/DomainCollection');

describe('A DomainCollection object', function() {
    it('is created correctly without arguments', function() {
        var collection = new DomainCollection();

        expect(collection.getDomainNames()).toEqual([]);
    });

    it('returns the correct domains', function() {
        var  domains = {
            foo: 'bar',
            fu: 'baz'
        };
        var collection = new DomainCollection(domains);

        expect(collection.getDomainNames('foo').sort()).toEqual(Object.keys(domains).sort());
        expect(collection.hasDomain('foo')).toBe(true);
        expect(collection.hasDomain('bar')).toBe(false);
        expect(collection.getDomain('foo')).toBe(domains.foo);
        expect(collection.getDomain('bar')).toBeUndefined();
    });

    it('is extended by another DomainCollection object correctly (without overwriting)', function() {
        var collection1 = new DomainCollection({
            foo: 'bar',
            fu: 'baz'
        });
        var collection2 = new DomainCollection({
            fu: 'bar',
            foobar: 'fubar'
        });
        collection1.addAllDomains(collection2);

        expect(collection1.getDomainNames().sort()).toEqual(['foo', 'foobar', 'fu']);
        expect(collection1.getDomain('foo')).toBe('bar');
        expect(collection1.getDomain('fu')).toBe('bar');
        expect(collection1.getDomain('foobar')).toBe('fubar');
    });

    it('is extended by another DomainCollection object correctly by overwriting its domain.', function() {
        var collection1 = new DomainCollection({
            fu: 'baz'
        });
        var collection2 = new DomainCollection({
            fu: 'bar'
        });
        collection1.addAllDomains(collection2, false);

        expect(collection1.getDomain('fu')).toBe('baz');
    });
});