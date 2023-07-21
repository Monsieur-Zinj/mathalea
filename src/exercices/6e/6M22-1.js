import { rotation } from '../../lib/2d/transformations.js'
import { miseEnEvidence } from '../../lib/embellissements.js'
import { arrondi } from '../../lib/outils/nombres.js'
import { sp } from '../../lib/outils/outilString.js'
import { stringNombre, texNombre } from '../../lib/outils/texNombre.js'
import {
  afficheLongueurSegment,
  cercle,
  latexParPoint,
  point,
  pointAdistance,
  segment,
  tracePoint
} from '../../modules/2d.js'
import { mathalea2d } from '../../modules/2dGeneralites.js'
import { context } from '../../modules/context.js'
import { setReponse } from '../../lib/interactif/gestionInteractif.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import {
  listeQuestionsToContenu,
  randint
} from '../../modules/outils.js'
import Exercice from '../Exercice.js'

export const titre = 'Calculer périmètre et aire de disques'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'

/**
 * 4 cercles sont tracés, 2 dont on connaît le rayon et 2 dont on connaît le diamètre.
 * * 1 : Calculer le périmètre de cercles
 * * 2 : Calculer l'aire de disques
 * * 3 : Calculer le périmètre et l'aire de disques
 *
 * Pas de version LaTeX
 * @author Rémi Angot (AMC par EE)
 * Référence 6M22-1
 */
export const uuid = 'f9a02'
export const ref = '6M22-1'

/**
 * Fonctions diverses pour la création des exercices
 * @module
 */
