var StringProvider = require('./StringProvider');
var AjaxProvider = require('./AjaxProvider');
var LinkProvider = require('./LinkProvider');


function DispatchingProvider(defaultDomain, poParser, moParser) {
    // Instantiate providers
    var stringProvider = new StringProvider(defaultDomain, poParser);
    var ajaxProvider = new AjaxProvider(defaultDomain, poParser, moParser);
    var linkProvider = new LinkProvider(defaultDomain, ajaxProvider);

    this.providers = [stringProvider, ajaxProvider, linkProvider];
}


DispatchingProvider.prototype.canLoad = function(options) {
    for(var i = 0; i < this.providers.length; i++) {
        if(this.providers[i].canLoad(options)) {
            return true;
        }
    }

    return false;
};


DispatchingProvider.prototype.loadFromOptions = function(options, callback) {
    for(var i = 0; i < this.providers.length; i++) {
        if(this.providers[i].canLoad(options)) {
            return this.providers[i].loadFromOptions(options, callback);
        }
    }
};


module.exports = DispatchingProvider;