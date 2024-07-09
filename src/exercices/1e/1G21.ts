import Exercice from '../Exercice'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { toTex } from '../../modules/outilsMathjs'
import { Vecteur } from '../../lib/2d/segmentsVecteurs'
import { Point, milieu } from '../../lib/2d/points'
import { combinaisonListes } from '../../lib/outils/arrayOutils'
import { reduireAxPlusByPlusC } from '../../lib/outils/ecritures'
import engine from '../../lib/interactif/comparisonFunctions'
import DeriveeQuotient from './1AN14-6'
import { Droite } from '../../lib/2d/droites'

export const titre = 'Équations cartésiennes de droites'
export const dateDePublication = '24/06/2024'

/**
 * Calcul d'équations cartésiennes de droites
 * Beaucoup trop de fonctions... Comment les intégrer à la base
 * de code déjà existante ?
 * @florianpicard
 */

export const uuid = '8472c'
export const ref = '1G21'
export const refs = {
    'fr-fr': ['1G21'],
    'fr-ch': []
}

function pointVersTex(A: Point): string {
    return `${A.nom}\\left(${A.x} ; ${A.y}\\right)`
}

function vecteurcoordVersTex(u: Vecteur): string {
    return `\\begin{pmatrix} ${u.x} \\\\ ${u.y} \\end{pmatrix}`
}

function vecteurVersTex(u: Vecteur): string {
    let fonctionLatex = u.nom.length >= 2 ? 'overrightarrow' : 'vec';
    return `\\${fonctionLatex}{${u.nom}} = \\begin{pmatrix} ${u.x} \\\\ ${u.y} \\end{pmatrix}`
}

function vecteurNormal(u: Vecteur, nom: string = 'n'): Vecteur {
    return new Vecteur(-u.y, u.x, nom)
}

function equationCartesienne(d: Droite): string {
  return engine.parse(`${d.a}x + ${d.b}y + ${d.c} = 0`)
}

function construireDroite(A: Point, {B = undefined, u = undefined, n = undefined}) : [Droite, string] {
    if (B instanceof Point) {
	let u = new Vecteur(A, B, `${A.nom}${B.nom}`)
	let [d, details] = construireDroite(A, {u: u})
	return [d,
		`Un vecteur directeur de la droite $(${A.nom}${B.nom})$ est $${vecteurVersTex(u)}$. ` + details]
    }
    if (u instanceof Vecteur) {
	let n = vecteurNormal(u)
	let [d, details] = construireDroite(A, {n: n})
	return [d,
		`Un vecteur normal à la droite $(d)$ est $${vecteurVersTex(n)}$. ` + details]
    }
    if (n instanceof Vecteur) {
	let c = -(A.x*n.x + A.y*n.y)
	let partial = engine.parse(`${n.x}x + ${n.y}y + c = 0`).simplify()
	let Aind = engine.parse(`${n.x}*(${A.x}) + ${n.y}* (${A.y}) + c = 0`)
	let equa = engine.parse(`${n.x}x + ${n.y}y + ${c} = 0`).simplify()
	return [new Droite(n.x, n.y, c),
		`La droite de vecteur normal $${vecteurVersTex(n)}$ admet pour équation cartésienne $${partial.latex}$, pour un certain nombre réel $c$. Comme $${A.nom}$ appartient à la droite, $${Aind.latex}$. Ainsi, $c = ${c}$, l'équation cartésienne de la droite est donc $${equa.latex}$.`]
    }
    return ""
}


function hauteur(A: Point, B: Point, C: Point): [Droite, string] {
    let n = new Vecteur(B, C, 'BC')
    let [d, details] = construireDroite(A, {n: n})

    return [
	d,
	`La hauteur $(h)$ issue de $${A.nom}$ dans le triangle $${A.nom}${B.nom}${C.nom}$ passe par le point $${A.nom}$ et est perpendiculaire à la droite $(${B.nom}${C.nom}$). Ainsi le vecteur $${vecteurVersTex(n)}$ est un vecteur normal à la droite $(h)$. ` + details
    ]
}

