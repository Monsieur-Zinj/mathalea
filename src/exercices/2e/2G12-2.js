import { point, tracePoint } from '../../lib/2d/points.js'
import Decimal from 'decimal.js'
import { repere } from '../../lib/2d/reperes.js'
import { segment } from '../../lib/2d/segmentsVecteurs.js'
import { labelPoint, texteParPosition } from '../../lib/2d/textes.js'
import { combinaisonListes } from '../../lib/outils/arrayOutils.js'
import FractionEtendue from '../../modules/FractionEtendue.js'
import { creerNomDePolygone } from '../../lib/outils/outilString.js'
import { ecritureParentheseSiNegatif, ecritureAlgebrique } from '../../lib/outils/ecritures.js'
import { texNombre } from '../../lib/outils/texNombre.js'

import Exercice from '../Exercice.js'
import { remplisLesBlancs } from '../../lib/interactif/questionMathLive.js'
import { fixeBordures, mathalea2d } from '../../modules/2dGeneralites.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { setReponse } from '../../lib/interactif/gestionInteractif.js'
export const interactifReady = true
export const interactifType = 'mathLive'
export const titre = 'Calculer et utiliser les coordonnées du milieu d\'un segment dans un repère'
export const dateDeModifImportante = '20/11/2023'
/**
 * 2G12-2
 * @author Stéphane Guyon modif Gilles (interactif + bricoles)
 */
