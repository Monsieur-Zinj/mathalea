import { choice } from '../../../lib/outils/arrayOutils'
import {
  ecritureAlgebriqueSauf1,
  ecritureParentheseSiNegatif,
  reduireAxPlusB,
  reduirePolynomeDegre3
} from '../../../lib/outils/ecritures'
import Exercice from '../../deprecatedExercice.js'
import { randint } from '../../../modules/outils.js'
import { functionCompare } from '../../../lib/interactif/comparisonFunctions'
export const titre = 'Déterminer la fonction dérivée d’une fonction $a/u(x)$'
export const interactifReady = true
export const interactifType = 'mathLive'

// Les exports suivants sont optionnels mais au moins la date de publication semble essentielle
export const dateDePublication = '24/06/2022' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag
// export const dateDeModifImportante = '14/02/2022' // Une date de modification importante au format 'jj/mm/aaaa' pour affichage temporaire d'un tag

/**
     * Modèle d'exercice très simple pour la course aux nombres
     * @author Gilles Mora
     * Référence
    */
export const uuid = 'c4251'
export const ref = 'can1F18'
export const refs = {
  'fr-fr': ['can1F18'],
  'fr-ch': []
}
export default function CalculFonctionDeriveeAsurU () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.formatChampTexte = 'largeur01 inline nospacebefore'
  this.tailleDiaporama = 2
  this.compare = functionCompare

  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne

  this.nouvelleVersion = function () {
    let a; let m; let p
    switch (choice([1, 2, 3])) {
      case 1:// //a/(mx+p)
        a = randint(-3, 5, [0, 1])
        m = randint(-4, 6, 0)
        p = randint(-5, 5, 0)
        this.question = `Soit $f$ la fonction définie  par  $f(x)=\\dfrac{${a}}{${reduireAxPlusB(m, p)}}$. `
        if (this.interactif) { this.question += '<br>$f\'(x)=$' } else { this.question += '<br> Déterminer  $f\'(x)$.' }
        this.correction = `$f(x)=\\dfrac{${a}}{${reduireAxPlusB(m, p)}}=${a}\\times \\dfrac{1}{${reduireAxPlusB(m, p)}}$.<br>
          Or  $\\left(\\dfrac{1}{u}\\right)'=\\dfrac{-u'}{u^2}$.<br>
          On a  $u(x)=${reduireAxPlusB(m, p)}$ et $u'(x)=${m}$. <br>On en déduit $f'(x)=${a}\\times \\dfrac{-${ecritureParentheseSiNegatif(m)}}{(${reduireAxPlusB(m, p)})^2}=\\dfrac{${-a * m}}{(${reduireAxPlusB(m, p)})^2}$.`
        this.reponse = { reponse: { value: `\\dfrac{${-a * m}}{(${-m}x+${-p})^2}`, options: { variable: 'x', domaine: [-100, 100] }, compare: functionCompare } }
        this.canEnonce = `Soit $f$ la fonction définie  par  $f(x)=\\dfrac{${a}}{${reduireAxPlusB(m, p)}}$. `
        this.canReponseACompleter = '$f\'(x)=\\ldots$'
        break
      case 2:// //a/(p+mx)
        a = randint(-3, 5, [0, 1])
        m = randint(-4, 6, 0)
        p = randint(-5, 5, 0)
        this.question = `Soit $f$ la fonction définie  par  $f(x)=\\dfrac{${a}}{${p}${ecritureAlgebriqueSauf1(m)}x}$.`
        if (this.interactif) { this.question += '<br>$f\'(x)=$' } else { this.question += '<br> Déterminer  $f\'(x)$.' }
        this.correction = `$f(x)=\\dfrac{${a}}{${reduireAxPlusB(m, p)}}=${a}\\times \\dfrac{1}{${reduireAxPlusB(m, p)}}$.<br>
          Or  $\\left(\\dfrac{1}{u}\\right)'=\\dfrac{-u'}{u^2}$.<br>
          On a  $u(x)=${reduireAxPlusB(m, p)}$ et $u'(x)=${m}$. <br>On en déduit  $f'(x)=${a}\\times \\dfrac{-${ecritureParentheseSiNegatif(m)}}{(${reduireAxPlusB(m, p)})^2}=\\dfrac{${-a * m}}{(${reduireAxPlusB(m, p)})^2}$.`
        this.reponse = { reponse: { value: `\\dfrac{${-a * m}}{(${-m}x+${-p})^2}`, options: { variable: 'x', domaine: [-100, 100] }, compare: functionCompare } }
        this.canEnonce = `Soit $f$ la fonction définie  par  $f(x)=\\dfrac{${a}}{${p}${ecritureAlgebriqueSauf1(m)}x}$.`
        this.canReponseACompleter = '$f\'(x)=\\ldots$'
        break

      case 3: // a/(mx^2+p)
        a = randint(-3, 5, [0, 1])
        m = randint(-4, 5, 0)
        p = randint(-10, 10, 0)
        this.question = `Soit $f$ la fonction définie  par : $f(x)=\\dfrac{${a}}{${reduirePolynomeDegre3(0, m, 0, p)}}$. `
        if (this.interactif) { this.question += '<br>$f\'(x)=$' } else { this.question += '<br> Déterminer  $f\'(x)$.' }
        this.correction = `$f(x)=\\dfrac{${a}}{${reduirePolynomeDegre3(0, m, 0, p)}}=${a}\\times \\dfrac{1}{${reduirePolynomeDegre3(0, m, 0, p)}}$.<br>
                       Or  $\\left(\\dfrac{1}{u}\\right)'=\\dfrac{-u'}{u^2}$.<br>
                On a  $u(x)=${reduirePolynomeDegre3(0, m, 0, p)}$ et $u'(x)=${2 * m}x$. On en déduit,
                $f'(x)= ${a}\\times\\dfrac{-${ecritureParentheseSiNegatif(2 * m)}x}{(${reduirePolynomeDegre3(0, m, 0, p)})^2}=\\dfrac{${-2 * a * m}x}{(${reduirePolynomeDegre3(0, m, 0, p)})^2}$.`
        this.reponse = { reponse: { value: `\\dfrac{${-2 * a * m}x}{(${reduirePolynomeDegre3(0, m, 0, p)})^2}`, options: { variable: 'x', domaine: [-100, 100] }, compare: functionCompare } }
        this.canEnonce = `Soit $f$ la fonction définie  par : $f(x)=\\dfrac{${a}}{${reduirePolynomeDegre3(0, m, 0, p)}}$. `
        this.canReponseACompleter = '$f\'(x)=\\ldots$'
        break
    }
  }
}
