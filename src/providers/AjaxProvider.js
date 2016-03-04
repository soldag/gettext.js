var ProviderBase = require('./ProviderBase');


AjaxProvider = function(defaultDomain, poParser, moParser) {
    ProviderBase.call(this, defaultDomain);

    this.poParser = poParser;
    this.moParser = moParser;
};

AjaxProvider.prototype = Object.create(ProviderBase.prototype);
AjaxProvider.prototype.constructor = AjaxProvider;

AjaxProvider.prototype.PO_MIME_TYPE = 'application/gettext-po';
AjaxProvider.prototype.MO_MIME_TYPE = 'application/gettext-mo';


AjaxProvider.prototype.canLoad = function(options) {
    return options.mode == 'ajax' && 'url' in options && 'type' in options;
};


AjaxProvider.prototype.loadFromOptions = function(options, callback) {
    var domain = options.domain || this.defaultDomain;
    var url = options.url;
    var type = options.type;

    this.load(domain, url, type, callback);
};


AjaxProvider.prototype.load = function(domain, url, type, callback) {
    this.addCallback(callback);

    var _this = this;
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
            console.error('Invalid file type!');
            return;
    }
    this.doRequest(url, binarySource, function(data) {
        var parser = _this.poParser;
        if(type == _this.MO_MIME_TYPE) {
            parser = _this.moParser;
        }
        _this.triggerDone(parser.parse(domain, data));
    });
};


AjaxProvider.prototype.doRequest = function(url, binarySource, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    if(binarySource) {
        request.responseType = "arraybuffer";
    }

    var _this = this;
    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            var responseData;
            if(binarySource) {
                var arrayBuffer = request.response;
                if (arrayBuffer) {
                    responseData = new Uint8Array(arrayBuffer);
                }
            }
            else {
                responseData = request.responseText;
            }
            callback(responseData);
        } else {
            console.error('Could not load translations from resource (' + _this.url + ')!');
        }
    };

    request.onerror = function() {
        console.error('Could not load translations from resource (' + _this.url + ')!');
    };

    request.send();
};


module.exports = AjaxProvider;