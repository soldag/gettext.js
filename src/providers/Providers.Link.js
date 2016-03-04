Providers.Link = function(defaultDomain) {
    Providers.Base.call(this, defaultDomain);

    this.ajaxAdapter = new Providers.Ajax(defaultDomain);
};

Providers.Link.prototype = Object.create(Providers.Base.prototype);
Providers.Link.prototype.constructor = Providers.Link;


Providers.Link.canLoad = function(options) {
    return options.mode === 'link';
};


Providers.Link.prototype.loadFromOptions = function (options, callback) {
    this.load(callback);
};


Providers.Link.prototype.load = function (callback) {
    this.addCallback(callback);

    var _this = this;
    var links = this.getValidLinks();
    var callbacksRemaining = links.length;
    var domainCollection = new DomainCollection();
    var adapterCallback = function(partialDomainCollection) {
        domainCollection.addAllDomains(partialDomainCollection);

        callbacksRemaining--;
        if(callbacksRemaining == 0) {
            _this.triggerDone(domainCollection);
        }
    };

    for(var i = 0; i < links.length; i++) {
        var link = links[i];

        // Load file asynchronously
        var url = link.getAttribute('href');
        var type = link.getAttribute('type');
        var domain = link.dataset.domain || this.defaultDomain;
        this.ajaxAdapter.load(domain, url, type, adapterCallback);
    }
};


Providers.Link.prototype.getValidLinks = function() {
    var validLinks = [];
    var links = document.getElementsByTagName('link');
    for(var i = 0; i < links.length; i++) {
        var link = links[i];
        if (link.hasAttribute('type') && link.hasAttribute('href')) {
            validLinks.push(link);
        }
    }

    return validLinks;
};