var ParsersBase = require('./ParserBase');
var Translation = require('../translations/Translation');

PoParser = function() {
    ParsersBase.call(this);
};

PoParser.prototype = Object.create(ParsersBase.prototype);
PoParser.prototype.constructor = PoParser;


PoParser.prototype.parse = function(domain, data) {
    var entries = data.split('\n\n');

    // Parse headers
    var headers = this.parseHeaderEntry(entries[0]);

    // Parse entries to translations
    var translations = [];
    for(var i = 1; i < entries.length; i++) {
        var translation = this.parseEntry(entries[i]);
        if (translation) {
            translations.push(translation);
        }
    }

    return this.createDomainCollection(domain, headers, translations);
};


PoParser.prototype.parseHeaderEntry = function(entry) {
    var lines = entry.split('\n');
    return this.parseHeaderText(this.extractText(lines, 1, 7));
};


PoParser.prototype.parseEntry = function(entry) {
    var flags, context, key, value, pluralKey, pluralValues;
    flags = pluralValues = [];
    context = key = value = pluralKey = null;

    // Read and parse entry line by line
    var lines = entry.split('\n');
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];

        // Extract flags
        if (line.indexOf('#,') === 0) {
            flags = line.substring(3).split(',');
            flags = flags.map(Function.prototype.call, String.prototype.trim);
            continue;
        }

        // Parse context
        if (line.indexOf('msgctxt ') === 0) {
            context = this.extractText(lines, i, 8);
        }

        // Parse message key
        if (line.indexOf('msgid ') === 0) {
            key = this.extractText(lines, i, 6);
            continue;
        }

        // Parse message value
        if (line.indexOf('msgstr ') === 0) {
            value = this.extractText(lines, i, 7);
            continue;
        }

        // Parse message plural key
        if (line.indexOf('msgid_plural ') === 0) {
            pluralKey = this.extractText(lines, i, 13);
            continue;
        }

        // Parse message plural valies
        if (line.indexOf('msgstr[') === 0) {
            var index = parseInt(line.substring(line.indexOf('[') + 1, line.indexOf(']')), 10);
            pluralValues[index] = this.extractText(lines, i, 9 + index.toString().length);
            continue;
        }
    }

    if (key !== '') {
        return new Translation(key, value, context, pluralKey, pluralValues, flags);
    }
};


PoParser.prototype.extractText = function(lines, startLine, charOffset) {
    var line = lines[startLine];
    if(line.substring(charOffset) === '""') {
        // Multi-line text
        var text = "";
        for(var i = startLine + 1; i < lines.length; i++) {
            line = lines[i];
            if(line.indexOf('"') !== 0) {
                break;
            }
            text += line.substring(1).slice(0, -1);
        }

        return text;
    }
    else {
        // Single-line text
        return line.substring(charOffset + 1).slice(0, -1);
    }
};


module.exports = PoParser;