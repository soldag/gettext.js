function StringProvider(defaultDomain, poParser) {
    this.defaultDomain = defaultDomain;
    this.parser = poParser;
}


StringProvider.prototype.canLoadFromOptions = function(options) {
    return options.mode === 'string' && 'data' in options;
};


StringProvider.prototype.loadFromOptions = function(options, callback) {
    var domain = options.domain || this.defaultDomain;
    var text = options.data;

    this.load(domain, text, callback);
};


StringProvider.prototype.load = function(domain, data, callback) {
    return callback(this.parser.parse(domain, data));
};


module.exports = StringProvider;