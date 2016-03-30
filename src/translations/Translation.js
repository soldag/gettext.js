function Translation(key, value, context, pluralKey, pluralValues, flags) {
    if(!key) {
        throw new Error('Key of the translation has to be provided.');
    }
    if(!pluralValues) {
        if (!value) {
            throw Error('Either a singular value or multiple plural values have to be provided.');
        }
    }
    else if(!Array.isArray(pluralValues) || (pluralValues.length > 0 && pluralValues.length < 2)) {
        throw Error('Plural values must be provided as array with at least two elements.');
    }
    if(!flags) {
        flags = [];
    }

    this.key = key;
    this.value = value;
    this.context = context;
    this.pluralKey = pluralKey;
    this.pluralValues = pluralValues;
    this.flags = flags;
}

Translation.prototype.getKey = function() {
    return this.key;
};

Translation.prototype.getValue = function() {
    return this.value;
};

Translation.prototype.getContext = function() {
    return this.context;
};

Translation.prototype.getPluralKey = function() {
    return this.pluralKey;
};

Translation.prototype.getPluralValues = function() {
    return this.pluralValues;
};

Translation.prototype.getPluralValue = function(pluralForm) {
    return this.pluralValues[pluralForm];
};

Translation.prototype.getFlags = function() {
    return this.flags;
};

Translation.prototype.hasFlag = function(name) {
    return this.flags.indexOf(name) > -1;
};

Translation.prototype.hasContext = function() {
    return !!this.getContext();
};

Translation.prototype.hasPlural = function() {
    return !!this.getPluralKey() && !!this.getPluralValues();
};


module.exports = Translation;