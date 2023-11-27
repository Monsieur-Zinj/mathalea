import { combinaisonListes } from '../../lib/outils/arrayOutils.js'
import { lettreDepuisChiffre } from '../../lib/outils/outilString.js'
import Exercice from '../Exercice.js'
import { egal, randint, printlatex, listeQuestionsToContenuSansNumero } from '../../modules/outils.js'
import { context } from '../../modules/context.js'
import { tableauColonneLigne } from '../../lib/2d/tableau.js'
import { AddTabDbleEntryMathlive } from '../../lib/interactif/tableaux/AjouteTableauMathlive'
import { setReponse } from '../../lib/interactif/gestionInteractif.js'
import { ComputeEngine } from '@cortex-js/compute-engine'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
export const titre = 'Table de double distributivité'
export const dateDePublication = '23/02/2023'
export const interactifReady = true
export const interactifType = 'custom'
const ce = new ComputeEngine()
/**
* Développer des expressions de double distributivité à l'aide d'un tableau de multiplication
* @author Sébastien LOZANO
*/

export const uuid = 'c8403'
export const ref = '3L11-10'
export default function TableDoubleDistributivite () {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.nbCols = 1
  this.nbColsCorr = 1
  this.spacing = context.isHtml ? 3 : 2
  this.spacingCorr = context.isHtml ? 3 : 2
  this.nbQuestions = 5
  this.sup = 1
  this.tailleDiaporama = 3
  this.listeAvecNumerotation = false
  this.exoCustomResultat = true

  this.nouvelleVersion = function () {
    this.answers = {}
    this.consigne = this.nbQuestions > 1 ? 'Dans chaque cas, compléter les tables de multiplication, écrire le développement obtenu et le réduire.' : 'Compléter la table de multiplication, écrire le développement obtenu et le réduire.'
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []

    let typesDeQuestionsDisponibles = [1, 2]
    if (this.sup === 2) {
      typesDeQuestionsDisponibles = [3, 4]
    } else if (this.sup === 3) {
      typesDeQuestionsDisponibles = [1, 2, 3, 4]
    }

    const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions)
    this.autoCorrection = []
    for (let i = 0, texte, texteCorr, termesRectangles, developpements, cpt = 0, a, b, c, d, typesDeQuestions; i < this.nbQuestions && cpt < 50;) {
      typesDeQuestions = listeTypeDeQuestions[i]
      a = randint(2, 9)
      b = randint(2, 9)
      c = randint(2, 9, [a])
      d = randint(2, 9, [b])
      let L1C1, L1C2, L2C1, L2C2
      this.autoCorrection[i] = {}
      switch (typesDeQuestions) {
        case 1: // (x+b)(x+d)
          b = randint(2, 10)
          d = randint(2, 12)
          texte = `$${lettreDepuisChiffre(i + 1)} = (x+${b})(x+${d})$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)} = (x+${b})(x+${d})$`
          termesRectangles = [1, d, b, b * d]
          developpements = {
            eclate: `x^2+${b}x+${d}x+${b * d}`,
            reduit: `x^2+${b + d}x+${b * d}`
          }
          L1C1 = 'x^2'
          L1C2 = `${b}x`
          L2C1 = `${d}x`
          L2C2 = `${b * d}`
          break
        case 2: // (ax+b)(cx+d)
          texte = `$${lettreDepuisChiffre(i + 1)} = (${a}x+${b})(${c}x+${d})$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)} = (${a}x+${b})(${c}x+${d})$`
          termesRectangles = [a * c, a * d, b * c, b * d]
          developpements = {
            eclate: `${a * c}x^2+${a * d}x+${b * c}x+${b * d}`,
            reduit: `${a * c}x^2+${a * d + b * c}x+${b * d}`
          }
          L1C1 = `${a * c}x^2`
          L1C2 = `${b * c}x`
          L2C1 = `${a * d}x`
          L2C2 = `${b * d}`
          break
        case 3: // (ax-b)(cx+d)
          texte = `$${lettreDepuisChiffre(i + 1)} = (${a}x-${b})(${c}x+${d})$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)} = (${a}x-${b})(${c}x+${d})$`
          if (egal(a * d - b * c, 0)) {
            developpements = {
              eclate: `${a * c}x^2+${d * a}x-${b * c}x-${b * d}`,
              reduit: `${printlatex(`${a * c}*x^2-${b * d}`)}`
            }
          } else {
            developpements = {
              eclate: `${a * c}x^2+${d * a}x-${b * c}x-${b * d}`,
              reduit: `${printlatex(`${a * c}*x^2+(${d * a - b * c})*x-${b * d}`)}`
            }
          }
          termesRectangles = [a * c, a * d, -b * c, -b * d]
          L1C1 = `${a * c}x^2`
          L1C2 = `${-b * c}x`
          L2C1 = `${a * d}x`
          L2C2 = `${-b * d}`
          break
        case 4: // (ax-b)(cx-d)
          texte = `$${lettreDepuisChiffre(i + 1)} = (${a}x-${b})(${c}x-${d})$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)} = (${a}x-${b})(${c}x-${d})$`
          termesRectangles = [a * c, -a * d, -b * c, b * d]
          developpements = {
            eclate: `${a * c}x^2-${a * d}x-${b * c}x+${b * d}`,
            reduit: `${a * c}x^2-${a * d + b * c}x+${b * d}`
          }
          L1C1 = `${a * c}x^2`
          L1C2 = `${-b * c}x`
          L2C1 = `${-a * d}x`
          L2C2 = `${b * d}`
          break
      }
      texte += context.isHtml ? '<br>' : '\\par\\medskip'
      let entetesCol, entetesLgn, contenu
      if (typesDeQuestions === 1) {
        entetesCol = ['\\times', 'x', `${b}`]
        entetesLgn = ['x', `${d}`]
        contenu = [`\\phantom{${termesRectangles[0]}x}`, `\\phantom{${termesRectangles[1]}}`, `\\phantom{${termesRectangles[2]}x}`, `\\phantom{${termesRectangles[3]}}`]
      }
      if (typesDeQuestions === 2) {
        entetesCol = ['\\times', `${a}x`, `${b}`]
        entetesLgn = [`${c}x`, `${d}`]
        contenu = [`\\phantom{${termesRectangles[0]}x}`, `\\phantom{${termesRectangles[1]}}`, `\\phantom{${termesRectangles[2]}x}`, `\\phantom{${termesRectangles[3]}}`]
      }
      if (typesDeQuestions === 3) {
        entetesCol = ['\\times', `${a}x`, `${-b}`]
        entetesLgn = [`${c}x`, `${d}`]
        contenu = [`\\phantom{${termesRectangles[0]}x}`, `\\phantom{${termesRectangles[1]}}`, `\\phantom{${termesRectangles[2]}x}`, `\\phantom{${termesRectangles[3]}}`]
      }
      if (typesDeQuestions === 4) {
        entetesCol = ['\\times', `${a}x`, `${-b}`]
        entetesLgn = [`${c}x`, `${-d}`]
        contenu = [`\\phantom{${termesRectangles[0]}x}`, `\\phantom{${termesRectangles[1]}}`, `\\phantom{${termesRectangles[2]}x}`, `\\phantom{${termesRectangles[3]}}`]
      }
      if (this.interactif) {
        const tableauVide = AddTabDbleEntryMathlive.convertTclToTableauMathlive(entetesCol, entetesLgn, ['', '', '', ''])
        const tabMathlive = AddTabDbleEntryMathlive.create(this, i, tableauVide, 'nospacebefore')
        texte += tabMathlive.output
        setReponse(this, i, { L1C1, L1C2, L2C1, L2C2 }, { formatInteractif: 'tableauMathlive' })
      } else {
        texte += tableauColonneLigne(entetesCol, entetesLgn, contenu)
      }
      texte += context.isHtml ? '<br> Développement : ' : '\\par\\medskip Développement : '
      texte += ajouteChampTexteMathLive(this, 2 * i, 'inline', { tailleExtensible: true })
      texte += context.isHtml ? '<br> Développement réduit : ' : '\\par\\medskip Développement réduit: '
      texte += ajouteChampTexteMathLive(this, 2 * i + 1, 'inline', { tailleExtensible: true })
      texteCorr += context.isHtml ? '<br>' : '\\par\\medskip'
      if (typesDeQuestions === 1) {
        texteCorr += tableauColonneLigne(['\\times', 'x', `${b}`], ['x', `${d}`], [`${termesRectangles[0] === 1 ? '' : termesRectangles[0]}x^2`, `${termesRectangles[2]}x`, `${termesRectangles[1]}x`, `${termesRectangles[3]}`])
      }
      if (typesDeQuestions === 2) {
        texteCorr += tableauColonneLigne(['\\times', `${a}x`, `${b}`], [`${c}x`, `${d}`], [`${termesRectangles[0] === 1 ? '' : termesRectangles[0]}x^2`, `${termesRectangles[2]}x`, `${termesRectangles[1]}x`, `${termesRectangles[3]}`])
      }
      if (typesDeQuestions === 3) {
        texteCorr += tableauColonneLigne(['\\times', `${a}x`, `${-b}`], [`${c}x`, `${d}`], [`${termesRectangles[0] === 1 ? '' : termesRectangles[0]}x^2`, `${termesRectangles[2]}x`, `${termesRectangles[1]}x`, `${termesRectangles[3]}`])
      }
      if (typesDeQuestions === 4) {
        texteCorr += tableauColonneLigne(['\\times', `${a}x`, `${-b}`], [`${c}x`, `${-d}`], [`${termesRectangles[0] === 1 ? '' : termesRectangles[0]}x^2`, `${termesRectangles[2]}x`, `${termesRectangles[1]}x`, `${termesRectangles[3]}`])
      }
      texteCorr += context.isHtml ? '<br>' : '\\par\\medskip '
      texteCorr += `Développement : $${lettreDepuisChiffre(i + 1)} = ${developpements.eclate}$`
      texteCorr += context.isHtml ? '<br>' : '\\par\\medskip '
      texteCorr += `Développement réduit : $${lettreDepuisChiffre(i + 1)} = ${developpements.reduit}$`
      // texteCorr += context.isHtml ? '<br>' : '\\par\\bigskip'
      this.autoCorrection[i].reponse = { L1C1, L1C2, L2C1, L2C2, developpements }
      if (this.questionJamaisPosee(i, a, b, c, d, typesDeQuestions[i])) {
        // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenuSansNumero(this)
  }
  this.besoinFormulaireNumerique = ['Niveau de difficulté', 3, ' 1 : (x+a)(x+b) et (ax+b)(cx+d)\n 2 : (ax-b)(cx+d) et (ax-b)(cx-d)\n 3 : Mélange']

  this.correctionInteractive = (i) => {
    const tableId = `tabMathliveEx${this.numeroExercice}Q${i}`
    const tableau = document.querySelector(`table#${tableId}`)
    if (tableau == null) throw Error('La correction de 3L11-10 n\'a pas trouvé le tableau interactif.')
    const result = []
    for (const k of [1, 2]) {
      for (const j of [1, 2]) {
        const answer = tableau.querySelector(`math-field#Ex${this.numeroExercice}Q${i}L${j}C${k}`)
        if (answer == null) throw Error(`Il n'y a pas de math-field d'id "Ex${this.numeroExercice}Q${i}L${j}C${k}" dans ce tableau !`)
        const valeur = answer.expression
        const divFeedback = tableau.querySelector(`div#divDuSmileyEx${this.numeroExercice}Q${i}L${j}C${k}`)
        if (valeur) this.answers[`math-field#Ex${this.numeroExercice}Q${i}L${j}C${k}`] = String(valeur)
        if (divFeedback) {
          if (valeur.isEqual(ce.parse(this.autoCorrection[i].reponse[`L${j}C${k}`]))) {
            divFeedback.innerHTML = divFeedback.innerHTML += '😎'
            result.push('OK')
          } else {
            divFeedback.innerHTML += '☹️'
            result.push('KO')
          }
        }
      }
    }
    const developpements = this.autoCorrection[i].reponse.developpements
    const mfDevEclate = document.getElementById(`champTexteEx${this.numeroExercice}Q${2 * i}`)
    const mfDevReduit = document.getElementById(`champTexteEx${this.numeroExercice}Q${2 * i + 1}`)
    if (!mfDevEclate || !mfDevReduit) throw Error('3L11-10 : il manque un mathfield pour la correction de l\'exo')
    const spanReponseLigne1 = document.querySelector(`#resultatCheckEx${this.numeroExercice}Q${2 * i}`)
    this.answers[`Ex${this.numeroExercice}Q${2 * i}`] = mfDevEclate.value
    this.answers[`Ex${this.numeroExercice}Q${2 * i + 1}`] = mfDevReduit.value
    if (ce.parse(developpements.eclate, { canonical: true }).isEqual(ce.parse(mfDevEclate.value, { canonical: true }))) {
      if (spanReponseLigne1) {
        spanReponseLigne1.innerHTML = spanReponseLigne1.innerHTML += '😎'
        result.push('OK')
      }
    } else {
      spanReponseLigne1.innerHTML += '☹️'
      result.push('KO')
    }
    const spanReponseLigne2 = document.querySelector(`#resultatCheckEx${this.numeroExercice}Q${2 * i + 1}`)
    if (ce.parse(developpements.reduit, { canonical: true }).isSame(mfDevReduit.expression.canonical)) {
      if (spanReponseLigne1) {
        spanReponseLigne2.innerHTML = spanReponseLigne2.innerHTML += '😎'
        result.push('OK')
      }
    } else {
      spanReponseLigne2.innerHTML += '☹️'
      result.push('KO')
    }
    return result
  }
}
