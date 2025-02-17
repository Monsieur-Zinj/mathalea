import { shuffle } from '../../../lib/outils/arrayOutils'
import { range } from '../../../lib/outils/nombres'
import Exercice from '../../Exercice'
import { listeQuestionsToContenu, randint } from '../../../modules/outils.js'
import { fixeBordures, mathalea2d } from '../../../modules/2dGeneralites.js'
import { BoiteBuilder } from '../../../lib/2d/polygones.js'

export const titre = 'Compléter des patrons de solides'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '865e9'
export const ref = 'betaPatronSolide'
// Les exports suivants sont optionnels mais au moins la date de publication semble essentielle
export const dateDePublication = '16/04/2022' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag

/**
 * Pour l'instant on va faire les cubes et les parallélépipèdes rectangles
 * @author Jean-Claude Lhote
 * Référence
 */
/** type Cellule = { bordG, bordH } */

/** type Ligne = Cellule[] */
/** type Patron = Ligne[] */

class ModelePatrons {
  patrons

  constructor (a, b, c) {
    this.patrons = [
      [
        [
          { bordG: a, bordH: b }, { bordG: a, bordH: c }, { bordG: null, bordH: null }, {
            bordG: null,
            bordH: null
          }, { bordG: null, bordH: null }
        ],
        [
          { bordG: null, bordH: null }, { bordG: b, bordH: c }, { bordG: b, bordH: a }, {
            bordG: null,
            bordH: null
          }, { bordG: null, bordH: null }
        ],
        [
          { bordG: null, bordH: null }, { bordG: null, bordH: null }, { bordG: c, bordH: a }, {
            bordG: c,
            bordH: b
          }, { bordG: null, bordH: null }
        ]
      ],
      [
        [
          { bordG: null, bordH: null }, { bordG: null, bordH: null }, { bordG: c, bordH: a }, {
            bordG: null,
            bordH: null
          }, { bordG: null, bordH: null }
        ],
        [
          { bordG: b, bordH: a }, { bordG: b, bordH: c }, { bordG: b, bordH: a }, {
            bordG: b,
            bordH: c
          }, { bordG: null, bordH: null }
        ],
        [
          { bordG: null, bordH: null }, { bordG: a, bordH: c }, { bordG: null, bordH: null }, {
            bordG: null,
            bordH: null
          }, { bordG: null, bordH: null }
        ]
      ],
      [
        [
          { bordG: null, bordH: null }, { bordG: null, bordH: null }, { bordG: c, bordH: a }, {
            bordG: null,
            bordH: null
          }, { bordG: null, bordH: null }
        ],
        [
          { bordG: null, bordH: null }, { bordG: null, bordH: null }, { bordG: b, bordH: a }, {
            bordG: b,
            bordH: c
          }, { bordG: b, bordH: a }
        ],
        [
          { bordG: null, bordH: null }, { bordG: c, bordH: b }, { bordG: c, bordH: a }, {
            bordG: null,
            bordH: null
          }, { bordG: null, bordH: null }
        ]
      ],
      [
        [
          { bordG: null, bordH: null }, { bordG: c, bordH: b }, { bordG: c, bordH: a }, {
            bordG: null,
            bordH: null
          }, { bordG: null, bordH: null }
        ],
        [
          { bordG: null, bordH: null }, { bordG: null, bordH: null }, { bordG: b, bordH: a }, {
            bordG: b,
            bordH: c
          }, { bordG: b, bordH: a }
        ],
        [
          { bordG: null, bordH: null }, { bordG: null, bordH: null }, { bordG: null, bordH: null }, {
            bordG: a,
            bordH: c
          }, { bordG: null, bordH: null }
        ]
      ],
      [
        [
          { bordG: null, bordH: null }, { bordG: null, bordH: null }, { bordG: c, bordH: a }, {
            bordG: null,
            bordH: null
          }, { bordG: null, bordH: null }
        ],
        [
          { bordG: null, bordH: null }, { bordG: b, bordH: c }, { bordG: b, bordH: a }, {
            bordG: b,
            bordH: c
          }, { bordG: b, bordH: a }
        ],
        [
          { bordG: null, bordH: null }, { bordG: null, bordH: null }, { bordG: c, bordH: a }, {
            bordG: null,
            bordH: null
          }, { bordG: null, bordH: null }
        ]
      ],
      [
        [
          { bordG: null, bordH: null }, { bordG: a, bordH: c }, { bordG: null, bordH: null }, {
            bordG: null,
            bordH: null
          }, { bordG: null, bordH: null }
        ],
        [
          { bordG: null, bordH: null }, { bordG: b, bordH: c }, { bordG: b, bordH: a }, {
            bordG: b,
            bordH: c
          }, { bordG: b, bordH: a }
        ],
        [
          { bordG: null, bordH: null }, { bordG: a, bordH: c }, { bordG: null, bordH: null }, {
            bordG: null,
            bordH: null
          }, { bordG: null, bordH: null }
        ]
      ],
      [
        [
          { bordG: null, bordH: null }, { bordG: a, bordH: c }, { bordG: null, bordH: null }, {
            bordG: null,
            bordH: null
          }, { bordG: null, bordH: null }
        ],
        [
          { bordG: null, bordH: null }, { bordG: b, bordH: c }, { bordG: b, bordH: a }, {
            bordG: b,
            bordH: c
          }, { bordG: b, bordH: a }
        ],
        [
          { bordG: null, bordH: null }, { bordG: null, bordH: null }, { bordG: c, bordH: a }, {
            bordG: null,
            bordH: null
          }, { bordG: null, bordH: null }
        ]
      ],
      [
        [
          { bordG: null, bordH: null }, { bordG: null, bordH: null }, { bordG: null, bordH: null }, {
            bordG: a,
            bordH: c
          }, { bordG: null, bordH: null }
        ],
        [
          { bordG: null, bordH: null }, { bordG: b, bordH: c }, { bordG: b, bordH: a }, {
            bordG: b,
            bordH: c
          }, { bordG: b, bordH: a }
        ],
        [
          { bordG: null, bordH: null }, { bordG: a, bordH: c }, { bordG: null, bordH: null }, {
            bordG: null,
            bordH: null
          }, { bordG: null, bordH: null }
        ]
      ],
      [
        [
          { bordG: null, bordH: null }, { bordG: c, bordH: b }, { bordG: c, bordH: a }, {
            bordG: null,
            bordH: null
          }, { bordG: null, bordH: null }
        ],
        [
          { bordG: null, bordH: null }, { bordG: null, bordH: null }, { bordG: b, bordH: a }, {
            bordG: b,
            bordH: c
          }, { bordG: b, bordH: a }
        ],
        [
          { bordG: null, bordH: null }, { bordG: null, bordH: null }, { bordG: null, bordH: null }, {
            bordG: null,
            bordH: null
          }, { bordG: c, bordH: a }
        ]
      ],
      [
        [
          { bordG: null, bordH: null }, { bordG: null, bordH: null }, { bordG: null, bordH: null }, {
            bordG: null,
            bordH: null
          }, { bordG: null, bordH: null }
        ],
        [
          { bordG: b, bordH: a }, { bordG: b, bordH: c }, { bordG: b, bordH: a }, {
            bordG: null,
            bordH: null
          }, { bordG: null, bordH: null }
        ],
        [
          { bordG: null, bordH: null }, { bordG: null, bordH: null }, { bordG: c, bordH: a }, {
            bordG: c,
            bordH: b
          }, { bordG: c, bordH: a }
        ]
      ],
      [
        [
          { bordG: null, bordH: null }, { bordG: null, bordH: null }, { bordG: null, bordH: null }, {
            bordG: null,
            bordH: null
          }, { bordG: c, bordH: a }
        ],
        [
          { bordG: null, bordH: null }, { bordG: b, bordH: c }, { bordG: b, bordH: a }, {
            bordG: b,
            bordH: c
          }, { bordG: b, bordH: a }
        ],
        [
          { bordG: null, bordH: null }, { bordG: a, bordH: c }, { bordG: null, bordH: null }, {
            bordG: null,
            bordH: null
          }, { bordG: null, bordH: null }
        ]
      ]
    ]
  }
}

