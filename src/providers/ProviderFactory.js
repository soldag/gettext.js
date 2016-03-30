var AjaxProvider = require('./AjaxProvider');
var LinkProvider = require('./LinkProvider');
var StringProvider = require('./StringProvider');
var DispatchingProvider = require('./DispatchingProvider');


function ProviderFactory(defaultDomain, poParser, moParser) {
    this.defaultDomain = defaultDomain;
    this.poParser = poParser;
    this.moParser = moParser;
}


ProviderFactory.prototype.createStringProvider = function() {
    return new StringProvider(this.defaultDomain, this.poParser);
};


ProviderFactory.prototype.createAjaxProvider = function () {
    return new AjaxProvider(this.defaultDomain, this.poParser, this.moParser);
};


ProviderFactory.prototype.createLinkProvider = function() {
    return new LinkProvider(this.defaultDomain, this.createAjaxProvider());
};


ProviderFactory.prototype.createDispatchingProvider = function() {
    return new DispatchingProvider([
        this.createStringProvider(),
        this.createAjaxProvider(),
        this.createLinkProvider()
    ]);
};


module.exports = ProviderFactory;