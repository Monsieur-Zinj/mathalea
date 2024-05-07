import { Courbe } from '../../lib/2d/courbes.js'
import { fixeBordures, mathalea2d } from '../../modules/2dGeneralites.js'
import { listeQuestionsToContenu } from '../../modules/outils.js'
import Exercice from '../Exercice'
import { choice } from '../../lib/outils/arrayOutils'
import RepereBuilder from '../../lib/2d/RepereBuilder.ts'
import ListeDeroulante from '../../lib/interactif/listeDeroulante/ListeDeroulante'
import '../../lib/interactif/listeDeroulante/listeDeroulante.scss'
import { setReponse } from '../../lib/interactif/gestionInteractif.ts'

export const titre = 'Reconnaître une fonction d\'après sa courbe'
export const interactifReady = true
export const interactifType = 'custom'

export const dateDePublication = '22/06/2023' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag
export const uuid = 'addd5' // @todo à changer dans un nouvel exo (utiliser pnpm getNewUuid)
export const ref = 'betaListeDeroulante'// @todo à modifier aussi
export const refs = {
  'fr-fr': ['betaListeDeroulante'],
  'fr-ch': []
}
const fonctionsAuChoix = [
  { latex: '\\sin(x)', name: 'sin', fonction: x => Math.sin(x), derivee: x => Math.cos(x) },
  { latex: '\\cos(x)', name: 'cos', fonction: x => Math.cos(x), derivee: x => -Math.sin(x) },
  { latex: '\\frac{1}{x}', name: 'inverse', fonction: x => 1 / x, derivee: x => -1 / x / x },
  { latex: 'x^2', name: 'carré', fonction: x => x ** 2, derivee: x => 2 * x },
  { latex: 'x^3', name: 'cube', fonction: x => x ** 3, derivee: x => 3 * x ** 2 },
  { latex: '|x|', name: 'abs', fonction: x => Math.abs(x), derivee: x => x < 0 ? -1 : 1 },
  { latex: '-x', name: 'opposé', fonction: x => -x, derivee: x => 0 * x - 1 } // Pour pas qu'il me dise que x n'est pas utilisé
]

/**
 * Affiche une courbe et demande de choisir sa définition dans une liste
 * @author Jean-Claude Lhote
 * Référence (betaListeDeroulante)
 */
export default class BetaListeDeroulante extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.sup = 3
    this.nbQuestions = 1 // Nombre de questions par défaut
    this.nbQuestionsModifiable = false
    this.besoinFormulaireNumerique = ['Type de courbe:', 2, '1: Fonction\n2: Dérivée']
  }

  nouvelleVersion () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    //
    const choices = fonctionsAuChoix.map((el) => Object.assign({}, { latex: el.latex, value: el.name }))
    const choix = choice(fonctionsAuChoix)
    const name = choix.name
    const latex = choix.latex
    const fonction = this.sup === 1 ? choix.fonction : choix.derivee
    const { xMin, xMax, yMin, yMax } = { xMin: -5, xMax: 5, yMin: -5, yMax: 5 } // pour le repère et la courbe
    const repere1 = new RepereBuilder({ xMin, xMax, yMin, yMax }).buildStandard()
    const courbe1 = new Courbe(fonction, {
      repere1,
      xMin,
      xMax,
      yMin,
      yMax,
      xUnite: 1,
      yUnite: 1,
      epaisseur: 1,
      step: 0.05
    })
    const objetsEnonce = [...repere1.objets, courbe1]
    let texteEnonce = mathalea2d(Object.assign({}, fixeBordures(repere1.objets)), objetsEnonce)
    texteEnonce += `<br>Voici la représentation graphique ${this.sup === 1 ? '' : 'de la dérivée '} d'une fonction $f$.`
    const spanListe = document.createElement('span')
    this.listeDeroulante = ListeDeroulante.create(spanListe, ['Propositions'].concat(choices), { choix0: false, sansFleche: false })
    texteEnonce += '<br>Sélectionner dans la liste déroulante l\'expression de la fonction $f$ dont la courbe est tracée ci-dessus.'
    texteEnonce += `<br><span id="ListeDeroulanteExo${this.numeroExercice}Q0"></span><span id ="resultatCheckEx${this.numeroExercice}Q0"></span>`
    const texteCorrection = `L'expression de la fonction $f$ est : $f(x)=${latex}$.`
    document.addEventListener('exercicesAffiches', () => {
      const span = document.querySelector(`span#ListeDeroulanteExo${this.numeroExercice}Q0`)
      if (span.getElementsByClassName('listeDeroulante').length === 0) {
        span.appendChild(this.listeDeroulante.container)
        this.listeDeroulante.show()
        const spanFeedback = document.createElement('div')
        spanFeedback.id = `resultatCheckEx${this.numeroExercice}Q0`
        this.listeDeroulante.spanSelected.appendChild(spanFeedback)
      }
    })
    setReponse(this, 0, name)
    this.listeQuestions.push(texteEnonce)
    this.listeCorrections.push(texteCorrection)
    listeQuestionsToContenu(this)// On envoie l'exercice à la fonction de mise en page
  }

  correctionInteractive () {
    const spanFeedback = document.querySelector(`span#resultatCheckEx${this.numeroExercice}Q0`)
    const index = this.listeDeroulante.getReponseIndex()
    const saisie = this.listeDeroulante.choices[index].value
    const resultatOK = saisie === this.autoCorrection[0].reponse.valeur[0]
    if (resultatOK) {
      spanFeedback.innerHTML += '😎'
      return 'OK'
    } else {
      spanFeedback.innerHTML += '☹️'
      return 'KO'
    }
  }
}
