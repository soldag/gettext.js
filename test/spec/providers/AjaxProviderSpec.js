var AjaxProvider = requireSrc('providers/AjaxProvider');


describe('A AjaxProvider instance', function() {
    beforeAll(function() {
        jasmine.Ajax.install();
    });

    beforeEach(function() {
        this.poParserResult = 'foo';
        this.poParserSpy = jasmine.createSpyObj('PoParser', ['parse']);
        this.poParserSpy.parse.and.returnValue(this.poParserResult);

        this.moParserResult = 'bar';
        this.moParserSpy = jasmine.createSpyObj('MoParser', ['parse']);
        this.moParserSpy.parse.and.returnValue(this.moParserResult);

        this.defaultDomain = 'foobar';
        this.provider = new AjaxProvider(this.defaultDomain, this.poParserSpy, this.moParserSpy);
    });

    afterAll(function() {
        jasmine.Ajax.uninstall();
    });

    it('can load valid options', function() {
        var options = {
            mode: 'ajax',
            url: 'foo',
            type: 'bar'
        };
        expect(this.provider.canLoadFromOptions(options)).toBe(true);
    });

    it('cannot load options without type attribute', function() {
        var options = {
            mode: 'ajax',
            url: 'foo'
        };
        expect(this.provider.canLoadFromOptions(options)).toBe(false);
    });

    it('cannot load options without url attribute', function() {
        var options = {
            mode: 'ajax',
            type: 'bar'
        };
        expect(this.provider.canLoadFromOptions(options)).toBe(false);
    });

    it('cannot load options with wrong mode attribute', function() {
        var options = {
            mode: 'text',
            url: 'foo',
            type: 'bar'
        };
        expect(this.provider.canLoadFromOptions(options)).toBe(false);
    });

    it('loads po files correctly', function(done) {
        var _this = this;

        var domain = 'fobar';
        var url = 'foo.po';
        var ajaxResponse = 'bar';
        this.provider.load(domain, url, 'application/gettext-po', function(result) {
            expect(result).toBe(_this.poParserResult);
            expect(_this.poParserSpy.parse).toHaveBeenCalledWith(domain, ajaxResponse);
            expect(_this.moParserSpy.parse).not.toHaveBeenCalled();
            done();
        });

        expect(jasmine.Ajax.requests.mostRecent().url).toBe(url);
        jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            contentType: 'text/plain',
            responseText: ajaxResponse
        });
    });

    it('loads mo files correctly', function(done) {
        var _this = this;

        var domain = 'fobar';
        var url = 'foo.mo';
        var ajaxResponse = new Uint8Array([42]);
        this.provider.load(domain, url, 'application/gettext-mo', function(result) {
            expect(result).toBe(_this.moParserResult);
            expect(_this.moParserSpy.parse).toHaveBeenCalledWith(domain, ajaxResponse);
            expect(_this.poParserSpy.parse).not.toHaveBeenCalled();
            done();
        });

        expect(jasmine.Ajax.requests.mostRecent().url).toBe(url);
        jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            contentType: 'application/octet-stream',
            response: ajaxResponse
        });
    });

    it('throws an error for invalid types', function() {
        var _this = this;
        expect(function() {
            _this.provider.load('foo', 'bar', 'foobar');
        }).toThrowError('Invalid file type!');
    });

    it('throws an error when loading an not existing file', function() {
        var _this = this;

        expect(function() {
            _this.provider.load('foo', 'bar', 'application/gettext-po');
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 404
            });
        }).toThrowError(/Could not load translations from resource/);
    });

    it('throws an error when ajax request fails', function() {
        var _this = this;

        expect(function() {
            _this.provider.load('foo', 'bar', 'application/gettext-po');
            jasmine.Ajax.requests.mostRecent().onerror();
        }).toThrowError(/Could not load translations from resource/);
    });

    it('throws an error when ajax request has no response', function() {
        var _this = this;

        expect(function() {
            _this.provider.load('foo', 'bar', 'application/gettext-po');
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200
            });
        }).toThrowError(/Could not load translations from resource/);
    });

    it('extracts required properties from options with specific domain', function() {
        var options = {
            mode: 'ajax',
            domain: 'foobar',
            url: 'foo',
            type: 'bar'
        };
        var callback = 'foobar';

        spyOn(this.provider, 'load');
        this.provider.loadFromOptions(options, callback);
        expect(this.provider.load).toHaveBeenCalledWith(options.domain, options.url, options.type, callback);
    });

    it('extracts required properties from options without specific domain', function() {
        var options = {
            mode: 'ajax',
            url: 'foo',
            type: 'bar'
        };
        var callback = 'foobar';

        spyOn(this.provider, 'load');
        this.provider.loadFromOptions(options, callback);
        expect(this.provider.load).toHaveBeenCalledWith(this.defaultDomain, options.url, options.type, callback);
    });
});