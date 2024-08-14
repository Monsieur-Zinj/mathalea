import { shuffle2tableaux } from '../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { ecritureAlgebrique, ecritureParentheseSiNegatif, rienSi1 } from '../../lib/outils/ecritures'
import { numAlpha, sp } from '../../lib/outils/outilString.js'
import Exercice from '../Exercice'

import { listeQuestionsToContenu, randint } from '../../modules/outils.js'

import Trinome from '../../modules/Trinome'
export const titre = 'Utiliser les différentes formes d\'un polynôme du second degré'
export const interactifReady = false

export const dateDePublication = '26/06/2023'
export const dateDeModifImportante = '5/11/2023'

/**
 * Forme développée, factorisée ou canonique pour résoudre équations et inéquations
 * @author Gilles Mora
*/
export const uuid = '327cf'
export const ref = '2N42-3'
export const refs = {
  'fr-fr': ['2N42-3'],
  'fr-ch': []
}
export default class EtudeTrinome extends Exercice {
  constructor () {
    super()
    this.sup = 1
    this.sup2 = 1
    this.nbQuestions = 1
    this.nbQuestionsModifiable = false
    this.besoinFormulaireNumerique = ['Forme de la fonction de départ', 3, '1 : Développée \n2 : Factorisée\n3 : Canonique']
    this.besoinFormulaire2Numerique = ['Niveau de difficulté', 3, '1 : a=1 \n2 : a différent de 1']
    this.correctionDetaillee = false
    this.correctionDetailleeDisponible = true
  }

