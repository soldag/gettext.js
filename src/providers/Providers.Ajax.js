Providers.Ajax = function(defaultDomain) {
    Providers.Base.call(this, defaultDomain);

    this.stringAdapter = new Providers.String(defaultDomain);
};

Providers.Ajax.prototype = Object.create(Providers.Base.prototype);
Providers.Ajax.prototype.constructor = Providers.Ajax;


Providers.Ajax.canLoad = function(options) {
    return options['type'] === 'ajax' && 'url' in options;
};


Providers.Ajax.prototype.loadFromOptions = function(options, callback) {
    var domain = options['domain'] || this.defaultDomain;
    var url = options['url'];

    this.load(domain, url, callback);
};


Providers.Ajax.prototype.load = function(domain, url, callback) {
    this.addCallback(callback);

    var _this = this;
    this.doRequest(url, function(data) {
        _this.stringAdapter.load(domain, data, function(domainCollection) {
            _this.triggerDone(domainCollection);
        });
    });
};


Providers.Ajax.prototype.doRequest = function(url, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    var _this = this;
    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            callback(request.responseText);
        } else {
            console.error('Could not load translations from resource (' + _this.url + ')!');
        }
    };

    request.onerror = function() {
        console.error('Could not load translations from resource (' + _this.url + ')!');
    };

    request.send();
};