var DomainCollection = require('../translations/DomainCollection');


function LinkProvider(ajaxProvider) {
    this.ajaxProvider = ajaxProvider;
}


LinkProvider.prototype.canLoadFromOptions = function(options) {
    return options.mode === 'link';
};


LinkProvider.prototype.loadFromOptions = function (options, callback) {
    this.load(options.domain, callback);
};


LinkProvider.prototype.load = function (defaultDomain, callback) {
    var links = this.getValidLinks();
    var callbacksRemaining = links.length;
    var domainCollection = new DomainCollection();
    var adapterCallback = function(partialDomainCollection) {
        domainCollection.addAllDomains(partialDomainCollection);

        callbacksRemaining--;
        if(callbacksRemaining === 0) {
            return callback(domainCollection);
        }
    };

    if(links.length > 0) {
        for (var i = 0; i < links.length; i++) {
            var link = links[i];

            // Load file asynchronously
            var url = link.getAttribute('href');
            var type = link.getAttribute('type');
            var domain = link.dataset.domain || defaultDomain;
            if(!domain) {
                throw new Error('Link tag contains no translation domain and no default domain was provided.');
            }
            this.ajaxProvider.load(domain, url, type, adapterCallback);
        }
    }
    else {
        return callback(domainCollection);
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