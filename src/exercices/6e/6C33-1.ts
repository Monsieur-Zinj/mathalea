import Exercice from '../Exercice'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { prenom } from '../../lib/outils/Personne'
import { ComputeEngine } from '@cortex-js/compute-engine'
import { combinaisonListes, shuffle } from '../../lib/outils/arrayOutils'
import { miseEnCouleur, miseEnEvidence } from '../../lib/outils/embellissements'
import { handleAnswers } from '../../lib/interactif/gestionInteractif.js' // fonction qui va préparer l'analyse de la saisie
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js' // fonctions de mise en place des éléments interactifs
import { fonctionComparaison } from '../../lib/interactif/comparisonFunctions'
export const interactifReady = true
export const interactifType = 'mathLive'

export const titre = 'Organiser des calculs en une seule ligne'
export const dateDePublication = '31/05/2024'

/**
 * Description didactique de l'exercice
 * @author Guillaume Valmont
*/
export const uuid = '2b06d'
export const refs = {
  'fr-fr': ['6C33-1'],
  'fr-ch': []
}
export default class TraduireDependanceGrandeursTableau extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 1
    this.sup = false
    this.besoinFormulaireCaseACocher = ['Inclure des divisions']
    this.correctionDetailleeDisponible = true
    this.correctionDetaillee = false
  }

  nouvelleVersion () {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []
    const computeEngine = new ComputeEngine()
    const avecDivision = !!this.sup

    const typeQuestionsDisponibles = ['Enchaînement simple', '1 -> 3', '1 -> 4', '2 -> 4']
    const listeTypeQuestions = combinaisonListes(typeQuestionsDisponibles, this.nbQuestions)
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 200;) {
      const A = randint(1, 4)
      const B = randint(1, 6)
      const C = randint(1, 8)
      const D = randint(1, 12)
      const E = randint(1, 20)
      const nombres = shuffle([A, B, C, D, E])
      const signes = avecDivision ? shuffle(['+', '-', '\\times', '\\div']) : combinaisonListes(['+', '-', '\\times'], 4)
      const calcul1 = `${nombres[0]} ${signes[0]} ${nombres[1]}`
      const resultat1 = computeEngine.parse(calcul1).simplify().latex
      let calcul2 = `${resultat1} ${signes[1]} ${nombres[2]}`
      let resultat2 = computeEngine.parse(calcul2).simplify().latex
      let calcul3 = `${resultat2} ${signes[2]} ${nombres[3]}`
      let resultat3 = computeEngine.parse(calcul3).simplify().latex
      let calcul4 = `${resultat3} ${signes[3]} ${nombres[4]}`
      let nombreCible = computeEngine.parse(calcul4).simplify().latex
      let redaction = rediger(rediger(rediger(calcul1, signes[1], nombres[2].toString()), signes[2], nombres[3].toString()), signes[3], nombres[4].toString())
      let texteCorr = `
$${miseEnCouleur(`${calcul1} = ${resultat1}`, 'red')}$<br>
$${miseEnCouleur(`${miseEnCouleur(`\\overset{${calcul1}}{${resultat1}}`, 'red')} ${signes[1]} ${nombres[2]} = ${resultat2}`, 'blue')}$<br>
$${miseEnCouleur(`${miseEnCouleur(`\\overset{(${miseEnCouleur(`(${calcul1})`, 'red')}${signes[1]}${nombres[2]})}{${resultat2}}`, 'blue')} ${signes[2]} ${nombres[3]} = ${resultat3}`, 'green')}$<br>
$${miseEnCouleur(`\\overset{(${miseEnCouleur(`(${miseEnCouleur(`(${calcul1})`, 'red')}${signes[1]}${nombres[2]})`, 'blue')}${signes[2]}${nombres[3]})}{${resultat3}}`, 'green')} ${signes[3]} ${nombres[4]} = ${nombreCible}$<br>
<br>
$${miseEnCouleur(`(${miseEnCouleur(`(${miseEnCouleur(`(${calcul1})`, 'red')}${signes[1]}${nombres[2]})`, 'blue')}${signes[2]}${nombres[3]})`, 'green')} ${signes[3]} ${nombres[4]} = ${nombreCible}$<br>
<br>
`
      switch (listeTypeQuestions[i]) {
        case '1 -> 3':
          calcul2 = `${nombres[2]} ${signes[1]} ${nombres[3]}`
          resultat2 = computeEngine.parse(calcul2).simplify().latex
          calcul3 = `${resultat1} ${signes[2]} ${nombres[4]}`
          resultat3 = computeEngine.parse(calcul3).simplify().latex
          calcul4 = `${resultat2} ${signes[3]} ${resultat3}`
          nombreCible = computeEngine.parse(calcul4).simplify().latex
          redaction = rediger(calcul2, signes[3], rediger(calcul1, signes[2], nombres[4].toString()))
          texteCorr = `
$${miseEnCouleur(`${calcul1} = ${resultat1}`, 'red')}$<br>
$${miseEnCouleur(`${calcul2} = ${resultat2}`, 'blue')}$<br>
$${miseEnCouleur(`${miseEnCouleur(`\\overset{${calcul1}}{${resultat1}}`, 'red')} ${signes[2]} ${nombres[4]} = ${resultat3}`, 'green')}$<br>
$${miseEnCouleur(`\\overset{${calcul2}}{${resultat2}}`, 'blue')} ${signes[3]} ${miseEnCouleur(`\\overset{${miseEnCouleur(`(${calcul1})`, 'red')} ${signes[2]} ${nombres[4]}}{${resultat3}}`, 'green')} = ${nombreCible}$<br>
<br>
$${miseEnCouleur(`(${calcul2})`, 'blue')} ${signes[3]} ${miseEnCouleur(`(${miseEnCouleur(`(${calcul1})`, 'red')} ${signes[2]} ${nombres[4]})`, 'green')} = ${nombreCible}$<br>
<br>
`
          break
        case '1 -> 4':
          calcul2 = `${nombres[2]} ${signes[1]} ${nombres[3]}`
          resultat2 = computeEngine.parse(calcul2).simplify().latex
          calcul3 = `${resultat2} ${signes[2]} ${nombres[4]}`
          resultat3 = computeEngine.parse(calcul3).simplify().latex
          calcul4 = `${resultat1} ${signes[3]} ${resultat3}`
          nombreCible = computeEngine.parse(calcul4).simplify().latex
          redaction = rediger(calcul1, signes[3], rediger(calcul2, signes[2], nombres[4].toString()))
          texteCorr = `
$${miseEnCouleur(`${calcul1} = ${resultat1}`, 'red')}$<br>
$${miseEnCouleur(`${calcul2} = ${resultat2}`, 'blue')}$<br>
$${miseEnCouleur(`${miseEnCouleur(`\\overset{${calcul2}}{${resultat2}}`, 'blue')} ${signes[2]} ${nombres[4]} = ${resultat3}`, 'green')}$<br>
$${miseEnCouleur(`\\overset{${calcul1}}{${resultat1}}`, 'red')} ${signes[3]} ${miseEnCouleur(`\\overset{${miseEnCouleur(`(${calcul2})`, 'blue')} ${signes[2]} ${nombres[4]}}{${resultat3}}`, 'green')} = ${nombreCible}$<br>
<br>
$${miseEnCouleur(`(${calcul1})`, 'red')} ${signes[3]} ${miseEnCouleur(`(${miseEnCouleur(`(${calcul2})`, 'blue')} ${signes[2]} ${nombres[4]})`, 'green')} = ${nombreCible}$<br>
<br>
`
          break
        case '2 -> 4':
          calcul2 = `${resultat1} ${signes[1]} ${nombres[2]}`
          resultat2 = computeEngine.parse(calcul2).simplify().latex
          calcul3 = `${nombres[3]} ${signes[2]} ${nombres[4]}`
          resultat3 = computeEngine.parse(calcul3).simplify().latex
          calcul4 = `${resultat2} ${signes[3]} ${resultat3}`
          nombreCible = computeEngine.parse(calcul4).simplify().latex
          redaction = rediger(rediger(calcul1, signes[1], nombres[2].toString()), signes[3], calcul3)
          texteCorr = `
$${miseEnCouleur(`${calcul1} = ${resultat1}`, 'red')}$<br>
$${miseEnCouleur(`${miseEnCouleur(`\\overset{${calcul1}}{${resultat1}}`, 'red')} ${signes[1]} ${nombres[2]} = ${resultat2}`, 'blue')}$<br>
$${miseEnCouleur(`${calcul3} = ${resultat3}`, 'green')}$<br>
$${miseEnCouleur(`\\overset{${miseEnCouleur(`(${calcul1})`, 'red')} ${signes[1]} ${nombres[2]}}{${resultat2}}`, 'blue')} ${signes[3]} ${miseEnCouleur(`\\overset{${calcul3}}{${resultat3}}`, 'green')} = ${nombreCible}$<br>
<br>
$${miseEnCouleur(`(${miseEnCouleur(`(${calcul1})`, 'red')} ${signes[1]} ${nombres[2]})`, 'blue')} ${signes[3]} ${miseEnCouleur(`(${calcul3})`, 'green')} = ${nombreCible}$<br>
<br>
`
          break
      }
      const texte = `${prenom()} a obtenu le nombre ${nombreCible} à partir des nombres suivants : ${A}, ${B}, ${C}, ${D} et ${E}.<br>
Voici ses calculs :<br>
$${calcul1} = ${resultat1}$<br>
$${calcul2} = ${resultat2}$<br>
$${calcul3} = ${resultat3}$<br>
$${calcul4} = ${nombreCible}$<br>
Les écrire en une seule ligne. ${ajouteChampTexteMathLive(this, i, 'inline largeur01 college6eme')}`
      handleAnswers(this, i, { reponse: { value: redaction, compare: fonctionComparaison, options: { operationSeulementEtNonCalcul: true } } })
      if (!this.correctionDetaillee) texteCorr = ''
      texteCorr += `$${miseEnEvidence(redaction)} = ${nombreCible}$`

      const nombreCibleValide = Number(nombreCible) < 100 && Number(nombreCible) > 0
      const aucunResultatIntermediaireNegatif = Number(resultat1) >= 0 && Number(resultat2) >= 0 && Number(resultat3) >= 0
      const aucunResultatIntermediaireNonEntier = Math.floor(Number(resultat1)) === Number(resultat1) && Math.floor(Number(resultat2)) === Number(resultat2) && Math.floor(Number(resultat3)) === Number(resultat3) && Math.floor(Number(nombreCible)) === Number(nombreCible)
      if (this.questionJamaisPosee(i, texte, ...nombres, ...signes, listeTypeQuestions[i]) && nombreCibleValide && aucunResultatIntermediaireNegatif && aucunResultatIntermediaireNonEntier) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
    function rediger (expression1: string, signe: string, expression2: string): string {
      if (isNaN(Number(expression2))) expression2 = `( ${expression2} )`
      return `(${expression1}) ${signe} ${expression2}`
    }
  }
}
