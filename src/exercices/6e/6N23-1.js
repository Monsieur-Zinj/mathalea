import { deprecatedTexFraction } from '../../lib/outils/deprecatedFractions.js'
import { texNombre } from '../../lib/outils/texNombre.js'
import Exercice from '../Exercice.js'
import { calculANePlusJamaisUtiliser, gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { context } from '../../modules/context.js'
import { fraction } from '../../modules/fractions.js'
import { ajouteChampFractionMathLive, ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'

import { setReponse } from '../../lib/interactif/gestionInteractif.js'

export const titre = 'Donner différentes écritures de nombres décimaux'
export const amcReady = true
export const amcType = 'AMCHybride'
export const interactifReady = true
export const interactifType = 'mathLive'

export const dateDeModifImportante = '25/09/2022'
// Mickael Guironnet a ajouté un type et le paramétrage

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
export default function ExerciceDifferentesEcrituresNombresDecimaux () {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.consigne = "Compléter l'égalité puis donner l'écriture décimale, si non déjà indiquée."
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
    /*
        const typesDeQuestionsDisponibles = [1, 2, 3, 4, 5, 6, 7]
        let listeTypeDeQuestions = []
        if (!this.sup) { // Si aucune liste n'est saisie ou mélange demandé
          listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions)
          if (this.nbQuestions === 3) listeTypeDeQuestions = combinaisonListes([choice([1, 2, 6]), 3, choice([4, 5])], this.nbQuestions)
        } else {
          const quests = this.sup.split('-')// Sinon on créé un tableau à partir des valeurs séparées par des -
          for (let i = 0; i < quests.length; i++) { // on a un tableau avec des strings : ['1', '1', '2']
            const choixtp = parseInt(quests[i])
            if (choixtp >= 1 && choixtp <= 7) {
              listeTypeDeQuestions.push(choixtp)
            }
          }
          if (listeTypeDeQuestions.length === 0) { listeTypeDeQuestions = typesDeQuestionsDisponibles }
          listeTypeDeQuestions = combinaisonListes(listeTypeDeQuestions, this.nbQuestions)
        }
        */
    const listeTypeDeQuestions = gestionnaireFormulaireTexte({
      max: 7,
      defaut: 8,
      melange: 8,
      nbQuestions: this.nbQuestions,
      saisie: this.sup
    })

    for (let i = 0, indexQ = 0, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50; cpt++) {
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
          ecritureDecimale = texNombre(calculANePlusJamaisUtiliser(u + d / 10 + c / 100))
          texteCorr = `$${deprecatedTexFraction(n, '100')}=${u}+${deprecatedTexFraction(
                        d,
                        '10'
                    )}+${deprecatedTexFraction(c, '100')}=${ecritureDecimale}$`
          if (this.interactif && !context.isAmc) {
            texte = `$${deprecatedTexFraction(n, '100')}=$` + ajouteChampTexteMathLive(this, indexQ, 'largeur10 inline nospacebefore')
            setReponse(this, indexQ, u, { formatInteractif: 'calcul' })
            indexQ++
            texte += '$+$' + ajouteChampFractionMathLive(this, indexQ, false, 10)
            setReponse(this, indexQ, fraction(d, 10), { formatInteractif: 'Num' })
            indexQ++
            texte += '$+$' + ajouteChampFractionMathLive(this, indexQ, false, 100)
            setReponse(this, indexQ, fraction(c, 100), { formatInteractif: 'Num' })
            indexQ++
            texte += '$=$' + ajouteChampTexteMathLive(this, indexQ, 'largeur10 inline nospacebefore')
            setReponse(this, indexQ, calculANePlusJamaisUtiliser(u + d / 10 + c / 100), { formatInteractif: 'calcul' })
            indexQ++
          } else {
            texte = `$${deprecatedTexFraction(n, '100')}=${context.isAmc ? 'a' : '\\ldots\\ldots'}+${deprecatedTexFraction(
                            context.isAmc ? 'b' : '\\ldots\\ldots',
                            10
                        )}+${deprecatedTexFraction(context.isAmc ? 'c' : '\\ldots\\ldots', 100)}=${context.isAmc ? 'd' : '\\ldots\\ldots'}$`
            texteCorr = `$${deprecatedTexFraction(n, '100')}=${u}+${deprecatedTexFraction(
                            d,
                            '10'
                        )}+${deprecatedTexFraction(c, '100')}=${ecritureDecimale}$`
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
                        valeur: calculANePlusJamaisUtiliser(u + d / 10 + c / 100),
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
          ecritureDecimale = texNombre(calculANePlusJamaisUtiliser(u + d / 10 + c / 100))
          texteCorr = `$${deprecatedTexFraction(n, '100')}=${u}+${deprecatedTexFraction(
                        c,
                        100
                    )}+${deprecatedTexFraction(d, 10)}=${ecritureDecimale}$`
          if (this.interactif && !context.isAmc) {
            texte = `$${deprecatedTexFraction(n, '100')}=$`
            texte += ajouteChampTexteMathLive(this, indexQ, 'largeur10 inline nospacebefore')
            setReponse(this, indexQ, u, { formatInteractif: 'calcul' })
            indexQ++
            texte += '$+$' + ajouteChampFractionMathLive(this, indexQ, false, 100)
            setReponse(this, indexQ, fraction(c, 100), { formatInteractif: 'Num' })
            indexQ++
            texte += '$+$' + ajouteChampFractionMathLive(this, indexQ, false, 10)
            setReponse(this, indexQ, fraction(d, 10), { formatInteractif: 'Num' })
            indexQ++
            texte += '$=$' + ajouteChampTexteMathLive(this, indexQ, 'largeur10 inline nospacebefore')
            setReponse(this, indexQ, calculANePlusJamaisUtiliser(u + d / 10 + c / 100), { formatInteractif: 'calcul' })
            indexQ++
          } else {
            texte = `$${deprecatedTexFraction(n, '100')}=${context.isAmc ? 'a' : '\\ldots\\ldots'}+${deprecatedTexFraction(
                            context.isAmc ? 'b' : '\\ldots\\ldots',
                            100
                        )}+${deprecatedTexFraction(context.isAmc ? 'c' : '\\ldots\\ldots', 10)}=${context.isAmc ? 'd' : '\\ldots\\ldots'}$`
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
                        valeur: calculANePlusJamaisUtiliser(u + d / 10 + c / 100),
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
          ecritureDecimale = texNombre(calculANePlusJamaisUtiliser(u + d / 10 + c / 100))
          texteCorr = `$${deprecatedTexFraction(n, '100')}=${u}+${deprecatedTexFraction(
                        d,
                        '10'
                    )}+${deprecatedTexFraction(c, '100')}=${ecritureDecimale}$`
          if (this.interactif && !context.isAmc) {
            texte = ajouteChampFractionMathLive(this, indexQ, false, false)
            setReponse(this, indexQ, u * 100 + d * 10 + c, { formatInteractif: 'calcul' })
            setReponse(this, indexQ + 1, 100, { formatInteractif: 'calcul' })
            indexQ += 2
            texte += `$=${u}+${deprecatedTexFraction(d, '10')}+${deprecatedTexFraction(c, '100')}=$`
            texte += ajouteChampTexteMathLive(this, indexQ, 'largeur10 inline nospacebefore')
            setReponse(this, indexQ, calculANePlusJamaisUtiliser(u + d / 10 + c / 100), { formatInteractif: 'calcul' })
            indexQ++
          } else {
            texte = `$${deprecatedTexFraction(context.isAmc ? 'a' : '\\ldots\\ldots', '100')}=${u}+${deprecatedTexFraction(
                            d,
                            '10'
                        )}+${deprecatedTexFraction(c, '100')}=${context.isAmc ? 'b' : '\\ldots\\ldots'}$`
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
                        valeur: calculANePlusJamaisUtiliser(u + d / 10 + c / 100),
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
          texteCorr = `$${u}=${deprecatedTexFraction(10 * u, '10')}$`
          if (this.interactif && !context.isAmc) {
            texte = `$${u}=$`
            texte += ajouteChampFractionMathLive(this, indexQ, false, 10)
            setReponse(this, indexQ, fraction(10 * u, 10), { formatInteractif: 'Num' })
            indexQ++
          } else {
            texte = `$${u}=${deprecatedTexFraction(context.isAmc ? 'a' : '\\ldots\\ldots', '10')}$`
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
                        valeur: calculANePlusJamaisUtiliser(10 * u),
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
          texteCorr = `$${u}=${deprecatedTexFraction(100 * u, '100')}$`
          if (this.interactif && !context.isAmc) {
            texte = `$${u}=$`
            texte += ajouteChampFractionMathLive(this, indexQ, false, 100)
            setReponse(this, indexQ, fraction(100 * u, 100), { formatInteractif: 'Num' })
            indexQ++
          } else {
            texte = `$${u}=${deprecatedTexFraction(context.isAmc ? 'a' : '\\ldots\\ldots', '100')}$`
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
                        valeur: calculANePlusJamaisUtiliser(100 * u),
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
          ecritureDecimale = texNombre(calculANePlusJamaisUtiliser(n / 10))
          texteCorr = `$${deprecatedTexFraction(n, 10)}=${u * 10 + d}+${deprecatedTexFraction(c, 10)}+${deprecatedTexFraction(0, 100)}=${ecritureDecimale}$`
          if (this.interactif && !context.isAmc) {
            texte = `$${deprecatedTexFraction(n, 10)}=$`
            texte += ajouteChampTexteMathLive(this, indexQ, 'largeur10 inline nospacebefore')
            setReponse(this, indexQ, u * 10 + d, { formatInteractif: 'calcul' })
            indexQ++
            texte += '$+$' + ajouteChampFractionMathLive(this, indexQ, false, 10)
            setReponse(this, indexQ, fraction(c, 10), { formatInteractif: 'Num' })
            indexQ++
            texte += '$+$' + ajouteChampFractionMathLive(this, indexQ, false, 100)
            setReponse(this, indexQ, fraction(0, 100), { formatInteractif: 'Num' })
            indexQ++
            texte += '$=$' + ajouteChampTexteMathLive(this, indexQ, 'largeur10 inline nospacebefore')
            setReponse(this, indexQ, calculANePlusJamaisUtiliser(n / 10), { formatInteractif: 'calcul' })
            indexQ++
          } else {
            texte = `$${deprecatedTexFraction(n, 10)}=${context.isAmc ? 'a' : '\\ldots\\ldots'}+${deprecatedTexFraction(context.isAmc ? 'b' : '\\ldots\\ldots', 10)}+${deprecatedTexFraction(context.isAmc ? 'c' : '\\ldots\\ldots', 100)}=${context.isAmc ? 'd' : '\\ldots\\ldots'}$`
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
                        valeur: calculANePlusJamaisUtiliser(u * 10 + d),
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
                        valeur: calculANePlusJamaisUtiliser(n / 10),
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
          ecritureDecimale = texNombre(calculANePlusJamaisUtiliser(u + d / 10))
          texteCorr = `$${deprecatedTexFraction(n, '100')}=${u}+${deprecatedTexFraction(d, '10')}=${ecritureDecimale}$`
          if (this.interactif && !context.isAmc) {
            texte = ajouteChampFractionMathLive(this, indexQ, false, 100)
            setReponse(this, indexQ, u * 100 + d * 10 + c, { formatInteractif: 'calcul' })
            indexQ++
            texte += `$=${u}+${deprecatedTexFraction(d, '10')}=$`
            texte += ajouteChampTexteMathLive(this, indexQ, 'largeur10 inline nospacebefore')
            setReponse(this, indexQ, calculANePlusJamaisUtiliser(u + d / 10 + c / 100), { formatInteractif: 'calcul' })
            indexQ++
          } else {
            texte = `$${deprecatedTexFraction(context.isAmc ? 'a' : '\\ldots\\ldots', '100')}=${u}+${deprecatedTexFraction(d, '10')}=${context.isAmc ? 'b' : '\\ldots\\ldots'}$`
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
                        valeur: calculANePlusJamaisUtiliser(u + d / 10 + c / 100),
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
