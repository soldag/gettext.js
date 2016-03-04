# gettext.js
gettext.js is a simple and lightweight GNU gettext implementation for JavaScript. It makes it easy to load translations from PO or MO files and use them for localization in the browser (Node.JS support is planned!). The library supports different translation domains, contexts and plural forms. Additionally, it comes with an built-in string formatting mechanism for parameterized messages.  

gettext.js was inspired by [Pomo](https://github.com/cfv1984/Pomo).


# Installation
getttext.js supports CommonJS and AMD module loading. Alternatively, the library can simply be loaded inside a HTML page using the `script` tag.


# Usage
The gettext.js module exports a `Translator` instance, which is a singleton responsible for all the localization work and the only point of contact with the library.

### Loading translation files
Translation files can be load either by passing the content as string (only for PO files) or loading it asynchronously using Ajax. 

##### Load translations as string
```js
Translator.load({
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
Translator.load({
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
  Translator.load({
    mode: 'link',
    ready: function() {
      // Optional callback is executed, when loading has finished successfully
    }
  });
</script>
```

### Translate messages
gettext.js provides the following standard gettext functions for translating messages. 

```js
Translator.gettext(key)
Translator.dgettext(domain, key)
Translator.pgettext(context, key)
Translator.dcngettext(domain, context, key)
Translator.ngettext(singularKey, pluralKey, numericValue)
Translator.npgettext(context, singularKey, pluralKey, numericValue)
Translator.dngettext(domain, singularKey, pluralKey, numericValue)
Translator.dnpgettext(domain, context, singularKey, pluralKey, numericValue)
```

##### String formatting

Each of the functions above accepts additional arguments for string formatting. Those values can be passed separately or as an array as last argument(s). 

```js
Translator.gettext('First three letters of the alphabet are %s, %s and %s.', 'a', 'b', 'c');
Translator.gettext('First three letters of the alphabet are %s, %s and %s.', ['a', 'b', 'c']);
```

Named placeholders are also supported. These placeholders refer to keys within an object you pass to the function. 

```js
Translator.gettext('First three letters of the alphabet are %(first)s, %(second)s and %(third)s.', {
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
Translator.setIgnoreFuzzy(false);
```

# License
This library is provided under [MIT license](https://raw.githubusercontent.com/soldag/gettext.js/master/LICENSE.md).