class FauxPatrons {
  constructor (a, b, c) {
    this.erzatz = [
      {
        patron: [
          [
            { bordG: c, bordH: a }, { bordG: null, bordH: null }, { bordG: null, bordH: null }, {
              bordG: a,
              bordH: c
            }, { bordG: null, bordH: null }
          ],
          [
            { bordG: b, bordH: a }, { bordG: b, bordH: c }, { bordG: b, bordH: a }, {
              bordG: b,
              bordH: c
            }, { bordG: null, bordH: null }
          ],
          [
            { bordG: null, bordH: null }, { bordG: null, bordH: null }, {
              bordG: null,
              bordH: null
            }, { bordG: null, bordH: null }, { bordG: null, bordH: null }
          ]
        ],
        fauxCube: true, // est un faux patron même si a=b=c
        collision: [[0, 0], [0, 3]] // Les faces [0,0] et [0,3] sont les mêmes
      },
      {
        patron: [
          [
            { bordG: null, bordH: null }, { bordG: null, bordH: null }, { bordG: c, bordH: a }, {
              bordG: null,
              bordH: null
            }, { bordG: null, bordH: null }
          ],
          [
            { bordG: null, bordH: null }, { bordG: b, bordH: c }, { bordG: b, bordH: a }, {
              bordG: b,
              bordH: c
            }, { bordG: null, bordH: null }
          ],
          [
            { bordG: null, bordH: null }, { bordG: null, bordH: null }, { bordG: c, bordH: a }, {
              bordG: null,
              bordH: null
            }, { bordG: null, bordH: null }
          ]
        ],
        fauxCube: true, // est un faux patron même si a=b=c
        collision: [[1, 2], [null, null]] // il n'y a pas de collision, il manque la face opposée à la face [1,2]
      },
      {
        patron: [
          [
            { bordG: null, bordH: null }, { bordG: null, bordH: null }, {
              bordG: null,
              bordH: null
            }, { bordG: null, bordH: null }, { bordG: null, bordH: null }
          ],
          [
            { bordG: b, bordH: a }, { bordG: b, bordH: c }, { bordG: b, bordH: a }, {
              bordG: b,
              bordH: c
            }, { bordG: null, bordH: null }
          ],
          [
            { bordG: null, bordH: null }, { bordG: a, bordH: c }, { bordG: null, bordH: null }, {
              bordG: a,
              bordH: c
            }, { bordG: null, bordH: null }
          ]
        ],
        fauxCube: true,
        collision: [[2, 1], [2, 3]]
      },
      {
        patron: [
          [
            { bordG: null, bordH: null }, { bordG: null, bordH: null }, {
              bordG: null,
              bordH: null
            }, { bordG: null, bordH: null }, { bordG: null, bordH: null }
          ],
          [
            { bordG: b, bordH: a }, { bordG: b, bordH: c }, { bordG: b, bordH: a }, {
              bordG: b,
              bordH: c
            }, { bordG: null, bordH: null }
          ],
          [
            { bordG: c, bordH: a }, { bordG: null, bordH: null }, { bordG: null, bordH: null }, {
              bordG: a,
              bordH: c
            }, { bordG: null, bordH: null }
          ]
        ],
        fauxCube: true,
        collision: [[2, 0], [2, 3]]
      },
      {
        patron: [
          [
            { bordG: a, bordH: b }, { bordG: a, bordH: c }, { bordG: null, bordH: null }, {
              bordG: a,
              bordH: c
            }, { bordG: null, bordH: null }
          ],
          [
            { bordG: null, bordH: null }, { bordG: b, bordH: c }, { bordG: b, bordH: a }, {
              bordG: b,
              bordH: c
            }, { bordG: null, bordH: null }
          ],
          [
            { bordG: null, bordH: null }, { bordG: null, bordH: null }, {
              bordG: null,
              bordH: null
            }, { bordG: null, bordH: null }, { bordG: null, bordH: null }
          ]
        ],
        fauxCube: true,
        collision: [[0, 1], [0, 3]]
      },
      {
        patron: [
          [
            { bordG: null, bordH: null }, { bordG: null, bordH: null }, { bordG: c, bordH: a }, {
              bordG: null,
              bordH: null
            }, { bordG: null, bordH: null }
          ],
          [
            { bordG: b, bordH: c }, { bordG: b, bordH: a }, { bordG: b, bordH: a }, {
              bordG: b,
              bordH: c
            }, { bordG: null, bordH: null }
          ],
          [
            { bordG: null, bordH: null }, { bordG: null, bordH: null }, { bordG: c, bordH: a }, {
              bordG: null,
              bordH: null
            }, { bordG: null, bordH: null }
          ]
        ],
        fauxCube: false, // Si a===c, c'est bien un patron de pave, il n'est faux que si c!==a (il faudra éviter ce cas pour les pavés)
        collision: [[1, 1], [1, 2]]
      }
    ]
  }
}

