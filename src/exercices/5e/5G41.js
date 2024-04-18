import { codageAngleDroit } from '../../lib/2d/angles.js'
import { cercle, cercleCentrePoint, traceCompas } from '../../lib/2d/cercle.js'
import { cibleCarree, dansLaCibleCarree } from '../../lib/2d/cibles.js'
import { afficheLongueurSegment, afficheMesureAngle, codageSegments } from '../../lib/2d/codages.js'
import { droite } from '../../lib/2d/droites.js'
import {
  milieu,
  point,
  pointAdistance,
  pointIntersectionCC,
  pointIntersectionDD,
  tracePoint
} from '../../lib/2d/points.js'
import { polygoneAvecNom } from '../../lib/2d/polygones.js'
import { demiDroite, longueur, segment } from '../../lib/2d/segmentsVecteurs.js'
import { labelPoint, texteParPosition } from '../../lib/2d/textes.ts'
import { rotation, similitude } from '../../lib/2d/transformations.js'
import { choice } from '../../lib/outils/arrayOutils'
import { miseEnEvidence, texteEnCouleurEtGras } from '../../lib/outils/embellissements'
import { choisitLettresDifferentes } from '../../lib/outils/aleatoires'
import { arrondi } from '../../lib/outils/nombres'
import { lettreDepuisChiffre, numAlpha } from '../../lib/outils/outilString.js'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { mathalea2d } from '../../modules/2dGeneralites.js'
import { listeQuestionsToContenu, randint, calculANePlusJamaisUtiliser } from '../../modules/outils.js'
import { context } from '../../modules/context.js'

export const titre = 'Construire des quadrilatères particuliers'
export const dateDeModifImportante = '18/04/2024'
export const dateDePublication = '03/02/2020'
export const amcReady = true
export const amcType = 'AMCHybride'
/**
 * Construction de quadrilatères avec dispositif d'auto-correction aléatoire
 * @author Jean-Claude Lhote
 */
