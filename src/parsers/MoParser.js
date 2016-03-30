var jDataView = require('jDataView');
var ParsersBase = require('./ParserBase');
var Translation = require('../translations/Translation');


MoParser = function() {
    ParsersBase.call(this);
};

MoParser.prototype = Object.create(ParsersBase.prototype);
MoParser.prototype.constructor = MoParser;


MoParser.prototype.MAGIC_NUMBER_LE = 0xde120495;
MoParser.prototype.MAGIC_NUMBER_BE = 0x950412de;
MoParser.prototype.STRING_SEPARATOR_BYTES = [0x0, 0x4];
MoParser.prototype.STRING_ENCODING = 'utf-8';


MoParser.prototype.parse = function(domain, buffer) {
    // Endian check
    var littleEndian = this.isLittleEndian(buffer);

    // Load buffer and skipping magic number and revision
    var dataView = new jDataView(buffer, 8, buffer.byteLength - 8, littleEndian);

    // Read meta data
    var totalCount = dataView.getUint32();
    var originalTableOffset = dataView.getUint32();
    var translationsTableOffset = dataView.getUint32();

    // Parse domains
    var translations = {};
    for(var i = 0; i < totalCount - 1; i++) {
        // Read strings from mo file
        var originalStrings = this.getStringsFromTable(dataView, originalTableOffset, i);
        var translatedStrings = this.getStringsFromTable(dataView, translationsTableOffset, i);

        // Create translation object
        var translation = this.createTranslation(originalStrings, translatedStrings);
        var key = translation.getKey();
        if (key in translations) {
            translations[key].push(translation);
        }
        else {
            translations[key] = [translation];
        }
    }

    // Parse headers
    var headerText = this.getStringsFromTable(dataView, originalTableOffset, totalCount - 1)[0];
    var headers = this.parseHeaders(headerText);

    return this.createDomainCollection(domain, headers, translations);
};


MoParser.prototype.isLittleEndian = function(buffer) {
    var dataView = new jDataView(buffer, 0, 4);
    var magicNumber = dataView.getUint32();
    switch(magicNumber) {
        case this.MAGIC_NUMBER_LE:
            return true;

        case this.MAGIC_NUMBER_BE:
            return false;

        default:
            throw new Error('Invalid mo file!');
    }
};


MoParser.prototype.getStringsFromTable = function(dataView, tableOffset, index) {
    // Get string offset
    dataView.seek(tableOffset + index * 8);
    var length = dataView.getUint32();
    var offset = dataView.getUint32() - 8;

    return this.readStrings(dataView, length, offset);
};


MoParser.prototype.readStrings = function(dataView, length, offset) {
    // Read complete string length into buffer
    var buffer = dataView.getBytes(length, offset);

    // Check, if the buffer contains multiple strings separated by NULL or EOT bytes.
    var stringOffsets = [0];
    for(var i = 0; i < buffer.byteLength; i++) {
        if(this.STRING_SEPARATOR_BYTES.indexOf(buffer[i]) > -1) {
            stringOffsets.push(i + 1);
        }
    }

    // Read string(s) from buffer
    var strings = [];
    for(var i = 0; i < stringOffsets.length; i++) {
        var currentOffset = stringOffsets[i];
        var currentLength;
        if(i < stringOffsets.length - 1) {
            currentLength = stringOffsets[i + 1] - currentOffset - 1;
        }
        else {
            currentLength = length - currentOffset;
        }

        strings.push(dataView.getString(currentLength, currentOffset + offset, this.STRING_ENCODING));
    }

    return strings;
};


MoParser.prototype.createTranslation = function(originalStrings, translatedStrings) {
    var key, value, context, pluralKey, pluralValues;

    // Extract context
    if((originalStrings.length == 3 && translatedStrings.length > 1) ||
       (originalStrings.length == 2 && translatedStrings.length == 1)) {
        context = originalStrings.shift();
    }

    // Extract keys and values
    key = originalStrings[0];
    if(originalStrings.length > 1) {
        // Plural translation
        pluralKey = originalStrings[1];
        pluralValues = translatedStrings;
    }
    else {
        // Singular translation
        value = translatedStrings[0];
    }

    return new Translation(key, value, context, pluralKey, pluralValues); //TODO: flags?
};


module.exports = MoParser;