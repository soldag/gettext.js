var sprintf = require('sprintf-js').sprintf;
var vsprintf = require('sprintf-js').vsprintf;
var PoParser = require('./parsers/PoParser');
var MoParser = require('./parsers/MoParser');
var DomainCollection = require('./translations/DomainCollection');
var DispatchingProvider = require('./providers/DispatchingProvider');


function Translator() {
    this.ignoreFuzzy = true;
    this.translations = new DomainCollection();
    this.readyCallbacks = [];

    var poParser = new PoParser();
    var moParser = new MoParser();
    this.dispatchingProvider = new DispatchingProvider(this.DEFAULT_DOMAIN, poParser, moParser);
}


Translator.prototype.DEFAULT_DOMAIN = 'messages';


Translator.prototype.load = function(options) {
    // Register callback, if provided in options
    if('ready' in options && typeof options.ready === 'function') {
        this.readyCallbacks.push(options.ready);
    }

    // Load translations, if options are valid
    var _this = this;
    if(this.dispatchingProvider.canLoad(options)) {
        this.dispatchingProvider.loadFromOptions(options, function (domainCollection) {
            _this.translations = domainCollection;
            _this.triggerReady();
        });
    }
    else {
        console.error('No valid options provided for loading translations.');
    }
};


Translator.prototype.triggerReady = function() {
    for(var i = 0; i < this.readyCallbacks.length; i++) {
        this.readyCallbacks[i].call();
    }

    this.readyCallbacks = [];
};


Translator.prototype.setIgnoreFuzzy = function(value) {
    this.ignoreFuzzy = value;
};


Translator.prototype.gettext = function(key, placeholderValues) {
    return this.dgettext(this.DEFAULT_DOMAIN, key, placeholderValues);
};


Translator.prototype.dgettext = function(domain, key, placeholderValues) {
    return this.dcngettext(domain, null, key, placeholderValues);

};


Translator.prototype.pgettext = function(context, key, placeholderValues) {
    return this.dcngettext(this.DEFAULT_DOMAIN, context, key, placeholderValues);
};


Translator.prototype.dcngettext = function(domain, context, key, placeholderValues) {
    // Get translation
    var translatedText;
    var translation = this.getTranslation(domain, context, key, false);
    if(translation) {
        translatedText = translation.getValue();
    }
    else {
        translatedText = key;
    }

    return this.formatString(translatedText, placeholderValues);
};


Translator.prototype.ngettext = function(singularKey, pluralKey, numericValue, placeholderValues) {
    return this.dngettext(this.DEFAULT_DOMAIN, singularKey, pluralKey, numericValue, placeholderValues);
};


Translator.prototype.npgettext = function(context, singularKey, pluralKey, numericValue, placeholderValues) {
    return this.dnpgettext(this.DEFAULT_DOMAIN, context, singularKey, pluralKey, numericValue, placeholderValues);
};


Translator.prototype.dngettext = function(domain, singularKey, pluralKey, numericValue, placeholderValues) {
    return this.dnpgettext(domain, null, singularKey, pluralKey, numericValue, placeholderValues);
};


Translator.prototype.dnpgettext = function(domain, context, singularKey, pluralKey, numericValue, placeholderValues) {
    // Determine plural form for current numeric value
    var pluralForm = this.getPluralForm(domain, numericValue);

    // Get translation
    var translatedText;
    var translation = this.getTranslation(domain, context, singularKey, true);
    if(translation) {
        translatedText = translation.getPluralValue(pluralForm);
    }
    else {
        translatedText = pluralForm == 0 ? singularKey : pluralKey;
    }

    return this.formatString(translatedText, placeholderValues);
};


Translator.prototype.getTranslation = function(domain, context, key, hasPlural) {
    if(this.translations && this.translations.containsDomain(domain)) {
        var keyTranslations = this.translations.getDomain(domain).getTranslations(key);
        for(var i = 0; i < keyTranslations.length; i++) {
            var translation = keyTranslations[i];
            if(this.translationMatches(translation, hasPlural, context)) {
                return translation;
            }
        }
    }
};


Translator.prototype.translationMatches = function(translation, hasPlural, context) {
    var hasContext = typeof(context) !== 'undefined' && context !== null;
    return translation.hasContext() == hasContext
        && hasPlural == translation.hasPlural()
        && (!hasContext || translation.getContext() === context)
        && (!this.ignoreFuzzy || !translation.hasFlag('fuzzy'));
};


Translator.prototype.getPluralForm = function(domain, n) {
    if (this.translations.containsDomain(domain)) {
        var translationCollection = this.translations.getDomain(domain);
        if (translationCollection.hasHeader('Plural-Forms')) {
            var pluralFormDefinition = translationCollection.getHeader('Plural-Forms');
            var nplurals, plural;
            eval(pluralFormDefinition);
            if (typeof(plural) === 'undefined') {
                plural = 0;
            }
            else if (nplurals == 2 && typeof(plural) === 'boolean') {
                plural = plural ? 1 : 0
            }

            return plural;
        }
    }

    return 0;
};


Translator.prototype.formatString = function(text, placeholderValues) {
    if(placeholderValues) {
        if(Array.isArray(placeholderValues)) {
            return vsprintf(text, placeholderValues);
        }
        else if(typeof placeholderValues === 'object') {
            return sprintf(text, placeholderValues);
        }
    }

    return text;
};


// Export singleton instance
module.exports = new Translator();