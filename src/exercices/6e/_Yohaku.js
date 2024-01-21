import { contraindreValeur, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import Exercice from '../Exercice.js'
import { Yohaku } from '../../lib/outils/Yohaku'
import { ComputeEngine } from '@cortex-js/compute-engine'
import { context } from '../../modules/context.js'

export const titre = 'Générateur de Yohaku'
export const interactifReady = true
export const interactifType = 'custom'
export const amcReady = true
export const amcType = 'AMCOpen'

export const uuid = '3a377'
export const ref = 'Yohaku'
export const dateDeModificationImportante = '16/12/2023'
/**
 * @author Jean-Claude Lhote
 * @constructor
 */
export default function FabriqueAYohaku () {
  Exercice.call(this)
  this.nbQuestions = 3
  this.sup = 30
  this.sup2 = 1
  this.sup3 = 3
  this.sup4 = false
  this.type = 'entiers'
  this.yohaku = []
  this.besoinFormulaireNumerique = ['Valeur maximale des données', 999]
  this.besoinFormulaire2Numerique = ['Opération', 2, '1 : Addition\n2 : Multiplication']
  this.besoinFormulaire3Numerique = ['Taille de la grille (nombre de cases horizontales)', 5]
  this.besoinFormulaire4CaseACocher = ['Avec aide', false]
  this.nouvelleVersion = function () {
    this.listeQuestions = []
    this.listeCorrections = []
    const type = this.type
    for (let i = 0, cpt = 0, texte, texteCorr; i < this.nbQuestions && cpt < 50;) {
      const donnees = []
      const taille = contraindreValeur(2, 5, this.sup3, 3)
      const valeurMax = contraindreValeur(taille ** 2 + 1, 999, this.sup, 30)
      const operateur = this.sup2 === 1 ? 'addition' : 'multiplication'
      const Case = this.sup4 ? randint(0, taille ** 2 - 1) : null
      const largeur = this.type === 'littéraux' ? operateur === 'addition' ? 4 : 5 : 2
      const yohaku = new Yohaku({
        type,
        taille,
        largeur,
        operation: operateur,
        cellules: donnees,
        Case,
        valeurMax
      })
      yohaku.calculeResultats()
      const mot = type === 'littéraux' ? ['expressions', 'contenues'] : ['nombres', 'contenus']
      this.introduction = operateur === 'addition'
        ? `Les ${mot[0]} en bout de ligne ou de colonne sont les sommes des ${mot[0]} ${mot[1]} dans la ligne ou la colonne.`
        : `Les ${mot[0]} en bout de ligne ou de colonne sont les produits des ${mot[0]} ${mot[1]} dans la ligne ou la colonne.`
      this.introduction += `<br>Compléter ${this.nbQuestions === 1 ? 'la' : 'chaque'} grille avec des ${mot[0]} qui conviennent (plusieurs solutions possibles).<br>`
      texte = yohaku.representation({ numeroExercice: this.numeroExercice, question: i, isInteractif: this.interactif })
      texteCorr = 'La grille ci-dessous n\'est donnée qu\'à titre d\'exemple, il y a d\'autres solutions.<br><br>'
      yohaku.solution = true
      texteCorr += yohaku.representation({ numeroExercice: this.numeroExercice, question: i, isInteractif: false })
      /*
       // ça ne sert à rien à priori ce setReponse : la correction interactive est custom et se fiche des réponses proposées.
      const arrayReponses = []
      for (let l = 0; l < taille; l++) {
        for (let c = 0; c < taille; c++) {
          arrayReponses.push([`L${l + 1}C${c + 1}`, { value: String(yohaku.cellules[l * taille + c]) }])
        }
      }
      const reponses = Object.fromEntries(arrayReponses)
      setReponse(this, i, reponses, { formatInteractif: 'tableauMathlive' })
*/
      this.yohaku[i] = yohaku
      if (this.questionJamaisPosee(i, ...yohaku.cellules)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        if (context.isAmc) {
          this.autoCorrection[i] = {
            enonce: this.introduction + texte,
            propositions: [
              {
                texte: '',
                statut: 1, // OBLIGATOIRE (ici c'est le nombre de lignes du cadre pour la réponse de l'élève sur AMC)
                sanscadre: true // EE : ce champ est facultatif et permet (si true) de cacher le cadre et les lignes acceptant la réponse de l'élève
              }
            ]
          }
        }
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.correctionInteractive = (i) => {
    const taille = parseInt(this.sup3)
    let cell
    const spanFeedback = []
    const saisies = []
    for (let l = 0; l < taille; l++) {
      spanFeedback[l] = []
      for (let c = 0; c < taille; c++) {
        cell = document.getElementById(`champTexteEx${this.numeroExercice}Q${i}L${l + 1}C${c + 1}`)
        if (cell != null) {
          spanFeedback[l][c] = document.querySelector(`span#feedbackEx${this.numeroExercice}Q${i}L${l + 1}C${c + 1}`)
          if (this.yohaku[i].type === 'littéraux') { // on ne parse pas si c'est du littéral. On blinde pour les champs vide.
            if (cell.value != null) saisies[l * taille + c] = cell.value.replace(',', '.') ?? '0'
          } else {
            if (cell.value != null) saisies[l * taille + c] = cell.value.replace(',', '.').replace(/\((\+?-?\d+)\)/, '$1') ?? '0'
            // on peut taper des entiers dans les Yohaku fraction, mais ils doivent être modifiés en fraction pour le calcul
            if (!isNaN(saisies[l * taille + c]) && this.yohaku[i].type.includes('frac')) {
              saisies[l * taille + c] = `\\frac{${saisies[l * taille + c]}}{1}`
            }
          }
        } else if (cell == null && l * taille + c !== this.yohaku[i].Case) {
          window.notify(`Pas de cellule L${l + 1}C${c + 1} dans le document`)
        } else {
          saisies[l * taille + c] = this.yohaku[i].cellules[this.yohaku[i].Case]
        }
      }
    }
    let resultat
    if (this.saisieCoherente(saisies, taille, i)) {
      for (let l = 0; l < taille; l++) {
        for (let c = 0; c < taille; c++) {
          if (spanFeedback[l][c] != null) {
            spanFeedback[l][c].innerHTML = '😎'
          }
        }
      }
      resultat = 'OK'
    } else {
      for (let l = 0; l < taille; l++) {
        for (let c = 0; c < taille; c++) {
          if (spanFeedback[l][c] != null) {
            spanFeedback[l][c].innerHTML = '☹️'
          }
        }
      }
      resultat = 'KO'
    }
    return resultat
  }

  this.saisieCoherente = function (saisies, taille, question) {
    const engine = new ComputeEngine()
    let resultatOK = true
    const test = function (yohaku, i, valeurs, resultatOK) {
      const resultVal = engine.parse(yohaku[question].operate(valeurs))
      const resultatAttendu = engine.parse(yohaku[question].resultats[i])
      if (yohaku.type === 'littéraux') {
        resultatOK = resultatOK && resultVal.isSame(resultatAttendu)
      } else {
        resultatOK = resultatOK && resultVal.isEqual(resultatAttendu)
      }
      return resultatOK
    }
    for (let i = 0; i < taille; i++) {
      const valeurs = []
      for (let j = 0; j < taille; j++) {
        valeurs.push(saisies[i + j * taille] ?? '0')
      }
      resultatOK = test(this.yohaku, i, valeurs, resultatOK)
    }
    for (let i = taille; i < taille * 2; i++) {
      const valeurs = []
      for (let j = 0; j < taille; j++) {
        valeurs.push(saisies[(i - taille) * taille + j] ?? '0')
      }
      resultatOK = test(this.yohaku, i, valeurs, resultatOK)
    }
    return resultatOK
  }
}
