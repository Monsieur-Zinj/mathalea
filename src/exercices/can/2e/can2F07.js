import { ajouteChampTexteMathLive } from '../../../lib/interactif/questionMathLive.js'
import { tableauDeVariation } from '../../../lib/mathFonctions/etudeFonction.js'
import { choice } from '../../../lib/outils/arrayOutils'

import { context } from '../../../modules/context.js'
import { listeQuestionsToContenu, randint } from '../../../modules/outils.js'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import Exercice from '../../deprecatedExercice.js'
import { setReponse } from '../../../lib/interactif/gestionInteractif'

export const titre = 'Lire les extremums dans un tableau de variations'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'

// Les exports suivants sont optionnels mais au moins la date de publication semble essentielle
export const dateDePublication = '21/12/2021' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag
export const dateDeModifImportante = '24/10/2021' // Une date de modification importante au format 'jj/mm/aaaa' pour affichage temporaire d'un tag

/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
 */
export const uuid = 'd5b6c'
export const ref = 'can2F07'
export const refs = {
  'fr-fr': ['can2F07'],
  'fr-ch': []
}
export default function ExtremumsTableau () {
  Exercice.call(this)
  this.nbQuestions = 1
  this.formatChampTexte = ''
  this.tailleDiaporama = 2
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne

  this.nouvelleVersion = function () {
    let texte, texteCorr, ligne1
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      const x1 = randint(-20, 10)
      const x2 = randint(x1 + 1, 15)
      const x3 = randint(x2 + 1, 20)
      const x4 = randint(x3 + 1, 25)
      const y1 = randint(-10, 10)
      const y2 = randint(y1 - 10, y1 - 1)
      const y3 = randint(y2 + 1, y2 + 10, y1)
      const y4 = randint(y3 - 10, y3 - 1, y2)
      const M = Math.max(y1, y2, y3, y4)
      const m = Math.min(y1, y2, y3, y4)
      const choix = randint(1, 2)
      if (choix === 1) {
        ligne1 = ['Var', 10, `+/$${y1}$`, 10, `-/$${y2}$`, 10, `+/$${y3}$`, 10, `-/$${y4}$`, 10]
      } else {
        ligne1 = ['Var', 10, `-/$${-y1}$`, 10, `+/$${-y2}$`, 10, `-/$${-y3}$`, 10, `+/$${-y4}$`, 10]
      }

      texte = `Voici le tableau de variations d'une fonction $f$ définie sur $[${x1}\\,;\\,${x4}]$ :<br>
      `

      texte += tableauDeVariation({
        tabInit: [
          [
            // Première colonne du tableau avec le format [chaine d'entête, hauteur de ligne, nombre de pixels de largeur estimée du texte pour le centrage]
            ['$x$', 2, 10], ['$f(x)$', 4, 30]
          ],
          // Première ligne du tableau avec chaque antécédent suivi de son nombre de pixels de largeur estimée du texte pour le centrage
          [`$${x1}$`, 10, `$${x2}$`, 10, `$${x3}$`, 10, `$${x4}$`, 10]
        ],
        // tabLines ci-dessous contient les autres lignes du tableau.
        tabLines: [ligne1],
        colorBackground: '',
        espcl: 3, // taille en cm entre deux antécédents
        deltacl: 1, // distance entre la bordure et les premiers et derniers antécédents
        lgt: 2, // taille de la première colonne en cm
        scale: context.isHtml ? 1 : 0.4// ceci est l'échelle du texte
      }) + '<br>'
      this.canEnonce = texte
      if (choice([true, false])) {
        texte += '   Le maximum de $f$ est  : '
        texte += ajouteChampTexteMathLive(this, 2 * i, '')
        texte += '<br> Il est atteint en $x=$ '
        texte += ajouteChampTexteMathLive(this, 2 * i + 1, '')
        // this.canEnonce += 'Déterminer le maximum de $f$ et la valeur en laquelle il est atteint.'
        this.canReponseACompleter = `Le maximum de $f$ est $\\ldots$. <br>
        Il est atteint en $x=\\ldots$`
        if (choix === 1) {
          if (M === y1) {
            texteCorr = `Pour tout réel $x$ de $[${x1}\\,;\\,${x4}]$, on a  $f(x)\\leqslant ${y1}$, c'est-à-dire  $f(x)\\leqslant f(${x1})$.<br>
      Ainsi, le maximum de $f$ est $${miseEnEvidence(y1)}$.<br>Il est atteint en $x=${miseEnEvidence(x1)}$.`

            if (!context.isAmc) {
              setReponse(this, 2 * i, y1)
              setReponse(this, 2 * i + 1, x1)
            } else {
              this.autoCorrection[i] = {
                enonce: texte,
                propositions: [
                  {
                    type: 'AMCNum',
                    propositions: [
                      {
                        texte: texteCorr,
                        reponse: {
                          texte: 'Maximum',
                          valeur: [y1],
                          param: {
                            digits: 2,
                            signe: true,
                            decimals: 0
                          }
                        }
                      }
                    ]
                  },
                  {
                    type: 'AMCNum',
                    propositions: [
                      {
                        texte: '',
                        reponse: {
                          texte: 'Antécédent',
                          valeur: [x1],
                          param: {
                            digits: 2,
                            signe: true,
                            decimals: 0
                          }
                        }
                      }
                    ]
                  }
                ]
              }
            }
          } else {
            texteCorr = `Pour tout réel $x$ de $[${x1}\\,;\\,${x4}]$, on a  $f(x)\\leqslant ${y3}$, c'est-à-dire  $f(x)\\leqslant f(${x3})$.<br>
      Ainsi, le maximum de $f$ est $${miseEnEvidence(y3)}$.<br>Il est atteint en $x=${miseEnEvidence(x3)}$.  `

            if (!context.isAmc) {
              setReponse(this, 2 * i, y3)
              setReponse(this, 2 * i + 1, x3)
            } else {
              this.autoCorrection[i] = {
                enonce: texte,
                propositions: [
                  {
                    type: 'AMCNum',
                    propositions: [
                      {
                        texte: texteCorr,
                        reponse: {
                          texte: 'Maximum',
                          valeur: [y3],
                          param: {
                            digits: 2,
                            signe: true,
                            decimals: 0
                          }
                        }
                      }
                    ]
                  },
                  {
                    type: 'AMCNum',
                    propositions: [
                      {
                        texte: '',
                        reponse: {
                          texte: 'Antécédent',
                          valeur: [x3],
                          param: {
                            digits: 2,
                            signe: true,
                            decimals: 0
                          }
                        }
                      }
                    ]
                  }
                ]
              }
            }
          }
        } else {
          if (m === y2) {
            texteCorr = `Pour tout réel $x$ de $[${x1}\\,;\\,${x4}]$, on a  $f(x)\\leqslant ${-y2}$, c'est-à-dire  $f(x)\\leqslant f(${x2})$.<br>
        Ainsi, le maximum de $f$ est $${miseEnEvidence(-y2)}$.<br>Il est atteint en $x=${miseEnEvidence(x2)}$. `
            if (!context.isAmc) {
              setReponse(this, 2 * i, -y2)
              setReponse(this, 2 * i + 1, x2)
            } else {
              this.autoCorrection[i] = {
                enonce: texte,
                propositions: [
                  {
                    type: 'AMCNum',
                    propositions: [
                      {
                        texte: texteCorr,
                        reponse: {
                          texte: 'Maximum',
                          valeur: [-y2],
                          param: {
                            digits: 2,
                            signe: true,
                            decimals: 0
                          }
                        }
                      }
                    ]
                  },
                  {
                    type: 'AMCNum',
                    propositions: [
                      {
                        texte: '',
                        reponse: {
                          texte: 'Antécédent',
                          valeur: [x2],
                          param: {
                            digits: 2,
                            signe: true,
                            decimals: 0
                          }
                        }
                      }
                    ]
                  }
                ]
              }
            }
          } else {
            texteCorr = `Pour tout réel $x$ de $[${x1}\\,;\\,${x4}]$, on a  $f(x)\\leqslant ${-y4}$, c'est-à-dire  $f(x)\\leqslant f(${x4})$.<br>
        Ainsi, le maximum de $f$ est $${miseEnEvidence(-y4)}$.<br>Il est atteint en $x=${miseEnEvidence(x4)}$.  `
            if (!context.isAmc) {
              setReponse(this, 2 * i, -y4)
              setReponse(this, 2 * i + 1, x4)
            } else {
              this.autoCorrection[i] = {
                enonce: texte,
                propositions: [
                  {
                    type: 'AMCNum',
                    propositions: [
                      {
                        texte: texteCorr,
                        reponse: {
                          texte: 'Maximum',
                          valeur: [-y4],
                          param: {
                            digits: 2,
                            signe: true,
                            decimals: 0
                          }
                        }
                      }
                    ]
                  },
                  {
                    type: 'AMCNum',
                    propositions: [
                      {
                        texte: '',
                        reponse: {
                          texte: 'Antécédent',
                          valeur: [x4],
                          param: {
                            digits: 2,
                            signe: true,
                            decimals: 0
                          }
                        }
                      }
                    ]
                  }
                ]
              }
            }
          }
        }
      } else {
        texte += 'Le minimum de $f$ est  : '
        // this.canEnonce += 'Déterminer le minimum de $f$ et la valeur en laquelle il est atteint.'
        // this.canReponseACompleter = 'Min $=\\ldots$ atteint en $x=\\ldots$'
        this.canReponseACompleter = `Le minimum de $f$ est $\\ldots$. <br>
        Il est atteint en $x=\\ldots$`
        texte += ajouteChampTexteMathLive(this, 2 * i, '')
        texte += '<br> Il est atteint en $x=$ '

        texte += ajouteChampTexteMathLive(this, 2 * i + 1, '')

        if (choix === 1) {
          if (m === y2) {
            texteCorr = `Pour tout réel $x$ de $[${x1}\\,;\\,${x4}]$, on a  $f(x)\\geqslant ${y2}$, c'est-à-dire  $f(x)\\geqslant f(${x2})$.<br>
          Ainsi, le minimum de $f$ est $${miseEnEvidence(y2)}$.<br>Il est atteint en $x=${miseEnEvidence(x2)}$.`
            if (!context.isAmc) {
              setReponse(this, 2 * i, y2)
              setReponse(this, 2 * i + 1, x2)
            } else {
              this.autoCorrection[i] = {
                enonce: texte,
                propositions: [
                  {
                    type: 'AMCNum',
                    propositions: [
                      {
                        texte: texteCorr,
                        reponse: {
                          texte: 'Minimum',
                          valeur: [y2],
                          param: {
                            digits: 2,
                            signe: true,
                            decimals: 0
                          }
                        }
                      }
                    ]
                  },
                  {
                    type: 'AMCNum',
                    propositions: [
                      {
                        texte: '',
                        reponse: {
                          texte: 'Antécédent',
                          valeur: [x2],
                          param: {
                            digits: 2,
                            signe: true,
                            decimals: 0
                          }
                        }
                      }
                    ]
                  }
                ]
              }
            }
          } else {
            texteCorr = `Pour tout réel $x$ de $[${x1}\\,;\\,${x4}]$, on a  $f(x)\\geqslant ${y4}$, c'est-à-dire  $f(x)\\geqslant f(${x4})$.<br>
          Ainsi, le minimum de $f$ est $${miseEnEvidence(y4)}$.<br>Il est atteint en $x=${miseEnEvidence(x4)}$.  `
            if (!context.isAmc) {
              setReponse(this, 2 * i, y4)
              setReponse(this, 2 * i + 1, x4)
            } else {
              this.autoCorrection[i] = {
                enonce: texte,
                propositions: [
                  {
                    type: 'AMCNum',
                    propositions: [
                      {
                        texte: texteCorr,
                        reponse: {
                          texte: 'Minimum',
                          valeur: [y4],
                          param: {
                            digits: 2,
                            signe: true,
                            decimals: 0
                          }
                        }
                      }
                    ]
                  },
                  {
                    type: 'AMCNum',
                    propositions: [
                      {
                        texte: '',
                        reponse: {
                          texte: 'Antécédent',
                          valeur: [x4],
                          param: {
                            digits: 2,
                            signe: true,
                            decimals: 0
                          }
                        }
                      }
                    ]
                  }
                ]
              }
            }
          }
        } else {
          if (M === y1) {
            texteCorr = `Pour tout réel $x$ de $[${x1}\\,;\\,${x4}]$, on a  $f(x)\\geqslant ${-y1}$, c'est-à-dire  $f(x)\\geqslant f(${x1})$.<br>
          Ainsi, le minimum de $f$ est $${miseEnEvidence(-y1)}$.<br>Il est atteint en $x=${miseEnEvidence(x1)}$. `
            if (!context.isAmc) {
              setReponse(this, 2 * i, -y1)
              setReponse(this, 2 * i + 1, x1)
            } else {
              this.autoCorrection[i] = {
                enonce: texte,
                propositions: [
                  {
                    type: 'AMCNum',
                    propositions: [
                      {
                        texte: texteCorr,
                        reponse: {
                          texte: 'Minimum',
                          valeur: [-y1],
                          param: {
                            digits: 2,
                            signe: true,
                            decimals: 0
                          }
                        }
                      }
                    ]
                  },
                  {
                    type: 'AMCNum',
                    propositions: [
                      {
                        texte: '',
                        reponse: {
                          texte: 'Antécédent',
                          valeur: [x1],
                          param: {
                            digits: 2,
                            signe: true,
                            decimals: 0
                          }
                        }
                      }
                    ]
                  }
                ]
              }
            }
          } else {
            texteCorr = `Pour tout réel $x$ de $[${x1}\\,;\\,${x4}]$, on a  $f(x)\\geqslant ${-y3}$, c'est-à-dire  $f(x)\\geqslant f(${x3})$.<br>
          Ainsi, le minimum de $f$ est $${miseEnEvidence(-y3)}$.<br>Il est atteint en $x=${miseEnEvidence(x3)}$.  `
            if (!context.isAmc) {
              setReponse(this, 2 * i, -y3)
              setReponse(this, 2 * i + 1, x3)
            } else {
              this.autoCorrection[i] = {
                enonce: texte,
                propositions: [
                  {
                    type: 'AMCNum',
                    propositions: [
                      {
                        texte: texteCorr,
                        reponse: {
                          texte: 'Minimum',
                          valeur: [-y3],
                          param: {
                            digits: 2,
                            signe: true,
                            decimals: 0
                          }
                        }
                      }
                    ]
                  },
                  {
                    type: 'AMCNum',
                    propositions: [
                      {
                        texte: '',
                        reponse: {
                          texte: 'Antécédent',
                          valeur: [x3],
                          param: {
                            digits: 2,
                            signe: true,
                            decimals: 0
                          }
                        }
                      }
                    ]
                  }
                ]
              }
            }
          }
        }
      }
      if (this.questionJamaisPosee(i, x1, x2, x3, x4)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        this.listeCanEnonces.push(this.canEnonce)
        this.listeCanReponsesACompleter.push(this.canReponseACompleter)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
