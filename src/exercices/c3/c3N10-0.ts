import { shuffle2tableaux } from '../../lib/outils/arrayOutils'
import Exercice from '../Exercice'
import { contraindreValeur, gestionnaireFormulaireTexte, randint } from '../../modules/outils.js'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import Decimal from 'decimal.js'
import { stringNombre, texNombre } from '../../lib/outils/texNombre'
import { glossaire } from './c3N10-1'
import DragAndDrop from '../../lib/interactif/DragAndDrop'
export const titre = 'Décomposition entier par drag and drop'
export const interactifReady = true
export const interactifType = 'mathLive'

export const dateDeModifImportante = '25/08/2024'
/**
 * Exercice modèle pour la nouvelle fonctionnalité de Drag&Drop
 * @author Jean-Claude Lhote
 * Référence c3N10-0
*/
export const uuid = '6498e'
export const refs = {
  'fr-fr': ['c3N10-0'],
  'fr-ch': []
}
class DragAndDropNumerationEntiere extends Exercice {
  dragAndDrops: DragAndDrop[]
  nombreDeChiffresMin: number
  morceaux!: string[][]
  exposantMorceaux!: number[][]
  constructor () {
    super()
    this.interactif = false
    this.nombreDeChiffresMin = 4
    this.nbQuestions = 4
    this.sup = false // false pour des puissances de 10 en chiffres, true pour lettres
    this.besoinFormulaireCaseACocher = [
      'Puissance de 10 en chiffres/lettres',
      false
    ]
    this.besoinFormulaire2Numerique = [
      'Nombre de chiffres maximum des nombres à décomposer',
      7
    ]
    this.sup2 = 4
    this.besoinFormulaire4Texte = [
      'Présence de zéro(s) ',
      'Nombres séparés par des tirets\n1 : Sans zéro\n2 : Avec un zéro\n3 : Avec deux zéros consécutifs\n4 : Mélange'
    ]
    this.sup4 = '4'
    this.besoinFormulaire5CaseACocher = ['Décomposition désordonnée', false]
    this.sup5 = false
    this.dragAndDrops = []
  }

