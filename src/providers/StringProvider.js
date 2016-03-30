var ProviderBase = require('./ProviderBase');


StringProvider = function(defaultDomain, poParser) {
    ProviderBase.call(this, defaultDomain);

    this.parser = poParser;
};

StringProvider.prototype = Object.create(ProviderBase.prototype);
StringProvider.prototype.constructor = StringProvider;


StringProvider.prototype.canLoadFromOptions = function(options) {
    return options.mode == 'string' && 'data' in options;
};


StringProvider.prototype.loadFromOptions = function(options, callback) {
    var domain = options.domain || this.defaultDomain;
    var text = options.data;

    this.load(domain, text, callback);
};


StringProvider.prototype.load = function(domain, data, callback) {
    this.addCallback(callback);
    this.triggerDone(this.parser.parse(domain, data));
};


module.exports = StringProvider;