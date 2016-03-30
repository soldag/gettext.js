var path = require('path');
var Jasmine = require('jasmine');
var proxyquire =  require('proxyquire');
var JasmineCore = require('jasmine-core');

// Needed using jasmine-ajax in node
global.getJasmineRequireObj = function() {
    return JasmineCore
};
global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

// Global function for loading source files
global.requireSrc = function(module, stubs) {
    var modulePath = path.join('../src', module);
    if(typeof stubs !== 'undefined') {
        return proxyquire(modulePath, stubs);
    }
    else {
        return require(modulePath);
    }
};

var jasmine = new Jasmine({
    jasmineCore: JasmineCore
});
jasmine.loadConfig({
    spec_dir: 'test',
    spec_files: [
        'spec/**/*[sS]pec.js'
    ],
    helpers: [
        'helpers/mock-ajax.js'
    ],
    stopSpecOnExpectationFailure: false,
    random: false
});
jasmine.execute();