export default class PatronsSolides extends Exercice {
  constructor () {
    super()
    this.sup = '1-2-3'
    this.nbQuestions = 3
    this.besoinFormulaireTexte = ['Trois dimensions du parallélépipède rectangle séparés par des tirets']
  }

  nouvelleVersion () {
    this.listeQuestions = []
    this.listeCorrections = []

    function formateGrille (modele) {
      const largeurs = []
      for (let x = 0, xMax; x < 5; x++) {
        xMax = 0
        for (let y = 0; y < 3; y++) {
          xMax = Math.max(xMax, modele[y][x].bordH || 0)
        }
        largeurs[x] = xMax
      }
      const hauteurs = []
      for (let y = 0, yMax; y < 3; y++) {
        yMax = 0
        for (let x = 0; x < 5; x++) {
          yMax = Math.max(yMax, modele[y][x].bordG || 0)
        }
        hauteurs[y] = yMax
      }
      return [largeurs, hauteurs]
    }

    function dessinePatron (modele) {
      const forme = []
      const [largeurs, hauteurs] = formateGrille(modele)
      for (let x = 0, xOffset = 0; x < 5; x++) {
        if (largeurs[x] !== 0) {
          for (let y = 0, yOffset = 0; y < 3; y++) {
            if (hauteurs[y] !== 0) {
              if (modele[y][x].bordG) {
                forme.push(new BoiteBuilder({
                  xMin: xOffset,
                  yMin: yOffset,
                  xMax: xOffset + largeurs[x],
                  yMax: yOffset + hauteurs[y]
                }).render())
              }
              yOffset += hauteurs[y]
            }
          }
          xOffset += largeurs[x]
        }
      }
      return forme
    }

    const dimensions = this.sup.split('-')
    const [a, b, c] = [parseInt(dimensions[0]), parseInt(dimensions[1]), parseInt(dimensions[2])]
    for (let i = 0; i < this.nbQuestions; i++) {
      /*  const a = randint(1, 5)
                                            const b = randint(1, 5, a)
                                            const c = randint(1, 5, [a, b])
                                            */
      const mesModeles = new ModelePatrons(a, b, c)
      const mesFaux = new FauxPatrons(a, b, c)
      const nombreDeFaux = randint(1, 3)
      const nombreDeVrais = 5 - nombreDeFaux
      const vraisPatronsNumeros = shuffle(range(10)).slice(0, nombreDeVrais)
      const fauxPatronsNumeros = shuffle(range(5)).slice(0, nombreDeFaux)
      let propositions = []
      for (const indice of vraisPatronsNumeros) {
        propositions.push({ patron: dessinePatron(mesModeles.patrons[indice]), trueOrfalse: true })
      }
      for (const indice of fauxPatronsNumeros) {
        propositions.push({ patron: dessinePatron(mesFaux.erzatz[indice].patron), trueOrfalse: false })
      }
      propositions = shuffle(propositions)
      let texte = ''
      for (const proposition of propositions) {
        texte += mathalea2d(Object.assign(fixeBordures(proposition.patron), { style: 'display: inline' }), proposition.patron)
      }
      this.listeQuestions.push(texte)
      this.listeCorrections.push('')
    }
    listeQuestionsToContenu(this)
  }
}