  nouvelleVersion () {
    let a = randint(-4, 4, [0, 1]); let question1; let question2; let question3; let correction1; let correction2
    if (this.sup2 === 1) { a = 1 }
    let x1 = randint(-8, 8, 0)
    let x2 = x1 + 2 * randint(1, 6)
    while (x1 === -x2 || x1 === 0 || x2 === 0) {
    // x1 + x2 doit êter pair pour n'avoir que des nombres entiers dans les différentes formes
      x1 = randint(-8, 8, 0)
      x2 = x1 + 2 * randint(1, 6)
    }
    const p = new Trinome()
    const q = new Trinome(a, -a * (x1 + x2), a * x1 * x2)
    p.defFormeFactorisee(a, x1, x2)
    const etapesDeveloppement = p.arrayTexDevelopperFormeCanonique
    const etapesDeveloppement2 = p.arrayTexDevelopperFormeFactorisee
    if (this.sup === 1) {
      this.introduction = `Soit $f$ la fonction définie sur $\\mathbb{R}$ par $f(x)=${q.tex}$. ${sp(5)} ($\\textit{Forme développée}$)
     `
      question1 = `Montrer que $f(x)$ peut aussi s'écrire $f(x)=${p.texFormeFactorisee}$.${sp(5)} ($\\textit{Forme factorisée}$)`
      question2 = `Montrer que $f(x)$ peut aussi s'écrire $f(x)=${p.texFormeCanonique}$. ${sp(5)} ($\\textit{Forme canonique}$)`
      correction1 = 'On développe la forme factorisée : '
      if (a !== 1) {
        correction1 += `<br>$\\begin{aligned}
    ${p.texFormeFactorisee} &= ${etapesDeveloppement2[0]}${this.correctionDetaillee === true ? `${sp(5)}${miseEnEvidence('\\textit{On développe  avec la double distributivité}')}` : ''}\\\\
     & = ${etapesDeveloppement2[1]} ${this.correctionDetaillee === true ? `${sp(5)}${miseEnEvidence('\\textit{On développe avec la simple distributivité}')}` : ''}\\\\
    &= ${etapesDeveloppement2[2]}${this.correctionDetaillee === true ? `${sp(20)}${miseEnEvidence('\\textit{ On réduit}')}` : ''}\\\\
    &=f(x)
     \\end{aligned}$`
      } else {
        correction1 += `<br>$\\begin{aligned}
     ${p.texFormeFactorisee} &= ${etapesDeveloppement2[1]}${this.correctionDetaillee === true ? `${sp(5)}${miseEnEvidence('\\textit{On développe avec la double distributivité}')}` : ''}\\\\
      & = ${etapesDeveloppement2[2]}${this.correctionDetaillee === true ? `${sp(20)}${miseEnEvidence('\\textit{On réduit}')}` : ''}\\\\
      &=f(x)
      \\end{aligned}$`
      }
      correction1 += `<br> On retrouve la forme développée, donc on en déduit que $f(x)$ peut s'écrire sous forme factorisée : $f(x)=${p.texFormeFactorisee}$.`
      correction2 = `On développe la forme canonique : <br>$\\begin{aligned}
     ${p.texFormeCanonique}  ${a !== 1 ? `&=${etapesDeveloppement[0]}${this.correctionDetaillee === true ? `${sp(5)}${miseEnEvidence('\\textit{On développe avec l\'égalité remarquable}')}` : ''}\\\\` : `&=${etapesDeveloppement[0]}${this.correctionDetaillee === true ? `${sp(5)}${miseEnEvidence('\\textit{On développe  avec l\'égalité remarquable}')}` : ''}`}
     ${a !== 1 ? `&=${etapesDeveloppement[1]}${this.correctionDetaillee === true ? `${sp(5)}${miseEnEvidence('\\textit{On développe avec la simple distributivité}')}` : ''}\\\\` : '\\\\'}
   &=${etapesDeveloppement[2]}${this.correctionDetaillee === true ? `${sp(20)}${miseEnEvidence('\\textit{On réduit}')}` : ''}
   \\end{aligned}$`
      correction2 += `<br>On en déduit que $f(x)$ s'écrit sous forme canonique :  $f(x)=${p.texFormeCanonique}$.`
    }
    if (this.sup === 2) {
      this.introduction = `Soit $f$ la fonction définie sur $\\mathbb{R}$ par $f(x)=${p.texFormeFactorisee}$. ${sp(5)} ($\\textit{Forme factorisée}$)
     `
      question1 = `Montrer que $f(x)$ peut aussi s'écrire $f(x)=${q.tex}$. ${sp(5)} ($\\textit{Forme développée}$)`
      question2 = `Montrer que $f(x)$ peut aussi s'écrire $f(x)=${p.texFormeCanonique}$. ${sp(5)} ($\\textit{Forme canonique}$)`
      correction1 = 'On développe la forme factorisée : '
      if (a !== 1) {
        correction1 += `<br>$\\begin{aligned}
        f(x)&=${p.texFormeFactorisee}\\\\
     &= ${etapesDeveloppement2[0]}${this.correctionDetaillee === true ? `${sp(5)}${miseEnEvidence('\\textit{On développe avec la double distributivité}')}` : ''}\\\\
     & = ${etapesDeveloppement2[1]}${this.correctionDetaillee === true ? `${sp(5)}${miseEnEvidence('\\textit{On développe avec la simple distributivité}')}` : ''}\\\\
    &= ${etapesDeveloppement2[2]}${this.correctionDetaillee === true ? `${sp(20)}${miseEnEvidence('\\textit{On réduit}')}` : ''}
     \\end{aligned}$`
      } else {
        correction1 += `<br>$\\begin{aligned}
        f(x)&=${p.texFormeFactorisee}\\\\
     &= ${etapesDeveloppement2[1]}${this.correctionDetaillee === true ? `${sp(5)}${miseEnEvidence('\\textit{On développe avec la double distributivité}')}` : ''}\\\\
      & = ${etapesDeveloppement2[2]}${this.correctionDetaillee === true ? `${sp(20)}${miseEnEvidence('\\textit{On réduit}')}` : ''}
      \\end{aligned}$`
      }
      correction1 += `<br> On en déduit que $f(x)$ s'écrit sous forme développée : $f(x)=${p.texFormeFactorisee}$.`
      correction2 = 'On développe la forme canonique : <br>'
      if (a === 1) {
        correction2 += `$\\begin{aligned}
${p.texFormeCanonique}  &=${etapesDeveloppement[1]}${this.correctionDetaillee === true ? `${sp(5)}${miseEnEvidence('\\textit{On développe avec l\'égalité remarquable}')}\\\\` : '\\\\'}
&=${etapesDeveloppement[2]}${this.correctionDetaillee === true ? `${sp(20)}${miseEnEvidence('\\textit{On réduit}')}` : ''}
\\end{aligned}$`
      } else {
        correction2 += `$\\begin{aligned}
        ${p.texFormeCanonique}  &=${etapesDeveloppement[0]}${this.correctionDetaillee === true ? `${sp(5)}${miseEnEvidence('\\textit{On développe avec l\'égalité remarquable}')}\\\\` : '\\\\'}
  &=${etapesDeveloppement[1]}${this.correctionDetaillee === true ? `${sp(5)}${miseEnEvidence('\\textit{On développe avec la simple distributivité}')}\\\\` : '\\\\'}
&=${etapesDeveloppement[2]}${this.correctionDetaillee === true ? `${sp(20)}${miseEnEvidence('\\textit{On réduit}')}` : ''}
\\end{aligned}$`
      }

      correction2 += `<br>On en déduit que $f(x)$ s'écrit sous forme canonique :  $f(x)=${p.texFormeCanonique}$.`
    }
    if (this.sup === 3) {
      this.introduction = `Soit $f$ la fonction définie sur $\\mathbb{R}$ par $f(x)=${p.texFormeCanonique}$. ${sp(5)} ($\\textit{Forme canonique}$)
     `
      question1 = `Montrer que $f(x)$ peut aussi s'écrire $f(x)=${q.tex}$. ${sp(5)} ($\\textit{Forme développée}$)`
      question2 = `Montrer que $f(x)$ peut aussi s'écrire $f(x)=${p.texFormeFactorisee}$. ${sp(5)} ($\\textit{Forme factorisée}$)`

      correction1 = 'On développe la forme canonique : <br>'
      if (a === 1) {
        correction1 += `
      $\\begin{aligned}
    f(x)&=${p.texFormeCanonique}\\\\
  &=${etapesDeveloppement[1]}${this.correctionDetaillee === true ? `${sp(5)}${miseEnEvidence('\\textit{On développe avec l\'égalité remarquable}')}` : ''}\\\\
 &=${etapesDeveloppement[2]}${this.correctionDetaillee === true ? `${sp(20)}${miseEnEvidence('\\textit{On réduit}')}` : ''}
 \\end{aligned}$`
      } else {
        correction1 += `
        $\\begin{aligned}
        f(x)&=${p.texFormeCanonique}\\\\
      &=${etapesDeveloppement[0]}${this.correctionDetaillee === true ? `${sp(5)}${miseEnEvidence('\\textit{On développe avec l\'égalité remarquable}')}` : ''}\\\\
      &=${etapesDeveloppement[1]}${this.correctionDetaillee === true ? `${sp(5)}${miseEnEvidence('\\textit{On développe avec la simple distributivité}')}` : ''}\\\\
      &=${etapesDeveloppement[2]}${this.correctionDetaillee === true ? `${sp(20)}${miseEnEvidence('\\textit{On réduit}')}` : ''}
     \\end{aligned}$`
      }
      correction1 += `<br>On en déduit que $f(x)$ s'écrit sous forme développée :  $f(x)=${rienSi1(p.a)}x^2${ecritureAlgebrique(p.b)}x${x1 === 0 || x2 === 0 ? '' : `${ecritureAlgebrique(p.c)}`}$.`

      correction2 = 'On développe la forme factorisée  : '
      if (a !== 1) {
        correction2 += `<br> $${p.texFormeFactorisee} = ${etapesDeveloppement2[0]}${this.correctionDetaillee === true ? `${sp(5)}${miseEnEvidence('\\textit{On développe avec la double distributivité}')}` : ''}$`
        correction2 += `<br> $\\phantom{${p.texFormeFactorisee}} = ${etapesDeveloppement2[1]}${this.correctionDetaillee === true ? `${sp(5)}${miseEnEvidence('\\textit{On développe avec la simple distributivité}')}` : ''}$`
        correction2 += `<br> $\\phantom{${p.texFormeFactorisee}} = ${etapesDeveloppement2[2]}${this.correctionDetaillee === true ? `${sp(20)}${miseEnEvidence('\\textit{On réduit}')}` : ''}$`
        correction2 += `<br> $\\phantom{${p.texFormeFactorisee}} = f(x)$`
      } else {
        correction2 += `<br> $${p.texFormeFactorisee} = ${etapesDeveloppement2[1]}${this.correctionDetaillee === true ? `${sp(5)}${miseEnEvidence('\\textit{On développe avec la double distributivité}')}` : ''}$`
        correction2 += `<br> $\\phantom{${p.texFormeFactorisee}} = ${etapesDeveloppement2[2]}${this.correctionDetaillee === true ? `${sp(20)}${miseEnEvidence('\\textit{On réduit}')}` : ''}$`
        correction2 += `<br> $\\phantom{${p.texFormeFactorisee}} = f(x)$`
      }
      correction2 += `<br> On retrouve la même forme développée que celle de la question précédente donc on a bien $f(x)=${p.texFormeFactorisee}$.`
    }
    question3 = 'Répondre aux questions suivantes en utilisant l\'écriture de $f(x)$ la mieux adaptée :'
    let correction3 = ''

    const q3a = `Calculer $f(0)$, $f(${x1})$ puis $f(${p.alpha.simplifie().texFraction})$.`
    let corr3a = '$\\bullet$ Pour déterminer $f(0)$, les calculs à partir de la forme développée sont plus rapides : '
    if (a !== 1) { corr3a += `<br>$f(0)= ${p.texCalculImage(0)}$ ` } else { corr3a += `<br>$f(0)= 0^2${ecritureAlgebrique(-a * (x1 + x2))}\\times 0${ecritureAlgebrique(-a * (x1 + x2))}${ecritureAlgebrique(a * x1 * x2)}=${a * x1 * x2}$ ` }

    corr3a += `<br>$\\bullet$ Pour déterminer $f(${x1})$, les calculs à partir de la forme factorisée sont plus rapides : `
    corr3a += `<br>$f(${x1})= ${rienSi1(a)}(${x1}${p.x1.oppose().simplifie().texFractionSignee})(${x1}${p.x2.oppose().simplifie().texFractionSignee})
    = ${rienSi1(a)}\\times 0\\times ${ecritureParentheseSiNegatif(x1 - x2)}=0$ `
    corr3a += `<br>$\\bullet$ Pour déterminer $f(${p.alpha.simplifie().texFraction})$, les calculs à partir de la forme canonique sont plus rapides : `
    corr3a += `<br>$f(${p.alpha.simplifie().texFraction})= ${p.a.simplifie().texFractionSaufUn}\\left(${p.alpha.simplifie().texFraction}${p.alpha.oppose().simplifie().texFractionSignee} \\right)^2${p.beta.simplifie().texFractionSignee}=0${p.beta.simplifie().texFractionSignee}=${p.beta.simplifie().texFraction}$ `

    const q3b = 'Résoudre l\'équation $f(x)=0$.'
    let corr3b = 'En utilisant la forme factorisée, cela revient à résoudre  une équation produit-nul.'
    corr3b += `<br>$f(x)=0 \\iff ${p.texFormeFactorisee} = 0${this.correctionDetaillee === true ? `${sp(25)}${miseEnEvidence('\\textit{Équation produit-nul }')}` : ''}$`
    corr3b += `<br>$\\phantom{f(x)=0} \\iff x${p.x1.simplifie().oppose().texFractionSignee} = 0 \\text{\\quad ou \\quad} x${p.x2.simplifie().oppose().texFractionSignee} = 0${this.correctionDetaillee === true ? `${sp(5)}${miseEnEvidence('\\textit{L\'un au moins des deux facteurs est nul}')}` : ''}$`
    corr3b += `<br>$\\phantom{f(x)=0} \\iff x=${p.x1.simplifie().texFraction} \\text{\\quad ou \\quad} x=${p.x2.simplifie().texFraction}$`
    corr3b += `<br>L'équation a deux solutions : $${p.x1.simplifie().texFraction}$ et $${p.x2.simplifie().texFraction}$.`

    const q3c = `Résoudre l'équation $f(x)=${p.beta.simplifie().texFraction}$.`
    let corr3c = 'En utilisant la forme canonique, cela revient à résoudre une équation avec un carré isolé.'
    corr3c += `<br>$f(x)= ${p.beta.simplifie().texFraction}\\iff ${p.texFormeCanonique} =${p.beta.simplifie().texFraction}$`

    if (a === 1) {
      corr3c += `<br>$\\phantom{f(x)= ${p.beta.simplifie().texFraction}} \\iff ${p.a.simplifie().texFractionSaufUn}\\left( x ${p.alpha.oppose().simplifie().texFractionSignee} \\right)^2=0${this.correctionDetaillee === true ? `${sp(5)}${miseEnEvidence('\\textit{Équation avec un carré isolé }')}` : ''}$
    `
    } else {
      corr3c += `<br>$\\phantom{f(x)= ${p.beta.simplifie().texFraction}} \\iff ${p.a.simplifie().texFractionSaufUn}\\left( x ${p.alpha.oppose().simplifie().texFractionSignee} \\right)^2=0$
    `
    }

    if (a !== 1) { corr3c += `<br>$\\phantom{f(x)= ${p.beta.simplifie().texFraction}} \\iff\\left( x ${p.alpha.oppose().simplifie().texFractionSignee} \\right)^2=0${this.correctionDetaillee === true ? `${sp(5)}${miseEnEvidence('\\textit{Équation avec un carré isolé }')}` : ''}$` } else { corr3c += '' }
    corr3c += `<br>$\\phantom{f(x)= ${p.beta.simplifie().texFraction}} \\iff  x ${p.alpha.oppose().simplifie().texFractionSignee}=0$`
    corr3c += `<br>$\\phantom{f(x)= ${p.beta.simplifie().texFraction}} \\iff x=${p.alpha.simplifie().texFraction}$`
    corr3c += `<br>L'équation a une solution : $${p.alpha.simplifie().texFraction}$.`

    // $f(x)= \\iff${p.texFormeCanonique}=${p.beta.simplifie().texFraction}\\\\
    // ${a !== 1 ? `\\iff &${p.a.simplifie().texFractionSaufUn}\\left( x ${p.alpha.oppose().simplifie().texFractionSignee} \\right)^2${a > 0 ? '\\geqslant 0' : '\\leqslant 0'}\\\\` : ''}
    // \\iff &${p.texFormeCanonique}${a > 0 ? '\\geqslant' : '\\leqslant'}${p.beta.simplifie().texFraction}\\\\
    // \\iff & f(x)${a > 0 ? '\\geqslant' : '\\leqslant'}${p.beta.simplifie().texFraction}

    // <br>

    // Comme $f(${p.alpha.simplifie().texFraction})=${p.a.simplifie().texFractionSaufUn}\\left( ${p.alpha.simplifie().texFraction} ${p.alpha.oppose().simplifie().texFractionSignee} \\right)^2${p.beta.simplifie().texFractionSignee}=
    // ${p.beta.simplifie().texFraction}$ alors $f(x)${a > 0 ? '\\geqslant' : '\\leqslant'} f(${p.alpha.simplifie().texFraction})$.
    // <br> On en déduit que le ${a > 0 ? 'minimum' : 'maximum'} de $f$ est $${p.beta.simplifie().texFraction}$ et qu'il est atteint en $x= ${p.alpha.simplifie().texFraction}$.`

    const q3d = `Résoudre l'équation $f(x) = ${p.c.simplifie().texFraction}$.`
    // `Résoudre l'équation $f(x) = ${p.c.simplifie().texFraction}$. <br>
    // Quelle interprétation graphique peut-on en déduire ?`
    let corr3d = `  On remarque que $${p.c.simplifie().texFraction}$ est la constante de la forme développée.<br>
    En utilisant la forme développée, on obtient  :`
    corr3d += `<br> $f(x) = ${p.c.simplifie().texFraction} \\iff ${p.tex} = ${p.c.simplifie().texFraction}$`
    corr3d += `<br> $\\phantom{f(x) = ${p.c.simplifie().texFraction}} \\iff ${p.a.simplifie().texFractionSaufUn}x^2 ${p.b.simplifie().texFractionSaufUnSignee}x = 0 ${this.correctionDetaillee === true ? `${sp(30)}${miseEnEvidence('\\textit{Le second membre est nul }')}` : ''}$`
    corr3d += `<br> $\\phantom{f(x) = ${p.c.simplifie().texFraction}} \\iff x \\left(${p.a.simplifie().texFractionSaufUn}x ${p.b.simplifie().texFractionSaufUnSignee}\\right) = 0 ${this.correctionDetaillee === true ? `${sp(25)}${miseEnEvidence('\\textit{On met x en facteur }')}` : ''}$`
    corr3d += `<br> $\\phantom{f(x) = ${p.c.simplifie().texFraction}} \\iff x = 0 \\text{\\quad ou \\quad} ${p.a.simplifie().texFractionSaufUn}x ${p.b.simplifie().texFractionSaufUnSignee} = 0 ${this.correctionDetaillee === true ? `${sp(5)}${miseEnEvidence('\\textit{L\'un au moins des deux facteurs est nul}')}` : ''}$`
    corr3d += `<br> $\\phantom{f(x) = ${p.c.simplifie().texFraction}} \\iff x = 0 \\text{\\quad ou \\quad} x = ${p.b.oppose().diviseFraction(p.a).simplifie().texFraction} $`
    corr3d += `<br>
    L'équation a deux solutions : $0$ et $${p.b.oppose().diviseFraction(p.a).simplifie().texFraction}$.`

    const [sousQuestions, sousCorrections] = [[q3a, q3b, q3c, q3d], [corr3a, corr3b, corr3c, corr3d]]
    shuffle2tableaux(sousQuestions, sousCorrections)
    for (let i = 0; i < 4; i++) {
      question3 += `<br><br>${numAlpha(i)} ${sousQuestions[i]}`
      correction3 += `<br><br>${numAlpha(i)} ${sousCorrections[i]}`
    }
    this.listeQuestions = [question1, question2, question3]
    this.listeCorrections = [correction1, correction2, correction3]

    listeQuestionsToContenu(this)
  }
}
