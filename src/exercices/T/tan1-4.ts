import Exercice from '../Exercice.js'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { handleAnswers } from '../../lib/interactif/gestionInteractif.js'
import { miseEnEvidence } from '../../lib/outils/embellissements.js'
import { fonctionComparaison } from '../../lib/interactif/comparisonFunctions.js'
import { ecritureAlgebrique, ecritureAlgebriqueSauf1, rienSi1 } from '../../lib/outils/ecritures.js'
import { aleaVariables } from '../../modules/outilsMathjs.js'
import { numAlpha } from '../../lib/outils/outilString.js'
import FractionEtendue from '../../modules/FractionEtendue.js'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard.js'

export const titre = 'Équations avec la fonction logarithme'
export const dateDePublication = '22/7/2024'
export const uuid = 'f1f9d'
export const interactifReady = true
export const interactifType = 'mathLive'
export const refs = {
  'fr-fr': ['TAN1-4'],
  'fr-ch': []
}

/**
 * Description didactique de l'exercice
 * @autor  Jean-Claude Lhote
 * Référence TAN1-4
 */
export default class EquationsLog extends Exercice {
  version: string
  constructor () {
    super()
    this.version = 'ln'
    this.nbQuestions = 5
    this.consigne = 'Résoudre.'
    this.spacingCorr = 3
    this.sup = '1'
    this.besoinFormulaireTexte = ['Type de question (nombre séparés par des tirets', '1 : log(ax+b)=n\n2 : log(ax+b)=log(cx+d)\n3 : Mélange']
    this.besoinFormulaire2CaseACocher = ['Type de logarithme', false]
    this.comment = 'Exercice de résolution d\'équations avec logarithme'
  }

