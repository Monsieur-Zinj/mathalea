const CLAVIER_AIRES = {
  label: 'Aires', // Label displayed in the Virtual Keyboard Switcher
  tooltip: 'Clavier mathématique (Aires)', // Tooltip when hovering over the label
  rows: [
    [
      { latex: '\\operatorname{dm}^2' },
      { latex: '\\operatorname{cm}^2' },
      { latex: '\\operatorname{mm}^2' },
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
      { latex: '\\operatorname{hm}^2' },
      { latex: '\\operatorname{dam}^2' },
      { latex: '\\operatorname{m}^2' },
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
      { class: 'separator w8' },
      { latex: '\\operatorname{km}^2' },
      { class: 'separator w15' },
      { label: '1', key: '1' },
      { label: '2', key: '2' },
      { label: '3', key: '3' },
      { latex: '-' },
      { class: 'separator w5' },
      { label: ';', key: ';' },
      { label: 'oui', key: 'oui' },
      { label: 'non', key: 'non' }
    ],
    [
      { latex: '\\operatorname{ha}' },
      { latex: '\\operatorname{a}' },
      { latex: '\\operatorname{ca}' },
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

const CLAVIER_LONGUEURS = {
  label: 'Longueurs', // Label displayed in the Virtual Keyboard Switcher
  tooltip: 'Clavier mathématique (Longueurs)', // Tooltip when hovering over the label
  rows: [
    [
      { latex: '\\operatorname{cm}' },
      { latex: '\\operatorname{mm}' },
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
      { latex: '\\operatorname{m}' },
      { latex: '\\operatorname{dm}' },
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
      { latex: '\\operatorname{hm}' },
      { latex: '\\operatorname{dam}' },
      { class: 'separator w5' },
      { label: '1', key: '1' },
      { label: '2', key: '2' },
      { label: '3', key: '3' },
      { latex: '-' },
      { class: 'separator w5' },
      { label: ';', key: ';' },
      { label: 'oui', key: 'oui' },
      { label: 'non', key: 'non' }
    ],
    [
      { class: 'separator w5' },
      { latex: '\\operatorname{km}' },
      { class: 'separator w10' },
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

const CLAVIER_VOLUMES = {
  label: 'Volumes', // Label displayed in the Virtual Keyboard Switcher
  tooltip: 'Clavier mathématique (Volumes)', // Tooltip when hovering over the label
  rows: [
    [
      { latex: '\\operatorname{cL}' },
      { latex: '\\operatorname{mL}' },
      { class: 'separator w5' },
      { latex: '\\operatorname{cm}^3' },
      { latex: '\\operatorname{mm}^3' },
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
      { latex: '\\operatorname{L}' },
      { latex: '\\operatorname{dL}' },
      { class: 'separator w5' },
      { latex: '\\operatorname{m}^3' },
      { latex: '\\operatorname{dm}^3' },
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
      { latex: '\\operatorname{hL}' },
      { latex: '\\operatorname{daL}' },
      { class: 'separator w5' },
      { latex: '\\operatorname{hm}^3' },
      { latex: '\\operatorname{dam}^3' },
      { class: 'separator w5' },
      { label: '1', key: '1' },
      { label: '2', key: '2' },
      { label: '3', key: '3' },
      { latex: '-' },
      { class: 'separator w5' },
      { label: ';', key: ';' },
      { label: 'oui', key: 'oui' },
      { label: 'non', key: 'non' }
    ],
    [
      { class: 'separator w15' },
      { class: 'separator w15' },
      { latex: '\\operatorname{km}^3' },
      { class: 'separator w10' },
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

const CLAVIER_MASSES = {
  label: 'Masses', // Label displayed in the Virtual Keyboard Switcher
  tooltip: 'Clavier mathématique (Masses)', // Tooltip when hovering over the label
  rows: [
    [
      { latex: '\\operatorname{dg}' },
      { latex: '\\operatorname{cg}' },
      { latex: '\\operatorname{mg}' },
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
      { latex: '\\operatorname{hg}' },
      { latex: '\\operatorname{dag}' },
      { latex: '\\operatorname{g}' },
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
      { class: 'separator w8' },
      { latex: '\\operatorname{kg}' },
      { class: 'separator w15' },
      { label: '1', key: '1' },
      { label: '2', key: '2' },
      { label: '3', key: '3' },
      { latex: '-' },
      { class: 'separator w5' },
      { label: ';', key: ';' },
      { label: 'oui', key: 'oui' },
      { label: 'non', key: 'non' }
    ],
    [
      { class: 'separator w10' },
      { latex: '\\operatorname{t}' },
      { latex: '\\operatorname{q}' },
      { class: 'separator w10' },
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
      },
      { class: 'separator w5' }
    ]
  ]
}

export function clavierUNITES (tabConf) {
  const clavierVirtuel = []
  for (let index = 0; index < tabConf.length; index++) {
    if (tabConf[index].includes('ongueur')) clavierVirtuel.push(CLAVIER_LONGUEURS) // Pour pouvoir saisir longueur sans se soucier du pluriel ou de la majuscule initiale
    else if (tabConf[index].includes('ire')) clavierVirtuel.push(CLAVIER_AIRES)
    else if (tabConf[index].includes('olume')) clavierVirtuel.push(CLAVIER_VOLUMES)
    else if (tabConf[index].includes('asse')) clavierVirtuel.push(CLAVIER_MASSES)
  }
  return clavierVirtuel
}

export const raccourcisUnites = {
  mg: { mode: 'math', value: '\\operatorname{mg}' },
  cg: { mode: 'math', value: '\\operatorname{cg}' },
  dg: { mode: 'math', value: '\\operatorname{dg}' },
  g: { mode: 'math', value: '\\operatorname{g}' },
  dag: { mode: 'math', value: '\\operatorname{dag}' },
  hg: { mode: 'math', value: '\\operatorname{hg}' },
  kg: { mode: 'math', value: '\\operatorname{kg}' },
  mL: { mode: 'math', value: '\\operatorname{mL}' },
  cL: { mode: 'math', value: '\\operatorname{cL}' },
  dL: { mode: 'math', value: '\\operatorname{dL}' },
  L: { mode: 'math', value: '\\operatorname{L}' },
  daL: { mode: 'math', value: '\\operatorname{daL}' },
  hL: { mode: 'math', value: '\\operatorname{hL}' },
  mm: { mode: 'math', value: '\\operatorname{mm}' },
  cm: { mode: 'math', value: '\\operatorname{cm}' },
  dm: { mode: 'math', value: '\\operatorname{dm}' },
  m: { mode: 'math', value: '\\operatorname{m}' },
  dam: { mode: 'math', value: '\\operatorname{dam}' },
  hm: { mode: 'math', value: '\\operatorname{hm}' },
  km: { mode: 'math', value: '\\operatorname{km}' },
  mm2: { mode: 'math', value: '\\operatorname{mm}^2' },
  cm2: { mode: 'math', value: '\\operatorname{cm}^2' },
  dm2: { mode: 'math', value: '\\operatorname{dm}^2' },
  m2: { mode: 'math', value: '\\operatorname{m}^2' },
  dam2: { mode: 'math', value: '\\operatorname{dam}^2' },
  hm2: { mode: 'math', value: '\\operatorname{hm}^2' },
  km2: { mode: 'math', value: '\\operatorname{km}^2' },
  mm3: { mode: 'math', value: '\\operatorname{mm}^3' },
  cm3: { mode: 'math', value: '\\operatorname{cm}^3' },
  dm3: { mode: 'math', value: '\\operatorname{dm}^3' },
  m3: { mode: 'math', value: '\\operatorname{m}^3' },
  dam3: { mode: 'math', value: '\\operatorname{dam}^3' },
  hm3: { mode: 'math', value: '\\operatorname{hm}^3' },
  km3: { mode: 'math', value: '\\operatorname{km}^3' },
  a: { mode: 'math', value: '\\operatorname{a}' },
  ha: { mode: 'math', value: '\\operatorname{ha}' },
  '*': { mode: 'math', value: '\\times' },
  '.': { mode: 'math', value: ',' }
}