export const uuid = '4b25a'
export const ref = '2G12-2'
export default function Milieu () {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.titre = titre
  this.sup = parseInt(this.sup)
  this.nbQuestions = 2
  this.nbCols = 1
  this.nbColsCorr = 1
  this.sup = 1 //
  this.correctionDetaillee = false
  this.correctionDetailleeDisponible = true
  this.nouvelleVersion = function () {
    this.sup = parseInt(this.sup)
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées

    let typesDeQuestionsDisponibles = [1, 2]; let typesDeQuestions
    if (this.sup === 1) {
      typesDeQuestionsDisponibles = [1]
    }
    if (this.sup === 2) {
      typesDeQuestionsDisponibles = [2]
    }
    if (this.sup === 3) {
      typesDeQuestionsDisponibles = [1, 2]
    }

    const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions)
    for (let i = 0, g, s, xA, yA, xB, yB, nom, o, objets, xM, yM, A, B, T, L, M, I, J, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      typesDeQuestions = listeTypeDeQuestions[i]
      objets = []
      xA = randint(-8, 8, 0)
      xB = randint(-8, 8, xA)
      yA = randint(-8, 8, 0)
      yB = randint(-8, 8)
      g = repere({
        xUnite: 1,
        yUnite: 1,
        xMin: Math.min(-2, xA - 1, xB - 1),
        yMin: Math.min(-2, yA - 1, yB - 1),
        xMax: Math.max(xA + 1, xB + 1, 2),
        yMax: Math.max(yA + 1, yB + 1, 2),
        thickHauteur: 0.1,
        yLabelEcart: 0.7,
        xLabelEcart: 0.5,
        axeXStyle: '->',
        axeYStyle: '->',
        yLabelDistance: 2,
        xLabelDistance: 2
      })
      A = point(xA, yA, 'A')
      B = point(xB, yB, 'B')
      M = point((xA + xB) / 2, (yA + yB) / 2, 'M')
      nom = creerNomDePolygone(3, ['OIJDXYMAB'])
      A.nom = nom[0]
      B.nom = nom[1]
      M.nom = nom[2]

      I = texteParPosition('I', 1, -0.5, 'milieu', 'black', 1)
      J = texteParPosition('J', -0.5, 1, 'milieu', 'black', 1)
      o = texteParPosition('O', -0.3, -0.3, 'milieu', 'black', 1)
      s = segment(A, B, 'blue')

      s.epaisseur = 2
      // s3 = codageSegments('X', 'red', s1, s2)
      T = tracePoint(A, B, M) // Repère les points avec une croix
      L = labelPoint(A, B, M)
      switch (typesDeQuestions) {
        case 1:// cas simple du milieu
          xM = new FractionEtendue(xA + xB, 2)
          yM = new FractionEtendue(yA + yB, 2)// .simplifie()
          objets.push(g, T, L, s, o, I, J)
          setReponse(this, i, { x: xM.valeurDecimale, y: yM.valeurDecimale }, { formatInteractif: 'fillInTheBlank' })
          texte = 'Dans un repère orthonormé $(O,I,J)$, on donne les points suivants :'
          texte += ` $${A.nom}\\left(${xA}\\,;\\,${yA}\\right)$ et $${B.nom}\\left(${xB}\\,;\\,${yB}\\right)$`
          texte += `<br>Déterminer les coordonnées du point $${M.nom}$ milieu du segment $[${A.nom}${B.nom}]$. `
          if (this.interactif) {
            texte += '<br>' + remplisLesBlancs(this, i, `${M.nom}\\Bigg(%{x};%{y}\\Bigg)`)
          }

          if (this.correctionDetaillee) {
            texteCorr = '<br>On sait d\'après le cours, que si $A(x_A\\,;\\,y_A)$ et $B(x_B;y_B)$ sont deux points d\'un repère orthonormé,'
            texteCorr += '<br> alors les coordonnées du point $M$ milieu de $[AB]$ sont '
            texteCorr += `$M\\left(\\dfrac{x_A+x_B}{2};\\dfrac{y_A+y_B}{2}\\right)$ <br>
            On peut représenter la situation avec les données de l'énoncé: <br>`
            texteCorr += mathalea2d(Object.assign({ zoom: 1, scale: 0.5 }, fixeBordures(objets)), objets)
          } else { texteCorr = 'On applique les formules avec les données de l\'énoncé  : <br>' }
          texteCorr += `$\\begin{cases}x_${M.nom}=\\dfrac{${xA}+${ecritureParentheseSiNegatif(xB)}}{2}=\\dfrac{${texNombre(xA + xB)}}{2}${xM.texSimplificationAvecEtapes()}\\\\[0.5em]y_${M.nom}=\\dfrac{${yA}+${ecritureParentheseSiNegatif(yB)}}{2}=\\dfrac{${texNombre(yA + yB)}}{2}${yM.texSimplificationAvecEtapes()}\\end{cases}$`
          texteCorr += `  <br>Ainsi : $ ${M.nom}\\left(${xM.simplifie().texFSD}\\,;\\,${yM.simplifie().texFSD}\\right)$<br> `

          break
        case 2: // cas où on connaît A et I, on cherche B
          xM = new Decimal(xA + xB).div(2)
          yM = new Decimal(yA + yB).div(2)

          objets.push(g, T, L, s, o, I, J)
          setReponse(this, i, { x: new Decimal(xM).mul(2).sub(xA), y: new Decimal(yM).mul(2).sub(yA) }, { formatInteractif: 'fillInTheBlank' })
          texte = 'Dans un repère orthonormé $(O,I,J)$, on donne les points suivants :'
          texte += `  $${A.nom}\\left(${xA}\\,;\\,${yA}\\right)$ et $${M.nom}\\left(${texNombre(xM, 1)}\\,;\\,${texNombre(yM, 1)}\\right)$`
          texte += `<br>Déterminer les coordonnées du point $${B.nom}$ tel que $${M.nom}$ soit le milieu du segment $[${A.nom}${B.nom}]$. `
          if (this.interactif) {
            texte += '<br>' + remplisLesBlancs(this, i, `${M.nom}\\Bigg(%{x};%{y}\\Bigg)`)
          }

          if (this.correctionDetaillee) {
            texteCorr = '<br>On sait d\'après le cours, que si $A(x_A\\,;\\,y_A)$ et $B(x_B\\,;\\,y_B)$ sont deux points d\'un repère orthonormé,'
            texteCorr += '<br> alors les coordonnées du point $M$ milieu de $[AB]$ sont '
            texteCorr += `$M\\left(\\dfrac{x_A+x_B}{2};\\dfrac{y_A+y_B}{2}\\right)$ <br>
          On peut représenter la situation avec les données de l'énoncé : <br>`
            texteCorr += mathalea2d(Object.assign({ zoom: 1, scale: 0.5 }, fixeBordures(objets)), objets)
          } else { texteCorr = 'On applique les formules avec les données de l\'énoncé  : <br>' }
          texteCorr += `$\\begin{cases}${texNombre(xM, 1)}=\\dfrac{${xA}+x_${B.nom}}{2} \\\\[0.5em] ${texNombre(yM, 1)}=\\dfrac{${yA}+y_${B.nom}}{2}\\end{cases}$`
          texteCorr += `$\\iff \\begin{cases}${xA}+x_${B.nom}=2\\times ${ecritureParentheseSiNegatif(xM, 1)}  \\\\[0.5em] ${yA}+y_${B.nom}=2\\times ${ecritureParentheseSiNegatif(yM)}\\end{cases}$`
          texteCorr += `$\\iff \\begin{cases}x_${B.nom}=${texNombre(2 * xM, 0)} ${ecritureAlgebrique(-xA)} \\\\[0.5em] y_${B.nom}=${texNombre(2 * yM, 0)}${ecritureAlgebrique(-yA)}\\end{cases}$`
          texteCorr += `<br>On en déduit :  $\\begin{cases}x_${B.nom}={${texNombre(2 * xM - xA)}}\\\\[0.5em]y_${B.nom}=${texNombre(2 * yM - yA)}\\end{cases}$`
          texteCorr += `<br>Ainsi : $${B.nom}\\left( ${texNombre(2 * xM - xA)}\\,;\\,${texNombre(2 * yM - yA)}\\right)$`

          break
      }
      if (this.questionJamaisPosee(i, xA, yA, xB, yB, typesDeQuestions)) { // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = ['Niveau de difficulté', 3, '1 : Application directe \n2 : Application indirecte\n3 : Mélange ']
}
