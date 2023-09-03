export const CLAVIER_ENSEMBLE = {
  label: 'Maths', // Label displayed in the Virtual Keyboard Switcher
  tooltip: 'Clavier mathématique', // Tooltip when hovering over the label
  rows: [
    [
      { latex: '\\mathbb{C}' },
      { latex: '\\mathbb{R}' },
      { latex: '\\mathbb{Q}' },
      { latex: '\\mathbb{D}' },
      { latex: '\\mathbb{Z}' },
      { latex: '\\mathbb{N}' },
      { class: 'separator w5' },
      {
        class: 'action',
        label: "<svg><use xlink:href='#svg-arrow-left' /></svg>",
        command: ['performWithFeedback', 'moveToPreviousChar']
      },
      {
        class: 'action',
        label: "<svg><use xlink:href='#svg-arrow-right' /></svg>",
        command: ['performWithFeedback', 'moveToNextChar']
      },
      {
        class: 'action font-glyph',
        label: '&#x232b;',
        command: ['performWithFeedback', 'deleteBackward']
      },
      {
        class: 'action font-glyph',
        label: '&#10006;',
        command: ['toggleVirtualKeyboard', 'toggleVirtualKeyboard']
      }
    ]
  ]
}

export const raccourcisEnsemble = {
  C: { mode: 'math', value: '\\mathbb{C}' },
  c: { mode: 'math', value: '\\mathbb{C}' },
  R: { mode: 'math', value: '\\mathbb{R}' },
  r: { mode: 'math', value: '\\mathbb{R}' },
  Q: { mode: 'math', value: '\\mathbb{Q}' },
  q: { mode: 'math', value: '\\mathbb{Q}' },
  D: { mode: 'math', value: '\\mathbb{D}' },
  d: { mode: 'math', value: '\\mathbb{D}' },
  Z: { mode: 'math', value: '\\mathbb{Z}' },
  z: { mode: 'math', value: '\\mathbb{Z}' },
  N: { mode: 'math', value: '\\mathbb{N}' },
  n: { mode: 'math', value: '\\mathbb{N}' }
}
