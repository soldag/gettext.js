Providers.Link = function(defaultDomain) {
    Providers.Base.call(this, defaultDomain);

    this.ajaxAdapter = new Providers.Ajax(defaultDomain);
};

Providers.Link.prototype = Object.create(Providers.Base.prototype);
Providers.Link.prototype.constructor = Providers.Link;
Providers.Link.prototype.PO_MIME_TYPE = 'application/gettext-po';


Providers.Link.canLoad = function(options) {
    return options['type'] === 'link';
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

        // Get domain or default one
        var domain;
        if(link.hasAttribute('domain')) {
            domain = link.getAttribute('domain');
        }
        else {
            domain = this.defaultDomain;
        }

        // Load file asynchronously
        var url = link.getAttribute('href');
        this.ajaxAdapter.load(domain, url, adapterCallback);
    }
};


Providers.Link.prototype.getValidLinks = function() {
    var validLinks = [];
    var links = document.getElementsByTagName('link');
    for(var i = 0; i < links.length; i++) {
        var link = links[i];
        if (link.hasAttribute('type') && link.hasAttribute('href') && link.getAttribute('type') == this.PO_MIME_TYPE) {
            validLinks.push(link);
        }
    }

    return validLinks;
};