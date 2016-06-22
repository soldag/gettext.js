function TranslationCollection(headers, translations) {
    this.headers = headers || {};
    this.translations = translations || {};
}


TranslationCollection.prototype.hasHeader = function(name) {
    return name in this.headers;
};


TranslationCollection.prototype.getHeaders = function() {
    return this.headers;
};


TranslationCollection.prototype.getHeader = function(name) {
    return this.headers[name];
};


TranslationCollection.prototype.hasTranslation = function(key) {
    return key in this.translations;
};


TranslationCollection.prototype.getTranslations = function(key) {
    if(!key) {
        return this.translations;
    }

    if(this.hasTranslation(key)) {
        return this.translations[key];
    }
};


module.exports = TranslationCollection;