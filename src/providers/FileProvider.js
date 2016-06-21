var fs = require('fs');
var path = require('path');
var isNode = require('detect-node');

function FileProvider(poParser, moParser) {
    this.poParser = poParser;
    this.moParser = moParser;
}

FileProvider.prototype.PO_EXTENSION = '.po';
FileProvider.prototype.MO_EXTENSION = '.mo';

FileProvider.prototype.canLoadFromOptions = function(options) {
    return options.mode === 'file' && 'domain' in options && 'path' in options;
};

FileProvider.prototype.loadFromOptions = function(options, callback) {
    this.load(options.domain, options.path, callback);
};

FileProvider.prototype.load = function(domain, filePath, callback) {
    var _this = this;

    // Check environment
    if(!isNode) {
        throw new Error('Loading translations from the file system is only supported using Node.js.');
    }

    // Check type and set options for reading
    var readOptions = {};
    var ext = path.extname(filePath).toLowerCase();
    switch(ext) {
        case this.PO_EXTENSION:
            readOptions['encoding'] = 'utf-8';
            break;

        case this.MO_EXTENSION:
            break;

        default:
            throw new Error('Invalid file type!');
    }

    // Read file
    fs.readFile(filePath, readOptions, function(error, data) {
        var parser = _this.poParser;
        if(ext === _this.MO_EXTENSION) {
            parser = _this.moParser;
        }

        return callback(parser.parse(domain, data));
    });
};


module.exports = FileProvider;