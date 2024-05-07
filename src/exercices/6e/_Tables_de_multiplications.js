import { choice, creerCouples } from '../../lib/outils/arrayOutils'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { context } from '../../modules/context.js'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { setReponse } from '../../lib/interactif/gestionInteractif.ts'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard'

export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
export const titre = 'Tables de multiplication'
export const dateDeModifImportante = '24/09/2023'
/**
 * Tables de multiplication classiques, à trou ou un mélange des deux.
 *
 * Par défaut ce sont les tables de 2 à 9 mais on peut choisir les tables que l'on veut
 * @author Rémi Angot (ES6: Loïc Geeraerts)
 * Référence 6C10-1
 */
export default function TablesDeMultiplications (tablesParDefaut = '2-3-4-5-6-7-8-9-10') {
  // Multiplier deux nombres
  Exercice.call(this)
  this.sup = tablesParDefaut
  this.sup2 = 1 // classique|a_trous|melange
  this.sup3 = true
  this.consigne = 'Calculer : '
  this.spacing = 2

  this.besoinFormulaireTexte = ['Choix des tables (entre 2 et 10)', 'Nombres séparés par des tirets'] // Texte, tooltip
  this.besoinFormulaire2Numerique = [
    'Type de questions',
    4,
    '1 : Classique\n2 : À trous\n3 : Quotient\n4: Mélange'
  ]
  this.besoinFormulaire3CaseACocher = ['Le facteur de gauche est celui de la table', true]

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    const tables = gestionnaireFormulaireTexte({
      min: 2,
      max: 10,
      defaut: randint(2, 10),
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
      const ordre = this.sup3 ? [true] : [true, false]
      const choix = choice(ordre)
      if (this.sup2 === 1) {
        typesDeQuestions = 'classique'
      } else if (this.sup2 === 2) {
        typesDeQuestions = 'a_trous'
      } else if (this.sup2 === 3) {
        typesDeQuestions = 'quotient'
      } else {
        typesDeQuestions = choice(['classique', 'a_trous', 'quotient'])
      }
      if (typesDeQuestions === 'classique') {
        // classique
        if (choix) {
          texte = `$ ${texNombre(a, 0)}\\times ${texNombre(b, 0)} =`
          texte += (this.interactif && context.isHtml) ? '$' + ajouteChampTexteMathLive(this, i, 'inline largeur10 nospacebefore ' + KeyboardType.clavierDeBase) : '\\ldots\\ldots$'
          texteCorr = `$ ${texNombre(a, 0)}\\times ${texNombre(b, 0)} = ${miseEnEvidence(texNombre(a * b, 0))}$`
        } else {
          texte = `$ ${texNombre(b, 0)}\\times ${texNombre(a, 0)} = `
          texte += (this.interactif && context.isHtml) ? '$' + ajouteChampTexteMathLive(this, i, 'inline largeur10 nospacebefore ' + KeyboardType.clavierDeBase) : '\\ldots\\ldots$'
          texteCorr = `$ ${texNombre(b, 0)}\\times ${texNombre(a, 0)} = ${miseEnEvidence(texNombre(a * b, 0))}$`
        }
        setReponse(this, i, a * b)
      } else if (typesDeQuestions === 'a_trous') {
        // a trous
        // if (tables.length > 2) {
        // Si pour le premier facteur il y a plus de 2 posibilités on peut le chercher

        if (choix) {
          texte = '$' + a.toString() + '\\times '
          texte += (this.interactif && context.isHtml) ? '$' + ajouteChampTexteMathLive(this, i, 'inline largeur10 nospacebefore ' + KeyboardType.clavierDeBase, { texteApres: ` $=${(a * b).toString()}$` }) : ` \\ldots\\ldots =${(a * b).toString()}$`
          setReponse(this, i, b)
        } else {
          texte = (this.interactif && context.isHtml) ? ajouteChampTexteMathLive(this, i, 'inline largeur10 nospacebefore ' + KeyboardType.clavierDeBase, { texteApres: ` $\\times ${b.toString()} = ${(a * b).toString()}$` }) : `$ \\ldots\\ldots \\times ${b.toString()} =${(a * b).toString()}$`
          setReponse(this, i, a)
        }
        /*   } else {
        // Sinon on demande forcément le 2e facteur
          texte = `$${a.toString()} \\times `
          texte += (this.interactif && context.isHtml) ? '$' + ajouteChampTexteMathLive(this, i, 'inline largeur10 nospacebefore', { texteApres: ` =${(a * b).toString()}` }) + '$' : `\\ldots\\ldots = ${(a * b).toString()}$`
          setReponse(this, i, b)
        } */
        texteCorr = choix
          ? `$${a.toString()} \\times ${miseEnEvidence(b.toString())} =${(a * b).toString()}$`
          : `$${miseEnEvidence(a.toString())}\\times ${b.toString()} =${(a * b).toString()}$`
      } else { // typeDeQuestion === 'quotient'
        texte = `$${texNombre(a * b, 0)} \\div ${texNombre(a, 0)} = `
        texte += (this.interactif && context.isHtml) ? '$' + ajouteChampTexteMathLive(this, i, 'inline largeur10 nospacebefore ' + KeyboardType.clavierDeBase) : '\\ldots\\ldots$'
        texteCorr = `$ ${texNombre(a * b, 0)}\\div ${texNombre(a, 0)} = ${miseEnEvidence(texNombre(b, 0))}$`
        setReponse(this, i, b)
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