export const uuid = '37e37'
export const ref = '5G41'
export const refs = {
  'fr-fr': ['5G41'],
  'fr-ch': ['9ES4-5']
}
export default function ConstructionsParallelogrammesParticuliers () {
  Exercice.call(this)
  this.nbQuestions = 1
  this.nbQuestionsModifiable = false
  this.nbCols = 1
  this.nbColsCorr = 1
  this.sup = 8
  this.correctionDetaillee = false
  this.correctionDetailleeDisponible = true
  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    let texte = ''; let texteCorr = ''
    const celluleAlea = function (rang) {
      const lettre = lettreDepuisChiffre(randint(1, rang))
      const chiffre = Number(randint(1, rang)).toString()
      return lettre + chiffre
    }
    // On prépare la figure...
    const noms = choisitLettresDifferentes(5, 'QOX', true) // on choisit 5 lettres, les 4 premières sont les sommets, la 5e est le centre
    const nom = noms[0] + noms[1] + noms[2] + noms[3]
    let A, B, C, D, O, d1, d2, c1, c2, c3, c4, alpha, tri, t1, t2, t3, t4, t5, dd1, dd2
    const objetsEnonce = []; const objetsCorrection = []
    let typesDeQuestionsDisponibles
    let xm, ym, xM, yM
    if (this.sup < 8) typesDeQuestionsDisponibles = [this.sup]
    else if (this.sup === 8) typesDeQuestionsDisponibles = [randint(1, 3)]
    else if (this.sup === 9) typesDeQuestionsDisponibles = [randint(4, 7)]
    else typesDeQuestionsDisponibles = [randint(1, 7)]

    const typeDeQuestion = choice(typesDeQuestionsDisponibles)
    switch (typeDeQuestion) {
      case 1:
        A = point(0, 0, noms[0])
        c1 = randint(20, 25) // 2 AB
        c4 = randint(20, 30, c1) // 5 AD
        d1 = Math.abs(c4 - c1) + 10
        d2 = c1 + c4 - 15
        c1 = calculANePlusJamaisUtiliser(c1 / 5)
        c4 = calculANePlusJamaisUtiliser(c4 / 5)
        d1 = calculANePlusJamaisUtiliser(randint(Math.min(d1, d2), Math.max(d1, d2)) / 5) // BD
        B = pointAdistance(A, c1, randint(-30, 30), noms[1])
        D = pointIntersectionCC(cercle(A, c4), cercle(B, d1), noms[3])
        O = milieu(B, D, noms[4])
        C = rotation(A, O, 180, noms[2])
        texte = `$${nom}$ est un parallélogramme tel que `
        texte += `$${noms[0] + noms[1]}=${texNombre(c1)}$ cm, $${noms[0] + noms[3]}=${texNombre(c4)}$ cm, $${noms[1] + noms[3]}=${texNombre(d1)}$ cm.<br>`
        objetsEnonce.push(tracePoint(A, B), labelPoint(A, B))
        if (this.correctionDetaillee) {
          texteCorr += `Comme $${nom}$ est un parallélogramme, ses diagonales se coupent en leur milieu.<br>`
          texteCorr += `Nommons $${noms[4]}$, le milieu de $[${noms[1] + noms[3]}]$. $${noms[2]}$ est le symétrique de $${noms[0]}$ par rapport à $${noms[4]}$.`
          texteCorr += `Construisons tout d'abord le triangle $${noms[0] + noms[1] + noms[3]}$.<br>Puis plaçons $${noms[4]}$, le milieu de $[${noms[1] + noms[3]}]$ et enfin le point $${noms[2]}$.<br>`
        }
        if (longueur(B, D) !== longueur(A, C)) {
          texteCorr += `Comme $${noms[0] + noms[3]}\\ne ${noms[0] + noms[1]}$ et que $${noms[0] + noms[2]}\\ne ${noms[3] + noms[1]}$, le paralélogramme $${nom}$ n'est ni un losange, ni un rectangle.<br>`
          texteCorr += `$${miseEnEvidence(nom)}$ ${texteEnCouleurEtGras('n\'est pas un paraléllogramme particulier')}.<br>`
        } else {
          texteCorr += `Comme $$${noms[0] + noms[2]} = ${noms[3] + noms[1]}$ et que $${noms[0] + noms[3]}\\ne ${noms[0] + noms[1]}$, le paralélogramme $${miseEnEvidence(nom)}$ ${texteEnCouleurEtGras('est un rectangle')}.<br>`
        }
        objetsCorrection.push(afficheLongueurSegment(A, B, 'black', -0.5), afficheLongueurSegment(A, D, 'black', 0.5))
        t1 = traceCompas(A, D, 15)
        t2 = traceCompas(B, D, 15)
        t3 = traceCompas(O, C, 20)
        tri = polygoneAvecNom(A, B, D)
        xm = Math.min(A.x, B.x, D.x) - 0.8
        ym = Math.min(A.y, B.y, D.y) - 0.8
        xM = Math.max(A.x, B.x, D.x) + 0.8
        yM = Math.max(A.y, B.y, D.y) + 0.8
        break
      case 2:
        O = point(0, 0, noms[4])
        c1 = randint(25, 35) * 2 // AC
        c4 = calculANePlusJamaisUtiliser(randint((c1 + 4) / 2, 45) / 5) // BD
        c1 = calculANePlusJamaisUtiliser(c1 / 10)
        alpha = randint(100, 130)

        A = pointAdistance(O, c1 / 2, randint(-30, 30), noms[0])
        B = similitude(A, O, alpha, c4 / c1, noms[1])
        D = rotation(B, O, 180, noms[3])
        C = rotation(A, O, 180, noms[2])
        texte = `$${nom}$ est un parallélogramme de centre $${noms[4]}$ tel que `
        texte += `$${noms[0] + noms[2]}=${texNombre(c1)}$ cm, $${noms[1] + noms[3]}=${texNombre(c4)}$ cm et $\\widehat{${noms[0] + noms[4] + noms[1]}}=${alpha}^\\circ$  dans le sens inverse des aiguilles d'une montre.<br>`
        objetsEnonce.push(tracePoint(A, O), labelPoint(A, O))
        if (this.correctionDetaillee) {
          texteCorr += `Comme $${nom}$ est un parallélogramme, ses diagonales se coupent en leur milieu $${noms[4]}$.<br>`
          texteCorr += `$${noms[2]}$ est le symétrique de $${noms[0]}$ par rapport à $${noms[4]}$. La distance $${noms[4] + noms[1]}$ est égale à la moitié de $${noms[1] + noms[3]}$.<br>`
          texteCorr += `Construisons tout d'abord le point $${noms[2]}$ symétrique de $${noms[0]}$ par rapport à $${noms[4]}$.<br>`
          texteCorr += `Construisons ensuite un angle $\\widehat{${noms[0] + noms[4] + 'x'}}$ de mesure $${alpha}^\\circ$ dans le sens inverse des aiguilles d'une montre.<br>`
          texteCorr += `Construisons enfin le point $${noms[1]}$ sur $[${noms[4]}x)$ et son symétrique $${noms[3]}$ par rapport à $${noms[4]}$ situés tous les deux à $${texNombre(arrondi(c4 / 2))}$ cm de $${noms[4]}$.<br>`
        }
        texteCorr += `$${miseEnEvidence(nom)}$ ${texteEnCouleurEtGras('n\'est pas un paraléllogramme particulier')}.<br>`
        xm = Math.min(A.x, B.x, C.x) - 0.8
        ym = Math.min(A.y, B.y, C.y) - 0.8
        xM = Math.max(A.x, B.x, C.x) + 0.8
        yM = Math.max(A.y, B.y, C.y) + 0.8
        break
      case 3:
        A = point(0, 0, noms[0])
        c1 = randint(26, 40) * 2 // AB
        c4 = calculANePlusJamaisUtiliser(randint(15, 25) / 5) // AD
        c1 = calculANePlusJamaisUtiliser(c1 / 10)

        B = pointAdistance(A, c1, randint(-30, 30), noms[1])
        D = similitude(B, A, 90, c4 / c1, noms[3])
        O = milieu(B, D, noms[4])
        C = rotation(A, O, 180, noms[2])
        texte = `$${nom}$ est un parallélogramme tel que `
        texte += `$${noms[0] + noms[1]}=${texNombre(c1)}$ cm, $${noms[0] + noms[3]}=${texNombre(c4)}$ cm, $${noms[1] + noms[3]}=${noms[0] + noms[2]}$.<br>`
        objetsEnonce.push(tracePoint(A, B), labelPoint(A, B))

        if (this.correctionDetaillee) {
          texteCorr += `Désignons $${noms[4]}$ le milieu de $[${noms[1] + noms[3]}]$. $${noms[2]}$ est le symétrique de $${noms[0]}$ par rapport à $${noms[4]}$.<br>`
          texteCorr += `Construisons tout d'abord le triangle $${noms[0] + noms[1] + noms[3]}$ puis $${noms[4]}$ au milieu de $[${noms[1] + noms[3]}]$.<br>`
          texteCorr += `Les quatre sommets de $${nom}$ sont sur le cercle de centre $${noms[4]}$ passant par $${noms[0]}$. $[${noms[0]}${noms[2]}]$ et $[${noms[1]}${noms[3]}]$ sont des diamètres de ce cercle.<br>`
        }
        texteCorr += `Comme $${nom}$ est un parallélogramme dont les diagonales ont la même longueur, $${miseEnEvidence(nom)}$ ${texteEnCouleurEtGras('est donc un rectangle')}.<br>`
        objetsCorrection.push(afficheLongueurSegment(A, B, 'black', -0.5), afficheLongueurSegment(A, D, 'black', 0.5))
        t1 = cercleCentrePoint(O, A, 'gray')
        t1.opacite = 0.5
        t3 = traceCompas(O, C, 20)
        tri = polygoneAvecNom(A, B, D)
        xm = Math.min(A.x, B.x, D.x) - 0.8
        ym = Math.min(A.y, B.y, D.y) - 0.8
        xM = Math.max(A.x, B.x, D.x) + 0.8
        yM = Math.max(A.y, B.y, D.y) + 0.8

        break
      case 4:
        A = point(0, 0, noms[0])
        c1 = randint(15, 30) // AB
        c4 = calculANePlusJamaisUtiliser(randint(15, 20, c1) / 5) // BD
        c1 = calculANePlusJamaisUtiliser(c1 / 5)

        B = pointAdistance(A, c1, randint(-30, 30), noms[1])
        D = pointIntersectionCC(cercle(A, c1), cercle(B, c4), noms[3])
        O = milieu(B, D, noms[4])
        C = rotation(A, O, 180, noms[2])

        texte = `$${nom}$ est un parallélogramme tel que `
        texte += `$${noms[0] + noms[1]}=${texNombre(c1)}$ cm, $${noms[1] + noms[3]}=${texNombre(c4)}$ cm, $[${noms[0] + noms[2]}]\\perp [${noms[1] + noms[3]}]$.<br>`
        objetsEnonce.push(tracePoint(A, B), labelPoint(A, B))

        if (this.correctionDetaillee) {
          texteCorr += `Comme $${nom}$ est un parallélogramme dont les diagonales sont perpendiculaires, c'est un losange et alors `
          texteCorr += `le triangle $${noms[0] + noms[1] + noms[3]}$ est isocèle en $${noms[0]}$.<br>`
          texteCorr += `Construisons tout d'abord le triangle $${noms[0] + noms[1] + noms[3]}$ puis $${noms[4]}$, le milieu de $[${noms[1] + noms[3]}]$ et enfin le point $${noms[2]}$.<br>`
        }
        texteCorr += `Comme $${nom}$ est un parallélogramme dont les diagonales sont perpendiculaires, $${miseEnEvidence(nom)}$ ${texteEnCouleurEtGras('est donc un losange')}.<br>`
        objetsCorrection.push(afficheLongueurSegment(A, B, 'black', -0.5), afficheLongueurSegment(A, D, 'black', 0.5))
        t1 = traceCompas(A, D, 15)
        t2 = traceCompas(B, D, 15)
        t3 = traceCompas(O, C, 20)
        tri = polygoneAvecNom(A, B, D)
        xm = Math.min(A.x, B.x, D.x) - 0.8
        ym = Math.min(A.y, B.y, D.y) - 0.8
        xM = Math.max(A.x, B.x, D.x) + 0.8
        yM = Math.max(A.y, B.y, D.y) + 0.8
        break
      case 5:
        A = point(0, 0, noms[0])
        c1 = randint(20, 35) * 2 // AC
        c4 = calculANePlusJamaisUtiliser(randint((c1 - 4) / 2, 35) / 5) // AD
        c1 = calculANePlusJamaisUtiliser(c1 / 10)
        alpha = randint(95, 120)
        B = pointAdistance(A, c1, randint(-30, 30), noms[1])
        D = similitude(B, A, alpha, c4 / c1, noms[3])
        O = milieu(B, D, noms[4])
        C = rotation(A, O, 180, noms[2])
        texte = `$${nom}$ est un parallélogramme de centre $${noms[4]}$ tel que `
        texte += `$${noms[0] + noms[1]}=${texNombre(c1)}$ cm, $${noms[0] + noms[3]}=${texNombre(c4)}$ cm et $\\widehat{${noms[1] + noms[2] + noms[3]}}=${alpha}^\\circ$  dans le sens inverse des aiguilles d'une montre.<br>`
        objetsEnonce.push(tracePoint(A, B), labelPoint(A, B))
        if (this.correctionDetaillee) {
          texteCorr += `Comme $${nom}$ est un parallélogramme, ses angles opposés ont la même mesure, donc $\\widehat{${noms[3] + noms[0] + noms[1]}}=${alpha}^\\circ$.<br>`
          texteCorr += `Construisons tout d'abord le triangle $${noms[0] + noms[1] + noms[3]}$.<br>`
          texteCorr += `Désignons $${noms[4]}$ le milieu de $[${noms[1] + noms[3]}]$.<br>`
          texteCorr += `Construisons ensuite le point $${noms[2]}$ symétrique  de $${noms[0]}$ par rapport à $${noms[4]}$, milieu de $[${noms[1] + noms[3]}]$.<br>`
        }
        texteCorr += `Comme $${nom}$ est un parallélogramme qui ne possède pas d'angle droit et que ses côtés consécutifs sont de longueurs différentes, `
        texteCorr += `$${miseEnEvidence(nom)}$ ${texteEnCouleurEtGras('n\'est pas un paraléllogramme particulier')}.<br>`
        t1 = traceCompas(A, D, 15)
        t2 = traceCompas(A, B, 15)
        t3 = traceCompas(O, C, 20)
        tri = polygoneAvecNom(A, B, D)
        xm = Math.min(A.x, B.x, D.x) - 0.8
        ym = Math.min(A.y, B.y, D.y) - 0.8
        xM = Math.max(A.x, B.x, D.x) + 0.8
        yM = Math.max(A.y, B.y, D.y) + 0.8
        break
      case 6:
        A = point(0, 0, noms[0])
        c1 = randint(20, 35) * 2 // AC
        c2 = randint(15, 20) * 2 // AO
        c3 = calculANePlusJamaisUtiliser(c1 + randint(5, 10) * 2) - c2 // BO
        c1 = calculANePlusJamaisUtiliser(c1 / 10)
        c2 = calculANePlusJamaisUtiliser(c2 / 10)
        c3 = calculANePlusJamaisUtiliser(c3 / 10)

        B = pointAdistance(A, c1, randint(-30, 30), noms[1])
        O = pointIntersectionCC(cercle(A, c2), cercle(B, c3), noms[4])
        C = rotation(A, O, 180, noms[2])
        D = rotation(B, O, 180, noms[3])
        texte = `$${nom}$ est un parallélogramme de centre $${noms[4]}$ tel que `
        texte += `$${noms[0] + noms[1]}=${texNombre(c1)}$ cm, $${noms[4] + noms[2]}=${texNombre(c2)}$ cm et $${noms[4] + noms[3]}=${texNombre(c3)}$ cm.<br>`
        objetsEnonce.push(tracePoint(A, B), labelPoint(A, B))
        if (this.correctionDetaillee) {
          texteCorr += `Comme $${nom}$ est un parallélogramme, ses diagonales se coupent en leur milieu $${noms[4]}$.<br>`
          texteCorr += `On en déduit que $${noms[0] + noms[4]}=${noms[4] + noms[2]}=${texNombre(c2)}$ cm et que $${noms[1] + noms[4]}=${noms[4] + noms[3]}=${texNombre(c3)}$ cm.<br>`
          texteCorr += `Construisons tout d'abord le triangle $${noms[0] + noms[1] + noms[4]}$ `
          texteCorr += `puis les points $${noms[2]}$ et $${noms[3]}$ symétriques respectifs de $${noms[0]}$ et $${noms[1]}$ par rapport à $${noms[4]}$.<br>`
        }
        if (c1 * c1 !== (c2 * c2 + c3 * c3)) {
          texteCorr += `Le triangle $${noms[0] + noms[1] + noms[4]}$ n'est pas un triangle rectangle, donc les diagonales ne sont pas perpendiculaires.<br>`
          if (c2 === c3) texteCorr += `Les diagonales ont la même longueur. $${nom}$ est un parallélogramme dont les diagonales sont de même longueur, $${miseEnEvidence(nom)}$ ${texteEnCouleurEtGras('est donc un rectangle')}.<br>`
          else texteCorr += `De plus, elles n'ont pas la même longueur, donc $${miseEnEvidence(nom)}$ ${texteEnCouleurEtGras('n\'est pas un paraléllogramme particulier')}.<br>`
        } else {
          texteCorr += `Le triangle $${noms[0] + noms[1] + noms[4]}$ est un triangle rectangle, donc les diagonales sont perpendiculaires.<br>`
          if (c2 === c3) texteCorr += `de plus les diagonales ont même longueur. $${nom}$ est un parallélogramme dont les diagonales sont perpendiculaires et de même longueur, $${miseEnEvidence(nom)}$ ${texteEnCouleurEtGras('est donc un carré')}.<br>`
        }
        texteCorr += '.<br>'
        t1 = traceCompas(A, O, 20)
        t2 = traceCompas(B, O, 20)
        t3 = traceCompas(O, C, 30)
        t4 = traceCompas(O, D, 30)

        tri = polygoneAvecNom(A, B, O)
        xm = Math.min(A.x, B.x, O.x) - 0.8
        ym = Math.min(A.y, B.y, O.y) - 0.8
        xM = Math.max(A.x, B.x, O.x) + 0.8
        yM = Math.max(A.y, B.y, O.y) + 0.8
        break
      case 7:
        A = point(0, 0, noms[0])
        c1 = calculANePlusJamaisUtiliser(randint(30, 40) / 5) // AC
        c2 = randint(25, 40)// angle OAB
        c3 = randint(30, 45, c2) // angle OCB

        C = pointAdistance(A, c1, randint(-30, 30), noms[2])
        O = milieu(A, C, noms[4])
        B = rotation(C, A, c2)
        dd1 = droite(A, B)
        D = rotation(A, C, -c3)
        dd2 = droite(C, D)
        B = pointIntersectionDD(dd1, dd2, noms[1])
        D = rotation(B, O, 180, noms[3])
        texte = `$${nom}$ est un parallélogramme de centre $${noms[4]}$ tel que `
        texte += `$${noms[0] + noms[2]}=${texNombre(c1)}$ cm.<br>$\\widehat{${noms[4] + noms[0] + noms[1]}}=${c2}^\\circ$  dans le sens inverse des aiguilles d'une montre.<br>$\\widehat{${noms[4] + noms[2] + noms[1]}}=${c3}^\\circ$  dans le sens des aiguilles d'une montre.<br>`
        objetsEnonce.push(tracePoint(A, C), labelPoint(A, C))
        if (this.correctionDetaillee) {
          texteCorr += `Comme $${nom}$ est un parallélogramme, ses côtés opposés sont parallèles.<br>`
          texteCorr += `La diagonale $[${noms[0]}${noms[2]}]$ forme des angles $\\widehat{${noms[4] + noms[0] + noms[1]}}$ et $\\widehat{${noms[4] + noms[2] + noms[3]}}$ alternes-internes égaux.<br>`
          texteCorr += `De même les angles $\\widehat{${noms[4] + noms[0] + noms[3]}}$ et $\\widehat{${noms[4] + noms[2] + noms[1]}}$ sont alternes-internes égaux eux aussi.<br>`
          texteCorr += `On en déduit que $\\widehat{${noms[4] + noms[0] + noms[3]}}=\\widehat{${noms[4] + noms[2] + noms[1]}}=${miseEnEvidence(c3, 'red')}^\\circ$ et que $\\widehat{${noms[4] + noms[0] + noms[1]}}=\\widehat{${noms[4] + noms[2] + noms[3]}}=${miseEnEvidence(c2, 'blue')}^\\circ$.<br>`
          texteCorr += `Construisons tout d'abord le triangle $${noms[0] + noms[1] + noms[2]}$ `
          texteCorr += `puis le point $${noms[3]}$ symétrique de $${noms[1]}$ par rapport à $${noms[4]}$.<br>`
        }

        texteCorr += `Le triangle $${noms[0] + noms[1] + noms[2]}$ n'est pas un triangle isocèle car ses angles ne sont pas égaux.<br>`
        texteCorr += `De plus, dans ce triangle $${noms[0] + noms[1] + noms[2]}$,  l'angle $\\widehat{${noms[0] + noms[1] + noms[2]}}$ mesure $${180 - c2 - c3}^\\circ$ et n'est pas droit donc $${miseEnEvidence(nom)}$ ${texteEnCouleurEtGras('n\'est pas un paraléllogramme particulier')}.<br>`
        t1 = afficheMesureAngle(O, A, B, 'blue', 1, texNombre(c2) + '^\\circ')
        t2 = afficheMesureAngle(O, C, B, 'red', 1, texNombre(c3) + '^\\circ')
        t3 = traceCompas(O, D, 30)
        t5 = tracePoint(O)
        t5.style = '+'
        objetsCorrection.push(t1, t2)
        tri = polygoneAvecNom(A, B, C)
        xm = Math.min(A.x, B.x, C.x) - 0.8
        ym = Math.min(A.y, B.y, C.y) - 0.8
        xM = Math.max(A.x, B.x, C.x) + 0.8
        yM = Math.max(A.y, B.y, C.y) + 0.8
        break
    }
    let texteAMC = texte + `Construire le parallélogramme $${nom}$<br><br>`
    texte += `Construire le parallélogramme $${nom}$ et préciser si c'est un paraléllogramme particulier.<br>`
    texteAMC += 'Les sommets manquants devraient se trouver respectivement dans les cibles ci-dessous.'
    texteAMC += '<br>Une fois la construction terminée et afin de vérifier votre soin, noircir, ci-contre, pour chacune des cibles,'
    texteAMC += ' la lettre et le chiffre correspondants à la case dans laquelle se trouve le sommet construit.'

    const p = polygoneAvecNom(A, B, C, D)

    const xMin = Math.min(A.x, B.x, C.x, D.x) - 2
    const yMin = Math.min(A.y, B.y, C.y, D.y) - 2
    const xMax = Math.max(A.x, B.x, C.x, D.x) + 2
    const yMax = Math.max(A.y, B.y, C.y, D.y) + 2

    const cellule1 = celluleAlea(5)
    const cellule2 = celluleAlea(5)
    const cellule3 = celluleAlea(5)
    const result1 = dansLaCibleCarree(B.x, B.y, 5, 0.3, cellule3)
    const result2 = dansLaCibleCarree(C.x, C.y, 5, 0.3, cellule1)
    const result3 = dansLaCibleCarree(D.x, D.y, 5, 0.3, cellule2)
    const cible1 = cibleCarree({ x: result1[0], y: result1[1], rang: 5, num: typeDeQuestion === 7 ? 2 : 3, taille: 0.4, color: 'gray' })
    cible1.taille = 0.3
    cible1.opacite = 0.7
    const cible2 = cibleCarree({ x: result2[0], y: result2[1], rang: 5, num: 2, taille: 0.4, color: 'gray' })
    cible2.taille = 0.3
    cible2.opacite = 0.7
    const cible3 = cibleCarree({ x: result3[0], y: result3[1], rang: 5, num: 1, taille: 0.4, color: 'gray' })
    cible3.taille = 0.3
    cible3.opacite = 0.7
    dd1 = segment(O, A)
    dd2 = segment(O, B)
    const dd3 = segment(O, C)
    const dd4 = segment(O, D)

    switch (typeDeQuestion) {
      case 1:
        if (this.correctionDetaillee) texteCorr += mathalea2d({ xmin: xm, ymin: ym, xmax: xM, ymax: yM, pixelsParCm: 25, scale: 1 }, objetsCorrection, t1, t2, tri[0], tri[1], afficheLongueurSegment(D, B)) + '<br>'
        objetsEnonce.push(cible3, cible2)
        objetsCorrection.push(p[0], p[1], t3)
        objetsCorrection.push(cible3, cible2, dd1, dd2, dd3, dd4, labelPoint(O), codageSegments('||', 'red', A, O, O, C), codageSegments('|||', 'blue', B, O, O, D), afficheLongueurSegment(O, B))
        break
      case 2:
        // if (this.correctionDetaillee) texteCorr += mathalea2d({ xmin: xm, ymin: ym, xmax: xM, ymax: yM, pixelsParCm: 25, scale: 1 }, codageSegments('||', 'red', A, O, O, C), t3, dd1, dd3, dd2, afficheMesureAngle(A, O, B, 'black', 1, alpha + '^\\circ'), tracePoint(A, O, C), labelPoint(A, O, C), texteParPosition('x', B.x - 0.5, B.y), afficheLongueurSegment(A, O), afficheLongueurSegment(O, C)) + '<br>'
        if (this.correctionDetaillee) texteCorr += mathalea2d({ xmin: xm, ymin: ym, xmax: xM, ymax: yM, pixelsParCm: 25, scale: 1 }, codageSegments('||', 'red', A, O, O, C), dd1, dd3, dd2, afficheMesureAngle(A, O, B, 'black', 1, alpha + '^\\circ'), tracePoint(A, O, C), labelPoint(A, O, C), texteParPosition('x', B.x - 0.5, B.y), afficheLongueurSegment(A, O), afficheLongueurSegment(O, C)) + '<br>'
        objetsEnonce.push(cible3, cible2, cible1)
        // objetsCorrection.push(p[0], p[1], t3, afficheLongueurSegment(O, D))
        objetsCorrection.push(p[0], p[1], afficheLongueurSegment(O, D))
        objetsCorrection.push(cible3, cible2, cible1, dd1, dd2, dd3, dd4, labelPoint(O), codageSegments('||', 'red', A, O, O, C), codageSegments('|||', 'blue', B, O, O, D), afficheMesureAngle(A, O, B, 'black', 1, alpha + '^\\circ'))

        break
      case 3:
        if (this.correctionDetaillee) texteCorr += mathalea2d({ xmin: xm, ymin: ym, xmax: xM, ymax: yM, pixelsParCm: 25, scale: 1 }, objetsCorrection, tri[0], tri[1], codageAngleDroit(D, A, B)) + '<br>'
        objetsEnonce.push(cible3, cible2)
        objetsCorrection.push(p[0], p[1], t1, t3)
        objetsCorrection.push(cible3, cible2, dd1, dd2, dd3, dd4, labelPoint(O), codageSegments('||', 'red', A, O, O, C), codageSegments('||', 'red', B, O, O, D))

        break
      case 4:
        if (this.correctionDetaillee) texteCorr += mathalea2d({ xmin: xm, ymin: ym, xmax: xM, ymax: yM, pixelsParCm: 25, scale: 1 }, objetsCorrection, tri[0], tri[1], afficheLongueurSegment(D, B), t2, traceCompas(A, B, 60), traceCompas(A, D, 60)) + '<br>'
        objetsEnonce.push(cible3, cible2)
        objetsCorrection.push(p[0], p[1], t3, afficheLongueurSegment(O, B))
        objetsCorrection.push(codageAngleDroit(A, O, D), cible3, cible2, dd1, dd2, dd3, dd4, labelPoint(O), codageSegments('||', 'red', A, O, O, C), codageSegments('|||', 'blue', B, O, O, D))
        break
      case 5:
        if (this.correctionDetaillee) texteCorr += mathalea2d({ xmin: xm, ymin: ym, xmax: xM, ymax: yM, pixelsParCm: 25, scale: 1 }, tri[0], tri[1], demiDroite(A, B), demiDroite(A, D), afficheMesureAngle(B, A, D, 'black', 1, alpha + '^\\circ'), afficheLongueurSegment(A, B), afficheLongueurSegment(A, D)) + '<br>'
        objetsEnonce.push(cible3, cible2)
        objetsCorrection.push(p[0], p[1], t3)
        objetsCorrection.push(cible3, cible2, dd1, dd2, dd3, dd4, labelPoint(O), codageSegments('||', 'red', A, O, O, C), codageSegments('|||', 'blue', B, O, O, D), afficheMesureAngle(B, A, D, 'black', 1, alpha + '^\\circ'), afficheLongueurSegment(B, A), afficheLongueurSegment(A, D), afficheLongueurSegment(C, B), afficheLongueurSegment(D, C))

        break
      case 6:
        // if (this.correctionDetaillee) texteCorr += mathalea2d({ xmin: xm, ymin: ym, xmax: xM, ymax: yM, pixelsParCm: 25, scale: 1 }, objetsCorrection, tri[0], tri[1], afficheLongueurSegment(B, A), afficheLongueurSegment(O, B), afficheLongueurSegment(A, O), t1, t2, t5) + '<br>'
        if (this.correctionDetaillee) texteCorr += mathalea2d({ xmin: xm, ymin: ym, xmax: xM, ymax: yM, pixelsParCm: 25, scale: 1 }, objetsCorrection, tri[0], tri[1], afficheLongueurSegment(B, A), afficheLongueurSegment(O, B), afficheLongueurSegment(A, O), t1, t2) + '<br>'
        objetsEnonce.push(cible3, cible2)
        objetsCorrection.push(p[0], p[1], t3, t4)
        objetsCorrection.push(cible3, cible2, dd1, dd2, dd3, dd4, labelPoint(O), codageSegments('||', 'red', A, O, O, C), codageSegments('|||', 'blue', B, O, O, D))
        break
      case 7:
        if (this.correctionDetaillee) texteCorr += mathalea2d({ xmin: xm, ymin: ym, xmax: xM, ymax: yM, pixelsParCm: 25, scale: 1 }, objetsCorrection, tri[0], tri[1], afficheLongueurSegment(C, O), afficheLongueurSegment(O, A), labelPoint(O), t5, codageSegments('||', 'red', A, O, O, C)) + '<br>'
        objetsEnonce.push(cible3, cible1)
        objetsCorrection.push(p[0], p[1], t3)
        objetsCorrection.push(cible3, t1, t2, t3, cible1, dd1, dd2, dd3, dd4, labelPoint(O), codageSegments('||', 'red', A, O, O, C), codageSegments('|||', 'blue', B, O, O, D), afficheMesureAngle(O, A, D, 'red', 1, texNombre(c3) + '^\\circ'), afficheMesureAngle(O, C, D, 'blue', 1, texNombre(c2) + '^\\circ'))
        break
    }
    texte += mathalea2d({ xmin: xMin, ymin: yMin, xmax: xMax, ymax: yMax, pixelsParCm: 25, scale: 1 }, objetsEnonce)
    texteAMC += '<br>' + mathalea2d({ xmin: xMin, ymin: yMin, xmax: xMax, ymax: yMax, pixelsParCm: 25, scale: 1 }, objetsEnonce)
    texteCorr += mathalea2d({ xmin: xMin, ymin: yMin, xmax: xMax, ymax: yMax, pixelsParCm: 25, scale: 1 }, objetsCorrection)

    if (context.isAmc) {
      // Construction des QCM valables en AMC
      const reponseLettres = ['A', 'B', 'C', 'D', 'E']
      const reponseChiffres = ['1', '2', '3', '4', '5']

      const propositionsQcm1 = []
      for (let ee = 0; ee < 5; ee++) {
        propositionsQcm1.push({
          texte: reponseLettres[ee],
          statut: cellule3[0] === reponseLettres[ee]
        })
      }

      const propositionsQcm2 = []
      for (let ee = 0; ee < 5; ee++) {
        propositionsQcm2.push({
          texte: ee + 1,
          statut: cellule3[1] === reponseChiffres[ee]
        })
      }

      const propositionsQcm3 = []
      for (let ee = 0; ee < 5; ee++) {
        propositionsQcm3.push({
          texte: reponseLettres[ee],
          statut: typeDeQuestion === 7 ? cellule1[0] === reponseLettres[ee] : cellule2[0] === reponseLettres[ee]
        })
      }

      const propositionsQcm4 = []
      for (let ee = 0; ee < 5; ee++) {
        propositionsQcm4.push({
          texte: ee + 1,
          statut: typeDeQuestion === 7 ? cellule1[1] === reponseChiffres[ee] : cellule2[1] === reponseChiffres[ee]
        })
      }

      this.autoCorrection[0] = {}
      this.autoCorrection[0].options = {
        ordered: true, barreseparation: true, multicolsAll: true
      }
      this.autoCorrection[0].enonce = ''// texte
      this.autoCorrection[0].propositions =
         [
           {
             type: 'AMCOpen',
             propositions: [{
               texte: texteCorr,
               enonce: texteAMC,
               statut: 0,
               sanscadre: true
             }]
           },
           {
             type: 'qcmMono',
             propositions: propositionsQcm1,
             enonce: numAlpha(0) + 'Pour la cible 1 : <br>Lettre de la case du sommet construit, dans la cible 1'
           },
           {
             type: 'qcmMono',
             propositions: propositionsQcm2,
             enonce: 'Chiffre de la case du sommet construit, dans la cible 1'
           },
           {
             type: 'qcmMono',
             propositions: propositionsQcm3,
             enonce: '\\vspace{1cm}' + numAlpha(1) + 'Pour la cible 2 : <br>Lettre de la case du sommet construit, dans la cible 2'
           },
           {
             type: 'qcmMono',
             propositions: propositionsQcm4,
             enonce: 'Chiffre de la case du sommet construit, dans la cible 2'
           }]

      if (typeDeQuestion === 2) {
        const propositionsQcm5 = []
        for (let ee = 0; ee < 5; ee++) {
          propositionsQcm5.push({
            texte: reponseLettres[ee],
            statut: cellule1[0] === reponseLettres[ee]
          })
        }

        const propositionsQcm6 = []
        for (let ee = 0; ee < 5; ee++) {
          propositionsQcm6.push({
            texte: ee + 1,
            statut: cellule1[1] === reponseChiffres[ee]
          })
        }

        this.autoCorrection[0].propositions.push(
          {
            type: 'qcmMono',
            propositions: propositionsQcm3,
            enonce: '\\vspace{1cm}' + numAlpha(2) + 'Pour la cible 3 : <br>Lettre de la case du sommet construit, dans la cible 3'
          },
          {
            type: 'qcmMono',
            propositions: propositionsQcm4,
            enonce: 'Chiffre de la case du sommet construit, dans la cible 3'
          }
        )
      }
    }

    this.listeQuestions.push(texte)
    this.listeCorrections.push(texteCorr)
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = [
    'Choix des questions',
    4,
    '1 : Figure facile 1\n2 : Figure facile 2 (3 sommets à placer)\n3 : Figure facile 3 \n4 : Figure moins facile 1\n5 : Figure moins facile 2\n6 : Figure moins facile 3\n7 : Figure moins facile 4\n8 : Une des figures faciles choisie au hasard\n9 : Une des figures moins faciles choisie au hasard\n10 : Une de toutes ces figures choisie au hasard'
  ]
}
