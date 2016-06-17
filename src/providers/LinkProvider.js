var DomainCollection = require('../translations/DomainCollection');


function LinkProvider(defaultDomain, ajaxProvider) {
    this.defaultDomain = defaultDomain;
    this.ajaxProvider = ajaxProvider;
}


LinkProvider.prototype.canLoadFromOptions = function(options) {
    return options.mode === 'link';
};


LinkProvider.prototype.loadFromOptions = function (options, callback) {
    this.load(callback);
};


LinkProvider.prototype.load = function (callback) {
    var links = this.getValidLinks();
    var callbacksRemaining = links.length;
    var domainCollection = new DomainCollection();
    var adapterCallback = function(partialDomainCollection) {
        domainCollection.addAllDomains(partialDomainCollection);

        callbacksRemaining--;
        if(callbacksRemaining === 0) {
            callback(domainCollection);
        }
    };

    if(links.length > 0) {
        for (var i = 0; i < links.length; i++) {
            var link = links[i];

            // Load file asynchronously
            var url = link.getAttribute('href');
            var type = link.getAttribute('type');
            var domain = link.dataset.domain || this.defaultDomain;
            this.ajaxProvider.load(domain, url, type, adapterCallback);
        }
    }
    else {
        callback(domainCollection);
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