export const CLAVIER_NUMERATION = {
  label: 'Numération', // Label displayed in the Virtual Keyboard Switcher
  tooltip: 'Clavier mathématique (classes de numération décimale)', // Tooltip when hovering over the label
  rows: [
    [
      {
        class: 'tex small',
        latex: '\\text{milliard}'
      },
      {
        class: 'tex small',
        latex: '\\text{million}'
      },
      {
        class: 'tex small',
        latex: '\\text{mille}'
      },
      {
        class: 'tex small',
        latex: '\\text{centaine}'
      },
      {
        class: 'tex small',
        latex: '\\text{dizaine}'
      },
      {
        class: 'tex small',
        latex: '\\text{unité}'
      },

      { class: 'separator w5' },
      {
        class: 'tex small',
        latex: '\\text{ de }'
      }
    ], [
      {
        class: 'tex small',
        latex: '\\text{dixième}'
      },
      {
        class: 'tex small',
        latex: '\\text{centième}'
      },
      {
        class: 'tex small',
        latex: '\\text{millième}'
      },
      {
        class: 'tex small',
        latex: '\\text{dix-millième}'
      },
      {
        class: 'tex small',
        latex: '\\text{cent-millième}'
      },
      {
        class: 'tex small',
        latex: '\\text{millionième}'
      },
      { class: 'separator w5' },
      { latex: '\\text{-}' }

    ],
    [
      {
        class: 'tex small',
        latex: '\\text{dix}'
      },
      {
        class: 'tex small',
        latex: '\\text{vingt}'
      },
      {
        class: 'tex small',
        latex: '\\text{trente}'
      },
      {
        class: 'tex small',
        latex: '\\text{quarante}'
      },
      {
        class: 'tex small',
        latex: '\\text{cinquante}'
      },
      {
        class: 'tex small',
        latex: '\\text{soixante}'
      },
      { class: 'separator w5' },
      {
        class: 'tex small',
        latex: '\\text{s}'
      }
    ],
    [
      {
        class: 'tex small',
        latex: '\\text{soixante-dix}'
      },
      {
        class: 'tex small',
        latex: '\\text{quatre-vingt}'
      },
      {
        class: 'tex small',
        latex: '\\text{\\footnotesize quatre-vingt-dix}'
      },
      {
        class: 'tex small',
        latex: '\\text{cent}'
      },
      {
        class: 'action small',
        label: "<svg><use xlink:href='#svg-arrow-left' /></svg>",
        command: ['performWithFeedback', 'moveToPreviousChar']
      },
      {
        class: 'action small',
        label: "<svg><use xlink:href='#svg-arrow-right' /></svg>",
        command: ['performWithFeedback', 'moveToNextChar']
      },
      {
        class: 'action font-glyph small',
        label: '&#x232b;',
        command: ['performWithFeedback', 'deleteBackward']
      }
    ]
  ]
}

export const raccourcisNumeration = {
  alpha: { mode: 'math', value: '\\alpha' },
  beta: { mode: 'math', value: '\\beta' },
  gamma: { mode: 'math', value: '\\gamma' },
  delta: { mode: 'math', value: '\\delta' },
  epsilon: { mode: 'math', value: '\\epsilon' },
  theta: { mode: 'math', value: '\\theta' },
  omega: { mode: 'math', value: '\\omega' },
  lambda: { mode: 'math', value: '\\lambda' },
  '*': { mode: 'math', value: '\\times' },
  '.': { mode: 'math', value: ',' },
  cos: { mode: 'math', value: 'cos(#0)' },
  sin: { mode: 'math', value: 'sin(#0)' },
  tan: { mode: 'math', value: 'tan(#0)' }
}
