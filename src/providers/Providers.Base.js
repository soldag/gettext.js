Providers.Base = function(defaultDomain) {
    this.doneCallbacks = [];
    this.defaultDomain = defaultDomain;
};


Providers.Base.prototype.addCallback = function(callback) {
    if(callback) {
        this.doneCallbacks.push(callback);
    }
};


Providers.Base.prototype.triggerDone = function(domainCollection) {
    for(var i = 0; i < this.doneCallbacks.length; i++) {
        var callback = this.doneCallbacks[i];
        callback(domainCollection);
    }

    this.doneCallbacks = [];
};