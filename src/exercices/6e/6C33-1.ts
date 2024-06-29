import Exercice from '../Exercice'
import {
  gestionnaireFormulaireTexte,
  listeQuestionsToContenu,
  randint
} from '../../modules/outils.js'
import { prenom } from '../../lib/outils/Personne'
import { ComputeEngine } from '@cortex-js/compute-engine'
import { combinaisonListes, shuffle } from '../../lib/outils/arrayOutils'
import { miseEnCouleur, miseEnEvidence } from '../../lib/outils/embellissements'
import { handleAnswers } from '../../lib/interactif/gestionInteractif.js' // fonction qui va préparer l'analyse de la saisie
import { ajouteChampTexteMathLive, ajouteFeedback } from '../../lib/interactif/questionMathLive.js' // fonctions de mise en place des éléments interactifs
import engine, { exprCompare } from '../../lib/interactif/comparisonFunctions'
import { lister } from '../../lib/outils/ecritures'
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
export default class OrganierDesCalculsEnUneSeuleLigne extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 1
    this.sup = false
    this.besoinFormulaireCaseACocher = ['Inclure des divisions']
    this.besoinFormulaire2Texte = ['Nombre de calculs (2 à 4) séparés par des tirets', '2 : 2 opérations successives\n3 : 3 opérations successives\n4 : 4 opérations successives\n5 : Mélange']
    this.sup2 = 4
    // Ce paramètre n'aura de sens que si la correction fournie ne comporte pas de parenthèses inutiles conformément au paramètre
    // this.besoinFormulaire3CaseACocher = ['Sanctionner les parenthèses inutiles', false]
    // this.sup3 = false
    this.correctionDetailleeDisponible = true
    this.correctionDetaillee = false
  }

  nouvelleVersion () {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []
    const computeEngine = new ComputeEngine()
    const avecDivision = !!this.sup
    const nombreDeCalculs = gestionnaireFormulaireTexte({ shuffle: false, saisie: this.sup2, nbQuestions: this.nbQuestions, min: 2, max: 4, defaut: 4, melange: 5 })
    const noUselessParen = false // Pour l'instant, on ne peu pas se permettre de ne pas les accepter car elles figurent dans la correction.
    const typeQuestionsDisponibles = ['Enchaînement simple', '1 -> 3', '1 -> 4', '2 -> 4']

    const listeTypeQuestions = combinaisonListes(typeQuestionsDisponibles, this.nbQuestions)
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 200;) {
      const A = randint(1, 4)
      const B = randint(1, 6)
      const C = randint(1, 8)
      const D = randint(1, 12)
      const E = randint(1, 20)
      const nombres = shuffle([A, B, C, D, E])
      let nombresUtilises = nombres.slice(0, 3)
      const signes = avecDivision ? shuffle(['+', '-', '\\times', '\\div']) : combinaisonListes(['+', '-', '\\times'], 4)
      let calcul1: string = `${nombres[0]} ${signes[0]} ${nombres[1]}`
      let resultat1: string = computeEngine.parse(calcul1).simplify().latex
      let calcul2: string = `${resultat1} ${signes[1]} ${nombres[2]}`
      let resultat2: string = computeEngine.parse(calcul2).simplify().latex
      let calcul3: string = `${resultat2} ${signes[2]} ${nombres[3]}`
      let resultat3: string = computeEngine.parse(calcul3).simplify().latex
      let calcul4: string = `${resultat3} ${signes[3]} ${nombres[4]}`
      let nombreCible: string = computeEngine.parse(calcul2).simplify().latex
      let redaction: string = rediger(calcul1, signes[1], nombres[2].toString())
      let texteCorr: string
      let derniereLigneCorrection: string
      let calculs
      switch (Number(nombreDeCalculs[i])) {
        case 2:
          switch (listeTypeQuestions[i]) {
            case '1 -> 3':
            case '2 -> 4': // c'est juste pour équilibrer les cas
              calcul1 = `${nombres[1]} ${signes[0]} ${nombres[2]}`
              resultat1 = computeEngine.parse(calcul1).simplify().latex
              calcul2 = `${nombres[0]} ${signes[1]} ${resultat1}`
              resultat2 = computeEngine.parse(calcul2).simplify().latex
              nombreCible = resultat2
              redaction = `${nombres[0]} ${signes[1]} (${calcul1})`
              texteCorr = `$${miseEnCouleur(`${calcul1} = ${resultat1}`, 'red')}$<br>
$${miseEnCouleur(`${nombres[0]} ${signes[1]}${miseEnCouleur(`\\overset{${calcul1}}{${resultat1}}`, 'red')} = ${resultat2}`, 'green')}$<br><br>`
              break
            case 'Enchaînement simple':
            default:
              calcul2 = `${resultat1} ${signes[1]} ${nombres[2]}`
              resultat2 = computeEngine.parse(calcul2).simplify().latex
              calcul3 = `${resultat2} ${signes[2]} ${nombres[3]}`
              resultat3 = computeEngine.parse(calcul3).simplify().latex
              calcul4 = `${resultat3} ${signes[3]} ${nombres[4]}`
              nombreCible = computeEngine.parse(calcul2).simplify().latex
              redaction = rediger(calcul1, signes[1], nombres[2].toString())
              texteCorr = `$${miseEnCouleur(`${calcul1} = ${resultat1}`, 'red')}$<br>
$${miseEnCouleur(`${miseEnCouleur(`\\overset{${calcul1}}{${resultat1}}`, 'red')} ${signes[1]} ${nombres[2]} = ${resultat2}`, 'blue')}$<br>
`
              break
          }
          calculs = `$${calcul1}=${resultat1}$<br>$${calcul2}=${resultat2}$<br>`
          nombresUtilises = nombres.slice(0, 3)
          break
        case 3:
          switch (listeTypeQuestions[i]) {
            case '1 -> 3':
            case '2 -> 4': // c'est juste pour équilibrer les cas
              calcul1 = `${nombres[0]} ${signes[0]} ${nombres[1]}`
              resultat1 = computeEngine.parse(calcul1).simplify().latex
              calcul2 = `${nombres[2]} ${signes[1]} ${nombres[3]}`
              resultat2 = computeEngine.parse(calcul2).simplify().latex
              calcul3 = `${resultat1} ${signes[2]} ${resultat2}`
              resultat3 = computeEngine.parse(calcul3).simplify().latex
              // calcul4 = `${resultat2} ${signes[3]} ${resultat3}`
              nombreCible = resultat3
              redaction = rediger(calcul1, signes[2], calcul2)
              texteCorr = `
$${miseEnCouleur(`${calcul1} = ${resultat1}`, 'red')}$<br>
$${miseEnCouleur(`${calcul2} = ${resultat2}`, 'blue')}$<br>
$${miseEnCouleur(`${miseEnCouleur(`\\overset{${calcul1}}{${resultat1}}`, 'red')} ${signes[2]} ${miseEnCouleur(`\\overset{${calcul2}}{${resultat2}}`, 'blue')} = ${resultat3}`, 'green')}$<br>
$${miseEnCouleur(`(${calcul1})`, 'red')} ${signes[2]} ${miseEnCouleur(`${miseEnCouleur(`(${calcul2})`, 'blue')} = ${nombreCible}`, 'green')}$<br><br>`
              break
            case 'Enchaînement simple':
            default:
              calcul2 = `${resultat1} ${signes[1]} ${nombres[2]}`
              resultat2 = computeEngine.parse(calcul2).simplify().latex
              calcul3 = `${resultat2} ${signes[2]} ${nombres[3]}`
              resultat3 = computeEngine.parse(calcul3).simplify().latex
              nombreCible = computeEngine.parse(calcul3).simplify().latex
              redaction = rediger(rediger(calcul1, signes[1], nombres[2].toString()), signes[2], nombres[3].toString())
              texteCorr = `$${miseEnCouleur(`${calcul1} = ${resultat1}`, 'red')}$<br>
$${miseEnCouleur(`${miseEnCouleur(`\\overset{${calcul1}}{${resultat1}}`, 'red')} ${signes[1]} ${nombres[2]} = ${resultat2}`, 'blue')}$<br><br>
$${miseEnCouleur(`${miseEnCouleur(`\\overset{${miseEnCouleur(`(${calcul1})`, 'red')} ${signes[1]} ${nombres[2]}}{${resultat2}}`, 'blue')} ${signes[2]} ${nombres[2]} = ${resultat3}`, 'green')}$<br><br>
`

              derniereLigneCorrection = miseEnCouleur(`(${miseEnCouleur(`(${calcul1})`, 'red')}${signes[1]}${nombres[2]})`, 'blue')
              derniereLigneCorrection = miseEnCouleur(`(${derniereLigneCorrection}${signes[2]}${nombres[3]})`, 'green')
              texteCorr += `$ ${derniereLigneCorrection} = ${nombreCible}$<br><br>`
              break
          }
          calculs = `$${calcul1}=${resultat1}$<br>$${calcul2}=${resultat2}$<br>$${calcul3}=${resultat3}$<br>`
          nombresUtilises = nombres.slice(0, 4)
          break
        case 4:
        default:
          switch (listeTypeQuestions[i]) {
            case '1 -> 3':
              calcul1 = `${nombres[0]} ${signes[0]} ${nombres[1]}`
              resultat1 = computeEngine.parse(calcul1).simplify().latex
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
            case 'Enchaînement simple':
            default:
              calcul2 = `${resultat1} ${signes[1]} ${nombres[2]}`
              resultat2 = computeEngine.parse(calcul2).simplify().latex
              calcul3 = `${resultat2} ${signes[2]} ${nombres[3]}`
              resultat3 = computeEngine.parse(calcul3).simplify().latex
              calcul4 = `${resultat3} ${signes[3]} ${nombres[4]}`
              texteCorr = `$${miseEnCouleur(`${calcul1} = ${resultat1}`, 'red')}$<br>
$${miseEnCouleur(`${miseEnCouleur(`\\overset{${calcul1}}{${resultat1}}`, 'red')} ${signes[1]} ${nombres[2]} = ${resultat2}`, 'blue')}$<br>`

              texteCorr += `$${miseEnCouleur(`\\overset{${miseEnCouleur(`${miseEnCouleur(`(${calcul1})`, 'red')} ${signes[1]} ${nombres[2]}`, 'blue')}}{${miseEnCouleur(resultat2, 'blue')}} ${signes[2]} ${nombres[3]} = ${resultat3}`, 'green')}$<br>`

              texteCorr += `$${miseEnCouleur(`\\overset{(${miseEnCouleur(`(${miseEnCouleur(`(${calcul1})`, 'red')}${signes[1]}${nombres[2]})`, 'blue')}${signes[2]}${nombres[3]})}{${resultat3}}`, 'green')} ${signes[3]} ${nombres[4]} = ${nombreCible}$<br><br>`
              derniereLigneCorrection = miseEnCouleur(`(${miseEnCouleur(`(${calcul1})`, 'red')}${signes[1]}${nombres[2]})`, 'blue')
              derniereLigneCorrection = miseEnCouleur(`(${derniereLigneCorrection}${signes[2]}${nombres[3]})`, 'green')
              derniereLigneCorrection = `${derniereLigneCorrection}${signes[3]}${nombres[4]}`
              texteCorr += `$ ${derniereLigneCorrection} = ${nombreCible}$<br><br>`
              redaction = rediger(rediger(rediger(calcul1, signes[1], nombres[2].toString()), signes[2], nombres[3].toString()), signes[3], nombres[4].toString())
              nombreCible = computeEngine.parse(calcul4).simplify().latex

              break
          }
          calculs = `$${calcul1}=${resultat1}$<br>$${calcul2}=${resultat2}$<br>$${calcul3}=${resultat3}$<br>$${calcul4}=${nombreCible}$<br>`
          nombresUtilises = nombres.slice()
          break
      }
      const texte = `${prenom()} a obtenu le nombre ${nombreCible} à partir des nombres suivants : ${lister(nombresUtilises)}.<br>
Voici ses calculs :<br>
${calculs}
Les écrire en une seule ligne. ${ajouteChampTexteMathLive(this, i, 'inline largeur01 college6eme')}${ajouteFeedback(this, i)}`
      const expressionReduite = engine.parse(redaction, { canonical: true }).latex
      console.log(redaction, expressionReduite)
      handleAnswers(this, i, { reponse: { value: [expressionReduite, redaction], compare: exprCompare, options: { noUselessParen } } })
      if (!this.correctionDetaillee) texteCorr = ''
      texteCorr += `$${miseEnEvidence(redaction)} = ${nombreCible}$`
      /* On ne peut pas proposer cette expression à des 6e car computeEngine n'écrit pas les multiplications implicites et place les négatifs en premier dans une somme
      if (noUselessParen) {
        texteCorr += `<br>En supprimant les parenthèses inutiles, on peut écrire : $${miseEnEvidence(expressionReduite)} = ${nombreCible}$`
      }
       */

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
