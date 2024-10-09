import { courbe } from '../../../lib/2d/courbes.js'
import { repere } from '../../../lib/2d/reperes.js'
import { texteParPosition } from '../../../lib/2d/textes.ts'
import { choice } from '../../../lib/outils/arrayOutils'
import Exercice from '../../deprecatedExercice.js'
import { mathalea2d } from '../../../modules/2dGeneralites.js'
import { listeQuestionsToContenu, randint } from '../../../modules/outils.js'
import { remplisLesBlancs } from '../../../lib/interactif/questionMathLive'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { handleAnswers } from '../../../lib/interactif/gestionInteractif'
import { miseEnEvidence } from '../../../lib/outils/embellissements'

export const titre = 'Lire graphiquement le signe de $a$ et de $\\Delta$'
export const dateDeModificationImportante = '07/10/2024'
export const interactifReady = true
export const interactifType = 'mathLive'

// Les exports suivants sont optionnels mais au moins la date de publication semble essentielle
export const dateDePublication = '08/06/2022' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag

/**
 *
 * @author Gilles Mora
 * Référence can1F03
 */
export const uuid = 'a8936'
export const ref = 'can1F03'
export const refs = {
  'fr-fr': ['can1F03'],
  'fr-ch': []
}
export default function LectureGraphiqueParabole () {
  Exercice.call(this)
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne

  this.nouvelleVersion = function () {
    let texte, texteCorr, a, alpha, beta, r, F, o, texteIntro, texteNI, texteI

    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      texteNI = 'Donner le signe de $a$ et du discriminant $\\Delta$.<br>'
      texteIntro = 'La courbe représente une fonction $f$ définie par $f(x)=ax^2+bx+c$ .<br>'
      texteI = 'Donner le signe de $a$ et de $\\Delta$ (compléter avec $>$, $<$ ou $=$) :<br>'
      switch (choice([1, 2, 3, 4, 5, 6])) { //
        case 1:// cas parabole a>0 et delta<0

          a = randint(0, 1) + randint(5, 9) / 10
          alpha = randint(-2, 1) + randint(1, 9) / 10
          beta = randint(0, 2) + randint(4, 9) / 10
          o = texteParPosition('O', -0.3, -0.3, 'milieu', 'black', 1)
          texte = `${texteIntro}`
          if (!this.interactif) {
            texte += `${texteNI}`
          } else {
            texte += `${texteI}`
            texte += remplisLesBlancs(this, i, 'a \\quad%{champ1} \\quad0 \\text{ et  } \\Delta \\quad%{champ2}\\quad 0', KeyboardType.clavierCompare)
          }
          handleAnswers(this, i, {
            bareme: (listePoints) => [Math.min(listePoints[0], listePoints[1]), 1],
            champ1: { value: '>' },
            champ2: { value: '<' }
          },
          { formatInteractif: 'mathlive' }
          )
          // $${delta}$ et $${a}(x-${alpha})^2+${beta}$
          r = repere({
            xMin: -5,
            yMin: -1,
            yMax: 6,
            xMax: 5,
            thickHauteur: 0.1,
            xLabelMin: -4,
            xLabelMax: 4,
            yLabelMax: 5,
            axeXStyle: '->',
            axeYStyle: '->'
          })

          F = x => a * (x - alpha) ** 2 + beta
          texte += mathalea2d({
            xmin: -5,
            xmax: 5,
            ymin: -1.5,
            ymax: 6,
            pixelsParCm: 25,
            scale: 0.8,
            style: 'margin: auto'
          }, r, o, courbe(F, { repere: r, color: 'blue', epaisseur: 2 }))

          texteCorr = `La parabole a "les bras" tournés vers le haut, on en déduit que $a${miseEnEvidence('>')}0$. <br>
      De plus, elle ne coupe pas l'axe des abscisses, donc $f$ n'a pas de racines et par suite $\\Delta${miseEnEvidence('<')}0$.`
          break

        case 2:// cas parabole a>0 et delta>0

          a = randint(0, 1) + randint(5, 9) / 10
          alpha = randint(-2, 1) + randint(1, 9) / 10
          beta = randint(-2, 0) - randint(4, 9) / 10
          o = texteParPosition('O', -0.3, -0.3, 'milieu', 'black', 1)
          texte = `${texteIntro}`
          if (!this.interactif) {
            texte += `${texteNI}`
          } else {
            texte += `${texteI}`
            texte += remplisLesBlancs(this, i, 'a \\quad%{champ1} \\quad0 \\text{ et  } \\Delta \\quad%{champ2}\\quad 0', KeyboardType.clavierCompare)
          }
          handleAnswers(this, i, {
            bareme: (listePoints) => [Math.min(listePoints[0], listePoints[1]), 1],
            champ1: { value: '>' },
            champ2: { value: '>' }
          },
          { formatInteractif: 'mathlive' }
          )
          // $${delta}$ et $${a}(x-${alpha})^2+${beta}$

          r = repere({
            xMin: -5,
            yMin: -4,
            yMax: 5,
            xMax: 5,
            thickHauteur: 0.1,
            xLabelMin: -4,
            xLabelMax: 4,
            yLabelMax: 4,
            yLabelMin: -3,
            axeXStyle: '->',
            axeYStyle: '->'
          })

          F = x => a * (x - alpha) ** 2 + beta
          texte += mathalea2d({
            xmin: -5,
            xmax: 5,
            ymin: -4.5,
            ymax: 5,
            pixelsParCm: 25,
            scale: 0.8,
            style: 'margin: auto'
          }, r, o, courbe(F, { repere: r, color: 'blue', epaisseur: 2 }))
          texteCorr = `La parabole a "les bras" tournés vers le haut, on en déduit que $a${miseEnEvidence('>')}0$. <br>
    De plus, elle  coupe  l'axe des abscisses en deux points, donc $f$ a deux racines et par suite $\\Delta${miseEnEvidence('>')}0$.`
          break

        case 3:// cas parabole a>0 et delta=0

          a = randint(0, 1) + randint(5, 9) / 10
          alpha = randint(-2, 1) + randint(1, 9) / 10
          beta = 0
          o = texteParPosition('O', -0.3, -0.3, 'milieu', 'black', 1)
          texte = `${texteIntro}`
          if (!this.interactif) {
            texte += `${texteNI}`
          } else {
            texte += `${texteI}`
            texte += remplisLesBlancs(this, i, 'a \\quad%{champ1} \\quad0 \\text{ et  } \\Delta \\quad%{champ2}\\quad 0', KeyboardType.clavierCompare)
          }
          handleAnswers(this, i, {
            bareme: (listePoints) => [Math.min(listePoints[0], listePoints[1]), 1],
            champ1: { value: '>' },
            champ2: { value: '=' }
          },
          { formatInteractif: 'mathlive' }
          )
          // $${delta}$ et $${a}(x-${alpha})^2+${beta}$
          r = repere({
            xMin: -5,
            yMin: -2,
            yMax: 5,
            xMax: 5,
            thickHauteur: 0.1,
            xLabelMin: -4,
            xLabelMax: 4,
            yLabelMax: 4,
            axeXStyle: '->',
            yLabelMin: -1,
            axeYStyle: '->'
          })

          F = x => a * (x - alpha) ** 2 + beta
          texte += mathalea2d({
            xmin: -5,
            xmax: 5,
            ymin: -2.5,
            ymax: 5,
            pixelsParCm: 25,
            scale: 0.8,
            style: 'margin: auto'
          }, r, o, courbe(F, { repere: r, color: 'blue', epaisseur: 2 }))

          texteCorr = `La parabole a "les bras" tournés vers le haut, on en déduit que $a${miseEnEvidence('>')}0$. <br>
 De plus, elle  coupe  l'axe des abscisses en un point, donc $f$ a une seule racine et par suite $\\Delta${miseEnEvidence('=')}0$.`
          break

        case 4:// cas parabole a<0 et delta=0

          a = randint(-1, 0) - randint(5, 9) / 10
          alpha = randint(-2, 1) + randint(1, 9) / 10
          beta = 0
          o = texteParPosition('O', -0.3, -0.3, 'milieu', 'black', 1)
          texte = `${texteIntro}`
          if (!this.interactif) {
            texte += `${texteNI}`
          } else {
            texte += `${texteI}`
            texte += remplisLesBlancs(this, i, 'a \\quad%{champ1} \\quad0 \\text{ et  } \\Delta \\quad%{champ2}\\quad 0', KeyboardType.clavierCompare)
          }
          handleAnswers(this, i, {
            bareme: (listePoints) => [Math.min(listePoints[0], listePoints[1]), 1],
            champ1: { value: '<' },
            champ2: { value: '=' }
          },
          { formatInteractif: 'mathlive' }
          )
          // $${delta}$ et $${a}(x-${alpha})^2+${beta}$

          r = repere({
            xMin: -5,
            yMin: -5,
            yMax: 2,
            xMax: 5,
            thickHauteur: 0.1,
            xLabelMin: -4,
            xLabelMax: 4,
            yLabelMax: 1,
            axeXStyle: '->',
            yLabelMin: -4,
            axeYStyle: '->'
          })

          F = x => a * (x - alpha) ** 2 + beta
          texte += mathalea2d({
            xmin: -5,
            xmax: 5,
            ymin: -5.5,
            ymax: 2,
            pixelsParCm: 25,
            scale: 0.8,
            style: 'margin: auto'
          }, r, o, courbe(F, { repere: r, color: 'blue', epaisseur: 2 }))

          texteCorr = `La parabole a "les bras" tournés vers le bas, on en déduit que $a${miseEnEvidence('<')}0$. <br>
 De plus, elle  coupe  l'axe des abscisses en un point, donc $f$ a une seule racine et par suite $\\Delta${miseEnEvidence('=')}0$.`
          break

        case 5:// cas parabole a<0 et delta>0

          a = randint(-1, 0) - randint(5, 9) / 10
          alpha = randint(-2, 1) + randint(1, 9) / 10
          beta = randint(1, 3) + randint(4, 9) / 10
          o = texteParPosition('O', -0.3, -0.3, 'milieu', 'black', 1)
          texte = `${texteIntro}`
          if (!this.interactif) {
            texte += `${texteNI}`
          } else {
            texte += `${texteI}`
            texte += remplisLesBlancs(this, i, 'a \\quad%{champ1} \\quad0 \\text{ et  } \\Delta \\quad%{champ2}\\quad 0', KeyboardType.clavierCompare)
          }
          handleAnswers(this, i, {
            bareme: (listePoints) => [Math.min(listePoints[0], listePoints[1]), 1],
            champ1: { value: '<' },
            champ2: { value: '>' }
          },
          { formatInteractif: 'mathlive' }
          )
          // $${delta}$ et $${a}(x-${alpha})^2+${beta}$

          r = repere({
            xMin: -5,
            yMin: -2,
            yMax: 5,
            xMax: 5,
            thickHauteur: 0.1,
            xLabelMin: -4,
            yLabelMin: -1,
            xLabelMax: 3,
            yLabelMax: 4,
            axeXStyle: '->',
            axeYStyle: '->'
          })

          F = x => a * (x - alpha) ** 2 + beta
          texte += mathalea2d({
            xmin: -5,
            xmax: 5,
            ymin: -2.5,
            ymax: 5,
            pixelsParCm: 25,
            scale: 0.8,
            style: 'margin: auto'
          }, r, o, courbe(F, { repere: r, color: 'blue', epaisseur: 2 }))

          texteCorr = `La parabole a "les bras" tournés vers le bas, on en déduit que $a${miseEnEvidence('<')}0$. <br>
 De plus, elle  coupe  l'axe des abscisses en deux points, donc $f$ a deux racines  et par suite $\\Delta${miseEnEvidence('>')}0$.`
          break

        case 6:// cas parabole a<0 et delta<0

          a = randint(-1, 0) - randint(3, 7) / 10
          alpha = randint(-2, 1) + randint(1, 9) / 10
          beta = randint(-1, 0) - randint(4, 9) / 10
          o = texteParPosition('O', -0.3, -0.3, 'milieu', 'black', 1)
          texte = `${texteIntro}`
          if (!this.interactif) {
            texte += `${texteNI}`
          } else {
            texte += `${texteI}`
            texte += remplisLesBlancs(this, i, 'a \\quad%{champ1} \\quad0 \\text{ et  } \\Delta \\quad%{champ2}\\quad 0', KeyboardType.clavierCompare)
          }
          handleAnswers(this, i, {
            bareme: (listePoints) => [Math.min(listePoints[0], listePoints[1]), 1],
            champ1: { value: '<' },
            champ2: { value: '<' }
          },
          { formatInteractif: 'mathlive' }
          )
          // $${delta}$ et $${a}(x-${alpha})^2+${beta}$

          r = repere({
            xMin: -5,
            yMin: -5,
            yMax: 2,
            xMax: 5,
            thickHauteur: 0.1,
            xLabelMin: -4,
            yLabelMin: -4,
            xLabelMax: 4,
            yLabelMax: 1,
            axeXStyle: '->',
            axeYStyle: '->'
          })

          F = x => a * (x - alpha) ** 2 + beta
          texte += mathalea2d({
            xmin: -5,
            xmax: 5,
            ymin: -5.5,
            ymax: 2,
            pixelsParCm: 25,
            scale: 0.8,
            style: 'margin: auto'
          }, r, o, courbe(F, { repere: r, color: 'blue', epaisseur: 2 }))

          texteCorr = `La parabole a "les bras" tournés vers le bas, on en déduit que $a${miseEnEvidence('<')}0$. <br>
 De plus, elle ne coupe pas l'axe des abscisses, donc $f$ n'a pas de racines et par suite $\\Delta${miseEnEvidence('<')}0$.`
          break
      }

      if (this.questionJamaisPosee(i, a, alpha, beta)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
    this.canEnonce = texte
    this.canReponseACompleter = ''
  }
}
