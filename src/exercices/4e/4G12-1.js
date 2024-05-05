import { droite } from '../../lib/2d/droites.js'
import { milieu, point, tracePoint } from '../../lib/2d/points.js'
import { polygone } from '../../lib/2d/polygones.js'
import { grille } from '../../lib/2d/reperes.js'
import { segment, vecteur } from '../../lib/2d/segmentsVecteurs.js'
import { texteParPointEchelle } from '../../lib/2d/textes.ts'
import { homothetie, rotation, symetrieAxiale, translation } from '../../lib/2d/transformations.js'
import { choice, shuffle, shuffle2tableaux } from '../../lib/outils/arrayOutils'
import { miseEnEvidence, texteEnCouleurEtGras } from '../../lib/outils/embellissements'
import { texcolors } from '../../lib/format/style'
import { lettreDepuisChiffre, numAlpha, sp } from '../../lib/outils/outilString.js'
import Exercice from '../deprecatedExercice.js'
import { contraindreValeur, gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { context } from '../../modules/context.js'
import { choixDeroulant } from '../../lib/interactif/questionListeDeroulante.js'
import { rotationAnimee, symetrieAnimee, translationAnimee } from '../../modules/2dAnimation.js'
import { colorToLatexOrHTML, mathalea2d, vide2d } from '../../modules/2dGeneralites.js'
import { handleAnswers } from '../../lib/interactif/gestionInteractif.ts'
import { range } from '../../lib/outils/nombres'

export const dateDePublication = '3/12/2021'
export const dateDeModifImportante = '19/10/2023'
export const titre = 'Trouver la transformation'
export const interactifReady = true
export const interactifType = 'listeDeroulante'

export const uuid = '8ac93'
export const ref = '4G12-1'
export const refs = {
  'fr-fr': ['4G12-1'],
  'fr-ch': ['9ES6-17', '10ES2-6']
}
export default function TrouverLaTransformations () {
  Exercice.call(this)
  this.nbQuestions = 1
  this.spacing = 1
  this.nbCols = 1
  this.nbColsCorr = 1
  this.spacing = 1.5
  const A = point(0, 0)
  let typeDeTransfos
  this.sup = 3
  this.sup2 = 3
  const motifs = [
    polygone([point(1, 1), point(2, 1), point(2, 4), point(6, 4), point(6, 5), point(3, 5), point(3, 6), point(1, 6)]),
    polygone([point(1, 1), point(3, 1), point(3, 4), point(6, 4), point(6, 6), point(3, 6), point(3, 5), point(1, 5)]),
    polygone([point(2, 1), point(3, 1), point(3, 3), point(4, 3), point(4, 4), point(3, 4), point(3, 5), point(5, 5), point(5, 6), point(2, 6), point(2, 4), point(1, 4), point(1, 3), point(2, 3)]),
    polygone([point(1, 1), point(4, 1), point(4, 2), point(5, 2), point(5, 4), point(4, 4), point(4, 5), point(3, 5), point(3, 6), point(2, 6), point(2, 2), point(1, 2)]),
    polygone([point(2, 1), point(5, 1), point(5, 3), point(6, 3), point(6, 4), point(4, 4), point(4, 3), point(3, 3), point(3, 5), point(5, 5), point(5, 6), point(2, 6)]),
    polygone([point(1, 1), point(5, 1), point(5, 2), point(2, 2), point(2, 3), point(3, 3), point(3, 4), point(2, 4), point(2, 5), point(4, 5), point(4, 6), point(1, 6)]),
    polygone([point(2, 6), point(2, 1), point(5, 1), point(5, 2), point(3, 2), point(3, 6)]),
    polygone([point(2, 6), point(5, 6), point(5, 5), point(4, 5), point(4, 1), point(1, 1), point(1, 2), point(3, 2), point(3, 5), point(2, 5)]),
    polygone([point(2, 1), point(3, 1), point(6, 1), point(6, 2), point(3, 2), point(3, 3), point(5, 3), point(5, 5), point(3, 5), point(3, 6), point(2, 6)]),
    polygone([point(2, 1), point(3, 1), point(3, 3), point(5, 3), point(5, 6), point(2, 6)]),
    polygone([point(2, 1), point(2, 6), point(5, 6), point(5, 3), point(3, 3), point(5, 1), point(4, 1), point(3, 2), point(3, 1)]),
    polygone([point(2, 1), point(6, 1), point(6, 4), point(3, 4), point(3, 5), point(5, 5), point(5, 6), point(2, 6), point(2, 3), point(5, 3), point(5, 2), point(2, 2)]),
    polygone([point(2, 1), point(4, 1), point(5, 2), point(5, 1), point(6, 1), point(6, 6), point(5, 6), point(5, 3), point(4, 2), point(3, 2), point(3, 6), point(2, 6)]),
    polygone([point(1, 6), point(2, 6), point(4, 3), point(5, 5), point(6, 5), point(4, 1), point(3, 1)]),
    polygone([point(2, 6), point(3, 6), point(4, 4), point(5, 6), point(6, 6), point(3, 1), point(2, 1), point(3, 3)]),
    polygone([point(1, 1), point(6, 1), point(6, 2), point(3, 5), point(5, 5), point(5, 6), point(1, 6), point(5, 2), point(1, 2)]),
    polygone([point(3, 6), point(3, 5), point(2, 5), point(2, 4), point(3, 4), point(3, 3), point(1, 3), point(1, 2), point(3, 2), point(3, 1), point(4, 1), point(4, 2), point(5, 2), point(5, 3), point(4, 3), point(4, 4), point(6, 4), point(6, 5), point(4, 5), point(4, 6)]),
    polygone([point(2, 1), point(3, 3), point(2, 3), point(2, 4), point(6, 4), point(6, 3), point(5, 3), point(5, 1), point(4, 1), point(4, 3), point(3, 1)]),
    polygone([point(2, 2), point(3, 3), point(3, 2), point(4, 3), point(4, 2), point(5, 3), point(5, 2), point(6, 3), point(6, 5), point(2, 5)]),
    polygone([point(1, 1), point(3, 1), point(3, 5), point(5, 5), point(5, 6), point(2, 6), point(2, 2), point(1, 2)]),
    polygone([point(1, 1), point(6, 1), point(6, 2), point(4, 2), point(4, 4), point(5, 4), point(5, 5), point(1, 5), point(1, 4), point(3, 4), point(3, 2), point(1, 2)]),
    polygone([point(2, 1), point(2, 3), point(4, 3), point(4, 4), point(3, 4), point(3, 6), point(6, 6), point(6, 4), point(5, 4), point(5, 3), point(6, 3), point(6, 1), point(5, 1), point(5, 2), point(4, 2), point(4, 1)]),
    polygone([point(2, 6), point(2, 4), point(1, 4), point(1, 2), point(2, 2), point(2, 1), point(3, 1), point(3, 3), point(5, 3), point(5, 4), point(4, 4), point(4, 5), point(3, 5), point(3, 6)]),
    polygone([point(1, 3), point(1, 1), point(3, 1), point(3, 2), point(6, 2), point(6, 5), point(3, 5), point(3, 3)]),
    polygone([point(2, 1), point(2, 2), point(1, 2), point(1, 4), point(2, 4), point(2, 3), point(3, 3), point(3, 2), point(4, 2), point(4, 4), point(3, 4), point(3, 6), point(6, 6), point(6, 4), point(5, 4), point(5, 3), point(6, 3), point(6, 1)]),
    polygone([point(3, 1), point(3, 2), point(1, 2), point(1, 3), point(2, 3), point(2, 4), point(3, 4), point(3, 5), point(5, 5), point(5, 4), point(6, 4), point(6, 3), point(5, 3), point(5, 2), point(4, 2), point(4, 1)])
  ]
  const noeuds = []
  const maGrille = []
  const labels = []
  maGrille.push(grille(0, 0, 16, 16, 'black', 0.2, 0.4))
  for (let i = 0; i < 6; i++) {
    maGrille.push(segment(i * 3.2, 0, i * 3.2, 16))
    maGrille.push(segment(0, i * 3.2, 16, i * 3.2))
    for (let j = 0; j < 6; j++) {
      labels[i * 6 + j] = i * 6 + j < 26 ? lettreDepuisChiffre(i * 6 + j + 1) : lettreDepuisChiffre((i * 6 + j) % 26 + 1) + "'"
      noeuds[i * 6 + j] = point(i * 3.2, j * 3.2, labels[i * 6 + j], 'above right')
      maGrille.push(tracePoint(noeuds[i * 6 + j]))
    }
  }

  function transfoPoly (pol, { type = 'symax', centre, axe, vecteur, angle = 90, sens = true }) {
    switch (type) { // type est l'une des chaines suivantes 'symax', 'trans', 'rot90', 'rot180'
      case 'symax':
        return symetrieAxiale(pol, axe)
      case 'trans':
        return translation(pol, vecteur)
      case 'rot90':
        return rotation(pol, centre, sens ? angle : -angle)
      case 'rot180':
        return rotation(pol, centre, 180)
      default:
        return pol
    }
  }

  // type est le type de transformation (voir ci-dessus)
  // depart est le N° de la figure de départ, arrivee celui de la figure d'arrivée
  // leSens = true pour rotation de sens direct
  // num est un nombre pour définir la couleur de l'élément de départ et celui d'arrivée.
  // poly1 est le polygone de départ (utilisé pour réaliser l'animation)
  function definitElements (type, depart, arrivee, leSens = true, num = 0, poly1) {
    let texte, texteCorr, texteInteractif, animation, axe, centre, vector
    const Est = (arrivee - depart === 6) // si on va vers la droite il y a 6 numéros d'écart entre arrivée et départ sinon, c'est 1 (vers le haut)
    switch (type) {
      case 'symax': // vers l'est la droite est définie par arrivee et arrivee+1 sinon c'est arrivee et arrivee+6
        texteCorr = `La figure ${texteEnCouleurEtGras(depart, texcolors(num + 8))} a pour image la figure ${texteEnCouleurEtGras(arrivee, texcolors(num + 9))} par ${texteEnCouleurEtGras('la symétrie d\'axe ')}$${miseEnEvidence('(' + noeuds[arrivee].nom + (Est ? noeuds[arrivee + 1].nom : noeuds[arrivee + 6].nom) + ')')}$.`
        texte = `La figure ${sp(1)}\\ldots${sp(1)} a pour image la figure ${sp(1)}\\ldots${sp(1)} par la symétrie d'axe $(${sp(1)}\\ldots${sp(1)})$.`
        texteInteractif = `la symétrie d'axe (${noeuds[arrivee].nom}${Est ? noeuds[arrivee + 1].nom : noeuds[arrivee + 6].nom})`
        axe = Est ? droite(noeuds[arrivee], noeuds[arrivee + 1]) : droite(noeuds[arrivee], noeuds[arrivee + 6])
        if (poly1 != null) {
          animation = symetrieAnimee(poly1, axe, 'begin="0s" dur="5s" repeatCount="indefinite"')
        } else animation = vide2d()
        if (context.isHtml) return { animation, depart, arrivee, texte, texteCorr, texteInteractif, type, axe }
        else return { depart, arrivee, texte, texteCorr, texteInteractif, type, axe }
      case 'trans': // facile pour la translation : depart->arrivee
        texteCorr = `La figure ${texteEnCouleurEtGras(depart, texcolors(num + 8))} a pour image la figure ${texteEnCouleurEtGras(arrivee, texcolors(num + 9))} par la translation transformant $${noeuds[depart].nom}$ en $${noeuds[arrivee].nom}$.`
        texte = `La figure ${sp(1)}\\ldots${sp(1)} a pour image la figure ${sp(1)}\\ldots${sp(1)} par la translation transformant ${sp(1)}\\ldots${sp(1)} en ${sp(1)}\\ldots${sp(1)}.`
        texteInteractif = `la translation transformant ${noeuds[depart].nom} en ${noeuds[arrivee].nom}`
        vector = vecteur(noeuds[depart], noeuds[arrivee])
        if (poly1 != null) {
          animation = translationAnimee(poly1, vector, 'begin="0s" dur="5s" repeatCount="indefinite"')
        } else animation = vide2d()
        if (context.isHtml) {
          return {
            animation,
            depart,
            arrivee,
            texte,
            texteCorr,
            texteInteractif,
            type,
            vecteur: vecteur(noeuds[depart], noeuds[arrivee])
          }
        } else {
          return {
            depart,
            arrivee,
            texte,
            texteCorr,
            texteInteractif,
            type,
            vecteur: vecteur(noeuds[depart], noeuds[arrivee])
          }
        }
      case 'rot90': // la position du centre dépend du sens de rotation et de départ et arrivee.
        texteCorr = `La figure ${texteEnCouleurEtGras(depart, texcolors(num + 8))} a pour image la figure ${texteEnCouleurEtGras(arrivee, texcolors(num + 9))} par la rotation de centre $${Est ? (leSens ? noeuds[arrivee + 1].nom : noeuds[arrivee].nom) : (leSens ? noeuds[arrivee].nom : noeuds[arrivee + 6].nom)}$, d'angle $90^\\circ$ dans le sens ${leSens ? 'inverse des aiguilles d\'une montre' : 'des aiguilles d\'une montre'}.`
        texte = `La figure ${sp(1)}\\ldots${sp(1)} a pour image la figure ${sp(1)}\\ldots${sp(1)} par la rotation de centre ${sp(1)}\\ldots${sp(1)}, d'angle $90^\\circ$ dans le sens  ${leSens ? 'inverse des aiguilles d\'une montre' : 'des aiguilles d\'une montre'}.`
        texteInteractif = `la rotation de centre ${Est ? (leSens ? noeuds[arrivee + 1].nom : noeuds[arrivee].nom) : (leSens ? noeuds[arrivee].nom : noeuds[arrivee + 6].nom)}, d'angle 90° dans le sens ${leSens ? 'inverse des aiguilles d\'une montre' : 'des aiguilles d\'une montre'}`
        centre = Est ? (leSens ? noeuds[arrivee + 1] : noeuds[arrivee]) : (leSens ? noeuds[arrivee] : noeuds[arrivee + 6])
        if (poly1 != null) {
          animation = rotationAnimee(poly1, centre, leSens ? 90 : -90, 'begin="0s" dur="5s" repeatCount="indefinite"')
        } else animation = vide2d()
        if (context.isHtml) return { animation, depart, arrivee, texte, texteCorr, texteInteractif, type, centre, sens: leSens }
        else return { depart, arrivee, texte, texteCorr, texteInteractif, type, centre, sens: leSens }
      case 'rot180': // pas besoin du sens, mais le milieu choisit dépend de depart et arrivee
        texteCorr = `La figure ${texteEnCouleurEtGras(depart, texcolors(num + 8))} a pour image la figure ${texteEnCouleurEtGras(arrivee, texcolors(num + 9))} par ${texteEnCouleurEtGras('la symétrie dont le centre est le milieu de ')}$${miseEnEvidence('[' + noeuds[arrivee].nom + (Est ? noeuds[arrivee + 1].nom : noeuds[arrivee + 6].nom)) + ']'}$.`
        texte = `La figure ${sp(1)}\\ldots${sp(1)} a pour image la figure ${sp(1)}\\ldots${sp(1)} par la symétrie dont le centre est le milieu de $[${sp(1)}\\ldots${sp(1)}]$.`
        texteInteractif = `la symétrie dont le centre est le milieu de [${noeuds[arrivee].nom}${Est ? noeuds[arrivee + 1].nom : noeuds[arrivee + 6].nom}]`
        centre = milieu(noeuds[arrivee], Est ? noeuds[arrivee + 1] : noeuds[arrivee + 6])
        if (poly1 != null) {
          animation = rotationAnimee(poly1, centre, 180, 'begin="0s" dur="5s" repeatCount="indefinite"')
        } else animation = vide2d()
        if (context.isHtml) return { animation, depart, arrivee, texte, texteCorr, texteInteractif, type, centre }
        else return { depart, arrivee, texte, texteCorr, texteInteractif, type, centre }
    }
  }

  this.nouvelleVersion = function () {
    this.autoCorrection = []
    this.listeQuestions = []
    this.listeCorrections = []
    if (this.version === 1) {
      this.sup = 1
    } else if (this.version === 2) {
      this.sup = 2
    }
    this.sup = contraindreValeur(1, 3, this.sup, 3)

    const listeSousQuestions = gestionnaireFormulaireTexte({
      saisie: this.sup2,
      min: 1,
      max: 4,
      defaut: 2,
      shuffle: false,
      nbQuestions: 1
    })
    const nbSousQuestions = listeSousQuestions[0]

    if (this.sup === 1) typeDeTransfos = ['symax', 'rot180']
    else if (this.sup === 2) typeDeTransfos = ['symax', 'trans', 'rot180']
    else typeDeTransfos = ['symax', 'trans', 'rot90', 'rot180']

    for (let i = 0, texte, texteCorr, trans; i < this.nbQuestions; i++) {
      const objetsEnonce = []
      const objetsCorrection = []
      const polys = []
      const transfos = []
      polys[0] = homothetie(choice(motifs), A, 0.4)
      for (let x = 0; x < 5; x++) {
        for (let y = 0, dalle, transfoAlea, elements; y < 5; y++) {
          if (x + y > 0) {
            dalle = x * 6 + y
            transfoAlea = choice(typeDeTransfos)
            if (y > 0) {
              elements = definitElements(transfoAlea, dalle - 1, dalle, choice([true, false]))
              polys[dalle] = transfoPoly(polys[dalle - 1], elements)
              if (y === 4) polys[dalle + 1] = vide2d()
            } else {
              elements = definitElements(transfoAlea, dalle - 6, dalle, choice([true, false]))
              polys[dalle] = transfoPoly(polys[dalle - 6], elements)
            }
          }
        }
      }

      const depart = []
      const arrivee = []
      depart[0] = randint(0, 3)
      arrivee[0] = depart[0] + (choice([true, false]) ? 1 : 6)
      transfos[0] = definitElements(choice(typeDeTransfos), depart[0], arrivee[0], choice([true, false]), 12, polys[depart[0]])
      polys[arrivee[0]] = transfoPoly(polys[depart[0]], transfos[0])
      let choixArrivee = []
      for (let ee = 1; ee < 4; ee++) {
        depart[ee] = choice([ee * 6, ee * 6 + 1, ee * 6 + 2, ee * 6 + 3])
        choixArrivee = shuffle([1, 6])
        arrivee[ee] = arrivee.includes(depart[ee] + choixArrivee[0]) ? depart[ee] + choixArrivee[1] : depart[ee] + choixArrivee[0]
        transfos[ee] = definitElements(choice(typeDeTransfos), depart[ee], arrivee[ee], choice([true, false]), 12, polys[depart[ee]])
        polys[arrivee[ee]] = transfoPoly(polys[depart[ee]], transfos[ee])
      }

      for (let x = 0; x < 5; x++) {
        for (let y = 0, numero; y < 5; y++) {
          numero = texteParPointEchelle(Number(x * 6 + y).toString(), point(x * 3.2 + 1.6, y * 3.2 + 1.6), 0, context.isHtml ? 'yellow' : 'black', 1.2, 'milieu', true, 0.4)
          numero.contour = context.isHtml
          numero.couleurDeRemplissage = colorToLatexOrHTML('black')
          numero.opacite = context.isHtml ? 0.5 : 1
          numero.opaciteDeRemplissage = 1
          maGrille.push(numero)
          polys[x * 6 + y].opacite = 0.7
          polys[x * 6 + y].color = colorToLatexOrHTML('blue')
        }
      }
      objetsEnonce.push(...polys)
      objetsCorrection.push(...polys)
      objetsCorrection.push(...maGrille)
      objetsEnonce.push(...maGrille)
      for (let x = 0; x < 6; x++) {
        for (let y = 0, label; y < 6; y++) {
          label = texteParPointEchelle(noeuds[x * 6 + y].nom, translation(noeuds[x * 6 + y], vecteur(0.3, 0.3)), 0, context.isHtml ? 'red' : 'black', 1.2, 'milieu', true, 0.4)
          label.contour = context.isHtml
          label.couleurDeRemplissage = colorToLatexOrHTML('black')
          label.opacite = context.isHtml ? 0.8 : 1
          label.opaciteDeRemplissage = 1
          objetsEnonce.push(label)
          objetsCorrection.push(label)
        }
      }

      const listeQuestionsPossibles = shuffle(range(3))
      for (let ee = 0; ee < this.sup2; ee++) {
        objetsCorrection.push(transfos[listeQuestionsPossibles[ee]].animation)
      }

      const paramsEnonce = { xmin: -0.5, ymin: -0.5, xmax: 17, ymax: 16.5, pixelsParCm: 20, scale: 0.6 }
      const paramsCorrection = { xmin: -0.5, ymin: -0.5, xmax: 17, ymax: 16.5, pixelsParCm: 20, scale: 0.6 }

      texte = mathalea2d(paramsEnonce, objetsEnonce)
      texteCorr = mathalea2d(paramsCorrection, objetsCorrection)

      const textePossible = []
      const texteCorrPossible = []
      const reponsePossible = []
      const propositions = []
      const objetEnonce = []
      for (let k = 0; k < 4; k++) {
        // On va mettre dans les propositions toutes les transformations possibles pour passer de transfo|k].depart à transfo[k].arrivee
        propositions[k] = []
        for (const transforme of typeDeTransfos) {
          switch (transforme) {
            case 'rot90':
              trans = definitElements('rot90', transfos[k].depart, transfos[k].arrivee, false, 12, polys[transfos[k].depart])
              propositions[k].push(
                            `la rotation de centre ${trans.centre.nom}, d'angle 90° dans le sens des aiguilles d'une montre`
              )
              trans = definitElements('rot90', transfos[k].depart, transfos[k].arrivee, true, 12, polys[transfos[k].depart])
              propositions[k].push(
                            `la rotation de centre ${trans.centre.nom}, d'angle 90° dans le sens inverse des aiguilles d'une montre`
              )
              break
            case 'trans':
            //    trans = definitElements('trans', transfos[k].depart, transfos[k].arrivee, true, 12, polys[transfos[k].depart])
              propositions[k].push(
                            `la translation transformant ${noeuds[transfos[k].depart].nom} en ${noeuds[transfos[k].arrivee].nom}`
              )
              break
            case 'rot180':
            //    trans = definitElements('rot180', transfos[k].depart, transfos[k].arrivee, true, 12, polys[transfos[k].depart])
              propositions[k].push(
                            `la symétrie dont le centre est le milieu de [${noeuds[transfos[k].arrivee].nom}${(transfos[k].arrivee - transfos[k].depart === 6) ? noeuds[transfos[k].arrivee + 1].nom : noeuds[transfos[k].arrivee + 6].nom}]`
              )
              break

            case 'symax':
            //    trans = definitElements('symax', transfos[k].depart, transfos[k].arrivee, true, 12, polys[transfos[k].depart])
              propositions[k].push(
                            `la symétrie d'axe (${noeuds[transfos[k].arrivee].nom}${(transfos[k].arrivee - transfos[k].depart === 6) ? noeuds[transfos[k].arrivee + 1].nom : noeuds[transfos[k].arrivee + 6].nom})`
              )
              break
          }
        }
        objetEnonce.push({
          textePossible: this.interactif
            ? `Quelle transformation permet de passer de la figure ${transfos[k].depart} à la figure ${transfos[k].arrivee} ? `
            : `Quelle transformation permet de passer de la figure ${transfos[k].depart} à la figure ${transfos[k].arrivee} ?`,
          texteCorrPossible: transfos[k].texteCorr,
          reponsePossible: transfos[k].texteInteractif
        })
        textePossible.push(this.interactif
          ? `Quelle transformation permet de passer de la figure ${transfos[k].depart} à la figure ${transfos[k].arrivee} ? `
          : `Quelle transformation permet de passer de la figure ${transfos[k].depart} à la figure ${transfos[k].arrivee} ?`)
        texteCorrPossible.push(transfos[k].texteCorr)
        reponsePossible.push(transfos[k].texteInteractif)
      }
      shuffle2tableaux(objetEnonce, propositions)
      for (let ee = 0; ee < nbSousQuestions; ee++) {
        texte += ee > 0 ? '<br>' : ''
        texte += nbSousQuestions > 1 ? numAlpha(ee) : ''
        texte += objetEnonce[ee].textePossible + choixDeroulant(this, i * nbSousQuestions + ee, propositions[ee], 'une réponse')
        texteCorr += ee > 0 ? '<br>' : ''
        texteCorr += nbSousQuestions > 1 ? numAlpha(ee) : ''
        texteCorr += objetEnonce[ee].texteCorrPossible
        handleAnswers(this, i * nbSousQuestions + ee, { reponse: { value: objetEnonce[ee].reponsePossible } }, { formatInteractif: 'listeDeroulante' })
      }
      this.listeQuestions.push(texte)
      this.listeCorrections.push(texteCorr)
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = ['Types de transformations possibles', 3, '1 : Symétries axiales et centrales\n2 : Symétries et translations\n3 : Symétries, translations et quarts de tour']
  this.besoinFormulaire2Texte = ['Nombre de transformations par grille', 'Choix entre 1 et 4']
}
