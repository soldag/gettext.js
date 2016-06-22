var ParserFactory = require('./src/parsers/ParserFactory');
var ProviderFactory = require('./src/providers/ProviderFactory');
var TranslatorFactory = require('./src/TranslatorFactory');


var defaultDomain = 'messages';
var parserFactory = new ParserFactory();
var providerFactory = new ProviderFactory(parserFactory);
var translatorFactory = new TranslatorFactory(defaultDomain, providerFactory);


module.exports = translatorFactory.createTranslator();