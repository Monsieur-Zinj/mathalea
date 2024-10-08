import { choice } from '../../lib/outils/arrayOutils'
import {
  arrondi,
  nombreDeChiffresDansLaPartieDecimale,
  nombreDeChiffresDansLaPartieEntiere
} from '../../lib/outils/nombres'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { context } from '../../modules/context.js'
import Operation from '../../modules/operations.js'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { setReponse } from '../../lib/interactif/gestionInteractif'
import { miseEnEvidence } from '../../lib/outils/embellissements'

export const amcReady = true
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcType = 'AMCNum'
export const titre = 'Calculer la valeur décimale d\'une fraction'
export const dateDePublication = '18/11/2021'
export const dateDeModifImportante = '23/02/2024'

/**
 * Calculer la valeur décimale des fractions suivantes.
 *
 * Niveau de difficulté 1 :
 * * entier divisé par 4 quotient : xx,25 ou xx,75
 * * entier divisé par 8 quotient : x,125 ou x,375 ou x,625 ou x,875
 * * entier divisé par 6 quotient : xxx,5
 * * quotient xx,xx division par 2, 3 , 4 ou 5
 * * quotient x,xxx division par 6 à 9
 * * un 0 dans le quotient
 *
 * Niveau de difficulté 2 : division par 3, 7 ou 9
 * @author Mireille Gain, s'inspirant de 6C31
 */
export const uuid = 'd5e44'
export const ref = '6N23-6'
export const refs = {
  'fr-fr': ['6N23-6'],
  'fr-ch': ['9NO10-7']
}
export default function DivisionFraction () {
  Exercice.call(this)
  this.consigne = 'Calculer la valeur décimale des fractions suivantes.'
  this.spacing = 2
  context.isHtml ? (this.spacingCorr = 2) : (this.spacingCorr = 1) // Important sinon opdiv n'est pas joli
  this.nbQuestions = 4
  this.sup = 1
  // this.sup2 = false
  this.sup3 = '10'

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []

    const listeTypeDeQuestions = gestionnaireFormulaireTexte({
      saisie: this.sup3,
      min: this.sup === 1 ? 1 : 7,
      max: this.sup === 1 ? 6 : 9,
      defaut: 10,
      melange: 10,
      nbQuestions: this.nbQuestions
    })
    for (
      let i = 0, texte, texteCorr, cpt = 0, a, b, q;
      i < this.nbQuestions && cpt < 50;
    ) {
      switch (listeTypeDeQuestions[i]) {
        case 1: // fraction : entier divisé par 4 quotient : xx,25 ou xx,75
          b = 4
          a = (randint(2, 9) * 10 + randint(2, 9)) * 4 + choice([1, 3])
          q = a / b
          break
        case 2: // fraction : entier divisé par 8 quotient : x,125 ou x,375 ou x,625 ou x,875
          b = 8
          a = randint(2, 9) * 8 + choice([1, 3, 5, 7])
          q = a / b
          break
        case 3: // fraction : entier divisé par 6 quotient : xxx,5
          b = 6
          q = arrondi(randint(2, 9) * 100 + randint(2, 9) * 10 + randint(2, 9) + 0.5, 1)
          a = q * 6
          break
        case 4: // fraction : entier divisé par 2
          b = 2
          a = randint(3, 50) * 2 + 1
          q = a / b
          break
        case 5: // fraction : entier divisé par 5
          b = 5
          a = randint(3, 50) * 2 + 1
          q = a / b
          break
        case 6: // fraction : entier divisé par 10
          b = 10
          a = randint(0, 3) * 100 + randint(1, 9) * 10 + randint(1, 0)
          q = a / b
          break
        case 7: // dénominateur = 7
          a = randint(2, 9) * 7 + randint(1, 6)
          b = 7
          q = arrondi(a / b, 3)
          break
        case 8: // dénominateur = 9
          a = randint(11, 19) * 9 + randint(1, 8)
          b = 9
          q = arrondi(a / b, 3)
          break
        case 9: // dénominateur = 3
          a = randint(11, 99) * 3 + randint(1, 2)
          b = 3
          q = arrondi(a / b, 3)
      }
      if (this.sup === 2) {
        this.consigne = 'Calculer une valeur approchée au centième près des fractions suivantes.'
        q = arrondi(q, 2)
      }
      texte = `$${texFraction(texNombre(a), texNombre(b))}`
      if (this.sup === 1) {
        texteCorr = Operation({ operande1: a, operande2: b, type: 'division', precision: 3 })
        texteCorr += `<br>$${texFraction(texNombre(a), texNombre(b))}=${miseEnEvidence(texNombre(q))}$`
      } else {
        texteCorr = Operation({ operande1: a, operande2: b, type: 'division', precision: 3 })
        texteCorr += `<br>$${texFraction(texNombre(a), texNombre(b))}\\approx${miseEnEvidence(texNombre(q, 2))}$`
      }
      setReponse(this, i, q)
      if (context.isHtml && this.interactif) {
        if (this.sup === 1) {
          texte += '~=$'
        } else {
          texte += '~\\approx$'
        }
        texte += ajouteChampTexteMathLive(this, i, 'largeur01 inline nospacebefore')
      } else {
        texte += '$'
      }
      if (context.isAmc) {
        this.autoCorrection[i].enonce = texte
        this.autoCorrection[i].propositions = [{ texte: texteCorr, statut: '' }]
        this.autoCorrection[i].reponse.param = {
          digits: nombreDeChiffresDansLaPartieEntiere(q) + nombreDeChiffresDansLaPartieDecimale(q) + 2,
          decimals: nombreDeChiffresDansLaPartieDecimale(q) + 1,
          signe: false,
          exposantNbChiffres: 0
        }
      }
      if (this.questionJamaisPosee(i, a, b, q)) {
        // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = [
    'Type de questions',
    2,
    '1 : Déterminer le quotient exact\n2 : Déterminer un quotient approché au centième près'
  ]
  // this.besoinFormulaire2CaseACocher = ['Exercice à la carte (à paramétrer dans le formulaire suivant)', false]
  this.besoinFormulaire3Texte = ['Types de questions', `Nombres séparés par des tirets
1 : entier divisé par 4 (quotient exact)
2 : entier divisé par 8 (quotient exact)
3 : entier divisé par 6 (quotient exact)
4 : entier divisé par 2 (quotient exact)
5 : entier divisé par 5 (quotient exact)
6 : entier divisé par 10 (quotient exact)
7 : entier divisé par 7 (quotient approché)
8 : entier divisé par 9 (quotient approché)
9 : entier divisé par 3 (quotient approché)
10 : Mélange`]
}

function texFraction (num, den) {
  return `\\dfrac{${num}}{${den}}`
}
