import { choice } from '../../../lib/outils/arrayOutils'
import { texteEnCouleur, miseEnEvidence } from '../../../lib/outils/embellissements'
import { ecritureAlgebrique, ecritureParentheseSiNegatif, rienSi1 } from '../../../lib/outils/ecritures'
import { texNombre } from '../../../lib/outils/texNombre'
import Exercice from '../../deprecatedExercice.js'
import {
  randint, calculANePlusJamaisUtiliser
} from '../../../modules/outils.js'
export const titre = 'Calculer une image avec le second degré'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence can2F01
 * Date de publication
*/
export const uuid = 'b2c31'
export const ref = 'can2F01'
export const refs = {
  'fr-fr': ['can2F01'],
  'fr-ch': []
}
export default function CalculImageSecondDegre () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.formatChampTexte = ''
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne

  this.nouvelleVersion = function () {
    let x, a, b, c, d, expression
    switch (choice(['a', 'b', 'c', 'd'])) { //,
      case 'a':
        x = randint(1, 4)
        a = randint(1, 2)
        b = randint(1, 2)
        c = randint(2, 5)

        expression = `${rienSi1(a)}x^2+${rienSi1(b)}x+${c}`
        this.question = `On considère la fonction $f$ définie par $f(x)= ${expression}$. <br>

    Calculer $f(${x})$.`

        if (a === 1 & b !== 1) {
          this.correction = `$f(${x})=
          ${x}^2+${b}\\times ${ecritureParentheseSiNegatif(x)}+${c}=
          ${x * x}${ecritureAlgebrique(b * x)}+${c}=
          ${a * x * x}${ecritureAlgebrique(b * x)}+${c}=
          ${miseEnEvidence(a * x * x + b * x + c)}$.<br><br>`
          this.correction += texteEnCouleur(` Mentalement : <br>
          On commence par calculer le carré de $${x}$, soit $${x}^2=${texNombre(x ** 2)}$. <br>
   On calcule $${b}\\times ${x}$ que l'on ajoute à $${texNombre(a * x ** 2)}$, soit $${a * x ** 2}+${b * x}=${a * x ** 2 + b * x}$.<br>
  Pour finir, on ajoute   $${c}$, ce qui donne $${texNombre(a * x ** 2 + b * x)}+${c}$, soit $${texNombre(a * x ** 2 + b * x + c)}$.<br>
    `, 'blue')
        }
        if (a !== 1 & b !== 1) {
          this.correction = `$f(${x})=
          ${a}\\times${x}^2+${b}\\times ${x}+${c}=
          ${a}\\times ${x * x}${ecritureAlgebrique(b * x)}+${c}=
          ${a * x * x}${ecritureAlgebrique(b * x)}+${c}=
          ${miseEnEvidence(a * x * x + b * x + c)}$.<br><br>`
          this.correction += texteEnCouleur(` Mentalement : <br>
              On commence par calculer le carré de $${x}$, soit $${x}^2=${texNombre(x ** 2)}$. <br>
     On multiplie ensuite cette valeur par le coefficient devant $x^2$, soit $${a}\\times ${texNombre(x ** 2)}=${texNombre(a * x ** 2)}$.<br>
      On calcule $${b}\\times ${x}$ que l'on ajoute à $${texNombre(a * x ** 2)}$, soit $${a * x ** 2}+${b * x}=${a * x ** 2 + b * x}$.<br>
      Pour finir, on ajoute   $${c}$, ce qui donne $${texNombre(a * x ** 2 + b * x)}+${c}$, soit $${texNombre(a * x ** 2 + b * x + c)}$.<br>
        `, 'blue')
        }
        if (a === 1 & b === 1) {
          this.correction = `$f(${x})=
          ${x}^2+ ${x}+${c}=
          ${x * x}+${x}+${c}=
          ${miseEnEvidence(x * x + b * x + c)}$.<br><br>`
          this.correction += texteEnCouleur(` Mentalement : <br>
          On commence par calculer le carré de $${x}$, soit $${x}^2=${texNombre(x ** 2)}$. <br>
   On ajoute  $${x}$ soit $${a * x ** 2}+${x}=${x ** 2 + b * x}$.<br>
  Pour finir, on ajoute   $${c}$, ce qui donne $${texNombre(a * x ** 2 + b * x)}+${c}$, soit $${texNombre(a * x ** 2 + b * x + c)}$.<br>
    `, 'blue')
        }
        if (a !== 1 & b === 1) {
          this.correction = `$f(${x})=
          ${a}\\times${x}^2+${b}\\times ${ecritureParentheseSiNegatif(x)}+${c}=
          ${a}\\times ${x * x}${ecritureAlgebrique(b * x)}+${c}=
          ${a * x * x}${ecritureAlgebrique(b * x)}+${c}=
          ${miseEnEvidence(a * x * x + b * x + c)}$.<br><br>`
          this.correction += texteEnCouleur(` Mentalement : <br>
          On commence par calculer le carré de $${x}$, soit $${x}^2=${texNombre(x ** 2)}$. <br>
 On multiplie ensuite cette valeur par le coefficient devant $x^2$, soit $${a}\\times ${texNombre(x ** 2)}=${texNombre(a * x ** 2)}$.<br>
 On ajoute  $${x}$ soit $${a * x ** 2}+${x}=${a * x ** 2 + b * x}$.<br>
  Pour finir, on ajoute   $${c}$, ce qui donne $${texNombre(a * x ** 2 + b * x)}+${c}$, soit $${texNombre(a * x ** 2 + b * x + c)}$.<br>
    `, 'blue')
        }
        this.reponse = calculANePlusJamaisUtiliser(a * x * x + b * x + c)
        break
      case 'b':
        a = randint(1, 3)
        b = randint(-2, 2, [0])
        c = randint(1, 3)
        d = randint(-3, 3, [0, b])
        x = randint(-3, 3, [0])

        expression = `(${rienSi1(a)}x${ecritureAlgebrique(b)})(${rienSi1(c)}x${ecritureAlgebrique(d)})`
        this.question = `On considère la fonction $f$ définie par $f(x)= ${expression}$. <br>

          Calculer $f(${x})$.`
        if (a === 1 & c === 1) {
          this.correction = `$f(${x})=\\left(${ecritureParentheseSiNegatif(x)}${ecritureAlgebrique(b)}\\right)\\left(${ecritureParentheseSiNegatif(x)}${ecritureAlgebrique(d)}\\right)=(${a * x}${ecritureAlgebrique(b)})(${c * x}${ecritureAlgebrique(d)})=
          ${a * x + b}\\times${ecritureParentheseSiNegatif(c * x + d)}=${miseEnEvidence((a * x + b) * (c * x + d))}$.<br><br>`
          this.reponse = calculANePlusJamaisUtiliser((a * x + b) * (c * x + d))
          this.correction += texteEnCouleur(` Mentalement : <br>
          On commence par "calculer" la première parenthèse :  $${ecritureParentheseSiNegatif(x)}${ecritureAlgebrique(b)}=${a * x + b}$.<br>
           Puis la deuxième : $${ecritureParentheseSiNegatif(x)}${ecritureAlgebrique(d)}=${c * x + d}$.<br>
        On fait le produit des nombres obtenus : $${a * x + b}\\times ${c * x + d}=${(a * x + b) * (c * x + d)}$.
    `, 'blue')
        }
        if (a !== 1 & c !== 1) {
          this.correction = `$f(${x})=\\left(${rienSi1(a)}\\times${ecritureParentheseSiNegatif(x)}${ecritureAlgebrique(b)}\\right)\\left(${c}\\times${ecritureParentheseSiNegatif(x)}${ecritureAlgebrique(d)}\\right)=(${a * x}${ecritureAlgebrique(b)})(${c * x}${ecritureAlgebrique(d)})=
        ${a * x + b}\\times${ecritureParentheseSiNegatif(c * x + d)}=${miseEnEvidence((a * x + b) * (c * x + d))}$.<br><br>`
          this.reponse = calculANePlusJamaisUtiliser((a * x + b) * (c * x + d))
          this.correction += texteEnCouleur(` Mentalement : <br>
        On commence par "calculer" la première parenthèse :  $${rienSi1(a)}\\times${ecritureParentheseSiNegatif(x)}${ecritureAlgebrique(b)}=${a * x + b}$.
        <br>Puis la deuxième : $${c}\\times${ecritureParentheseSiNegatif(x)}${ecritureAlgebrique(d)}=${c * x + d}$.<br>
        On fait le produit des nombres obtenus : $${a * x + b}\\times ${ecritureParentheseSiNegatif(c * x + d)}=${(a * x + b) * (c * x + d)}$.
    `, 'blue')
        }
        if (a === 1 & c !== 1) {
          this.correction = `$f(${x})=\\left(${ecritureParentheseSiNegatif(x)}${ecritureAlgebrique(b)}\\right)\\left(${c}\\times${ecritureParentheseSiNegatif(x)}${ecritureAlgebrique(d)}\\right)=(${a * x}${ecritureAlgebrique(b)})(${c * x}${ecritureAlgebrique(d)})=
        ${a * x + b}\\times${ecritureParentheseSiNegatif(c * x + d)}=${miseEnEvidence((a * x + b) * (c * x + d))}$.<br><br>`
          this.reponse = calculANePlusJamaisUtiliser((a * x + b) * (c * x + d))
          this.correction += texteEnCouleur(` Mentalement : <br>
        On commence par "calculer" la première parenthèse :  $${ecritureParentheseSiNegatif(x)}${ecritureAlgebrique(b)}=${a * x + b}$.
        <br>Puis la deuxième : $${c}\\times${ecritureParentheseSiNegatif(x)}${ecritureAlgebrique(d)}=${c * x + d}$.<br>
        On fait le produit des nombres obtenus : $${a * x + b}\\times ${c * x + d}=${(a * x + b) * (c * x + d)}$.
    `, 'blue')
        }
        if (a !== 1 & c === 1) {
          this.correction = `$f(${x})=\\left(${a}\\times${ecritureParentheseSiNegatif(x)}${ecritureAlgebrique(b)}\\right)\\left(${ecritureParentheseSiNegatif(x)}${ecritureAlgebrique(d)}\\right)=(${a * x}${ecritureAlgebrique(b)})(${c * x}${ecritureAlgebrique(d)})=
        ${a * x + b}\\times${ecritureParentheseSiNegatif(c * x + d)}=${miseEnEvidence((a * x + b) * (c * x + d))}$.<br><br>`
          this.reponse = calculANePlusJamaisUtiliser((a * x + b) * (c * x + d))
          this.correction += texteEnCouleur(` Mentalement : <br>
        On commence par "calculer" la première parenthèse :  $${a}\\times${ecritureParentheseSiNegatif(x)}${ecritureAlgebrique(b)}=${a * x + b}$.
        <br>Puis la deuxième : $${ecritureParentheseSiNegatif(x)}${ecritureAlgebrique(d)}=${c * x + d}$.<br>
        On fait le produit des nombres obtenus : $${a * x + b}\\times ${ecritureParentheseSiNegatif(c * x + d)}=${(a * x + b) * (c * x + d)}$.
    `, 'blue')
        }
        break
      case 'c':
        a = randint(-3, 3, 0)
        b = randint(1, 3)
        x = randint(-3, 3, [0])

        expression = `${a}-${rienSi1(b)}x^2`
        this.question = `On considère la fonction $f$ définie par $f(x)= ${expression}$. <br>

          Calculer $f(${x})$.`

        this.correction = `$f(${x})=${a}- ${ecritureParentheseSiNegatif(x)}^2=${miseEnEvidence(a - b * x * x)}$.<br><br>`
        this.reponse = calculANePlusJamaisUtiliser(a - b * x * x)
        if (b === 1) {
          this.correction += texteEnCouleur(` Mentalement : <br>
          On commence par "calculer" le carré de $${x}$ :  $${ecritureParentheseSiNegatif(x)}^2=${x * x}$.<br>
          On calcule alors $${a}-${x * x}=${a - x * x}$.<br>
    `, 'blue')
        } else {
          this.correction = `$f(${x})=${a}- ${b}\\times ${ecritureParentheseSiNegatif(x)}^2=${miseEnEvidence(a - b * x * x)}$.<br><br>`
          this.correction += texteEnCouleur(` Mentalement : <br>
    On commence par "calculer" le carré de $${x}$ :  $${ecritureParentheseSiNegatif(x)}^2=${x * x}$.<br>
    Puis on multiplie le résultat par $${b}$ : $${b}\\times ${x ** 2}=${b * x * x}$.<br>
    On calcule alors : $${a}-${b * x * x}=${a - b * x * x}$.`, 'blue')
        }
        break
      case 'd':
        a = randint(-4, 4, [0, -1, 1])
        b = randint(-4, 4, [0])
        c = randint(-4, 4, [0, -1, 1])
        d = randint(-4, 4, [0])
        x = randint(-2, 2, [0])

        expression = `(${a}x${ecritureAlgebrique(b)})^2`
        this.question = `On considère la fonction $f$ définie par $f(x)= ${expression}$. <br>

        Calculer $f(${x})$.`

        this.correction = `$f(${x})=
        \\left(${a}\\times${ecritureParentheseSiNegatif(x)}${ecritureAlgebrique(b)}\\right)^2=
        (${a * x}${ecritureAlgebrique(b)})^2=${ecritureParentheseSiNegatif(a * x + b)}^2
        =${miseEnEvidence((a * x + b) * (a * x + b))}$.<br><br>`
        this.reponse = calculANePlusJamaisUtiliser(a * x + b) * (a * x + b)

        this.correction += texteEnCouleur(` Mentalement : <br>
          On commence par "calculer" l'intérieur de la parenthèse, puis on élève le résultat au carré.
    `, 'blue')

        break
    }
    this.canEnonce = this.question// 'Compléter'
    this.canReponseACompleter = ''
  }
}
