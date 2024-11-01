import { tableauDeVariation } from '../../lib/mathFonctions/etudeFonction.js'
import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { simplificationDeFractionAvecEtapes, texFractionReduite } from '../../lib/outils/deprecatedFractions.js'
import {
  ecritureAlgebrique,
  ecritureAlgebriqueSauf1,
  ecritureParentheseSiNegatif,
  reduireAxPlusB,
  rienSi1
} from '../../lib/outils/ecritures'
import { abs } from '../../lib/outils/nombres'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import Exercice from '../deprecatedExercice.js'

export const titre = 'Déterminer le sens de variation d\'une fonction affine'
export const dateDeModifImportante = '18/05/2023'
/**
 * @author Stéphane Guyon mise à jour et ajout de cas Gilles Mora
 */
export const uuid = 'b72b0'
export const ref = '2F10-6'
export const refs = {
  'fr-fr': ['2F10-6'],
  'fr-ch': []
}
export default function Variationsfonctionaffine () {
  Exercice.call(this)
  this.titre = titre
  this.consigne = ''
  this.nbQuestions = 2 // On complète le nb de questions
  this.nbCols = 1
  this.nbColsCorr = 1
  this.video = ''
  this.spacing = 1
  this.spacingCorr = 1
  this.sup = 4

  this.nouvelleVersion = function () {
    this.sup = parseInt(this.sup)
    this.listeQuestions = []
    this.listeCorrections = []
    let typesDeQuestionsDisponibles = []
    if (this.sup === 1) {
      typesDeQuestionsDisponibles = [1]
    }
    if (this.sup === 2) {
      typesDeQuestionsDisponibles = [2]
    }
    if (this.sup === 3) {
      typesDeQuestionsDisponibles = [3]
    }
    if (this.sup === 4) {
      typesDeQuestionsDisponibles = [1, 2, 3]
    }
    const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions)

    for (let i = 0, a, b, c, d, fc, fd, ligne1, typesDeQuestions, texte, texteCorr, cpt = 0;
      i < this.nbQuestions && cpt < 50;) { // on rajoute les variables dont on a besoin
      const nom = [
        ['f'], ['g'], ['h'], ['u'],
        ['v'], ['w']
      ]
      const nomF = choice(nom)
      typesDeQuestions = listeTypeDeQuestions[i]
      switch (typesDeQuestions) {
        case 1:
          a = randint(-10, 10, 0) // coefficient a de la fonction affine
          b = randint(-10, 10) // coefficient b de la fonction affine
          texte = `Déterminer le sens de variation de la fonction $${nomF}$ définie sur $\\mathbb R$ par : `
          if (choice([true, false])) {
            texte += `$${nomF}(x)=${reduireAxPlusB(a, b)}$.`
          } else {
            texte += `$${b === 0 ? `${nomF}(x)=${rienSi1(a)}x` : `${nomF}(x)=${b}${ecritureAlgebriqueSauf1(a)}x`}$.`
          }
          texteCorr = `On reconnaît que $${nomF}$ est une fonction affine, de la forme $${nomF}(x)=ax+b$, `
          texteCorr += `avec $a=${a}~$ et $b=${b}$. <br>
        On sait qu'une fonction affine est monotone sur $\\mathbb{R}$.<br>
          Son sens de variation dépend du signe de $a$.<br>`
          if (a > 0) {
            texteCorr += `Comme $a=${a}>0$ , la fonction $${nomF}$ est strictement croissante sur $\\mathbb{R}$.<br>`
            ligne1 = ['Var', 10, '-/', 30, '+/', 30]
          } else {
            texteCorr += `Comme $a=${a}<0$ , la fonction $${nomF}$ est strictement décroissante sur $\\mathbb{R}$.<br>`

            ligne1 = ['Var', 10, '+/', 30, '-/', 30]
          }
          texteCorr += 'On peut synthétiser cela dans un tableau de variations :<br><br>'
          texteCorr += tableauDeVariation({
            tabInit: [
              [
                // Première colonne du tableau avec le format [chaine d'entête, hauteur de ligne, nombre de pixels de largeur estimée du texte pour le centrage]
                ['$x$', 2, 30], [`$${nomF}(x)$`, 3, 50]
              ],
              // Première ligne du tableau avec chaque antécédent suivi de son nombre de pixels de largeur estimée du texte pour le centrage
              ['$-\\infty$', 30, '$+\\infty$', 30]
            ],
            // tabLines ci-dessous contient les autres lignes du tableau.
            tabLines: [ligne1],
            colorBackground: '',
            espcl: 3, // taille en cm entre deux antécédents
            deltacl: 0.8, // distance entre la bordure et les premiers et derniers antécédents
            lgt: 3, // taille de la première colonne en cm
            hauteurLignes: [15, 20]
          })
          break

        case 2:
          a = randint(-10, 10, 0) // coefficient a de la fonction affine
          b = randint(-10, 10) // coefficient b de la fonction affine
          d = choice([abs(a) + 1, abs(b) + 1]) // dénominateur
          while (d === 1) {
            a = randint(-10, 10, 0) // coefficient a de la fonction affine
            b = randint(-10, 10) // coefficient b de la fonction affine
            d = choice([abs(a) + 1, abs(b) + 1])
          } // dénominateur
          texte = `Déterminer le sens de variation de la fonction $${nomF}$ définie sur $\\mathbb R$ par : `
          if (choice([true, false])) {
            texte += `$${nomF}(x)=\\dfrac{${reduireAxPlusB(a, b)}}{${d}}$.`
          } else {
            texte += `$${b === 0 ? `${nomF}(x)=\\dfrac{${rienSi1(a)}x}{${d}}` : `${nomF}(x)=\\dfrac{${b}${ecritureAlgebriqueSauf1(a)}x}{${d}}`}$.`
          }
          texteCorr = `On reconnaît que $${nomF}$ est une fonction affine, de la forme $${nomF}(x)=ax+b$, `
          texteCorr += `avec $a=\\dfrac{${a}}{${d}}${simplificationDeFractionAvecEtapes(a, d)}$ et $b=\\dfrac{${b}}{${d}}${simplificationDeFractionAvecEtapes(b, d)}$. <br>
        On sait qu'une fonction affine est monotone sur $\\mathbb{R}$.<br>
          Son sens de variation dépend du signe de $a$.<br>`
          if (a > 0) {
            texteCorr += `Comme $a=${texFractionReduite(a, d)}>0$ , la fonction $${nomF}$ est strictement croissante sur $\\mathbb{R}$.<br>`
            ligne1 = ['Var', 10, '-/', 30, '+/', 30]
          } else {
            texteCorr += `Comme $a=${texFractionReduite(a, d)}<0$ , la fonction $${nomF}$ est strictement décroissante sur $\\mathbb{R}$.<br>`

            ligne1 = ['Var', 10, '+/', 30, '-/', 30]
          }
          texteCorr += 'On peut synthétiser cela dans un tableau de variations :<br><br>'
          texteCorr += tableauDeVariation({
            tabInit: [
              [
                // Première colonne du tableau avec le format [chaine d'entête, hauteur de ligne, nombre de pixels de largeur estimée du texte pour le centrage]
                ['$x$', 2, 30], [`$${nomF}(x)$`, 3, 50]
              ],
              // Première ligne du tableau avec chaque antécédent suivi de son nombre de pixels de largeur estimée du texte pour le centrage
              ['$-\\infty$', 30, '$+\\infty$', 30]
            ],
            // tabLines ci-dessous contient les autres lignes du tableau.
            tabLines: [ligne1],
            colorBackground: '',
            espcl: 3, // taille en cm entre deux antécédents
            deltacl: 0.8, // distance entre la bordure et les premiers et derniers antécédents
            lgt: 3, // taille de la première colonne en cm
            hauteurLignes: [15, 20]
          })
          break

        case 3:
          a = randint(-10, 10, 0) // coefficient a de la fonction affine
          b = randint(-10, 10) // coefficient b de la fonction affine
          c = randint(-10, 5)
          d = randint(c + 1, 10)
          fc = a * c + b
          fd = a * d + b
          texte = `Dresser le tableau de variations de la fonction $${nomF}$ définie sur $[${c}\\,;\\,${d}]$ par : `
          if (choice([true, false])) {
            texte += `$${nomF}(x)=${reduireAxPlusB(a, b)}$.`
          } else {
            texte += `$${b === 0 ? `${nomF}(x)=${rienSi1(b)}x` : `${nomF}(x)=${b}${ecritureAlgebriqueSauf1(a)}x`}$.`
          }
          texteCorr = `On reconnaît que $${nomF}$ est une fonction affine, de la forme $${nomF}(x)=ax+b$, `
          texteCorr += `avec $a=${a}~$ et $b=${b}$. <br>
          On sait qu'une fonction affine est monotone sur $\\mathbb{R}$.<br>
            Son sens de variation dépend du signe de $a$.<br>`
          if (a > 0) {
            texteCorr += `Comme $a=${a}>0$ , la fonction $${nomF}$ est strictement croissante sur $\\mathbb{R}$.<br>
            `
            ligne1 = ['Var', 10, `-/$${fc}$`, 30, `+/$${fd}$`, 30]
          } else {
            texteCorr += `Comme $a=${a}<0$ , la fonction $${nomF}$ est strictement décroissante sur $\\mathbb{R}$.<br>`

            ligne1 = ['Var', 10, `+/$${fc}$`, 30, `-/$${fd}$`, 30]
          }
          texteCorr += `De plus, $${nomF}(${c})=${a === 1 ? '' : `${a}\\times`} ${ecritureParentheseSiNegatif(c)}${ecritureAlgebrique(b)}=${fc}$ et $${nomF}(${d})=${a === 1 ? '' : `${a}\\times`}${ecritureParentheseSiNegatif(d)}${ecritureAlgebrique(b)}=${fd}$.<br>`
          texteCorr += 'On obtient ainsi le tableau de variations :<br><br>'
          texteCorr += tableauDeVariation({
            tabInit: [
              [
                // Première colonne du tableau avec le format [chaine d'entête, hauteur de ligne, nombre de pixels de largeur estimée du texte pour le centrage]
                ['$x$', 2, 30], [`$${nomF}(x)$`, 3, 50]
              ],
              // Première ligne du tableau avec chaque antécédent suivi de son nombre de pixels de largeur estimée du texte pour le centrage
              [`$${c}$`, 30, `$${d}$`, 30]
            ],
            // tabLines ci-dessous contient les autres lignes du tableau.
            tabLines: [ligne1],
            colorBackground: '',
            espcl: 3, // taille en cm entre deux antécédents
            deltacl: 0.8, // distance entre la bordure et les premiers et derniers antécédents
            lgt: 3, // taille de la première colonne en cm
            hauteurLignes: [15, 20]
          })
          break
      }

      if (this.questionJamaisPosee(i, a, b)) {
        // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }

    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = ['Types de question ', 4, '1 : Avec des  entiers\n2 : Avec des fractions\n3 : Sur un intervalle borné\n4 : Mélange des cas précédents']
}
