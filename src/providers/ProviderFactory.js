var AjaxProvider = require('./AjaxProvider');
var LinkProvider = require('./LinkProvider');
var FileProvider = require('./FileProvider');
var StringProvider = require('./StringProvider');
var DispatchingProvider = require('./DispatchingProvider');


function ProviderFactory(parserFactory) {
    this.parserFactory = parserFactory;
}


ProviderFactory.prototype.createStringProvider = function() {
    return new StringProvider(this.parserFactory.createPoParser());
};


ProviderFactory.prototype.createAjaxProvider = function () {
    return new AjaxProvider(this.parserFactory.createPoParser(),
                            this.parserFactory.createMoParser());
};


ProviderFactory.prototype.createLinkProvider = function() {
    return new LinkProvider(this.createAjaxProvider());
};


ProviderFactory.prototype.createFileProvider = function() {
    return new FileProvider(this.parserFactory.createPoParser(),
                            this.parserFactory.createMoParser());
};


ProviderFactory.prototype.createDispatchingProvider = function() {
    return new DispatchingProvider([
        this.createStringProvider(),
        this.createAjaxProvider(),
        this.createLinkProvider(),
        this.createFileProvider()
    ]);
};


module.exports = ProviderFactory;