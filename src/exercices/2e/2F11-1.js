import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { texFractionFromString } from '../../lib/outils/deprecatedFractions.js'
import { ecritureParentheseSiNegatif } from '../../lib/outils/ecritures'
import { arrondi } from '../../lib/outils/nombres'
import { texNombre } from '../../lib/outils/texNombre'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import Exercice from '../deprecatedExercice.js'
import { context } from '../../modules/context.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import FractionEtendue from '../../modules/FractionEtendue.ts'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { fonctionComparaison } from '../../lib/interactif/comparisonFunctions'

export const titre = 'Déterminer l\'image d\'un nombre par une fonction de référence'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

// Les exports suivants sont optionnels mais au moins la date de publication semble essentielle
export const dateDePublication = '18/01/2022' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag
// export const dateDeModifImportante = '24/10/2021' // Une date de modification importante au format 'jj/mm/aaaa' pour affichage temporaire d'un tag

/**
 *
 * @author Degrange Mathieu
 *
 */
export const uuid = 'b6cc0'
export const ref = '2F11-1'
export const refs = {
  'fr-fr': ['2F11-1'],
  'fr-ch': []
}
export default function ImageFonctionsRefs () {
  Exercice.call(this)
  this.nbQuestions = 8

  this.besoinFormulaireCaseACocher = ['Fonction carré']
  this.besoinFormulaire2CaseACocher = ['Fonction cube']
  this.besoinFormulaire3CaseACocher = ['Fonction racine carrée']
  this.besoinFormulaire4CaseACocher = ['Fonction inverse']
  this.sup = true
  this.sup2 = true
  this.sup3 = true
  this.sup4 = true
  this.can = false // course aux nombres, si true les calculs pourront être fait de tête

  this.nbCols = 2
  this.nbColsCorr = 2
  this.tailleDiaporama = 3

  this.nouvelleVersion = function () {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []

    const typeQuestionsDisponibles = []
    this.sup && typeQuestionsDisponibles.push('carré')
    this.sup2 && typeQuestionsDisponibles.push('cube')
    this.sup3 && typeQuestionsDisponibles.push('racine carrée')
    this.sup4 && typeQuestionsDisponibles.push('inverse')

    if (typeQuestionsDisponibles.length === 0) {
      typeQuestionsDisponibles.push('carré')
    }

    const listeTypeQuestions = combinaisonListes(typeQuestionsDisponibles, this.nbQuestions)
    const listePhrases = combinaisonListes([0, 1], this.nbQuestions)
    for (let i = 0, texte, texteCorr, nombre, solution, nom, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      // choix du nom de la fonction : f, g, h, p, q, r si trois questions ou moins, sinon f_1, g_1, h_1, p_1, q_1, r_1, s_1, f_2, g_2, h_2, ...
      nom = ['f', 'g', 'h', 'p', 'q', 'r', 's', 't'][i % 8]
      this.nbQuestions > 3 && (nom += '_' + parseInt(1 + i / 8))
      switch (listeTypeQuestions[i]) {
        case 'carré':
          nombre = randint(-10, 10, [0, 1])
          solution = nombre * nombre
          solution = new FractionEtendue(solution, 1)
          texteCorr = `$${nom}(${nombre}) = ${ecritureParentheseSiNegatif(nombre)}^2 = ${ecritureParentheseSiNegatif(nombre)} \\times ${ecritureParentheseSiNegatif(nombre)} = ${miseEnEvidence(texNombre(nombre * nombre, 0))}$`
          break
        case 'cube':
          nombre = randint(-5, 5, [0, 1])
          solution = nombre * nombre * nombre
          solution = new FractionEtendue(solution, 1)
          texteCorr = `$${nom}(${nombre}) = ${ecritureParentheseSiNegatif(nombre)}^3 = ${ecritureParentheseSiNegatif(nombre)} \\times ${ecritureParentheseSiNegatif(nombre)} \\times ${ecritureParentheseSiNegatif(nombre)} = ${ecritureParentheseSiNegatif(nombre * nombre)} \\times ${ecritureParentheseSiNegatif(nombre)} = ${miseEnEvidence(texNombre(nombre ** 3, 0))}$`
          break
        case 'racine carrée':
          solution = randint(1, 10)
          solution = new FractionEtendue(solution, 1)
          nombre = solution * solution
          texteCorr = `$${nom}(${nombre}) = ${miseEnEvidence(`\\sqrt{${nombre}}`)} = ${miseEnEvidence(solution.texFraction)} $ car $ ${ecritureParentheseSiNegatif(solution.valeurDecimale)}^2 = ${texNombre(nombre, 0)} $`
          break
        case 'inverse':
          if (this.can) {
            nombre = choice([2, 4, 5, 10])
          } else {
            const expo1 = randint(0, 5)
            nombre = this.can ? choice([2, 4, 5, 10]) : Math.pow(2, expo1) * Math.pow(5, expo1 === 0 ? randint(1, 5) : randint(0, 5))
          }
          Math.random() < 0.25 && (nombre = arrondi(1 / nombre, 6))
          Math.random() < 0.5 && (nombre *= -1)
          solution = new FractionEtendue(1, nombre)
          texteCorr = `$${nom}(${texNombre(nombre, 0)}) = ${miseEnEvidence(texFractionFromString(1, nombre))} = ${miseEnEvidence(solution.valeurDecimale)}$`
          break
      }
      const phrase = listePhrases[i] ? `$${nom}(${texNombre(nombre, 6)})$` : `l'image de $${texNombre(nombre, 6)}$ par la fonction $${nom}$`
      listePhrases[i] && (texteCorr += `<br>L'image de $${texNombre(nombre, 0)}$ par la fonction $${nom}$ est donc $${miseEnEvidence(solution.texFractionSimplifiee)}$.`)
      texte = `Soit $${nom}$ la fonction ${listeTypeQuestions[i]}.<br>
      
      Calculer ${phrase}.`
      texte += ajouteChampTexteMathLive(this, i, '')

      // Si la question n'a jamais été posée, on l'enregistre
      if (this.questionJamaisPosee(i, listeTypeQuestions[i], nombre)) { // <- laisser le i et ajouter toutes les variables qui rendent les exercices différents (par exemple a, b, c et d)
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        // setReponse(this, i, solution, { digits: 6, decimals: listeTypeQuestions[i] === 'inverse' ? 6 : 0, signe: true })
        handleAnswers(this, i, { reponse: { value: solution.texFraction, compare: fonctionComparaison } })
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
    if (!context.isHtml) {
      this.canEnonce = this.listeQuestions[0]
      this.correction = this.listeCorrections[0]
      this.canReponseACompleter = ''
    }
  }
}
