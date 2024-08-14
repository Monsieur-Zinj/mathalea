import { ecritureAlgebrique, rienSi1 } from '../../lib/outils/ecritures'
import { numAlpha } from '../../lib/outils/outilString.js'
import Exercice from '../Exercice'

import { listeQuestionsToContenu, randint } from '../../modules/outils.js'

import Trinome from '../../modules/Trinome'
export const titre = 'Utiliser les différentes formes d\'un polynôme du second degré'
export const interactifReady = false

export const dateDePublication = '20/06/2023'
export const dateDeModifImportante = '5/11/2023'

/**
 * Forme développée, factorisée ou canonique pour résoudre équations et inéquations
 * @author Gilles Mora
*/
export const uuid = '4dced'
export const ref = '2F23-1'
export const refs = {
  'fr-fr': ['2F23-1'],
  'fr-ch': []
}
export default class EtudeTrinome extends Exercice {
  constructor () {
    super()
    this.sup = 1
    this.nbQuestions = 1
    this.nbQuestionsModifiable = false
    this.besoinFormulaireNumerique = ['Forme de la fonction', 3, '1 : Canonique a=1\n2 : Canonique a différent de 1\n3 : Factorisation non donnée']
  }

  nouvelleVersion () {
    let a = 1
    if (this.sup === 2) {
      a = randint(-4, 4, [0, 1])
    }

    // x1 + x2 doit êter pair pour n'avoir que des nombres entiers dans les différentes formes
    let x1 = randint(-8, 8, 0)
    let x2 = x1 + 2 * randint(1, 6)
    while (x1 === -x2 || x1 === 0 || x2 === 0) {
      // x1 + x2 doit êter pair pour n'avoir que des nombres entiers dans les différentes formes
      x1 = randint(-8, 8, 0)
      x2 = x1 + 2 * randint(1, 6)
    }
    const p = new Trinome()
    p.defFormeFactorisee(a, x1, x2)
    this.introduction = `Soit $f$ la fonction définie sur $\\mathbb{R}$ par $f(x)=${p.texFormeCanonique}$.<br>
    On note $\\mathscr{C}_f$ sa courbe représentative dans un repère.`
    const question1 = `Montrer que $f(x)$ peut aussi s'écrire $f(x)=${rienSi1(p.a)}x^2${ecritureAlgebrique(p.b)}x${x1 === 0 || x2 === 0 ? '' : `${(p.c).texFractionSignee}`}$.`
    const etapesDeveloppement = p.arrayTexDevelopperFormeCanonique
    let correction1 = `On développe l'expression donnée : <br>$\\begin{aligned}
    f(x)&=${p.texFormeCanonique}\\\\
    ${a !== 1 ? `&=${etapesDeveloppement[0]}\\\\` : `&=${etapesDeveloppement[0]}`}
   ${a !== 1 ? `&=${etapesDeveloppement[1]}\\\\` : '\\\\'}
 &=${etapesDeveloppement[2]}
 \\end{aligned}$`
    correction1 += `<br>On en déduit que $f(x)$ peut s'écrire $f(x)=${rienSi1(p.a)}x^2${ecritureAlgebrique(p.b)}x${x1 === 0 || x2 === 0 ? '' : `${(p.c).texFractionSignee}`}$.`
    let question2, correction2
    if (this.sup === 3) {
      question2 = 'Factoriser $f(x)$.'
      correction2 = `$f(x)$ est de la forme $a^2-b^2$ avec $a= x ${p.alpha.oppose().simplifie().texFractionSignee}$ et $b=${Math.sqrt(p.beta.simplifie().oppose().texFraction)}$, c'est une identité remarquable, d'où : `

      correction2 += `<br> $f(x) = \\underbrace{\\left( x ${p.alpha.oppose().simplifie().texFractionSignee} \\right)^2}_{a^2}-\\underbrace{${Math.sqrt(p.beta.simplifie().oppose().texFraction)}^2}_{b^2}$`
      correction2 += `<br> $\\phantom{f(x)} =\\underbrace{\\left( (x ${p.alpha.oppose().simplifie().texFractionSignee} )+${Math.sqrt(p.beta.simplifie().oppose().texFraction)}\\right)}_{(a+b)}\\underbrace{\\left( (x ${p.alpha.oppose().simplifie().texFractionSignee})-${Math.sqrt(p.beta.simplifie().oppose().texFraction)}\\right)}_{(a-b)}$`
      correction2 += `<br> $\\phantom{f(x)} =${p.texFormeFactorisee}$`
      correction2 += `<br> Une forme factorisée de $f(x)$ est donc :  $f(x)=${p.texFormeFactorisee}$.`
    } else {
      question2 = `Montrer que $f(x)$ se factorise sous la forme $f(x)=${p.texFormeFactorisee}$.`
      correction2 = 'On développe l\'expression : '
      const etapesDeveloppement2 = p.arrayTexDevelopperFormeFactorisee
      if (p.a === 1) {
        correction2 += `<br> $${p.texFormeFactorisee} = ${etapesDeveloppement2[0]}$`
        correction2 += `<br> $\\phantom{${p.texFormeFactorisee}} = ${etapesDeveloppement2[1]}$`
        correction2 += `<br> $\\phantom{${p.texFormeFactorisee}} = ${etapesDeveloppement2[2]}$`
        correction2 += `<br> $\\phantom{${p.texFormeFactorisee}} = f(x)$`
      } else {
        correction2 += `<br> $${p.texFormeFactorisee} = ${etapesDeveloppement2[1]}$`
        correction2 += `<br> $\\phantom{${p.texFormeFactorisee}} = ${etapesDeveloppement2[2]}$`
        correction2 += `<br> $\\phantom{${p.texFormeFactorisee}} = f(x)$`
      }
      correction2 += `<br> On retrouve la même forme développée que celle de la question précédente donc on a bien $f(x)=${p.texFormeFactorisee}$.`
    }
    let question3 = 'Répondre aux questions suivantes en utilisant l\'écriture de $f(x)$ la mieux adaptée :<br><br>'
    let correction3 = ''

    const q3a = 'Quelles sont les coordonnées du point d\'intersection entre $\\mathscr{C}_f$ et l\'axe des ordonnées ?'
    let corr3a = `Les coordonnées du point d'intersection entre l'axe des ordonnées et la courbe $\\mathscr{C}_f$ sont $(0\\,;\\,f(0))$.<br>
    Pour déterminer $f(0)$, les calculs à partir de la forme développée sont plus rapides : `
    corr3a += `<br>$f(0)= ${p.texCalculImage(0)}$ `

    corr3a += `<br>On en déduit que les coordonnées du point d'intersection entre l'axe des ordonnées et la courbe $\\mathscr{C}_f$ sont
    $(0\\, ;\\,${p.c.texFraction})$.`

    const q3b = 'Quelles sont les coordonnées des points d\'intersection  entre $\\mathscr{C}_f$ et l\'axe des abscisses ?'
    let corr3b = `Les coordonnées des points d'intersection entre l'axe des abscisses et la courbe $\\mathscr{C}_f$ sont
    de la forme $(x\\,;\\,0)$. Pour trouver les abscisses, il faut donc résoudre l'équation $f(x)=0$.<br>
    En utilisant la forme factorisée, cela revient à résoudre  une équation produit-nul.`
    corr3b += `<br>$f(x)=0 \\iff ${p.texFormeFactorisee} = 0$`
    corr3b += `<br>$\\phantom{f(x)=0} \\iff x${p.x1.simplifie().oppose().texFractionSignee} = 0 \\text{\\quad ou \\quad} x${p.x2.simplifie().oppose().texFractionSignee} = 0$`
    corr3b += `<br>$\\phantom{f(x)=0} \\iff x=${p.x1.simplifie().texFraction} \\text{\\quad ou \\quad} x=${p.x2.simplifie().texFraction}$`
    corr3b += `<br>L'équation a deux solutions : $${p.x1.simplifie().texFraction}$ et $${p.x2.simplifie().texFraction}$.`
    corr3b += `<br>On en déduit que les coordonnées des points d'intersection entre l'axe des abscisses et la courbe $\\mathscr{C}_f$ sont
    $(${p.x1.simplifie().texFraction}\\, ;\\,0)$ et $(${p.x2.simplifie().texFraction}\\,;\\,0)$`

    let q3c
    if (p.a.s > 0) {
      q3c = `À l'aide de la représentation graphique $\\mathscr{C}_f$, conjecturer le minimum de $f$.<br>
     Démontrer cette conjecture et préciser en quelle valeur ce ${a > 0 ? 'minimum' : 'maximum'} est atteint.`
    } else {
      q3c = `À l'aide de la représentation graphique de $\\mathscr{C}_f$, conjecturer le maximum de $f$. <br>
    Démontrer cette conjecture et préciser en quelle valeur il est atteint.`
    }
    let corr3c = `En traçant la courbe à l'aide de la calculatrice par exemple, on conjecture que le ${a > 0 ? 'minimum' : 'maximum'} de $f$ est $${p.beta.simplifie().texFraction}$.`
    corr3c += '<br> Pour le démontrer, on utilise la forme donnée dans la consigne.<br>'
    corr3c += `Pour tout réel $x$,<br>

$\\begin{aligned}
&\\left( x ${p.alpha.oppose().simplifie().texFractionSignee} \\right)^2\\geqslant 0\\\\
${a !== 1 ? `\\iff &${p.a.simplifie().texFractionSaufUn}\\left( x ${p.alpha.oppose().simplifie().texFractionSignee} \\right)^2${a > 0 ? '\\geqslant 0' : '\\leqslant 0'}\\\\` : ''}
\\iff &${p.texFormeCanonique}${a > 0 ? '\\geqslant' : '\\leqslant'}${p.beta.simplifie().texFraction}\\\\
\\iff & f(x)${a > 0 ? '\\geqslant' : '\\leqslant'}${p.beta.simplifie().texFraction}
\\end{aligned}$
<br>

   

   Comme $f(${p.alpha.simplifie().texFraction})=${p.a.simplifie().texFractionSaufUn}\\left( ${p.alpha.simplifie().texFraction} ${p.alpha.oppose().simplifie().texFractionSignee} \\right)^2${p.beta.simplifie().texFractionSignee}=
    ${p.beta.simplifie().texFraction}$ alors $f(x)${a > 0 ? '\\geqslant' : '\\leqslant'} f(${p.alpha.simplifie().texFraction})$.
    <br> On en déduit que le ${a > 0 ? 'minimum' : 'maximum'} de $f$ est $${p.beta.simplifie().texFraction}$ et qu'il est atteint en $x= ${p.alpha.simplifie().texFraction}$.`

    const q3d = `Déterminer les coordonnées des points d'intersection entre $\\mathscr{C}_f$ et la droite d'équation $y=${p.c.simplifie().texFraction}$.`
    // `Résoudre l'équation $f(x) = ${p.c.simplifie().texFraction}$. <br>
    // Quelle interprétation graphique peut-on en déduire ?`
    let corr3d = `Les coordonnées des points d'intersection entre $\\mathscr{C}_f$ et la droite d'équation $y=${p.c.simplifie().texFraction}$ sont de la forme
    $(x\\,;\\,${p.c.simplifie().texFraction})$.  <br>
    Pour trouver les abscisses, il faut donc résoudre l'équation $f(x)=${p.c.simplifie().texFraction}$.<br>
    On remarque que $${p.c.simplifie().texFraction}$ est la constante de la forme développée.<br>
    On utilise donc  la forme développée pour résoudre cette équation :`
    corr3d += `<br> $f(x) = ${p.c.simplifie().texFraction} \\iff ${p.tex} = ${p.c.simplifie().texFraction}$`
    corr3d += `<br> $\\phantom{f(x) = ${p.c.simplifie().texFraction}} \\iff ${p.a.simplifie().texFractionSaufUn}x^2 ${p.b.simplifie().texFractionSaufUnSignee}x = 0 $`
    corr3d += `<br> $\\phantom{f(x) = ${p.c.simplifie().texFraction}} \\iff x \\left(${p.a.simplifie().texFractionSaufUn}x ${p.b.simplifie().texFractionSaufUnSignee}\\right) = 0 $`
    corr3d += `<br> $\\phantom{f(x) = ${p.c.simplifie().texFraction}} \\iff x = 0 \\text{\\quad ou \\quad} ${p.a.simplifie().texFractionSaufUn}x ${p.b.simplifie().texFractionSaufUnSignee} = 0 $`
    corr3d += `<br> $\\phantom{f(x) = ${p.c.simplifie().texFraction}} \\iff x = 0 \\text{\\quad ou \\quad} x = ${p.b.oppose().diviseFraction(p.a).simplifie().texFraction} $`
    corr3d += `<br>
    L'équation a deux solutions : $0$ et $${p.b.oppose().diviseFraction(p.a).simplifie().texFraction}$.<br>
    On en déduit que $\\mathscr{C}_f$ et la droite d'équation  $y=${p.c.simplifie().texFraction}$ ont deux points d'intersection : <br>
    $A(0\\,;\\,f(0))$ et
    $B(${p.b.oppose().diviseFraction(p.a).simplifie().texFraction}\\,;\\,f\\left(${p.b.oppose().diviseFraction(p.a).simplifie().texFraction})\\right)$, soit $A(0\\,;\\,${p.c.simplifie().texFraction})$ et
    $B(${p.b.oppose().diviseFraction(p.a).simplifie().texFraction}\\,;\\,${p.c.simplifie().texFraction})$.
    `

    const [sousQuestions, sousCorrections] = [[q3a, q3b, q3c, q3d], [corr3a, corr3b, corr3c, corr3d]]
    // shuffle2tableaux(sousQuestions, sousCorrections)
    for (let i = 0; i < 4; i++) {
      question3 += `${numAlpha(i)} ${sousQuestions[i]}<br><br>`
      correction3 += `${numAlpha(i)} ${sousCorrections[i]}<br><br>`
    }
    this.listeQuestions = [question1, question2, question3]
    this.listeCorrections = [correction1, correction2, correction3]
    listeQuestionsToContenu(this)
  }
}
