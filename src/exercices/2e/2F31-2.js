import { estParfait } from '../../lib/outils/puissance.js'
import { tableauVariationsFonction } from '../../modules/mathFonctions/outilsMaths.js'
import Exercice from '../Exercice.js'
import { fixeBordures, mathalea2d } from '../../modules/2dGeneralites.js'
import { context } from '../../modules/context.js'
import {
  listeQuestionsToContenu,
  choice,
  randint,
  abs,
  sp,
  gestionnaireFormulaireTexte
} from '../../modules/outils.js'
export const titre = 'Utiliser les variations des fonctions de référence pour comparer ou encadrer'
export const dateDePublication = '31/01/2022'
export const dateDeModifImportante = '12/07/2023'
/**
 * Description didactique de l'exercice
 * @author Gilles Mora, Louis Paternault
 * Référence
*/
export const uuid = '1ca05'
export const ref = '2F31-2'
export default function EncadrerAvecFctRef () {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.consigne = ''
  this.nbQuestions = 3
  // this.nbQuestionsModifiable = false
  this.nbCols = 2 // Uniquement pour la sortie LaTeX
  this.nbColsCorr = 2 // Uniquement pour la sortie LaTeX
  this.sup = 5
  context.isHtml ? this.spacing = 2 : this.spacing = 1
  context.isHtml ? this.spacingCorr = 2 : this.spacingCorr = 1
  this.tailleDiaporama = 2 // Pour les exercices chronométrés. 50 par défaut pour les exercices avec du texte
  this.video = '' // Id YouTube ou url
  this.listePackages = ['tkz-tab']
  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    const listeTypeQuestions = gestionnaireFormulaireTexte({ saisie: this.sup, max: 4, melange: 5, defaut: 1, nbQuestions: this.nbQuestions, listeOfCase: ['carré', 'inverse', 'racine carrée', 'cube'] })
    for (let i = 0, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      // Boucle principale où i+1 correspond au numéro de la question
      // les variables communes à toutes les questions
      let fonction // La fonction étudiée
      let derivee // Sa dérivée
      let xMin // La borne gauche de l'intervalle d'étude (prévoir une valeur de remplacement pour les infinis + et -)
      let xMax // La borne droite de l'intervalle d'étude
      let substituts = [] // les valeur de substitution pour xMin ou xMax...
      let latex // amené à disparaître quand tableauDeVariation fera correctement du latex !
      let texteCorrAvantTableau // la partie de la correction avant le tableau
      let texteCorrApresTableau // la partie de la correction après le tableau
      let tableau // le tableau de variation
      switch (listeTypeQuestions[i]) { // Suivant le type de question, le contenu sera différent
        case 'carré': {
          latex = false
          const N = choice([1, 2, 3, 4, 5])
          fonction = x => x ** 2
          derivee = x => 2 * x
          switch (N) {
            case 1: { // cas x<a avec a<0 ou a>0
              const a = randint(-12, 12, 0)
              xMin = -200
              xMax = a
              substituts = [{ antVal: -200, antTex: '-∞', imgVal: -40000, imgTex: '+∞' }]
              const large = choice([true, false])
              texte = `Compléter par l'information la plus précise possible (on pourra utiliser un tableau de variations) : <br>Si $x${large ? '\\leqslant' : ' < '}${a}$ alors  $x^2$ ......`
              texteCorrAvantTableau = `$x${large ? '\\leqslant' : ' < '} ${a}$ signifie $x\\in ]-\\infty;${a}${large ? ']' : ' [ '}$. <br>
                Puisque la fonction carré est strictement décroissante sur $]-\\infty;0]$ et strictement croissante sur $[0;+\\infty[$, on obtient son tableau de variations
                    sur l'intervalle $]-\\infty;${a}]$ : <br>
                `
              if (a < 0) {
                texteCorrApresTableau = `<br>On constate que le minimum de $x^2$ sur $]-\\infty;${a}]$ est $${a ** 2}$. <br>
            On en déduit que si  $x${large ? '\\leqslant' : ' < '}${a}$ alors  $x^2\\geqslant ${a ** 2}$.
            <br> Remarque :  la fonction carré étant strictement décroissante sur $]-\\infty;0]$, elle change l'ordre.<br>
            Ainsi les antécédents et les images sont rangées dans l'ordre inverse : <br>
            Si $x${large ? '\\leqslant' : ' < '}${a}$ alors  $x^2\\geqslant (${a})^2$ soit $x^2\\geqslant ${a ** 2}$.`
              } else {
                texteCorrApresTableau = `<br>On constate que le minimum de $x^2$ sur $]-\\infty;${a}]$ est $0$. <br>
        On en déduit que si  $x${large ? '\\leqslant' : ' < '}${a}$ alors  $x^2\\geqslant 0$.`
              }
            }
              break
            case 2: { // cas x>a
              const a = randint(-12, 12, 0)
              const large = choice([true, false])
              xMin = a
              xMax = 200
              substituts = [{ antVal: 200, antTex: '+∞', imgVal: 40000, imgTex: '+∞' }]
              texte = `Compléter par l'information la plus précise possible (on pourra utiliser un tableau de variations) : <br>Si $x${large ? '\\geqslant' : ' > '}${a}$ alors  $x^2$ ......`
              texteCorrAvantTableau = `$x${large ? '\\geqslant' : ' > '} ${a}$ signifie $x\\in ${large ? '[' : ' ] '}${a};+\\infty[$. <br>
                Puisque la fonction carré est strictement décroissante sur $]-\\infty;0]$ et strictement croissante sur $[0;+\\infty[$, on obtient son tableau de variations
                    sur l'intervalle $[${a};+\\infty[$ : <br>
                `
              if (a > 0) {
                texteCorrApresTableau = `On constate que le minimum de $x^2$ sur $[${a};+\\infty[$ est $${a ** 2}$. <br>
            On en déduit que si  $x${large ? '\\geqslant' : ' > '}${a}$ alors  $x^2${large ? '\\geqslant' : ' > '} ${a ** 2}$.
            <br> Remarque :  la fonction carré étant strictement croissante sur $[0;+\\infty[$, elle conserve l'ordre sur cet intervalle.<br>
            Ainsi les antécédents et les images sont rangées dans le même ordre : <br>
          Si  $x${large ? '\\geqslant' : ' > '}${a}$ alors  $x^2${large ? '\\geqslant' : ' > '} ${a}^2$ soit  $x^2${large ? '\\geqslant' : ' > '} ${a ** 2}$.`
              } else {
                texteCorrApresTableau = `On constate que le minimum de $x^2$ sur $[${a};+\\infty[$ est $0$. <br>
          On en déduit que si  $x${large ? '\\geqslant' : ' > '}${a}$ alors  $x^2\\geqslant 0$.
          `
              }
            }
              break
            case 3: { // cas a<x<b avec a>0
              const a = randint(1, 10)
              const b = randint(a + 1, 12)
              xMin = a
              xMax = b
              const large1 = choice([true, false])
              const large2 = choice([true, false])
              texte = `Compléter par l'information la plus précise possible (on pourra utiliser un tableau de variations) : <br>Si $${a} ${large1 ? '\\leqslant' : ' < '} x ${large2 ? '\\leqslant' : ' < '}${b}$ alors ${sp(3)} .......  $x^2$ ........`
              texteCorrAvantTableau = `$${a} ${large1 ? '\\leqslant' : ' < '} x ${large2 ? '\\leqslant' : ' < '}${b}$ signifie $x\\in ${large1 ? '[' : ' ] '}${a};${b}${large2 ? ']' : ' [ '}$. <br>
                  Puisque la fonction carré est strictement décroissante sur $]-\\infty;0]$ et strictement croissante sur $[0;+\\infty[$, on obtient son tableau de variations
                      sur l'intervalle $[${a};${b}]$ : <br>`
              texteCorrApresTableau = `On constate que le minimum de $x^2$ sur $[${a};${b}]$  est $${a ** 2}$ et son maximum est $${b ** 2}$. <br>
              On en déduit que si  $${a} ${large1 ? '\\leqslant' : ' < '} x ${large2 ? '\\leqslant' : ' < '}${b}$ alors ${sp(2)}$${a ** 2} ${large1 ? '\\leqslant' : ' < '} x^2 ${large2 ? '\\leqslant' : ' < '}${b ** 2}$.
              <br> Remarque : la fonction carré étant strictement croissante sur $[0;+\\infty[$, elle conserve l'ordre sur cet intervalle.<br>
              Ainsi les antécédents et les images sont rangées dans le même ordre : <br>
            Si  $${a} ${large1 ? '\\leqslant' : ' < '} x ${large2 ? '\\leqslant' : ' < '}${b}$ alors $${sp(2)}${a}^2 ${large1 ? '\\leqslant' : ' < '} x^2 ${large2 ? '\\leqslant' : ' < '}${b}^2$, soit $${sp(2)}${a ** 2} ${large1 ? '\\leqslant' : ' < '} x^2 ${large2 ? '\\leqslant' : ' < '}${b ** 2}$.`
            }
              break
            case 4: { // cas a<x<b avec b<0
              const a = -randint(2, 12)
              const b = randint(a + 1, -1)
              xMin = a
              xMax = b
              const large1 = choice([true, false])
              const large2 = choice([true, false])
              texte = `Compléter par l'information la plus précise possible (on pourra utiliser un tableau de variations) : <br>Si $${a} ${large1 ? '\\leqslant' : ' < '} x ${large2 ? '\\leqslant' : ' < '}${b}$ alors ${sp(3)} .......  $x^2$  .......`
              texteCorrAvantTableau = `$${a} ${large1 ? '\\leqslant' : ' < '} x ${large2 ? '\\leqslant' : ' < '}${b}$ signifie $x\\in ${large1 ? '[' : ' ] '}${a};${b}${large2 ? ']' : ' [ '}$. <br>
                      Puisque la fonction carré est strictement décroissante sur $]-\\infty;0]$ et strictement croissante sur $[0;+\\infty[$, on obtient son tableau de variations
                          sur l'intervalle $[${a};${b}]$ : <br>`
              texteCorrApresTableau = `On constate que le minimum de $x^2$ sur $[${a};${b}]$  est $${b ** 2}$ et son maximum est $${a ** 2}$. <br>
                  On en déduit que si  $${a} ${large1 ? '\\leqslant' : ' < '} x ${large2 ? '\\leqslant' : ' < '}${b}$ alors ${sp(2)}$${b ** 2} ${large2 ? '\\leqslant' : ' < '} x^2 ${large1 ? '\\leqslant' : ' < '}${a ** 2}$.
                  <br> Remarque :  la fonction carré étant strictement décroissante sur $]-\\infty;0]$, elle change l'ordre sur cet intervalle.<br>
                  Ainsi les antécédents et les images sont rangées dans l'ordre inverse : <br>
            Si $${a} ${large1 ? '\\leqslant' : ' < '} x ${large2 ? '\\leqslant' : ' < '}${b}$ alors ${sp(2)}$(${a})^2 ${large1 ? '\\geqslant' : ' > '} x^2 ${large2 ? '\\geqslant' : ' > '}(${b})^2$ soit $${a ** 2} ${large1 ? '\\geqslant' : ' > '} x^2 ${large2 ? '\\geqslant' : ' > '}${b ** 2}$.`
            }
              break
            case 5: { // cas a<x<b avec a<0 et b>0
              const a = randint(-10, -1)
              const b = randint(1, 10)
              xMin = a
              xMax = b
              const large1 = choice([true, false])
              const large2 = choice([true, false])
              texte = `Compléter par l'information la plus précise possible (on pourra utiliser un tableau de variations) : <br>Si $${a} ${large1 ? '\\leqslant' : ' < '} x ${large2 ? '\\leqslant' : ' < '}${b}$ alors ${sp(3)} .......  $x^2$ ........`
              texteCorrAvantTableau = `$${a} ${large1 ? '\\leqslant' : ' < '} x ${large2 ? '\\leqslant' : ' < '}${b}$ signifie $x\\in ${large1 ? '[' : ' ] '}${a};${b}${large2 ? ']' : ' [ '}$. <br>
                  Puisque la fonction carré est strictement décroissante sur $]-\\infty;0]$ et strictement croissante sur $[0;+\\infty[$, on obtient son tableau de variations
                      sur l'intervalle $[${a};${b}]$ : <br>
                  `
              texteCorrApresTableau = `On constate que le minimum de $x^2$ sur $[${a};${b}]$  est $0$ et son maximum est $${Math.max(abs(a), b) ** 2}$. <br>
              On en déduit que si  $${a} ${large1 ? '\\leqslant' : ' < '} x ${large2 ? '\\leqslant' : ' < '}${b}$ alors ${sp(2)}$0 ${large1 ? '\\leqslant' : ' < '} x^2 ${large2 ? '\\leqslant' : ' < '}${Math.max(abs(a), b) ** 2}$.`
            }
              break
          }
        }
          break
        case 'inverse': {
          latex = true
          let a, b
          const N = 3// choice([1, 2, 3])
          const large1 = choice([true, false])
          const large2 = choice([true, false])
          fonction = x => 1 / x
          derivee = x => -1 / x / x
          switch (N) {
            case 1: // cas a<x<b avec a>0
              a = randint(2, 20)
              b = randint(a + 1, 20)
              substituts = [{ antVal: a, antTex: a.toString(), imgVal: 1 / a, imgTex: `\\frac{1}{${a}}` },
                { antVal: b, antTex: b.toString(), imgVal: 1 / b, imgTex: `\\frac{1}{${b}}` }]
              texte = `Compléter par l'information la plus précise possible (on pourra utiliser un tableau de variations) : <br>Si $${b} ${large1 ? '\\leqslant' : ' < '} x ${large2 ? '\\leqslant' : ' < '}${b}$ alors ${sp(3)} .......  $\\dfrac{1}{x}$  .......`
              texteCorrAvantTableau = `$${a} ${large1 ? '\\leqslant' : ' < '} x ${large2 ? '\\leqslant' : ' < '}${b}$ signifie $x\\in ${large1 ? '[' : ' ] '}${a};${b}${large2 ? ']' : ' [ '}$. <br>
                      Puisque la fonction inverse est strictement décroissante sur $]-\\infty;0[$ et strictement décroissante sur $[0;+\\infty[$, on obtient son tableau de variations
                          sur l'intervalle $[${a};${b}]$ : <br>
                      `
              texteCorrApresTableau = `On constate que le minimum de $\\dfrac{1}{x}$ sur $[${a};${b}]$  est $\\dfrac{1}{${b}}$ et son maximum est $\\dfrac{1}{${a}}$. <br>
                  On en déduit que si  $${a} ${large1 ? '\\leqslant' : ' < '} x ${large2 ? '\\leqslant' : ' < '}${b}$ alors ${sp(2)}$\\dfrac{1}{${b}} ${large2 ? '\\leqslant' : ' < '} \\dfrac{1}{x} ${large1 ? '\\leqslant' : ' < '}\\dfrac{1}{${a}}$.
                  <br> Remarque :  la fonction inverse étant strictement décroissante sur $]0; +\\infty[$, elle change l'ordre.<br>
                  Ainsi les antécédents et les images sont rangées dans l'ordre inverse : <br>
            Si $${a} ${large1 ? '\\leqslant' : ' < '} x ${large2 ? '\\leqslant' : ' < '}${b}$ alors ${sp(2)}$\\dfrac{1}{${a}} ${large1 ? '\\geqslant' : ' > '} \\dfrac{1}{x} ${large2 ? '\\geqslant' : ' > '}\\dfrac{1}{${b}}$ `

              break
            case 2: // cas a<x<b avec b<0
              a = randint(-20, -3)
              b = randint(a + 1, -2)
              substituts = [{ antVal: a, antTex: a.toString(), imgVal: 1 / a, imgTex: `-\\frac{1}{${-a}}` },
                { antVal: b, antTex: b.toString(), imgVal: 1 / b, imgTex: `-\\frac{1}{${-b}}` }]
              texte = `Compléter par l'information la plus précise possible (on pourra utiliser un tableau de variations) : <br>Si $${a} ${large1 ? '\\leqslant' : ' < '} x ${large2 ? '\\leqslant' : ' < '}${b}$ alors ${sp(3)} .......  $\\dfrac{1}{x}$  .......`
              texteCorrAvantTableau = `$${a} ${large1 ? '\\leqslant' : ' < '} x ${large2 ? '\\leqslant' : ' < '}${b}$ signifie $x\\in ${large1 ? '[' : ' ] '}${a};${b}${large2 ? ']' : ' [ '}$. <br>
                      Puisque la fonction inverse est strictement décroissante sur $]-\\infty;0[$ et strictement décroissante sur $[0;+\\infty[$, on obtient son tableau de variations
                          sur l'intervalle $[${a};${b}]$ : <br>`
              texteCorrApresTableau = `On constate que le minimum de $\\dfrac{1}{x}$ sur $[${a};${b}]$  est $-\\dfrac{1}{${-b}}$ et son maximum est $-\\dfrac{1}{${-a}}$. <br>
                  On en déduit que si  $${a} ${large1 ? '\\leqslant' : ' < '} x ${large2 ? '\\leqslant' : ' < '}${b}$ alors ${sp(2)}$-\\dfrac{1}{${-b}} ${large2 ? '\\leqslant' : ' < '} \\dfrac{1}{x} ${large1 ? '\\leqslant' : ' < '}-\\dfrac{1}{${-a}}$.
                  <br> Remarque :  la fonction inverse étant strictement décroissante sur $]-\\infty;0[$, elle change l'ordre.<br>
                  Ainsi les antécédents et les images sont rangées dans l'ordre inverse : <br>
            Si $${a} ${large1 ? '\\leqslant' : ' < '} x ${large2 ? '\\leqslant' : ' < '}${b}$ alors ${sp(2)}$-\\dfrac{1}{${-a}} ${large1 ? '\\geqslant' : ' > '} \\dfrac{1}{x} ${large2 ? '\\geqslant' : ' > '}-\\dfrac{1}{${-b}}$ `
              break
            case 3: { // cas x<a avec a<0 ou x>a aveca>0
              const large = choice([true, false])
              a = -200
              b = randint(-12, -2) // -\infty et b négatifs
              if (choice([true, false])) { // b et +\infty positifs
                const aTemp = -a
                a = -b
                b = aTemp
                substituts = [{ antVal: a, antTex: a.toString(), imgVal: 1 / a, imgTex: `\\frac{1}{${a}}` },
                  { antVal: b, antTex: '+∞', imgVal: 1 / b, imgTex: '0' }]
                texte = `Compléter par l'information la plus précise possible (on pourra utiliser un tableau de variations) : <br>Si $x${large ? '\\geqslant' : ' > '}${a}$ alors  $\\dfrac{1}{x}$ ......`
                texteCorrAvantTableau = `$x${large ? '\\geqslant' : ' > '} ${a}$ signifie $x\\in ${large ? ']' : ' [ '};+\\infty;${b}[$. <br>
              Puisque la fonction inverse est strictement décroissante sur $]0;+\\infty[$, on obtient son tableau de variations
                  sur l'intervalle $]0;+\\infty[$ : <br>`
                texteCorrApresTableau = `On constate que le maximum de $\\dfrac{1}{x}$ sur $]0;+\\infty[$ est $\\dfrac{1}{${a}}$. <br>
            On en déduit que si  $x${large ? '\\geqslant' : ' < '}${a}$ alors  $\\dfrac{1}{x}${large ? '\\leqslant' : ' < '} \\dfrac{1}{${a}}$.
            <br> Remarque :  la fonction inverse étant strictement décroissante sur $]0;+\\infty[$, elle change l'ordre.<br>
            Ainsi les antécédents et les images sont rangées dans l'ordre inverse : <br>
            Si $x${large ? '\\geqslant' : ' > '}${a}$ alors  $\\dfrac{1}{x}${large ? '\\leqslant' : ' < '}\\dfrac{1}{${a}}$.`
              } else {
                texte = `Compléter par l'information la plus précise possible (on pourra utiliser un tableau de variations) : <br>Si $x${large ? '\\leqslant' : ' < '}${b}$ alors  $\\dfrac{1}{x}$ ......`
                texteCorrAvantTableau = `$x${large ? '\\leqslant' : ' < '} ${b}$ signifie $x\\in ]-\\infty;${b}${large ? ']' : ' [ '}$. <br>
              Puisque la fonction inverse est strictement décroissante sur $]-\\infty;0[$ et strictement décroissante sur $]0;+\\infty[$, on obtient son tableau de variations
                  sur l'intervalle $]-\\infty;${b}]$ : <br>`
                texteCorrApresTableau = `On constate que le minimum de $\\dfrac{1}{x}$ sur $]-\\infty;${b}]$ est $-\\dfrac{1}{${-b}}$. <br>
            On en déduit que si  $x${large ? '\\leqslant' : ' < '}${b}$ alors  $\\dfrac{1}{x}${large ? '\\geqslant' : ' > '} -\\dfrac{1}{${-b}}$.
            <br> Remarque :  la fonction inverse étant strictement décroissante sur $]-\\infty;0[$, elle change l'ordre.<br>
            Ainsi les antécédents et les images sont rangées dans l'ordre inverse : <br>
            Si $x${large ? '\\leqslant' : ' < '}${b}$ alors  $\\dfrac{1}{x}${large ? '\\geqslant' : ' > '}-\\dfrac{1}{${-b}}$.`
                substituts = [{ antVal: a, antTex: '-∞', imgVal: 1 / a, imgTex: '0' },
                  { antVal: a, antTex: b.toString(), imgVal: 1 / b, imgTex: `\\frac{1}{${b}}` }]
              }// a est toujours le min et b le max
            }
              break
          }
          xMin = a
          xMax = b
          break
        }
        case 'racine carrée': {
          latex = true
          const N = choice([1, 2, 3])
          fonction = x => Math.sqrt(x)
          derivee = x => 1 / 2 / Math.sqrt(x)
          switch (N) {
            case 1: { // cas x<a
              const a = randint(0, 100)
              const large = choice([true, false])
              texte = `Compléter par l'information la plus précise possible (on pourra utiliser un tableau de variations) : <br>Si $x${large ? '\\leqslant' : ' < '}${a}$ alors  $\\sqrt{x}$ ......`
              texteCorrAvantTableau = `$x${large ? '\\leqslant' : ' < '} ${a}$ signifie $x\\in [0;${a}${large ? ']' : ' [ '}$ puisque $x\\geqslant 0$. <br>
             Puisque $\\sqrt{${a}}=${Math.sqrt(a)}$ et que la fonction racine carrée est strictement croissante sur $[0;+\\infty[$, on obtient son tableau de variations
                    sur l'intervalle $[0;${a}]$ : <br>
                `
              const racineDeA = estParfait(a) ? Math.sqrt(a).toString() : `$\\sqrt{${a}}$`
              texteCorrApresTableau = `On constate que le maximum de $\\sqrt{x}$ sur $[0;${a}]$ est $${racineDeA}$. <br>
            On en déduit que si  $x${large ? '\\leqslant' : ' < '}${a}$ alors  $\\sqrt{x}\\leqslant ${racineDeA}$.
            <br> Remarque :  la fonction racine carrée étant strictement croissante sur $[0+\\infty[$, elle conserve l'ordre.<br>
            Ainsi les antécédents et les images sont rangées dans le même ordre : <br>
            Si $x${large ? '\\leqslant' : ' < '}${a}$ alors  $\\sqrt{x}${large ? '\\leqslant' : ' < '} ${racineDeA}$.
        `
            }
              break
            case 2: { // cas x>a
              const a = randint(0, 100)
              if (a === 0 || a === 1 || a === 4 || a === 9 || a === 16 || a === 25 || a === 36 || a === 49 || a === 64 || a === 81 || a === 100) {
                const large = choice([true, false])
                texte = `Compléter par l'information la plus précise possible (on pourra utiliser un tableau de variations) : <br>Si $x${large ? '\\geqslant' : ' > '}${a}$ alors  $\\sqrt{x}$ ......`
                texteCorr = `$x${large ? '\\geqslant' : ' > '} ${a}$ signifie $x\\in ${large ? '[' : ' ] '}${a};+\\infty[$. <br>
                Puisque $\\sqrt{${a}}=${Math.sqrt(a)}$ et que la fonction racine carrée est strictement croissante sur $[0;+\\infty[$, on obtient son tableau de variations
                    sur l'intervalle $[${a};+\\infty[$ : <br>
                `

                /*  texteCorr += mathalea2d({
                  xmin: -0.5,
                  ymin: -6.1,
                  xmax: 30,
                  ymax: 0.1,
                  scale: 0.6,
                  zoom: 1
                }, tableauDeVariation({
                  tabInit: [
                    [
                      // Première colonne du tableau avec le format [chaine d'entête, hauteur de ligne, nombre de pixels de largeur estimée du texte pour le centrage]
                      ['$x$', 2, 10], ['$\\sqrt{x}$', 4, 30]
                    ],
                    // Première ligne du tableau avec chaque antécédent suivi de son nombre de pixels de largeur estimée du texte pour le centrage
                    [`$${a}$`, 10, '$+\\infty$', 10]
                  ],
                  // tabLines ci-dessous contient les autres lignes du tableau.
                  tabLines: [ligne1],
                  colorBackground: '',
                  espcl: 3, // taille en cm entre deux antécédents
                  deltacl: 1, // distance entre la bordure et les premiers et derniers antécédents
                  lgt: 3, // taille de la première colonne en cm
                  hauteurLignes: [15, 15]
                }))
*/
                texteCorr += `<br>On constate que le minimum de $\\sqrt{x}$ sur $[${a};+\\infty[$ est $${Math.sqrt(a)}$. <br>
            On en déduit que si  $x${large ? '\\geqslant' : ' > '}${a}$ alors  $\\sqrt{x}\\geqslant ${Math.sqrt(a)}$.
            <br> Remarque :  la fonction racine carrée étant strictement croissante sur $[0+\\infty[$, elle conserve l'ordre.<br>
            Ainsi les antécédents et les images sont rangées dans le même ordre : <br>
            Si $x${large ? '\\geqslant' : ' > '}${a}$ alors  $\\sqrt{x}${large ? '\\geqslant' : ' > '} ${Math.sqrt(a)}$.
        `
              } else {
                const large = choice([true, false])
                texte = `Compléter par l'information la plus précise possible (on pourra utiliser un tableau de variations) : <br>Si $x${large ? '\\geqslant' : ' > '}${a}$ alors  $\\sqrt{x}$ ......`
                texteCorr = `$x${large ? '\\geqslant' : ' > '} ${a}$ signifie $x\\in ${large ? '[' : ' ] '}${a};+\\infty[$. <br>
                  Puisque la fonction racine carrée est strictement croissante sur $[0;+\\infty[$, on obtient son tableau de variations
                      sur l'intervalle $[${a};+\\infty[$ : <br>
                  `

                /*  texteCorr += mathalea2d({
                  xmin: -0.5,
                  ymin: -6.1,
                  xmax: 30,
                  ymax: 0.1,
                  scale: 0.6,
                  zoom: 1
                }, tableauDeVariation({
                  tabInit: [
                    [
                      // Première colonne du tableau avec le format [chaine d'entête, hauteur de ligne, nombre de pixels de largeur estimée du texte pour le centrage]
                      ['$x$', 2, 10], ['$\\sqrt{x}$', 4, 30]
                    ],
                    // Première ligne du tableau avec chaque antécédent suivi de son nombre de pixels de largeur estimée du texte pour le centrage
                    [`$${a}$`, 10, '$+\\infty$', 10]
                  ],
                  // tabLines ci-dessous contient les autres lignes du tableau.
                  tabLines: [ligne1],
                  colorBackground: '',
                  espcl: 3, // taille en cm entre deux antécédents
                  deltacl: 1, // distance entre la bordure et les premiers et derniers antécédents
                  lgt: 3, // taille de la première colonne en cm
                  hauteurLignes: [15, 15]
                }))
*/
                texteCorr += `<br>On constate que le minimum de $\\sqrt{x}$ sur $[${a};+\\infty[$ est $\\sqrt{${a}}$. <br>
              On en déduit que si  $x${large ? '\\geqslant' : ' > '}${a}$ alors  $\\sqrt{x}${large ? '\\geqslant' : ' > '} \\sqrt{${a}}$.
              <br> Remarque :  la fonction racine carrée étant strictement croissante sur $[0+\\infty[$, elle conserve l'ordre.<br>
              Ainsi les antécédents et les images sont rangées dans le même ordre : <br>
              Si $x${large ? '\\geqslant' : ' > '}${a}$ alors  $\\sqrt{x}${large ? '\\geqslant' : ' > '} \\sqrt{${a}}$.
          `
              }
            }
              break
            case 3: { // cas a<x<b
              const a = randint(0, 100)
              const b = randint(a + 1, 100)
              if (a === 0 || a === 1 || a === 4 || a === 9 || a === 16 || a === 25 || a === 36 || a === 49 || a === 64 || a === 81 || a === 100) {
                if (b === 1 || b === 4 || b === 9 || b === 16 || b === 25 || b === 36 || b === 49 || b === 64 || b === 81 || b === 100) {
                  const large = choice([true, false])
                  texte = `Compléter par l'information la plus précise possible (on pourra utiliser un tableau de variations) : <br>Si $${a}${large ? ' \\leqslant ' : ' < '} x ${large ? '\\leqslant' : ' < '} ${b}$ alors  ...... $\\sqrt{x}$ ......`
                  texteCorr = `$${a}${large ? '\\leqslant' : ' < '} x ${large ? '\\leqslant' : ' < '}${b}$ signifie $x\\in ${large ? '[' : ' ] '}${a};${b}${large ? ']' : ' [ '}$. <br>
                Puisque $\\sqrt{${a}}=${Math.sqrt(a)}$ et $\\sqrt{${b}}=${Math.sqrt(b)}$ et que  la fonction racine carrée est strictement croissante sur $[0;+\\infty[$, on obtient son tableau de variations
                    sur l'intervalle $[${a};${b}]$ : <br>
                `

                  /*   texteCorr += mathalea2d({
                    xmin: -0.5,
                    ymin: -6.1,
                    xmax: 30,
                    ymax: 0.1,
                    scale: 0.6,
                    zoom: 1
                  }, tableauDeVariation({
                    tabInit: [
                      [
                        // Première colonne du tableau avec le format [chaine d'entête, hauteur de ligne, nombre de pixels de largeur estimée du texte pour le centrage]
                        ['$x$', 2, 10], ['$\\sqrt{x}$', 4, 30]
                      ],
                      // Première ligne du tableau avec chaque antécédent suivi de son nombre de pixels de largeur estimée du texte pour le centrage
                      [`$${a}$`, 10, `$${b}$`, 10]
                    ],
                    // tabLines ci-dessous contient les autres lignes du tableau.
                    tabLines: [ligne1],
                    colorBackground: '',
                    espcl: 3, // taille en cm entre deux antécédents
                    deltacl: 1, // distance entre la bordure et les premiers et derniers antécédents
                    lgt: 3, // taille de la première colonne en cm
                    hauteurLignes: [15, 15]
                  }))
*/
                  texteCorr += `<br>On constate que le minimum de $\\sqrt{x}$ sur $[${a};${b}]$ est $${Math.sqrt(a)}$ et son maximum est $${Math.sqrt(b)}$. <br>
            On en déduit que si $${a}${large ? '\\leqslant' : ' < '} x ${large ? '\\leqslant' : ' < '}${b}$ alors  $${Math.sqrt(a)}${large ? '\\leqslant' : ' < '} \\sqrt{x} ${large ? '\\leqslant' : ' < '}${Math.sqrt(b)}$.
            <br> Remarque :  la fonction racine carrée étant strictement croissante sur $[0+\\infty[$, elle conserve l'ordre.<br>
            Ainsi les antécédents et les images sont rangées dans le même ordre : <br>
            Si $${a}${large ? '\\leqslant' : ' < '} x ${large ? '\\leqslant' : ' < '}${b}$ alors  $${Math.sqrt(a)}${large ? '\\leqslant' : ' < '} \\sqrt{x} ${large ? '\\leqslant' : ' < '}${Math.sqrt(b)}$.
        `
                } else {
                  const large = choice([true, false])
                  texte = `Compléter par l'information la plus précise possible (on pourra utiliser un tableau de variations) : <br>Si $${a}${large ? ' \\leqslant ' : ' < '} x ${large ? '\\leqslant' : ' < '} ${b}$ alors  ...... $\\sqrt{x}$ ......`
                  texteCorr = `$${a}${large ? '\\leqslant' : ' < '} x ${large ? '\\leqslant' : ' < '}${b}$ signifie $x\\in ${large ? '[' : ' ] '}${a};${b}${large ? ']' : ' [ '}$. <br>
                Puisque $\\sqrt{${a}}=${Math.sqrt(a)}$  et que  la fonction racine carrée est strictement croissante sur $[0;+\\infty[$, on obtient son tableau de variations
                    sur l'intervalle $[${a};${b}]$ : <br>
                `

                  /*    texteCorr += mathalea2d({
                    xmin: -0.5,
                    ymin: -6.1,
                    xmax: 30,
                    ymax: 0.1,
                    scale: 0.6,
                    zoom: 1
                  }, tableauDeVariation({
                    tabInit: [
                      [
                        // Première colonne du tableau avec le format [chaine d'entête, hauteur de ligne, nombre de pixels de largeur estimée du texte pour le centrage]
                        ['$x$', 2, 10], ['$\\sqrt{x}$', 4, 30]
                      ],
                      // Première ligne du tableau avec chaque antécédent suivi de son nombre de pixels de largeur estimée du texte pour le centrage
                      [`$${a}$`, 10, `$${b}$`, 10]
                    ],
                    // tabLines ci-dessous contient les autres lignes du tableau.
                    tabLines: [ligne1],
                    colorBackground: '',
                    espcl: 3, // taille en cm entre deux antécédents
                    deltacl: 1, // distance entre la bordure et les premiers et derniers antécédents
                    lgt: 3, // taille de la première colonne en cm
                    hauteurLignes: [15, 15]
                  }))
*/
                  texteCorr += `<br>On constate que le minimum de $\\sqrt{x}$ sur $[${a};${b}]$ est $${Math.sqrt(a)}$ et son maximum est $\\sqrt{${b}$. <br>
            On en déduit que si $${a}${large ? '\\leqslant' : ' < '} x ${large ? '\\leqslant' : ' < '}${b}$ alors  $${Math.sqrt(a)}${large ? '\\leqslant' : ' < '} \\sqrt{x} ${large ? '\\leqslant' : ' < '}\\sqrt{${b}}$.
            <br> Remarque :  la fonction racine carrée étant strictement croissante sur $[0+\\infty[$, elle conserve l'ordre.<br>
            Ainsi les antécédents et les images sont rangées dans le même ordre : <br>
            Si $${a}${large ? '\\leqslant' : ' < '} x ${large ? '\\leqslant' : ' < '}${b}$ alors  $${Math.sqrt(a)}${large ? '\\leqslant' : ' < '} \\sqrt{x} ${large ? '\\leqslant' : ' < '}\\sqrt{${b}}$.
        `
                }
              } else {
                if (b === 1 || b === 4 || b === 9 || b === 16 || b === 25 || b === 36 || b === 49 || b === 64 || b === 81 || b === 100) {
                  const large = choice([true, false])
                  texte = `Compléter par l'information la plus précise possible (on pourra utiliser un tableau de variations) : <br>Si $${a}${large ? ' \\leqslant ' : ' < '} x ${large ? '\\leqslant' : ' < '} ${b}$ alors  ...... $\\sqrt{x}$ ......`
                  texteCorr = `$${a}${large ? '\\leqslant' : ' < '} x ${large ? '\\leqslant' : ' < '}${b}$ signifie $x\\in ${large ? '[' : ' ] '}${a};${b}${large ? ']' : ' [ '}$. <br>
                      Puisque $\\sqrt{${b}}=${Math.sqrt(b)}$  et que  la fonction racine carrée est strictement croissante sur $[0;+\\infty[$, on obtient son tableau de variations
                          sur l'intervalle $[${a};${b}]$ : <br>
                      `

                  /*  texteCorr += mathalea2d({
                    xmin: -0.5,
                    ymin: -6.1,
                    xmax: 30,
                    ymax: 0.1,
                    scale: 0.6,
                    zoom: 1
                  }, tableauDeVariation({
                    tabInit: [
                      [
                        // Première colonne du tableau avec le format [chaine d'entête, hauteur de ligne, nombre de pixels de largeur estimée du texte pour le centrage]
                        ['$x$', 2, 10], ['$\\sqrt{x}$', 4, 30]
                      ],
                      // Première ligne du tableau avec chaque antécédent suivi de son nombre de pixels de largeur estimée du texte pour le centrage
                      [`$${a}$`, 10, `$${b}$`, 10]
                    ],
                    // tabLines ci-dessous contient les autres lignes du tableau.
                    tabLines: [ligne1],
                    colorBackground: '',
                    espcl: 3, // taille en cm entre deux antécédents
                    deltacl: 1, // distance entre la bordure et les premiers et derniers antécédents
                    lgt: 3, // taille de la première colonne en cm
                    hauteurLignes: [15, 15]
                  }))
*/
                  texteCorr += `<br>On constate que le minimum de $\\sqrt{x}$ sur $[${a};${b}]$ est $\\sqrt{${a}}$ et son maximum est $${Math.sqrt(b)}$. <br>
                  On en déduit que si $${a}${large ? '\\leqslant' : ' < '} x ${large ? '\\leqslant' : ' < '}${b}$ alors  $\\sqrt{${a}}${large ? '\\leqslant' : ' < '} \\sqrt{x} ${large ? '\\leqslant' : ' < '}${Math.sqrt(b)}$.
                  <br> Remarque :  la fonction racine carrée étant strictement croissante sur $[0+\\infty[$, elle conserve l'ordre.<br>
                  Ainsi les antécédents et les images sont rangées dans le même ordre : <br>
                  Si $${a}${large ? '\\leqslant' : ' < '} x ${large ? '\\leqslant' : ' < '}${b}$ alors  $\\sqrt{${a}}${large ? '\\leqslant' : ' < '} \\sqrt{x} ${large ? '\\leqslant' : ' < '}${Math.sqrt(b)}$.
              `
                } else {
                  const large = choice([true, false])
                  texte = `Compléter par l'information la plus précise possible (on pourra utiliser un tableau de variations) : <br>Si $${a}${large ? ' \\leqslant ' : ' < '} x ${large ? '\\leqslant' : ' < '} ${b}$ alors  ...... $\\sqrt{x}$ ......`
                  texteCorr = `$${a}${large ? '\\leqslant' : ' < '} x ${large ? '\\leqslant' : ' < '}${b}$ signifie $x\\in ${large ? '[' : ' ] '}${a};${b}${large ? ']' : ' [ '}$. <br>
                    Puisque  la fonction racine carrée est strictement croissante sur $[0;+\\infty[$, on obtient son tableau de variations
                        sur l'intervalle $[${a};${b}]$ : <br>
                    `

                  /* texteCorr += mathalea2d({
                    xmin: -0.5,
                    ymin: -6.1,
                    xmax: 30,
                    ymax: 0.1,
                    scale: 0.6,
                    zoom: 1
                  }, tableauDeVariation({
                    tabInit: [
                      [
                        // Première colonne du tableau avec le format [chaine d'entête, hauteur de ligne, nombre de pixels de largeur estimée du texte pour le centrage]
                        ['$x$', 2, 10], ['$\\sqrt{x}$', 4, 30]
                      ],
                      // Première ligne du tableau avec chaque antécédent suivi de son nombre de pixels de largeur estimée du texte pour le centrage
                      [`$${a}$`, 10, `$${b}$`, 10]
                    ],
                    // tabLines ci-dessous contient les autres lignes du tableau.
                    tabLines: [ligne1],
                    colorBackground: '',
                    espcl: 3, // taille en cm entre deux antécédents
                    deltacl: 1, // distance entre la bordure et les premiers et derniers antécédents
                    lgt: 3, // taille de la première colonne en cm
                    hauteurLignes: [15, 15]
                  }))
*/
                  texteCorr += `<br>On constate que le minimum de $\\sqrt{x}$ sur $[${a};${b}]$ est $\\sqrt{${a}}$ et son maximum est $\\sqrt{${b}}$. <br>
                On en déduit que si $${a}${large ? '\\leqslant' : ' < '} x ${large ? '\\leqslant' : ' < '}${b}$ alors  $\\sqrt{${a}}${large ? '\\leqslant' : ' < '} \\sqrt{x} ${large ? '\\leqslant' : ' < '}\\sqrt{${b}}$.
                <br> Remarque :  la fonction racine carrée étant strictement croissante sur $[0+\\infty[$, elle conserve l'ordre.<br>
                Ainsi les antécédents et les images sont rangées dans le même ordre : <br>
                Si $${a}${large ? '\\leqslant' : ' < '} x ${large ? '\\leqslant' : ' < '}${b}$ alors  $\\sqrt{${a}}${large ? '\\leqslant' : ' < '} \\sqrt{x} ${large ? '\\leqslant' : ' < '}\\sqrt{${b}}$.
            `
                }
              }
            }
              break
          }
          break
        }
        case 'cube': {
          latex = false
          const N = 1 // choice([1, 2])
          fonction = x => x ** 3
          derivee = x => 3 * x ** 2
          latex = false
          if (N === 1) { // cas x<a ou x>a
            const a = choice([
              randint(-10, 10),
              10 * randint(-10, 10)
            ])
            const large = choice([true, false]) // Inégalité stricte ou large ?
            const inférieur = choice([true, false]) // x < a ou x > a ?
            if (inférieur) {
              xMin = -200 // a peut aller jusqu'à -100 !
              xMax = a
              substituts = [{ antVal: -200, antTex: '-∞', imgVal: -8000000, imgTex: '-∞' }]
            } else {
              xMin = a
              xMax = 200
              substituts = [{ antVal: 200, antTex: '+∞', imgVal: 8000000, imgTex: '+∞' }]
            }
            let symbole
            let intervalle
            if (large && inférieur) {
              symbole = '\\leqslant'
              intervalle = `]-\\infty ; ${a}]`
            } else if (large && !inférieur) {
              symbole = '\\geqslant'
              intervalle = `[${a} ; +\\infty[`
            } else if ((!large) && inférieur) {
              symbole = '<'
              intervalle = `]-\\infty ; ${a}[`
            } else { // (! large) && (! inférieur)
              symbole = '>'
              intervalle = `]${a} ; +\\infty[`
            }
            texte = `Compléter par l'information la plus précise possible (on pourra utiliser un tableau de variations) : <br>Si $x${symbole}${a}$ alors $x^3$ ......`
            texteCorr = `$x${symbole} ${a}$ signifie $x\\in ${intervalle}$. <br>
             Puisque $${a}^3=${Math.pow(a, 3)}$ et que la fonction cube est strictement croissante sur $\\mathbb{R}$, on obtient son tableau de variations
                    sur l'intervalle $]-\\infty;${a}]$ : <br>
                `
            tableau = tableauVariationsFonction(fonction, derivee, xMin, xMax, { latex, substituts, step: 1 })

            texteCorr += mathalea2d(Object.assign({ scale: 0.6, zoom: 1 }, fixeBordures([tableau])), tableau)
            texteCorr += `<br>On constate que le ${inférieur ? ' maximum ' : ' minimum '} de $x^3$ sur $${intervalle}$ est $${Math.pow(a, 3)}$. <br>
            On en déduit que si  $x${symbole}${a}$ alors  $x^3${symbole} ${Math.pow(a, 3)}$.
            <br> Remarque :  la fonction cube étant strictement croissante sur $\\mathbb{R}$, elle conserve l'ordre.<br>
            Ainsi les antécédents et les images sont rangées dans le même ordre : <br>
            Si $x${symbole}${a}$ alors  $x^3${symbole} ${Math.pow(a, 3)}$.
        `
          }
          break
        }
      }
      tableau = tableauVariationsFonction(fonction, derivee, xMin, xMax, { latex, substituts, step: 1 })
      texteCorr = texteCorrAvantTableau + mathalea2d(Object.assign({}, fixeBordures([tableau])), tableau) + texteCorrApresTableau
      if (this.questionJamaisPosee(i, this.listeQuestions[i], xMin, xMax)) {
        // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireTexte = ['Choix des questions', '1 : carré\n2 : inverse\n3 : racine carrée\n4 : cube\n5 : mélange']
}
