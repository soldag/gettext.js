Providers.String = function(defaultDomain) {
    Providers.Base.call(this, defaultDomain);

    this.parser = new Parsers.PoParser();
};

Providers.String.prototype = Object.create(Providers.Base.prototype);
Providers.String.prototype.constructor = Providers.String;


Providers.String.canLoad = function(options) {
    return options['type'] === 'string' && 'data' in options;
};


Providers.String.prototype.loadFromOptions = function(options, callback) {
    var domain = options['domain'] || this.defaultDomain;
    var text = options['data'];

    this.load(domain, text, callback);
};


Providers.String.prototype.load = function(domain, data, callback) {
    this.addCallback(callback);
    this.triggerDone(this.parser.parse(domain, data));
};