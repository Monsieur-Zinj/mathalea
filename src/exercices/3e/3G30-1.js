import { codageAngleDroit } from '../../lib/2d/angles.js'
import { afficheMesureAngle, texteSurSegment } from '../../lib/2d/codages.js'
import { droite } from '../../lib/2d/droites.js'
import { point, pointSurSegment } from '../../lib/2d/points.js'
import { nommePolygone, polygone } from '../../lib/2d/polygones.js'
import { longueur, segment } from '../../lib/2d/segmentsVecteurs.js'
import { texteParPoint } from '../../lib/2d/textes.ts'
import { projectionOrtho, rotation, similitude } from '../../lib/2d/transformations.js'
import { choice, shuffleLettres } from '../../lib/outils/arrayOutils'
import { creerNomDePolygone, numAlpha } from '../../lib/outils/outilString.js'
import { fixeBordures, mathalea2d } from '../../modules/2dGeneralites.js'
import { context } from '../../modules/context.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import Exercice from '../deprecatedExercice.js'
import { setReponse } from '../../lib/interactif/gestionInteractif'

export const titre = 'Exprimer le cosinus, le sinus ou la tangente d\'un angle en fonction des côtés du triangle'
export const amcReady = true
export const amcType = 'AMCHybride'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '16/01/2021'
/**
 * @author Rémi Angot
 * Donner un rapport trigonométrique en fonction des longueurs des côtés (pas de valeurs numériques)
 * * Donner les 3 rapports d'un angle
 * * Un triangle est donné, on demande les 6 rapports
 * * Un triangle rectangle et une hauteur, il faut exprimer un rapport de deux manières différentes
 * Rendu interactif et AMC par EE (Mars 2022)
 */
