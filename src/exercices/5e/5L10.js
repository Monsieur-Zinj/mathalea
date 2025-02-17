import { choice } from '../../lib/outils/arrayOutils'
import { texFractionFromString } from '../../lib/outils/deprecatedFractions.js'
import Exercice from '../deprecatedExercice.js'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { propositionsQcm } from '../../lib/interactif/qcm.js'
import { miseEnEvidence } from '../../lib/outils/embellissements'
export const amcReady = true
export const amcType = 'qcmMult'
export const interactifReady = true
export const interactifType = 'qcm'

export const titre = 'Écrire une expression littérale'

export const dateDeModifImportante = '19/11/2023'

/**
* Écrire une expression littérale à partir d'une phrase :
* * Double, triple, moitié, tiers, quart
* * Successeur, prédécesseur
* * Carré, cube, opposé, inverse
* * Somme, produit, quotient
* * Nombre pair, nombre impair, multiple d'un nombre donné
* @author Rémi Angot
* Ajout de la possibilité de ne pas poser de question sur l'inverse d'un nombre par Guillaume Valmont le 11/05/2022
* Ajout de la possibilité de choisir séparément chaque cas par Eric Elter le 19/11/2023
*/
export const uuid = '3c1f7'
export const ref = '5L10'
export const refs = {
  'fr-fr': ['5L10'],
  'fr-ch': ['9FA2-3', '10FA1-4']
}
export default function ÉcrireUneExpressionLitterale () {
  Exercice.call(this)
  this.nbQuestions = 4
  this.nbCols = 1
  this.nbColsCorr = 1
  this.besoinFormulaireCaseACocher = ['Inclure l\'inverse d\'un nombre']
  this.sup = true
  this.sup2 = 19

  this.nouvelleVersion = function () {
    this.autoCorrection = []
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées

    const listeTypeDeQuestions = gestionnaireFormulaireTexte({
      max: 18,
      defaut: 19,
      melange: 19,
      nbQuestions: this.nbQuestions,
      saisie: this.sup2,
      exclus: this.sup ? [] : [10] // Pour le choix qui existait précédemment de pouvoir supprimer l'inverse de la liste
    })

    for (let i = 0, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      this.autoCorrection[i] = {}
      const lettresDisponibles = ['x', 'y', 'z', 't', 'a', 'b', 'c', 'n', 'm']
      const x = choice(lettresDisponibles)
      const y = choice(lettresDisponibles, x)
      const k = randint(2, 10)
      switch (listeTypeDeQuestions[i]) {
        case 1: // 2x
          texte = `Exprimer le double de $${x}$ en fonction de $${x}$.`
          texteCorr = `Le double de $${x}$ peut se noter : $${miseEnEvidence(`2${x}`)}$.`
          this.autoCorrection[i].propositions = [
            {
              texte: `$2\\times ${x}$`,
              statut: true,
              feedback: 'Correct mais non simplifié.'
            },
            {
              texte: `$2${x}$`,
              statut: true,
              feedback: 'Correct !'
            },
            {
              texte: `$${x}+${x}$`,
              statut: true,
              feedback: 'Correct mais non simplifié.'
            },
            {
              texte: `$2+${x}$`,
              statut: false,
              feedback: 'Tu as confondu somme et produit.'
            },
            {
              texte: `$${x}^2$`,
              statut: false,
              feedback: 'Tu as confondu le double et le carré.'
            },
            {
              texte: `$${x}2$`,
              statut: false,
              feedback: 'Cette écriture est incorrecte.'
            }
          ]
          break
        case 2: // 3x
          texte = `Exprimer le triple de $${x}$  en fonction de $${x}$.`
          texteCorr = `Le triple de $${x}$  peut se noter : $${miseEnEvidence(`3${x}`)}$.`
          this.autoCorrection[i].propositions = [
            {
              texte: `$3\\times ${x}$`,
              statut: true,
              feedback: 'Correct mais non simplifié.'
            },
            {
              texte: `$3${x}$`,
              statut: true,
              feedback: 'Correct !'
            },
            {
              texte: `$${x}+2${x}$`,
              statut: true,
              feedback: 'Correct mais non simplifié.'
            },
            {
              texte: `$3+${x}$`,
              statut: false,
              feedback: 'Tu as confondu somme et produit.'
            },
            {
              texte: `$${x}^3$`,
              statut: false,
              feedback: 'Tu as confondu le triple et le cube.'
            },
            {
              texte: `$${x}3$`,
              statut: false,
              feedback: 'Cette écriture est incorrecte.'
            }
          ]
          break
        case 3: // x/2
          texte = `Exprimer la moitié de $${x}$ en fonction de $${x}$.`
          texteCorr = `La moitié de $${x}$  peut se noter : $${miseEnEvidence(`${texFractionFromString(x, 2)}`)}$ ou $${miseEnEvidence(`${x}\\div 2`)}$ ou $${miseEnEvidence(`0,5${x}`)}$.`
          this.autoCorrection[i].propositions = [
            {
              texte: `$${x}\\div 2$`,
              statut: true,
              feedback: 'Correct !'
            },
            {
              texte: `$\\dfrac{${x}}{2}$`,
              statut: true,
              feedback: 'Correct !'
            },
            {
              texte: `$0,5${x}$`,
              statut: true,
              feedback: 'Correct !'
            },
            {
              texte: `$${x}-2$`,
              statut: false,
              feedback: 'Tu as confondu quotient et différence.'
            },
            {
              texte: `$\\dfrac{1}{2}+${x}$`,
              statut: false,
              feedback: 'Tu as confondu muliplier par $\\dfrac{1}{2}$ et ajouter $\\dfrac{1}{2}$.'
            },
            {
              texte: `$${x}\\div 0,5$`,
              statut: false,
              feedback: 'Cela revient à multiplier par $2$ et non à diviser par $2$.'
            }
          ]
          break
        case 4: // x/4
          texte = `Exprimer le quart de $${x}$  en fonction de $${x}$.`
          texteCorr = `Le quart de $${x}$  peut se noter :  $${miseEnEvidence(`${texFractionFromString(x, 4)}`)}$ ou $${miseEnEvidence(`${x}\\div 4`)}$ ou $${miseEnEvidence(`0,25${x}`)}$.`
          this.autoCorrection[i].propositions = [
            {
              texte: `$${x}\\div 4$`,
              statut: true,
              feedback: 'Correct !'
            },
            {
              texte: `$\\dfrac{${x}}{4}$`,
              statut: true,
              feedback: 'Correct !'
            },
            {
              texte: `$0,25${x}$`,
              statut: true,
              feedback: 'Correct !'
            },
            {
              texte: `$${x}-\\dfrac{1}{4}$`,
              statut: false,
              feedback: 'Tu as confondu quotient et différence.'
            },
            {
              texte: `$\\dfrac{1}{4}+${x}$`,
              statut: false,
              feedback: 'Tu as confondu muliplier par $\\dfrac{1}{4}$ et ajouter $\\dfrac{1}{4}$.'
            },
            {
              texte: `$${x}\\div 0,25$`,
              statut: false,
              feedback: 'Cela revient à multiplier par $4$ et non à diviser par $4$.'
            }
          ]
          break
        case 5: // x+1
          texte = `$${x}$ étant un nombre entier, exprimer l'entier suivant en fonction de $${x}$.`
          texteCorr = `Le successeur de $${x}$ peut se noter : $${miseEnEvidence(`${x}+1`)}$.`
          this.autoCorrection[i].propositions = [
            {
              texte: `$1+${x}$`,
              statut: true,
              feedback: 'Correct !'
            },
            {
              texte: `$${x}+1$`,
              statut: true,
              feedback: 'Correct !'
            },
            {
              texte: `$${x}+${x}$`,
              statut: false,
              feedback: "Le double est rarement le suivant. En fait, ça n'arrive que pour 1."
            },
            {
              texte: `$2${x}$`,
              statut: false,
              feedback: "Le double est rarement le suivant. En fait, ça n'arrive que pour 1."
            },
            {
              texte: `$${x}-1$`,
              statut: false,
              feedback: 'Tu as confondu suivant et précédent.'
            },
            {
              texte: `$${x}2$`,
              statut: false,
              feedback: 'Cette écriture est incorrecte.'
            }
          ]
          break
        case 6: // x-1
          texte = `$${x}$ étant un nombre entier, exprimer l'entier précédent en fonction de $${x}$.`
          texteCorr = `Le prédecesseur de $${x}$  peut se noter :  $${miseEnEvidence(`${x}-1`)}$.`
          this.autoCorrection[i].propositions = [
            {
              texte: `$${x}-1$`,
              statut: true,
              feedback: 'Correct !'
            },
            {
              texte: `$${x}+(-1)$`,
              statut: true,
              feedback: 'Correct !'
            },
            {
              texte: `$1-${x}$`,
              statut: false,
              feedback: ''
            },
            {
              texte: `$${x}-${x}$`,
              statut: false,
              feedback: 'Cela fait zéro, il me semble... donc ça ne fonctionne que pour 1.'
            },
            {
              texte: `$-1${x}$`,
              statut: false,
              feedback: 'Tu as confondu multiplier et ajouter.'
            },
            {
              texte: `$${x}+1$`,
              statut: false,
              feedback: 'Tu as confondu précédent et suivant.'
            }
          ]
          break
        case 7: // x^2
          texte = `Exprimer le carré de $${x}$  en fonction de $${x}$.`
          texteCorr = `Le carré de $${x}$  peut se noter : $${miseEnEvidence(`${x}^2`)}$.`
          this.autoCorrection[i].propositions = [
            {
              texte: `$${x}${x}$`,
              statut: true,
              feedback: 'Correct !'
            },
            {
              texte: `$${x}\\times ${x}$`,
              statut: true,
              feedback: 'Correct !'
            },
            {
              texte: `$${x}^2$`,
              statut: true,
              feedback: 'Correct !'
            },
            {
              texte: `$${x}2$`,
              statut: false,
              feedback: 'Cette écriture est incorrecte.'
            },
            {
              texte: `$2${x}$`,
              statut: false,
              feedback: 'Tu as confondu le carré et le double.'
            },
            {
              texte: `$${x}+2$`,
              statut: false,
              feedback: 'Tu as confondu somme et puissance.'
            }
          ]
          break
        case 8: // x^3
          texte = `Exprimer le cube de $${x}$  en fonction de $${x}$.`
          texteCorr = `Le cube de $${x}$  peut se noter : $${miseEnEvidence(`${x}^3`)}$.`
          this.autoCorrection[i].propositions = [
            {
              texte: `$${x}${x}${x}$`,
              statut: true,
              feedback: 'Correct, mais non simplifié.'
            },
            {
              texte: `$${x}\\times ${x}\\times ${x}$`,
              statut: true,
              feedback: 'Correct, mais non simplifié.'
            },
            {
              texte: `$${x}^3$`,
              statut: true,
              feedback: 'Correct !'
            },
            {
              texte: `$${x}3$`,
              statut: false,
              feedback: 'Cette écriture est incorrecte.'
            },
            {
              texte: `$3${x}$`,
              statut: false,
              feedback: 'Tu as confondu le cube et le triple.'
            },
            {
              texte: `$${x}+3$`,
              statut: false,
              feedback: 'Tu as confondu somme et puissance.'
            }
          ]
          break
        case 9: // -x
          texte = `Exprimer l'opposé de $${x}$  en fonction de $${x}$.`
          texteCorr = `L'opposé de $${x}$  peut se noter : $${miseEnEvidence(`-${x}`)}$.`
          this.autoCorrection[i].propositions = [
            {
              texte: `$-${x}$`,
              statut: true,
              feedback: 'Correct !'
            },
            {
              texte: `$-1\\times ${x}$`,
              statut: true,
              feedback: 'Correct, mais non simplifié.'
            },
            {
              texte: `$${x}-1$`,
              statut: false,
              feedback: 'Tu as confondu multiplication et addition.'
            },
            {
              texte: `$\\dfrac{1}{${x}}$`,
              statut: false,
              feedback: 'Tu as confondu opposé et inverse.'
            },
            {
              texte: `$${x}$`,
              statut: false,
              feedback: "Cela n'est vrai que pour zéro."
            },
            {
              texte: `$1-${x}$`,
              statut: false,
              feedback: "C'est un de trop..."
            }
          ]
          break
        case 10: // 1/x
          texte = `Exprimer l'inverse de $${x}$  en fonction de $${x}$.`
          texteCorr = `L'inverse de $${x}$ peut se noter : $${miseEnEvidence(`${texFractionFromString(1, x)}`)}$.`
          this.autoCorrection[i].propositions = [
            {
              texte: `$\\dfrac{1}{${x}}$`,
              statut: true,
              feedback: 'Correct !'
            },
            {
              texte: `$-1\\times ${x}$`,
              statut: false,
              feedback: 'Tu as confondu inverse et opposé.'
            },
            {
              texte: `$${x}-1$`,
              statut: false,
              feedback: 'Tu as confondu division et soustraction.'
            },
            {
              texte: `$-${x}$`,
              statut: false,
              feedback: 'Tu as confondu inverse et opposé.'
            },
            {
              texte: `$${x}$`,
              statut: false,
              feedback: "Cela n'est vrai que pour 1."
            },
            {
              texte: `$1-${x}$`,
              statut: false,
              feedback: 'Tu as confondu division et soustraction.'
            }
          ]
          break
        case 11: // x+k
          texte = `Exprimer la somme de $${x}$ et ${k} en fonction de $${x}$.`
          texteCorr = `La somme de $${x}$ et ${k} peut se noter : $${miseEnEvidence(`${x}+${k}`)}$.`
          this.autoCorrection[i].propositions = [
            {
              texte: `$${k}+${x}$`,
              statut: true,
              feedback: 'Correct !'
            },
            {
              texte: `$${x}+${k}$`,
              statut: true,
              feedback: 'Correct !'
            },
            {
              texte: `$${k}${x}$`,
              statut: false,
              feedback: 'Tu as confondu addition et multiplication.'
            },
            {
              texte: `$${x}${k}$`,
              statut: false,
              feedback: 'Cette écriture est incorrecte.'
            },
            {
              texte: `$${x}-${k}$`,
              statut: false,
              feedback: 'Tu as confondu somme et différence.'
            },
            {
              texte: `$${k}\\times ${x}$`,
              statut: false,
              feedback: 'Tu as confondu somme et produit.'
            }
          ]
          break
        case 12: // kx
          texte = `Exprimer le produit de $${x}$  par ${k} en fonction de $${x}$.`
          texteCorr = `Le produit de $${x}$ par ${k} peut se noter : $${miseEnEvidence(`${k}${x}`)}$.`
          this.autoCorrection[i].propositions = [
            {
              texte: `$${k}${x}$`,
              statut: true,
              feedback: 'Correct !'
            },
            {
              texte: `$${k}\\times ${x}$`,
              statut: true,
              feedback: 'Correct, mais non simplifié.'
            },
            {
              texte: `$${k}+${x}$`,
              statut: false,
              feedback: 'Tu as confondu addition et multiplication.'
            },
            {
              texte: `$${x}${k}$`,
              statut: false,
              feedback: 'Cette écriture est incorrecte.'
            },
            {
              texte: `$${x}+${k}$`,
              statut: false,
              feedback: 'Tu as confondu somme et produit.'
            },
            {
              texte: `$${x}-${k}$`,
              statut: false,
              feedback: 'Tu as confondu somme et produit.'
            }
          ]
          break
        case 15: // x/k
          texte = `Exprimer le quotient de $${x}$ par ${k} en fonction de $${x}$.`
          texteCorr = `Le quotient de $${x}$ par ${k} peut se noter : $${miseEnEvidence(`${texFractionFromString(x, k)}`)}$.`
          this.autoCorrection[i].propositions = [
            {
              texte: `$${x}\\div ${k}$`,
              statut: true,
              feedback: 'Correct !'
            },
            {
              texte: `$\\dfrac{${x}}{${k}}$`,
              statut: true,
              feedback: 'Correct !'
            },
            {
              texte: `$${k}\\div ${x}$`,
              statut: false,
              feedback: "C'est l'inverse."
            },
            {
              texte: `$${x}\\times ${k}$`,
              statut: false,
              feedback: 'Cette écriture est incorrecte.'
            },
            {
              texte: `$${x}+${k}$`,
              statut: false,
              feedback: 'Tu as confondu somme et quotient.'
            },
            {
              texte: `$${x}-${k}$`,
              statut: false,
              feedback: 'Tu as confondu différence et quotient.'
            }
          ]
          break
        case 14: // k/x
          texte = `Exprimer le quotient de ${k} par $${x}$ en fonction de $${x}$.`
          texteCorr = `Le quotient de ${k} par $${x}$ peut se noter : $${miseEnEvidence(`${texFractionFromString(k, x)}`)}$.`
          this.autoCorrection[i].propositions = [
            {
              texte: `$${k}\\div ${x}$`,
              statut: true,
              feedback: 'Correct !'
            },
            {
              texte: `$\\dfrac{${k}}{${x}}$`,
              statut: true,
              feedback: 'Correct !'
            },
            {
              texte: `$${x}\\div ${k}$`,
              statut: false,
              feedback: "C'est l'inverse."
            },
            {
              texte: `$${k}\\times ${x}$`,
              statut: false,
              feedback: 'Tu as confondu produit et quotient.'
            },
            {
              texte: `$${x}\\times ${k}$`,
              statut: false,
              feedback: 'Tu as confondu produit et quotient.'
            },
            {
              texte: `$${k}-${x}$`,
              statut: false,
              feedback: 'Tu as confondu différence et quotient.'
            }
          ]
          break
        case 13: // xy
          texte = `Comment peut se noter le produit de $${x}$ par $${y}$ ?`
          texteCorr = `Le produit de $${x}$ par $${y}$ peut se noter $${miseEnEvidence(`${x}${y}`)}$.`
          this.autoCorrection[i].propositions = [
            {
              texte: `$${y}${x}$`,
              statut: true,
              feedback: 'Correct !'
            },
            {
              texte: `$${x}${y}$`,
              statut: true,
              feedback: 'Correct !'
            },
            {
              texte: `$${y}\\times ${x}$`,
              statut: true,
              feedback: 'Correct, mais non simplifié.'
            },
            {
              texte: `$${x}+${y}$`,
              statut: false,
              feedback: 'Tu as confondu somme et produit.'
            },
            {
              texte: `$${y}+${x}$`,
              statut: false,
              feedback: 'Tu as confondu somme et produit.'
            },
            {
              texte: `$${x}-${y}$`,
              statut: false,
              feedback: 'Tu as confondu différence et produit.'
            }
          ]
          break
        case 16: // pair
          texte = 'Écrire une expression littérale qui permet de représenter un nombre pair.'
          texteCorr = `Un nombre pair peut s'écrire sous la forme $${miseEnEvidence('2n')}$ avec $n$ un entier naturel.`
          this.autoCorrection[i].propositions = [
            {
              texte: '$2n$',
              statut: true,
              feedback: 'Correct !'
            },
            {
              texte: '$2(n+1)$',
              statut: true,
              feedback: 'Correct !'
            },
            {
              texte: '$n+2$',
              statut: false,
              feedback: 'Le nombre n est-il pair ?'
            },
            {
              texte: '$n-2$',
              statut: false,
              feedback: 'Le nombre n est-il pair ?'
            },
            {
              texte: '$n\\div 2$',
              statut: false,
              feedback: 'Le résultat est-il un nombre entier ?'
            },
            {
              texte: '$n^2$',
              statut: false,
              feedback: "Le carré d'un nombre impair est-il pair ?"
            }
          ]
          break
        case 17: // impair
          texte = 'Écrire une expression littérale qui permet de représenter un nombre impair.'
          texteCorr = `Un nombre impair peut s'écrire sous la forme $${miseEnEvidence('2n+1')}$ avec $n$ un entier naturel.`
          this.autoCorrection[i].propositions = [
            {
              texte: '$2n+1$',
              statut: true,
              feedback: 'Correct !'
            },
            {
              texte: '$n+1$',
              statut: false,
              feedback: 'Que se passe-t-il si n est un nombre impair ?'
            },
            {
              texte: '$n+3$',
              statut: false,
              feedback: 'Que se passe-t-il si n est un nombre impair ?'
            },
            {
              texte: '$3n$',
              statut: false,
              feedback: 'Et si n est un nombre pair ?'
            },
            {
              texte: '$n-1$',
              statut: false,
              feedback: 'Que se passe-t-il si n est un nombre impair ?'
            },
            {
              texte: '$n+7$',
              statut: false,
              feedback: 'Que se passe-t-il si n est un nombre impair ?'
            }
          ]
          break
        case 18: // multiple de k
          texte = `Écrire une expression littérale qui permet de représenter un multiple de ${k}.`
          texteCorr = `Un multiple de ${k} peut s'écrire sous la forme $${miseEnEvidence(`${k}n`)}$ avec $n$ un entier naturel.`
          this.autoCorrection[i].propositions = [
            {
              texte: `$${k}n$`,
              statut: true,
              feedback: 'Correct !'
            },
            {
              texte: `$${k}\\times n$`,
              statut: true,
              feedback: 'Correct !'
            },
            {
              texte: `$${k}+n$`,
              statut: false,
              feedback: 'Tu as confondu produit et somme.'
            },
            {
              texte: `$${k}-n$`,
              statut: false,
              feedback: 'Tu as confondu produit et différence.'
            },
            {
              texte: `$\\dfrac{${k}}{n}$`,
              statut: false,
              feedback: ''
            },
            {
              texte: `$n-${k}$`,
              statut: false,
              feedback: 'Tu as confondu produit et différence.'
            }
          ]
          break
      }
      this.autoCorrection[i].enonce = `${texte}\n`
      if (this.questionJamaisPosee(i, texte)) { // Si la question n'a jamais été posée, on en créé une autre
        const props = propositionsQcm(this, i)
        if (this.interactif) {
          texte += props.texte
        }
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaire2Texte = ['Type de questions', [
    'Nombres séparés par des tirets',
    ' 1 : Double',
    ' 2 : Triple',
    ' 3 : Moitié',
    ' 4 : Quart',
    ' 5 : Entier suivant',
    ' 6 : Entier précédent',
    ' 7 : Carré',
    ' 8 : Cube',
    ' 9 : Opposé',
    '10 : Inverse',
    '11 : Somme de deux nombres',
    '12 : Produit de deux nombres V1',
    '13 : Produit de deux nombres V2',
    '14 : Quotient de deux nombres V1',
    '15 : Quotient de deux nombres V2',
    '16 : Nombre pair',
    '17 : Nombre impair',
    '18 : Multiple',
    '19 : Mélange'
  ].join('\n')
  ]
}
