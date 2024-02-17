import Exercice from '../Exercice'
import { glossaire } from './c3N10-1'
import { randint } from '../../modules/outils'
import { remplisLesBlancs } from '../../lib/interactif/questionMathLive'
import { texNombre } from '../../lib/outils/texNombre'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { shuffle } from '../../lib/outils/arrayOutils'
export const uuid = 'e116b'
export const ref = 'c3N10-2'
export const refs = {
  'fr-fr': ['c3N10-2']
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
    this.besoinFormulaireNumerique = ['Nombre de chiffres significatifs', 8]
    this.besoinFormulaire2CaseACocher = ['Présence de zéros à l\'intérieur du nombre', false]
    this.besoinFormulaire3CaseACocher = ['décomposition ordonnée', false]
  }

  nouvelleVersion () {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []

    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 100;) {
      const nombreArray: number[] = []
      const chiffresAvecExposantOrd: {chiffre: number, exposant:number}[] = []
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
        chiffresAvecExposantOrd.push({ chiffre: nombreArray[k], exposant: k })
      }
      nombreArray.reverse()
      chiffresAvecExposantOrd.reverse()
      const chiffresAvecExposant = this.sup3 ? chiffresAvecExposantOrd.filter(el => el.chiffre !== 0) : shuffle(chiffresAvecExposantOrd.filter(el => el.chiffre !== 0))
      // reverse() modifie nombreArray ! c'est maintenant l'élément 0, le chiffre de poids le plus fort.
      // on injecte un zéro s'il n'y en a pas si this.sup2 est à true

      // Le nombre complet écrit sans espace
      const nombreStr = nombreArray.map(el => String(el)).join('')
      const items = chiffresAvecExposant.filter(el => el.chiffre !== 0)
      let decompo = ''
      const objetReponses: Record<string, {value: string}> = {}
      for (let k = 0; k < items.length; k++) {
        decompo += `%{champ${k + 1}}\\text{${glossaire[items[k].exposant][items[k].chiffre > 1 ? 1 : 0]}}+`
        objetReponses[`champ${k + 1}`] = { value: String(items[k].chiffre) }
      }
      handleAnswers(this, i, objetReponses, { formatInteractif: 'fillInTheBlank' })
      decompo = decompo.substring(0, decompo.length - 1)
      const texte = remplisLesBlancs(this, i, texNombre(Number(nombreStr), 0) + '=' + decompo, '', '\\ldots')
      const morceaux = items.map((el) => `${String(el.chiffre)}\\text{${glossaire[el.exposant][el.chiffre > 1 ? 1 : 0]} }`)
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