export const uuid = '0d1f7'
export const ref = '3G30-1'
export const refs = {
  'fr-fr': ['3G30-1'],
  'fr-ch': []
}
export default function ExprimerCosSinTan () {
  Exercice.call(this)
  this.nbQuestions = 1
  this.nbQuestionsModifiable = true
  this.nbCols = 1
  this.nbColsCorr = 1
  this.sup = 1
  if (context.isHtml) {
    this.spacing = 2
    this.spacingCorr = 3
  } else {
    this.spacing = 2
    this.spacingCorr = 2
  }

  this.nouvelleVersion = function () {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []
    this.sup = Number(this.sup)
    for (let i = 0; i < this.nbQuestions; i++) {
      let texte = ''
      let texteCorr = ''
      const objetsEnonce = []
      const objetsCorrection = []
      let choixRapportTrigo
      const propositionsAMC = []
      let texteInit
      const a = point(0, 0)
      const b = point(randint(3, 7), 0)
      const c = similitude(b, a, 90, randint(3, 7) / longueur(a, b))
      const angleRot = randint(0, 360)
      const p1 = polygone(a, b, c)
      const p2 = rotation(p1, a, angleRot)
      const A = p2.listePoints[0]
      const B = p2.listePoints[1]
      const C = p2.listePoints[2]
      const codage = codageAngleDroit(B, A, C)
      let nom = creerNomDePolygone(4, ['DQJ']) // J est enlevé car à côté du I, difficile de faire la différence
      nom = shuffleLettres(nom)

      // const nom = ['A', 'B', 'C', 'H'] // Pratique pour le débuggage
      A.nom = nom[0]
      B.nom = nom[1]
      C.nom = nom[2]
      const nomme = nommePolygone(p2, nom)
      const t1 = texteSurSegment('hypoténuse', C, B)
      let t2, t3, t22, t32, codageAngle, codageAngle2
      if (context.isHtml) {
        t2 = texteSurSegment('adjacent à ⍺', B, A)
        t3 = texteSurSegment('opposé à ⍺', A, C)
        t22 = texteSurSegment('opposé à 𝛽', B, A)
        t32 = texteSurSegment('adjacent à 𝛽', A, C)
        codageAngle = afficheMesureAngle(A, B, C, 'red', 1.5, '\\alpha')
        codageAngle2 = afficheMesureAngle(A, C, B, 'red', 1.5, '\\beta')
      } else {
        t2 = texteSurSegment('adjacent à $\\alpha$', B, A)
        t3 = texteSurSegment('opposé à $\\alpha$', A, C)
        t22 = texteSurSegment('opposé à $\\beta$', B, A)
        t32 = texteSurSegment('adjacent à $\\beta$', A, C)
        codageAngle = afficheMesureAngle(A, B, C, 'red', 1.5, '\\alpha')
        codageAngle2 = afficheMesureAngle(A, C, B, 'red', 1.5, '\\beta')
      }
      const hypo = segment(C, B, 'blue')
      hypo.epaisseur = 2
      codageAngle.epaisseur = 3
      codageAngle2.epaisseur = 3
      const d = droite(B, C)
      d.isVisible = false
      const H = projectionOrtho(A, d)
      const pointNomH = pointSurSegment(H, A, -0.5)
      const codage2 = codageAngleDroit(A, H, B)
      H.nom = nom[3]
      const t4 = texteParPoint(H.nom, pointNomH)
      const sAH = segment(A, H)
      const t13 = texteSurSegment('hypoténuse', B, A)
      let t23
      let t33
      if (context.isHtml) {
        t23 = texteSurSegment('opposé à ⍺', A, H)
        t33 = texteSurSegment('adjacent à ⍺', H, B)
      } else {
        t23 = texteSurSegment('opposé à $\\alpha$', A, H)
        t33 = texteSurSegment('adjacent à $\\alpha$', H, B)
      }
      const hypo3 = segment(A, B, 'blue')
      hypo3.epaisseur = 2

      objetsEnonce.push(p2, codage, nomme)
      objetsCorrection.push(p2, codage, nomme, t1, t2, t3, hypo, codageAngle)

      if (this.sup === 3) {
        objetsEnonce.push(sAH, t4, codage2)
      }

      const paramsEnonce = Object.assign({}, fixeBordures([A, B, C], {
        rxmin: -1,
        rxmax: 1,
        rymin: -1,
        rymax: 1
      }), { scale: 0.5, pixelsParCm: 20, mainlevee: false })
      const paramsCorrection = Object.assign({}, fixeBordures([A, B, C], {
        rxmin: -1,
        rxmax: 1,
        rymin: -1,
        rymax: 1
      }), {
        scale: 0.5,
        pixelsParCm: 20,
        mainlevee: false
      })
      if (!context.isHtml && !context.isAmc) {
        texte += '\\begin{minipage}{.4\\linewidth}\n'
      }
      texte += mathalea2d(paramsEnonce, objetsEnonce) + '<br>'
      if (!context.isHtml && !context.isAmc) {
        texte += '\n\\end{minipage}\n'
        texte += '\\begin{minipage}{.6\\linewidth}\n'
      }
      if (this.sup === 1) {
        texteInit = texte
        texteInit += `Dans le triangle rectangle $${A.nom + B.nom + C.nom}$ et à l'aide des longueurs $${A.nom + B.nom}$, $${A.nom + C.nom}$, $${B.nom + C.nom}$ :`
        texte += `Compléter à l'aide des longueurs $${A.nom + B.nom}$, $${A.nom + C.nom}$, $${B.nom + C.nom}$ : `
        texte += `<br>$\\cos\\left(\\widehat{${A.nom + B.nom + C.nom}}\\right)=$`
        if (!context.isAmc) {
          texte += !this.interactif ? ' $\\ldots$' : ajouteChampTexteMathLive(this, 3 * i, 'inline nospacebefore college6eme alphanumeric', { tailleExtensible: true })
          setReponse(this, 3 * i, [
                            `\\frac{${A.nom + B.nom}}{${B.nom + C.nom}}`,
                            `\\frac{${B.nom + A.nom}}{${B.nom + C.nom}}`,
                            `\\frac{${A.nom + B.nom}}{${C.nom + B.nom}}`,
                            `\\frac{${B.nom + A.nom}}{${C.nom + B.nom}}`],
          { formatInteractif: 'texte' })
        } else {
          propositionsAMC[0] =
                        {
                          type: 'qcmMono',
                          enonce: `${numAlpha(0)} Exprimer $\\cos\\left(\\widehat{${A.nom + B.nom + C.nom}}\\right).$<br>`,
                          propositions: [
                            {
                              texte: `$\\frac{${A.nom + B.nom}}{${B.nom + C.nom}}$`,
                              statut: true,
                              feedback: ''
                            },
                            {
                              texte: `$\\frac{${A.nom + C.nom}}{${B.nom + C.nom}}$`,
                              statut: false,
                              feedback: ''
                            },
                            {
                              texte: `$\\frac{${A.nom + B.nom}}{${A.nom + C.nom}}$`,
                              statut: false,
                              feedback: ''
                            },
                            {
                              texte: `$\\frac{${B.nom + C.nom}}{${A.nom + C.nom}}$`,
                              statut: false,
                              feedback: ''
                            },
                            {
                              texte: `$\\frac{${A.nom + C.nom}}{${A.nom + B.nom}}$`,
                              statut: false,
                              feedback: ''
                            },
                            {
                              texte: `$\\frac{${B.nom + C.nom}}{${A.nom + B.nom}}$`,
                              statut: false,
                              feedback: ''
                            }
                          ]
                        }
        }
        texte += `<br>$\\sin\\left(\\widehat{${A.nom + B.nom + C.nom}}\\right)=$`
        if (!context.isAmc) {
          texte += !this.interactif ? ' $\\ldots$' : ajouteChampTexteMathLive(this, 3 * i + 1, 'inline nospacebefore college6eme alphanumeric', { tailleExtensible: true })
          setReponse(this, 3 * i + 1, [
                            `\\frac{${A.nom + C.nom}}{${B.nom + C.nom}}`,
                            `\\frac{${C.nom + A.nom}}{${B.nom + C.nom}}`,
                            `\\frac{${A.nom + C.nom}}{${C.nom + B.nom}}`,
                            `\\frac{${C.nom + A.nom}}{${C.nom + B.nom}}`],
          { formatInteractif: 'texte' })
        } else {
          propositionsAMC[1] =
                        {
                          type: 'qcmMono',
                          enonce: `${numAlpha(1)} Exprimer $\\sin\\left(\\widehat{${A.nom + B.nom + C.nom}}\\right).$<br>`,
                          propositions: [
                            {
                              texte: `$\\frac{${A.nom + B.nom}}{${B.nom + C.nom}}$`,
                              statut: false,
                              feedback: ''
                            },
                            {
                              texte: `$\\frac{${A.nom + C.nom}}{${B.nom + C.nom}}$`,
                              statut: true,
                              feedback: ''
                            },
                            {
                              texte: `$\\frac{${A.nom + B.nom}}{${A.nom + C.nom}}$`,
                              statut: false,
                              feedback: ''
                            },
                            {
                              texte: `$\\frac{${B.nom + C.nom}}{${A.nom + C.nom}}$`,
                              statut: false,
                              feedback: ''
                            },
                            {
                              texte: `$\\frac{${A.nom + C.nom}}{${A.nom + B.nom}}$`,
                              statut: false,
                              feedback: ''
                            },
                            {
                              texte: `$\\frac{${B.nom + C.nom}}{${A.nom + B.nom}}$`,
                              statut: false,
                              feedback: ''
                            }
                          ]
                        }
        }
        texte += `<br>$\\tan\\left(\\widehat{${A.nom + B.nom + C.nom}}\\right)=$`
        if (!context.isAmc) {
          texte += !this.interactif ? ' $\\ldots$' : ajouteChampTexteMathLive(this, 3 * i + 2, 'inline nospacebefore college6eme alphanumeric', { tailleExtensible: true })
          setReponse(this, 3 * i + 2, [
                            `\\frac{${A.nom + C.nom}}{${A.nom + B.nom}}`,
                            `\\frac{${A.nom + C.nom}}{${B.nom + A.nom}}`,
                            `\\frac{${C.nom + A.nom}}{${A.nom + B.nom}}`,
                            `\\frac{${C.nom + A.nom}}{${B.nom + A.nom}}`],
          { formatInteractif: 'texte' })
        } else {
          propositionsAMC[2] =
                        {
                          type: 'qcmMono',
                          enonce: `${numAlpha(2)} Exprimer $\\tan\\left(\\widehat{${A.nom + B.nom + C.nom}}\\right).$<br>`,
                          propositions: [
                            {
                              texte: `$\\frac{${A.nom + B.nom}}{${B.nom + C.nom}}$`,
                              statut: false,
                              feedback: ''
                            },
                            {
                              texte: `$\\frac{${A.nom + C.nom}}{${B.nom + C.nom}}$`,
                              statut: false,
                              feedback: ''
                            },
                            {
                              texte: `$\\frac{${A.nom + B.nom}}{${A.nom + C.nom}}$`,
                              statut: false,
                              feedback: ''
                            },
                            {
                              texte: `$\\frac{${B.nom + C.nom}}{${A.nom + C.nom}}$`,
                              statut: false,
                              feedback: ''
                            },
                            {
                              texte: `$\\frac{${A.nom + C.nom}}{${A.nom + B.nom}}$`,
                              statut: true,
                              feedback: ''
                            },
                            {
                              texte: `$\\frac{${B.nom + C.nom}}{${A.nom + B.nom}}$`,
                              statut: false,
                              feedback: ''
                            }
                          ]
                        }
        }
      } else if (this.sup === 2) {
        texte += 'Exprimer les 6 rapports trigonométriques pour ce triangle rectangle, en fonction des longueurs respectives de ses côtés.'
        texteInit = texte
        if (!context.isAmc) {
          texte += `<br>$\\cos\\left(\\widehat{${A.nom + B.nom + C.nom}}\\right)=$`
          texte += !this.interactif ? ' $\\ldots$' : ajouteChampTexteMathLive(this, 6 * i, 'inline nospacebefore college6eme alphanumeric', { tailleExtensible: true })
          setReponse(this, 6 * i, [
                            `\\frac{${A.nom + B.nom}}{${B.nom + C.nom}}`,
                            `\\frac{${B.nom + A.nom}}{${B.nom + C.nom}}`,
                            `\\frac{${A.nom + B.nom}}{${C.nom + B.nom}}`,
                            `\\frac{${B.nom + A.nom}}{${C.nom + B.nom}}`],
          { formatInteractif: 'texte' })
          texte += `<br>$\\sin\\left(\\widehat{${A.nom + B.nom + C.nom}}\\right)=$`
          texte += !this.interactif ? ' $\\ldots$' : ajouteChampTexteMathLive(this, 6 * i + 1, 'inline nospacebefore college6eme alphanumeric', { tailleExtensible: true })
          setReponse(this, 6 * i + 1, [
                            `\\frac{${A.nom + C.nom}}{${B.nom + C.nom}}`,
                            `\\frac{${C.nom + A.nom}}{${B.nom + C.nom}}`,
                            `\\frac{${A.nom + C.nom}}{${C.nom + B.nom}}`,
                            `\\frac{${C.nom + A.nom}}{${C.nom + B.nom}}`],
          { formatInteractif: 'texte' })
          texte += `<br>$\\tan\\left(\\widehat{${A.nom + B.nom + C.nom}}\\right)=$`
          texte += !this.interactif ? ' $\\ldots$' : ajouteChampTexteMathLive(this, 6 * i + 2, 'inline nospacebefore college6eme alphanumeric', { tailleExtensible: true })
          setReponse(this, 6 * i + 2, [
                            `\\frac{${A.nom + C.nom}}{${A.nom + B.nom}}`,
                            `\\frac{${A.nom + C.nom}}{${B.nom + A.nom}}`,
                            `\\frac{${C.nom + A.nom}}{${A.nom + B.nom}}`,
                            `\\frac{${C.nom + A.nom}}{${B.nom + A.nom}}`],
          { formatInteractif: 'texte' })
          texte += `<br>$\\cos\\left(\\widehat{${A.nom + C.nom + B.nom}}\\right)=$`
          texte += !this.interactif ? ' $\\ldots$' : ajouteChampTexteMathLive(this, 6 * i + 3, 'inline nospacebefore college6eme alphanumeric', { tailleExtensible: true })
          setReponse(this, 6 * i + 3, [
                            `\\frac{${A.nom + C.nom}}{${B.nom + C.nom}}`,
                            `\\frac{${C.nom + A.nom}}{${B.nom + C.nom}}`,
                            `\\frac{${A.nom + C.nom}}{${C.nom + B.nom}}`,
                            `\\frac{${C.nom + A.nom}}{${C.nom + B.nom}}`],
          { formatInteractif: 'texte' })
          texte += `<br>$\\sin\\left(\\widehat{${A.nom + C.nom + B.nom}}\\right)=$`
          texte += !this.interactif ? ' $\\ldots$' : ajouteChampTexteMathLive(this, 6 * i + 4, 'inline nospacebefore college6eme alphanumeric', { tailleExtensible: true })
          setReponse(this, 6 * i + 4, [
                            `\\frac{${A.nom + B.nom}}{${B.nom + C.nom}}`,
                            `\\frac{${B.nom + A.nom}}{${B.nom + C.nom}}`,
                            `\\frac{${A.nom + B.nom}}{${C.nom + B.nom}}`,
                            `\\frac{${B.nom + A.nom}}{${C.nom + B.nom}}`],
          { formatInteractif: 'texte' })
          texte += `<br>$\\tan\\left(\\widehat{${A.nom + C.nom + B.nom}}\\right)=$`
          texte += !this.interactif ? ' $\\ldots$' : ajouteChampTexteMathLive(this, 6 * i + 5, 'inline nospacebefore college6eme alphanumeric', { tailleExtensible: true })
          setReponse(this, 6 * i + 5, [
                            `\\frac{${A.nom + B.nom}}{${A.nom + C.nom}}`,
                            `\\frac{${B.nom + A.nom}}{${A.nom + C.nom}}`,
                            `\\frac{${A.nom + B.nom}}{${C.nom + A.nom}}`,
                            `\\frac{${B.nom + A.nom}}{${C.nom + A.nom}}`],
          { formatInteractif: 'texte' })
        } else {
          propositionsAMC[0] =
                        {
                          type: 'qcmMono',
                          enonce: `${numAlpha(0)} Exprimer $\\cos\\left(\\widehat{${A.nom + B.nom + C.nom}}\\right).$<br>`,
                          propositions: [
                            {
                              texte: `$\\frac{${A.nom + B.nom}}{${B.nom + C.nom}}$`,
                              statut: true,
                              feedback: ''
                            },
                            {
                              texte: `$\\frac{${A.nom + C.nom}}{${B.nom + C.nom}}$`,
                              statut: false,
                              feedback: ''
                            },
                            {
                              texte: `$\\frac{${A.nom + B.nom}}{${A.nom + C.nom}}$`,
                              statut: false,
                              feedback: ''
                            },
                            {
                              texte: `$\\frac{${B.nom + C.nom}}{${A.nom + C.nom}}$`,
                              statut: false,
                              feedback: ''
                            },
                            {
                              texte: `$\\frac{${A.nom + C.nom}}{${A.nom + B.nom}}$`,
                              statut: false,
                              feedback: ''
                            },
                            {
                              texte: `$\\frac{${B.nom + C.nom}}{${A.nom + B.nom}}$`,
                              statut: false,
                              feedback: ''
                            }
                          ]
                        }
          propositionsAMC[1] =
                        {
                          type: 'qcmMono',
                          enonce: `${numAlpha(1)} Exprimer $\\sin\\left(\\widehat{${A.nom + B.nom + C.nom}}\\right).$<br>`,
                          propositions: [
                            {
                              texte: `$\\frac{${A.nom + B.nom}}{${B.nom + C.nom}}$`,
                              statut: false,
                              feedback: ''
                            },
                            {
                              texte: `$\\frac{${A.nom + C.nom}}{${B.nom + C.nom}}$`,
                              statut: true,
                              feedback: ''
                            },
                            {
                              texte: `$\\frac{${A.nom + B.nom}}{${A.nom + C.nom}}$`,
                              statut: false,
                              feedback: ''
                            },
                            {
                              texte: `$\\frac{${B.nom + C.nom}}{${A.nom + C.nom}}$`,
                              statut: false,
                              feedback: ''
                            },
                            {
                              texte: `$\\frac{${A.nom + C.nom}}{${A.nom + B.nom}}$`,
                              statut: false,
                              feedback: ''
                            },
                            {
                              texte: `$\\frac{${B.nom + C.nom}}{${A.nom + B.nom}}$`,
                              statut: false,
                              feedback: ''
                            }
                          ]
                        }
          propositionsAMC[2] =
                        {
                          type: 'qcmMono',
                          enonce: `${numAlpha(2)} Exprimer $\\tan\\left(\\widehat{${A.nom + B.nom + C.nom}}\\right).$<br>`,
                          propositions: [
                            {
                              texte: `$\\frac{${A.nom + B.nom}}{${B.nom + C.nom}}$`,
                              statut: false,
                              feedback: ''
                            },
                            {
                              texte: `$\\frac{${A.nom + C.nom}}{${B.nom + C.nom}}$`,
                              statut: false,
                              feedback: ''
                            },
                            {
                              texte: `$\\frac{${A.nom + B.nom}}{${A.nom + C.nom}}$`,
                              statut: false,
                              feedback: ''
                            },
                            {
                              texte: `$\\frac{${B.nom + C.nom}}{${A.nom + C.nom}}$`,
                              statut: false,
                              feedback: ''
                            },
                            {
                              texte: `$\\frac{${A.nom + C.nom}}{${A.nom + B.nom}}$`,
                              statut: true,
                              feedback: ''
                            },
                            {
                              texte: `$\\frac{${B.nom + C.nom}}{${A.nom + B.nom}}$`,
                              statut: false,
                              feedback: ''
                            }
                          ]
                        }
          propositionsAMC[3] =
                        {
                          type: 'qcmMono',
                          enonce: `${numAlpha(3)} Exprimer $\\cos\\left(\\widehat{${A.nom + C.nom + B.nom}}\\right).$<br>`,
                          propositions: [
                            {
                              texte: `$\\frac{${A.nom + B.nom}}{${B.nom + C.nom}}$`,
                              statut: false,
                              feedback: ''
                            },
                            {
                              texte: `$\\frac{${A.nom + C.nom}}{${B.nom + C.nom}}$`,
                              statut: true,
                              feedback: ''
                            },
                            {
                              texte: `$\\frac{${A.nom + B.nom}}{${A.nom + C.nom}}$`,
                              statut: false,
                              feedback: ''
                            },
                            {
                              texte: `$\\frac{${B.nom + C.nom}}{${A.nom + C.nom}}$`,
                              statut: false,
                              feedback: ''
                            },
                            {
                              texte: `$\\frac{${A.nom + C.nom}}{${A.nom + B.nom}}$`,
                              statut: false,
                              feedback: ''
                            },
                            {
                              texte: `$\\frac{${B.nom + C.nom}}{${A.nom + B.nom}}$`,
                              statut: false,
                              feedback: ''
                            }
                          ]
                        }
          propositionsAMC[4] =
                        {
                          type: 'qcmMono',
                          enonce: `${numAlpha(4)} Exprimer $\\sin\\left(\\widehat{${A.nom + C.nom + B.nom}}\\right).$<br>`,
                          propositions: [
                            {
                              texte: `$\\frac{${A.nom + B.nom}}{${B.nom + C.nom}}$`,
                              statut: true,
                              feedback: ''
                            },
                            {
                              texte: `$\\frac{${A.nom + C.nom}}{${B.nom + C.nom}}$`,
                              statut: false,
                              feedback: ''
                            },
                            {
                              texte: `$\\frac{${A.nom + B.nom}}{${A.nom + C.nom}}$`,
                              statut: false,
                              feedback: ''
                            },
                            {
                              texte: `$\\frac{${B.nom + C.nom}}{${A.nom + C.nom}}$`,
                              statut: false,
                              feedback: ''
                            },
                            {
                              texte: `$\\frac{${A.nom + C.nom}}{${A.nom + B.nom}}$`,
                              statut: false,
                              feedback: ''
                            },
                            {
                              texte: `$\\frac{${B.nom + C.nom}}{${A.nom + B.nom}}$`,
                              statut: false,
                              feedback: ''
                            }
                          ]
                        }
          propositionsAMC[5] =
                        {
                          type: 'qcmMono',
                          enonce: `${numAlpha(5)} Exprimer $\\tan\\left(\\widehat{${A.nom + C.nom + B.nom}}\\right).$<br>`,
                          propositions: [
                            {
                              texte: `$\\frac{${A.nom + B.nom}}{${B.nom + C.nom}}$`,
                              statut: false,
                              feedback: ''
                            },
                            {
                              texte: `$\\frac{${A.nom + C.nom}}{${B.nom + C.nom}}$`,
                              statut: false,
                              feedback: ''
                            },
                            {
                              texte: `$\\frac{${A.nom + B.nom}}{${A.nom + C.nom}}$`,
                              statut: true,
                              feedback: ''
                            },
                            {
                              texte: `$\\frac{${B.nom + C.nom}}{${A.nom + C.nom}}$`,
                              statut: false,
                              feedback: ''
                            },
                            {
                              texte: `$\\frac{${A.nom + C.nom}}{${A.nom + B.nom}}$`,
                              statut: false,
                              feedback: ''
                            },
                            {
                              texte: `$\\frac{${B.nom + C.nom}}{${A.nom + B.nom}}$`,
                              statut: false,
                              feedback: ''
                            }
                          ]
                        }
        }
      } else {
        texteInit = texte
        choixRapportTrigo = choice(['le cosinus', 'le sinus', 'la tangente'])
        texte += `Exprimer ${choixRapportTrigo} de $\\widehat{${A.nom + B.nom + C.nom}}$ de deux manières différentes.`
        if (!context.isAmc) {
          switch (choixRapportTrigo) {
            case 'le cosinus':
              texte += `<br>Parmi deux triangles, dans le triangle rectangle le plus grand, $\\cos\\left(\\widehat{${A.nom + B.nom + C.nom}}\\right)=$`
              texte += !this.interactif ? ' $\\ldots$' : ajouteChampTexteMathLive(this, 2 * i, 'inline nospacebefore college6eme alphanumeric', { tailleExtensible: true })
              setReponse(this, 2 * i, [
                                    `\\frac{${A.nom + B.nom}}{${B.nom + C.nom}}`,
                                    `\\frac{${B.nom + A.nom}}{${B.nom + C.nom}}`,
                                    `\\frac{${A.nom + B.nom}}{${C.nom + B.nom}}`,
                                    `\\frac{${B.nom + A.nom}}{${C.nom + B.nom}}`],
              { formatInteractif: 'texte' })
              texte += `<br>Parmi deux triangles, dans le triangle rectangle le plus petit, $\\cos\\left(\\widehat{${A.nom + B.nom + C.nom}}\\right)=$`
              texte += !this.interactif ? ' $\\ldots$' : ajouteChampTexteMathLive(this, 2 * i + 1, 'inline nospacebefore college6eme alphanumeric', { tailleExtensible: true })
              setReponse(this, 2 * i + 1, [
                                    `\\frac{${B.nom + H.nom}}{${A.nom + B.nom}}`,
                                    `\\frac{${B.nom + H.nom}}{${B.nom + A.nom}}`,
                                    `\\frac{${H.nom + B.nom}}{${A.nom + B.nom}}`,
                                    `\\frac{${H.nom + B.nom}}{${B.nom + A.nom}}`],
              { formatInteractif: 'texte' })
              break
            case 'le sinus' :
              texte += `<br>Parmi deux triangles, dans le triangle rectangle le plus grand, $\\sin\\left(\\widehat{${A.nom + B.nom + C.nom}}\\right)=$`
              texte += !this.interactif ? ' $\\ldots$' : ajouteChampTexteMathLive(this, 2 * i, 'inline nospacebefore college6eme alphanumeric', { tailleExtensible: true })
              setReponse(this, 2 * i, [
                                    `\\frac{${A.nom + C.nom}}{${B.nom + C.nom}}`,
                                    `\\frac{${C.nom + A.nom}}{${B.nom + C.nom}}`,
                                    `\\frac{${A.nom + C.nom}}{${C.nom + B.nom}}`,
                                    `\\frac{${C.nom + A.nom}}{${C.nom + B.nom}}`],
              { formatInteractif: 'texte' })
              texte += `<br>Parmi deux triangles, dans le triangle rectangle le plus petit, $\\sin\\left(\\widehat{${A.nom + B.nom + C.nom}}\\right)=$`
              texte += !this.interactif ? ' $\\ldots$' : ajouteChampTexteMathLive(this, 2 * i + 1, 'inline nospacebefore college6eme alphanumeric', { tailleExtensible: true })
              setReponse(this, 2 * i + 1, [
                                    `\\frac{${A.nom + H.nom}}{${A.nom + B.nom}}`,
                                    `\\frac{${A.nom + H.nom}}{${B.nom + A.nom}}`,
                                    `\\frac{${H.nom + A.nom}}{${A.nom + B.nom}}`,
                                    `\\frac{${H.nom + A.nom}}{${B.nom + A.nom}}`],
              { formatInteractif: 'texte' })
              break
            case 'la tangente' :
              texte += `<br>Parmi deux triangles, dans le triangle rectangle le plus grand, $\\tan\\left(\\widehat{${A.nom + B.nom + C.nom}}\\right)=$`
              texte += !this.interactif ? ' $\\ldots$' : ajouteChampTexteMathLive(this, 2 * i, 'inline nospacebefore college6eme alphanumeric', { tailleExtensible: true })
              setReponse(this, 2 * i, [
                                    `\\frac{${A.nom + C.nom}}{${B.nom + A.nom}}`,
                                    `\\frac{${C.nom + A.nom}}{${B.nom + A.nom}}`,
                                    `\\frac{${A.nom + C.nom}}{${A.nom + B.nom}}`,
                                    `\\frac{${C.nom + A.nom}}{${A.nom + B.nom}}`],
              { formatInteractif: 'texte' })
              texte += `<br>Parmi deux triangles, dans le triangle rectangle le plus petit, $\\tan\\left(\\widehat{${A.nom + B.nom + C.nom}}\\right)=$`
              texte += !this.interactif ? ' $\\ldots$' : ajouteChampTexteMathLive(this, 2 * i + 1, 'inline nospacebefore college6eme alphanumeric', { tailleExtensible: true })
              setReponse(this, 2 * i + 1, [
                                    `\\frac{${A.nom + H.nom}}{${H.nom + B.nom}}`,
                                    `\\frac{${A.nom + H.nom}}{${B.nom + H.nom}}`,
                                    `\\frac{${H.nom + A.nom}}{${H.nom + B.nom}}`,
                                    `\\frac{${H.nom + A.nom}}{${B.nom + H.nom}}`],
              { formatInteractif: 'texte' })
              break
          }
        } else {
          switch (choixRapportTrigo) {
            case 'le cosinus':
              propositionsAMC[0] =
                                {
                                  type: 'qcmMono',
                                  enonce: `${numAlpha(0)}Exprimer $\\cos\\left(\\widehat{${A.nom + B.nom + C.nom}}\\right)$ dans le triangle rectangle $${A.nom + B.nom + C.nom}$.<br>`,
                                  propositions: [
                                    {
                                      texte: `$\\frac{${A.nom + B.nom}}{${B.nom + C.nom}}$`,
                                      statut: true,
                                      feedback: ''
                                    },
                                    {
                                      texte: `$\\frac{${A.nom + C.nom}}{${B.nom + C.nom}}$`,
                                      statut: false,
                                      feedback: ''
                                    },
                                    {
                                      texte: `$\\frac{${A.nom + B.nom}}{${A.nom + C.nom}}$`,
                                      statut: false,
                                      feedback: ''
                                    },
                                    {
                                      texte: `$\\frac{${B.nom + C.nom}}{${A.nom + C.nom}}$`,
                                      statut: false,
                                      feedback: ''
                                    },
                                    {
                                      texte: `$\\frac{${A.nom + C.nom}}{${A.nom + B.nom}}$`,
                                      statut: false,
                                      feedback: ''
                                    },
                                    {
                                      texte: `$\\frac{${B.nom + C.nom}}{${A.nom + B.nom}}$`,
                                      statut: false,
                                      feedback: ''
                                    }
                                  ]
                                }
              propositionsAMC[1] =
                                {
                                  type: 'qcmMono',
                                  enonce: `${numAlpha(1)}Exprimer $\\cos\\left(\\widehat{${A.nom + B.nom + C.nom}}\\right)$ dans le triangle rectangle $${A.nom + H.nom + B.nom}$.<br>`,
                                  propositions: [
                                    {
                                      texte: `$\\frac{${A.nom + H.nom}}{${A.nom + B.nom}}$`,
                                      statut: false,
                                      feedback: ''
                                    },
                                    {
                                      texte: `$\\frac{${B.nom + H.nom}}{${A.nom + B.nom}}$`,
                                      statut: true,
                                      feedback: ''
                                    },
                                    {
                                      texte: `$\\frac{${A.nom + B.nom}}{${A.nom + H.nom}}$`,
                                      statut: false,
                                      feedback: ''
                                    },
                                    {
                                      texte: `$\\frac{${B.nom + H.nom}}{${A.nom + H.nom}}$`,
                                      statut: false,
                                      feedback: ''
                                    },
                                    {
                                      texte: `$\\frac{${A.nom + B.nom}}{${B.nom + H.nom}}$`,
                                      statut: false,
                                      feedback: ''
                                    },
                                    {
                                      texte: `$\\frac{${A.nom + H.nom}}{${B.nom + H.nom}}$`,
                                      statut: false,
                                      feedback: ''
                                    }
                                  ]
                                }
              break
            case 'le sinus' :
              propositionsAMC[0] =
                                {
                                  type: 'qcmMono',
                                  enonce: `${numAlpha(0)}Exprimer $\\sin\\left(\\widehat{${A.nom + B.nom + C.nom}}\\right)$ dans le triangle rectangle $${A.nom + B.nom + C.nom}$.<br>`,
                                  propositions: [
                                    {
                                      texte: `$\\frac{${A.nom + B.nom}}{${B.nom + C.nom}}$`,
                                      statut: false,
                                      feedback: ''
                                    },
                                    {
                                      texte: `$\\frac{${A.nom + C.nom}}{${B.nom + C.nom}}$`,
                                      statut: true,
                                      feedback: ''
                                    },
                                    {
                                      texte: `$\\frac{${A.nom + B.nom}}{${A.nom + C.nom}}$`,
                                      statut: false,
                                      feedback: ''
                                    },
                                    {
                                      texte: `$\\frac{${B.nom + C.nom}}{${A.nom + C.nom}}$`,
                                      statut: false,
                                      feedback: ''
                                    },
                                    {
                                      texte: `$\\frac{${A.nom + C.nom}}{${A.nom + B.nom}}$`,
                                      statut: false,
                                      feedback: ''
                                    },
                                    {
                                      texte: `$\\frac{${B.nom + C.nom}}{${A.nom + B.nom}}$`,
                                      statut: false,
                                      feedback: ''
                                    }
                                  ]
                                }
              propositionsAMC[1] =
                                {
                                  type: 'qcmMono',
                                  enonce: `${numAlpha(1)}Exprimer $\\sin\\left(\\widehat{${A.nom + B.nom + C.nom}}\\right)$ dans le triangle rectangle $${A.nom + H.nom + B.nom}$.<br>`,
                                  propositions: [
                                    {
                                      texte: `$\\frac{${A.nom + H.nom}}{${A.nom + B.nom}}$`,
                                      statut: true,
                                      feedback: ''
                                    },
                                    {
                                      texte: `$\\frac{${B.nom + H.nom}}{${A.nom + B.nom}}$`,
                                      statut: false,
                                      feedback: ''
                                    },
                                    {
                                      texte: `$\\frac{${A.nom + B.nom}}{${A.nom + H.nom}}$`,
                                      statut: false,
                                      feedback: ''
                                    },
                                    {
                                      texte: `$\\frac{${B.nom + H.nom}}{${A.nom + H.nom}}$`,
                                      statut: false,
                                      feedback: ''
                                    },
                                    {
                                      texte: `$\\frac{${A.nom + B.nom}}{${B.nom + H.nom}}$`,
                                      statut: false,
                                      feedback: ''
                                    },
                                    {
                                      texte: `$\\frac{${A.nom + H.nom}}{${B.nom + H.nom}}$`,
                                      statut: false,
                                      feedback: ''
                                    }
                                  ]
                                }
              break
            case 'la tangente' :
              propositionsAMC[0] =
                                {
                                  type: 'qcmMono',
                                  enonce: `${numAlpha(0)}Exprimer $\\tan\\left(\\widehat{${A.nom + B.nom + C.nom}}\\right)$ dans le triangle rectangle $${A.nom + B.nom + C.nom}$.<br>`,
                                  propositions: [
                                    {
                                      texte: `$\\frac{${A.nom + B.nom}}{${B.nom + C.nom}}$`,
                                      statut: false,
                                      feedback: ''
                                    },
                                    {
                                      texte: `$\\frac{${A.nom + C.nom}}{${B.nom + C.nom}}$`,
                                      statut: false,
                                      feedback: ''
                                    },
                                    {
                                      texte: `$\\frac{${A.nom + B.nom}}{${A.nom + C.nom}}$`,
                                      statut: false,
                                      feedback: ''
                                    },
                                    {
                                      texte: `$\\frac{${B.nom + C.nom}}{${A.nom + C.nom}}$`,
                                      statut: false,
                                      feedback: ''
                                    },
                                    {
                                      texte: `$\\frac{${A.nom + C.nom}}{${A.nom + B.nom}}$`,
                                      statut: true,
                                      feedback: ''
                                    },
                                    {
                                      texte: `$\\frac{${B.nom + C.nom}}{${A.nom + B.nom}}$`,
                                      statut: false,
                                      feedback: ''
                                    }
                                  ]
                                }
              propositionsAMC[1] =
                                {
                                  type: 'qcmMono',
                                  enonce: `${numAlpha(1)}Exprimer $\\tan\\left(\\widehat{${A.nom + B.nom + C.nom}}\\right)$ dans le triangle rectangle $${A.nom + H.nom + B.nom}$.<br>`,
                                  propositions: [
                                    {
                                      texte: `$\\frac{${A.nom + H.nom}}{${A.nom + B.nom}}$`,
                                      statut: false,
                                      feedback: ''
                                    },
                                    {
                                      texte: `$\\frac{${B.nom + H.nom}}{${A.nom + B.nom}}$`,
                                      statut: false,
                                      feedback: ''
                                    },
                                    {
                                      texte: `$\\frac{${A.nom + B.nom}}{${A.nom + H.nom}}$`,
                                      statut: false,
                                      feedback: ''
                                    },
                                    {
                                      texte: `$\\frac{${B.nom + H.nom}}{${A.nom + H.nom}}$`,
                                      statut: false,
                                      feedback: ''
                                    },
                                    {
                                      texte: `$\\frac{${A.nom + B.nom}}{${B.nom + H.nom}}$`,
                                      statut: false,
                                      feedback: ''
                                    },
                                    {
                                      texte: `$\\frac{${A.nom + H.nom}}{${B.nom + H.nom}}$`,
                                      statut: true,
                                      feedback: ''
                                    }
                                  ]
                                }
              break
          }
        }
      }

      if (!context.isHtml && !context.isAmc) {
        texte += '\n\\end{minipage}\n'
      }
      if (this.sup === 1 || this.sup === 2 || this.sup === 3) {
        texteCorr += mathalea2d(paramsCorrection, objetsCorrection)
      }
      if (this.sup === 2) {
        const objetsCorrection2 = [p2, codage, nomme, t1, t22, t32, hypo, codageAngle2]
        texteCorr += mathalea2d(paramsCorrection, objetsCorrection2)
      }
      if (this.sup === 3) {
        const objetsCorrection3 = [p2, codage2, nomme, t13, t23, t33, t4, hypo3, codageAngle, sAH]
        texteCorr += mathalea2d(paramsCorrection, objetsCorrection3)
      }

      if (this.sup === 1 || this.sup === 2) {
        texteCorr += `<br>$${A.nom + B.nom + C.nom}$ est rectangle en $${A.nom}$ donc :`
        texteCorr += `<br>$\\cos\\left(\\widehat{${A.nom + B.nom + C.nom}}\\right)=\\dfrac{${A.nom + B.nom}}{${B.nom + C.nom}}$ ;`
        texteCorr += `<br>$\\sin\\left(\\widehat{${A.nom + B.nom + C.nom}}\\right)=\\dfrac{${A.nom + C.nom}}{${B.nom + C.nom}}$ ;`
        texteCorr += `<br>$\\tan\\left(\\widehat{${A.nom + B.nom + C.nom}}\\right)=\\dfrac{${A.nom + C.nom}}{${A.nom + B.nom}}$.`
      }
      if (this.sup === 2) {
        texteCorr += `<br>$\\cos\\left(\\widehat{${A.nom + C.nom + B.nom}}\\right)=\\dfrac{${A.nom + C.nom}}{${B.nom + C.nom}}$ ;`
        texteCorr += `<br>$\\sin\\left(\\widehat{${A.nom + C.nom + B.nom}}\\right)=\\dfrac{${A.nom + B.nom}}{${B.nom + C.nom}}$ ;`
        texteCorr += `<br>$\\tan\\left(\\widehat{${A.nom + C.nom + B.nom}}\\right)=\\dfrac{${A.nom + B.nom}}{${A.nom + C.nom}}$.`
      } else if (this.sup === 3) {
        if (choixRapportTrigo === 'le cosinus') {
          texteCorr += `<br>$${A.nom + B.nom + C.nom}$ est rectangle en $${A.nom}$ donc `
          if (!context.isHtml && !context.isAmc) {
            texteCorr += '<br>'
          }
          texteCorr += `$\\cos\\left(\\widehat{${A.nom + B.nom + C.nom}}\\right)=\\dfrac{${A.nom + B.nom}}{${B.nom + C.nom}}$ ;`
          texteCorr += `<br>$${A.nom + B.nom + H.nom}$ est rectangle en $${H.nom}$ donc `
          texteCorr += `$\\cos\\left(\\widehat{${A.nom + B.nom + C.nom}}\\right)=\\dfrac{${B.nom + H.nom}}{${A.nom + B.nom}}$.`
        } else if (choixRapportTrigo === 'le sinus') {
          texteCorr += `<br>$${A.nom + B.nom + C.nom}$ est rectangle en $${A.nom}$ donc `
          if (!context.isHtml) {
            texteCorr += '<br>'
          }
          texteCorr += `$\\sin\\left(\\widehat{${A.nom + B.nom + C.nom}}\\right)=\\dfrac{${A.nom + C.nom}}{${B.nom + C.nom}}$ ;`
          texteCorr += `<br>$${A.nom + B.nom + H.nom}$ est rectangle en $${H.nom}$ donc `
          texteCorr += `$\\sin\\left(\\widehat{${A.nom + B.nom + C.nom}}\\right)=\\dfrac{${A.nom + H.nom}}{${A.nom + B.nom}}$.`
        } else {
          texteCorr += `<br>$${A.nom + B.nom + C.nom}$ est rectangle en $${A.nom}$ donc `
          if (!context.isHtml) {
            texteCorr += '<br>'
          }
          texteCorr += `$\\tan\\left(\\widehat{${A.nom + B.nom + C.nom}}\\right)=\\dfrac{${A.nom + C.nom}}{${A.nom + B.nom}}$ ;`
          texteCorr += `<br>$${A.nom + B.nom + H.nom}$ est rectangle en $${H.nom}$ donc `
          texteCorr += `$\\tan\\left(\\widehat{${A.nom + B.nom + C.nom}}\\right)=\\dfrac{${A.nom + H.nom}}{${B.nom + H.nom}}$.`
        }
      }

      if (context.isAmc) {
        this.autoCorrection[i] = {
          enonce: texteInit + '\\\\\n',
          enonceAvant: true,
          options: { multicols: false, barreseparation: true, multicolsAll: true, numerotationEnonce: true },
          propositions: propositionsAMC
        }
      }
      if (this.questionJamaisPosee(i, nom)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
      }
    }
    listeQuestionsToContenu(this) // On envoie l'exercice à la fonction de mise en page
  }

  this.besoinFormulaireNumerique = ['Type de questions', 3, '1 : Compléter 3 rapports trigonométriques\n2 : Donner les 6 rapports trigonométriques\n3 : Deux triangles imbriqués, donner un rapport de deux manières différentes']
}
