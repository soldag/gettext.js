# j29n [![NPM Version][npm-image]][npm-url] [![Dependency Status][dependencies-image]][dependencies-url] [![devDependency Status][dev-dependencies-image]][dev-dependencies-url]

[npm-image]: https://badge.fury.io/js/j29n.svg
[npm-url]: https://badge.fury.io/js/j29n

[dependencies-image]: https://david-dm.org/soldag/j29n.svg
[dependencies-url]: https://david-dm.org/soldag/j29n

[dev-dependencies-image]: https://david-dm.org/soldag/j29n/dev-status.svg
[dev-dependencies-url]: https://david-dm.org/soldag/j29n#info=devDependencies

*j29n* (short for *JavaScript Internationalization*) is a simple and lightweight GNU gettext implementation for JavaScript. It makes it easy to load translations from PO or MO files and use them for localization in both  browser and Node.JS. The library supports different translation domains, contexts and plural forms. Additionally, it comes with an built-in string formatting mechanism for parameterized messages.

*j29n* was inspired by [Pomo](https://github.com/cfv1984/Pomo).


# Installation
*j29n* supports CommonJS and AMD module loading. Alternatively, the library can simply be loaded inside a HTML page using the `script` tag.


# Usage
The *j29n* module exports a `j29n` object, which is a singleton responsible for all the internationalization work and the only point of contact with the library.

### Loading translation files
Translation files can be load either by passing the content as string (only for PO files) or loading it asynchronously using Ajax. 

##### Load translations as string
```js
j29n.load({
  mode: 'string',
  data: '\
        #: path/to/file.js:42 \
        msgctxt "Optional Context" \
        msgid "Original string" \
        msgstr "Translation"', //the literal PO contents
  domain: 'messages', // optional
});
```

##### Load translations asynchronously

```js
j29n.load({
  mode: 'ajax',
  url: 'url/to/file.mo',
  type: 'application/gettext-mo', // or 'application/gettext-po' for PO files
  domain: 'messages' // optional
  ready: function() {
    // Optional callback is executed, when loading has finished successfully
  }
});
```

Translations can alternatively be load asynchronously using the html `link` tag as shown in the following example:
```html
<link href="/url/to/file.mo" type="application/gettext-mo" data-domain="optional domain" />
<script type="text/javascript">
  j29n.load({
    mode: 'link',
    ready: function() {
      // Optional callback is executed, when loading has finished successfully
    }
  });
</script>
```

### Translate messages
*j29n* provides the following standard gettext functions for translating messages.

```js
j29n.gettext(key, placeholderValues)
j29n.dgettext(domain, key, placeholderValues)
j29n.pgettext(context, key, placeholderValues)
j29n.dcngettext(domain, context, key, placeholderValues)
j29n.ngettext(singularKey, pluralKey, numericValue, placeholderValues)
j29n.npgettext(context, singularKey, pluralKey, numericValue, placeholderValues)
j29n.dngettext(domain, singularKey, pluralKey, numericValue, placeholderValues)
j29n.dnpgettext(domain, context, singularKey, pluralKey, numericValue, placeholderValues)
```

##### String formatting

Each of the functions above accepts an array of placeholder values for string formatting. 

```js
j29n.gettext('First three letters of the alphabet are %s, %s and %s.', ['a', 'b', 'c']);
```

Named placeholders are also supported. These placeholders refer to keys within an object you pass to the function. 

```js
j29n.gettext('First three letters of the alphabet are %(first)s, %(second)s and %(third)s.', {
  first: 'a',
  second: 'b'
  third: 'c'
});
```

For detailed documentation about string formatting (especially syntax of placeholders) have a look at [sprintf.js](https://github.com/alexei/sprintf.js), which is used internally.

##### Fuzzy translations
Per default, translations marked as *fuzzy* are ignored by the library. You can change the behavior using the ```setIgnoreFuzzy```
function:

```js
j29n.setIgnoreFuzzy(false);
```

# License
This library is provided under [MIT license](https://raw.githubusercontent.com/soldag/j29n/master/LICENSE.md).
