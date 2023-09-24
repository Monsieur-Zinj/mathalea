export const CLAVIER_GRECTRIGO = {
  label: 'Maths', // Label displayed in the Virtual Keyboard Switcher
  tooltip: 'Clavier mathématique (lettres grecques et trigonométrie)', // Tooltip when hovering over the label
  rows: [
    [
      { latex: '\\alpha' },
      { latex: '\\beta' },
      { class: 'separator w5' },
      { label: '7', key: '7' },
      { label: '8', key: '8' },
      { label: '9', key: '9' },
      { latex: '\\div' },
      { class: 'separator w5' },
      {
        class: 'tex small',
        label: '<span><i>x</i>&thinsp;²</span>',
        insert: '$$#@^{2}$$'
      },
      {
        class: 'tex small',
        label: '<span><i>x</i><sup>&thinsp;<i>3</i></sup></span>',
        insert: '$$#@^{3}$$'
      },
      {
        class: 'small',
        latex: '\\sqrt{#0}',
        insert: '$$\\sqrt{#0}$$'
      }
    ],
    [
      { latex: '\\gamma' },
      { latex: '\\delta' },
      { class: 'separator w5' },
      { label: '4', latex: '4' },
      { label: '5', key: '5' },
      { label: '6', key: '6' },
      { latex: '\\times' },
      { class: 'separator w5' },
      { class: 'small', latex: '\\frac{#0}{#0}' },
      { label: '=', key: '=' },
      { latex: 'f' }
    ],
    [
      { latex: '\\epsilon' },
      { latex: '\\theta' },
      { class: 'separator w5' },
      { label: '1', key: '1' },
      { label: '2', key: '2' },
      { label: '3', key: '3' },
      { latex: '-' },
      { class: 'separator w5' },
      { label: 'cos', latex: 'cos(#0)' },
      { label: 'sin', latex: 'sin(#0)' },
      { label: 'tan', latex: 'tan(#0)' }
    ],
    [
      { latex: '\\lambda' },
      { latex: '\\omega' },
      { class: 'separator w5' },
      { label: '0', key: '0' },
      { latex: ',' },
      { latex: '\\pi' },
      { latex: '+' },
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
      }
    ]
  ]
}


export const raccourcisTrigo = {
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
 cos: { mode: 'math',  value: 'cos(#0)' },
 sin: { mode: 'math', value: 'sin(#0)' },
tan: { mode: 'math', value: 'tan(#0)' }
}
