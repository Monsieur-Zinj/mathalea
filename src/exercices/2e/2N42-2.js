import { choice, combinaisonListes, shuffle } from '../../lib/outils/arrayOutils'
import Exercice from '../deprecatedExercice.js'
import { listeQuestionsToContenu } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { setReponse } from '../../lib/interactif/gestionInteractif.ts'
export const interactifReady = true
export const interactifType = 'mathLive'
export const titre = 'Exprimer une variable en fonction des autres à  partir de formules mathématiques'
export const dateDePublication = '02/10/2023'
/**
 *
 * @author Gilles Mora
 * 2N42-2
 */
export const uuid = '96bac'
export const ref = '2N42-2'
export const refs = {
  'fr-fr': ['2N42-2'],
  'fr-ch': ['11FA5-4']
}
export default function ExprimerEnFonctionDesAutresFormules () {
  Exercice.call(this)
  this.titre = titre
  this.nbCols = 1
  this.nbColsCorr = 1
  this.spacing = 1
  this.spacingCorr = 1
  this.nbQuestions = 1
  this.sup = 1
  this.nouvelleVersion = function () {
    this.sup = parseInt(this.sup)
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    let typesDeQuestionsDisponibles = []
    if (this.sup === 1) {
      typesDeQuestionsDisponibles = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14])
    } else if (this.sup === 2) {
      typesDeQuestionsDisponibles = shuffle([15, 16, 17, 18, 19, 20, 21, 22])
    } else if (this.sup === 3) {
      typesDeQuestionsDisponibles = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22])
    } // Tous les cas possibles sauf fractions
    const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions)
    for (let i = 0, texte, texteCorr, reponse, cpt = 0, typesDeQuestions, choix1, nomV, choix; i < this.nbQuestions && cpt < 50;) {
      typesDeQuestions = listeTypeDeQuestions[i]
      texteCorr = ''
      switch (typesDeQuestions) {
        case 1: //  côté carré en fonction de son perimètre
          texte = 'Exprimer le côté $c$ d\'un carré  en fonction de son périmètre $P$.<br>'
          reponse = ['c=\\dfrac{P}{4}', '\\dfrac{P}{4}=c']
          texteCorr = `Le périmètre $P$ d'un carré en fonction de son côté $c$ est donné par $P=4\\times c$.<br>
          On isole $c$ dans un membre de l'égalité :<br>
          $\\begin{aligned}
      P&=4\\times c\\\\
      \\dfrac{P}{4}&=c
                 \\end{aligned}$ <br>      
                 Ainsi, $c=\\dfrac{P}{4}$ `
          break
        case 2: // côté triangle équi en fonction de son perimètre
          texte = 'Exprimer le côté $c$ d\'un triangle équilatéral  en fonction de son périmètre $P$.<br>'
          reponse = ['c=\\dfrac{P}{3}', '\\dfrac{P}{3}=c']
          texteCorr = `Le périmètre $P$ d'un triangle équilatéral en fonction de son côté $c$ est donné par $P=3\\times c$.<br>
          On isole $c$ dans un membre de l'égalité :<br>
          $\\begin{aligned}
      P&=3\\times c\\\\
     \\dfrac{P}{3}&=c
     \\end{aligned}$ <br>      
    Ainsi, $c=\\dfrac{P}{3}$ `
          break

        case 3:// rayon cercle en fonction de son perimètre
          texte = 'Exprimer le rayon $r$ d\'un cercle  en fonction de son périmètre $P$.<br>'
          reponse = ['r=\\dfrac{P}{2\\pi}', '\\dfrac{P}{2\\pi}=r', 'r=\\dfrac{1}{2\\pi}\\times P', '\\dfrac{1}{2\\pi}\\times P=r']
          texteCorr = `Le périmètre $P$ d'un cerclce en fonction de son rayon $r$ est donné par $P=2\\pi r$.<br>
          On isole $r$ dans un membre de l'égalité :<br>
           $\\begin{aligned}
 P&=2\\times \\pi \\times r\\\\
  \\dfrac{P}{2\\times \\pi}&=r
 \\end{aligned}$ <br>      
   Ainsi, $r=\\dfrac{P}{2\\times \\pi}$ ou encore $r=\\dfrac{P}{2\\pi}$.`
          break

        case 4:// diamètre cercle en fonction de son perimètre
          texte = 'Exprimer le diamètre $d$ d\'un cercle  en fonction de son périmètre $P$.<br>'
          reponse = ['d=\\dfrac{P}{\\pi}', '\\dfrac{P}{\\pi}=d', 'd=\\dfrac{1}{\\pi}\\times P', '\\dfrac{1}{\\pi}\\times P=d']
          texteCorr = `Le périmètre $P$ d'un cerclce en fonction de son diamètre $d$ est donné par $P=\\pi \\times d$.<br>
          On isole $d$ dans un membre de l'égalité :<br>
          $\\begin{aligned}
     P&=\\pi \\times d\\\\
     \\dfrac{P}{\\pi}&=d
       \\end{aligned}$ <br>      
     Ainsi, $d=\\dfrac{P}{\\pi}$.`
          break
        case 5: // perimètre d'un cercle en fonction de son diamètre
          texte = 'Exprimer le périmètre $P$  d\'un cercle  en fonction de son diamètre $d$.<br>'
          reponse = ['P=\\pi\\times d', '\\pi\\times d=P']
          texteCorr = 'Le périmètre $P$ d\'un cerclce en fonction de son diamètre $d$ est donné par $P=\\pi \\times d$ ou encore $P=\\pi d$.'
          break

        case 6:// perimètre d'un cercle en fonction de son rayon
          texte = 'Exprimer le périmètr $P$  d\'un cercle  en fonction de son rayon $r$.<br>'
          reponse = ['P=2\\pi\\times r', '2\\pi\\times r=P']
          texteCorr = 'Le périmètre $P$ d\'un cerclce en fonction de son rayon $r$ est donné par $P=2\\pi\\times r$ ou plus simplement $P=2\\pi r$.'
          break

        case 7 :// perimètre d'un cercle en fonction de son diamètre
          texte = 'Exprimer le côté $c$ d\'un carré  en fonction de son aire $A$.<br>'
          reponse = ['c=\\sqrt{A}', '\\sqrt{A}=c']
          texteCorr = `L'aire $A$ d'un carré en fonction de son côté $c$ est donnée par $A=c^2$.<br>
          On isole $c$ dans un membre de l'égalité :<br>
  $\\begin{aligned}
  A&=c^2\\\\
  \\sqrt{A}&=c
  \\end{aligned}$ <br>      
  Ainsi, $c=\\sqrt{A}$.`
          break

        case 8:// diamètre d'un cercle en fonction de son perimètre
          texte = 'Exprimer le diamètre $d$ d\'un cercle  en fonction de son périmètre $P$.<br>'
          reponse = ['d=\\dfrac{P}{\\pi}', '\\dfrac{P}{\\pi}=d', 'd=\\dfrac{2P}{2\\pi}', '\\dfrac{2P}{2\\pi}=d']
          texteCorr = `Le périmètre d'un cercle en fonction de son rayon $r$ est donné par $P=2\\times \\pi\\times r$.<br>
    Or $r=\\dfrac{d}{2}$, donc le périmètre d'un cercle en fonction de son diamètre $d$ est donné par $P=2\\times \\pi\\times \\dfrac{d}{2}$.<br>
    On isole $d$ dans un membre de l'égalité :<br>
    $\\begin{aligned}
    P&=2\\times \\pi\\times \\dfrac{d}{2}\\\\
    P&= \\pi\\times d\\\\
    \\dfrac{P}{\\pi}&=d
    \\end{aligned}$ <br>      
    Ainsi, $d=\\dfrac{P}{\\pi}$.`
          break

        case 9:// rayon disque en fonction de son aire
          texte = 'Exprimer le rayon $r$ d\'un disque en fonction de son aire $A$.<br>'
          reponse = ['r=\\sqrt{\\dfrac{A}{\\pi}}', '\\sqrt{\\dfrac{A}{\\pi}}=r', 'r=\\dfrac{\\sqrt{A}}{\\sqrt{\\pi}}', '\\dfrac{\\sqrt{A}}{\\sqrt{\\pi}}=r']
          texteCorr = `L'aire $A$ d'un disque en fonction de son rayon $r$ est donnée par $A=\\pi\\times r^2$.<br>
          On isole $r$ dans un membre de l'égalité :<br>
          $\\begin{aligned}
    A&=\\pi\\times r^2\\\\
    \\dfrac{A}{\\pi}&=r^2\\\\
    \\sqrt{ \\dfrac{A}{\\pi}}&=r
    \\end{aligned}$ <br>  
    Ainsi, $r=\\sqrt{\\dfrac{A}{\\pi}}$ ou encore $r=\\dfrac{\\sqrt{A}}{\\sqrt{\\pi}}$.`
          break

        case 10:// diamètre disque en fonction de son aire
          texte = 'Exprimer le diamètre $d$ d\'un disque en fonction de son aire $A$.<br>'
          reponse = ['d=\\sqrt{\\dfrac{4\\times A}{\\pi}}', '\\sqrt{\\dfrac{4\\times A}{\\pi}}',
            'd=\\dfrac{2\\sqrt{A}}{\\sqrt{\\pi}}', '\\dfrac{2\\sqrt{A}}{\\sqrt{\\pi}}=d',
            'd=2\\times\\sqrt{\\dfrac{A}{\\pi}}', 'd=2\\times\\sqrt{\\dfrac{A}{\\pi}}=d'
          ]
          texteCorr = `L'aire $A$ d'un disque en fonction de son rayon $r$ est donnée par $A=\\pi\\times r^2$.<br>
      Comme $r=\\dfrac{d}{2}$, alors $A=\\pi\\times \\left(\\dfrac{d}{2}\\right)^2$.<br>
      On isole $d$ dans un membre de l'égalité :<br>
      $\\begin{aligned}
      A&=\\pi\\times \\left(\\dfrac{d}{2}\\right)^2\\\\
      A&=\\pi \\times \\dfrac{d^2}{4}\\\\
     4\\times A &=\\pi \\times d^2\\\\
    \\dfrac{4\\times A}{\\pi} &= d^2\\\\
    \\sqrt{\\dfrac{4\\times A}{\\pi}} &= d
      \\end{aligned}$ <br>  
      Ainsi, $d=\\sqrt{\\dfrac{4\\times A}{\\pi}}$ ou encore $d=2\\dfrac{\\sqrt{A}}{\\sqrt{\\pi}}$.`
          break

        case 11:// longueur/largeur rectangle en fonction de son périmètre
          choix1 = choice([['longueur', 'L', 'largeur', 'l'], ['largeur', 'l', 'longueur', 'L']])
          texte = `Exprimer la ${choix1[0]} $${choix1[1]}$ d'un rectangle en fonction de son périmètre $P$ et de sa ${choix1[2]} $${choix1[3]}$.<br>`
          reponse = [`${choix1[1]}=\\dfrac{P-2${choix1[3]}}{2}`, `\\dfrac{P-2${choix1[3]}}{2}=${choix1[1]}`, `${choix1[1]}=\\dfrac{P}{2}-${choix1[3]}`, `\\dfrac{P}{2}-${choix1[3]}=${choix1[1]}`]
          texteCorr = `Le périmètre $P$ d'un rectangle en fonction de sa longueur et de largeur est donné par $P=2L+2l$.<br>
          On isole $${choix1[1]}$ dans un membre de l'égalité :<br>
          $\\begin{aligned}
    P&=2L+2l\\\\
   P-2${choix1[3]}&=2${choix1[1]}\\\\
    \\dfrac{P-2${choix1[3]}}{2}&=${choix1[1]}
    \\end{aligned}$ <br>  
    Ainsi, $${choix1[1]}=\\dfrac{P-2${choix1[3]}}{2}$ ou, par exemple $${choix1[1]}=\\dfrac{P}{2}-${choix1[3]}$.`
          break

        case 12:// longueur/largeur rectangle en fonction de son Aire
          choix1 = choice([['longueur', 'L', 'largeur', 'l'], ['largeur', 'l', 'longueur', 'L']])
          texte = `Exprimer la ${choix1[0]} $${choix1[1]}$ d'un rectangle en fonction de son aire $A$ et de sa ${choix1[2]} $${choix1[3]}$.<br>`
          reponse = [`${choix1[1]}=\\dfrac{A}{${choix1[3]}}`, `\\dfrac{A}{${choix1[3]}}=${choix1[1]}`]
          texteCorr = `L'aire $A$ d'un rectangle en fonction de sa longueur et de largeur est donnée par $A=L\\times l$.<br>
          On isole $${choix1[1]}$ dans un membre de l'égalité :<br>
          $\\begin{aligned}
A&=L\\times l\\\\
\\dfrac{A}{${choix1[3]}}&=${choix1[1]}\\\\
\\end{aligned}$ <br>  
Ainsi, $${choix1[1]}=\\dfrac{A}{${choix1[3]}}$.`
          break

        case 13:// Diamètre en fonction du rayon
          texte = 'Exprimer le diamètre $d$ d\'un cercle  en fonction de son rayon $r$.<br>'
          reponse = ['d=2\\times r', '2\\times r=d']
          texteCorr = `Le diamètre d'un cercle est le double de son rayon. <br>
  Ainsi, $d=2\\times r$ ou encore $d=2r$.`
          break

        case 14:// rayon en fonction du diamètre
          texte = 'Exprimer le rayon $r$ d\'un cercle  en fonction de son diamètre $d$.<br>'
          reponse = ['r=\\dfrac{d}{2}', '\\dfrac{d}{2}=r', 'r=\\dfrac{1}{2}\\times d', '\\dfrac{1}{2}\\times d=r', 'r=0.5\\times d', '0.5 \\times d=r']
          texteCorr = `Le diamètre d'un cercle est le double de son rayon, donc le rayon est la moitié du diamètre : <br>
   Ainsi,  $r=\\dfrac{d}{2}$.`

          break
          // avec les formules* *************************************************************************************** */
        case 15 : // aire triangle  : hauteur ou base en fonction des autres
          choix1 = choice([['hauteur', 'h', 'base', 'B'], ['Base', 'B', 'hauteur', 'h']])
          texte = `L'aire $A$ d'un triangle est donnée par : $A=\\dfrac{B\\times h}{2}$, avec $B$ la longueur d'un côté et $h$ la hauteur relative à ce côté.<br>
 Exprimer $${choix1[1]}$ en fonction de $A$ et de $${choix1[3]}$.<br>`
          reponse = [`${choix1[1]}=\\dfrac{2\\times A}{${choix1[3]}}`, `\\dfrac{2\\times A}{${choix1[3]}}=${choix1[1]}`,
    `${choix1[1]}=2\\times\\dfrac{A}{${choix1[3]}}`, `2\\times\\dfrac{A}{${choix1[3]}}=${choix1[1]}`]
          texteCorr = `On isole $${choix1[1]}$ dans un membre de l'égalité :<br>
       $\\begin{aligned}
      A&=\\dfrac{B\\times h}{2}\\\\
      A\\times 2&=B\\times h\\\\
      \\dfrac{A\\times 2}{${choix1[3]}}&= ${choix1[1]}
                     \\end{aligned}$
      <br> 
     Une expression de  $${choix1[1]}$ en fonction de $A$ et de $${choix1[3]}$ est $${choix1[1]}=\\dfrac{A\\times 2}{${choix1[3]}}$ ou plus simplement $${choix1[1]}=\\dfrac{2A}{${choix1[3]}}$.`
          break

        case 16: // aire trapèze  : petite base ou grande base en fonction des autres
          choix1 = choice([['b', 'B'], ['B', 'b']])
          texte = `L'aire $A$ d'un trapèze est donnée par : $A=\\dfrac{(b+B)\\times h}{2}$, avec $B$ la longueur de la grande base, $b$ la longueur de la petite base et  $h$ la hauteur du trapèze.<br>
Exprimer $${choix1[0]}$ en fonction de $A$, de $${choix1[1]}$ et de $h$.<br>`
          reponse = [`${choix1[0]}=2\\times\\dfrac{A}{h}-${choix1[1]}`, `2\\times\\dfrac{A}{h}-${choix1[1]}=${choix1[0]}`,
`${choix1[0]}=\\dfrac{2\\times A}{h}-${choix1[1]}`, `\\dfrac{2\\times A}{h}-${choix1[1]}=${choix1[0]}`,
`${choix1[0]}=\\dfrac{2\\times A-${choix1[1]}\\times h}{h}`, `\\dfrac{2\\times A-${choix1[1]}\\times h}{h}=${choix1[0]}`]
          texteCorr = `On isole $${choix1[0]}$ dans un membre de l'égalité :<br>
    $\\begin{aligned}
   A&=\\dfrac{(b+B)\\times h}{2}\\\\
  2\\times A&=(b+B)\\times h\\\\
  \\dfrac{2A}{h}&=b+B\\\\
  \\dfrac{2A}{h}-${choix1[1]}   &=${choix1[0]}\\end{aligned}$
     <br> 
    
 Une expression de  $${choix1[0]}$ en fonction de $A$, de  $${choix1[1]}$ et de $h$ est $${choix1[0]}=\\dfrac{2A}{h}-${choix1[1]}$.`
          break

        case 17:// aire trapèze  : hauteur en fonction des autres
          texte = `L'aire $A$ d'un trapèze est donnée par : $A=\\dfrac{(b+B)\\times h}{2}$, avec $B$ la longueur de la grande base, $b$ la longueur de la petite base et  $h$ la hauteur du trapèze.<br>
Exprimer $h$ en fonction de $A$, de $B$ et de $b$.<br>`
          reponse = ['h=\\dfrac{2\\times A}{B+b}', '\\dfrac{2\\times A}{B+b}=h',
            'h=2\\times \\dfrac{A}{B+b}', '2\\times \\dfrac{A}{B+b}=h']
          texteCorr = `On isole $h$ dans un membre de l'égalité :<br>
 $\\begin{aligned}
  A&=\\dfrac{(b+B)\\times h}{2}\\\\
  2\\times A&=(b+B)\\times h\\\\
  \\dfrac{2A}{b+B}&=h
  \\end{aligned}$
     <br> 
                 
  Une expression de  $h$ en fonction de $A$, de  $B$ et de $b$ est $h= \\dfrac{2A}{b+B}$.`
          break

        case 18:// moyenne arithmétique
          choix1 = choice([['a', 'b'], ['b', 'a']])
          texte = `La moyenne arithmétique de deux nombres $a$ et $b$ est le nombre $m$ défini par  : 
      $m=\\dfrac{a+b}{2}$.<br>
     Exprimer $${choix1[0]}$ en fonction de $m$ et de $${choix1[1]}$.<br>`
          reponse = [`${choix1[0]}=2\\times m - ${choix1[1]}`, `2\\times m - ${choix1[1]}=${choix1[0]}`
          ]
          texteCorr = `On isole $${choix1[0]}$ dans un membre de l'égalité :<br>
         $\\begin{aligned}
        m&=\\dfrac{a+b}{2}\\\\
       2\\times m&=a+b\\\\
       2\\times m-${choix1[1]}&=${choix1[0]}\\end{aligned}$
          <br> 
         
      Une expression de  $${choix1[0]}$ en fonction de $m$ et de $${choix1[1]}$ est $${choix1[0]}=2m-${choix1[1]}$.`
          break

        case 19:// moyenne géométrique
          choix1 = choice([['a', 'b'], ['b', 'a']])
          texte = `La moyenne géométrique de deux nombres non nuls $a$ et $b$ (de même signe) est le nombre $m$ défini par  : 
      $m=\\sqrt{a\\times b}$.<br>
     Exprimer $${choix1[0]}$ en fonction de $m$ et de $${choix1[1]}$.<br>`
          reponse = [`${choix1[0]}=\\dfrac{m^2}{${choix1[1]}}`, `\\dfrac{m^2}{${choix1[1]}}=${choix1[0]}`,
          `${choix1[0]}=\\dfrac{1}{${choix1[1]}}\\times m^2`, `\\dfrac{1}{${choix1[1]}}\\times m^2=${choix1[0]}`
          ]
          texteCorr = `On isole $${choix1[0]}$ dans un membre de l'égalité :<br>
         $\\begin{aligned}
        m&=\\sqrt{a\\times b}\\\\
        m^2&=a\\times b\\\\
       \\dfrac{m^2}{${choix1[1]}}&=${choix1[0]}\\end{aligned}$
          <br> 
         
      Une expression de  $${choix1[0]}$ en fonction de $m$ et de $${choix1[1]}$ est  $\\dfrac{m^2}{${choix1[1]}}$.`
          break

        case 20:// moyenne harmonique
          choix1 = choice([['a', 'b'], ['b', 'a']])
          texte = `La moyenne harmonique de deux nombres non nuls $a$ et $b$  est le nombre $h$ défini par  : 
      $\\dfrac{1}{h}=\\dfrac{1}{2}\\left(\\dfrac{1}{a}+\\dfrac{1}{b}\\right)$.<br>
     Exprimer $${choix1[0]}$ en fonction de $h$ et de $${choix1[1]}$.<br>`
          reponse = [`${choix1[0]}=\\dfrac{1}{\\dfrac{2}{h}-\\dfrac{1}{${choix1[1]}}}`, `\\dfrac{1}{\\dfrac{2}{h}-\\dfrac{1}{${choix1[1]}}}=${choix1[0]}`,
          `${choix1[0]}=\\dfrac{${choix1[1]}\\times h}{2\\times ${choix1[1]}-h}`, `\\dfrac{${choix1[1]}\\times h}{2\\times ${choix1[1]}-h}=${choix1[0]}`,
          `${choix1[0]}=\\dfrac{1}{\\dfrac{2\\times ${choix1[1]}-h}{${choix1[1]}\\times h}}`, `\\dfrac{1}{\\dfrac{2\\times ${choix1[1]}-h}{${choix1[1]}\\times h}}=${choix1[0]}`
          ]
          texteCorr = `On isole $${choix1[0]}$ dans un membre de l'égalité :<br>
         $\\begin{aligned}
         \\dfrac{1}{h}&=\\dfrac{1}{2}\\left(\\dfrac{1}{a}+\\dfrac{1}{b}\\right)\\\\
         \\dfrac{2}{h}&=\\dfrac{1}{a}+\\dfrac{1}{b}\\\\
         \\dfrac{2}{h}-\\dfrac{1}{${choix1[1]}}&=\\dfrac{1}{${choix1[0]}}\\\\
       \\dfrac{1}{\\dfrac{2}{h}-\\dfrac{1}{${choix1[1]}}}&=${choix1[0]}\\\\
       \\dfrac{1}{\\dfrac{2${choix1[1]}}{${choix1[1]}h}-\\dfrac{h}{${choix1[1]}h}}&=${choix1[0]}\\\\
       \\dfrac{1}{\\dfrac{2${choix1[1]}-h}{${choix1[1]}h}}&=${choix1[0]}\\\\
       \\dfrac{${choix1[1]}h}{2${choix1[1]}-h}&=${choix1[0]}
       \\end{aligned}$
          <br> 
         
      Une expression de  $${choix1[0]}$ en fonction de $h$ et de $${choix1[1]}$ est  $${choix1[0]}=\\dfrac{${choix1[1]}h}{2${choix1[1]}-h}$.`
          break

        case 21:// taux d'évolution F
          texte = `Le taux d'évolution  entre deux valeurs $I$ et  $F$ est le nombre $T$ défini par  : 
      $T=\\dfrac{F-I}{I}$.<br>
     Exprimer $F$ en fonction de $I$ et de $T$.<br>`
          reponse = ['F=T\\times I+I', 'T\\times I+I=F',
            'F=I\\times(T+1)', 'I\\times(T+1)=F']

          texteCorr = `On isole $F$ dans un membre de l'égalité :<br>
         $\\begin{aligned}
         T&=\\dfrac{F-I}{I}\\\\
         T\\times I&=F-I\\\\
         T\\times I+I&=F
       \\end{aligned}$
          <br> 
         
      Une expression de  $F$ en fonction de $T$ et de $I$ est  $F=T\\times I +I$ ou encore $F=I(T+1)$.`
          break

        case 22:// taux d'évolution I
          texte = `Le taux d'évolution  entre deux valeurs $I$ et  $F$ est le nombre $T$ défini par  : 
      $T=\\dfrac{F-I}{I}$.<br>
     Exprimer $I$ en fonction de $F$ et de $T$.<br>`
          reponse = ['I=\\dfrac{F}{T+1}', '\\dfrac{F}{T+1}=I']

          texteCorr = `On isole $I$ dans un membre de l'égalité :<br>
         $\\begin{aligned}
         T&=\\dfrac{F-I}{I}\\\\
         T\\times I+I&=F\\\\
         I(T+1)&=F\\\\
         I&=\\dfrac{F}{T+1}
       \\end{aligned}$
          <br> 
         
      Une expression de  $I$ en fonction de $T$ et de $F$ est  $I=\\dfrac{F}{T+1}$.`
          break
      }
      texte += ajouteChampTexteMathLive(this, i)
      setReponse(this, i, reponse)
      if (this.questionJamaisPosee(i, typesDeQuestions, choix, nomV)) {
        // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = ['Cas possibles', 3, '1 : Sans rappel de formule\n 2 : Avec rappel d\'une formule\n 3 : Mélange ']
}
