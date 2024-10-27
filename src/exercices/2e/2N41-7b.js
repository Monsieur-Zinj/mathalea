import { choice } from '../../lib/outils/arrayOutils'
import { ecritureAlgebrique, reduireAxPlusB } from '../../lib/outils/ecritures'
import Exercice from '../deprecatedExercice.js'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { factorisationCompare } from '../../lib/interactif/comparisonFunctions'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'

export const titre = 'Factoriser avec les identités remarquables (niveau II)'
export const interactifReady = true
export const interactifType = 'mathLive'
/**
 * Factoriser avec a²-b² avec a ou b expression algébrique 1er degré
* @author Stéphane Guyon
* 2N41-7b
*/
export const uuid = '874e8'
export const ref = '2N41-7b'
export const refs = {
  'fr-fr': ['2N41-7b'],
  'fr-ch': ['11FA3-6']
}
export default function FactoriserIdentitesremarquables2 () {
  Exercice.call(this)
  this.titre = titre
  this.consigne = 'Factoriser les expressions suivantes.'
  this.nbCols = 1
  this.nbColsCorr = 1
  this.spacing = 1
  this.spacingCorr = 1
  this.nbQuestions = 3
  this.sup = '1'

  this.nouvelleVersion = function () {
    const listeTypeDeQuestions = gestionnaireFormulaireTexte({
      saisie: this.sup,
      nbQuestions: this.nbQuestions,
      min: 1,
      max: 4,
      melange: 5,
      defaut: 1
    })
    for (let i = 0, texte, texteCorr, cpt = 0, a, b, c, d, k, typesDeQuestions; i < this.nbQuestions && cpt < 50;) {
      do {
        a = randint(2, 9) * choice([-1, 1])
        b = randint(1, 9) * choice([-1, 1])
        c = randint(2, 9)
        d = randint(1, 9) * choice([-1, 1])
      } while ((a === c && b === d) || (a === -c && b === -d) || [a, b].filter(el => el < 0).length === 2 || [c, d].filter(el => el < 0).length === 2)
      switch (listeTypeDeQuestions[i]) {
        case 1:
          texte = `$(${a}x${ecritureAlgebrique(b)})^2-${c * c}$` // (ax+b)²-c²

          texteCorr = // `$(${a}x${ecritureAlgebrique(b)})^2-${c * c}=(${a}x${ecritureAlgebrique(b)})^2-${c}^2$<br>
                    `On reconnaît l'identité remarquable $a^2-b^2=(\\color{red}a\\color{black}-\\color{blue}b)(\\color{red}a\\color{black}+\\color{blue}b)$, avec $a=\\color{red}${a}x${ecritureAlgebrique(b)}$ et $b=\\color{blue}${c}$.<br><br>
                    $(${a}x${ecritureAlgebrique(b)})^2-${c * c}= (\\color{red} ${a}x${ecritureAlgebrique(b)}\\color{black})^2-\\color{blue}${c}\\color{black}^2 $ <br>
                    $\\phantom{(${a}x${ecritureAlgebrique(b)})^2-${c * c}}=\\left[\\color{red} (${a}x${ecritureAlgebrique(b)})\\color{black}-\\color{blue} ${c}\\right] \\left[ \\color{red}(${a}x${ecritureAlgebrique(b)})\\color{black}+\\color{blue}${c}\\right] $<br>
                    $\\phantom{(${a}x${ecritureAlgebrique(b)})^2-${c * c}}= (${reduireAxPlusB(a, b - c)}) (${reduireAxPlusB(a, b + c)})$`
          handleAnswers(this, i, { reponse: { value: `(${reduireAxPlusB(a, b - c)})(${reduireAxPlusB(a, b + c)})`, compare: factorisationCompare } })
          break
        case 2:
          texte = `$${c * c}-(${a}x${ecritureAlgebrique(b)})^2$` // c²-(ax+b)²
          texteCorr = // `$${c * c}-(${a}x${ecritureAlgebrique(b)})^2=${c}^2-(${a}x${ecritureAlgebrique(b)})^2$<br>
                    `On reconnaît l'identité remarquable $a^2-b^2=(\\color{red}a\\color{black}-\\color{blue}b)(\\color{red}a\\color{black}+\\color{blue}b)$, avec $a=\\color{red}${c}$ et $b=\\color{blue}${a}x${ecritureAlgebrique(b)}$. <br><br>
                    $${c * c}-(${a}x${ecritureAlgebrique(b)})^2= \\color{red}${c}\\color{black}^2-(\\color{blue}${a}x${ecritureAlgebrique(b)}\\color{black})^2 $<br>
                    $\\phantom{${c * c}-(${a}x${ecritureAlgebrique(b)})^2}=\\left[ \\color{red}${c}\\color{black}-(\\color{blue}${a}x${ecritureAlgebrique(b)}\\color{black}) \\right] \\left[ \\color{red}${c}\\color{black}+(\\color{blue}${a}x${ecritureAlgebrique(b)}\\color{black}) \\right] $<br>
                    $\\phantom{${c * c}-(${a}x${ecritureAlgebrique(b)})^2}=(${c}${ecritureAlgebrique(-a)}x${ecritureAlgebrique(-b)}) (${c}${ecritureAlgebrique(a)}x${ecritureAlgebrique(b)})$<br>
                    $\\phantom{${c * c}-(${a}x${ecritureAlgebrique(b)})^2}=(${reduireAxPlusB(-a, c - b)}) (${reduireAxPlusB(a, b + c)})$`
          handleAnswers(this, i, { reponse: { value: `(${reduireAxPlusB(-a, c - b)})(${reduireAxPlusB(a, b + c)})`, compare: factorisationCompare } })
          break
        case 3: {
          texte = `$(${a}x${ecritureAlgebrique(b)})^2-(${c}x${ecritureAlgebrique(d)})^2$` // (ax+b)²-(cx+d)²
          // $(${a}x${ecritureAlgebrique(b)})^2-(${c}x${ecritureAlgebrique(d)})^2=a^2-b^2$<br>
          texteCorr = `On reconnaît l'identité remarquable $a^2-b^2=(\\color{red}a\\color{black}-\\color{blue}b\\color{black})(\\color{red}a\\color{black}+\\color{blue}b\\color{black})$, avec $a=\\color{red}${a}x${ecritureAlgebrique(b)}$ et $b=\\color{blue}${c}x${ecritureAlgebrique(d)}$. <br><br>
                    $(${a}x${ecritureAlgebrique(b)})^2-(${c}x${ecritureAlgebrique(d)})^2=
                    \\left[ (\\color{red}${a}x${ecritureAlgebrique(b)}\\color{black})-
                    (\\color{blue}${c}x${ecritureAlgebrique(d)}\\color{black})\\right]
                    \\left[ (\\color{red}${a}x${ecritureAlgebrique(b)}\\color{black})+
                    (\\color{blue}${c}x${ecritureAlgebrique(d)}\\color{black})\\right]$<br>
                    $\\phantom{(${a}x${ecritureAlgebrique(b)})^2-(${c}x${ecritureAlgebrique(d)})^2}=
                    (${a}x${ecritureAlgebrique(b)}${ecritureAlgebrique(-c)}x${ecritureAlgebrique(-d)})
                    (${a}x${ecritureAlgebrique(b)}${ecritureAlgebrique(c)}x${ecritureAlgebrique(d)})$<br>`

          texteCorr += `$\\phantom{(${a}x${ecritureAlgebrique(b)})^2-(${c}x${ecritureAlgebrique(d)})^2}=`
          const facteur1 = reduireAxPlusB(a - c, b - d)
          const facteur2 = reduireAxPlusB(a + c, b + d)
          const facteurConstant = [facteur1, facteur2].filter(el => !el.includes('x'))
          if (facteurConstant.length === 0) {
            texteCorr += `(${facteur1})(${facteur2})$`
          } else {
            if (facteur1.includes('x')) {
              texteCorr += `${facteur2}(${facteur1})$`
            } else {
              texteCorr += `${facteur1}(${facteur2})$`
            }
          }
          handleAnswers(this, i, { reponse: { value: `(${facteur1})(${facteur2})`, compare: factorisationCompare } })
        } break
        case 4: { // e²(ax+b)²-f²(cx+d)²
          const e = randint(2, 6, [a, b])
          const f = randint(2, 6, [c, d, e])
          texte = `$${e ** 2}(${a}x${ecritureAlgebrique(b)})^2-${f ** 2}(${c}x${ecritureAlgebrique(d)})^2$` // (ax+b)²-(cx+d)²
          // $(${a}x${ecritureAlgebrique(b)})^2-(${c}x${ecritureAlgebrique(d)})^2=a^2-b^2$<br>
          texteCorr = `On reconnaît l'identité remarquable $a^2-b^2=(\\color{red}a\\color{black}-\\color{blue}b\\color{black})(\\color{red}a\\color{black}+\\color{blue}b\\color{black})$
, avec $a=\\color{red}${e}(${a}x${ecritureAlgebrique(b)})$ et $b=\\color{blue}${f}(${c}x${ecritureAlgebrique(d)})$.<br><br>`
          texteCorr += `
$\\begin{aligned}${e ** 2}(${a}x${ecritureAlgebrique(b)})^2-${f ** 2}(${c}x${ecritureAlgebrique(d)})^2
 &= \\left[(\\color{red}${e}\\times ${a}x${ecritureAlgebrique(b)}\\times ${e}\\color{black})-(\\color{blue}${f}\\times ${c}x${ecritureAlgebrique(d)}\\times ${f}\\color{black})\\right]
\\left[ (\\color{red}${e}\\times ${a}x${ecritureAlgebrique(b)}\\times ${e}\\color{black})+(\\color{blue}${f}\\times ${c}x${ecritureAlgebrique(d)}\\times ${f}\\color{black})\\right]
 &= (${a * e}x${ecritureAlgebrique(b * e)}${ecritureAlgebrique(-c * f)}x${ecritureAlgebrique(-d * f)})(${a * e}x${ecritureAlgebrique(b * e)}${ecritureAlgebrique(c * f)}x${ecritureAlgebrique(d * f)})`
          const facteur1 = reduireAxPlusB(e * a - c * f, b * e - d * f)
          const facteur2 = reduireAxPlusB(a * e + c * f, b * e + d * f)
          const facteurConstant = [facteur1, facteur2].filter(el => !el.includes('x'))
          if (facteurConstant.length === 0) {
            texteCorr += ` &= (${facteur1})(${facteur2})\\end{aligned}$`
          } else {
            if (facteur1.includes('x')) {
              texteCorr += ` &= ${facteur2}(${facteur1})\\end{aligned}$`
            } else {
              texteCorr += ` &= ${facteur1}(${facteur2})\\end{aligned}$`
            }
          }
          handleAnswers(this, i, { reponse: { value: `(${facteur1})(${facteur2})`, compare: factorisationCompare } })
        } break
      }
      if (this.interactif) {
        texte += ' $=$ ' + ajouteChampTexteMathLive(this, i, '  college6e ml-2')
      }
      if (this.questionJamaisPosee(i, a, b, c, d, k, typesDeQuestions)) {
        // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireTexte = ['Type d\'expression (numéros séparés par des tirets)', '1 :forme (ax+b)²-c²\n2 : forme c²-(ax+b)²\n3 : (ax+b)²-(cx+d)²\n 4 : a²(bx+c)²-d²(ex+f)²\n5 : Mélange des cas précédents']
}
