var LinkProvider = requireSrc('providers/LinkProvider');


global.document = {};
describe('A LinkProvider instance', function() {
    beforeAll(function() {
        this.documentBackup = global.document;
    });

    beforeEach(function() {
        // Mock document.getElementByTagName to return no elements in any case (default behavior)
        mockLinks([]);

        // Mock AjaxProvider instance injected into LinkProvider
        this.poParserResult = 'foobar';
        this.poParserSpy = jasmine.createSpyObj('AjaxProvider', ['load']);
        this.poParserSpy.load.and.callFake(function(domain, url, type, callback) {
            var returnValue = jasmine.createSpyObj('DomainCollection', ['getDomainNames', 'getDomain']);
            returnValue.getDomainNames.and.returnValue([domain]);
            returnValue.getDomain.and.returnValue([]);

            if(callback) {
                callback(returnValue);
            }
        });

        // Create LinkProvider instance
        this.defaultDomain = 'domain';
        this.provider = new LinkProvider(this.defaultDomain, this.poParserSpy);
    });

    afterAll(function() {
       global.document = this.documentBackup;
    });

    it('can load valid options', function() {
        var options = {
            mode: 'link'
        };
        expect(this.provider.canLoadFromOptions(options)).toBe(true);
    });

    it('cannot load options without data attribute', function() {
        var options = {
            mode: 'html'
        };
        expect(this.provider.canLoadFromOptions(options)).toBe(false);
    });

    it('loads nothing when there is no link element present', function (done) {
        var _this = this;

        this.provider.load(function(result) {
            expect(result.getDomainNames().length).toBe(0);
            expect(_this.poParserSpy.load).not.toHaveBeenCalled();
            done();
        });
    });

    it('loads translations from multiple valid link elements', function(done) {
        var _this = this;
        mockLinks([
            link('type1', 'link1.po', 'foobar'),
            link('type2', 'link2.po')
        ]);

        this.provider.load(function(result) {
            expect(result.getDomainNames().sort()).toEqual([_this.defaultDomain, 'foobar'].sort());
            expect(_this.poParserSpy.load).toHaveBeenCalledWith('foobar', 'link1.po', 'type1', jasmine.any(Function));
            expect(_this.poParserSpy.load).toHaveBeenCalledWith(_this.defaultDomain, 'link2.po', 'type2', jasmine.any(Function));
            done();
        });
    });

    it('ignores invalid links', function(done) {
        var _this = this;
        mockLinks([
            link(),
            link('type')
        ]);

        this.provider.load(function(result) {
            expect(result.getDomainNames()).toEqual([]);
            expect(_this.poParserSpy.load).not.toHaveBeenCalled();
            done();
        });
    });

    it('loads options correctly', function() {
        var options = {
            mode: 'link'
        };

        spyOn(this.provider, 'load');
        this.provider.loadFromOptions(options);
        expect(this.provider.load).toHaveBeenCalled();
    });


    function mockLinks(links) {
        global.document.getElementsByTagName = function(name) {
            if(name === 'link') {
                return links;
            }

            return [];
        };
    }

    function link(type, href, domain) {
        var dataset = {};
        if(domain) {
            dataset['domain'] = domain;
        }

        return {
            hasAttribute: function(name) {
                switch(name) {
                    case 'type':
                        return !!type;

                    case 'href':
                        return !!href;
                }
            },
            getAttribute: function(name) {
                switch(name) {
                    case 'type':
                        return type;

                    case 'href':
                        return href;
                }
            },
            dataset: dataset
        };
    }
});