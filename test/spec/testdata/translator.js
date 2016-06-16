var Translation = requireSrc('translations/Translation');

module.exports = {
  gettext: {
    translations: {
      default: [
        new Translation('message', 'Nachricht'),
        new Translation('message from %s', 'Nachricht von %s'),
        new Translation('message from %(name)s', 'Nachricht von %(name)s')
      ]
    },
    cases: [
      // Existing translations
      {
        arguments: ['message'],
        translation: 'Nachricht'
      },
      {
        arguments: ['message from %s'],
        placeholderValues: ['John Doe'],
        translation: 'Nachricht von %s'
      },
      {
        arguments: ['message from %(name)s'],
        placeholderValues: {
          name: 'John Doe'
        },
        translation: 'Nachricht von %(name)s'
      },

      // Non-existing translations
      {
        arguments: ['receiver'],
        translation: 'receiver'
      }
    ]
  },

  dgettext: {
    translations: {
      mail: [
        new Translation('message', 'Nachricht'),
        new Translation('message from %s', 'Nachricht von %s'),
        new Translation('message from %(name)s', 'Nachricht von %(name)s')
      ],
      art: [
        new Translation('message', 'Aussage')
      ]
    },
    cases: [
      // Existing translations
      {
        arguments: ['mail', 'message'],
        translation: 'Nachricht'
      },
      {
        arguments: ['art', 'message'],
        translation: 'Aussage'
      },
      {
        arguments: ['mail', 'message from %s'],
        placeholderValues: ['John Doe'],
        translation: 'Nachricht von %s'
      },
      {
        arguments: ['mail', 'message from %(name)s'],
        placeholderValues: {
          name: 'John Doe'
        },
        translation: 'Nachricht von %(name)s'
      },

      // Non-existing translations
      {
        arguments: ['mail', 'receiver'],
        translation: 'receiver'
      },
      {
        arguments: ['technology', 'message'],
        translation: 'message'
      }
    ]
  },

  cgettext: {
    translations: {
      default: [
        new Translation('message', 'Nachricht', 'mail'),
        new Translation('message from %s', 'Nachricht von %s', 'mail'),
        new Translation('message from %(name)s', 'Nachricht von %(name)s', 'mail'),
        new Translation('message', 'Aussage', 'art')
      ]
    },
    cases: [
      // Existing translations
      {
        arguments: ['mail', 'message'],
        translation: 'Nachricht'
      },
      {
        arguments: ['art', 'message'],
        translation:'Aussage'
      },
      {
        arguments: ['mail', 'message from %s'],
        placeholderValues: ['John Doe'],
        translation: 'Nachricht von %s'
      },
      {
        arguments: ['mail', 'message from %(name)s'],
        placeholderValues: {
          name: 'John Doe'
        },
        translation: 'Nachricht von %(name)s'
      },

      // Non-existing translations
      {
        arguments: ['mail', 'receiver'],
        translation:'receiver'
      },
      {
        arguments: ['technology', 'message'],
        translation:'message'
      }
    ]
  },

  dcgettext: {
    translations: {
      domain1: [
        new Translation('message', 'Nachricht', 'mail'),
        new Translation('message from %s', 'Nachricht von %s', 'mail'),
        new Translation('message from %(name)s', 'Nachricht von %(name)s', 'mail'),
        new Translation('message', 'Aussage', 'art')
      ],
      domain2: [
        new Translation('message', 'Brief', 'mail'),
        new Translation('message', 'Botschaft', 'art')
      ]
    },
    cases: [
      // Existing translations
      {
        arguments: ['domain1', 'mail', 'message'],
        translation: 'Nachricht'
      },
      {
        arguments: ['domain1', 'art', 'message'],
        translation: 'Aussage'
      },
      {
        arguments: ['domain2', 'mail', 'message'],
        translation: 'Brief'
      },
      {
        arguments: ['domain2', 'art', 'message'],
        translation: 'Botschaft'
      },
      {
        arguments: ['domain1', 'mail', 'message from %s'],
        placeholderValues: ['John Doe'],
        translation: 'Nachricht von %s'
      },
      {
        arguments: ['domain1', 'mail', 'message from %(name)s'],
        placeholderValues: {
          name: 'John Doe'
        },
        translation: 'Nachricht von %(name)s'
      },

      // Non-existing translations
      {
        arguments: ['domain1', 'mail', 'receiver'],
        translation: 'receiver'
      },
      {
        arguments: ['domain3', 'mail', 'message'],
        translation: 'message'
      },
      {
        arguments: ['domain1', 'technology', 'message'],
        translation: 'message'
      }
    ]
  },

  ngettext: {
    translations: {
      default: [
        new Translation('message', null, null, 'messages', ['Nachricht', 'Nachrichten']),
        new Translation('%i message', null, null, '%i messages', ['%i Nachricht', '%i Nachrichten']),
        new Translation('%(num)i message', null, null, '%(num)i messages', ['%(num)i Nachricht', '%(num)i Nachrichten']),
        new Translation('sender', 'Absender')
      ]
    },
    cases: [
      // Existing translations
      {
        arguments: ['message', 'messages', 1],
        translation: 'Nachricht'
      },
      {
        arguments: ['message', 'message', 2],
        translation: 'Nachrichten'
      },
      {
        arguments: ['%i message', '%i messages', 1],
        placeholderValues: [1],
        translation: '%i Nachricht'
      },
      {
        arguments: ['%i message', '%i messages', 2],
        placeholderValues: {
          num: 2
        },
        translation: '%i Nachrichten'
      },
      // Non-existing translations
      {
        arguments: ['sender', 'senders', 1],
        translation: 'sender'
      },
      {
        arguments: ['sender', 'senders', 2],
        translation: 'senders'
      },
      {
        arguments: ['receiver', 'receivers', 1],
        translation: 'receiver'
      },
      {
        arguments: ['receiver', 'receivers', 2],
        translation: 'receivers'
      }
    ]
  },

  dngettext: {
    translations: {
      mail: [
        new Translation('message', null, null, 'messages', ['Nachricht', 'Nachrichten']),
        new Translation('%i message', null, null, '%i messages', ['%i Nachricht', '%i Nachrichten']),
        new Translation('%(num)i message', null, null, '%(num)i messages', ['%(num)i Nachricht', '%(num)i Nachrichten']),
        new Translation('sender', 'Absender')
      ],
      art: [
        new Translation('message', null, null, 'messages', ['Aussage', 'Aussagen'])
      ]
    },
    cases: [
      // Existing translations
      {
        arguments: ['mail', 'message', 'messages', 1],
        translation: 'Nachricht'
      },
      {
        arguments: ['mail', 'message', 'messages', 2],
        translation: 'Nachrichten'
      },
      {
        arguments: ['art', 'message', 'messages', 1],
        translation: 'Aussage'
      },
      {
        arguments: ['art', 'message', 'messages', 2],
        translation: 'Aussagen'
      },
      {
        arguments: ['mail', '%i message', '%i messages', 1],
        placeholderValues: [1],
        translation: '%i Nachricht'
      },
      {
        arguments: ['mail', '%i message', '%i messages', 2],
        placeholderValues: {
          num: 2
        },
        translation: '%i Nachrichten'
      },

      // Non-existing translations
      {
        arguments: ['mail', 'sender', 'senders', 1],
        translation: 'sender'
      },
      {
        arguments: ['mail', 'sender', 'senders', 2],
        translation: 'senders'
      },
      {
        arguments: ['technology', 'message', 'messages', 1],
        translation: 'message'
      },
      {
        arguments: ['technology', 'message', 'messages', 2],
        translation: 'messages'
      },
      {
        arguments: ['mail', 'receiver', 'receivers', 1],
        translation: 'receiver'
      },
      {
        arguments: ['mail', 'receiver', 'receivers', 2],
        translation: 'receivers'
      }
    ]
  },

  cngettext: {
    translations: {
      default: [
        new Translation('message', null, 'mail', 'messages', ['Nachricht', 'Nachrichten']),
        new Translation('%i message', null, 'mail', '%i messages', ['%i Nachricht', '%i Nachrichten']),
        new Translation('%(num)i message', null, 'mail', '%(num)i messages', ['%(num)i Nachricht', '%(num)i Nachrichten']),
        new Translation('message', null, 'art', 'messages', ['Aussage', 'Aussagen'])
      ]
    },
    cases: [
      // Existing translations
      {
        arguments: ['mail', 'message', 'messages', 1],
        translation: 'Nachricht'
      },
      {
        arguments: ['mail', 'message', 'messages', 2],
        translation: 'Nachrichten'
      },
      {
        arguments: ['art', 'message', 'messages', 1],
        translation: 'Aussage'
      },
      {
        arguments: ['art', 'message', 'messages', 2],
        translation: 'Aussagen'
      },
      {
        arguments: ['mail', '%i message', '%i messages', 1],
        placeholderValues: [1],
        translation: '%i Nachricht'
      },
      {
        arguments: ['mail', '%i message', '%i messages', 2],
        placeholderValues: {
          num: 2
        },
        translation: '%i Nachrichten'
      },

      // Non-existing translations
      {
        arguments: ['mail', 'sender', 'senders', 1],
        translation: 'sender'
      },
      {
        arguments: ['mail', 'sender', 'senders', 2],
        translation: 'senders'
      },
      {
        arguments: ['technology', 'message', 'messages', 1],
        translation: 'message'
      },
      {
        arguments: ['technology', 'message', 'messages', 2],
        translation: 'messages'
      },
      {
        arguments: ['mail', 'receiver', 'receivers', 1],
        translation: 'receiver'
      },
      {
        arguments: ['mail', 'receiver', 'receivers', 2],
        translation: 'receivers'
      }
    ]
  },

  dcngettext: {
    translations: {
      domain1: [
        new Translation('message', null, 'mail', 'messages', ['Nachricht', 'Nachrichten']),
        new Translation('%i message', null, 'mail', '%i messages', ['%i Nachricht', '%i Nachrichten']),
        new Translation('%(num)i message', null, 'mail', '%(num)i messages', ['%(num)i Nachricht', '%(num)i Nachrichten']),
        new Translation('message', null, 'art', 'messages', ['Aussage', 'Aussagen'])
      ],
      domain2: [
        new Translation('message', null, 'mail', 'messages', ['Brief', 'Briefe']),
        new Translation('message', null, 'art', 'messages', ['Botschaft', 'Botschaften'])
      ]
    },
    cases: [
      // Existing translations
      {
        arguments: ['domain1', 'mail', 'message', 'messages', 1],
        translation: 'Nachricht'
      },
      {
        arguments: ['domain1', 'mail', 'message', 'messages', 2],
        translation: 'Nachrichten'
      },
      {
        arguments: ['domain1', 'art', 'message', 'messages', 1],
        translation: 'Aussage'
      },
      {
        arguments: ['domain1', 'art', 'message', 'messages', 2],
        translation: 'Aussagen'
      },
      {
        arguments: ['domain2', 'mail', 'message', 'messages', 1],
        translation: 'Brief'
      },
      {
        arguments: ['domain2', 'mail', 'message', 'messages', 2],
        translation: 'Briefe'
      },
      {
        arguments: ['domain2', 'art', 'message', 'messages', 1],
        translation: 'Botschaft'
      },
      {
        arguments: ['domain2', 'art', 'message', 'messages', 2],
        translation: 'Botschaften'
      },
      {
        arguments: ['domain1', 'mail', '%i message', '%i messages', 1],
        placeholderValues: [1],
        translation: '%i Nachricht'
      },
      {
        arguments: ['domain1', 'mail', '%i message', '%i messages', 2],
        placeholderValues: {
          num: 2
        },
        translation: '%i Nachrichten'
      },

      // Non-existing translations
      {
        arguments: ['domain1', 'mail', 'sender', 'senders', 1],
        translation: 'sender'
      },
      {
        arguments: ['domain1', 'mail', 'sender', 'senders', 2],
        translation: 'senders'
      },
      {
        arguments: ['domain1', 'technology', 'message', 'messages', 1],
        translation: 'message'
      },
      {
        arguments: ['domain1', 'technology', 'message', 'messages', 2],
        translation: 'messages'
      },
      {
        arguments: ['domain1', 'mail', 'receiver', 'receivers', 1],
        translation: 'receiver'
      },
      {
        arguments: ['domain1', 'mail', 'receiver', 'receivers', 2],
        translation: 'receivers'
      },
      {
        arguments: ['domain2', 'mail', 'sender', 'senders', 1],
        translation: 'sender'
      },
      {
        arguments: ['domain2', 'mail', 'sender', 'senders', 2],
        translation: 'senders'
      },
      {
        arguments: ['domain2', 'technology', 'message', 'messages', 1],
        translation: 'message'
      },
      {
        arguments: ['domain2', 'technology', 'message', 'messages', 2],
        translation: 'messages'
      },
      {
        arguments: ['domain2', 'mail', 'receiver', 'receivers', 1],
        translation: 'receiver'
      },
      {
        arguments: ['domain2', 'mail', 'receiver', 'receivers', 2],
        translation: 'receivers'
      }
    ]
  }
};