  nouvelleVersion () {
    this.reinit()
    // Pour activer le mélange
    const desordonne = this.sup5
    const enLettre = this.sup
    const presenceZeros = gestionnaireFormulaireTexte({
      saisie: this.sup4,
      min: 1,
      max: 3,
      defaut: 4,
      melange: 4,
      nbQuestions: this.nbQuestions
    })
    // ça c'est pour éviter de ne pas pouvoir fabriquer les nombres.
    const nombreDeChiffresMin = this.nombreDeChiffresMin
    const nombreDeChiffresMax = contraindreValeur(
      nombreDeChiffresMin,
      11,
      this.sup2,
      6
    )
    this.morceaux = []
    this.exposantMorceaux = []
    for (
      let i = 0, cpt = 0, texte: string, texteCorr:string;
      i < this.nbQuestions && cpt < 50;
    ) {
      texte = ''
      texteCorr = ''
      const nbChiffres = randint(nombreDeChiffresMin, nombreDeChiffresMax)
      let nombreStr = ''

      this.morceaux[i] = []
      this.exposantMorceaux[i] = []
      const presenceDeZeros = Number(presenceZeros[i])

      for (let k = 0; k < nbChiffres; k++) {
        nombreStr += randint(1, 9, Array.from(nombreStr).map(Number)).toString()
      }
      if (presenceDeZeros > 1) {
        const arrayFromNbr = Array.from(nombreStr).map(Number)
        const indexOfZero = randint(1, arrayFromNbr.length - 2)
        arrayFromNbr[indexOfZero] = 0
        if (presenceDeZeros === 3) arrayFromNbr[indexOfZero + 1] = 0
        nombreStr = arrayFromNbr.map(String).join('')
      }
      const nombre = new Decimal(nombreStr)
      texte += `Décomposer le nombre $${texNombre(nombre, 0)}$ en complétant avec les ${enLettre ? 'adjectifs numéraux' : 'valeurs'} qui conviennent ${enLettre ? 'unité, dizaine(s), centaine(s)...' : `($1, 10, 100,${texNombre(1000, 3)},...$)`}.<br>`
      // texte += `$${texNombre(nombre, 0)}=`

      texteCorr = `$${texNombre(nombre, 0)}=`
      for (let k = 0; k < nbChiffres; k++) {
      // on prépare la correction pour l'exo non interactif
        this.morceaux[i][k] = nombreStr[k]
        this.exposantMorceaux[i][k] = nbChiffres - 1 - k
      }
      if (desordonne) {
        shuffle2tableaux(this.morceaux[i], this.exposantMorceaux[i])
      }
      let enonceATrous = `$${stringNombre(nombre, 0)}=$ `
      const etiquettes = []
      const reponses = []
      const callback = (e) => {
        const rectangle = e.target
        const spanPrec = rectangle.previousSibling
        if (spanPrec) {
          const nombre = Number(spanPrec.textContent)
          if (nombre > 1) {
            const texte = rectangle.textContent
            rectangle.innerHTML = rectangle.innerHTML.replace(
              texte,
              `${texte}s`
            )
          }
        }
      }
      for (let e = 0; e < 7; e++) {
        if (enLettre) {
          etiquettes.push({
            id: String(2 * e + 1),
            contenu: glossaire[e][0]
          })
          if (e !== 3) {
            etiquettes.push({
              id: String(2 * e + 2),
              contenu: glossaire[e][1]
            })
          }
        } else {
          etiquettes.push({
            id: String(e + 1),
            contenu: `× ${stringNombre(10 ** e, 0)}`
          })
        }
      }
      for (
        let k = 0, indiceRectangle = 1;
        k < this.morceaux[i].length;
        k++
      ) {
        if (this.morceaux[i][k] !== '0') {
          enonceATrous += `$${this.morceaux[i][k]}$%{rectangle${indiceRectangle}}$+$`
          if (this.exposantMorceaux[i][k] === 3) {
            reponses.push([
            `rectangle${indiceRectangle++}`,
            { value: enLettre ? String(2 * this.exposantMorceaux[i][k] + 1) : String(this.exposantMorceaux[i][k] + 1) }
            ])
          } else {
            const shift = Number(this.morceaux[i][k]) > 1 ? 1 : 0
            reponses.push([
              `rectangle${indiceRectangle++}`,
              {
                value: enLettre ? String(2 * this.exposantMorceaux[i][k] + 1 + shift) : String(this.exposantMorceaux[i][k] + 1),
                callback
              }
            ])
          }
        }
      }
      const objetReponse = Object.fromEntries(reponses)
      enonceATrous = `${enonceATrous.substring(0, enonceATrous.length - 3)}`
      const leDragAndDrop = new DragAndDrop({
        exercice: this,
        question: i,
        etiquettes,
        consigne: `Remettre les étiquettes au bon endroit pour reconstituer le nombre $${texNombre(nombre, 0)}$`,
        enonceATrous
      })
      handleAnswers(this, i, objetReponse, { formatInteractif: 'dnd' })
      texte += leDragAndDrop.ajouteDragAndDrop()
      for (let k = 0; k < this.morceaux[i].length; k++) {
        if (this.morceaux[i][k] !== '0') {
          texteCorr += enLettre
            ? `${this.morceaux[i][k]}~\\text{${glossaire[this.exposantMorceaux[i][k]][this.morceaux[i][k] > 1 ? 1 : 0]}}+`
            : `(${this.morceaux[i][k]}\\times ${texNombre(10 ** this.exposantMorceaux[i][k], 0)})+`
        }
      }
      texte = `${texte.substring(0, texte.length - 1)}$`
      texteCorr = `${texteCorr.substring(0, texteCorr.length - 1)}$`
      if (this.questionJamaisPosee(i, nombreStr)) {
        this.dragAndDrops.push(leDragAndDrop) // on stocke les instances de dragAndDrop dans l'exercice pour pouvoir accéder aux listeners à supprimer lors de la vérification.
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
  }
}
export default DragAndDropNumerationEntiere
