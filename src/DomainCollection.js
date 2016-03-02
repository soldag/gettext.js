var DomainCollection = function() {
    this.translations = {};
};


DomainCollection.prototype.addDomain = function(domain, translationCollection) {
    this.translations[domain] = translationCollection
};


DomainCollection.prototype.addAllDomains = function(domainCollection) {
    var domains = domainCollection.getDomainNames();
  for(var i = 0; i < domains.length; i++) {
      var domain = domains[i];
      this.translations[domain] = domainCollection.getDomain(domain);
  }
};


DomainCollection.prototype.getDomainNames = function() {
  return Object.keys(this.translations);
};


DomainCollection.prototype.containsDomain = function(domain) {
    return domain in this.translations;
};


DomainCollection.prototype.getDomain = function(domain) {
    if(this.containsDomain(domain)) {
        return this.translations[domain];
    }
};