var ProviderBase = require('./ProviderBase');


LinkProvider = function(defaultDomain, ajaxProvider) {
    ProviderBase.call(this, defaultDomain);

    this.ajaxProvider = ajaxProvider;
};

LinkProvider.prototype = Object.create(ProviderBase.prototype);
LinkProvider.prototype.constructor = LinkProvider;


LinkProvider.prototype.canLoad = function(options) {
    return options.mode === 'link';
};


LinkProvider.prototype.loadFromOptions = function (options, callback) {
    this.load(callback);
};


LinkProvider.prototype.load = function (callback) {
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
        this.ajaxProvider.load(domain, url, type, adapterCallback);
    }
};


LinkProvider.prototype.getValidLinks = function() {
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


module.exports = LinkProvider;