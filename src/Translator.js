function Translator() {
    this.ignoreFuzzy = true;
    this.translations = new DomainCollection();
    this.readyCallbacks = [];
}


Translator.prototype.DEFAULT_DOMAIN = 'messages';


Translator.prototype.load = function(options) {
    var _this = this;

    if('ready' in options && typeof options.ready == 'function') {
        this.readyCallbacks.push(options.ready);
    }

    for (var i in Providers) {
        if (Providers.hasOwnProperty(i)) {
            if (typeof Providers[i].canLoad === 'function' && Providers[i].canLoad(options)) {
                var provider = new Providers[i](this.DEFAULT_DOMAIN, options);
                return provider.loadFromOptions(options, function (domainCollection) {
                    _this.translations = domainCollection;
                    _this.triggerReady();
                });
            }
        }
    }

    console.error('No valid options provided for loading translations.');
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


Translator.prototype.gettext = function(key) {
    var placeholderValues = this.getPlaceholderValues(arguments, 1);
    return this.dgettext(this.DEFAULT_DOMAIN, key, placeholderValues);
};


Translator.prototype.dgettext = function(domain, key) {
    var placeholderValues = Array.prototype.slice.call(arguments, 2);
    return this.dcngettext(domain, null, key, placeholderValues);

};


Translator.prototype.pgettext = function(context, key) {
    var placeholderValues = this.getPlaceholderValues(arguments, 2);
    return this.dcngettext(this.DEFAULT_DOMAIN, context, key, placeholderValues);
};


Translator.prototype.dcngettext = function(domain, context, key) {
    // Get translation
    var translatedText;
    var translation = this.getTranslation(domain, context, key, false);
    if(translation) {
        translatedText = translation.getValue();
    }
    else {
        translatedText = key;
    }

    // Get placeholder values (if passed as arguments)
    var placeholderValues = this.getPlaceholderValues(arguments, 3);

    return sprintf(translatedText, placeholderValues);
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

    return sprintf(translatedText, placeholderValues);
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


Translator.prototype.getPlaceholderValues = function(args, startIndex) {
    args = Array.prototype.slice.call(args, startIndex);
    if(Array.isArray(args[0]) || typeof args[0] === 'object') {
        return args[0];
    }
    else {
        return args;
    }
};