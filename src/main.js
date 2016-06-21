var ParserFactory = require('./parsers/ParserFactory');
var ProviderFactory = require('./providers/ProviderFactory');
var TranslatorFactory = require('./TranslatorFactory');


var defaultDomain = 'messages';
var parserFactory = new ParserFactory();
var providerFactory = new ProviderFactory(parserFactory);
var translatorFactory = new TranslatorFactory(defaultDomain, providerFactory);


module.exports = translatorFactory.createTranslator();