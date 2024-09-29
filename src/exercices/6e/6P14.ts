import { angleOriente, codageAngleDroit } from '../../lib/2d/angles.js'
import { afficheLongueurSegment, codageSegments } from '../../lib/2d/codages.js'
import { point, pointAdistance } from '../../lib/2d/points.js'
import { nommePolygone, polygone } from '../../lib/2d/polygones.js'
import { rotation } from '../../lib/2d/transformations.js'
import { triangle2points2longueurs } from '../../lib/2d/triangle.js'
import { choice } from '../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { arrondi, nombreDeChiffresDansLaPartieDecimale, nombreDeChiffresDe } from '../../lib/outils/nombres'
import { lettreDepuisChiffre, sp } from '../../lib/outils/outilString.js'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../Exercice'
import { fixeBordures, mathalea2d } from '../../modules/2dGeneralites.js'
import { context } from '../../modules/context.js'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { max, min } from 'mathjs'
import FractionEtendue from '../../modules/FractionEtendue.js'
import { setReponse } from '../../lib/interactif/gestionInteractif'

export const titre = "Agrandir ou réduire des figures, d'après une situation de proportionnalité"
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'
export const dateDePublication = '13/03/2022'
export const dateDeModifImportante = '11/04/2024'

/**
 * Trouver comment agrandir ou réduire des longueurs d'une figure et construire la figure demandée
 * @author Eric Elter
 */
