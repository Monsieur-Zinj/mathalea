import { choice, creerCouples } from '../../lib/outils/arrayOutils.js'
import { texNombre } from '../../lib/outils/texNombre.js'
import Exercice from '../Exercice.js'
import { context } from '../../modules/context.js'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { setReponse } from '../../lib/interactif/gestionInteractif.js'

export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
export const titre = 'Tables de multiplication'

/**
 * Tables de multiplication classiques, à trou ou un mélange des deux.
 *
 * Par défaut ce sont les tables de 2 à 9 mais on peut choisir les tables que l'on veut
 * @author Rémi Angot (ES6: Loïc Geeraerts)
 * Référence 6C10-1
 */
export default function TablesDeMultiplications (tablesParDefaut = '2-3-4-5-6-7-8-9') {
  // Multiplier deux nombres
  Exercice.call(this)
  this.sup = tablesParDefaut
  this.sup2 = 1 // classique|a_trous|melange
  this.sup3 = 2 // 1: on commence toujours par le nombre de la table, 2: on mélange
  this.consigne = 'Calculer : '
  this.spacing = 2

  this.besoinFormulaireTexte = ['Choix des tables (entre 2 et 9)', 'Nombres séparés par des tirets'] // Texte, tooltip
  this.besoinFormulaire2Numerique = [
    'Type de questions',
    3,
    '1 : Classique\n2 : À trous\n3 : Mélange'
  ]
  this.besoinFormulaire3Numerique = ['Le facteur de gauche est celui de la table', 2, '1 : Oui\n2 : Non']

  this.nouvelleVersion = function () {
    this.sup2 = parseInt(this.sup2)
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    const tables = gestionnaireFormulaireTexte({
      min: 2,
      max: 9,
      defaut: randint(2, 9),
      nbQuestions: this.nbQuestions,
      saisie: this.sup,
      enleveDoublons: true
    })

    const couples = creerCouples(
      tables,
      [2, 3, 4, 5, 6, 7, 8, 9, 10],
      this.nbQuestions
    ) // Liste tous les couples possibles (2,3)≠(3,2)
    let typesDeQuestions = 'a_trous'
    for (let i = 0, cpt = 0, a, b, texte, texteCorr; i < this.nbQuestions && cpt < 100;) {
      a = couples[i][0]
      b = couples[i][1]
      if (parseInt(this.sup2) === 1) {
        typesDeQuestions = 'classique'
      } else if (parseInt(this.sup2) === 2) {
        typesDeQuestions = 'a_trous'
      } else {
        typesDeQuestions = choice(['classique', 'a_trous'])
      }
      if (typesDeQuestions === 'classique') {
        // classique
        const ordre = (parseInt(this.sup3) === 1) ? [true] : [true, false]
        if (choice(ordre)) {
          texte = `$ ${texNombre(a)} \\times ${texNombre(b)} = `
          texte += (this.interactif && context.isHtml) ? '$' + ajouteChampTexteMathLive(this, i, 'inline largeur15 nospacebefore') : '$'
          texteCorr = `$ ${texNombre(a)} \\times ${texNombre(b)} = ${texNombre(a * b)}$`
        } else {
          texte = `$ ${texNombre(b)} \\times ${texNombre(a)} = `
          texte += (this.interactif && context.isHtml) ? '$' + ajouteChampTexteMathLive(this, i, 'inline largeur15 nospacebefore') : '$'
          texteCorr = `$ ${texNombre(b)} \\times ${texNombre(a)} = ${texNombre(a * b)}$`
        }
        setReponse(this, i, a * b)
      } else {
        // a trous
        if (tables.length > 2) {
        // Si pour le premier facteur il y a plus de 2 posibilités on peut le chercher
          const ordre = (parseInt(this.sup3) === 1) ? [true] : [true, false]
          if (choice(ordre)) {
            texte = '$ ' + a + ' \\times '
            texte += (this.interactif && context.isHtml) ? '$' + ajouteChampTexteMathLive(this, i, 'inline largeur15 nospacebefore', { texteApres: `$ = ${a * b} $` }) : `   \\ldots\\ldots = ${a * b}$`
            setReponse(this, i, b)
          } else {
            texte = (this.interactif && context.isHtml) ? ajouteChampTexteMathLive(this, i, 'inline largeur15 nospacebefore', { texteApres: `$\\times ${b} = ${a * b}$` }) : `$ \\ldots\\ldots \\times ${b} = ${a * b}$`
            setReponse(this, i, a)
          }
        } else {
        // Sinon on demande forcément le 2e facteur
          texte = `$${a} \\times `
          texte += (this.interactif && context.isHtml) ? '$' + ajouteChampTexteMathLive(this, i, 'inline largeur15 nospacebefore', { texteApres: ` = ${a * b}` }) + '$' : `\\ldots\\ldots = ${a * b}$`
          setReponse(this, i, b)
        }
        texteCorr = `$${a} \\times ${b} = ${a * b}$`
      }
      if (context.isAmc) {
        this.autoCorrection[i].reponse.param = {
          digits: 2,
          decimals: 0,
          signe: false,
          exposantNbChiffres: 0,
          exposantSigne: false,
          approx: 0
        }
      }
      if (this.questionJamaisPosee(i, a, b, typesDeQuestions)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      } else {
        cpt++
      }
    }
    listeQuestionsToContenu(this)
  }
}
