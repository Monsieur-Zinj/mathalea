import Exercice from '../Exercice'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { prenom } from '../../lib/outils/Personne'
import { combinaisonListes, shuffle } from '../../lib/outils/arrayOutils'
import { miseEnCouleur, miseEnEvidence } from '../../lib/outils/embellissements'
import { handleAnswers } from '../../lib/interactif/gestionInteractif.js' // fonction qui va préparer l'analyse de la saisie
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js' // fonctions de mise en place des éléments interactifs
import engine, { fonctionComparaison } from '../../lib/interactif/comparisonFunctions'
export const interactifReady = true
export const interactifType = 'mathLive'

export const titre = 'Organiser des calculs en une seule ligne'
export const dateDePublication = '31/05/2024'

/**
 * Description didactique de l'exercice
 * @author Guillaume Valmont
*/
export const uuid = '2z3e5'
export const refs = {
  'fr-fr': ['6C33-2'],
  'fr-ch': []
}
export default class ExpressionsDepuisCalculs extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 1
    this.sup = false
    this.sup2 = '2'
    this.besoinFormulaireCaseACocher = ['Inclure des divisions']
    this.besoinFormulaire2Texte = ['Nombre d\'opérations de 2 à 4', 'nombres séparés par des tirets']
    this.correctionDetailleeDisponible = true
    this.correctionDetaillee = false
  }

  nouvelleVersion () {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []

    const avecDivision = !!this.sup

    const typeQuestionsDisponibles = ['Enchaînement simple', '1 -> 3', '1 -> 4', '2 -> 4']
    const listeTypeQuestions = combinaisonListes(typeQuestionsDisponibles, this.nbQuestions)
    const nbOps = gestionnaireFormulaireTexte({ defaut: 2, saisie: this.sup2, min: 2, max: 4, melange: 5, nbQuestions: this.nbQuestions })
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 200;) {
      const A = randint(1, 4)
      const B = randint(1, 6)
      const C = randint(1, 8)
      const D = randint(1, 12)
      const E = randint(1, 20)
      const nombres = shuffle([A, B, C, D, E])
      const signes = avecDivision ? shuffle(['+', '-', '\\times', '\\div']) : combinaisonListes(['+', '-', '\\times'], 4)
      const calcul1 = `${nombres[0]} ${signes[0]} ${nombres[1]}`
      const resultat1 = engine.parse(calcul1).simplify().latex
      const calcul2 = `${resultat1} ${signes[1]} ${nombres[2]}`
      const resultat2 = engine.parse(calcul2).simplify().latex
      const calcul3 = `${resultat2} ${signes[2]} ${nombres[3]}`
      const resultat3 = engine.parse(calcul3).simplify().latex
      const calcul4 = `${resultat3} ${signes[3]} ${nombres[4]}`
      const resultat4 = engine.parse(calcul4).simplify().latex

      let nombreCible: string
      let redaction:string
      let cd: string = '' // correction détaillée

      switch (Number(nbOps[i])) {
        case 2:
          nombreCible = resultat2
          redaction = rediger(calcul1, signes[1], nombres[2].toString())
          cd = `
$${miseEnCouleur(`${calcul1} = ${resultat1}`, 'red')}$<br>
$${miseEnCouleur(`${miseEnCouleur(`\\overset{${calcul1}}{${resultat1}}`, 'red')} ${signes[1]} ${nombres[2]} = ${resultat2}`, 'blue')}$<br>
<br>
$${miseEnCouleur(`(${calcul1})`, 'red')}${miseEnCouleur(`${signes[1]}${nombres[2]} = ${nombreCible}`, 'blue')}$<br>
<br>
`
          break
        case 3:
          nombreCible = resultat3
          redaction = rediger(rediger(calcul1, signes[1], nombres[2].toString()), signes[2], nombres[3].toString())
          cd = `
$${miseEnCouleur(`${calcul1} = ${resultat1}`, 'red')}$<br>
$${miseEnCouleur(`${miseEnCouleur(`\\overset{${calcul1}}{${resultat1}}`, 'red')} ${signes[1]} ${nombres[2]} = ${resultat2}`, 'blue')}$<br>
$${miseEnCouleur(`${miseEnCouleur(`\\overset{(${miseEnCouleur(`(${calcul1})`, 'red')}${signes[1]}${nombres[2]})}{${resultat2}}`, 'blue')} ${signes[2]} ${nombres[3]} = ${resultat3}`, 'green')}$<br>
<br>
$${miseEnCouleur(`${miseEnCouleur(`(${miseEnCouleur(`(${calcul1})`, 'red')}${signes[1]}${nombres[2]})`, 'blue')}${signes[2]}${nombres[3]}=${resultat3}`, 'green')}$<br>
<br>
`
          break
        case 4:
        default:
          nombreCible = resultat4
          redaction = rediger(rediger(rediger(calcul1, signes[1], nombres[2].toString()), signes[2], nombres[3].toString()), signes[3], nombres[4].toString())
          cd = `
$${miseEnCouleur(`${calcul1} = ${resultat1}`, 'red')}$<br>
$${miseEnCouleur(`${miseEnCouleur(`\\overset{${calcul1}}{${resultat1}}`, 'red')} ${signes[1]} ${nombres[2]} = ${resultat2}`, 'blue')}$<br>
$${miseEnCouleur(`${miseEnCouleur(`\\overset{(${miseEnCouleur(`(${calcul1})`, 'red')}${signes[1]}${nombres[2]})}{${resultat2}}`, 'blue')} ${signes[2]} ${nombres[3]} = ${resultat3}`, 'green')}$<br>
$${miseEnCouleur(`\\overset{(${miseEnCouleur(`(${miseEnCouleur(`(${calcul1})`, 'red')}${signes[1]}${nombres[2]})`, 'blue')}${signes[2]}${nombres[3]})}{${resultat3}}`, 'green')} ${signes[3]} ${nombres[4]} = ${nombreCible}$<br>
<br>
$${miseEnCouleur(`(${miseEnCouleur(`(${miseEnCouleur(`(${calcul1})`, 'red')}${signes[1]}${nombres[2]})`, 'blue')}${signes[2]}${nombres[3]})`, 'green')} ${signes[3]} ${nombres[4]} = ${nombreCible}$<br>
<br>
`
          break
      }

      const texteCorr = this.correctionDetaillee ? cd : `$${miseEnEvidence(redaction)} = ${nombreCible}$`

      /*
      switch (listeTypeQuestions[i]) {
        case '1 -> 3':
          calcul2 = `${nombres[2]} ${signes[1]} ${nombres[3]}`
          resultat2 = engine.parse(calcul2).simplify().latex
          calcul3 = `${resultat1} ${signes[2]} ${nombres[4]}`
          resultat3 = engine.parse(calcul3).simplify().latex
          calcul4 = `${resultat2} ${signes[3]} ${resultat3}`
          nombreCible = engine.parse(calcul4).simplify().latex
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
          resultat2 = engine.parse(calcul2).simplify().latex
          calcul3 = `${resultat2} ${signes[2]} ${nombres[4]}`
          resultat3 = engine.parse(calcul3).simplify().latex
          calcul4 = `${resultat1} ${signes[3]} ${resultat3}`
          nombreCible = engine.parse(calcul4).simplify().latex
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
          resultat2 = engine.parse(calcul2).simplify().latex
          calcul3 = `${nombres[3]} ${signes[2]} ${nombres[4]}`
          resultat3 = engine.parse(calcul3).simplify().latex
          calcul4 = `${resultat2} ${signes[3]} ${resultat3}`
          nombreCible = engine.parse(calcul4).simplify().latex
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
       */
      const enonce = [`$${calcul1} = ${resultat1}$<br>`,
        `$${calcul2} = ${resultat2}$<br>`,
        `$${calcul3} = ${resultat3}$<br>`,
        `$${calcul4} = ${resultat4}$<br>`]
      const tirage = nombres.slice(0, nbOps[i] + 1)
      const texte = `${prenom()} a obtenu le nombre ${nombreCible} à partir des nombres suivants : ${tirage.join(' ; ')}.<br>
Voici ses calculs :<br>${enonce.slice(0, nbOps[i]).join('\n')}
Les écrire en une seule ligne. ${ajouteChampTexteMathLive(this, i, ' college6eme')}`
      handleAnswers(this, i, { reponse: { value: redaction, compare: fonctionComparaison, options: { operationSeulementEtNonCalcul: true } } })
      //   if (!this.correctionDetaillee) texteCorr = ''
      //   texteCorr += `$${miseEnEvidence(redaction)} = ${nombreCible}$`

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
