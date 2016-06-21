function StringProvider(poParser) {
    this.parser = poParser;
}


StringProvider.prototype.canLoadFromOptions = function(options) {
    return options.mode === 'string' && 'domain' in options && 'data' in options;
};


StringProvider.prototype.loadFromOptions = function(options, callback) {
    this.load(options.domain, options.data, callback);
};


StringProvider.prototype.load = function(domain, data, callback) {
    return callback(this.parser.parse(domain, data));
};


module.exports = StringProvider;