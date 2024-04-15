import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils.js'
import { spline } from '../../../lib/mathFonctions/Spline.js'
import { choice } from '../../../lib/outils/arrayOutils'
import { mathalea2d } from '../../../modules/2dGeneralites.js'
import { texteParPosition } from '../../../lib/2d/textes'
import { repere } from '../../../lib/2d/reperes.js'
import { context } from '../../../modules/context'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { intervalsCompare } from '../../../lib/interactif/comparisonFunctions'
export const titre = 'Déterminer le signe d\'une fonction graphiquement '
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'eb73a'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
*/
export default class NomExercice extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.canOfficielle = false
    this.typeExercice = 'simple'
    this.nbQuestions = 1
    this.formatChampTexte = 'largeur01 inline nospacebefore blocCenter ' + KeyboardType.clavierEnsemble
    this.formatInteractif = 'calcul'
    this.compare = intervalsCompare
  }

  nouvelleVersion () {
    function aleatoiriseCourbe1 (listeFonctions) {
      const choix = choice(listeFonctions)
      return choix.map((noeud) => Object({
        x: (noeud.x),
        y: (noeud.y),
        deriveeGauche: noeud.deriveeGauche,
        deriveeDroit: noeud.deriveeDroit,
        isVisible: noeud.isVisible
      }))
    }
    function aleatoiriseCourbe2 (listeFonctions) {
      const coeffX = choice([-1, 1])// choice([-1, 1]) // symétries ou pas
      const coeffY = choice([-1, 1])// choice([-1, 1])
      const deltaX = randint(-2, +2)// randint(-2, +2) // translations
      const deltaY = 0// randint(-1, 1)// randint(-2, +2)
      const choix = choice(listeFonctions)
      return choix.map((noeud) => Object({
        x: (noeud.x + deltaX) * coeffX,
        y: (noeud.y + deltaY) * coeffY,
        deriveeGauche: noeud.deriveeGauche * coeffX * coeffY,
        deriveeDroit: noeud.deriveeDroit * coeffX * coeffY,
        isVisible: noeud.isVisible
      }))
    }
    if (this.canOfficielle) {
      const noeuds2 = [{ x: -6, y: -0.5, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
        { x: -5, y: 0, deriveeGauche: 0.5, deriveeDroit: 0.5, isVisible: false },
        { x: -3, y: 2, deriveeGauche: 1.5, deriveeDroit: 1.5, isVisible: false },
        { x: -2, y: 5, deriveeGauche: 0, deriveeDroit: -0.5, isVisible: false },
        { x: 0, y: 3, deriveeGauche: -1, deriveeDroit: -1, isVisible: false },
        { x: 1, y: 2, deriveeGauche: -1, deriveeDroit: -1, isVisible: false },
        { x: 2, y: 0, deriveeGauche: -1, deriveeDroit: -1, isVisible: false },
        { x: 4, y: -1, deriveeGauche: -0.7, deriveeDroit: -0.8, isVisible: false },
        { x: 6, y: -2, deriveeGauche: 0, deriveeDroit: 0, isVisible: true }

      ]

      let bornes = {}
      const o = texteParPosition('O', -0.3, -0.3, 'milieu', 'black', 1)
      const maFonction = [noeuds2]
      const nuage = aleatoiriseCourbe1(maFonction)
      const theSpline = spline(nuage)
      this.spline = theSpline
      bornes = theSpline.trouveMaxes()
      const repere1 = repere({
        xMin: bornes.xMin - 1,
        xMax: bornes.xMax + 1,
        yMin: bornes.yMin - 1,
        yMax: bornes.yMax + 1,
        grilleX: false,
        grilleY: false,
        grilleSecondaire: true,
        grilleSecondaireYDistance: 1,
        grilleSecondaireXDistance: 1,
        grilleSecondaireYMin: bornes.yMin - 1,
        grilleSecondaireYMax: bornes.yMax + 1,
        grilleSecondaireXMin: bornes.xMin - 1,
        grilleSecondaireXMax: bornes.xMax + 1
      })
      const courbe1 = theSpline.courbe({
        repere: repere1,
        epaisseur: 1.5,
        ajouteNoeuds: true,
        optionsNoeuds: { color: 'blue', taille: 2, style: 'x', epaisseur: 2 },
        color: 'blue'
      })
      const objetsEnonce = [repere1, courbe1]
      this.question = ''
      if (context.isHtml) {
        this.question = 'On donne le graphique d’une fonction $f$ : <br>'
        this.question += mathalea2d(Object.assign({ pixelsParCm: 30, scale: 0.55, style: 'margin: auto' }, { xmin: bornes.xMin - 1, ymin: bornes.yMin - 1, xmax: bornes.xMax + 1, ymax: bornes.yMax + 1 }), objetsEnonce, o)
      }
      this.question += 'Sur quel intervalle, $f$ est-elle positive ou nulle ?'
      this.reponse = { reponse: { value: '[-5;2]', compare: intervalsCompare } }
      this.correction = `La fonction est positive ou nulle lorsque les images sont positives ou nulles.<br>
    Graphiquement, les images sont positives ou nulles  lorsque la courbe se situe sur ou au-dessus  de l'axe des abscisses, soit sur l'intervalle  
    $${miseEnEvidence('[-5\\,;\\,2]')}$.`
      this.canEnonce = this.question
      this.canReponseACompleter = ''
    } else {
      const noeuds1 = [{ x: -3, y: -1, deriveeGauche: -1, deriveeDroit: -1, isVisible: true },
        { x: -2, y: -3, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
        { x: -1, y: -2, deriveeGauche: 1, deriveeDroit: 1, isVisible: true },
        { x: 0, y: 0, deriveeGauche: 2, deriveeDroit: 2, isVisible: true },
        { x: 1, y: 3, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
        { x: 2, y: 2, deriveeGauche: -1, deriveeDroit: -1, isVisible: true },
        { x: 3, y: 1, deriveeGauche: 0, deriveeDroit: 0, isVisible: true }

      ]

      const mesFonctions = [noeuds1]// noeuds3,, noeuds2

      let bornes = {}
      const o = texteParPosition('O', -0.3, -0.3, 'milieu', 'black', 1)
      const nuage = aleatoiriseCourbe2(mesFonctions)
      const theSpline = spline(nuage)
      this.spline = theSpline
      bornes = theSpline.trouveMaxes()
      const repere1 = repere({
        xMin: bornes.xMin - 1,
        xMax: bornes.xMax + 1,
        yMin: bornes.yMin - 1,
        yMax: bornes.yMax + 1,
        grilleX: false,
        grilleY: false,
        grilleSecondaire: true,
        grilleSecondaireYDistance: 1,
        grilleSecondaireXDistance: 1,
        grilleSecondaireYMin: bornes.yMin - 1,
        grilleSecondaireYMax: bornes.yMax + 1,
        grilleSecondaireXMin: bornes.xMin - 1,
        grilleSecondaireXMax: bornes.xMax + 1
      })
      const courbe1 = theSpline.courbe({
        repere: repere1,
        epaisseur: 1.5,
        ajouteNoeuds: true,
        optionsNoeuds: { color: 'blue', taille: 2, style: 'x', epaisseur: 2 },
        color: 'blue'
      })
      const objetsEnonce = [repere1, courbe1]
      const choix = choice([true, false])
      if (theSpline.y[0] > 0) { // le premier point a une ordonnée positive ---> courbe + puis -
        this.reponse = choix ? `[${theSpline.x[0]};${theSpline.x[3]}]` : `[${theSpline.x[3]};${theSpline.x[6]}]`
        this.question = `Sur quel intervalle, $f$ est-elle ${choix ? 'positive' : 'négative'} ou nulle ?<br>` +
         mathalea2d(Object.assign({ pixelsParCm: 30, scale: 0.65, style: 'margin: auto' }, { xmin: bornes.xMin - 1, ymin: bornes.yMin - 1, xmax: bornes.xMax + 1, ymax: bornes.yMax + 1 }), objetsEnonce, o)// fixeBordures(objetsEnonce))
        this.correction = `La fonction est ${choix ? 'positive' : 'négative'} ou nulle lorsque les images sont ${choix ? 'positives' : 'négatives'} ou nulles.<br>
    Graphiquement, les images sont ${choix ? 'positives' : 'négatives'} ou nulles  lorsque la courbe se situe sur ou ${choix ? 'au-dessus' : 'en dessous'}  de l'axe des abscisses, soit sur l'intervalle  
    ${choix ? `$${miseEnEvidence(`[${theSpline.x[0]}\\,;\\,${theSpline.x[3]}]`)}$` : `$${miseEnEvidence(`[${theSpline.x[3]}\\,;\\,${theSpline.x[6]}]`)}$`}
    `
      }
      if (theSpline.y[0] < 0) { // le premier point a une ordonnée négative ---> courbe - puis +
        this.reponse = choix
          ? { reponse: { value: `[${theSpline.x[0]};${theSpline.x[3]}]`, compare: intervalsCompare } }
          : { reponse: { value: `[${theSpline.x[3]};${theSpline.x[6]}]`, compare: intervalsCompare } }
        this.question = `Sur quel intervalle,  $f$ est-elle ${choix ? 'négative' : 'positive'} ou nulle ?<br>` +
             mathalea2d(Object.assign({ pixelsParCm: 30, scale: 0.65, style: 'margin: auto' }, { xmin: bornes.xMin - 1, ymin: bornes.yMin - 1, xmax: bornes.xMax + 1, ymax: bornes.yMax + 1 }), objetsEnonce, o)// fixeBordures(objetsEnonce))
        this.correction = `La fonction est ${choix ? 'négative' : 'positive'} ou nulle lorsque les images sont ${choix ? 'négatives' : 'positives'} ou nulles.<br>
        Graphiquement, les images sont ${choix ? 'négatives' : 'positives'} ou nulles  lorsque la courbe se situe sur ou ${choix ? 'en dessous' : 'au-dessus'}  de l'axe des abscisses, soit sur l'intervalle  
        ${choix ? `$${miseEnEvidence(`[${theSpline.x[0]}\\,;\\,${theSpline.x[3]}`)}]$` : `$${miseEnEvidence(`[${theSpline.x[3]}\\,;\\,${theSpline.x[6]}]`)}$`}
        `
      }
      this.canEnonce = this.question// 'Compléter'
      this.canReponseACompleter = ''
    }
  }
}
