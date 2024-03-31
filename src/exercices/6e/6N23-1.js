import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { context } from '../../modules/context.js'
import { fraction } from '../../modules/fractions.js'
import { remplisLesBlancs } from '../../lib/interactif/questionMathLive.js'

import { handleAnswers } from '../../lib/interactif/gestionInteractif.js'
import { arrondi } from '../../lib/outils/nombres'

export const titre = 'Donner différentes écritures de nombres décimaux'
export const amcReady = true
export const amcType = 'AMCHybride'
export const interactifReady = true
export const interactifType = 'mathLive'

export const dateDeModifImportante = '21/12/2023'

function texFraction (numerateur, denominateur) {
  return `\\dfrac{${numerateur}}{${denominateur}}`
}

/**
 * Compléter des égalités sur les nombres décimaux
 * * 1) n/100 = ...+.../10 + .../100
 * * 2) n/100 = ...+.../100 + .../10
 * * 3).../100 = u + d/10 + c/100
 * * 4) u = .../10
 * * 5) u = .../100
 * * 6) n/10 = ... + .../10 + .../100
 * * 7) .../100 = u + d/10
 * @author Rémi Angot
 * 6N23-1
 */
export const uuid = '1acf7'
export const ref = '6N23-1'
export const refs = {
  'fr-fr': ['6N23-1'],
  'fr-ch': ['9NO10-11']
}
export default function ExerciceDifferentesEcrituresNombresDecimaux () {
  Exercice.call(this)
  this.consigne = 'Compléter les égalités avec une fraction décimale, la décomposition canonique puis l’écriture décimale.'
  this.spacing = 2
  this.spacingCorr = 2
  this.nbCols = 2
  this.nbColsCorr = 2
  this.sup = '1-2-3' // Type de question

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    let typesDeQuestions
    const listeTypeDeQuestions = gestionnaireFormulaireTexte({
      max: 7,
      defaut: 8,
      melange: 8,
      nbQuestions: this.nbQuestions,
      saisie: this.sup
    })

    for (let i = 0, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50; cpt++) {
      typesDeQuestions = listeTypeDeQuestions[i]
      const u = (typesDeQuestions >= 4 && typesDeQuestions <= 5) ? randint(2, 19) : randint(2, 9) // chiffre des unités
      const d = (typesDeQuestions >= 4 && typesDeQuestions <= 5) ? 0 : randint(1, 9) // chiffre des dixièmes
      const c = ((typesDeQuestions >= 4 && typesDeQuestions <= 5) || typesDeQuestions === 7) ? 0 : randint(1, 9) // chiffre des centièmes
      const n = 100 * u + 10 * d + c
      if (!this.questionJamaisPosee(i, u, d, c)) {
        // Si la question a été posée, on passe
        // et pas la fin de la boucle à cause de indexQ++
        continue
      }
      let ecritureDecimale
      switch (typesDeQuestions) {
        case 1: // n/100 = .... + .../10 + .../100=...
          ecritureDecimale = texNombre(arrondi(u + d / 10 + c / 100, 2))
          texteCorr = `$${fraction(n, 100).texFraction}=${u}+${fraction(d, 10).texFraction}+${fraction(c, 100).texFraction}=${ecritureDecimale}$`
          if (this.interactif && !context.isAmc) {
            const content = `${fraction(n, 100).texFraction}~=~ %{champ1} + \\dfrac{%{champ2}}{10} + \\dfrac{%{champ3}}{100}~=~%{champ4}`
            texte = remplisLesBlancs(this, i, content)
            handleAnswers(this, i, {
              bareme: (listePoints) => [listePoints[0] * listePoints[1] * listePoints[2] + listePoints[3], 2],
              champ1: { value: u },
              champ2: { value: d },
              champ3: { value: c },
              champ4: { value: arrondi(u + d / 10 + c / 100, 2) }
            },
            { formatInteractif: 'mathlive' }
            )
          } else {
            texte = `$${fraction(n, 100).texFraction}=${context.isAmc ? 'a' : '\\ldots\\ldots'}+${texFraction(context.isAmc ? 'b' : '\\ldots\\ldots', '10')}+${texFraction(context.isAmc ? 'c' : '\\ldots\\ldots', '100')}=${context.isAmc ? 'd' : '\\ldots\\ldots'}$`
            texteCorr = `$${fraction(n, 100).texFraction}=${u}+${texFraction(d, '10')}+${texFraction(c, '100')}=${ecritureDecimale}$`
            this.autoCorrection[i] = {
              enonceAvant: false,
              options: { multicols: true },
              propositions: [
                {
                  type: 'AMCNum',
                  propositions: [
                    {
                      texte: texteCorr,
                      reponse: {
                        texte: texte + '<br>a',
                        valeur: u,
                        param: {
                          signe: false,
                          digits: 1,
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
                        texte: 'b',
                        valeur: d,
                        param: {
                          signe: false,
                          digits: 1,
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
                        texte: 'c',
                        valeur: c,
                        param: {
                          signe: false,
                          digits: 1,
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
                        texte: 'd',
                        valeur: arrondi(u + d / 10 + c / 100, 2),
                        param: {
                          signe: false,
                          digits: 5,
                          decimals: 3
                        }
                      }
                    }
                  ]
                }
              ]
            }
          }
          break
        case 2: // n/100 = ... + .../100 + .../10
          ecritureDecimale = texNombre(arrondi(u + d / 10 + c / 100, 2))
          texteCorr = `$${texFraction(n, '100')}=${u}+${texFraction(
                        c,
                        100
                    )}+${texFraction(d, 10)}=${ecritureDecimale}$`
          if (this.interactif && !context.isAmc) {
            const content = `${fraction(n, 100).texFraction}~=~ %{champ1} + \\dfrac{%{champ2}}{100} + \\dfrac{%{champ3}}{10}~=~%{champ4}`
            texte = remplisLesBlancs(this, i, content)
            handleAnswers(this, i, {
              bareme: (listePoints) => [listePoints[0] * listePoints[1] * listePoints[2] + listePoints[3], 2],
              champ1: { value: u },
              champ3: { value: d },
              champ2: { value: c },
              champ4: { value: arrondi(u + d / 10 + c / 100, 2) }
            },
            { formatInteractif: 'mathlive' }
            )
          } else {
            texte = `$${texFraction(n, '100')}=${context.isAmc ? 'a' : '\\ldots\\ldots'}+${texFraction(
                            context.isAmc ? 'b' : '\\ldots\\ldots',
                            100
                        )}+${texFraction(context.isAmc ? 'c' : '\\ldots\\ldots', 10)}=${context.isAmc ? 'd' : '\\ldots\\ldots'}$`
            this.autoCorrection[i] = {
              options: { multicols: true },
              enonceAvant: false,
              propositions: [
                {
                  type: 'AMCNum',
                  propositions: [
                    {
                      texte: texteCorr,
                      reponse: {
                        texte: texte + '<br>a',
                        valeur: u,
                        param: {
                          signe: false,
                          digits: 1,
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
                        texte: 'b',
                        valeur: c,
                        param: {
                          signe: false,
                          digits: 1,
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
                        texte: 'c',
                        valeur: d,
                        param: {
                          signe: false,
                          digits: 1,
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
                        texte: 'd',
                        valeur: arrondi(u + d / 10 + c / 100, 2),
                        param: {
                          signe: false,
                          digits: 5,
                          decimals: 3
                        }
                      }
                    }
                  ]
                }
              ]
            }
          }

          break
        case 3: // .../... = u + d/10 + c/100=...
          ecritureDecimale = texNombre(arrondi(u + d / 10 + c / 100, 2))
          texteCorr = `$${texFraction(n, '100')}=${u}+${texFraction(
                        d,
                        '10'
                    )}+${texFraction(c, '100')}=${ecritureDecimale}$`
          if (this.interactif && !context.isAmc) {
            const content = `\\dfrac{%{champ1}}{%{champ2}}~=~ ${u} + \\dfrac{${d}}{10} + \\dfrac{${c}}{100}~=~%{champ3}`
            texte = remplisLesBlancs(this, i, content)
            handleAnswers(this, i, {
              bareme: (listePoints) => [listePoints[0] * listePoints[1] + listePoints[2], 2],
              champ1: { value: n },
              champ2: { value: 100 },
              champ3: { value: arrondi(u + d / 10 + c / 100, 2) }
            },
            { formatInteractif: 'mathlive' }
            )
          } else {
            texte = `$${texFraction(context.isAmc ? 'a' : '\\ldots\\ldots', '100')}=${u}+${texFraction(
                            d,
                            '10'
                        )}+${texFraction(c, '100')}=${context.isAmc ? 'b' : '\\ldots\\ldots'}$`
            this.autoCorrection[i] = {
              options: { multicols: true },
              enonceAvant: false,
              propositions: [
                {
                  type: 'AMCNum',
                  propositions: [
                    {
                      texte: texteCorr,
                      reponse: {
                        texte: texte + '<br>a',
                        valeur: n,
                        param: {
                          signe: false,
                          digits: 4,
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
                        texte: 'b',
                        valeur: arrondi(u + d / 10 + c / 100, 2),
                        param: {
                          signe: false,
                          digits: 5,
                          decimals: 3
                        }
                      }
                    }
                  ]
                }
              ]
            }
          }
          break
        case 4: // u = .../10
          texteCorr = `$${u}=${texFraction(10 * u, '10')}$`
          if (this.interactif && !context.isAmc) {
            const content = `${u}~=~\\dfrac{%{champ1}}{10}`
            texte = remplisLesBlancs(this, i, content)
            handleAnswers(this, i, {
              bareme: (listePoints) => [listePoints[0] * 2, 2],
              champ1: { value: u * 10 }
            },
            { formatInteractif: 'mathlive' }
            )
          } else {
            texte = `$${u}=${texFraction(context.isAmc ? 'a' : '\\ldots\\ldots', '10')}$`
            this.autoCorrection[i] = {
              enonceAvant: false,
              propositions: [
                {
                  type: 'AMCNum',
                  propositions: [
                    {
                      texte: texteCorr,
                      reponse: {
                        texte: texte + '<br>a',
                        valeur: arrondi(10 * u, 2),
                        param: {
                          signe: false,
                          digits: 3,
                          decimals: 0
                        }
                      }
                    }
                  ]
                }
              ]
            }
          }

          break
        case 5: // u = .../100
          texteCorr = `$${u}=${texFraction(100 * u, '100')}$`
          if (this.interactif && !context.isAmc) {
            const content = `${u}~=~\\dfrac{%{champ1}}{100}`
            texte = remplisLesBlancs(this, i, content)
            handleAnswers(this, i, {
              bareme: (listePoints) => [listePoints[0] * 2, 2],
              champ1: { value: u * 100 }
            },
            { formatInteractif: 'mathlive' }
            )
          } else {
            texte = `$${u}=${texFraction(context.isAmc ? 'a' : '\\ldots\\ldots', '100')}$`
            this.autoCorrection[i] = {
              enonceAvant: false,
              propositions: [
                {
                  type: 'AMCNum',
                  propositions: [
                    {
                      texte: texteCorr,
                      reponse: {
                        texte: texte + '<br>a',
                        valeur: arrondi(100 * u, 2),
                        param: {
                          signe: false,
                          digits: 3,
                          decimals: 0
                        }
                      }
                    }
                  ]
                }
              ]
            }
          }
          break
        case 6: // n/10 = ... + .../10 + .../100 = ...
          ecritureDecimale = texNombre(arrondi(n / 10, 1))
          texteCorr = `$${texFraction(n, 10)}=${u * 10 + d}+${texFraction(c, 10)}+${texFraction(0, 100)}=${ecritureDecimale}$`
          if (this.interactif && !context.isAmc) {
            const content = `\\dfrac{${n}}{10}~=~ %{champ1} + \\dfrac{%{champ2}}{10} + \\dfrac{%{champ3}}{100}~=~%{champ4}`
            texte = remplisLesBlancs(this, i, content)
            handleAnswers(this, i, {
              bareme: (listePoints) => [listePoints[0] * listePoints[1] * listePoints[2] + listePoints[3], 2],
              champ1: { value: u * 10 + d },
              champ2: { value: c },
              champ3: { value: 0 },
              champ4: { value: arrondi(u * 10 + d + c / 10, 2) }
            },
            { formatInteractif: 'mathlive' }
            )
          } else {
            texte = `$${texFraction(n, 10)}=${context.isAmc ? 'a' : '\\ldots\\ldots'}+${texFraction(context.isAmc ? 'b' : '\\ldots\\ldots', 10)}+${texFraction(context.isAmc ? 'c' : '\\ldots\\ldots', 100)}=${context.isAmc ? 'd' : '\\ldots\\ldots'}$`
            this.autoCorrection[i] = {
              options: { multicols: true },
              enonceAvant: false,
              propositions: [
                {
                  type: 'AMCNum',
                  propositions: [
                    {
                      texte: texteCorr,
                      reponse: {
                        texte: texte + '<br>a',
                        valeur: arrondi(u * 10 + d, 2),
                        param: {
                          signe: false,
                          digits: 3,
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
                        texte: 'b',
                        valeur: c,
                        param: {
                          signe: false,
                          digits: 1,
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
                        texte: 'c',
                        valeur: 0,
                        param: {
                          signe: false,
                          digits: 1,
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
                        texte: 'd',
                        valeur: arrondi(n / 10, 1),
                        param: {
                          signe: false,
                          digits: 5,
                          decimals: 3
                        }
                      }
                    }
                  ]
                }
              ]
            }
          }
          break
        case 7: // .../100 = u + d/10 =...
          ecritureDecimale = texNombre(arrondi(u + d / 10, 1))
          texteCorr = `$${texFraction(n, '100')}=${u}+${texFraction(d, '10')}=${ecritureDecimale}$`
          if (this.interactif && !context.isAmc) {
            const content = `\\dfrac{%{champ1}}{100}~=~ ${u} + \\dfrac{${d}}{10}~=~%{champ2}`
            texte = remplisLesBlancs(this, i, content)
            handleAnswers(this, i, {
              bareme: (listePoints) => [listePoints[0] + listePoints[1], 2],
              champ1: { value: n },
              champ2: { value: arrondi(u + d / 10, 1) }
            },
            { formatInteractif: 'mathlive' }
            )
          } else {
            texte = `$${texFraction(context.isAmc ? 'a' : '\\ldots\\ldots', '100')}=${u}+${texFraction(d, '10')}=${context.isAmc ? 'b' : '\\ldots\\ldots'}$`
            this.autoCorrection[i] = {
              options: { multicols: true },
              enonceAvant: false,
              propositions: [
                {
                  type: 'AMCNum',
                  propositions: [
                    {
                      texte: texteCorr,
                      reponse: {
                        texte: texte + '<br>a',
                        valeur: n,
                        param: {
                          signe: false,
                          digits: 4,
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
                        texte: 'b',
                        valeur: arrondi(u + d / 10 + c / 100, 2),
                        param: {
                          signe: false,
                          digits: 5,
                          decimals: 3
                        }
                      }
                    }
                  ]
                }
              ]
            }
          }
          break
      }

      // if (this.questionJamaisPosee(i, u, d, c)) {
      // Si la question n'a jamais été posée, on en crée une autre
      this.listeQuestions.push(texte)
      this.listeCorrections.push(texteCorr)
      i++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireTexte = [
    'Type de questions', [
      'Nombres séparés par des tirets',
      '1 : n/100 = ...+.../10 + .../100',
      '2 : n/100 = ...+.../100 + .../10',
      '3 : .../100 = u + d/10 + c/100',
      '4 : u = .../10',
      '5 : u = .../100',
      '6 : n/10 = ... + .../10 + .../100',
      '7 :  .../100 = u + d/10',
      '8 : Mélange'
    ].join('\n')
  ]
}