  nouvelleVersion () {
    if (this.sup2) this.version = 'ln'
    else this.version = 'log'
    const logString = this.version !== 'ln' ? '\\log' : '\\ln'
    const base = this.version !== 'ln' ? '10' : 'e'

    const listeTypeQuestions = gestionnaireFormulaireTexte({ saisie: this.sup, min: 1, max: 2, melange: 3, defaut: 3, nbQuestions: this.nbQuestions }).map(el => Number(el))

    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let texte:string
      let texteCorr: string
      const fracPlusInf = new FractionEtendue(10 ** 15, 1)
      const fracMoinsInf = new FractionEtendue(-(10 ** 15), 1)
      const { a, b, c, d, n } = aleaVariables({ a: true, b: true, c: true, d: true, n: true, test: 'a!=c and b!=d and b/c!=d/c' }) as {a: number, b: number, c: number, d:number, n: number}
      let domaine : string
      let solution : string
      let intervalle: [FractionEtendue, FractionEtendue]
      if (listeTypeQuestions[i] === 1) { // log(ax+b)=n
        texte = `On demande de résoudre l'équation suivante : $${logString}(${rienSi1(a)}x${ecritureAlgebrique(b)})=${n}$<br>`
        texte += `${numAlpha(0)} Déterminer le domaine sur lequel on peut résoudre cette équation.` + ajouteChampTexteMathLive(this, 2 * i, `inline largeur10 ${KeyboardType.lycee} ${KeyboardType.clavierEnsemble}`, { texteAvant: '$\\mathcal{D}_f=$' })
        texte += `<br>${numAlpha(1)} Donner la solution de cette équation.` + ajouteChampTexteMathLive(this, 2 * i + 1, `inline largeur10 ${KeyboardType.lycee} ${KeyboardType.clavierEnsemble}`, { texteAvant: '$\\mathcal{S}=$' })
        texteCorr = `${numAlpha(0)} Tout d'abord, la fonction $${logString}$ est définie sur $\\R_+$, donc $${rienSi1(a)}x${ecritureAlgebrique(b)}$ doit être strictement positif.<br>`
        const f1 = new FractionEtendue(-b, a)
        const fracMoinsBsurA = f1.texFractionSimplifiee
        texteCorr += `$${rienSi1(a)}x${ecritureAlgebrique(b)}\\gt 0 \\iff ${rienSi1(a)}x\\gt ${-b} \\iff x${a > 0 ? '\\gt ' : '\\lt '}${fracMoinsBsurA}$<br>`
        texteCorr += `$\\mathcal{D}_f=${miseEnEvidence(a > 0 ? `\\left]${fracMoinsBsurA};+\\infty\\right[` : `\\left]-\\infty;${fracMoinsBsurA}\\right[`)}$.<br>`
        texteCorr += `${numAlpha(1)} Ensuite, la fonction $${logString}$ étant une fonction strictement croissante de $\\R_+$ dans $\\R$, donc pour tout $a$ et $b$ appartentant à $\\R_+$, $a=b \\iff ${logString} a = ${logString} b$.<br>`
        texteCorr += `Ainsi, en mettant à la puissance de $${base}$ :<br>
        $\\begin{aligned}
        ${logString}(${rienSi1(a)}x${ecritureAlgebrique(b)})= ${n} &\\iff ${rienSi1(a)}x${ecritureAlgebrique(b)}=${base}^{${n}}\\\\
         &\\iff ${rienSi1(a)}x=${base}^{${n}}${ecritureAlgebrique(-b)}\\\\
         &\\iff x=${a > 0 ? '' : '-'}${Math.abs(a) !== 1 ? `\\dfrac{${base}^{${n}}${ecritureAlgebrique(-b)}}{${Math.abs(a)}}` : `${base}^{${n}}${ecritureAlgebrique(a === 1 ? -b : b)}`}
         \\end{aligned}$`
        domaine = a > 0 ? `\\left]${fracMoinsBsurA};+\\infty\\right[` : `\\left]-\\infty;${fracMoinsBsurA}\\right[`
        solution = `${a > 0 ? '' : '-'}${Math.abs(a) !== 1 ? `\\dfrac{${base}^{${n}}${ecritureAlgebrique(-b)}}{${Math.abs(a)}}` : `${base}^{${n}}${ecritureAlgebrique(a === 1 ? -b : b)}`}`
        intervalle = a > 0 ? [f1, new FractionEtendue(10 ** 15, 1)] : [new FractionEtendue(-(10 ** 15), 1), f1]// une notion relative de \\infty ;-)
        const valeurSolution = base === '10' ? (10 ** n - b) / a : (Math.E ** n - b) / a
        if (intervalle[1].valeurDecimale > valeurSolution && intervalle[0].valeurDecimale < valeurSolution) {
          texteCorr += `<br>$${solution}\\in ${domaine}$ donc l'équation admet $${solution}$ comme solution unique.`
          solution = `{${solution}}`
        } else {
          texteCorr += `<br>$${solution}\\notin ${domaine}$ donc l'équation n'admet aucune solution.`
          solution = '\\emptyset'
        }
      } else { // log(ax+b)=log(cx+d)
        texte = `On demande de résoudre l'équation suivante : $${logString}(${rienSi1(a)}x${ecritureAlgebrique(b)})=${logString}(${rienSi1(c)}x${ecritureAlgebrique(d)})$<br>`
        texte += `${numAlpha(0)} Déterminer le domaine sur lequel on peut résoudre cette équation.<br>` + ajouteChampTexteMathLive(this, 2 * i, `inline largeur10 ${KeyboardType.lycee} ${KeyboardType.clavierEnsemble}`, { texteAvant: '$\\mathcal{D}_f=$' })
        texte += `<br>${numAlpha(1)} Donner la solution de cette équation.<br>` + ajouteChampTexteMathLive(this, 2 * i + 1, `inline largeur10 ${KeyboardType.lycee} ${KeyboardType.clavierEnsemble}`, { texteAvant: '$\\mathcal{S}=$' })
        texteCorr = `${numAlpha(0)} Tout d'abord, la fonction $${logString}$ est définie sur $\\R_+$, donc $${rienSi1(a)}x${ecritureAlgebrique(b)}$ et $${rienSi1(c)}x${ecritureAlgebrique(d)}$ doivent être strictement positifs.<br>`
        const f2 = new FractionEtendue(-b, a)
        const f3 = new FractionEtendue(-d, c)
        const fracMoinsBsurA = f2.texFractionSimplifiee
        const fracMoinsDsurC = f3.texFractionSimplifiee
        texteCorr += `D'une part, $${rienSi1(a)}x${ecritureAlgebrique(b)}\\gt 0 \\iff ${rienSi1(a)}x\\gt ${-b} 
        \\iff x${a > 0 ? '\\gt ' : '\\lt'}${fracMoinsBsurA}$.<br>`
        texteCorr += `D'autre part, $${rienSi1(c)}x${ecritureAlgebrique(d)}\\gt 0 \\iff ${rienSi1(c)}x\\gt ${-d} 
        \\iff x${c > 0 ? '\\gt ' : '\\lt'}${fracMoinsDsurC}$.<br>`
        if (a * c > 0) { // les signes sont dans le même sens, on a un intervalle inclus dans l'autre
          if (a > 0) { // le signe est > pour les deux, on cherche le plus grand des deux.
            if (-b / a > -d / c) {
              texteCorr += `$${fracMoinsDsurC}\\lt${fracMoinsBsurA}\\lt x$ donc $\\mathcal{D}_f=${miseEnEvidence(`\\left]${fracMoinsBsurA};+\\infty\\right[`)}$.<br>`
              domaine = `\\left]${fracMoinsBsurA};+\\infty\\right[`
              intervalle = [f2, fracPlusInf]
            } else {
              texteCorr += `$${fracMoinsBsurA}\\lt${fracMoinsDsurC}\\lt x$ donc $\\mathcal{D}_f=${miseEnEvidence(`\\left]${fracMoinsDsurC};+\\infty\\right[`)}$.<br>`
              domaine = `\\left]${fracMoinsDsurC};+\\infty\\right[`
              intervalle = [f3, fracPlusInf]
            }
          } else { // le signe est < on cherche le plus petit des deux
            if (-b / a < -d / c) {
              texteCorr += `$x\\lt${fracMoinsBsurA}\\lt${fracMoinsDsurC}$ donc $\\mathcal{D}_f=${miseEnEvidence(`\\left]-\\infty;${fracMoinsBsurA}\\right[`)}$.<br>`
              domaine = `\\left]-\\infty;${fracMoinsBsurA}\\right[`
              intervalle = [fracMoinsInf, f2]
            } else {
              texteCorr += `$x\\lt${fracMoinsDsurC}\\lt${fracMoinsBsurA}$ donc $\\mathcal{D}_f=${miseEnEvidence(`\\left]-\\infty;${fracMoinsDsurC}\\right[`)}$.<br>`
              domaine = `\\left]-\\infty;${fracMoinsDsurC}\\right[`
              intervalle = [fracMoinsInf, f3]
            }
          }
        } else { // les signes sont dans des sens différents, on a une intersection ou une réunion...
          if (-b / a < -d / c) { // -b/a<-d/c
            if (a > 0) { // -b/a<x -b/a<-d/c
              if (c > 0) { // -b/a<-d/c<x
                texteCorr += `$${fracMoinsBsurA}\\lt${fracMoinsDsurC}\\lt x$ donc $\\mathcal{D}_f=${miseEnEvidence(`\\left]${fracMoinsDsurC};+\\infty\\right[`)}$.<br>`
                domaine = `\\left]${fracMoinsDsurC};+\\infty\\right[`
                intervalle = [f3, fracPlusInf]
              } else { // -b/a<x<-d/c
                texteCorr += `$${fracMoinsBsurA}\\lt x\\lt${fracMoinsDsurC}$ donc $\\mathcal{D}_f=${miseEnEvidence(`\\left]${fracMoinsBsurA};${fracMoinsDsurC}\\right[`)}$.<br>`
                domaine = `\\left]${fracMoinsBsurA};${fracMoinsDsurC}\\right[`
                intervalle = [f2, f3]
              }
            } else { // x<-b/a et -b/a<-d/c
              if (c > 0) { // x>-d/c donc ensemble vide
                texteCorr += `$x\\lt${fracMoinsBsurA}$ et $x\\gt ${fracMoinsDsurC}$ ne peuvent être vérifiés en même temps car $${fracMoinsBsurA}\\lt${fracMoinsDsurC}$, donc $\\mathcal{D}_f=${miseEnEvidence('\\emptyset')}$.<br>`
                domaine = '\\emptyset'
                intervalle = [fracMoinsInf, fracMoinsInf]
              } else { // x<-d/c donc x<-b/a<-d/c
                texteCorr += `$x\\lt${fracMoinsBsurA}\\lt${fracMoinsDsurC}$ donc $\\mathcal{D}_f=${miseEnEvidence(`\\left]-\\infty;${fracMoinsBsurA}\\right[`)}$.<br>`
                domaine = `\\left]-\\infty;${fracMoinsBsurA}\\right[`
                intervalle = [fracMoinsInf, f2]
              }
            }
          } else { // -d/c<-b/a
            if (a > 0) { // -b/a<x -d/c<-b/a
              if (c > 0) { // -d/c<-b/a<x
                texteCorr += `$x\\gt ${fracMoinsBsurA}\\gt ${fracMoinsDsurC}$ donc $\\mathcal{D}_f=${miseEnEvidence(`\\left]${fracMoinsBsurA};+\\infty;\\right[`)}$.<br>`
                domaine = `\\left]${fracMoinsBsurA};+\\infty;\\right[`
                intervalle = [f2, fracPlusInf]
              } else { // x<-d/c et x>-b/a impossible car -d/c<-b/a
                texteCorr += `$x\\gt ${fracMoinsBsurA}$ et $x\\lt${fracMoinsDsurC}$ ne peuvent être vérifiés en même temps car $${fracMoinsBsurA}\\gt ${fracMoinsDsurC}$, donc $\\mathcal{D}_f=${miseEnEvidence('\\emptyset')}$.<br>`
                domaine = '\\emptyset'
                intervalle = [fracMoinsInf, fracMoinsInf]
              }
            } else {
              if (c > 0) { // -d/c<x<-b/a
                texteCorr += `$${fracMoinsDsurC}\\lt x\\lt${fracMoinsBsurA}$ donc $\\mathcal{D}_f=${miseEnEvidence(`\\left]${fracMoinsDsurC};${fracMoinsBsurA}\\right[`)}$.<br>`
                domaine = `\\left]${fracMoinsDsurC};${fracMoinsBsurA}\\right[`
                intervalle = [f3, f2]
              } else { //  x<-d/c<-b/a
                texteCorr += `$x\\lt ${fracMoinsDsurC}\\lt ${fracMoinsBsurA}$ donc $\\mathcal{D}_f=${miseEnEvidence(`\\left]-\\infty;${fracMoinsDsurC}\\right[`)}$.<br>`
                domaine = `\\left]-\\infty;${fracMoinsDsurC}\\right[`
                intervalle = [fracMoinsInf, f3]
              }
            }
          }
        }
        if (domaine !== '\\emptyset') {
          texteCorr += `<br>${numAlpha(1)} Ensuite, la fonction $${logString}$ étant une fonction strictement croissante de $\\R_+$ dans $\\R$, donc pour tout $a$ et $b$ appartenant à $\\R_+$, $a=b \\iff ${logString} a = ${logString} b$.<br>`
          texteCorr += `Ainsi, En mettant à la puissance de $${base}$ :<br>$
          \\begin{aligned} 
          ${logString}(${rienSi1(a)}x${ecritureAlgebrique(b)})=${logString}(${rienSi1(c)}x${ecritureAlgebrique(d)})&\\iff ${rienSi1(a)}x${ecritureAlgebrique(b)}=${rienSi1(c)}x${ecritureAlgebrique(d)}\\\\`
          const fracSolution = new FractionEtendue(d - b, a - c).simplifie()
          if (a > c) { // a>c : on ramène dans le premier membre.
            texteCorr += `&\\iff ${rienSi1(a)}x{${ecritureAlgebriqueSauf1(-c)}x=${d}${ecritureAlgebrique(-b)}}\\\\
            &\\iff ${rienSi1(a - c)}x=${d - b}\\\\
            &\\iff x=${fracSolution.texFSD}
            \\end{aligned}$`
          } else { // c>a, on ramène dans le deuxième membre
            texteCorr += `&\\iff ${b}${ecritureAlgebrique(-d)}=${rienSi1(c)}x${ecritureAlgebriqueSauf1(-a)}x\\\\
            &\\iff ${b - d}=${rienSi1(c - a)}x\\\\
            &\\iff x=${fracSolution.texFSD}
            \\end{aligned}$`
          }
          if (fracSolution.superieurstrict(intervalle[0]) && fracSolution.inferieurstrict(intervalle[1])) {
            texteCorr += `<br>$${fracSolution.texFSD}\\in ${domaine}$ donc l'équation admet $${fracSolution.texFSD}$ comme solution unique.`
            solution = `{${fracSolution.texFSD}}`
          } else {
            texteCorr += `<br>$${fracSolution.texFSD}\\notin ${domaine}$ donc l'équation n'admet aucune solution.`
            solution = '\\emptyset'
          }
        } else {
          texteCorr += `<br>${numAlpha(1)} Le domaine de définition de l'équation étant l'ensemble vide, il en est de même pour l'ensemble de solution de l'équation.<br>`
          solution = '\\emptyset'
        }
        texteCorr += `<br>$\\mathcal{S}=${miseEnEvidence(solution)}$`
      }
      if (this.questionJamaisPosee(i, a, b, n, listeTypeQuestions[i])) {
        if (this.interactif) {
          handleAnswers(this, 2 * i, { reponse: { value: domaine, compare: fonctionComparaison, options: { intervalle: true } } })
          handleAnswers(this, 2 * i + 1, { reponse: { value: solution, compare: fonctionComparaison } })
        }
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
