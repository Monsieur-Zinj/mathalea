import Exercice from '../Exercice'
import { glossaire } from './c3N10-1'
import { randint } from '../../modules/outils'
import { ajouteFeedback, remplisLesBlancs } from '../../lib/interactif/questionMathLive'
import { texNombre } from '../../lib/outils/texNombre'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { choice, combinaisonListes, shuffle } from '../../lib/outils/arrayOutils'
import { numerationCompare } from '../../lib/interactif/comparisonFunctions'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard'
export const uuid = 'e116b'
export const ref = 'c3N10-2'
export const refs = {
  'fr-fr': ['c3N10-2'],
  'fr-ch': []
}
export const titre = 'Décomposition de nombre entier version 1'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * Decomposition d'entier version 1 : il faut compléter une décomposition écrite avec des trous pour les chiffres
 * La présence de zéros est paramétrable (valeur par défaut : sans)
 * Le nombre de chiffres est réglable de 1 à 8 (valeur par défaut : 5)
 * On peut choisir de désordonner la décomposition pour éviter le remplissage 'en suivant' (valeur par défaut : non ordonnée)
 * @author Jean-Claude Lhote
 */
class Decomp1 extends Exercice {
  constructor (numeroExercice: number) {
    super()
    this.titre = titre
    this.interactif = false
    this.numeroExercice = numeroExercice
    this.nbQuestions = 5
    this.sup = 5 // nombre de chiffres
    this.sup2 = false
    this.sup3 = false
    this.sup4 = 1
    this.besoinFormulaireNumerique = ['Nombre de chiffres significatifs', 8]
    this.besoinFormulaire2CaseACocher = ['Présence de zéros à l\'intérieur du nombre', false]
    this.besoinFormulaire3CaseACocher = ['vérification singulier/pluriel', false]
    this.besoinFormulaire4Numerique = ['Type de question', 5, '1 : Trouver le chiffre dans l\'ordre\n2 : Trouver la classe dans l\'ordre\n3 : Trouver le chiffre dans le désordre\n4 : Trouver la classe dans le désordre\n5 : Mélange']
  }

  nouvelleVersion () {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []
    const typeDeQuestions = this.sup4 % 2 === 0 ? ['classe'] : this.sup4 < 5 ? ['chiffre'] : ['chiffre', 'classe']

    const listeTypesDeQuestion = combinaisonListes(typeDeQuestions, this.nbQuestions)
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 100;) {
      const ordonne = this.sup4 < 3 || (this.sup4 === 5 && choice([true, false]))
      const nombreArray: number[] = []
      const chiffresAvecExposantOrd: {chiffre: number, exposant:number, classe: string}[] = []
      const nbZeros = this.sup2 ? randint(1, Math.max(this.sup - 2, 1)) : 0
      for (let k = 0; k < this.sup; k++) {
        const chiffre = this.sup2 ? k === this.sup - 1 ? randint(1, 9, nombreArray) : randint(0, 9, nombreArray) : randint(1, 9, nombreArray)
        nombreArray.push(chiffre)
      }
      if (this.sup2) {
        let nbZerosInit = nombreArray.filter(el => el === 0).length
        while (nbZeros > nbZerosInit) {
          const index = randint(0, nombreArray.length - 2)
          if (nombreArray[index] !== 0) {
            nombreArray[index] = 0
            nbZerosInit++
          }
        }
      }
      for (let k = 0; k < nombreArray.length; k++) {
        chiffresAvecExposantOrd.push({ chiffre: nombreArray[k], exposant: k, classe: glossaire[k][nombreArray[k] > 1 ? 1 : 0] })
      }
      nombreArray.reverse()
      chiffresAvecExposantOrd.reverse()
      const chiffresAvecExposantEtClasse = ordonne ? chiffresAvecExposantOrd.filter(el => el.chiffre !== 0) : shuffle(chiffresAvecExposantOrd.filter(el => el.chiffre !== 0))
      // reverse() modifie nombreArray ! c'est maintenant l'élément 0, le chiffre de poids le plus fort.
      // on injecte un zéro s'il n'y en a pas si this.sup2 est à true

      // Le nombre complet écrit sans espace
      const nombreStr = nombreArray.map(el => String(el)).join('')
      const items = chiffresAvecExposantEtClasse.filter(el => el.chiffre !== 0)
      let decompo = ''
      const objetReponses: Record<string, {value: string|{value:string, nombre:boolean}, compare?: unknown}> = {}
      if (listeTypesDeQuestion[i] === 'chiffre') {
        for (let k = 0; k < items.length; k++) {
          decompo += `%{champ${k + 1}}\\text{${glossaire[items[k].exposant][items[k].chiffre > 1 ? 1 : 0]}}+`
          objetReponses[`champ${k + 1}`] = { value: String(items[k].chiffre) }
        }
      } else {
        for (let k = 0; k < items.length; k++) {
          decompo += `${String(items[k].chiffre)}%{champ${k + 1}}+`
          objetReponses[`champ${k + 1}`] = { value: items[k].classe, options: { pluriels: this.sup3 }, compare: numerationCompare }
        }
      }

      handleAnswers(this, i, objetReponses)
      decompo = decompo.substring(0, decompo.length - 1)
      const classe = 'numeration'
      let texte = remplisLesBlancs(this, i, texNombre(Number(nombreStr), 0) + '=' + decompo, classe, '\\ldots')
      texte += ajouteFeedback(this, i)
      const morceaux = items.map((el) => `${String(el.chiffre)}\\text{ ${el.classe} }`)
      const decompStr = morceaux.join('+')
      const texteCorr = `$${texNombre(Number(nombreStr), 0)}=${decompStr}$`
      if (this.questionJamaisPosee(i, nombreStr)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
  }
}

export default Decomp1
