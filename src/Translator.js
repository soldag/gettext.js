var sprintf = require('sprintf-js').sprintf;
var vsprintf = require('sprintf-js').vsprintf;
var DomainCollection = require('./translations/DomainCollection');


function Translator(provider, defaultDomain, ignoreFuzzy) {
    this.provider = provider;
    this.defaultDomain = defaultDomain;
    this.ignoreFuzzy = typeof ignoreFuzzy !== 'undefined' ? ignoreFuzzy : this.DEFAULT_IGNORE_FUZZY;

    this.domains = new DomainCollection();
    this.readyCallbacks = [];
}


Translator.prototype.DEFAULT_IGNORE_FUZZY = true;
Translator.prototype.FUNC_MAPPING = {
    true: {
        2: 'ngettext',
        3: 'dngettext',
        4: 'dcngettext'
    },
    false: {
        1: 'gettext',
        2: 'dgettext',
        3: 'dcgettext'
    }
};


Translator.prototype.setIgnoreFuzzy = function(value) {
    this.ignoreFuzzy = value;
};


Translator.prototype.load = function(options) {
    // Register callback, if provided in options
    if('ready' in options && typeof options.ready === 'function') {
        this.readyCallbacks.push(options.ready);
        delete options.ready;
    }

    // Use default domain, if not provided in options
    if(!('domain' in options)) {
        options.domain = this.defaultDomain;
    }

    // Load translation domains, if options are valid
    var _this = this;
    if(this.provider.canLoadFromOptions(options)) {
        this.provider.loadFromOptions(options, function (domainCollection) {
            _this.domains.addAllDomains(domainCollection, true);
            _this.triggerReady();
        });
    }
    else {
        throw new Error('No valid options provided for loading translation domains.');
    }
};


Translator.prototype.triggerReady = function() {
    for(var i = 0; i < this.readyCallbacks.length; i++) {
        this.readyCallbacks[i].call();
    }

    this.readyCallbacks = [];
};


Translator.prototype.translate = function() {
    var args = Array.prototype.slice.call(arguments);
    if(args.length > 0) {
        // Check, if placeholder values were passed
        var stringArgsLength = args.length;
        if(typeof args[stringArgsLength - 1] === 'object') {
            stringArgsLength--;
        }

        // Check, if numeric value was passed
        var hasNumeric = false;
        if(typeof args[stringArgsLength - 1] === 'number') {
            hasNumeric = true;
            stringArgsLength--;
        }

        // Assert all arguments expect numericValue and placeholderValues are strings
        var allStrings = args.slice(0, stringArgsLength).map(function(arg) {
            return typeof arg === 'string'
        }).indexOf(false) === -1;
        if(allStrings) {
            // Pass arguments to the appropriate gettext function
            var func = this[this.FUNC_MAPPING[hasNumeric][stringArgsLength]];
            if(func) {
                return func.apply(this, args);
            }
        }
    }

    throw new Error('Arguments are not valid for any of the gettext functions.');
};


Translator.prototype.gettext = function(key, placeholderValues) {
    return this.dgettext(this.defaultDomain, key, placeholderValues);
};


Translator.prototype.dgettext = function(domain, key, placeholderValues) {
    return this.dcgettext(domain, null, key, placeholderValues);

};


Translator.prototype.cgettext = function(context, key, placeholderValues) {
    return this.dcgettext(this.defaultDomain, context, key, placeholderValues);
};


Translator.prototype.dcgettext = function(domain, context, key, placeholderValues) {
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
    return this.dngettext(this.defaultDomain, singularKey, pluralKey, numericValue, placeholderValues);
};


Translator.prototype.dngettext = function(domain, singularKey, pluralKey, numericValue, placeholderValues) {
    return this.dcngettext(domain, null, singularKey, pluralKey, numericValue, placeholderValues);
};


Translator.prototype.cngettext = function(context, singularKey, pluralKey, numericValue, placeholderValues) {
    return this.dcngettext(this.defaultDomain, context, singularKey, pluralKey, numericValue, placeholderValues);
};


Translator.prototype.dcngettext = function(domain, context, singularKey, pluralKey, numericValue, placeholderValues) {
    // Determine plural form for current numeric value
    var pluralForm = this.getPluralForm(domain, numericValue);

    // Get translation
    var translatedText;
    var translation = this.getTranslation(domain, context, singularKey, true);
    if(translation) {
        translatedText = translation.getPluralValue(pluralForm);
    }
    else {
        translatedText = pluralForm === 0 ? singularKey : pluralKey;
    }

    return this.formatString(translatedText, placeholderValues);
};


Translator.prototype.getTranslation = function(domain, context, key, hasPlural) {
    if(this.domains && this.domains.hasDomain(domain)) {
        var domainTranslations = this.domains.getDomain(domain);
        if(domainTranslations.hasTranslation(key)) {
            var keyTranslations = domainTranslations.getTranslations(key);
            for(var i = 0; i < keyTranslations.length; i++) {
                var translation = keyTranslations[i];
                if(this.translationMatches(translation, hasPlural, context)) {
                    return translation;
                }
            }
        }
    }
};


Translator.prototype.translationMatches = function(translation, hasPlural, context) {
    var hasContext = context !== null;
    return translation.hasContext() === hasContext
        && hasPlural === translation.hasPlural()
        && (!hasContext || translation.getContext() === context)
        && (!this.ignoreFuzzy || !translation.hasFlag('fuzzy'));
};


Translator.prototype.getPluralForm = function(domain, n) {
    if (this.domains.hasDomain(domain)) {
        var translationCollection = this.domains.getDomain(domain);
        if (translationCollection.hasHeader('Plural-Forms')) {
            return this.evalPluralFormDefinition(n, translationCollection.getHeader('Plural-Forms'));
        }
    }

    return n === 1 ? 0 : 1;
};

Translator.prototype.evalPluralFormDefinition = function(n, pluralFormDefinition) {
    var nplurals, plural;
    try {
        // eslint-disable-next-line no-eval
        eval(pluralFormDefinition);
    }
    catch(e) {
        // continue regardless of error
    }
    if (typeof(plural) === 'undefined') {
        plural = 0;
    }
    else if (nplurals === 2 && typeof(plural) === 'boolean') {
        plural = plural ? 1 : 0
    }

    return plural;
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


module.exports = Translator;