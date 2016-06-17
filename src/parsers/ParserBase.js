var DomainCollection = require('../translations/DomainCollection');
var TranslationCollection = require('../translations/TranslationCollection');


ParsersBase = function() {};


ParsersBase.prototype.parseHeaderText = function(text) {
    var headers = {};
    var headerLines = text.split('\\n');
    for(var i = 0; i < headerLines.length; i++) {
        var separatorIndex = headerLines[i].indexOf(':');
        if (separatorIndex > -1) {
            var key = headerLines[i].substring(0, separatorIndex).trim();
            headers[key] = headerLines[i].substring(separatorIndex + 1).trim();
        }
    }

    return headers;
};


ParsersBase.prototype.createDomainCollection = function(domain, headers, translations) {
    // Group translations by key
    var groupedTranslations = {};
    for(var i = 0; i < translations.length; i++) {
        var translation = translations[i];
        var key = translation.getKey();
        if (key in groupedTranslations) {
            groupedTranslations[key].push(translation);
        }
        else {
            groupedTranslations[key] = [translation];
        }
    }

    // Create TranslationCollection
    var domains = {};
    domains[domain] = new TranslationCollection(headers, groupedTranslations);

    return new DomainCollection(domains);
};


module.exports = ParsersBase;