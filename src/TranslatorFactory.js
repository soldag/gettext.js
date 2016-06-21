var Translator = require('./Translator');

function TranslatorFactory(defaultDomain, providerFactory) {
    this.defaultDomain = defaultDomain;
    this.providerFactory = providerFactory;
}


TranslatorFactory.prototype.createTranslator = function(ignoreFuzzy) {
    return new Translator(this.providerFactory.createDispatchingProvider(), this.defaultDomain, ignoreFuzzy);
};


module.exports = TranslatorFactory;