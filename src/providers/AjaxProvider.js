var isNode = require('detect-node');


function AjaxProvider(poParser, moParser) {
    this.poParser = poParser;
    this.moParser = moParser;
}

AjaxProvider.prototype.PO_MIME_TYPE = 'application/gettext-po';
AjaxProvider.prototype.MO_MIME_TYPE = 'application/gettext-mo';


AjaxProvider.prototype.canLoadFromOptions = function(options) {
    return options.mode === 'ajax' && 'domain' in options && 'url' in options && 'type' in options;
};


AjaxProvider.prototype.loadFromOptions = function(options, callback) {
    this.load(options.domain, options.url, options.type, callback);
};


AjaxProvider.prototype.load = function(domain, url, type, callback) {
    var _this = this;

    // Check environment
    if(isNode || typeof XMLHttpRequest !== 'function') {
        throw new Error('Loading translations via AJAX is only supported in browsers with XMLHttpRequest support.');
    }

    // Check mime type
    var binarySource;
    type = type.toLowerCase();
    switch(type) {
        case this.PO_MIME_TYPE:
            binarySource = false;
            break;

        case this.MO_MIME_TYPE:
            binarySource = true;
            break;

        default:
            throw new Error('Invalid file type!');
    }

    // Do AJAX request and parse result
    this.doRequest(url, binarySource, function(data) {
        var parser = _this.poParser;
        if(type === _this.MO_MIME_TYPE) {
            parser = _this.moParser;
        }
        return callback(parser.parse(domain, data));
    });
};


AjaxProvider.prototype.doRequest = function(url, binarySource, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    if(binarySource) {
        request.responseType = "arraybuffer";
    }

    request.onload = function() {
        var responseData = binarySource ? request.response : request.responseText;
        if(request.status < 200 || request.status >= 400 || !responseData) {
            throwError();
        }
        if(binarySource) {
            responseData = new Uint8Array(responseData);
        }
        return callback(responseData);
    };
    request.onerror = throwError;
    request.send();

    function throwError() {
        throw new Error('Could not load translations from resource (' + url + ')!');
    }
};


module.exports = AjaxProvider;