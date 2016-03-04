(function (root, factory) {
    if(typeof define === "function" && define.amd) {
        define(function(){
            return (root.Translator = factory());
        });
    } else if(typeof module === "object" && module.exports) {
        module.exports = (root.Translator = factory());
    } else {
        root.Translator = factory();
    }
}(this, function() {