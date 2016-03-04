Parsers.PoParser = function() {
    Parsers.Base.call(this);
};

Parsers.PoParser.prototype = Object.create(Parsers.Base.prototype);
Parsers.PoParser.prototype.constructor = Parsers.PoParser;


Parsers.PoParser.prototype.parse = function(domain, data) {
    var headers, translations = {};
    var entries = data.split('\n\n');
    for(var i = 0; i < entries.length; i++) {
        var flags = [];
        var context = null;
        var key = null;
        var value = null;
        var pluralKey = null;
        var pluralValues = [];
        var lines = entries[i].split('\n');
        // Skip comments and extract flags
        for (var j = 0; j < lines.length; j++) {
            var line = lines[j];

            // Extract flags
            if (line.indexOf('#,') === 0) {
                flags = line.substring(3).split(',');
                continue;
            }

            // Parse context
            if (line.indexOf('msgctxt ') === 0) {
                context = this.extractText(lines, j, 8);
            }

            // Parse message key
            if (line.indexOf('msgid ') === 0) {
                key = this.extractText(lines, j, 6);
                continue;
            }

            // Parse message value (or header)
            if (line.indexOf('msgstr ') === 0) {
                if (key == '') {
                    // Header
                    headers = this.parseHeaders(this.extractText(lines, j, 7));
                }
                else {
                    value = this.extractText(lines, j, 7);
                }
                continue;
            }

            // Parse message plural key
            if (line.indexOf('msgid_plural ') === 0) {
                pluralKey = this.extractText(lines, j, 13);
                continue;
            }

            // Parse message plural valies
            if (line.indexOf('msgstr[') === 0) {
                var index = parseInt(line.substring(line.indexOf('[') + 1, line.indexOf(']')));
                pluralValues[index] = this.extractText(lines, j, 13);
                continue;
            }
        }

        // Add translation object to dict
        if (key != '') {
            var translation = new Translation(key, value, context, pluralKey, pluralValues);
            if (key in translations) {
                translations[key].push(translation);
            }
            else {
                translations[key] = [translation];
            }
        }
    }

    return this.createDomainCollection(domain, headers, translations);
};


Parsers.PoParser.prototype.extractText = function(lines, startLine, charOffset) {
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