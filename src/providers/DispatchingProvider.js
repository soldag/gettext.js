function DispatchingProvider(providers) {
    this.providers = providers;
}


DispatchingProvider.prototype.canLoadFromOptions = function(options) {
    for(var i = 0; i < this.providers.length; i++) {
        if(this.providers[i].canLoadFromOptions(options)) {
            return true;
        }
    }

    return false;
};


DispatchingProvider.prototype.loadFromOptions = function(options, callback) {
    for(var i = 0; i < this.providers.length; i++) {
        if(this.providers[i].canLoadFromOptions(options)) {
            return this.providers[i].loadFromOptions(options, callback);
        }
    }

    throw new Error('There is no provider registered, that can load the given options.');
};


module.exports = DispatchingProvider;