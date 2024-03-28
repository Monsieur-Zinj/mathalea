import { combinaisonListes, shuffle2tableaux } from '../../lib/outils/arrayOutils'
import Exercice from '../Exercice'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ecritureAlgebrique, ecritureAlgebriqueSauf1, ecritureParentheseSiNegatif, rienSi1 } from '../../lib/outils/ecritures'
import { lcm } from 'mathjs'
import { texNombre } from '../../lib/outils/texNombre'
import { remplisLesBlancs } from '../../lib/interactif/questionMathLive'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
export const titre = 'Résoudre un système linéaire de deux équations à deux inconnues'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '21/03/2024'
export const uuid = '5179b'
// export const dateDeModifImportante = '24/10/2021'

/**
 * Description didactique de l'exercice
 * @author Nathan Scheinmann
*/

export default class systemeEquationsPremDeg extends Exercice {
  constructor () {
    super()
    this.consigne = ''
    this.nbQuestions = 3
    this.sup = 4
    this.correctionDetailleeDisponible = true
    this.besoinFormulaireNumerique = ['Type de questions', 4, '1 : Niveau 1\n2 : Niveau 2\n3 : Niveau 3\n4 : Mélange']
  }

  nouvelleVersion () {
    if (this.nbQuestions === 1) {
      this.consigne = 'Résoudre le système d\'équations suivant :'
    } else {
      this.consigne = 'Résoudre les systèmes d\'équations suivants :'
    }
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []

    let typeQuestionsDisponibles: ('lv1' | 'lv2' | 'lv3')[]
    if (this.sup === 1) {
      typeQuestionsDisponibles = ['lv1']
    } else if (this.sup === 2) {
      typeQuestionsDisponibles = ['lv2']
    } else if (this.sup === 3) {
      typeQuestionsDisponibles = ['lv3']
    } else {
      typeQuestionsDisponibles = ['lv1', 'lv2', 'lv3']
    }

    const listeTypeQuestions = combinaisonListes(typeQuestionsDisponibles, this.nbQuestions)
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      this.comment = 'Dans cet exercice, un système est donné à résoudre. Les solutions sont entières comprises entre -10 et 10.<br>Le niveau 1 correspond à des inconnues seulement dans les membres de gauche;<br>Le niveau 2 à des inconnues dans les deux membres, mais ordonnées;<br>Le niveau 3 à des inconnues dans le désordre dans les deux membres.'
      let texte = ''
      let texteCorr = ''
      const solX = randint(-10, 10)
      const solY = randint(-10, 10, [solX])
      const eq1 = [1, 0, 0, 0, 0, solX]
      const eq2 = [0, 1, 0, 0, 0, solY]
      const vectX = [1, 0, 0, 1, 0, 0]
      const vectY = [0, 1, 0, 0, 1, 0]
      const vectConstant = [0, 0, 1, 0, 0, 1]
      const multCoeff = function (vect : Array<number>, coeff: number) {
        return vect.map(function (x: number) { return x * coeff })
      }
      const addCombLin = function (vect1: Array<number>, vect2: Array<number>, coeff: number) {
        return vect1.map(function (x: number, i: number) { return x + vect2[i] * coeff })
      }
      // error http://localhost:5173/alea/?uuid=5179b&n=3&d=10&s=4&alea=u0c8&cd=1
      // http://localhost:5173/alea/?uuid=5179b&n=1&d=10&s=4&alea=PAwM&cd=1
      const eqEquiv = function (vect1 : Array<number>, niveau : string) {
        let vectEquiv = vect1
        vectEquiv = multCoeff(vectEquiv, randint(-6, 6, [0]))
        if (niveau === 'lv2' || niveau === 'lv3') {
          vectEquiv = addCombLin(vectEquiv, vectX, randint(-10, 10, [0]))
          vectEquiv = addCombLin(vectEquiv, vectY, randint(-10, 10, [0]))
          vectEquiv = addCombLin(vectEquiv, vectConstant, randint(-20, 20, [0]))
        }
        return vectEquiv
      }
      const eqToLatex = function (vect : Array<number>, nomVal : Array<string>, inSys : boolean) {
        let expr = ''
        let checkPreviousNull = true
        for (let i = 0; i < 3; i++) {
          if ((vect.slice(0, 3).every(item => item === 0)) && i === 0) {
            expr = expr + '0'
          } else if (!(vect[i] === 0) && checkPreviousNull) {
            if (nomVal[i] === '') {
              expr = expr + `${texNombre(vect[i], 0)}${nomVal[i]}`
            } else {
              expr = expr + `${rienSi1(vect[i])}${nomVal[i]}`
            }
            checkPreviousNull = false
          } else if (!(vect[i] === 0) && !checkPreviousNull) {
            if (nomVal[i] === '') {
              expr = expr + `${ecritureAlgebrique(vect[i])}${nomVal[i]}`
            } else {
              expr = expr + `${ecritureAlgebriqueSauf1(vect[i])}${nomVal[i]}`
            }
            checkPreviousNull = false
          }
        }
        if (inSys === true) {
          expr = expr + ' &='
        } else {
          expr = expr + '='
        }
        checkPreviousNull = true
        for (let i = 3; i < 6; i++) {
          if ((vect.slice(3).every(item => item === 0)) && i === 3) {
            expr = expr + '0'
          } else if (!(vect[i] === 0) && checkPreviousNull) {
            if (nomVal[i] === '') {
              expr = expr + `${texNombre(vect[i], 0)}${nomVal[i]}`
            } else {
              expr = expr + `${rienSi1(vect[i])}${nomVal[i]}`
            }
            checkPreviousNull = false
          } else if (!(vect[i] === 0) && !checkPreviousNull) {
            if (nomVal[i] === '') {
              expr = expr + `${ecritureAlgebrique(vect[i])}${nomVal[i]}`
            } else {
              expr = expr + `${ecritureAlgebriqueSauf1(vect[i])}${nomVal[i]}`
            }
            checkPreviousNull = false
          }
        }
        return expr
      }
      const printSystem = function (eq1 : string, eq2 : string) {
        let expr = ''
        expr = expr + `\\begin{cases}\\begin{aligned}${eq1}\\\\${eq2}\\end{aligned}\\end{cases}`
        return expr
      }
      const timesIfNotUn = function (valeur : number) {
        if (valeur === 1 || valeur === -1) {
          return ''
        } else {
          return '\\times'
        }
      }
      let eqInt1 : Array<number> = []
      let eqInt2 : Array<number> = []
      let eqSimpl1 : Array<number> = []
      let eqSimpl2 : Array<number> = []
      switch (listeTypeQuestions[i]) {
        case 'lv1':
          eqInt1 = addCombLin(eqEquiv(eq1, 'lv1'), eqEquiv(eq2, 'lv1'), 1)
          eqInt2 = addCombLin(eqEquiv(eq1, 'lv1'), eqEquiv(eq2, 'lv1'), 1)
          break
        case 'lv2':
          eqInt1 = addCombLin(eqEquiv(eq1, 'lv2'), eqEquiv(eq2, 'lv2'), 1)
          eqInt2 = addCombLin(eqEquiv(eq1, 'lv2'), eqEquiv(eq2, 'lv2'), 1)
          break
        case 'lv3':
          eqInt1 = addCombLin(eqEquiv(eq1, 'lv3'), eqEquiv(eq2, 'lv3'), 1)
          eqInt2 = addCombLin(eqEquiv(eq1, 'lv3'), eqEquiv(eq2, 'lv3'), 1)
          break
      }
      eqSimpl1 = addCombLin(eqInt1, vectX, -eqInt1[3])
      eqSimpl1 = addCombLin(eqSimpl1, vectY, -eqInt1[4])
      eqSimpl1 = addCombLin(eqSimpl1, vectConstant, -eqInt1[2])
      eqSimpl2 = addCombLin(eqInt2, vectX, -eqInt2[3])
      eqSimpl2 = addCombLin(eqSimpl2, vectY, -eqInt2[4])
      eqSimpl2 = addCombLin(eqSimpl2, vectConstant, -eqInt2[2])
      while (eqSimpl1[0] * eqSimpl2[1] - eqSimpl1[1] * eqSimpl2[0] === 0) {
        switch (listeTypeQuestions[i]) {
          case 'lv1':
            eqInt1 = addCombLin(eqEquiv(eq1, 'lv1'), eqEquiv(eq2, 'lv1'), 1)
            eqInt2 = addCombLin(eqEquiv(eq1, 'lv1'), eqEquiv(eq2, 'lv1'), 1)
            break
          case 'lv2':
            eqInt1 = addCombLin(eqEquiv(eq1, 'lv2'), eqEquiv(eq2, 'lv2'), 1)
            eqInt2 = addCombLin(eqEquiv(eq1, 'lv2'), eqEquiv(eq2, 'lv2'), 1)
            break
          case 'lv3':
            eqInt1 = addCombLin(eqEquiv(eq1, 'lv3'), eqEquiv(eq2, 'lv3'), 1)
            eqInt2 = addCombLin(eqEquiv(eq1, 'lv3'), eqEquiv(eq2, 'lv3'), 1)
            break
        }
        eqSimpl1 = addCombLin(eqInt1, vectX, -eqInt1[3])
        eqSimpl1 = addCombLin(eqSimpl1, vectY, -eqInt1[4])
        eqSimpl1 = addCombLin(eqSimpl1, vectConstant, -eqInt1[2])
        eqSimpl2 = addCombLin(eqInt2, vectX, -eqInt2[3])
        eqSimpl2 = addCombLin(eqSimpl2, vectY, -eqInt2[4])
        eqSimpl2 = addCombLin(eqSimpl2, vectConstant, -eqInt2[2])
      }
      const eqInt1Droite = eqInt1.slice(0, 3)
      const eqInt1Gauche = eqInt1.slice(3)
      const eqInt2Droite = eqInt2.slice(0, 3)
      const eqInt2Gauche = eqInt2.slice(3)
      const listeVar = ['x', 'y', '', 'x', 'y', '']
      const nomVal11 = ['x', 'y', '']
      const nomVal12 = ['x', 'y', '']
      const nomVal21 = ['x', 'y', '']
      const nomVal22 = ['x', 'y', '']
      switch (listeTypeQuestions[i]) {
        case 'lv1':
        case 'lv2':
          break
        case 'lv3':
          shuffle2tableaux(eqInt1Gauche, nomVal11)
          shuffle2tableaux(eqInt1Droite, nomVal12)
          shuffle2tableaux(eqInt2Gauche, nomVal21)
          shuffle2tableaux(eqInt2Droite, nomVal22)
          break
      }
      const eqFinale1 = eqInt1Droite.concat(eqInt1Gauche)
      const eqFinale2 = eqInt2Droite.concat(eqInt2Gauche)
      const nomVal1 = nomVal12.concat(nomVal11)
      const nomVal2 = nomVal22.concat(nomVal21)
      const mX = lcm(Math.abs(eqSimpl1[0]), Math.abs(eqSimpl2[0]))
      const mY = lcm(Math.abs(eqSimpl1[1]), Math.abs(eqSimpl2[1]))
      let varElim = ''
      let coeffElim = 0
      let coeffEq : Array<number> = []
      const eqSimpl1Abs = [Math.abs(eqSimpl1[0]), Math.abs(eqSimpl1[1])]
      const eqSimpl2Abs = [Math.abs(eqSimpl2[0]), Math.abs(eqSimpl2[1])]
      if ((mX === eqSimpl1Abs[0] || mX === eqSimpl2Abs[0]) && (mY === eqSimpl1Abs[1] || mY === eqSimpl2Abs[1])) {
        if ((mY === eqSimpl1Abs[1] && mY === eqSimpl2Abs[1])) {
          varElim = 'y'
          coeffElim = mY
          coeffEq = [eqSimpl1[1], eqSimpl2[1]]
        } else if ((mX === eqSimpl1Abs[0] && mX === eqSimpl2Abs[0])) {
          varElim = 'x'
          coeffElim = mX
          coeffEq = [eqSimpl1[0], eqSimpl2[0]]
        } else if (Math.abs(mX) <= Math.abs(mY)) {
          varElim = 'x'
          coeffElim = mX
          coeffEq = [eqSimpl1[0], eqSimpl2[0]]
        } else {
          varElim = 'y'
          coeffElim = mY
          coeffEq = [eqSimpl1[1], eqSimpl2[1]]
        }
      } else if (mX === eqSimpl1Abs[0] || mX === eqSimpl2Abs[0]) {
        varElim = 'x'
        coeffElim = mX
        coeffEq = [eqSimpl1[0], eqSimpl2[0]]
      } else if (mY === eqSimpl1Abs[1] || mX === eqSimpl2Abs[1]) {
        varElim = 'y'
        coeffElim = mY
        coeffEq = [eqSimpl1[1], eqSimpl2[1]]
      } else {
        if (Math.abs(mX) <= Math.abs(mY)) {
          varElim = 'x'
          coeffElim = mX
          coeffEq = [eqSimpl1[0], eqSimpl2[0]]
        } else {
          varElim = 'y'
          coeffElim = mY
          coeffEq = [eqSimpl1[1], eqSimpl2[1]]
        }
      }
      const varPasElim = varElim === 'x' ? 'y' : 'x'
      const indexVarPasElim = varPasElim === 'x' ? 0 : 1
      const indexVarElim = varElim === 'x' ? 0 : 1
      let eqVarElim : Array<number> = []
      texte = texte + ` $${printSystem(eqToLatex(eqFinale1, nomVal1, true), eqToLatex(eqFinale2, nomVal2, true))}$`
      if (this.correctionDetaillee) {
        texteCorr = texteCorr + 'On résout ce système en utilisant la méthode de combinaison linéaire. '
        switch (listeTypeQuestions[i]) {
          case 'lv2':
          case 'lv3':
            texteCorr = texteCorr + 'On commence par réunir les inconnues dans les membres de gauche et les termes constants dans les membres de droite.<br>'
            texteCorr = texteCorr + `On obtient alors le système équivalent suivant : \\[${printSystem(eqToLatex(eqSimpl1, listeVar, true), eqToLatex(eqSimpl2, listeVar, true))}\\]`
            break
          case 'lv1':
            break
        }
        if (!(coeffElim / coeffEq[0] === 1 || -coeffElim / coeffEq[1] === 1)) {
          texteCorr = texteCorr + `On multiplie la première équation par $${texNombre(coeffElim / coeffEq[0], 0)}$ et la deuxième par $${texNombre(-coeffElim / coeffEq[1], 0)}$ pour obtenir des coefficients opposé devant $${varElim}$.<br>`
          texteCorr = texteCorr + `On obtient alors le système équivalent suivant : \\[${printSystem(eqToLatex(multCoeff(eqSimpl1, coeffElim / coeffEq[0]), listeVar, true), eqToLatex(multCoeff(eqSimpl2, -coeffElim / (coeffEq[1])), listeVar, true))}\\]`
        } else if (coeffElim / coeffEq[0] === 1 && !(-coeffElim / coeffEq[1] === 1)) {
          texteCorr = texteCorr + `On multiplie la deuxième équation par $${texNombre(-coeffElim / coeffEq[1], 0)}$ pour obtenir des coefficients opposé devant $${varElim}$.<br>`
          texteCorr = texteCorr + `On obtient alors le système équivalent suivant : \\[${printSystem(eqToLatex(multCoeff(eqSimpl1, coeffElim / coeffEq[0]), listeVar, true), eqToLatex(multCoeff(eqSimpl2, -coeffElim / (coeffEq[1])), listeVar, true))}\\]`
        } else if (!(coeffElim / coeffEq[0] === 1) && -coeffElim / coeffEq[1] === 1) {
          texteCorr = texteCorr + `On multiplie la première équation par $${texNombre(coeffElim / coeffEq[0], 0)}$ pour obtenir des coefficients opposé devant $${varElim}$.<br>`
          texteCorr = texteCorr + `On obtient alors le système équivalent suivant : \\[${printSystem(eqToLatex(multCoeff(eqSimpl1, coeffElim / coeffEq[0]), listeVar, true), eqToLatex(multCoeff(eqSimpl2, -coeffElim / (coeffEq[1])), listeVar, true))}\\]`
        } else {
          texteCorr = texteCorr + `Les coefficients devant $${varElim}$ sont déjà opposés. `
        }
        texteCorr = texteCorr + `On additionne les deux equations pour élimer l'inconnue $${varElim}$ dans la deuxième équation. `
        texteCorr = texteCorr + `On obtient alors le système équivalent suivant : \\[${printSystem(eqToLatex(multCoeff(eqSimpl1, coeffElim / coeffEq[0]), listeVar, true), eqToLatex(addCombLin(multCoeff(eqSimpl1, coeffElim / coeffEq[0]), multCoeff(eqSimpl2, -coeffElim / (coeffEq[1])), 1), listeVar, true))}\\]`
        texteCorr = texteCorr + `On obtient ainsi que $${varPasElim} = ${texNombre(addCombLin(multCoeff(eqSimpl1, coeffElim / coeffEq[0]), multCoeff(eqSimpl2, -coeffElim / (coeffEq[1])), 1)[5] / addCombLin(multCoeff(eqSimpl1, coeffElim / coeffEq[0]), multCoeff(eqSimpl2, -coeffElim / (coeffEq[1])), 1)[indexVarPasElim], 0)}$.<br>`
        texteCorr = texteCorr + `On subsitue la valeur obtenue pour $${varPasElim}$ dans l'équation restante pour déterminer la valeur de $${varElim}\\,:$`
        eqVarElim = multCoeff(eqSimpl1, coeffElim / coeffEq[0])
        if (varPasElim === 'x') {
          listeVar[0] = `${timesIfNotUn(eqVarElim[0])} ${ecritureParentheseSiNegatif(solX)}`
          eqVarElim = addCombLin(eqVarElim, [-eqVarElim[0], 0, eqVarElim[0] * solX, 0, 0, 0], 1)
        } else {
          listeVar[1] = `${timesIfNotUn(eqVarElim[1])} ${ecritureParentheseSiNegatif(solY)}`
          eqVarElim = addCombLin(eqVarElim, [0, -eqVarElim[1], eqVarElim[1] * solY, 0, 0, 0], 1)
        }
        texteCorr = texteCorr + `\\[${eqToLatex(multCoeff(eqSimpl1, coeffElim / coeffEq[0]), listeVar, false)}\\implies ${eqToLatex(eqVarElim, listeVar, false)}\\]`
        texteCorr = texteCorr + `On résout l'équation et on obtient $${varElim}=${texNombre([solX, solY][indexVarElim], 0)}$. `
      }

      texteCorr = texteCorr + `La solution du système est $S=\\{(${texNombre(solX, 0)};${texNombre(solY, 1)})\\}$.`
      if (this.interactif) {
        texte += '<br>' + remplisLesBlancs(this, i, 'S=\\{(%{champ1};%{champ2})\\}')
        handleAnswers(this, i, {
          bareme: (listePoints: number[]) => [Math.min(listePoints[0], listePoints[1]), 1],
          champ1: { value: String(solX) },
          champ2: { value: String(solY) }
        },
        { formatInteractif: 'fillInTheBlank' }
        )
      }
      if (this.questionJamaisPosee(i, solX, solY)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
