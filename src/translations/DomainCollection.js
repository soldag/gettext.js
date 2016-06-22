var DomainCollection = function(domains) {
    this.domains = domains || {};
};


DomainCollection.prototype.addAllDomains = function(domainCollection, overwrite) {
    if(overwrite == null) {
        overwrite = true;
    }
    var domains = domainCollection.getDomainNames();
    for(var i = 0; i < domains.length; i++) {
       var domain = domains[i];
       if(!(domain in this.domains) || overwrite) {
           this.domains[domain] = domainCollection.getDomain(domain);
       }
    }
};


DomainCollection.prototype.getDomainNames = function() {
  return Object.keys(this.domains);
};


DomainCollection.prototype.hasDomain = function(domain) {
    return domain in this.domains;
};


DomainCollection.prototype.getDomain = function(domain) {
    if(this.hasDomain(domain)) {
        return this.domains[domain];
    }
};


module.exports = DomainCollection;