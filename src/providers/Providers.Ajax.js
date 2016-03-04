Providers.Ajax = function(defaultDomain) {
    Providers.Base.call(this, defaultDomain);

    this.poParser = new Parsers.PoParser();
    this.moParser = new Parsers.MoParser();
};

Providers.Ajax.prototype = Object.create(Providers.Base.prototype);
Providers.Ajax.prototype.constructor = Providers.Ajax;

Providers.Ajax.prototype.PO_MIME_TYPE = 'application/gettext-po';
Providers.Ajax.prototype.MO_MIME_TYPE = 'application/gettext-mo';


Providers.Ajax.canLoad = function(options) {
    return options.mode == 'ajax' && 'url' in options && 'type' in options;
};


Providers.Ajax.prototype.loadFromOptions = function(options, callback) {
    var domain = options.domain || this.defaultDomain;
    var url = options.url;
    var type = options.type;

    this.load(domain, url, type, callback);
};


Providers.Ajax.prototype.load = function(domain, url, type, callback) {
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


Providers.Ajax.prototype.doRequest = function(url, binarySource, callback) {
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