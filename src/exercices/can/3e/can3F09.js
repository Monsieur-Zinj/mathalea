import { choice } from '../../../lib/outils/arrayOutils'
import FractionEtendue from '../../../modules/FractionEtendue.ts'
import { ecritureAlgebrique, ecritureParentheseSiNegatif, rienSi1 } from '../../../lib/outils/ecritures'
import { sp } from '../../../lib/outils/outilString.js'
import { pgcd } from '../../../lib/outils/primalite'
import Exercice from '../../deprecatedExercice.js'
import { listeQuestionsToContenu, randint } from '../../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../../lib/interactif/questionMathLive.js'

import { setReponse } from '../../../lib/interactif/gestionInteractif.ts'

export const titre = 'Reconnaître une fonction affine'
export const interactifReady = true
export const interactifType = 'mathLive'

// Les exports suivants sont optionnels mais au moins la date de publication semble essentielle
export const dateDePublication = '25/10/2021' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag

/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence can3F09
 */
export const uuid = 'b60f4'
export const ref = 'can3F09'
export const refs = {
  'fr-fr': ['can3F09'],
  'fr-ch': []
}
export default function ReconnaitreFonctionAffine () {
  Exercice.call(this)
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne
  this.formatChampTexte = 'largeur15 inline'
  this.formatInteractif = 'calcul'
  this.nbQuestions = 1
  this.tailleDiaporama = 2

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    let a, b, c, texte, texteCorr
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      switch (choice([1, 2, 3])) { //, 2, 3
        case 1 :// b+ax
          a = randint(1, 5)
          b = randint(-9, 9)
          if (a === 1) {
            if (b === 0) {
              texte = `Soit $f(x)=x$.<br>
          La fonction $f$ est une fonction affine de la forme $f(x)=ax+b$.<br>
          Les valeurs de $a$ et de $b$ sont  :<br> $a=$ ${this.interactif ? ajouteChampTexteMathLive(this, 2 * i, 'largeur10 inline') + sp(2) : '$\\ldots$'} ${sp(3)} et${sp(3)} $b=$
            ${this.interactif ? ajouteChampTexteMathLive(this, 2 * i + 1, 'largeur10 inline') + sp(2) : '$\\ldots$'} `
              this.canEnonce = `Soit $f(x)=x$.<br>

            La fonction $f$ est une fonction affine de la forme $f(x)=ax+b$.`
              this.canReponseACompleter = '$a=\\ldots $ et $b=\\ldots$'
              texteCorr = `On identifie les valeurs de $a$ et de $b$ : la valeur de $a$ est le coefficient devant $x$ (attention, $x=1x$) et la valeur de $b$ est la constante. <br>
            $f(x)=\\underbrace{${a}}_{a}x$`
            } else {
              texte = `Soit $f(x)=${b}+x$.<br>

        La fonction $f$ est une fonction affine de la forme $f(x)=ax+b$.<br>
        
        Les valeurs de $a$ et de $b$ sont  :<br> $a=$ ${this.interactif ? ajouteChampTexteMathLive(this, 2 * i, 'largeur10 inline') + sp(2) : '$\\ldots$'} ${sp(3)} et${sp(3)} $b=$
          ${this.interactif ? ajouteChampTexteMathLive(this, 2 * i + 1, 'largeur10 inline') + sp(2) : '$\\ldots$'} `
              this.canEnonce = `Soit $f(x)=${b}+x$.<br>

            La fonction $f$ est une fonction affine de la forme $f(x)=ax+b$.`

              texteCorr = `On identifie les valeurs de $a$ et de $b$ : la valeur de $a$ est le coefficient devant $x$ (attention, $x=1x$) et la valeur de $b$ est la constante. <br>
          $f(x)=${b}+${a}x=\\underbrace{${a}}_{a}x+\\underbrace{${ecritureParentheseSiNegatif(b)}}_{b}$`
            }
          } else {
            if (b === 0) {
              texte = `Soit $f(x)=x$.<br>
                La fonction $f$ est une fonction affine de la forme $f(x)=ax+b$.<br>
                Les valeurs de $a$ et de $b$ sont  :<br>       $a=$ ${this.interactif ? ajouteChampTexteMathLive(this, 2 * i, 'largeur10 inline') + sp(2) : '$\\ldots$'} ${sp(3)} et${sp(3)} $b=$
                  ${this.interactif ? ajouteChampTexteMathLive(this, 2 * i + 1, 'largeur10 inline') + sp(2) : '$\\ldots$'} `
              this.canEnonce = `Soit $f(x)=${b}+x$.<br>

            La fonction $f$ est une fonction affine de la forme $f(x)=x$.`

              texteCorr = `On identifie les valeurs de $a$ et de $b$ : la valeur de $a$ est le coefficient devant $x$ (attention, $x=1x$) et la valeur de $b$ est la constante. <br>
                  $f(x)=\\underbrace{${a}}_{a}x$`
            } else {
              texte = `Soit $f(x)=${b}+${a}x$.<br>
            La fonction $f$ est une fonction affine de la forme $f(x)=ax+b$.<br>
            Les valeurs de $a$ et de $b$ sont  :<br>
       $a=$ ${this.interactif ? ajouteChampTexteMathLive(this, 2 * i, 'largeur10 inline') + sp(2) : '$\\ldots$'} ${sp(3)} et${sp(3)} $b=$
         ${this.interactif ? ajouteChampTexteMathLive(this, 2 * i + 1, 'largeur10 inline') + sp(2) : '$\\ldots$'} `
              this.canEnonce = `Soit $f(x)=${b}+${a}x$.<br>

            La fonction $f$ est une fonction affine de la forme $f(x)=ax+b$.`

              texteCorr = `On identifie les valeurs de $a$ et de $b$ : la valeur de $a$ est le coefficient devant $x$ (attention, $x=1x$) et la valeur de $b$ est la constante. <br>
        $f(x)=${b}+${a}x=\\underbrace{${a}}_{a}x+\\underbrace{${ecritureParentheseSiNegatif(b)}}_{b}$`
            }
          }
          setReponse(this, 2 * i, a)
          setReponse(this, 2 * i + 1, b)

          break
        case 2 :// a/bx +c
          a = randint(-9, 9, 0)
          b = randint(2, 10)
          c = randint(-9, 9, 0)
          while (pgcd(a, b) !== 1) {
            a = randint(-5, 5, 0)
          }
          texte = `Soit $f(x)=\\dfrac{${rienSi1(a)}x}{${b}}${ecritureAlgebrique(c)}$.<br>
            La fonction $f$ est une fonction affine de la forme $f(x)=ax+b$.<br>Les valeurs de $a$ et de $b$ sont  :<br>   $a=$ ${this.interactif ? ajouteChampTexteMathLive(this, 2 * i, 'largeur10 inline') + sp(2) : '$\\ldots$'} ${sp(3)} et${sp(3)} $b=$
         ${this.interactif ? ajouteChampTexteMathLive(this, 2 * i + 1, 'largeur10 inline') + sp(2) : '$\\ldots$'} `
          this.canEnonce = `Soit $f(x)=\\dfrac{${rienSi1(a)}x}{${b}}${ecritureAlgebrique(c)}$.<br>    
         La fonction $f$ est une fonction affine de la forme $f(x)=ax+b$.`
          setReponse(this, 2 * i, new FractionEtendue(a, b), { formatInteractif: 'fractionEgale' })
          setReponse(this, 2 * i + 1, c)
          texteCorr = `On identifie les valeurs de $a$ et de $b$ : la valeur de $a$ est le coefficient devant $x$ (attention, $\\dfrac{ax}{b}=\\dfrac{a}{b}x$) et la valeur de $b$ est la constante.<br>
        $f(x)=\\dfrac{${rienSi1(a)}x}{${b}}=\\underbrace{\\dfrac{${a}}{${b}}}_{a}x+\\underbrace{${ecritureParentheseSiNegatif(c)}}_{b}$`
          break

        case 3 :// (ax+c)/b)
          a = randint(-9, 9, 0)
          b = randint(2, 10)
          c = randint(-9, 9, 0)
          while (pgcd(a, b) !== 1 | pgcd(c, b) !== 1) {
            a = randint(-9, 9, 0)
            c = randint(-9, 9, 0)
            b = randint(2, 10)
          }
          if (a === -1) {
            texte = `Soit $f(x)=\\dfrac{-x${ecritureAlgebrique(c)}}{${b}}$.<br>

        La fonction $f$ est une fonction affine de la forme $f(x)=ax+b$.<br>   Les valeurs de $a$ et de $b$ sont  :<br>  $a=$ ${this.interactif ? ajouteChampTexteMathLive(this, 2 * i, 'largeur10 inline') + sp(2) : '$\\ldots$'} ${sp(3)} et${sp(3)} $b=$
          ${this.interactif ? ajouteChampTexteMathLive(this, 2 * i + 1, 'largeur10 inline') + sp(2) : '$\\ldots$'} `
            this.canEnonce = `Soit $f(x)=\\dfrac{-x${ecritureAlgebrique(c)}}{${b}}$.<br>
          
          La fonction $f$ est une fonction affine de la forme $f(x)=ax+b$.`
          } else {
            texte = `Soit $f(x)=\\dfrac{${rienSi1(a)}x${ecritureAlgebrique(c)}}{${b}}$.<br>

            La fonction $f$ est une fonction affine de la forme $f(x)=ax+b$.<br>      Les valeurs de $a$ et de $b$ sont  :<br>$a=$ ${this.interactif ? ajouteChampTexteMathLive(this, 2 * i, 'largeur10 inline') + sp(2) : '$\\ldots$'} ${sp(3)} et${sp(3)} $b=$
         ${this.interactif ? ajouteChampTexteMathLive(this, 2 * i + 1, 'largeur10 inline') + sp(2) : '$\\ldots$'} `
            this.canEnonce = `Soit $f(x)=\\dfrac{${rienSi1(a)}x${ecritureAlgebrique(c)}}{${b}}$.<br>
          
         La fonction $f$ est une fonction affine de la forme $f(x)=ax+b$.`
          }
          setReponse(this, 2 * i, new FractionEtendue(a, b), { formatInteractif: 'fractionEgale' })
          setReponse(this, 2 * i + 1, new FractionEtendue(c, b), { formatInteractif: 'fractionEgale' })

          texteCorr = `On identifie les valeurs de $a$ et de $b$ : la valeur de $a$ est le coefficient devant $x$  et la valeur de $b$ est la constante.<br>
        $f(x)=\\dfrac{${rienSi1(a)}x${ecritureAlgebrique(c)}}{${b}}=\\underbrace{\\dfrac{${a}}{${b}}}_{a}x+\\underbrace{\\dfrac{${c}}{${b}}}_{b}$`
          break
      }

      this.canReponseACompleter = 'Les valeurs de $a$ et de $b$ sont : <br>$a=\\ldots $ et $b=\\ldots$'
      if (this.questionJamaisPosee(i, a, b, c)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        this.listeCanEnonces.push(this.canEnonce)
        this.listeCanReponsesACompleter.push(this.canReponseACompleter)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
