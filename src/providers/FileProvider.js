var fs = require('fs');
var path = require('path');
var isNode = require('detect-node');
var ProviderBase = require('./ProviderBase');

FileProvider = function(defaultDomain, poParser, moParser) {
    ProviderBase.call(this, defaultDomain);

    this.poParser = poParser;
    this.moParser = moParser;
};

FileProvider.prototype = Object.create(ProviderBase.prototype);
FileProvider.prototype.constructor = FileProvider;

FileProvider.prototype.PO_EXTENSION = '.po';
FileProvider.prototype.MO_EXTENSION = '.mo';

FileProvider.prototype.canLoadFromOptions = function(options) {
    return options.mode == 'file' && 'path' in options;
};

FileProvider.prototype.loadFromOptions = function(options, callback) {
    var domain = options.domain || this.defaultDomain;
    var filePath = options.path;

    this.load(domain, filePath, callback);
};

FileProvider.prototype.load = function(domain, filePath, callback) {
    var _this = this;

    // Check environment
    if(!isNode) {
        throw Error('Loading translations from the file system is only supported using Node.js.');
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
    this.addCallback(callback);
    fs.readFile(filePath, readOptions, function(error, data) {
        var parser = _this.poParser;
        if(ext === _this.MO_EXTENSION) {
            parser = _this.moParser;
        }

        _this.triggerDone(parser.parse(domain, data));
    });
};


module.exports = FileProvider;