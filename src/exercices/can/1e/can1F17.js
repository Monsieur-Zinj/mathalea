import { choice } from '../../../lib/outils/arrayOutils'
import {
  ecritureAlgebriqueSauf1,
  ecritureParentheseSiNegatif,
  reduireAxPlusB,
  reduirePolynomeDegre3
} from '../../../lib/outils/ecritures'
import Exercice from '../../deprecatedExercice.js'
import { randint } from '../../../modules/outils.js'
export const titre = 'Déterminer la fonction dérivée d’une fonction $1/u(x)$'
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
export const uuid = '12089'
export const ref = 'can1F17'
export const refs = {
  'fr-fr': ['can1F17'],
  'fr-ch': []
}
export default function CalculFonctionDeriveeUnsurU () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.formatChampTexte = ''
  this.tailleDiaporama = 2

  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne

  this.nouvelleVersion = function () {
    let m; let p
    switch (choice([1, 2, 3])) {
      case 1:// //1/(mx+p)
        m = randint(-10, 10, 0)
        p = randint(-10, 10, 0)
        this.question = `Soit $f$ la fonction définie  par :<br>

            $f(x)=\\dfrac{1}{${reduireAxPlusB(m, p)}}$. <br>

            Déterminer $f'(x)$.<br>     `
        if (this.interactif) { this.question += '$f\'(x)=$' }
        this.correction = `$f$est de la forme $\\dfrac{1}{u}$ avec $u(x)=${reduireAxPlusB(m, p)}$.<br>
                 Or  $\\left(\\dfrac{1}{u}\\right)'=\\dfrac{-u'}{u^2}$.<br>
          On a $u(x)=${reduireAxPlusB(m, p)}$ et $u'(x)=${m}$. On en déduit,
          $f'(x)= \\dfrac{-${ecritureParentheseSiNegatif(m)}}{(${reduireAxPlusB(m, p)})^2}$`
        if (m < 0) { this.correction += `$=\\dfrac{${-m}}{(${reduireAxPlusB(m, p)})^2}$.` } else { this.correction += '.' }

        this.reponse = [`\\dfrac{${-m}}{(${-m}x+${-p})^2}`, `\\dfrac{${-m}}{(${m}x+${p})^2}`, `-\\dfrac{${m}}{(${m}x+${p})^2}`, `${-m}\\times\\dfrac{1}{(${m}x+${p})^2}`, `${m}\\times\\dfrac{-1}{(${m}x+${p})^2}`]

        break

      case 2:// //1/(p+mx)
        m = randint(-10, 10, 0)
        p = randint(-10, 10, 0)
        this.question = `Soit $f$ la fonction définie  par : <br>

                   $f(x)=\\dfrac{1}{${p}${ecritureAlgebriqueSauf1(m)}x}$.<br>

                    Déterminer  $f'(x)$.<br>     `
        if (this.interactif) { this.question += '$f\'(x)=$' }
        this.correction = `$f$est de la forme $\\dfrac{1}{u}$ avec $u(x)=${reduireAxPlusB(m, p)}$.<br>
                         Or  $\\left(\\dfrac{1}{u}\\right)'=\\dfrac{-u'}{u^2}$.<br>
                  On a  $u(x)=${reduireAxPlusB(m, p)}$ et $u'(x)=${m}$. On en déduit,
                  $f'(x)= \\dfrac{-${ecritureParentheseSiNegatif(m)}}{(${reduireAxPlusB(m, p)})^2}$`
        if (m < 0) { this.correction += `$=\\dfrac{${-m}}{(${reduireAxPlusB(m, p)})^2}$.` } else { this.correction += '.' }

        this.reponse = [`\\dfrac{${-m}}{(${-m}x+${-p})^2}`, `\\dfrac{${-m}}{(${m}x+${p})^2}`, `-\\dfrac{${m}}{(${m}x+${p})^2}`, `${-m}\\times\\dfrac{1}{(${m}x+${p})^2}`, `${m}\\times\\dfrac{-1}{(${m}x+${p})^2}`]
        break
      case 3:// //1/(mx^2+p)
        m = randint(-10, 10, 0)
        p = randint(-10, 10, 0)
        this.question = `Soit $f$ la fonction définie  par : <br>

                   $f(x)=\\dfrac{1}{${reduirePolynomeDegre3(0, m, 0, p)}}$.<br>

                    Déterminer $f'(x)$.<br>     `
        if (this.interactif) { this.question += '$f\'(x)=$' }
        this.correction = `$f$est de la forme $\\dfrac{1}{u}$ avec $u(x)=${reduirePolynomeDegre3(0, m, 0, p)}$.<br>
                         Or  $\\left(\\dfrac{1}{u}\\right)'=\\dfrac{-u'}{u^2}$.<br>
                  On a  $u(x)=${reduirePolynomeDegre3(0, m, 0, p)}$ et $u'(x)=${2 * m}x$. On en déduit,
                  $f'(x)= \\dfrac{-${ecritureParentheseSiNegatif(2 * m)}x}{(${reduirePolynomeDegre3(0, m, 0, p)})^2}$`
        if (m < 0) { this.correction += `$=\\dfrac{${-2 * m}x}{(${reduirePolynomeDegre3(0, m, 0, p)})^2}$.` } else { this.correction += '.' }

        this.reponse = [`\\dfrac{${-2 * m}x}{(${reduirePolynomeDegre3(0, m, 0, p)})^2}`, `\\dfrac{${-2 * m}x}{(${reduirePolynomeDegre3(0, -m, 0, -p)})^2}`]
        break
    }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