export const uuid = '4c6e2'
export const ref = '6P14'
export const refs = {
  'fr-fr': ['6P14'],
  'fr-ch': ['9FA3-17']
}
class AgrandirReduireFigure extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.besoinFormulaireTexte = [
      'Type de figures', [
        'Nombres séparés par des tirets',
        '1 : Triangle équilatéral',
        '2 : Carré',
        '3 : Triangle avec coefficient de réduction ou d\'agrandissement',
        '4 : Triangle avec longueur initiale et longueur finale',
        '5 : Rectangle avec coefficient de réduction ou d\'agrandissement',
        '6 : Rectangle avec longueur initiale et longueur finale',
        '7 : Mélange'
      ].join('\n')
    ]
    this.besoinFormulaire2Texte = ['Longueur maximum dans la figure à produire (5 minimum)', '']
    this.sup = 7
    this.sup2 = '15'
    this.nbQuestions = 4
    this.spacingCorr = 1
    this.spacing = 2
  }

  nouvelleVersion () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    const listeTypeQuestions = gestionnaireFormulaireTexte({
      max: 6,
      defaut: 7,
      melange: 7,
      nbQuestions: this.nbQuestions,
      saisie: this.sup
    })
    const longueurMaximum = Math.max(5, Number(this.sup2))
    const texteAgrandissementOuReduction = [[' agrandissement', 'e réduction'], ['l\'agrandissement demandé', 'la réduction demandée']] // Ne pas supprimer le 'e'
    let ii = 0 // Cet indice permet de gérer les numéros de champs interactifs car ces champs ne sont pas de nombre égal selon les listeTypeQuestions[i].
    let iiAMC // Cet indice permet de gérer les numéros de champs AMC car ces champs ne sont pas de nombre égal selon les listeTypeQuestions[i].
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 200;) {
      let texte, texteCorr, absBFinal, coeffFinal, longueurMax
      const indexQuestion = ii
      do {
        texte = ''
        texteCorr = ''
        ii = indexQuestion
        const propositionsAMC = []
        iiAMC = 0
        const objets = []
        const coefAgrandissement = [1.5, 2, 3, 5, 0.5, 0.25, 0.75]
        const coefReduction = [new FractionEtendue(1, 2), new FractionEtendue(1, 4), new FractionEtendue(3, 4)]
        const choixAgrandissementOuReduction = randint(0, 6)
        const A = point(0, 0)
        const absB = choixAgrandissementOuReduction < 4 ? randint(5, 11, [6, 9]) : 2 * randint(4, 7)
        // On en a besoin pour this.qusetionJamaisPosee()
        absBFinal = absB
        coeffFinal = coefAgrandissement[choixAgrandissementOuReduction]

        switch (listeTypeQuestions[i]) {
          case 1: { // Triangle équilatéral
            const reponse = arrondi(coefAgrandissement[choixAgrandissementOuReduction] * absB, 1)
            const alpha = randint(10, 170)
            const alphaCorr = randint(10, 170, [alpha])
            const sensRotation = choice([-1, 1])
            const B = pointAdistance(A, absB, sensRotation * alpha)
            const BCorr = pointAdistance(A, reponse, sensRotation * alphaCorr)
            const C = pointAdistance(A, absB, sensRotation * (alpha + 60))
            const CCorr = pointAdistance(A, reponse, sensRotation * (alphaCorr + 60))
            const polygoneInit = polygone(A, B, C)
            const polygoneCorr = polygone(A, BCorr, CCorr)
            const numA = randint(1, 26, [4, 5, 15, 23, 24, 25])
            const numB = randint(1, 26, [4, 5, 15, 23, 24, 25, numA])
            const numC = randint(1, 26, [4, 5, 15, 23, 24, 25, numA, numB])
            const nom = lettreDepuisChiffre(numA) + lettreDepuisChiffre(numB) + lettreDepuisChiffre(numC)
            const numACorr = randint(1, 26, [4, 5, 15, 23, 24, 25, numA, numB, numC])
            const numBCorr = randint(1, 26, [4, 5, 15, 23, 24, 25, numA, numB, numACorr])
            const numCCorr = randint(1, 26, [4, 5, 15, 23, 24, 25, numA, numB, numACorr, numBCorr])
            const nomCorr = lettreDepuisChiffre(numACorr) + lettreDepuisChiffre(numBCorr) + lettreDepuisChiffre(numCCorr)
            objets.push(polygoneInit, codageSegments('||', 'red', polygoneInit.listePoints), afficheLongueurSegment(sensRotation < 0 ? A : B, sensRotation < 0 ? B : A, 'blue', 0.5, '', true), nommePolygone(polygoneInit, nom))
            const enonceInit = `On décide d'effectuer un${texteAgrandissementOuReduction[0][choixAgrandissementOuReduction < 4 ? 0 : 1]} de coefficient $${texNombre(coefAgrandissement[choixAgrandissementOuReduction])}$ du triangle équilatéral ${nom}. Quelle sera la longueur du côté du triangle à construire ?`
            texte = enonceInit
            const enonceAMC = '<br>' + mathalea2d(Object.assign({
              pixelsParCm: 20,
              scale: 0.5
            }, fixeBordures(objets)), objets)
            texte += enonceAMC
            if (this.interactif) {
              texte += ajouteChampTexteMathLive(this, i + ii, 'inline', { tailleExtensible: true })
              setReponse(this, i + ii, reponse)
            } else if (!context.isAmc) {
              texte = `Trace un${texteAgrandissementOuReduction[0][choixAgrandissementOuReduction < 4 ? 0 : 1]} de coefficient $${texNombre(coefAgrandissement[choixAgrandissementOuReduction])}$ du triangle ${nom}.`
              texte += '<br>' + mathalea2d(Object.assign({ pixelsParCm: 20, scale: 0.5 }, fixeBordures(objets)), objets)
            } else {
              propositionsAMC[iiAMC] = {
                type: 'AMCOpen',
                propositions:
                  [
                    {
                      texte: '',
                      statut: 1,
                      sanscadre: true,
                      enonce: enonceAMC + `<br>Trace, sur une feuille blanche, ${texteAgrandissementOuReduction[1][choixAgrandissementOuReduction < 4 ? 0 : 1]}.`,
                      sanslignes: true
                    }
                  ]
              }
              iiAMC++
              propositionsAMC[iiAMC] = {
                type: 'AMCNum',
                propositions: [{
                  texte: '',
                  statut: '',
                  reponse: {
                    texte: enonceInit,
                    valeur: [reponse],
                    alignement: 'center',
                    param: {
                      digits: nombreDeChiffresDe(reponse),
                      decimals: nombreDeChiffresDansLaPartieDecimale(reponse),
                      signe: false
                    }
                  }
                }]
              }
              iiAMC++
            }
            texteCorr = `Effectuer un${texteAgrandissementOuReduction[0][choixAgrandissementOuReduction < 4 ? 0 : 1]} de coefficient $${texNombre(coefAgrandissement[choixAgrandissementOuReduction])}$ implique de multiplier toutes les longueurs par ce coefficient`
            if (choixAgrandissementOuReduction >= 4) {
              texteCorr += ` ou bien, comme $${texNombre(coefAgrandissement[choixAgrandissementOuReduction])}=${coefReduction[choixAgrandissementOuReduction - 4].texFraction}$, cela revient à diviser toutes les longueurs par $${coefReduction[choixAgrandissementOuReduction - 4].den}$`
              texteCorr += choixAgrandissementOuReduction === 6 ? ' puis multiplier chacun de ces résultats par 3' : ''
            }
            texteCorr += '.<br>'
            texteCorr += `$${absB} \\times ${coefAgrandissement[choixAgrandissementOuReduction]}=${texNombre(reponse)}$`
            if (choixAgrandissementOuReduction === 6) {
              texteCorr += ` ou bien $(${absB} \\div 4) \\times 3=${texNombre(arrondi(absB / 4, 1))} \\times 3=${texNombre(reponse)}$`
            } else if (choixAgrandissementOuReduction >= 4) {
              texteCorr += ` ou bien $${absB} \\div ${coefReduction[choixAgrandissementOuReduction - 4].den}=${texNombre(reponse)}$`
            }
            texteCorr += `<br>Le triangle équilatéral issu d'un${texteAgrandissementOuReduction[0][choixAgrandissementOuReduction < 4 ? 0 : 1]} du triangle ${nom} de coefficient $${texNombre(coefAgrandissement[choixAgrandissementOuReduction])}$ possède donc des côtés de longueur $${miseEnEvidence(texNombre(reponse))}$.`
            texteCorr += '<br>En voici, une réalisation ci-dessous.'
            objets.push(polygoneCorr, codageSegments('|||', 'blue', polygoneCorr.listePoints), afficheLongueurSegment(sensRotation < 0 ? A : BCorr, sensRotation < 0 ? BCorr : A, 'red', 0.5, '', true), nommePolygone(polygoneCorr, nomCorr))
            texteCorr += '<br>' + mathalea2d(Object.assign({ pixelsParCm: 20, scale: 0.5 }, fixeBordures(objets)), objets)
            longueurMax = reponse
          }
            break
          case 2: { // Carré
            const reponse = arrondi(coefAgrandissement[choixAgrandissementOuReduction] * absB, 1)
            const alpha = randint(10, 170)
            const alphaCorr = randint(10, 170, [alpha])
            const sensRotation = choice([-1, 1])
            const B = pointAdistance(A, absB, sensRotation * alpha)
            const BCorr = pointAdistance(A, reponse, sensRotation * alphaCorr)
            const C = rotation(A, B, 90)
            const D = rotation(B, A, -90)
            const CCorr = rotation(A, BCorr, 90)
            const DCorr = rotation(BCorr, A, -90)
            const polygoneInit = polygone(A, B, C, D)
            const polygoneCorr = polygone(A, BCorr, CCorr, DCorr)
            const numA = randint(1, 26, [4, 5, 15, 23, 24, 25])
            const numB = randint(1, 26, [4, 5, 15, 23, 24, 25, numA])
            const numC = randint(1, 26, [4, 5, 15, 23, 24, 25, numA, numB])
            const numD = randint(1, 26, [4, 5, 15, 23, 24, 25, numA, numB, numC])
            const nom = lettreDepuisChiffre(numA) + lettreDepuisChiffre(numB) + lettreDepuisChiffre(numC) + lettreDepuisChiffre(numD)
            const numACorr = randint(1, 26, [4, 5, 15, 23, 24, 25, numA, numB, numC])
            const numBCorr = randint(1, 26, [4, 5, 15, 23, 24, 25, numA, numB, numACorr])
            const numCCorr = randint(1, 26, [4, 5, 15, 23, 24, 25, numA, numB, numACorr, numBCorr])
            const numDCorr = randint(1, 26, [4, 5, 15, 23, 24, 25, numA, numB, numACorr, numBCorr, numCCorr])
            const nomCorr = lettreDepuisChiffre(numACorr) + lettreDepuisChiffre(numBCorr) + lettreDepuisChiffre(numCCorr) + lettreDepuisChiffre(numDCorr)
            objets.push(polygoneInit, codageSegments('||', 'red', polygoneInit.listePoints), afficheLongueurSegment(A, B, 'blue', 0.5, '', true), nommePolygone(polygoneInit, nom))
            objets.push(codageAngleDroit(A, B, C), codageAngleDroit(D, C, B), codageAngleDroit(A, D, C), codageAngleDroit(B, A, D))
            const enonceInit = `On décide d'effectuer un${texteAgrandissementOuReduction[0][choixAgrandissementOuReduction < 4 ? 0 : 1]} de coefficient $${texNombre(coefAgrandissement[choixAgrandissementOuReduction])}$, du carré ${nom}. Quelle sera la longueur du côté du carré à construire ?`
            texte = enonceInit
            const enonceAMC = '<br>' + mathalea2d(Object.assign({
              pixelsParCm: 20,
              scale: 0.5
            }, fixeBordures(objets)), objets)
            texte += enonceAMC
            if (this.interactif) {
              texte += ajouteChampTexteMathLive(this, i + ii, 'inline', { tailleExtensible: true })
              setReponse(this, i + ii, reponse)
            } else if (!context.isAmc) {
              texte = `Trace un${texteAgrandissementOuReduction[0][choixAgrandissementOuReduction < 4 ? 0 : 1]} de coefficient $${texNombre(coefAgrandissement[choixAgrandissementOuReduction])}$ du carré ${nom}.`
              texte += '<br>' + mathalea2d(Object.assign({ pixelsParCm: 20, scale: 0.5 }, fixeBordures(objets)), objets)
            } else {
              propositionsAMC[iiAMC] = {
                type: 'AMCOpen',
                propositions:
                  [
                    {
                      texte: '',
                      statut: 1,
                      sanscadre: true,
                      enonce: enonceAMC + `<br>Trace, sur une feuille blanche, ${texteAgrandissementOuReduction[1][choixAgrandissementOuReduction < 4 ? 0 : 1]}.`,
                      sanslignes: true
                    }
                  ]
              }
              iiAMC++
              propositionsAMC[iiAMC] = {
                type: 'AMCNum',
                propositions: [{
                  texte: '',
                  statut: '',
                  reponse: {
                    texte: enonceInit,
                    valeur: [reponse],
                    alignement: 'center',
                    param: {
                      digits: nombreDeChiffresDe(reponse),
                      decimals: nombreDeChiffresDansLaPartieDecimale(reponse),
                      signe: false
                    }
                  }
                }]
              }
              iiAMC++
            }
            texteCorr = `Effectuer un${texteAgrandissementOuReduction[0][choixAgrandissementOuReduction < 4 ? 0 : 1]} de coefficient $${texNombre(coefAgrandissement[choixAgrandissementOuReduction])}$ implique de multiplier toutes les longueurs par ce coefficient`
            if (choixAgrandissementOuReduction >= 4) {
              texteCorr += ` ou bien, comme $${texNombre(coefAgrandissement[choixAgrandissementOuReduction])}=${coefReduction[choixAgrandissementOuReduction - 4].texFraction}$, cela revient à diviser toutes les longueurs par $${coefReduction[choixAgrandissementOuReduction - 4].den}$`
              texteCorr += choixAgrandissementOuReduction === 6 ? ' puis multiplier chacun de ces résultats par 3' : ''
            }
            texteCorr += '.<br>'
            texteCorr += `$${absB} \\times ${coefAgrandissement[choixAgrandissementOuReduction]}=${texNombre(reponse)}$`
            if (choixAgrandissementOuReduction === 6) {
              texteCorr += ` ou bien $(${absB} \\div 4) \\times 3=${texNombre(arrondi(absB / 4, 1))} \\times 3=${texNombre(reponse)}$`
            } else if (choixAgrandissementOuReduction >= 4) {
              texteCorr += ` ou bien $${absB} \\div ${coefReduction[choixAgrandissementOuReduction - 4].den}=${texNombre(reponse)}$`
            }
            texteCorr += `<br>Le carré issu d'un${texteAgrandissementOuReduction[0][choixAgrandissementOuReduction < 4 ? 0 : 1]} du carré ${nom} de coefficient $${texNombre(coefAgrandissement[choixAgrandissementOuReduction])}$ possède donc des côtés de longueur $${miseEnEvidence(texNombre(reponse))}$.`
            texteCorr += '<br>En voici, une réalisation ci-dessous.'
            objets.push(polygoneCorr, codageSegments('|||', 'blue', polygoneCorr.listePoints), afficheLongueurSegment(A, BCorr, 'red', 0.5, '', true), nommePolygone(polygoneCorr, nomCorr))
            objets.push(codageAngleDroit(A, BCorr, CCorr), codageAngleDroit(DCorr, CCorr, BCorr), codageAngleDroit(A, DCorr, CCorr), codageAngleDroit(BCorr, A, DCorr))
            texteCorr += '<br>' + mathalea2d(Object.assign({ pixelsParCm: 20, scale: 0.5 }, fixeBordures(objets)), objets)
            longueurMax = reponse
          }
            break
          case 3: { // Triangle avec coefficient de réduction ou d'agrandissement
            const absC = choixAgrandissementOuReduction < 4 ? randint(5, 11, [6, 9, absB]) : 2 * randint(4, 7, [arrondi(absB / 2, 0)])
            // Le code ci-dessous ne permet pas dans certains cas de trouver une valeur aléatoire
            const absD = choixAgrandissementOuReduction < 4 ? randint(1 + Math.abs(absB - absC), absB + absC - 1, [6, 9, absB, absC]) : 2 * randint(4, 7, [arrondi(absB / 2, 0), arrondi(absC / 2, 0)])
            const reponse = arrondi(coefAgrandissement[choixAgrandissementOuReduction] * absB, 1)
            const reponse1 = arrondi(coefAgrandissement[choixAgrandissementOuReduction] * absC, 1)
            const reponse2 = arrondi(coefAgrandissement[choixAgrandissementOuReduction] * absD, 1)
            const alpha = randint(10, 170)
            const alphaCorr = randint(10, 170, [alpha])
            const sensRotation = choice([-1, 1])
            const B = pointAdistance(A, absB, sensRotation * alpha)
            const BCorr = pointAdistance(A, reponse, sensRotation * alphaCorr)
            const choixOrientation = randint(1, 2)
            const polygoneInit = triangle2points2longueurs(A, B, absC, absD, choixOrientation)
            const C = polygoneInit.listePoints[2]
            const polygoneCorr = triangle2points2longueurs(A, BCorr, reponse1, reponse2, choixOrientation)
            const CCorr = polygoneCorr.listePoints[2]
            const numA = randint(1, 26, [4, 5, 15, 23, 24, 25])
            const numB = randint(1, 26, [4, 5, 15, 23, 24, 25, numA])
            const numC = randint(1, 26, [4, 5, 15, 23, 24, 25, numA, numB])
            const nom = lettreDepuisChiffre(numA) + lettreDepuisChiffre(numB) + lettreDepuisChiffre(numC)
            const numACorr = randint(1, 26, [4, 5, 15, 23, 24, 25, numA, numB, numC])
            const numBCorr = randint(1, 26, [4, 5, 15, 23, 24, 25, numA, numB, numACorr])
            const numCCorr = randint(1, 26, [4, 5, 15, 23, 24, 25, numA, numB, numACorr, numBCorr])
            const nomCorr = lettreDepuisChiffre(numACorr) + lettreDepuisChiffre(numBCorr) + lettreDepuisChiffre(numCCorr)
            objets.push(polygoneInit, nommePolygone(polygoneInit, nom))
            objets.push(afficheLongueurSegment(angleOriente(C, A, B) > 0 ? A : B, angleOriente(C, A, B) > 0 ? B : A, 'blue', 0.5, '', true))
            objets.push(afficheLongueurSegment(angleOriente(A, B, C) > 0 ? B : C, angleOriente(A, B, C) > 0 ? C : B, 'blue', 0.5, '', true))
            objets.push(afficheLongueurSegment(angleOriente(B, C, A) > 0 ? C : A, angleOriente(B, C, A) > 0 ? A : C, 'blue', 0.5, '', true))
            const enonceInit = `On décide d'effectuer un${texteAgrandissementOuReduction[0][choixAgrandissementOuReduction < 4 ? 0 : 1]} de coefficient $${texNombre(coefAgrandissement[choixAgrandissementOuReduction])}$ du triangle ${nom}. Quelles seront les longueurs respectives de chaque côté du triangle à construire ?`
            const enonceAMC = '<br>' + mathalea2d(Object.assign({
              pixelsParCm: 20,
              scale: 0.5
            }, fixeBordures(objets)), objets)
            if (this.interactif) {
              texte = enonceInit
              texte += enonceAMC
              texte += '<br> Dans le nouveau triangle, la plus petite longueur sera :' + ajouteChampTexteMathLive(this, i + ii, 'inline', { tailleExtensible: true })
              setReponse(this, i + ii, min(reponse, reponse1, reponse2))
              ii++
              texte += '<br> Dans le nouveau triangle, la plus grande longueur sera :' + ajouteChampTexteMathLive(this, i + ii, 'inline', { tailleExtensible: true })
              setReponse(this, i + ii, max(reponse, reponse1, reponse2))
              ii++
              texte += '<br> Dans le nouveau triangle, la dernière longueur sera :' + ajouteChampTexteMathLive(this, i + ii, 'inline', { tailleExtensible: true })
              let derniereReponse = [reponse, reponse1, reponse2].slice([reponse, reponse1, reponse2].indexOf(min(reponse, reponse1, reponse2)))
              derniereReponse = derniereReponse.slice(derniereReponse.indexOf(max(reponse, reponse1, reponse2)))
              setReponse(this, i + ii, derniereReponse)
            } else if (!context.isAmc) {
              texte = `Trace un${texteAgrandissementOuReduction[0][choixAgrandissementOuReduction < 4 ? 0 : 1]} de coefficient $${texNombre(coefAgrandissement[choixAgrandissementOuReduction])}$ du triangle ${nom}.`
              texte += '<br>' + mathalea2d(Object.assign({ pixelsParCm: 20, scale: 0.5 }, fixeBordures(objets)), objets)
            } else {
              propositionsAMC[iiAMC] = {
                type: 'AMCOpen',
                propositions:
                  [
                    {
                      texte: '',
                      statut: 1,
                      sanscadre: true,
                      enonce: enonceAMC + `<br>Trace, sur une feuille blanche, ${texteAgrandissementOuReduction[1][choixAgrandissementOuReduction < 4 ? 0 : 1]}.`,
                      sanslignes: true
                    }
                  ]
              }
              iiAMC++
              propositionsAMC[iiAMC] = {
                type: 'AMCNum',
                propositions: [{
                  texte: '',
                  statut: '',
                  reponse: {
                    texte: enonceInit + '<br> <br>Dans le nouveau triangle, la plus petite longueur sera :',
                    valeur: [min(reponse, reponse1, reponse2)],
                    alignement: 'center',
                    param: {
                      digits: nombreDeChiffresDe(min(reponse, reponse1, reponse2)),
                      decimals: nombreDeChiffresDansLaPartieDecimale(min(reponse, reponse1, reponse2)),
                      signe: false
                    }
                  }
                }]
              }
              iiAMC++
              propositionsAMC[iiAMC] = {
                type: 'AMCNum',
                propositions: [{
                  texte: '',
                  statut: '',
                  reponse: {
                    texte: 'Dans le nouveau triangle, la plus grande longueur sera :',
                    valeur: [max(reponse, reponse1, reponse2)],
                    alignement: 'center',
                    param: {
                      digits: nombreDeChiffresDe(max(reponse, reponse1, reponse2)),
                      decimals: nombreDeChiffresDansLaPartieDecimale(max(reponse, reponse1, reponse2)),
                      signe: false
                    }
                  }
                }]
              }
              iiAMC++
              propositionsAMC[iiAMC] = {
                type: 'AMCNum',
                propositions: [{
                  texte: '',
                  statut: '',
                  reponse: {
                    texte: 'Dans le nouveau triangle, la dernière longueur sera :',
                    valeur: [choice([reponse, reponse1, reponse2], [min(reponse, reponse1, reponse2), max(reponse, reponse1, reponse2)])],
                    alignement: 'center',
                    param: {
                      digits: nombreDeChiffresDe(choice([reponse, reponse1, reponse2], [min(reponse, reponse1, reponse2), max(reponse, reponse1, reponse2)])),
                      decimals: nombreDeChiffresDansLaPartieDecimale(choice([reponse, reponse1, reponse2], [min(reponse, reponse1, reponse2), max(reponse, reponse1, reponse2)])),
                      signe: false
                    }
                  }
                }]
              }
              iiAMC++
            }
            texteCorr = `Effectuer un${texteAgrandissementOuReduction[0][choixAgrandissementOuReduction < 4 ? 0 : 1]} de coefficient $${texNombre(coefAgrandissement[choixAgrandissementOuReduction])}$ implique de multiplier toutes les longueurs par ce coefficient`
            if (choixAgrandissementOuReduction >= 4) {
              texteCorr += ` ou bien, comme $${texNombre(coefAgrandissement[choixAgrandissementOuReduction])}=${coefReduction[choixAgrandissementOuReduction - 4].texFraction}$, cela revient à diviser toutes les longueurs par $${coefReduction[choixAgrandissementOuReduction - 4].den}$`
              texteCorr += choixAgrandissementOuReduction === 6 ? ' puis multiplier chacun de ces résultats par 3' : ''
            }
            texteCorr += '.<br>'
            texteCorr += `$${absB} \\times ${coefAgrandissement[choixAgrandissementOuReduction]}=${texNombre(reponse)}${sp(10)}$`
            texteCorr += `$${absC} \\times ${coefAgrandissement[choixAgrandissementOuReduction]}=${texNombre(reponse1)}${sp(10)}$`
            texteCorr += `$${absD} \\times ${coefAgrandissement[choixAgrandissementOuReduction]}=${texNombre(reponse2)}$`
            if (choixAgrandissementOuReduction === 6) {
              texteCorr += `${sp(10)} ou bien ${sp(10)}$(${absB} \\div 4) \\times 3=${texNombre(arrondi(absB / 4, 1))} \\times 3=${texNombre(reponse)}$`
              texteCorr += `${sp(10)}$(${absC} \\div 4) \\times 3=${texNombre(arrondi(absC / 4, 1))} \\times 3=${texNombre(reponse1)}$`
              texteCorr += `${sp(10)}$(${absD} \\div 4) \\times 3=${texNombre(arrondi(absD / 4, 1))} \\times 3=${texNombre(reponse2)}$`
            } else if (choixAgrandissementOuReduction >= 4) {
              texteCorr += `${sp(10)} ou bien ${sp(10)}$${absB} \\div ${coefReduction[choixAgrandissementOuReduction - 4].den}=${texNombre(reponse)}$`
              texteCorr += `${sp(10)}$${absC} \\div ${coefReduction[choixAgrandissementOuReduction - 4].den}=${texNombre(reponse1)}$`
              texteCorr += `${sp(10)}$${absD} \\div ${coefReduction[choixAgrandissementOuReduction - 4].den}=${texNombre(reponse2)}$`
            }
            texteCorr += `<br>Le triangle issu d'un${texteAgrandissementOuReduction[0][choixAgrandissementOuReduction < 4 ? 0 : 1]} du triangle ${nom} de coefficient $${texNombre(coefAgrandissement[choixAgrandissementOuReduction])}$ possède donc des côtés de longueur respective $${miseEnEvidence(texNombre(reponse))}$ ; $${miseEnEvidence(texNombre(reponse1))}$ et $${miseEnEvidence(texNombre(reponse2))}$.`
            texteCorr += '<br>En voici, une réalisation ci-dessous.'
            objets.push(polygoneCorr, nommePolygone(polygoneCorr, nomCorr))
            objets.push(afficheLongueurSegment(angleOriente(CCorr, A, BCorr) > 0 ? A : BCorr, angleOriente(CCorr, A, BCorr) > 0 ? BCorr : A, 'red', 0.5, '', true))
            objets.push(afficheLongueurSegment(angleOriente(A, BCorr, CCorr) > 0 ? BCorr : CCorr, angleOriente(A, BCorr, CCorr) > 0 ? CCorr : BCorr, 'red', 0.5, '', true))
            objets.push(afficheLongueurSegment(angleOriente(BCorr, CCorr, A) > 0 ? CCorr : A, angleOriente(BCorr, CCorr, A) > 0 ? A : CCorr, 'red', 0.5, '', true))
            texteCorr += '<br>' + mathalea2d(Object.assign({ pixelsParCm: 20, scale: 0.5 }, fixeBordures(objets)), objets)
            longueurMax = Math.max(reponse, reponse1, reponse2)
          }
            break
          case 4: { // Triangle avec longueur initiale et longueur finale
            const absC = choixAgrandissementOuReduction < 4 ? randint(5, 11, [6, 9, absB]) : 2 * randint(4, 7, [arrondi(absB / 2, 0)])
            // Le code ci-dessous ne permet pas dans certains cas de trouver une valeur aléatoire
            const absD = choixAgrandissementOuReduction < 4 ? randint(5, 11, [6, 9, absB, absC]) : 2 * randint(4, 7, [arrondi(absB / 2, 0), arrondi(absC / 2, 0)])
            const reponse = arrondi(coefAgrandissement[choixAgrandissementOuReduction] * absB, 1)
            const reponse1 = arrondi(coefAgrandissement[choixAgrandissementOuReduction] * absC, 1)
            const reponse2 = arrondi(coefAgrandissement[choixAgrandissementOuReduction] * absD, 1)
            const alpha = randint(10, 170)
            const alphaCorr = randint(10, 170, [alpha])
            const sensRotation = choice([-1, 1])
            const B = pointAdistance(A, absB, sensRotation * alpha)
            const BCorr = pointAdistance(A, reponse, sensRotation * alphaCorr)
            const choixOrientation = randint(1, 2)
            const polygoneInit = triangle2points2longueurs(A, B, absC, absD, choixOrientation)
            const C = polygoneInit.listePoints[2]
            const polygoneCorr = triangle2points2longueurs(A, BCorr, reponse1, reponse2, choixOrientation)
            const CCorr = polygoneCorr.listePoints[2]
            const numA = randint(1, 26, [4, 5, 15, 23, 24, 25])
            const numB = randint(1, 26, [4, 5, 15, 23, 24, 25, numA])
            const numC = randint(1, 26, [4, 5, 15, 23, 24, 25, numA, numB])
            const nom = lettreDepuisChiffre(numA) + lettreDepuisChiffre(numB) + lettreDepuisChiffre(numC)
            const numACorr = randint(1, 26, [4, 5, 15, 23, 24, 25, numA, numB, numC])
            const numBCorr = randint(1, 26, [4, 5, 15, 23, 24, 25, numA, numB, numACorr])
            const numCCorr = randint(1, 26, [4, 5, 15, 23, 24, 25, numA, numB, numACorr, numBCorr])
            const nomCorr = lettreDepuisChiffre(numACorr) + lettreDepuisChiffre(numBCorr) + lettreDepuisChiffre(numCCorr)
            objets.push(polygoneInit, nommePolygone(polygoneInit, nom))
            objets.push(afficheLongueurSegment(angleOriente(C, A, B) > 0 ? A : B, angleOriente(C, A, B) > 0 ? B : A, 'blue', 0.5, '', true))
            objets.push(afficheLongueurSegment(angleOriente(A, B, C) > 0 ? B : C, angleOriente(A, B, C) > 0 ? C : B, 'blue', 0.5, '', true))
            objets.push(afficheLongueurSegment(angleOriente(B, C, A) > 0 ? C : A, angleOriente(B, C, A) > 0 ? A : C, 'blue', 0.5, '', true))
            const enonceInit = `On décide d'effectuer un${texteAgrandissementOuReduction[0][choixAgrandissementOuReduction < 4 ? 0 : 1]} du triangle ${nom}, de telle sorte que la longueur du côté associé à [${lettreDepuisChiffre(numB) + lettreDepuisChiffre(numC)}] mesurera $${texNombre(reponse2)}$.<br>Quelles seront les longueurs respectives des deux autres côtés du triangle à construire ?`
            const enonceAMC = '<br>' + mathalea2d(Object.assign({
              pixelsParCm: 20,
              scale: 0.5
            }, fixeBordures(objets)), objets)
            if (this.interactif) {
              texte = enonceInit
              texte += enonceAMC
              texte += '<br> Dans le nouveau triangle, la plus petite longueur à trouver sera :' + ajouteChampTexteMathLive(this, i + ii, 'inline', { tailleExtensible: true })
              setReponse(this, i + ii, min(reponse, reponse1))
              ii++
              texte += '<br> Dans le nouveau triangle, la plus grande longueur à trouver sera :' + ajouteChampTexteMathLive(this, i + ii, 'inline', { tailleExtensible: true })
              setReponse(this, i + ii, max(reponse, reponse1))
            } else if (!context.isAmc) {
              texte = `Trace un${texteAgrandissementOuReduction[0][choixAgrandissementOuReduction < 4 ? 0 : 1]} du triangle ${nom} de telle sorte que la longueur du côté associé à [${lettreDepuisChiffre(numB) + lettreDepuisChiffre(numC)}] mesurera $${texNombre(reponse2)}$.`
              texte += '<br>' + mathalea2d(Object.assign({ pixelsParCm: 20, scale: 0.5 }, fixeBordures(objets)), objets)
            } else {
              propositionsAMC[iiAMC] = {
                type: 'AMCOpen',
                propositions:
                  [
                    {
                      texte: '',
                      statut: 1,
                      sanscadre: true,
                      enonce: enonceAMC + `<br>Trace, sur une feuille blanche, ${texteAgrandissementOuReduction[1][choixAgrandissementOuReduction < 4 ? 0 : 1]}.`,
                      sanslignes: true
                    }
                  ]
              }
              iiAMC++
              propositionsAMC[iiAMC] = {
                type: 'AMCNum',
                propositions: [{
                  texte: '',
                  statut: '',
                  reponse: {
                    texte: enonceInit + '<br> <br>Dans le nouveau triangle, la plus petite longueur à trouver sera :',
                    valeur: [min(reponse, reponse1)],
                    alignement: 'center',
                    param: {
                      digits: nombreDeChiffresDe(min(reponse, reponse1)),
                      decimals: nombreDeChiffresDansLaPartieDecimale(min(reponse, reponse1)),
                      signe: false
                    }
                  }
                }]
              }
              iiAMC++
              propositionsAMC[iiAMC] = {
                type: 'AMCNum',
                propositions: [{
                  texte: '',
                  statut: '',
                  reponse: {
                    texte: 'Dans le nouveau triangle, la plus grande longueur à trouver sera :',
                    valeur: [max(reponse, reponse1)],
                    alignement: 'center',
                    param: {
                      digits: nombreDeChiffresDe(max(reponse, reponse1)),
                      decimals: nombreDeChiffresDansLaPartieDecimale(max(reponse, reponse1)),
                      signe: false
                    }
                  }
                }]
              }
              iiAMC++
            }
            texteCorr = `Effectuer un${texteAgrandissementOuReduction[0][choixAgrandissementOuReduction < 4 ? 0 : 1]} implique de multiplier toutes les longueurs par un coefficient de proportionnalité. Trouvons ce coefficient.<br>`
            texteCorr += `Pour trouver ce coefficient, divisons la longueur connue du futur triangle par sa longueur associée dans le triangle actuel : $${texNombre(reponse2)} \\div ${absD} = ${coefAgrandissement[choixAgrandissementOuReduction]}$. Le coefficient de proportionnalité est donc $${coefAgrandissement[choixAgrandissementOuReduction]}$.<br>`
            texteCorr += `Multiplions toutes les longueurs connues du triangle actuel par $${coefAgrandissement[choixAgrandissementOuReduction]}$`

            if (choixAgrandissementOuReduction >= 4) {
              texteCorr += `, ou bien, comme $${texNombre(coefAgrandissement[choixAgrandissementOuReduction])}=${coefReduction[choixAgrandissementOuReduction - 4].texFraction}$, cela revient à diviser toutes les longueurs par $${coefReduction[choixAgrandissementOuReduction - 4].den}$`
              texteCorr += choixAgrandissementOuReduction === 6 ? ' puis multiplier chacun de ces résultats par 3' : ''
            }
            texteCorr += `.<br>$${absB} \\times ${coefAgrandissement[choixAgrandissementOuReduction]}=${texNombre(reponse)}${sp(10)}$`
            texteCorr += `$${absC} \\times ${coefAgrandissement[choixAgrandissementOuReduction]}=${texNombre(reponse1)}$`
            if (choixAgrandissementOuReduction === 6) {
              texteCorr += `${sp(10)} ou bien ${sp(10)}$(${absB} \\div 4) \\times 3=${texNombre(arrondi(absB / 4, 1))} \\times 3=${texNombre(reponse)}$`
              texteCorr += `${sp(10)}$(${absC} \\div 4) \\times 3=${texNombre(arrondi(absC / 4, 1))} \\times 3=${texNombre(reponse1)}$`
            } else if (choixAgrandissementOuReduction >= 4) {
              texteCorr += `${sp(10)} ou bien ${sp(10)}$${absB} \\div ${coefReduction[choixAgrandissementOuReduction - 4].den}=${texNombre(reponse)}$`
              texteCorr += `${sp(10)}$${absC} \\div ${coefReduction[choixAgrandissementOuReduction - 4].den}=${texNombre(reponse1)}$`
            }
            texteCorr += `<br>Le triangle issu d'un${texteAgrandissementOuReduction[0][choixAgrandissementOuReduction < 4 ? 0 : 1]} du triangle ${nom} de coefficient $${texNombre(coefAgrandissement[choixAgrandissementOuReduction])}$ possède donc des côtés de longueur respective $${texNombre(reponse2)}$ ; $${miseEnEvidence(texNombre(reponse1))}$ et $${miseEnEvidence(texNombre(reponse))}$.`
            texteCorr += '<br>En voici, une réalisation ci-dessous.'
            objets.push(polygoneCorr, nommePolygone(polygoneCorr, nomCorr))
            objets.push(afficheLongueurSegment(angleOriente(CCorr, A, BCorr) > 0 ? A : BCorr, angleOriente(CCorr, A, BCorr) > 0 ? BCorr : A, 'red', 0.5, '', true))
            objets.push(afficheLongueurSegment(angleOriente(A, BCorr, CCorr) > 0 ? BCorr : CCorr, angleOriente(A, BCorr, CCorr) > 0 ? CCorr : BCorr, 'red', 0.5, '', true))
            objets.push(afficheLongueurSegment(angleOriente(BCorr, CCorr, A) > 0 ? CCorr : A, angleOriente(BCorr, CCorr, A) > 0 ? A : CCorr, 'red', 0.5, '', true))
            texteCorr += '<br>' + mathalea2d(Object.assign({ pixelsParCm: 20, scale: 0.5 }, fixeBordures(objets)), objets)
            longueurMax = Math.max(reponse, reponse1, reponse2)
          }
            break
          case 5: { // Rectangle avec coefficient de réduction ou d'agrandissement
            const absC = choixAgrandissementOuReduction < 4 ? randint(5, 11, [6, 9, absB]) : 2 * randint(4, 7, [arrondi(absB / 2, 0)])
            const reponse = arrondi(coefAgrandissement[choixAgrandissementOuReduction] * absB, 1)
            const reponse1 = arrondi(coefAgrandissement[choixAgrandissementOuReduction] * absC, 1)
            const alpha = randint(10, 170)
            const alphaCorr = randint(10, 170, [alpha])
            const sensRotation = choice([-1, 1])
            const B = pointAdistance(A, absB, sensRotation * alpha)
            const BCorr = pointAdistance(A, reponse, sensRotation * alphaCorr)
            const C = rotation(pointAdistance(B, absC, 180 + sensRotation * alpha), B, -90)
            const CCorr = rotation(pointAdistance(BCorr, reponse1, 180 + sensRotation * alphaCorr), BCorr, -90)
            const D = rotation(pointAdistance(A, absC, sensRotation * alpha), A, 90)
            const DCorr = rotation(pointAdistance(A, reponse1, sensRotation * alphaCorr), A, 90)
            const polygoneInit = polygone(A, B, C, D)
            const polygoneCorr = polygone(A, BCorr, CCorr, DCorr)
            const numA = randint(1, 26, [4, 5, 15, 23, 24, 25])
            const numB = randint(1, 26, [4, 5, 15, 23, 24, 25, numA])
            const numC = randint(1, 26, [4, 5, 15, 23, 24, 25, numA, numB])
            const numD = randint(1, 26, [4, 5, 15, 23, 24, 25, numA, numB, numC])
            const nom = lettreDepuisChiffre(numA) + lettreDepuisChiffre(numB) + lettreDepuisChiffre(numC) + lettreDepuisChiffre(numD)
            const numACorr = randint(1, 26, [4, 5, 15, 23, 24, 25, numA, numB, numC])
            const numBCorr = randint(1, 26, [4, 5, 15, 23, 24, 25, numA, numB, numACorr])
            const numCCorr = randint(1, 26, [4, 5, 15, 23, 24, 25, numA, numB, numACorr, numBCorr])
            const numDCorr = randint(1, 26, [4, 5, 15, 23, 24, 25, numA, numB, numACorr, numBCorr, numCCorr])
            const nomCorr = lettreDepuisChiffre(numACorr) + lettreDepuisChiffre(numBCorr) + lettreDepuisChiffre(numCCorr) + lettreDepuisChiffre(numDCorr)
            objets.push(polygoneInit, nommePolygone(polygoneInit, nom))
            objets.push(codageSegments('||', 'red', A, B, C, D))
            objets.push(codageSegments('X', 'red', B, C, D, A))
            objets.push(afficheLongueurSegment(angleOriente(B, C, D) > 0 ? C : D, angleOriente(B, C, D) > 0 ? D : C, 'blue', 0.5, '', true))
            objets.push(afficheLongueurSegment(angleOriente(C, D, A) > 0 ? D : A, angleOriente(C, D, A) > 0 ? A : D, 'blue', 0.5, '', true))
            objets.push(codageAngleDroit(A, B, C), codageAngleDroit(D, C, B), codageAngleDroit(A, D, C), codageAngleDroit(B, A, D))
            const enonceInit = `On décide d'effectuer un${texteAgrandissementOuReduction[0][choixAgrandissementOuReduction < 4 ? 0 : 1]} de coefficient $${texNombre(coefAgrandissement[choixAgrandissementOuReduction])}$ du rectangle ${nom}. Quelles seront les longueurs respectives de chaque côté du rectangle à construire ?`
            const enonceAMC = '<br>' + mathalea2d(Object.assign({
              pixelsParCm: 20,
              scale: 0.5
            }, fixeBordures(objets)), objets)
            if (this.interactif) {
              texte = enonceInit
              texte += enonceAMC
              texte += '<br> Dans le nouveau rectangle, le côté le moins long aura pour longueur : ' + ajouteChampTexteMathLive(this, i + ii, 'inline', { tailleExtensible: true })
              setReponse(this, i + ii, min(reponse, reponse1))
              ii++
              texte += '<br> Dans le nouveau rectangle, le côté le plus long aura pour longueur : ' + ajouteChampTexteMathLive(this, i + ii, 'inline', { tailleExtensible: true })
              setReponse(this, i + ii, max(reponse, reponse1))
            } else if (!context.isAmc) {
              texte = `Trace un${texteAgrandissementOuReduction[0][choixAgrandissementOuReduction < 4 ? 0 : 1]} de coefficient $${texNombre(coefAgrandissement[choixAgrandissementOuReduction])}$ du rectangle ${nom}.`
              texte += '<br>' + mathalea2d(Object.assign({ pixelsParCm: 20, scale: 0.5 }, fixeBordures(objets)), objets)
            } else {
              propositionsAMC[iiAMC] = {
                type: 'AMCOpen',
                propositions:
                  [
                    {
                      texte: '',
                      statut: 1,
                      sanscadre: true,
                      enonce: enonceAMC + `<br>Trace, sur une feuille blanche, ${texteAgrandissementOuReduction[1][choixAgrandissementOuReduction < 4 ? 0 : 1]}.`,
                      sanslignes: true
                    }
                  ]
              }
              iiAMC++
              propositionsAMC[iiAMC] = {
                type: 'AMCNum',
                propositions: [{
                  texte: '',
                  statut: '',
                  reponse: {
                    texte: enonceInit + '<br> <br>Dans le nouveau rectangle, le côté le moins long aura pour longueur :',
                    valeur: [min(reponse, reponse1)],
                    alignement: 'center',
                    param: {
                      digits: nombreDeChiffresDe(min(reponse, reponse1)),
                      decimals: nombreDeChiffresDansLaPartieDecimale(min(reponse, reponse1)),
                      signe: false
                    }
                  }
                }]
              }
              iiAMC++
              propositionsAMC[iiAMC] = {
                type: 'AMCNum',
                propositions: [{
                  texte: '',
                  statut: '',
                  reponse: {
                    texte: 'Dans le nouveau rectangle, le côté le plus long aura pour longueur :',
                    valeur: [max(reponse, reponse1)],
                    alignement: 'center',
                    param: {
                      digits: nombreDeChiffresDe(max(reponse, reponse1)),
                      decimals: nombreDeChiffresDansLaPartieDecimale(max(reponse, reponse1)),
                      signe: false
                    }
                  }
                }]
              }
              iiAMC++
            }
            texteCorr = `Effectuer un${texteAgrandissementOuReduction[0][choixAgrandissementOuReduction < 4 ? 0 : 1]} de coefficient $${texNombre(coefAgrandissement[choixAgrandissementOuReduction])}$ implique de multiplier toutes les longueurs par ce coefficient`
            if (choixAgrandissementOuReduction >= 4) {
              texteCorr += ` ou bien, comme $${texNombre(coefAgrandissement[choixAgrandissementOuReduction])}=${coefReduction[choixAgrandissementOuReduction - 4].texFraction}$, cela revient à diviser toutes les longueurs par $${coefReduction[choixAgrandissementOuReduction - 4].den}$`
              texteCorr += choixAgrandissementOuReduction === 6 ? ' puis multiplier chacun de ces résultats par 3' : ''
            }
            texteCorr += '.<br>'
            texteCorr += `$${absB} \\times ${coefAgrandissement[choixAgrandissementOuReduction]}=${texNombre(reponse)}${sp(10)}$`
            texteCorr += `$${absC} \\times ${coefAgrandissement[choixAgrandissementOuReduction]}=${texNombre(reponse1)}$`
            if (choixAgrandissementOuReduction === 6) {
              texteCorr += `${sp(10)} ou bien ${sp(10)}$(${absB} \\div 4) \\times 3=${texNombre(arrondi(absB / 4, 1))} \\times 3=${texNombre(reponse)}$`
              texteCorr += `${sp(10)}$(${absC} \\div 4) \\times 3=${texNombre(arrondi(absC / 4, 1))} \\times 3=${texNombre(reponse1)}$`
            } else if (choixAgrandissementOuReduction >= 4) {
              texteCorr += `${sp(10)} ou bien ${sp(10)}$${absB} \\div ${coefReduction[choixAgrandissementOuReduction - 4].den}=${texNombre(reponse)}$`
              texteCorr += `${sp(10)}$${absC} \\div ${coefReduction[choixAgrandissementOuReduction - 4].den}=${texNombre(reponse1)}$`
            }
            texteCorr += `<br>Le rectangle issu d'un${texteAgrandissementOuReduction[0][choixAgrandissementOuReduction < 4 ? 0 : 1]} du rectangle ${nom} de coefficient $${texNombre(coefAgrandissement[choixAgrandissementOuReduction])}$ possède donc des côtés de longueur respective $${miseEnEvidence(texNombre(reponse))}$ et $${miseEnEvidence(texNombre(reponse1))}$.`
            texteCorr += '<br>En voici, une réalisation ci-dessous.'
            objets.push(polygoneCorr, nommePolygone(polygoneCorr, nomCorr))
            objets.push(codageSegments('|||', 'blue', A, BCorr, CCorr, DCorr))
            objets.push(codageSegments('XX', 'blue', BCorr, CCorr, DCorr, A))
            objets.push(afficheLongueurSegment(angleOriente(CCorr, A, BCorr) > 0 ? A : BCorr, angleOriente(CCorr, A, BCorr) > 0 ? BCorr : A, 'red', 0.5, '', true))
            objets.push(afficheLongueurSegment(angleOriente(A, BCorr, CCorr) > 0 ? BCorr : CCorr, angleOriente(A, BCorr, CCorr) > 0 ? CCorr : BCorr, 'red', 0.5, '', true))
            objets.push(codageAngleDroit(A, BCorr, CCorr), codageAngleDroit(DCorr, CCorr, BCorr), codageAngleDroit(A, DCorr, CCorr), codageAngleDroit(BCorr, A, DCorr))
            texteCorr += '<br>' + mathalea2d(Object.assign({ pixelsParCm: 20, scale: 0.5 }, fixeBordures(objets)), objets)
            longueurMax = Math.max(reponse, reponse1)
          }
            break
          default: { // Rectangle avec longueur initiale et longueur finale
            const absC = choixAgrandissementOuReduction < 4 ? randint(5, 11, [6, 9, absB]) : 2 * randint(4, 7, [arrondi(absB / 2, 0)])
            const reponse = arrondi(coefAgrandissement[choixAgrandissementOuReduction] * absB, 1)
            const reponse1 = arrondi(coefAgrandissement[choixAgrandissementOuReduction] * absC, 1)
            const alpha = randint(10, 170)
            const alphaCorr = randint(10, 170, [alpha])
            const sensRotation = choice([-1, 1])
            const B = pointAdistance(A, absB, sensRotation * alpha)
            const BCorr = pointAdistance(A, reponse, sensRotation * alphaCorr)
            const C = rotation(pointAdistance(B, absC, 180 + sensRotation * alpha), B, -90)
            const CCorr = rotation(pointAdistance(BCorr, reponse1, 180 + sensRotation * alphaCorr), BCorr, -90)
            const D = rotation(pointAdistance(A, absC, sensRotation * alpha), A, 90)
            const DCorr = rotation(pointAdistance(A, reponse1, sensRotation * alphaCorr), A, 90)
            const polygoneInit = polygone(A, B, C, D)
            const polygoneCorr = polygone(A, BCorr, CCorr, DCorr)
            const numA = randint(1, 26, [4, 5, 15, 23, 24, 25])
            const numB = randint(1, 26, [4, 5, 15, 23, 24, 25, numA])
            const numC = randint(1, 26, [4, 5, 15, 23, 24, 25, numA, numB])
            const numD = randint(1, 26, [4, 5, 15, 23, 24, 25, numA, numB, numC])
            const nom = lettreDepuisChiffre(numA) + lettreDepuisChiffre(numB) + lettreDepuisChiffre(numC) + lettreDepuisChiffre(numD)
            const numACorr = randint(1, 26, [4, 5, 15, 23, 24, 25, numA, numB, numC])
            const numBCorr = randint(1, 26, [4, 5, 15, 23, 24, 25, numA, numB, numACorr])
            const numCCorr = randint(1, 26, [4, 5, 15, 23, 24, 25, numA, numB, numACorr, numBCorr])
            const numDCorr = randint(1, 26, [4, 5, 15, 23, 24, 25, numA, numB, numACorr, numBCorr, numCCorr])
            const nomCorr = lettreDepuisChiffre(numACorr) + lettreDepuisChiffre(numBCorr) + lettreDepuisChiffre(numCCorr) + lettreDepuisChiffre(numDCorr)
            objets.push(polygoneInit, nommePolygone(polygoneInit, nom))
            objets.push(codageSegments('||', 'red', A, B, C, D))
            objets.push(codageSegments('X', 'red', B, C, D, A))
            objets.push(afficheLongueurSegment(angleOriente(B, C, D) > 0 ? C : D, angleOriente(B, C, D) > 0 ? D : C, 'blue', 0.5, '', true))
            objets.push(afficheLongueurSegment(angleOriente(C, D, A) > 0 ? D : A, angleOriente(C, D, A) > 0 ? A : D, 'blue', 0.5, '', true))
            objets.push(codageAngleDroit(A, B, C), codageAngleDroit(D, C, B), codageAngleDroit(A, D, C), codageAngleDroit(B, A, D))
            const enonceInit = `On décide d'effectuer un${texteAgrandissementOuReduction[0][choixAgrandissementOuReduction < 4 ? 0 : 1]} du rectangle ${nom}, de telle sorte que la longueur du côté associé à [${lettreDepuisChiffre(numA) + lettreDepuisChiffre(numB)}] mesurera $${texNombre(reponse)}$. Quelle sera l'autre dimension du rectangle à construire ?`
            const enonceAMC = '<br>' + mathalea2d(Object.assign({
              pixelsParCm: 20,
              scale: 0.5
            }, fixeBordures(objets)), objets)
            if (this.interactif) {
              texte = enonceInit
              texte += ajouteChampTexteMathLive(this, i + ii, 'inline', { tailleExtensible: true })
              texte += enonceAMC
              setReponse(this, i + ii, reponse1)
            } else if (!context.isAmc) {
              texte = `Trace un${texteAgrandissementOuReduction[0][choixAgrandissementOuReduction < 4 ? 0 : 1]} du rectangle ${nom} de telle sorte que la longueur du côté associé à [${lettreDepuisChiffre(numA) + lettreDepuisChiffre(numB)}] mesurera $${texNombre(reponse)}$.`
              texte += '<br>' + mathalea2d(Object.assign({ pixelsParCm: 20, scale: 0.5 }, fixeBordures(objets)), objets)
            } else {
              propositionsAMC[iiAMC] = {
                type: 'AMCOpen',
                propositions:
                  [
                    {
                      texte: '',
                      statut: 1,
                      sanscadre: true,
                      enonce: enonceAMC + `<br>Trace, sur une feuille blanche, ${texteAgrandissementOuReduction[1][choixAgrandissementOuReduction < 4 ? 0 : 1]}.`,
                      sanslignes: true
                    }
                  ]
              }
              iiAMC++
              propositionsAMC[iiAMC] = {
                type: 'AMCNum',
                propositions: [{
                  texte: '',
                  statut: '',
                  reponse: {
                    texte: enonceInit + '<br> <br>Dans le nouveau rectangle, la deuxième longueur sera :',
                    valeur: [reponse1],
                    alignement: 'center',
                    param: {
                      digits: nombreDeChiffresDe(reponse1),
                      decimals: nombreDeChiffresDansLaPartieDecimale(reponse1),
                      signe: false
                    }
                  }
                }]
              }
            }
            texteCorr = `Effectuer un${texteAgrandissementOuReduction[0][choixAgrandissementOuReduction < 4 ? 0 : 1]} implique de multiplier toutes les longueurs par un coefficient de proportionnalité. Trouvons ce coefficient.<br>`
            texteCorr += `Pour trouver ce coefficient, divisons la longueur connue du futur rectangle par sa longueur associée dans le rectangle actuel : $${texNombre(reponse)} \\div ${absB} = ${coefAgrandissement[choixAgrandissementOuReduction]}$. Le coefficient de proportionnalité est donc $${coefAgrandissement[choixAgrandissementOuReduction]}$.<br>`
            texteCorr += `Multiplions toutes les longueurs connues du triangle actuel par $${coefAgrandissement[choixAgrandissementOuReduction]}$`

            if (choixAgrandissementOuReduction >= 4) {
              texteCorr += ` ou bien, comme $${texNombre(coefAgrandissement[choixAgrandissementOuReduction])}=${coefReduction[choixAgrandissementOuReduction - 4].texFraction}$, cela revient à diviser toutes les longueurs par $${coefReduction[choixAgrandissementOuReduction - 4].den}$`
              texteCorr += choixAgrandissementOuReduction === 6 ? ' puis multiplier chacun de ces résultats par 3' : ''
            }
            texteCorr += '.<br>'
            texteCorr += `$${absC} \\times ${coefAgrandissement[choixAgrandissementOuReduction]}=${texNombre(reponse1)}$`
            if (choixAgrandissementOuReduction === 6) {
              texteCorr += `${sp(10)} ou bien ${sp(10)}$(${absC} \\div 4) \\times 3=${texNombre(arrondi(absC / 4, 1))} \\times 3=${texNombre(reponse1)}$`
            } else if (choixAgrandissementOuReduction >= 4) {
              texteCorr += `${sp(10)} ou bien ${sp(10)}$${absC} \\div ${coefReduction[choixAgrandissementOuReduction - 4].den}=${texNombre(reponse1)}$`
            }
            texteCorr += `<br>Le rectangle issu d'un${texteAgrandissementOuReduction[0][choixAgrandissementOuReduction < 4 ? 0 : 1]} du rectangle ${nom} de coefficient $${texNombre(coefAgrandissement[choixAgrandissementOuReduction])}$ possède donc des côtés de longueur respective $${miseEnEvidence(texNombre(reponse))}$ et $${miseEnEvidence(texNombre(reponse1))}$.`
            texteCorr += '<br>En voici, une réalisation ci-dessous.'
            objets.push(polygoneCorr, nommePolygone(polygoneCorr, nomCorr))
            objets.push(codageSegments('|||', 'blue', A, BCorr, CCorr, DCorr))
            objets.push(codageSegments('XX', 'blue', BCorr, CCorr, DCorr, A))
            objets.push(afficheLongueurSegment(angleOriente(CCorr, A, BCorr) > 0 ? A : BCorr, angleOriente(CCorr, A, BCorr) > 0 ? BCorr : A, 'red', 0.5, '', true))
            objets.push(afficheLongueurSegment(angleOriente(A, BCorr, CCorr) > 0 ? BCorr : CCorr, angleOriente(A, BCorr, CCorr) > 0 ? CCorr : BCorr, 'red', 0.5, '', true))
            objets.push(codageAngleDroit(A, BCorr, CCorr), codageAngleDroit(DCorr, CCorr, BCorr), codageAngleDroit(A, DCorr, CCorr), codageAngleDroit(BCorr, A, DCorr))
            texteCorr += '<br>' + mathalea2d(Object.assign({ pixelsParCm: 20, scale: 0.5 }, fixeBordures(objets)), objets)
            longueurMax = Math.max(reponse, reponse1)
          }
            break
        }
        if (context.isAmc) {
          this.autoCorrection[i] = {
            enonce: '',
            options: { multicols: true, barreseparation: false },
            enonceCentre: true,
            enonceAvant: true, // EE : ce champ est facultatif et permet (si false) de supprimer l'énoncé ci-dessus avant la numérotation de chaque question.
            propositions: propositionsAMC
          }
        }
        cpt++
      } while (longueurMax > longueurMaximum && cpt < 200)
      if (this.questionJamaisPosee(i, absBFinal, coeffFinal, listeTypeQuestions[i])) {
        // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}

export default AgrandirReduireFigure
