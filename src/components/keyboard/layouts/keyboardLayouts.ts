import type { KeyboardLayout } from './keyboardTypes'

export const usual: KeyboardLayout = {
  left: {
    row0: [
      {
        key: 'a'
      },
      {
        key: 'b'
      },
      {
        key: 'c'
      }
    ],
    row1: [
      {
        key: 'x'
      },
      {
        key: 'y'
      },
      {
        key: 'z'
      }
    ]
  },
  center: {
    row0: [
      {
        key: '0'
      },
      {
        key: ','
      },
      {
        key: 'π',
        insert: '\\pi'
      },
      {
        key: '+',
        insert: '+'
      }
    ],
    row1: [
      {
        key: '1'
      },
      {
        key: '2'
      },
      {
        key: '3'
      },
      {
        key: '—',
        insert: '-'
      }
    ],
    row2: [
      {
        key: '4'
      },
      {
        key: '5'
      },
      {
        key: '6'
      },
      {
        key: '$\\times$',
        insert: '\\times'
      }
    ],
    row3: [
      {
        key: '7'
      },
      {
        key: '8'
      },
      {
        key: '9'
      },
      {
        key: '$\\frac{\\square}{\\square}$',
        insert: '\\frac{#@}{#1}'
      }
    ]
  },
  right: {
    row0: [
      {
        key: '<i class="bx bx-arrow-back bx-xs"/>',
        command: ['performWithFeedback', 'moveToPreviousChar']
      },
      {
        key: '<i class="bx bx-arrow-back bx-rotate-180 bx-xs"/>',
        command: ['performWithFeedback', 'moveToNextChar']
      },
      {
        key: '<i class="bx bx-window-close bx-xs"/>',
        command: 'closeKeyboard'
      }
    ],
    row1: [
      {
        key: '&#x232b;',
        command: ['performWithFeedback', 'deleteBackward']
      },
      {
        key: '(',
        insert: '\\lparen'
      },
      {
        key: ')',
        insert: '\\rparen'
      }
    ],
    row2: [
      {
        key: '='
      },
      {
        key: 'oui'
      },
      {
        key: 'non'
      }
    ],
    row3: [
      {
        // eslint-disable-next-line no-useless-escape
        key: '$\\sqrt{~}$',
        insert: '\\sqrt{#@}'
      },
      {
        key: '$x^2$',
        insert: '^2'
      },
      {
        key: '$x^n$',
        insert: '#@^{#0}'
      }
    ]
  }
}
