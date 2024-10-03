import { choice, creerCouples } from '../../lib/outils/arrayOutils'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { context } from '../../modules/context.js'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard'
import { fonctionComparaison } from '../../lib/interactif/comparisonFunctions'

export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
export const titre = 'Tables de multiplication'
export const dateDeModifImportante = '27/08/2024'
/**
 * Tables de multiplication classiques, à trou ou un mélange des deux.
 *
 * Par défaut ce sont les tables de 2 à 9 mais on peut choisir les tables que l'on veut
 * @author Rémi Angot (ES6: Loïc Geeraerts)
 */
export default function TablesDeMultiplications (tablesParDefaut = '2-3-4-5-6-7-8-9-10') {
  // Multiplier deux nombres
  Exercice.call(this)
  this.sup = tablesParDefaut
  this.sup2 = '1'
  this.sup3 = true
  this.consigne = 'Calculer : '
  this.spacing = 2

  this.besoinFormulaireTexte = ['Choix des tables', 'Nombres séparés par des tirets\nChoisir des tables entre 1 et 11.\nMettre 12 pour choisir une table au hasard.'] // Texte, tooltip
  this.besoinFormulaire2Texte = [
    'Type de questions', 'Nombres séparés par des tirets\n1 : Classique\n2 : À trous\n3 : Quotient\n4: Mélange'
  ]
  this.besoinFormulaire3CaseACocher = ['Le facteur de gauche est celui de la table', true]

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    const tables = gestionnaireFormulaireTexte({
      min: 1,
      max: 11,
      melange: 12,
      defaut: 12,
      nbQuestions: this.nbQuestions,
      saisie: this.sup,
      enleveDoublons: true
    })
    const listeTypeDeQuestions = gestionnaireFormulaireTexte({ saisie: this.sup2, min: 1, max: 3, defaut: 1, melange: 4, listeOfCase: ['classique', 'a_trous', 'quotient'], nbQuestions: this.nbQuestions })
    const couples = creerCouples(
      tables,
      [2, 3, 4, 5, 6, 7, 8, 9, 10],
      this.nbQuestions
    ) // Liste tous les couples possibles (2,3)≠(3,2)
    for (let i = 0, reponse, cpt = 0, a, b, texte, texteCorr; i < this.nbQuestions && cpt < 100;) {
      a = couples[i][0]
      b = couples[i][1]
      const ordre = this.sup3 ? [true] : [true, false]
      const choix = choice(ordre)
      const typeDeQuestion = listeTypeDeQuestions[i]
      if (typeDeQuestion === 'classique') {
        reponse = a * b
        if (choix) {
          texte = `$ ${texNombre(a, 0)}\\times ${texNombre(b, 0)} =`
          texte += (this.interactif && context.isHtml) ? '$' + ajouteChampTexteMathLive(this, i, 'inline largeur01 nospacebefore ' + KeyboardType.clavierNumbers) : '\\ldots\\ldots$'
          texteCorr = `$ ${texNombre(a, 0)}\\times ${texNombre(b, 0)} = ${miseEnEvidence(texNombre(reponse, 0))}$`
        } else {
          texte = `$ ${texNombre(b, 0)}\\times ${texNombre(a, 0)} = `
          texte += (this.interactif && context.isHtml) ? '$' + ajouteChampTexteMathLive(this, i, 'inline largeur01 nospacebefore ' + KeyboardType.clavierNumbers) : '\\ldots\\ldots$'
          texteCorr = `$ ${texNombre(b, 0)}\\times ${texNombre(a, 0)} = ${miseEnEvidence(texNombre(reponse, 0))}$`
        }
        handleAnswers(this, i, { reponse: { value: a * b, compare: fonctionComparaison, options: { calculSeulementEtNonOperation: true } } })
      } else if (typeDeQuestion === 'a_trous') {
        if (choix) {
          texte = '$' + a.toString() + '\\times '
          texte += (this.interactif && context.isHtml) ? '$' + ajouteChampTexteMathLive(this, i, 'inline largeur01 nospacebefore ' + KeyboardType.clavierNumbers, { texteApres: ` $=${(a * b).toString()}$` }) : ` \\ldots\\ldots =${(a * b).toString()}$`
          reponse = b
        } else {
          texte = (this.interactif && context.isHtml) ? ajouteChampTexteMathLive(this, i, 'inline largeur01 nospacebefore ' + KeyboardType.clavierNumbers, { texteApres: ` $\\times ${b.toString()} = ${(a * b).toString()}$` }) : `$ \\ldots\\ldots \\times ${b.toString()} =${(a * b).toString()}$`
          reponse = a
        }
        handleAnswers(this, i, { reponse: { value: reponse, compare: fonctionComparaison, options: { calculSeulementEtNonOperation: true } } })
        texteCorr = choix
          ? `$${a.toString()} \\times ${miseEnEvidence(reponse.toString())} =${(a * b).toString()}$`
          : `$${miseEnEvidence(reponse.toString())}\\times ${b.toString()} =${(a * b).toString()}$`
      } else { // typeDeQuestion === 'quotient'
        texte = `$${texNombre(a * b, 0)} \\div ${texNombre(a, 0)} = `
        texte += (this.interactif && context.isHtml) ? '$' + ajouteChampTexteMathLive(this, i, 'inline largeur01 nospacebefore ' + KeyboardType.clavierNumbers) : '\\ldots\\ldots$'
        texteCorr = `$ ${texNombre(a * b, 0)}\\div ${texNombre(a, 0)} = ${miseEnEvidence(texNombre(b, 0))}$`
        reponse = b
        handleAnswers(this, i, { reponse: { value: reponse, compare: fonctionComparaison, options: { calculSeulementEtNonOperation: true } } })
      }
      if (context.isAmc) {
        this.autoCorrection[i] = {
          enonce: texte, // Si vide, l'énoncé est celui de l'exercice.
          propositions: [
            {
              texte: '' // Si vide, le texte est la correction de l'exercice.
            }
          ],
          reponse: {
            valeur: [reponse], // obligatoire (la réponse numérique à comparer à celle de l'élève), NE PAS METTRE DE STRING à virgule ! 4.9 et non pas 4,9. Cette valeur doit être passée dans un tableau d'où la nécessité des crochets.
            param: {
              digits: 2,
              decimals: 0,
              signe: false,
              exposantNbChiffres: 0,
              exposantSigne: false,
              approx: 0
            }
          }
        }
      }
      if (this.questionJamaisPosee(i, a, b, typeDeQuestion)) {
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
