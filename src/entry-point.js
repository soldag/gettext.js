var Translator = require('./Translator');
var PoParser = require('./parsers/PoParser');
var MoParser = require('./parsers/MoParser');
var ProviderFactory = require('./providers/ProviderFactory');


var defaultDomain = 'messages';
var poParser = new PoParser();
var moParser = new MoParser();
var providerFactory = new ProviderFactory(defaultDomain, poParser, moParser);
var dispatchingProvider = providerFactory.createDispatchingProvider();
var translator = new Translator(dispatchingProvider, defaultDomain);


module.exports = translator;