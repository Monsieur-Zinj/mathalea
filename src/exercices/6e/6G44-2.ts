import { combinaisonListes } from '../../lib/outils/arrayOutils'
import {
  cone3d,
  cylindre3d,
  homothetie3d,
  point3d,
  polygone3d,
  prisme3d,
  pyramide3d,
  translation3d,
  vecteur3d
} from '../../modules/3d.js'
import { context } from '../../modules/context.js'
import { listeQuestionsToContenuSansNumero, randint } from '../../modules/outils.js'
import { fixeBordures, mathalea2d } from '../../modules/2dGeneralites.js'
import Exercice from '../Exercice'
import { notify } from '../../bugsnag'

export const titre = 'Décrire un assemblage de solides'
export const dateDePublication = '9/3/2024'
/*!
 * @author Guillaume Valmont à partir de 6G44 de Jean-Claude Lhote
 */
export const uuid = '083b9'
export const ref = '6G44-2'
export const refs = {
  'fr-fr': ['6G44-2'],
  'fr-ch': []
}
export default class DecrireAssemblageDeSolides extends Exercice {
  constructor () {
    super()
    this.consigne = 'De quels solides simples sont composés les solides suivants ?'
    this.nbQuestions = 4
    this.nbCols = 2
  }

  getTypeBase (nbSommets: number) {
    switch (nbSommets) {
      case 3:
        return 'triangulaire'
      case 4:
        return 'rectangulaire'
      case 5:
        return 'pentagonale'
      case 6:
        return 'hexagonale'
      case 7:
        return 'heptagonale'
      case 8:
        return 'octogonale'
      default:
        notify('Un nombre de sommets imprévu a été donné dans 6G44-2', { exercice: this, nbSommets })
        return ''
    }
  }

  getTypePrisme (nbSommets: number) {
    switch (nbSommets) {
      case 4:
        return 'prisme droit à base rectangulaire (aussi appelé parallélépipède rectangle ou pavé droit)'
      default:
        return `prisme droit à base ${this.getTypeBase(nbSommets)}`
    }
  }

