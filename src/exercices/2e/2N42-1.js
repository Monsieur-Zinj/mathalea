import { choice, combinaisonListes, shuffle } from '../../lib/outils/arrayOutils'
import Exercice from '../deprecatedExercice.js'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { setReponse } from '../../lib/interactif/gestionInteractif'

export const interactifReady = true
export const interactifType = 'mathLive'
export const titre = 'Exprimer une variable en fonction des autres'
export const dateDePublication = '25/09/2023'
/**
 *
 * @author Gilles Mora
 * 2N42-1
 */
export const uuid = 'ef686'
export const ref = '2N42-1'
export const refs = {
  'fr-fr': ['2N42-1'],
  'fr-ch': ['11FA5-3']
}
export default function ExprimerEnFonctionDesAutres () {
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
      typesDeQuestionsDisponibles = [1]
    } else if (this.sup === 2) {
      typesDeQuestionsDisponibles = [2]
    } else if (this.sup === 3) {
      typesDeQuestionsDisponibles = [3]
    } else {
      typesDeQuestionsDisponibles = [1, 2, 3]
    } // Tous les cas possibles sauf fractions

    const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions)
    for (let i = 0, texte, texteCorr, reponse, cpt = 0, typesDeQuestions, intro, nomVariables, nomV, choix; i < this.nbQuestions && cpt < 50;) {
      typesDeQuestions = listeTypeDeQuestions[i]

      texteCorr = ''
      switch (typesDeQuestions) {
        case 1:
          nomVariables = [
            shuffle(['a', 'b', 'c']), shuffle(['x', 'y', 'z']), shuffle(['u', 'v', 'w']), shuffle(['A', 'B', 'C']),
            shuffle(['R', 'S', 'T']), shuffle(['I', 'J', 'K']), shuffle(['c', 'd', 'e']),
            shuffle(['K', 'L', 'M']), shuffle(['r', 's', 't']), shuffle(['U', 'V', 'W'])
          ]
          nomV = choice(nomVariables)
          choix = randint(1, 5)
          if (choix === 1) { // a=b-c on cherche b
            texte = `Soient $${nomV[0]}$, $${nomV[1]}$ et $${nomV[2]}$ trois nombres vérifiant l'égalité suivante : 
          $${nomV[0]}=${nomV[1]}-${nomV[2]}$.<br>
          Exprimer $${nomV[1]}$ en fonction de $${nomV[0]}$ et $${nomV[2]}$.`
            reponse = [`${nomV[1]}=${nomV[0]}+${nomV[2]}`, `${nomV[0]}+${nomV[2]}=${nomV[1]}`]
            texteCorr = `On isole $${nomV[1]}$ dans un membre de l'égalité :<br>
            $\\begin{aligned}
            ${nomV[0]}&=${nomV[1]}-${nomV[2]}\\\\
            ${nomV[0]}+${miseEnEvidence(nomV[2])}&=${nomV[1]}-${nomV[2]}+${miseEnEvidence(nomV[2])}\\\\
            ${nomV[0]}+${nomV[2]}&= ${nomV[1]}
                           \\end{aligned}$
                       <br> Une expression de $${nomV[1]}$ en fonction de $${nomV[0]}$ et $${nomV[2]}$ est $${nomV[1]}= ${nomV[0]}+${nomV[2]}$.`
          }
          if (choix === 2) { // a=b+c on cherche b
            texte = `Soient $${nomV[0]}$, $${nomV[1]}$ et $${nomV[2]}$ trois nombres vérifiant l'égalité suivante :
             $${nomV[0]}=${nomV[1]}+${nomV[2]}$.<br>
            Exprimer $${nomV[1]}$ en fonction de $${nomV[0]}$ et $${nomV[2]}$.`
            reponse = [`${nomV[1]}=${nomV[0]}-${nomV[2]}`, `${nomV[0]}-${nomV[2]}=${nomV[1]}`]
            texteCorr = `On isole $${nomV[1]}$ dans un membre de l'égalité :<br>
              $\\begin{aligned}
              ${nomV[0]}&=${nomV[1]}+${nomV[2]}\\\\
              ${nomV[0]}-${miseEnEvidence(nomV[2])}&=${nomV[1]}-${nomV[2]}-${miseEnEvidence(nomV[2])}\\\\
              ${nomV[0]}-${nomV[2]}&= ${nomV[1]}
                             \\end{aligned}$
                         <br> Une expression de $${nomV[1]}$ en fonction de $${nomV[0]}$ et $${nomV[2]}$ est $${nomV[1]}= ${nomV[0]}-${nomV[2]}$.`
          }

          if (choix === 3) { // a=b/c on cherche b
            texte = `Soient $${nomV[0]}$, $${nomV[1]}$ et $${nomV[2]}$ trois nombres non nuls vérifiant l'égalité suivante : 
  $${nomV[0]}=\\dfrac{${nomV[1]}}{${nomV[2]}}$.<br>
                            Exprimer $${nomV[1]}$ en fonction de $${nomV[0]}$ et $${nomV[2]}$.`
            reponse = [`${nomV[1]}=${nomV[0]}\\times ${nomV[2]}`, `${nomV[0]}\\times ${nomV[2]}=${nomV[1]}`]
            texteCorr = `On isole $${nomV[1]}$ dans un membre de l'égalité :<br>
                              $\\begin{aligned}
                              ${nomV[0]}&=\\dfrac{${nomV[1]}}{${nomV[2]}}\\\\
                              ${nomV[0]}\\times ${nomV[2]}&=${nomV[1]}                              
                                             \\end{aligned}$
                                         <br> Une expression de $${nomV[1]}$ en fonction de $${nomV[0]}$ et $${nomV[2]}$ est $${nomV[1]}=${nomV[0]}\\times ${nomV[2]}$.`
          }

          if (choix === 4) { // a=b/c on cherche c
            texte = `Soient $${nomV[0]}$, $${nomV[1]}$ et $${nomV[2]}$ trois nombres non nuls vérifiant l'égalité suivante :
  $${nomV[0]}=\\dfrac{${nomV[1]}}{${nomV[2]}}$.<br>
Exprimer $${nomV[2]}$ en fonction de $${nomV[0]}$ et $${nomV[1]}$.`
            reponse = [`${nomV[2]}=\\dfrac{${nomV[1]}}{${nomV[0]}}`, `\\dfrac{${nomV[1]}}{${nomV[0]}}=${nomV[2]}`]
            texteCorr = `On isole $${nomV[2]}$ dans un membre de l'égalité :<br>
$\\begin{aligned}   
 ${nomV[0]}&=\\dfrac{${nomV[1]}}{${nomV[2]}}\\\\
 ${nomV[0]}\\times ${nomV[2]}&=${nomV[1]} \\\\
 ${nomV[2]}&=\\dfrac{${nomV[1]}}{${nomV[0]}}                        
 \\end{aligned}$
<br> Une expression de $${nomV[2]}$ en fonction de $${nomV[0]}$ et $${nomV[1]}$ est $${nomV[2]}=\\dfrac{${nomV[1]}}{${nomV[0]}}$.`
          }

          if (choix === 5) { // a=b*c on cherche b
            texte = `Soient $${nomV[0]}$, $${nomV[1]}$ et $${nomV[2]}$ trois nombres non nuls vérifiant l'égalité suivante :
  $${nomV[0]}=${nomV[1]}\\times ${nomV[2]}$.<br>
  Exprimer $${nomV[1]}$ en fonction de $${nomV[0]}$ et $${nomV[2]}$.`
            reponse = [`${nomV[1]}=\\dfrac{${nomV[0]}}{${nomV[2]}}`, `\\dfrac{${nomV[0]}}{${nomV[2]}}}=${nomV[1]}`]
            texteCorr = `On isole $${nomV[1]}$ dans un membre de l'égalité :<br>
    $\\begin{aligned}
    ${nomV[0]}&=${nomV[1]}\\times ${nomV[2]}\\\\
    \\dfrac{${nomV[0]}}{${nomV[2]}}&=${nomV[1]}
                   \\end{aligned}$
               <br> Une expression de $${nomV[1]}$ en fonction de $${nomV[0]}$ et $${nomV[2]}$ est $${nomV[1]}= \\dfrac{${nomV[0]}}{${nomV[2]}}$.`
          }
          break

        case 2:
          nomVariables = [
            shuffle(['a', 'b', 'c', 'e']), shuffle(['x', 'y', 'z', 'w']), shuffle(['u', 'v', 'w', 't']), shuffle(['A', 'B', 'C', 'E']),
            shuffle(['R', 'S', 'T', 'U']), shuffle(['I', 'J', 'K', 'L']), shuffle(['c', 'g', 'e', 'f']),
            shuffle(['c', 'm', 'f', 'e']), shuffle(['K', 'L', 'M', 'N']), shuffle(['r', 's', 't', 'u']), shuffle(['U', 'V', 'W', 'X'])
          ]
          nomV = choice(nomVariables)
          choix = randint(1, 12)
          if (choix === 1) { // a=b-cd on cherche  c
            intro = `Soient $${nomV[0]}$, $${nomV[1]}$, $${nomV[2]}$ et $${nomV[3]}$  quatre nombres (avec $${nomV[3]}$ non nul) vérifiant l'égalité suivante :`
            texte = `${intro}` + ` $${nomV[0]}=${nomV[1]}-${nomV[2]}${nomV[3]}$.<br>
   Exprimer $${nomV[2]}$ en fonction de $${nomV[0]}$, $${nomV[1]}$ et  $${nomV[3]}$.`
            reponse = [`${nomV[2]}=\\dfrac{${nomV[1]}-${nomV[0]}}{${nomV[3]}}`, `\\dfrac{${nomV[1]}-${nomV[0]}}{${nomV[3]}}=${nomV[2]}`]
            texteCorr = `On isole $${nomV[2]}$ dans un membre de l'égalité :<br>
       $\\begin{aligned}
      ${nomV[0]}&=${nomV[1]}-${nomV[2]}${nomV[3]}\\\\
      ${nomV[0]}-${nomV[1]}&=-${nomV[2]}${nomV[3]}\\\\
       -${nomV[0]}+${nomV[1]}&= ${nomV[2]}${nomV[3]}\\\\
       \\dfrac{-${nomV[0]}+${nomV[1]}}{${nomV[3]}}&=${nomV[2]}
                 \\end{aligned}$
      <br> Une expression de $${nomV[2]}$ en fonction de $${nomV[0]}$, $${nomV[1]}$ et  $${nomV[3]}$ est $${nomV[2]}=  \\dfrac{${nomV[1]}-${nomV[0]}}{${nomV[3]}}$.`
          }
          if (choix === 2) { // a=b-cd on cherche  d
            intro = `Soient $${nomV[0]}$, $${nomV[1]}$, $${nomV[2]}$ et $${nomV[3]}$  quatre nombres (avec $${nomV[2]}$ non nul) vérifiant l'égalité suivante :`
            texte = `${intro}` + ` $${nomV[0]}=${nomV[1]}-${nomV[2]}${nomV[3]}$.<br>
          Exprimer $${nomV[3]}$ en fonction de $${nomV[0]}$, $${nomV[1]}$ et  $${nomV[2]}$.`
            reponse = [`${nomV[3]}=\\dfrac{${nomV[1]}-${nomV[0]}}{${nomV[2]}}`, `\\dfrac{${nomV[1]}-${nomV[0]}}{${nomV[2]}}=${nomV[3]}`]
            texteCorr = `On isole $${nomV[3]}$ dans un membre de l'égalité :<br>
              $\\begin{aligned}
             ${nomV[0]}&=${nomV[1]}-${nomV[2]}${nomV[3]}\\\\
             ${nomV[0]}-${nomV[1]}&=-${nomV[2]}${nomV[3]}\\\\
              -${nomV[0]}+${nomV[1]}&= ${nomV[2]}${nomV[3]}\\\\
              \\dfrac{-${nomV[0]}+${nomV[1]}}{${nomV[2]}}&=${nomV[3]}
                        \\end{aligned}$
      <br> Une expression de $${nomV[3]}$ en fonction de $${nomV[0]}$, $${nomV[1]}$ et  $${nomV[2]}$ est $${nomV[3]}=  \\dfrac{${nomV[1]}-${nomV[0]}}{${nomV[2]}}$.`
          }

          if (choix === 3) { // a=b-cd on cherche  b
            intro = `Soient $${nomV[0]}$, $${nomV[1]}$, $${nomV[2]}$ et $${nomV[3]}$  quatre nombres vérifiant l'égalité suivante :`
            texte = `${intro}` + ` $${nomV[0]}=${nomV[1]}-${nomV[2]}${nomV[3]}$.<br>
     Exprimer $${nomV[1]}$ en fonction de $${nomV[0]}$, $${nomV[2]}$ et  $${nomV[3]}$.`
            reponse = [`${nomV[1]}=${nomV[0]}+${nomV[2]}${nomV[3]}`, `${nomV[0]}+${nomV[2]}${nomV[3]}=${nomV[1]}`]
            texteCorr = `On isole $${nomV[1]}$ dans un membre de l'égalité :<br> 
         $\\begin{aligned}
        ${nomV[0]}&=${nomV[1]}-${nomV[2]}${nomV[3]}\\\\
        ${nomV[0]}+${nomV[2]}${nomV[3]}&=${nomV[1]}
                   \\end{aligned}$
 <br> Une expression de $${nomV[1]}$ en fonction de $${nomV[0]}$, $${nomV[2]}$ et  $${nomV[2]}$ est $${nomV[1]}= ${nomV[0]}+${nomV[2]}${nomV[3]}$.`
          }

          if (choix === 4) { // a=bc+d on cherche  b
            intro = `Soient $${nomV[0]}$, $${nomV[1]}$, $${nomV[2]}$ et $${nomV[3]}$  quatre nombres (avec $${nomV[2]}$ non nul) vérifiant l'égalité suivante :`
            texte = `${intro}` + `  $${nomV[0]}=${nomV[1]}${nomV[2]}+${nomV[3]}$.<br>
    Exprimer $${nomV[1]}$ en fonction de $${nomV[0]}$, $${nomV[2]}$ et  $${nomV[3]}$.`
            reponse = [`${nomV[1]}=\\dfrac{${nomV[0]}-${nomV[3]}}{${nomV[2]}}`, `\\dfrac{${nomV[0]}-${nomV[3]}}{${nomV[2]}}=${nomV[1]}`]
            texteCorr = `On isole $${nomV[1]}$ dans un membre de l'égalité :<br> 
        $\\begin{aligned}
       ${nomV[0]}&=${nomV[1]}${nomV[2]}+${nomV[3]}\\\\
       ${nomV[0]}-${nomV[3]}&=${nomV[1]}${nomV[2]}\\\\
        \\dfrac{${nomV[0]}-${nomV[3]}}{${nomV[2]}}&=${nomV[1]}
                  \\end{aligned}$
       <br> Une expression de $${nomV[1]}$ en fonction de $${nomV[0]}$, $${nomV[2]}$ et  $${nomV[3]}$ est $${nomV[1]}=  \\dfrac{${nomV[0]}-${nomV[3]}}{${nomV[2]}}$.`
          }
          if (choix === 5) { // a=bc+d on cherche  d
            intro = `Soient $${nomV[0]}$, $${nomV[1]}$, $${nomV[2]}$ et $${nomV[3]}$  quatre nombres vérifiant l'égalité suivante :`
            texte = `${intro}` + `  $${nomV[0]}=${nomV[1]}${nomV[2]}+${nomV[3]}$.<br>
     Exprimer $${nomV[3]}$ en fonction de $${nomV[0]}$, $${nomV[1]}$ et  $${nomV[2]}$.`
            reponse = [`${nomV[3]}=${nomV[0]}-${nomV[1]}${nomV[2]}`, `${nomV[0]}-${nomV[1]}${nomV[2]}=${nomV[3]}`]
            texteCorr = `On isole $${nomV[3]}$ dans un membre de l'égalité :<br> 
 $\\begin{aligned}
 ${nomV[0]}&=${nomV[1]}${nomV[2]}+${nomV[3]}\\\\
  ${nomV[0]}-${nomV[1]}${nomV[2]}&=${nomV[3]}
 \\end{aligned}$
   <br> Une expression de $${nomV[3]}$ en fonction de $${nomV[0]}$, $${nomV[1]}$ et  $${nomV[2]}$ est $${nomV[3]}=  ${nomV[0]}-${nomV[1]}${nomV[2]}$.`
          }

          if (choix === 6) { // a=(b+c)/d on cherche  b
            intro = `Soient $${nomV[0]}$, $${nomV[1]}$, $${nomV[2]}$ et $${nomV[3]}$  quatre nombres (avec $${nomV[3]}$ non nul) vérifiant l'égalité suivante :`
            texte = `${intro}` + `  $${nomV[0]}=\\dfrac{${nomV[1]}+${nomV[2]}}{${nomV[3]}}$.<br>
  Exprimer $${nomV[1]}$ en fonction de $${nomV[0]}$, $${nomV[2]}$ et  $${nomV[3]}$.`
            reponse = [`${nomV[1]}=${nomV[3]}\\times ${nomV[0]}-${nomV[2]}`, `${nomV[3]}\\times ${nomV[0]}-${nomV[2]}=${nomV[1]}`]
            texteCorr = `On isole $${nomV[1]}$ dans un membre de l'égalité :<br> 
  $\\begin{aligned}
 ${nomV[0]}&=\\dfrac{${nomV[1]}+${nomV[2]}}{${nomV[3]}}\\\\
 ${nomV[0]}\\times ${nomV[3]}&=${nomV[1]}+${nomV[2]}\\\\
 ${nomV[0]}\\times ${nomV[3]}-${nomV[2]}&=${nomV[1]}
 \\end{aligned}$
    <br> Une expression de $${nomV[1]}$ en fonction de $${nomV[0]}$, $${nomV[2]}$ et  $${nomV[3]}$ est $${nomV[1]}= ${nomV[3]}\\times ${nomV[0]}-${nomV[2]}$.`
          }

          if (choix === 7) { // a=(b+c)/d on cherche  c
            intro = `Soient $${nomV[0]}$, $${nomV[1]}$, $${nomV[2]}$ et $${nomV[3]}$ quatre nombres (avec $${nomV[3]}$ non nul) vérifiant l'égalité suivante :`
            texte = `${intro}` + `  $${nomV[0]}=\\dfrac{${nomV[1]}+${nomV[2]}}{${nomV[3]}}$.<br>
  Exprimer $${nomV[2]}$ en fonction de $${nomV[0]}$, $${nomV[1]}$ et  $${nomV[3]}$.`
            reponse = [`${nomV[2]}=${nomV[3]}\\times ${nomV[0]}-${nomV[1]}`, `${nomV[3]}\\times ${nomV[0]}-${nomV[1]}=${nomV[2]}`]
            texteCorr = `On isole $${nomV[2]}$ dans un membre de l'égalité :<br> 
  $\\begin{aligned}
 ${nomV[0]}&=\\dfrac{${nomV[1]}+${nomV[2]}}{${nomV[3]}}\\\\
 ${nomV[0]}\\times ${nomV[3]}&=${nomV[1]}+${nomV[2]}\\\\
 ${nomV[0]}\\times ${nomV[3]}-${nomV[1]}&=${nomV[2]}
 \\end{aligned}$
    <br> Une expression de $${nomV[2]}$ en fonction de $${nomV[0]}$, $${nomV[1]}$ et  $${nomV[3]}$ est $${nomV[2]}= ${nomV[3]}\\times ${nomV[0]}-${nomV[1]}$.`
          }

          if (choix === 8) { // a=(b+c)/d on cherche  d
            intro = `Soient $${nomV[0]}$, $${nomV[1]}$, $${nomV[2]}$ et $${nomV[3]}$   quatre nombres (avec $${nomV[3]}$ et $${nomV[0]}$  non nuls) vérifiant l'égalité suivante :`
            texte = `${intro}` + `  $${nomV[0]}=\\dfrac{${nomV[1]}+${nomV[2]}}{${nomV[3]}}$.<br>
  Exprimer $${nomV[3]}$ en fonction de $${nomV[0]}$, $${nomV[1]}$ et  $${nomV[2]}$.`
            reponse = [`${nomV[3]}=\\dfrac{${nomV[1]} +${nomV[2]}}{${nomV[0]}}`, `\\dfrac{${nomV[1]} +${nomV[2]}}{${nomV[0]}}=${nomV[3]}`]
            texteCorr = `On isole $${nomV[3]}$ dans un membre de l'égalité :<br> 
  $\\begin{aligned}
 ${nomV[0]}&=\\dfrac{${nomV[1]}+${nomV[2]}}{${nomV[3]}}\\\\
 ${nomV[0]}\\times ${nomV[3]}&=${nomV[1]}+${nomV[2]}\\\\
  ${nomV[3]}&=\\dfrac{${nomV[1]} +${nomV[2]}}{${nomV[0]}}
 \\end{aligned}$
    <br> Une expression de $${nomV[3]}$ en fonction de $${nomV[0]}$, $${nomV[1]}$ et  $${nomV[2]}$ est $${nomV[3]}= \\dfrac{${nomV[1]} +${nomV[2]}}{${nomV[0]}}$.`
          }

          if (choix === 9) { // a=(b+c)*d on cherche  b
            intro = `Soient $${nomV[0]}$, $${nomV[1]}$, $${nomV[2]}$ et $${nomV[3]}$   quatre nombres (avec $${nomV[3]}$ non nul) vérifiant l'égalité suivante :`
            texte = `${intro}` + `  $${nomV[0]}=(${nomV[1]}+${nomV[2]})${nomV[3]}$.<br>
  Exprimer $${nomV[1]}$ en fonction de $${nomV[0]}$, $${nomV[3]}$ et  $${nomV[2]}$.`
            reponse = [`${nomV[1]}=\\dfrac{${nomV[0]} -${nomV[2]}\\times ${nomV[3]}}{${nomV[3]}}`, `\\dfrac{${nomV[0]} -${nomV[2]}\\times ${nomV[3]}}{${nomV[3]}}=${nomV[1]}`, `${nomV[1]}=\\dfrac{${nomV[0]}}{${nomV[3]}}-${nomV[2]}`, `\\dfrac{${nomV[0]}}{${nomV[3]}}-${nomV[2]}=${nomV[1]}`]
            texteCorr = `On isole $${nomV[1]}$ dans un membre de l'égalité :<br> 
  $\\begin{aligned}
 ${nomV[0]}&=(${nomV[1]}+${nomV[2]})${nomV[3]}\\\\
 ${nomV[0]}&=${nomV[1]}${nomV[3]}+${nomV[2]}${nomV[3]}\\\\
  ${nomV[0]}-${nomV[2]}${nomV[3]}&=${nomV[1]}${nomV[3]}\\\\
 \\dfrac{${nomV[0]}-${nomV[2]}${nomV[3]}}{${nomV[3]}}&=${nomV[1]}
 \\end{aligned}$
    <br> Une expression de $${nomV[1]}$ en fonction de $${nomV[0]}$, $${nomV[3]}$ et  $${nomV[2]}$ est 
    $${nomV[1]}= \\dfrac{${nomV[0]} -${nomV[2]}\\times ${nomV[3]}}{${nomV[3]}}$ ou plus simplement $${nomV[1]}=\\dfrac{${nomV[0]}}{${nomV[3]}}-${nomV[2]}$.`
          }

          if (choix === 10) { // a=(b+c)*d on cherche  d
            intro = `Soient $${nomV[0]}$, $${nomV[1]}$, $${nomV[2]}$ et $${nomV[3]}$   quatre nombres (avec $${nomV[1]}+${nomV[2]}$  non nul) vérifiant l'égalité suivante :`
            texte = `${intro}` + `  $${nomV[0]}=(${nomV[1]}+${nomV[2]})${nomV[3]}$.<br>
  Exprimer $${nomV[3]}$ en fonction de $${nomV[0]}$, $${nomV[1]}$ et  $${nomV[2]}$.`
            reponse = [`${nomV[3]}=\\dfrac{${nomV[0]}}{${nomV[1]}+${nomV[2]}}`, `\\dfrac{${nomV[0]}}{${nomV[1]}+${nomV[2]}}=${nomV[3]}`]
            texteCorr = `On isole $${nomV[3]}$ dans un membre de l'égalité :<br> 
  $\\begin{aligned}
 ${nomV[0]}&=(${nomV[1]}+${nomV[2]})${nomV[3]}\\\\
\\dfrac{${nomV[0]}}{${nomV[1]}+${nomV[2]}} &=${nomV[3]}
 \\end{aligned}$
    <br> Une expression de $${nomV[3]}$ en fonction de $${nomV[0]}$, $${nomV[1]}$ et  $${nomV[2]}$ est 
    $${nomV[3]}= \\dfrac{${nomV[0]}}{${nomV[1]}+${nomV[2]}}$.`
          }

          if (choix === 11) { // a=(b-c)*d on cherche  b
            intro = `Soient $${nomV[0]}$, $${nomV[1]}$, $${nomV[2]}$ et $${nomV[3]}$   quatre nombres (avec $${nomV[3]}$ non nul) vérifiant l'égalité suivante :`
            texte = `${intro}` + `  $${nomV[0]}=(${nomV[1]}-${nomV[2]})${nomV[3]}$.<br>
  Exprimer $${nomV[1]}$ en fonction de $${nomV[0]}$, $${nomV[3]}$ et  $${nomV[2]}$.`
            reponse = [`${nomV[1]}=\\dfrac{${nomV[0]} +${nomV[2]}\\times ${nomV[3]}}{${nomV[3]}}`, `\\dfrac{${nomV[0]} +${nomV[2]}\\times ${nomV[3]}}{${nomV[3]}}=${nomV[1]}`, `${nomV[1]}=\\dfrac{${nomV[0]}}{${nomV[3]}}+${nomV[2]}`, `\\dfrac{${nomV[0]}}{${nomV[3]}}+${nomV[2]}=${nomV[1]}`]
            texteCorr = `On isole $${nomV[1]}$ dans un membre de l'égalité :<br> 
  $\\begin{aligned}
 ${nomV[0]}&=(${nomV[1]}-${nomV[2]})${nomV[3]}\\\\
 ${nomV[0]}&=${nomV[1]}${nomV[3]}-${nomV[2]}${nomV[3]}\\\\
  ${nomV[0]}+${nomV[2]}${nomV[3]}&=${nomV[1]}${nomV[3]}\\\\
 \\dfrac{${nomV[0]}+${nomV[2]}${nomV[3]}}{${nomV[3]}}&=${nomV[1]}
 \\end{aligned}$
    <br> Une expression de $${nomV[1]}$ en fonction de $${nomV[0]}$, $${nomV[3]}$ et  $${nomV[2]}$ est 
    $${nomV[1]}= \\dfrac{${nomV[0]} +${nomV[2]}${nomV[3]}}{${nomV[3]}}$ ou plus simplement $${nomV[1]}=\\dfrac{${nomV[0]}}{${nomV[3]}}+${nomV[2]}$.`
          }

          if (choix === 12) { // a=(b-c)*d on cherche  c
            intro = `Soient $${nomV[0]}$, $${nomV[1]}$, $${nomV[2]}$ et $${nomV[3]}$   quatre nombres (avec $${nomV[3]}$  non nul) vérifiant l'égalité suivante :`
            texte = `${intro}` + `  $${nomV[0]}=(${nomV[1]}-${nomV[2]})${nomV[3]}$.<br>
  Exprimer $${nomV[2]}$ en fonction de $${nomV[0]}$, $${nomV[1]}$ et  $${nomV[3]}$.`
            reponse = [`${nomV[2]}=\\dfrac{-${nomV[0]} +${nomV[1]}\\times ${nomV[3]}}{${nomV[3]}}`,
  `\\dfrac{-${nomV[0]} +${nomV[1]}\\times ${nomV[3]}}{${nomV[3]}}=${nomV[2]}`,
   `${nomV[2]}=${nomV[1]}-\\dfrac{${nomV[0]}}{${nomV[3]}}`, `${nomV[1]}-\\dfrac{${nomV[0]}}{${nomV[3]}}=${nomV[2]}`]
            texteCorr = `On isole $${nomV[2]}$ dans un membre de l'égalité :<br> 
  $\\begin{aligned}
 ${nomV[0]}&=(${nomV[1]}-${nomV[2]})${nomV[3]}\\\\
 ${nomV[0]}&=${nomV[1]}${nomV[3]}-${nomV[2]}${nomV[3]}\\\\
  ${nomV[0]}-${nomV[1]}${nomV[3]}&=-${nomV[2]}${nomV[3]}\\\\
 \\dfrac{${nomV[0]}-${nomV[1]}${nomV[3]}}{-${nomV[3]}}&=${nomV[2]}\\\\
 \\dfrac{-${nomV[0]}+${nomV[1]}${nomV[3]}}{${nomV[3]}}&=${nomV[2]}
 \\end{aligned}$
    <br> Une expression de $${nomV[2]}$ en fonction de $${nomV[0]}$, $${nomV[1]}$ et  $${nomV[3]}$ est 
    $${nomV[2]}=  \\dfrac{-${nomV[0]}+${nomV[1]}${nomV[3]}}{${nomV[3]}}$ ou plus simplement : 
    $${nomV[2]}= ${nomV[1]} -\\dfrac{${nomV[0]}}{${nomV[3]}}$ .`
          }

          break

        case 3:
          nomVariables = [
            shuffle(['a', 'b', 'c', 'e', 'f']), shuffle(['x', 'y', 'z', 'w', 'v']), shuffle(['u', 'v', 'w', 't', 'r']), shuffle(['A', 'B', 'C', 'E', 'F']),
            shuffle(['R', 'S', 'T', 'U', 'V']), shuffle(['I', 'J', 'K', 'L', 'M']), shuffle(['c', 'g', 'e', 'f', 'h']),
            shuffle(['c', 'm', 'f', 'e', 'a']), shuffle(['K', 'L', 'M', 'N', 'P']), shuffle(['r', 's', 't', 'u', 'a']), shuffle(['U', 'V', 'W', 'X', 'R'])
          ]
          nomV = choice(nomVariables)
          choix = randint(1, 6)
          if (choix === 1) { // a=(b+c)(d-e) on cherche  b
            intro = `Soient $${nomV[0]}$, $${nomV[1]}$, $${nomV[2]}$, $${nomV[3]}$ et $${nomV[4]}$ cinq nombres (avec $${nomV[3]}-${nomV[4]}$ non nul) vérifiant l'égalité suivante :`
            texte = `${intro}` + ` $${nomV[0]}=(${nomV[1]}+${nomV[2]})(${nomV[3]}-${nomV[4]})$.<br>
       Exprimer $${nomV[1]}$ en fonction de $${nomV[0]}$, $${nomV[2]}$, $${nomV[3]}$ et $${nomV[4]}$.`
            reponse = [`${nomV[1]}=\\dfrac{${nomV[0]}-${nomV[2]}${nomV[3]}+${nomV[2]}${nomV[4]}}{${nomV[3]}-${nomV[4]}}`,
        `\\dfrac{${nomV[0]}-${nomV[2]}${nomV[3]}+${nomV[2]}${nomV[4]}}{${nomV[3]}-${nomV[4]}}=${nomV[1]}`,
        `${nomV[1]}= \\dfrac{${nomV[0]}}{${nomV[3]}-${nomV[4]}}-${nomV[2]}`,
        `\\dfrac{${nomV[0]}}{${nomV[3]}-${nomV[4]}}-${nomV[2]}=${nomV[1]} `,
        `${nomV[1]}= \\dfrac{${nomV[0]}-${nomV[2]}(${nomV[3]}-${nomV[4]})}{${nomV[3]}-${nomV[4]}}`,
        `\\dfrac{${nomV[0]}-${nomV[2]}(${nomV[3]}-${nomV[4]})}{${nomV[3]}-${nomV[4]}}=${nomV[1]} `]
            texteCorr = `On isole $${nomV[1]}$ dans un membre de l'égalité :<br>
           $\\begin{aligned}
          ${nomV[0]}&=(${nomV[1]}+${nomV[2]})(${nomV[3]}-${nomV[4]})\\\\
          ${nomV[0]}&=${nomV[1]}${nomV[3]}-${nomV[1]}${nomV[4]}+${nomV[2]}${nomV[3]}-${nomV[2]}${nomV[4]}\\\\
           ${nomV[0]}-${nomV[2]}${nomV[3]}+${nomV[2]}${nomV[4]}&= ${nomV[1]}(${nomV[3]}-${nomV[4]})\\\\
           \\dfrac{${nomV[0]}-${nomV[2]}${nomV[3]}+${nomV[2]}${nomV[4]}}{${nomV[3]}-${nomV[4]}}&=${nomV[1]}
                     \\end{aligned}$
          <br> Une expression de $${nomV[1]}$ en fonction de $${nomV[0]}$, $${nomV[1]}$, $${nomV[3]}$ et $${nomV[4]}$ est $${nomV[1]}=\\dfrac{${nomV[0]}-${nomV[2]}${nomV[3]}+${nomV[2]}${nomV[4]}}{${nomV[3]}-${nomV[4]}}$ ou plus simplement 
          $${nomV[1]}= \\dfrac{${nomV[0]}}{${nomV[3]}-${nomV[4]}}-${nomV[2]}$.`
          }

          if (choix === 2) { // a=(b+c)(d-e) on cherche  e
            intro = `Soient $${nomV[0]}$, $${nomV[1]}$, $${nomV[2]}$, $${nomV[3]}$ et $${nomV[4]}$ cinq nombres (avec $${nomV[1]}+${nomV[2]}$ non nul) vérifiant l'égalité suivante :`
            texte = `${intro}` + ` $${nomV[0]}=(${nomV[1]}+${nomV[2]})(${nomV[3]}-${nomV[4]})$.<br>
                Exprimer $${nomV[4]}$ en fonction de $${nomV[0]}$, $${nomV[2]}$, $${nomV[3]}$ et $${nomV[1]}$.`
            reponse = [`${nomV[4]}=\\dfrac{${nomV[0]}-${nomV[1]}${nomV[3]}-${nomV[2]}${nomV[3]}}{-${nomV[1]}-${nomV[2]}}`,
                 `\\dfrac{${nomV[0]}-${nomV[1]}${nomV[3]}-${nomV[2]}${nomV[3]}}{-${nomV[1]}-${nomV[2]}}=${nomV[4]}`,
                 `${nomV[4]}=\\dfrac{-${nomV[0]}+${nomV[1]}${nomV[3]}+${nomV[2]}${nomV[3]}}{${nomV[1]}+${nomV[2]}}`,
                 `\\dfrac{-${nomV[0]}+${nomV[1]}${nomV[3]}+${nomV[2]}${nomV[3]}}{${nomV[1]}+${nomV[2]}}=${nomV[4]}`,
                 `${nomV[4]}= \\dfrac{-${nomV[0]}}{${nomV[1]}+${nomV[2]}}+${nomV[3]}`,
                 `\\dfrac{-${nomV[0]}}{${nomV[1]}+${nomV[2]}}+${nomV[3]}=${nomV[4]}`,
                 `${nomV[4]}= \\dfrac{-${nomV[0]}+${nomV[3]}(${nomV[1]}+${nomV[2]})}{${nomV[1]}+${nomV[2]}}`,
                 `\\dfrac{-${nomV[0]}+${nomV[3]}(${nomV[1]}+${nomV[2]})}{${nomV[1]}+${nomV[2]}}=${nomV[4]} `,
                 `${nomV[4]}= \\dfrac{${nomV[0]}-${nomV[3]}(${nomV[1]}+${nomV[2]})}{-${nomV[1]}-${nomV[2]}}`,
                 `\\dfrac{${nomV[0]}-${nomV[3]}(${nomV[1]}+${nomV[2]})}{-${nomV[1]}-${nomV[2]}}=${nomV[4]} `
            ]
            texteCorr = `On isole $${nomV[4]}$ dans un membre de l'égalité :<br>
                    $\\begin{aligned}
                   ${nomV[0]}&=(${nomV[1]}+${nomV[2]})(${nomV[3]}-${nomV[4]})\\\\
                   ${nomV[0]}&=${nomV[1]}${nomV[3]}-${nomV[1]}${nomV[4]}+${nomV[2]}${nomV[3]}-${nomV[2]}${nomV[4]}\\\\
${nomV[0]}-${nomV[1]}${nomV[3]}-${nomV[2]}${nomV[3]}&= -${nomV[1]}${nomV[4]}-${nomV[2]}${nomV[4]})\\\\
${nomV[0]}-${nomV[1]}${nomV[3]}-${nomV[2]}${nomV[3]}&= ${nomV[4]}(-${nomV[1]}-${nomV[2]})\\\\
 \\dfrac{${nomV[0]}-${nomV[1]}${nomV[3]}-${nomV[2]}${nomV[3]}}{-${nomV[1]}-${nomV[2]}}&=${nomV[4]}\\\\
 \\dfrac{-${nomV[0]}+${nomV[1]}${nomV[3]}+${nomV[2]}${nomV[3]}}{${nomV[1]}+${nomV[2]}}&=${nomV[4]}
                              \\end{aligned}$
                   <br> Une expression de $${nomV[4]}$ en fonction de $${nomV[0]}$, $${nomV[1]}$, $${nomV[2]}$ et $${nomV[3]}$ est 
                   $${nomV[4]}=\\dfrac{-${nomV[0]}+${nomV[1]}${nomV[3]}+${nomV[2]}${nomV[3]}}{${nomV[1]}+${nomV[2]}}$ 
                   ou pus simplement 
                   $${nomV[4]}= -\\dfrac{${nomV[0]}}{${nomV[1]}+${nomV[2]}}+${nomV[3]}$.<br>
                   `
          }

          if (choix === 3) { // a=(b+c)/(d-e) on cherche  d
            intro = `Soient $${nomV[0]}$, $${nomV[1]}$, $${nomV[2]}$, $${nomV[3]}$ et $${nomV[4]}$ cinq nombres (avec $${nomV[3]}-${nomV[4]}$ et $${nomV[0]}$ non nuls) vérifiant l'égalité suivante :`
            texte = `${intro}` + ` $${nomV[0]}=\\dfrac{${nomV[1]}+${nomV[2]}}{${nomV[3]}-${nomV[4]}}$.<br>
 Exprimer $${nomV[3]}$ en fonction de $${nomV[0]}$, $${nomV[1]}$, $${nomV[2]}$ et $${nomV[4]}$.`
            reponse = [`${nomV[3]}=\\dfrac{${nomV[1]}+${nomV[2]}+${nomV[0]}${nomV[4]}}{${nomV[0]}}`,
    `\\dfrac{${nomV[1]}+${nomV[2]}+${nomV[0]}${nomV[4]}}{${nomV[0]}}=${nomV[3]}`,
     `${nomV[3]}=\\dfrac{${nomV[1]}+${nomV[2]}}{${nomV[0]}}+${nomV[4]}`,
    `\\dfrac{${nomV[1]}+${nomV[2]}}{${nomV[0]}}+${nomV[4]}=${nomV[3]} `]
            texteCorr = `On isole $${nomV[3]}$ dans un membre de l'égalité :<br>
 $\\begin{aligned}
   ${nomV[0]}=&\\dfrac{${nomV[1]}+${nomV[2]}}{${nomV[3]}-${nomV[4]}}\\\\
    ${nomV[0]}(${nomV[3]}-${nomV[4]})&=${nomV[1]}+${nomV[2]}\\\\
   ${nomV[0]}${nomV[3]}-${nomV[0]}${nomV[4]}&= ${nomV[1]}+${nomV[2]}\\\\
   ${nomV[0]}${nomV[3]}&=${nomV[1]}+${nomV[2]}+${nomV[0]}${nomV[4]}\\\\
   ${nomV[3]}&=\\dfrac{${nomV[1]}+${nomV[2]}+${nomV[0]}${nomV[4]}}{${nomV[0]}}
     \\end{aligned}$
     <br> Une expression de $${nomV[3]}$ en fonction de $${nomV[0]}$, $${nomV[1]}$, $${nomV[2]}$ et $${nomV[4]}$ est 
       $${nomV[3]}=\\dfrac{${nomV[1]}+${nomV[2]}+${nomV[0]}${nomV[4]}}{${nomV[0]}}$.`
          }
          if (choix === 4) { // a=(b+c)/(d-e) on cherche  e
            intro = `Soient $${nomV[0]}$, $${nomV[1]}$, $${nomV[2]}$, $${nomV[3]}$ et $${nomV[4]}$ cinq nombres (avec $${nomV[3]}-${nomV[4]}$ et $${nomV[0]}$ non nuls) vérifiant l'égalité suivante :`
            texte = `${intro}` + ` $${nomV[0]}=\\dfrac{${nomV[1]}+${nomV[2]}}{${nomV[3]}-${nomV[4]}}$.<br>
    Exprimer $${nomV[4]}$ en fonction de $${nomV[0]}$, $${nomV[1]}$, $${nomV[2]}$ et $${nomV[3]}$.`
            reponse = [`${nomV[4]}=\\dfrac{${nomV[1]}+${nomV[2]}-${nomV[0]}${nomV[4]}}{-${nomV[0]}}`,
      `\\dfrac{${nomV[1]}+${nomV[2]}-${nomV[0]}${nomV[4]}}{-${nomV[0]}}=${nomV[4]}`,
     `${nomV[4]}=\\dfrac{-${nomV[1]}-${nomV[2]}+${nomV[0]}${nomV[3]}}{${nomV[0]}}`,
       `\\dfrac{-${nomV[1]}-${nomV[2]}+${nomV[0]}${nomV[3]}}{${nomV[0]}}=${nomV[4]}`,
       `${nomV[4]}=\\dfrac{-${nomV[1]}-${nomV[2]}}{${nomV[0]}}+${nomV[3]}`,
       `${nomV[4]}=\\dfrac{${nomV[1]}+${nomV[2]}}{-${nomV[0]}}+${nomV[3]}`
            ]
            texteCorr = `On isole $${nomV[4]}$ dans un membre de l'égalité :<br>
     $\\begin{aligned}
      ${nomV[0]}=&\\dfrac{${nomV[1]}+${nomV[2]}}{${nomV[3]}-${nomV[4]}}\\\\
        ${nomV[0]}(${nomV[3]}-${nomV[4]})&=${nomV[1]}+${nomV[2]}\\\\
      ${nomV[0]}${nomV[3]}-${nomV[0]}${nomV[4]}&= ${nomV[1]}+${nomV[2]}\\\\
      -${nomV[0]}${nomV[4]} &=${nomV[1]}+${nomV[2]}-${nomV[0]}${nomV[3]}\\\\
      ${nomV[4]}&=\\dfrac{${nomV[1]}+${nomV[2]}-${nomV[0]}${nomV[3]}}{-${nomV[0]}}\\\\
      ${nomV[4]}&=\\dfrac{-${nomV[1]}-${nomV[2]}+${nomV[0]}${nomV[3]}}{${nomV[0]}}
         \\end{aligned}$
         <br> Une expression de $${nomV[4]}$ en fonction de $${nomV[0]}$, $${nomV[1]}$, $${nomV[2]}$ et $${nomV[3]}$ est 
           $${nomV[4]}=\\dfrac{-${nomV[1]}-${nomV[2]}+${nomV[0]}${nomV[3]}}{${nomV[0]}}$.`
          }
          if (choix === 5) { // a=b+c\sqrt{d+e} on cherche d
            intro = `Soient $${nomV[0]}$, $${nomV[1]}$, $${nomV[2]}$, $${nomV[3]}$ et $${nomV[4]}$ cinq nombres (strictement positifs) vérifiant l'égalité suivante :`
            texte = `${intro}` + ` $${nomV[0]}=${nomV[1]}+${nomV[2]}\\sqrt{${nomV[3]}+${nomV[4]}}$.<br>
    Exprimer $${nomV[3]}$ en fonction de $${nomV[0]}$, $${nomV[1]}$, $${nomV[2]}$ et $${nomV[4]}$.`
            reponse = [`${nomV[3]}=\\dfrac{${nomV[0]}^2-2${nomV[0]}${nomV[1]}+${nomV[1]}^2}{${nomV[2]}^2}-${nomV[4]}`,
  `\\dfrac{${nomV[0]}^2-2${nomV[0]}${nomV[1]}+${nomV[1]}^2}{${nomV[2]}^2}-${nomV[4]}=${nomV[3]}`,
  `${nomV[3]}=(\\dfrac{${nomV[0]}-${nomV[1]}}{${nomV[2]}})^2-${nomV[4]}`,
  `(\\dfrac{${nomV[0]}-${nomV[1]}}{${nomV[2]}})^2-${nomV[4]}=${nomV[3]}`,
  `${nomV[3]}=\\dfrac{${nomV[0]}^2-2${nomV[0]}${nomV[1]}+${nomV[1]}^2-${nomV[4]}${nomV[2]}^2}{${nomV[2]}^2}`,
  `\\dfrac{${nomV[0]}^2-2${nomV[0]}${nomV[1]}+${nomV[1]}^2-${nomV[4]}${nomV[2]}^2}{${nomV[2]}^2}=${nomV[3]}`,
  `${nomV[3]}=\\dfrac{(${nomV[0]}-${nomV[1]})^2-${nomV[4]}${nomV[2]}^2}{${nomV[2]}^2}`,
  `\\dfrac{(${nomV[0]}-${nomV[1]})^2-${nomV[4]}${nomV[2]}^2}{${nomV[2]}^2}=${nomV[3]}`
            ]
            texteCorr = `On isole $${nomV[3]}$ dans un membre de l'égalité :<br>
 $\\begin{aligned}
  ${nomV[0]}=&${nomV[1]}+${nomV[2]}\\sqrt{${nomV[3]}+${nomV[4]}}\\\\
   ${nomV[0]}-${nomV[1]}&=${nomV[2]}\\sqrt{${nomV[3]}+${nomV[4]}}\\\\
   \\dfrac{${nomV[0]}-${nomV[1]}}{${nomV[1]}}&= \\sqrt{${nomV[3]}+${nomV[4]}}\\\\
   \\left(\\dfrac{${nomV[0]}-${nomV[1]}}{${nomV[1]}}\\right)^2 &=${nomV[3]}+${nomV[4]}\\\\
   \\left(\\dfrac{${nomV[0]}-${nomV[1]}}{${nomV[1]}}\\right)^2-${nomV[4]}&=${nomV[3]}
\\end{aligned}$
 <br> Une expression de $${nomV[3]}$ en fonction de $${nomV[0]}$, $${nomV[1]}$, $${nomV[2]}$ et $${nomV[4]}$ est 
   $${nomV[3]}=\\left(\\dfrac{${nomV[0]}-${nomV[1]}}{${nomV[1]}}\\right)^2-${nomV[4]}$ ou par exemple $${nomV[3]}=\\dfrac{\\left(${nomV[0]}-${nomV[1]}\\right)^2-${nomV[4]}${nomV[1]}^2}{${nomV[1]}^2}$.
 `
          }

          if (choix === 6) { // a=b+c\sqrt{d+e} on cherche c
            intro = `Soient $${nomV[0]}$, $${nomV[1]}$, $${nomV[2]}$, $${nomV[3]}$ et $${nomV[4]}$ cinq nombres (strictement positifs) vérifiant l'égalité suivante :`
            texte = `${intro}` + ` $${nomV[0]}=${nomV[1]}+${nomV[2]}\\sqrt{${nomV[3]}+${nomV[4]}}$.<br>
     Exprimer $${nomV[2]}$ en fonction de $${nomV[0]}$, $${nomV[1]}$, $${nomV[3]}$ et $${nomV[4]}$.`
            reponse = [`${nomV[2]}=\\dfrac{${nomV[0]}-${nomV[1]}}{\\sqrt{${nomV[3]}+${nomV[4]}}}`,
   `\\dfrac{${nomV[0]}-${nomV[1]}}{\\sqrt{${nomV[3]}+${nomV[4]}}}=${nomV[2]}`
            ]
            texteCorr = `On isole $${nomV[2]}$ dans un membre de l'égalité :<br>
  $\\begin{aligned}
   ${nomV[0]}=&${nomV[1]}+${nomV[2]}\\sqrt{${nomV[3]}+${nomV[4]}}\\\\
    ${nomV[0]}-${nomV[1]}&=${nomV[2]}\\sqrt{${nomV[3]}+${nomV[4]}}\\\\
    \\dfrac{${nomV[0]}-${nomV[1]}}{\\sqrt{${nomV[3]}+${nomV[4]}}}&=${nomV[2]}
 \\end{aligned}$
  <br> Une expression de $${nomV[2]}$ en fonction de $${nomV[0]}$, $${nomV[1]}$, $${nomV[3]}$ et $${nomV[4]}$ est 
    $${nomV[2]}= \\dfrac{${nomV[0]}-${nomV[1]}}{\\sqrt{${nomV[3]}+${nomV[4]}}}$.
  `
          }
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
  this.besoinFormulaireNumerique = ['Niveau de difficulté', 4, '1 : Niveau 1\n 2 : Niveau 2\n 3 : Niveau 3\n 4 : Mélange des niveaux précédents']
}