function mediatrice(A: Point, B: Point): [Droite, string] {
  let I = milieu(A, B, 'I')
  let n = new Vecteur(A, B, 'AB')
  let [d, details] = construireDroite(I, {n: n})
  let equa = equationCartesienne(d)

  return [
    d,
    `La médiatrice du segment $[${A.nom}${B.nom}]$ coupe perpendiculairement $[${A.nom}${B.nom}]$ en son milieu $${pointVersTex(I)}$. Ainsi, $${vecteurVersTex(n)}$ est un vecteur normal à la médiatrice du segment $[${A.nom}${B.nom}]$. ` + details
  ]
}


function questionDeuxPoints(i: number = 0): [string, string] {
    let A = new Point(randint(-5, 5), randint(-5, 5), 'A')
    let B = new Point(randint(-5, 5, [A.x]), randint(-5, 5, [A.y]), 'B')
    let [equa, details] = construireDroite(A, {B: B})

    return [
	`Soient les points $${pointVersTex(A)}$, et $${pointVersTex(B)}$. Donner l'équation de la droite $(AB)$.`,
	details
    ]
} 

function questionPointvDir(i: number = 0): [string, string] {
    let A = new Point(randint(-5, 5), randint(-5, 5), 'A')
    let u = new Vecteur(randint(-5, 5), randint(-5, 5), 'u')
    let [equa, details] = construireDroite(A, {u: u})

    return [
	`Soient le point $${pointVersTex(A)}$, et le vecteur $${vecteurVersTex(u)}$. Donner l'équation de la droite $(d)$ passant par le point $${A.nom}$ et de vecteur directeur $\\vec{${u.nom}}$.`,
	details
    ]
}

function questionPointvNorm(i: number = 0): [string, string] {
    let A = new Point(randint(-5, 5), randint(-5, 5), 'A')
    let n = new Vecteur(randint(-5, 5), randint(-5, 5), 'n')
    let [equa, details] = construireDroite(A, {n: n})
    return [
	`Soient le point $${pointVersTex(A)}$, et le vecteur $${vecteurVersTex(n)}$. Donner l'équation de la droite $(d)$ passant par le point $${A.nom}$ et de vecteur normal $\\vec{${n.nom}}$.`,
	details
    ]
}

function questionHauteur(i: number = 0): [string, string] {
    let A = new Point(randint(-5, 5), randint(-5, 5), 'A')
    let B = new Point(randint(-5, 5, [A.x]), randint(-5, 5, [A.y]), 'B')
    let C = new Point(randint(-5, 5, [A.x, B.x]), randint(-5, 5, [A.y, B.y]), 'C')
    let [equa, details] = hauteur(A, B, C)
    return [
	`Soient les trois points $${pointVersTex(A)}$, $${pointVersTex(B)}$, et $${pointVersTex(C)}$. Déterminer l'équation cartésienne de la hauteur issue de $${A.nom}$ dans le triangle $${A.nom}${B.nom}${C.nom}$.`,
	details
    ]
}

function questionMediatrice(i: number = 0): [string, string] {
    let A = new Point(randint(-5, 5), randint(-5, 5), 'A')
    let B = new Point(randint(-5, 5, [A.x]), randint(-5, 5, [A.y]), 'B')
    let [equa, details] = mediatrice(A, B)
    return [
	`Soient les points $${pointVersTex(A)}$ et $${pointVersTex(B)}$. Déterminer une équation cartésienne de la médiatrice du segment $[${A.nom}${B.nom}$].`,
	details
    ]
}

export default class nomExercice extends Exercice {
    constructor () {
	super()
	this.consigne = ""
	this.nbQuestions = 10
    }

    nouvelleVersion () {
	this.listeQuestions = []
	this.listeCorrections = []
	this.autoCorrection = []

	const questions = [questionPointvNorm, questionPointvDir, questionDeuxPoints, questionHauteur, questionMediatrice]

	for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
	    let [texte, texteCorr] = questions[i](i)
	    if (this.questionJamaisPosee(i, texte)) {
		this.listeQuestions.push(texte)
		this.listeCorrections.push(texteCorr)
		i++
	    }
	    cpt++
	}
	listeQuestionsToContenu(this)
    }
}