  nouvelleVersion () {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []
    const troncs = ['prisme', 'cylindre', 'prisme sans', 'cylindre sans']
    const chapeaux = ['haut', 'bas', 'les deux']
    const combinaisons = []
    for (const tronc of troncs) {
      for (const chapeau of chapeaux) {
        if (!tronc.includes('sans') || (tronc.includes('sans') && chapeau === 'les deux')) {
          combinaisons.push({ tronc, chapeau })
        }
      }
    }
    const typesDeQuestions = combinaisonListes(combinaisons, this.nbQuestions)
    for (let j = 0, cpt = 0; j < this.nbQuestions && cpt < 50;) {
      const tronc = typesDeQuestions[j].tronc
      const chapeau = typesDeQuestions[j].chapeau
      context.anglePerspective = 20
      const objets = []
      const points3D = []
      const n = randint(3, 8, 7)
      const rayon = randint(15, 30) / 10
      const O = point3d(0, 0, 0)
      const k = point3d(0, 0, 1)
      const espaceInterBases = randint(10, 20) / 10
      const espaceSommetHaut = 3
      const espaceSommetBas = 2
      const O1 = homothetie3d(k, O, espaceInterBases)
      const O2 = O
      const s1 = homothetie3d(k, O, espaceSommetHaut)
      const s2 = homothetie3d(k, O, -1 * espaceSommetBas)
      const alpha = Math.PI * 2 / n
      for (let i = 0; i < n; i++) {
        points3D.push(point3d(rayon * Math.cos(alpha * i + (n > 5 ? 0.5 : 0)), rayon * Math.sin(alpha * i + (n > 5 ? 0.5 : 0)), 0))
      }
      const base2 = polygone3d(points3D)
      const base1 = translation3d(base2, vecteur3d(O2, O1))
      const prisme = prisme3d(base2, vecteur3d(O1, O2))
      const chapeau1AvecPrisme = pyramide3d(base1, s1)
      const chapeau1SansPrisme = pyramide3d(base2, s1)
      const chapeau2 = pyramide3d(base2, s2, undefined, undefined, undefined, undefined, undefined, undefined, undefined, false)
      const v = vecteur3d(0, -rayon, 0)
      const cylindre = cylindre3d(O2, O1, v, v, 'black', false, false, false, 'black', false, 'lightgray', chapeau === 'bas')
      const cone1AvecCylindre = cone3d(O1, s1, v, 'black', false, undefined, 'white', false)
      const cone1SansCylindre = cone3d(O2, s1, v, 'black', false, undefined, 'white', false)
      const cone2 = cone3d(O2, s2, v, 'black', false, undefined, 'white', false, false)
      this.correction = 'Ce solide est composé '
      switch (tronc) {
        case 'prisme':
          this.correction += `d'un ${this.getTypePrisme(n)} `
          switch (typesDeQuestions[j].chapeau) {
            case 'haut':
              this.correction += `avec au-dessus une pyramide à base ${this.getTypeBase(n)}.`
              for (let i = 0; i < n; i++) {
                prisme.base1.c2d[i].isVisible = false
              }
              objets.push(...chapeau1AvecPrisme.c2d)
              break
            case 'bas':
              this.correction += `avec en dessous une pyramide à base ${this.getTypeBase(n)}.`
              for (let i = 0; i < n; i++) {
                prisme.base2.c2d[i].isVisible = false
              }
              objets.push(...chapeau2.c2d)
              break
            case 'les deux':
              this.correction += `au milieu avec une pyramide au dessus et une autre en dessous, toutes les deux à base ${this.getTypeBase(n)}.`
              for (let i = 0; i < n; i++) {
                prisme.base1.c2d[i].isVisible = false
                prisme.base2.c2d[i].isVisible = false
              }
              objets.push(...chapeau1AvecPrisme.c2d)
              objets.push(...chapeau2.c2d)
              break
            default:
              notify('Chapeau inconnu dans 6G44-2', { exercice: this, tronc, chapeau })
              break
          }
          objets.push(...prisme.c2d)
          break
        case 'cylindre':
          this.correction += 'd\'un cylindre '
          switch (chapeau) {
            case 'haut':
              this.correction += 'avec un cône au-dessus.'
              objets.push(...cone1AvecCylindre.c2d)
              break
            case 'bas':
              this.correction += 'avec un cône en dessous.'
              objets.push(...cone2.c2d)
              break
            case 'les deux':
              this.correction += 'au milieu avec un cône au-dessus et un autre en dessous.'
              objets.push(...cone1AvecCylindre.c2d)
              objets.push(...cone2.c2d)
              break
            default:
              notify('Chapeau inconnu dans 6G44-2', { exercice: this, tronc, chapeau })
              break
          }
          objets.push(...cylindre.c2d)
          break
        case 'prisme sans':
          this.correction += `de deux pyramides à la même base ${this.getTypeBase(n)}.`
          objets.push(...chapeau1SansPrisme.c2d)
          objets.push(...chapeau2.c2d)
          break
        case 'cylindre sans':
          this.correction += 'de deux cônes ayant la même base.'
          objets.push(...cone2.c2d)
          objets.push(...cone1SansCylindre.c2d)
          break
        default:
          notify('Tronc inconnu dans 6G44-2', { exercice: this, tronc })
          break
      }
      this.question = mathalea2d(Object.assign({}, fixeBordures(objets), { scale: 0.4 }), objets)
      if (this.questionJamaisPosee(j, tronc, chapeau, rayon)) {
        this.listeQuestions.push(this.question)
        this.listeCorrections.push(this.correction)
        j++
      }
      cpt++
    }
    listeQuestionsToContenuSansNumero(this)
  }
}