export default function PerimetreAireDisques (pa = 3) {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.titre = titre
  this.sup = pa // 1 : périmètre, 2 : aire, 3 : périmètres et aires
  this.sup2 = true // rayon ou périmètre entier
  this.spacing = 2
  this.spacingCorr = 2
  this.nbQuestions = 4

  this.nouvelleVersion = function () {
    this.listeQuestions = []
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    for (let i = 0, cpt = 0, r, type, A, C, M, B, S, texte, texteCorr, reponseL1, reponseL2, reponseA1, reponseA2, reponseL2bis, reponseA2bis; i < this.nbQuestions && cpt < 50;) {
      if (this.sup2) r = randint(2, 9)
      else r = arrondi(randint(2, 8) + randint(1, 9) / 10, 1)
      A = point(r + 0.5, r + 0.5)
      C = cercle(A, r)
      M = pointAdistance(A, r)
      B = rotation(M, A, 180)
      if (i % 2 === 0) {
        S = segment(A, M)
      } else {
        S = segment(M, B)
      }
      S.pointilles = 2
      texte = mathalea2d({ xmin: 0, ymin: 0, xmax: 2 * r + 1, ymax: 2 * r + 1, pixelsParCm: arrondi(50 / r), scale: arrondi(2.4 / r, 2) }, C, tracePoint(A), S, afficheLongueurSegment(S.extremite1, S.extremite2), latexParPoint('\\mathcal{C}_1', pointAdistance(A, 1.25 * r, 135), 'black', 20, 0, ''))

      if (this.sup === 1) {
        this.consigne = this.nbQuestions > 1 ? 'Calculer le périmètre (en $\\text{cm}$) des cercles suivants.' : 'Calculer le périmètre (en $\\text{cm}$) du cercle suivant.'
      }
      if (this.sup === 2) {
        this.consigne = this.nbQuestions > 1 ? "Calculer l'aire (en $\\text{cm}^2$) des disques suivants." : "Calculer l'aire (en $\\text{cm}^2$) du disque suivant."
      }
      if (this.sup === 3) {
        this.consigne = this.nbQuestions > 1 ? "Calculer le périmètre (en $\\text{cm}$) et l'aire (en $\\text{cm}^2$) des disques suivants." : "Calculer le périmètre (en $\\text{cm}$) et l'aire (en $\\text{cm}^2$) du disque suivant."
      }
      reponseL1 = this.sup === 2 ? 0 : arrondi(2 * r, 2)
      reponseL2 = this.sup === 2 ? 0 : arrondi(Math.trunc(2 * r * Math.PI * 10) / 10)
      reponseL2bis = this.sup === 2 ? 0 : arrondi(reponseL2 + 0.1)
      reponseA1 = this.sup === 1 ? 0 : arrondi(r * r, 2)
      reponseA2 = this.sup === 1 ? 0 : arrondi(Math.trunc(r * r * Math.PI * 10) / 10)
      reponseA2bis = this.sup === 1 ? 0 : arrondi(reponseA2 + 0.1)

      if (context.isAmc) {
        this.consigne += '\\\\\nDonner la valeur exacte et une valeur approchée au dixième près.'
      } else {
        this.consigne += `${context.isHtml ? '<br>' : '\\\\\n'} On donnera la valeur exacte puis une valeur approchée au dixième près.`
      }

      texteCorr = this.sup === 2
        ? ''
        : `$\\mathcal{P}_1=${i % 2 === 0 ? '2\\times' + texNombre(r) : texNombre(2 * r)}\\times \\pi=${texNombre(2 * r)
        }\\pi\\approx${texNombre(
          arrondi(2 * r * Math.PI, 2)
        )}${sp()}\\text{cm}$<br>`
      texteCorr += this.sup === 2
        ? ''
        : `Les valeurs approchées au dixième de $\\text{cm}$ du périmètre de ce disque sont $${miseEnEvidence(texNombre(reponseL2))}${sp()}\\text{cm}$ et $${miseEnEvidence(texNombre(reponseL2bis))}${sp()}\\text{cm}$.<br>`
      texteCorr += this.sup === 1
        ? ''
        : `$\\mathcal{A}_1=${i % 2 === 0 ? texNombre(r) + '\\times' + texNombre(r) : '\\dfrac{' + texNombre(2 * r) + '}{2}\\times \\dfrac{' + texNombre(2 * r) + '}{2}'}\\times \\pi=${texNombre(r * r)
            }\\pi\\approx${texNombre(
          arrondi(r * r * Math.PI, 2)
        )}${sp()}\\text{cm}^2$<br>`
      texteCorr += this.sup === 1
        ? ''
        : `Les valeurs approchées au dixième de $\\text{cm}^2$ de l'aire de ce disque sont $${miseEnEvidence(texNombre(reponseA2))}${sp()}\\text{cm}^2$ et $${miseEnEvidence(texNombre(reponseA2bis))}${sp()}\\text{cm}^2$.<br>`

      if (this.questionJamaisPosee(i, r, type)) {
        if (this.sup === 1) {
          if (context.isHtml && this.interactif) {
            setReponse(this, 2 * i, [stringNombre(reponseL1) + '\\pi', stringNombre(reponseL1) + '\\times\\pi', '\\pi\\times' + stringNombre(reponseL1)], { formatInteractif: 'texte' })
            setReponse(this, 2 * i + 1, [reponseL2, reponseL2bis], { formatInteractif: 'calcul' })
            texte += 'Périmètre : ' + ajouteChampTexteMathLive(this, 2 * i, 'largeur10 inline', { texteApres: ' cm' })
            texte += ' $\\approx$' + ajouteChampTexteMathLive(this, 2 * i + 1, 'largeur10 inline nospacebefore', { texteApres: ' cm' })
          } else {
            this.autoCorrection[i] = {
              enonce: 'Calculer le périmètre du cercle suivant :<br>' + texte,
              enonceAvantUneFois: true,
              enonceAGauche: [0.3, 0.7],
              options: { multicols: true },
              propositions: [
                {
                  type: 'AMCNum',
                  propositions: [
                    {
                      texte: texteCorr,
                      reponse: {
                        texte: 'Périmètre en cm (valeur exacte en nombre de $\\pi$)',
                        valeur: [reponseL1],
                        param: {
                          digits: this.sup2 ? 2 : 3,
                          decimals: this.sup2 ? 0 : 1,
                          signe: false
                        }
                      }
                    }
                  ]
                },
                {
                  type: 'AMCNum',
                  propositions: [
                    {
                      texte: texteCorr,
                      reponse: {
                        texte: 'Périmètre en cm (valeur approchée à 0,1 près)',
                        valeur: [reponseL2],
                        param: {
                          digits: this.sup2 ? 3 : 4,
                          signe: false,
                          decimals: 1,
                          aussiCorrect: reponseL2bis
                        }
                      }
                    }
                  ]
                }
              ]
            }
          }
        } else if (this.sup === 2) {
          if (context.isHtml && this.interactif) {
            setReponse(this, 2 * i, [stringNombre(reponseA1) + '\\pi', stringNombre(reponseA1) + '\\times\\pi', '\\pi\\times' + stringNombre(reponseA1)], { formatInteractif: 'texte' })
            setReponse(this, 2 * i + 1, [reponseA2, reponseA2bis], { formatInteractif: 'calcul' })
            texte += 'Aire : ' + ajouteChampTexteMathLive(this, 2 * i, 'largeur10 inline', { texteApres: ' cm²' })
            texte += ' $\\approx$' + ajouteChampTexteMathLive(this, 2 * i + 1, 'largeur10 inline nospacebefore', { texteApres: ' cm²' })
          } else {
            this.autoCorrection[i] = {
              enonce: "Calculer l'aire du cercle suivant :<br>" + texte,
              enonceAvantUneFois: true,
              enonceAGauche: [0.3, 0.7],
              options: { multicols: true },
              propositions: [
                {
                  type: 'AMCNum',
                  propositions: [
                    {
                      texte: texteCorr,
                      reponse: {
                        valeur: [reponseA1],
                        texte: 'Aire en cm\\up{2} (valeur exacte en nombre de $\\pi$)\\\\',
                        param: {
                          digits: this.sup2 ? 2 : 3,
                          signe: false,
                          decimals: this.sup2 ? 0 : 1
                        }
                      }
                    }
                  ]
                },
                {
                  type: 'AMCNum',
                  propositions: [
                    {
                      texte: texteCorr,
                      reponse: {
                        texte: 'Aire en cm\\up{2} (valeur approchée à 0,1 près)',
                        valeur: [reponseA2],
                        param: {
                          digits: this.sup2 ? 3 : 4,
                          signe: false,
                          decimals: 1,
                          aussiCorrect: reponseA2bis
                        }
                      }
                    }
                  ]
                }
              ]
            }
          }
        } else {
          if (context.isHtml && this.interactif) {
            setReponse(this, 4 * i, [stringNombre(reponseL1) + '\\pi', stringNombre(reponseL1) + '\\times\\pi', '\\pi\\times' + stringNombre(reponseL1)], { formatInteractif: 'texte' })
            setReponse(this, 4 * i + 1, [reponseL2, reponseL2bis], { formatInteractif: 'calcul' })
            setReponse(this, 4 * i + 2, [stringNombre(reponseA1) + '\\pi', stringNombre(reponseA1) + '\\times\\pi', '\\pi\\times' + stringNombre(reponseA1)], { formatInteractif: 'texte' })
            setReponse(this, 4 * i + 3, [reponseA2, reponseA2bis], { formatInteractif: 'calcul' })
            texte += 'Périmètre : ' + ajouteChampTexteMathLive(this, 4 * i, 'largeur10 inline')
            texte += ' cm $\\approx $' + ajouteChampTexteMathLive(this, 4 * i + 1, 'largeur10 inline nospacebefore') + ' cm'
            texte += '<br>Aire : ' + ajouteChampTexteMathLive(this, 4 * i + 2, 'largeur10 inline')
            texte += ' cm² $\\approx $' + ajouteChampTexteMathLive(this, 4 * i + 3, 'largeur10 inline nospacebefore') + ' cm²'
          } else {
            this.autoCorrection[i] = {
              enonce: "Calculer le périmètre et l'aire du cercle suivant :<br>" + texte,
              enonceAGauche: [0.3, 0.7],
              options: { multicols: true },
              propositions: [
                {
                  type: 'AMCNum',
                  propositions: [
                    {
                      texte: texteCorr,
                      reponse: {
                        texte: 'Périmètre en cm (valeur exacte en nombre de $\\pi$)',
                        valeur: [reponseL1],
                        param: {
                          digits: this.sup2 ? 2 : 3,
                          decimals: this.sup2 ? 0 : 1,
                          signe: false
                        }
                      }
                    }
                  ]
                },
                {
                  type: 'AMCNum',
                  propositions: [
                    {
                      texte: texteCorr,
                      reponse: {
                        texte: 'Périmètre en cm (valeur approchée à 0,1 près)',
                        valeur: [reponseL2],
                        param: {
                          digits: this.sup2 ? 3 : 4,
                          decimals: 1,
                          signe: false,
                          aussiCorrect: reponseL2bis
                        }
                      }
                    }
                  ]
                },
                {
                  type: 'AMCNum',
                  propositions: [
                    {
                      texte: texteCorr,
                      reponse: {
                        texte: 'Aire en cm\\up{2} (valeur exacte en nombre de $\\pi$)\\\\',
                        valeur: [reponseA1],
                        param: {
                          digits: this.sup2 ? 2 : 3,
                          decimals: this.sup2 ? 0 : 1,
                          signe: false
                        }
                      }
                    }
                  ]
                },
                {
                  type: 'AMCNum',

                  propositions: [
                    {
                      texte: texteCorr,
                      reponse: {
                        valeur: [reponseA2],
                        texte: 'Aire en cm\\up{2} (valeur approchée au dixième)',
                        param: {
                          digits: this.sup2 ? 3 : 4,
                          decimals: 1,
                          signe: false,
                          aussiCorrect: reponseA2bis
                        }
                      }
                    }
                  ]
                }
              ]
            }
          }
        }

        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }

  this.besoinFormulaireNumerique = ['Niveau de difficulté', 3, '1 : Périmètres\n2 : Aires\n3 : Périmètres et aires']
  this.besoinFormulaire2CaseACocher = ['Rayon et diamètre entier', true]
}
