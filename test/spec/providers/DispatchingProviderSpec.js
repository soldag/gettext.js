var DispatchingProvider = requireSrc('providers/DispatchingProvider');

describe('A DispatchingProvider instance', function() {
    beforeAll(function() {
        this.fooProviderSpy = createProviderSpy('FooProvider', 'foo', 'foo');
        this.barProviderSpy = createProviderSpy('BarProvider', 'bar', 'bar');
        this.provider = new DispatchingProvider([this.fooProviderSpy, this.barProviderSpy]);
    });

    it('can load options a supporting provider is registered for', function () {
        var options = {
            mode: 'foo'
        };
        expect(this.provider.canLoadFromOptions(options)).toBe(true);
    });

    it('cannot load options with no supporting provider registered', function () {
        var options = {
            mode: 'foobar'
        };
        expect(this.provider.canLoadFromOptions(options)).toBe(false);
    });

    it('loads options correctly a supporting provider is registered for', function(done) {
        var _this = this;

        var options = {
            mode: 'foo',
            value: 'foobar'
        };
        this.provider.loadFromOptions(options, function(result) {
            expect(result).toBe('foo');
            expect(_this.fooProviderSpy.loadFromOptions).toHaveBeenCalledWith(options, jasmine.any(Function));
            expect(_this.barProviderSpy.loadFromOptions).not.toHaveBeenCalled();
            done();
        });
    });

    it('throws an error when trying to load options no supporting provider is registered for', function() {
        var _this = this;

        expect(function() {
            _this.provider.loadFromOptions({
                mode: 'foobar'
            })
        }).toThrowError('There is no provider registered, that can load the given options.');
    });

    function createProviderSpy(name, validMode, returnValue) {
        var providerSpy = jasmine.createSpyObj(name, ['canLoadFromOptions', 'loadFromOptions']);
        providerSpy.canLoadFromOptions.and.callFake(function(options) {
            return options.mode == validMode;
        });
        providerSpy.loadFromOptions.and.callFake(function(options, callback) {
            callback(returnValue);
        });

        return providerSpy;
    }
});