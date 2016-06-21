var PoParser = require('./PoParser');
var MoParser = require('./MoParser');

function ParserFactory() { }


ParserFactory.prototype.createPoParser = function() {
    return new PoParser();
};


ParserFactory.prototype.createMoParser = function() {
    return new MoParser();
};


module.exports = ParserFactory;