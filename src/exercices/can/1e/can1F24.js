import { courbe } from '../../../lib/2d/courbes.js'
import { repere } from '../../../lib/2d/reperes.js'
import { texteParPosition } from '../../../lib/2d/textes.ts'
import { choice } from '../../../lib/outils/arrayOutils'
import { ecritureAlgebrique, rienSi1 } from '../../../lib/outils/ecritures'
import Exercice from '../../deprecatedExercice.js'
import { mathalea2d } from '../../../modules/2dGeneralites.js'
import { listeQuestionsToContenu, randint } from '../../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../../lib/interactif/questionMathLive.js'
import { setReponse } from '../../../lib/interactif/gestionInteractif.js'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
export const titre = 'Lire graphiquement la valeur de $a$ dans $ax^2+b$'
export const interactifReady = true
export const interactifType = 'mathLive'

// Les exports suivants sont optionnels mais au moins la date de publication semble essentielle
export const dateDePublication = '17/06/2022' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag

/**
 *
 * @author Gilles Mora
 * Référence can1F24
 */
export const uuid = '2ccca'
export const refs = {
  'fr-fr': ['can1F24'],
  'fr-ch': []
}
export default function LectureGraphiqueParaboleA () {
  Exercice.call(this)
  this.nbQuestions = 1
  this.formatChampTexte = 'largeur01 inline'
  this.tailleDiaporama = 1

  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées

    let texte, texteCorr, a, b, o, f, r
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      switch (choice([1, 2])) {
        case 1:// cas parabole a>0

          a = randint(1, 4)
          b = randint(-3, 3, 0)
          o = texteParPosition('O', -0.3, -0.3, 'milieu', 'black', 1)

          f = function (x) {
            return a * x ** 2 + b
          }
          if (b > 0) {
            r = repere({
              yUnite: 1,
              xUnite: 2,
              xMin: -3,
              yMin: -1,
              yMax: 8,
              xMax: 3,
              thickHauteur: 0.1,
              xLabelMin: -2,
              xLabelMax: 2,
              yLabelMax: 7,
              yLabelMin: 0,
              // yLabelMin: -9,
              // yLabelListe:[-8,-6,-4,-2,2,4,6,8],
              axeXStyle: '->',
              axeYStyle: '->'
            })

            f = x => a * x ** 2 + b

            texte = ` $f$ est définie par $f(x)=ax^2+${b}$ .<br>
                        `
            texte += `Déterminer la valeur de $a$.<br>
            
            ` + mathalea2d({
                xmin: -6,
                xmax: 6,
                ymin: -1.5,
                ymax: 8,
                pixelsParCm: 25,
                scale: 0.6,
                style: 'margin: auto'
              }, r, o, courbe(f, { repere: r, color: 'blue', epaisseur: 2 }))
          } else {
            r = repere({
              yUnite: 1,
              xUnite: 2,
              xMin: -3,
              yMin: -4,
              yMax: 4,
              xMax: 3,
              thickHauteur: 0.1,
              xLabelMin: -2,
              xLabelMax: 2,
              yLabelMax: 3,
              yLabelMin: -3,
              // yLabelMin: -9,
              // yLabelListe:[-8,-6,-4,-2,2,4,6,8],
              axeXStyle: '->',
              axeYStyle: '->'
            })

            f = x => a * x ** 2 + b

            texte = `$f$ est définie par $f(x)=ax^2${ecritureAlgebrique(b)}$ .<br>
            `
            texte += `Déterminer la valeur de $a$.<br>
            
            ` + mathalea2d({
                xmin: -6,
                xmax: 6,
                ymin: -4.5,
                ymax: 4,
                pixelsParCm: 25,
                scale: 0.6,
                style: 'margin: auto'
              }, r, o, courbe(f, { repere: r, color: 'blue', epaisseur: 2 }))
          }
          if (this.interactif) {
            texte += ajouteChampTexteMathLive(this, i, 'largeur10 inline nospacebefore', { texteAvant: '$a=$' })
            setReponse(this, i, a)
          }

          texteCorr = `La valeur de $a$ s'obtient (par exemple) grâce à l'image de $1$ par la fonction $f$.<br>
          On lit $f(1)=${f(1)}$. D'où, $a\\times 1^2${ecritureAlgebrique(b)}=${f(1)}$, soit $a=${miseEnEvidence(a)}$.<br>
          Ainsi, $f(x)=${rienSi1(a)}x^2${ecritureAlgebrique(b)}$.`
          break

        case 2:// cas parabole a<0

          a = randint(-4, -1)
          b = randint(-3, 3, 0)
          o = texteParPosition('O', -0.3, -0.3, 'milieu', 'black', 1)

          f = function (x) {
            return a * x ** 2 + b
          }
          if (b > 0) {
            r = repere({
              yUnite: 1,
              xUnite: 2,
              xMin: -3,
              yMin: -4,
              yMax: 4,
              xMax: 3,
              thickHauteur: 0.1,
              xLabelMin: -2,
              xLabelMax: 2,
              yLabelMax: 3,
              yLabelMin: -3,
              // yLabelMin: -9,
              // yLabelListe:[-8,-6,-4,-2,2,4,6,8],
              axeXStyle: '->',
              axeYStyle: '->'
            })

            f = x => a * x ** 2 + b

            texte = `$f$ est définie par $f(x)=ax^2${ecritureAlgebrique(b)}$ .<br>
            `
            texte += 'Déterminer la valeur de $a$.<br>' +
                            mathalea2d({
                              xmin: -6,
                              xmax: 6,
                              ymin: -4.2,
                              ymax: 4,
                              pixelsParCm: 25,
                              scale: 0.6,
                              style: 'margin: auto'
                            }, r, o, courbe(f, { repere: r, color: 'blue', epaisseur: 2 }))
          } else {
            r = repere({
              yUnite: 1,
              xUnite: 2,
              xMin: -3,
              yMin: -7,
              yMax: 1,
              xMax: 3,
              thickHauteur: 0.1,
              xLabelMin: -2,
              xLabelMax: 2,
              yLabelMax: 0,
              yLabelMin: -6,
              // yLabelMin: -9,
              // yLabelListe:[-8,-6,-4,-2,2,4,6,8],
              axeXStyle: '->',
              axeYStyle: '->'
            })

            f = x => a * x ** 2 + b

            texte = `$f$ est définie par $f(x)=ax^2${ecritureAlgebrique(b)}$ .<br>
            `
            texte += `Déterminer la valeur de $a$.<br>
            
            ` + mathalea2d({
                xmin: -6,
                xmax: 6,
                ymin: -7.2,
                ymax: 1,
                pixelsParCm: 25,
                scale: 0.6,
                style: 'margin: auto'
              }, r, o, courbe(f, { repere: r, color: 'blue', epaisseur: 2 }))
          }
          if (this.interactif) {
            texte += ajouteChampTexteMathLive(this, i, 'largeur01 inline nospacebefore', { texteAvant: '$a=$' })
            setReponse(this, i, a)
          }

          texteCorr = `La valeur de $a$ s'obtient grâce à l'image de $1$ par la fonction $f$.<br>
          On lit $f(1)=${f(1)}$. D'où, $a\\times 1^2${ecritureAlgebrique(b)}=${f(1)}$, soit $a=${miseEnEvidence(a)}$.<br>
          Ainsi, $f(x)=${rienSi1(a)}x^2${ecritureAlgebrique(b)}$.`
          break
      }

      if (this.questionJamaisPosee(i, a, b)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
    this.canEnonce = texte
    this.canReponseACompleter = '$a=\\ldots$'
  }
}
