import { codageAngleDroit } from '../../lib/2d/angles.js'
import { afficheLongueurSegment, codageSegments } from '../../lib/2d/codages.js'
import { point, pointAdistance } from '../../lib/2d/points.js'
import { polygoneAvecNom } from '../../lib/2d/polygones.js'
import { vecteur } from '../../lib/2d/segmentsVecteurs.js'
import { rotation, similitude, translation } from '../../lib/2d/transformations.js'
import { arrondi, nombreDeChiffresDe } from '../../lib/outils/nombres'
import { creerNomDePolygone, numAlpha, sp } from '../../lib/outils/outilString.js'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { fixeBordures, mathalea2d } from '../../modules/2dGeneralites.js'
import { context } from '../../modules/context.js'
import { calculANePlusJamaisUtiliser, gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import Grandeur from '../../modules/Grandeur'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { setReponse } from '../../lib/interactif/gestionInteractif'

export const titre = 'Calculer périmètre et aire de carrés, rectangles et triangles rectangles'
export const amcReady = true
export const amcType = 'AMCHybride'
export const interactifType = 'mathLive'
export const interactifReady = true
export const dateDeModifImportante = '12/04/2023' // Ajout de trois paramètres - séparation des figures, des demandes d'aires et/ ou de périmètres, affichage ou pas des figures - par EE
/**
 * Un carré, un rectangle et un triangle rectangle sont tracés.
 * Il faut calculer les aires
 * @author Rémi Angot
 */
export const uuid = 'd1513'
export const ref = '6M11-1'
export const refs = {
  'fr-fr': ['6M11-1'],
  'fr-ch': ['9GM1-4']
}
export default function PerimetreOuAireDeCarresRectanglesTriangles () {
  Exercice.call(this)
  this.interactif = false
  this.nbCols = 1
  this.nbColsCorr = 1
  this.nbQuestions = 1
  this.sup = 4
  this.sup2 = 3
  this.sup3 = true
  this.nouvelleVersion = function () {
    this.listeQuestions = []
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []

    const QuestionsDisponibles = gestionnaireFormulaireTexte({
      max: 3,
      defaut: 4,
      melange: 4,
      nbQuestions: 6,
      shuffle: true,
      saisie: this.sup,
      enleveDoublons: true
    })

    const incrementation = QuestionsDisponibles.length * (this.sup2 === 3 ? 2 : 1)
    for (let i = 0, texte, texteAMC, texteCorr, nbPuces, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      const nom = creerNomDePolygone(11, 'QD')
      const c = randint(2, 6)
      const L = randint(2, 5)
      const l = randint(2, 5, L)
      const a = randint(2, 5)
      const b = randint(2, 5)
      const c2 = Math.sqrt(a * a + b * b)
      const pIJK = arrondi(a + b + c2, 1)
      const A = point(0, 0, nom[0])
      const B = rotation(point(c, 0), A, randint(-15, 15), nom[1])
      const C = rotation(A, B, -90, nom[2])
      const D = rotation(B, A, 90, nom[3])
      const carre = polygoneAvecNom(A, B, C, D)
      const E = point(8, 0, nom[4])
      const F = pointAdistance(E, L, randint(-15, 15), nom[5])
      const G = similitude(E, F, -90, l / L, nom[6])
      const H = translation(G, vecteur(F, E), nom[7])
      const rectangle = polygoneAvecNom(E, F, G, H)
      const I = point(15, 0, nom[8])
      const J = pointAdistance(I, a, randint(-25, 25), nom[9])
      const K = similitude(I, J, -90, b / a, nom[10])
      const triangle = polygoneAvecNom(I, J, K)
      const objetsEnonce = [...carre, codageAngleDroit(A, B, C), codageAngleDroit(A, D, C), codageAngleDroit(D, C, B), codageAngleDroit(B, A, D), codageSegments('//', 'blue', [A, B, C, D]), afficheLongueurSegment(B, A),
        ...rectangle, codageAngleDroit(E, F, G), codageAngleDroit(F, G, H), codageAngleDroit(G, H, E), codageAngleDroit(H, E, F), codageSegments('/', 'red', E, F, G, H), codageSegments('||', 'blue', F, G, H, E), afficheLongueurSegment(F, E), afficheLongueurSegment(G, F),
        ...triangle, codageAngleDroit(I, J, K), afficheLongueurSegment(J, I), afficheLongueurSegment(K, J), afficheLongueurSegment(I, K)]
      texte = this.sup3
        ? mathalea2d(Object.assign({}, fixeBordures(objetsEnonce), {
          pixelsParCm: 20,
          scale: 0.75,
          mainlevee: false
        }), objetsEnonce) + '<br>'
      //  ? mathalea2d(Object.assign({}, fixeBordures(objetsEnonce), { pixelsParCm: 20, scale: 0.75, mainlevee: false }), objetsEnonce)
        : ''
      if (context.isAmc) {
        this.autoCorrection[i] = {
          enonce: texte,
          options: { barreseparation: true, numerotationEnonce: true },
          propositions: []
        }
      }

      texteCorr = ''
      nbPuces = 0
      for (let ee = 0; ee < QuestionsDisponibles.length; ee++) {
        switch (QuestionsDisponibles[ee]) {
          case 1 : // Carré
            if (this.sup2 !== 2) {
              texteAMC = numAlpha(nbPuces) + 'Calculer le périmètre, en cm, '
              texteAMC += this.sup3 ? 'du carré ci-dessus.' : `d'un carré de côté${sp()}$${texNombre(c)}$${sp()}cm.`
              texte += texteAMC + ajouteChampTexteMathLive(this, incrementation * i + nbPuces, ' unites[longueurs,aires]') + '<br>'

              texteCorr += numAlpha(nbPuces) + `$\\mathcal{P}_{${nom[0] + nom[1] + nom[2] + nom[3]}}=${c}${sp()}\\text{cm}+${c}${sp()}\\text{cm}+${c}${sp()}\\text{cm}+${c}${sp()}\\text{cm}=${4 * c
                            }${sp()}\\text{cm}$<br>`
              setReponse(this, incrementation * i + nbPuces, new Grandeur(c * 4, 'cm'), { formatInteractif: 'unites' })
              if (context.isAmc) {
                this.autoCorrection[i].propositions.push({
                  type: 'AMCNum',
                  propositions: [{
                    texte: '',
                    multicolsBegin: nbPuces === 0,
                    multicolsEnd: nbPuces === incrementation - 1,
                    reponse: {
                      texte: texteAMC,
                      valeur: c * 4,
                      alignement: 'center',
                      param: {
                        signe: false,
                        decimals: 0,
                        digits: nombreDeChiffresDe(c * 4)
                      }
                    }
                  }]
                })
              }
              nbPuces++
            }
            if (this.sup2 !== 1) {
              texteAMC = numAlpha(nbPuces) + 'Calculer l\'aire, en cm$^2$, '
              texteAMC += this.sup3 ? 'du carré ci-dessus.' : `d'un carré de côté${sp()}$${texNombre(c)}$${sp()}cm.`
              texte += texteAMC + ajouteChampTexteMathLive(this, incrementation * i + nbPuces, ' unites[longueurs,aires]') + '<br>'

              texteCorr += numAlpha(nbPuces) + `$\\mathcal{A}_{${nom[0] + nom[1] + nom[2] + nom[3]}}=${c}${sp()}\\text{cm}\\times${c}${sp()}\\text{cm}=${c * c}${sp()}\\text{cm}^2$<br>`
              setReponse(this, incrementation * i + nbPuces, new Grandeur(c * c, 'cm^2'), { formatInteractif: 'unites' })
              if (context.isAmc) {
                this.autoCorrection[i].propositions.push({
                  type: 'AMCNum',
                  propositions: [{
                    texte: '',
                    multicolsBegin: nbPuces === 0,
                    multicolsEnd: nbPuces === incrementation - 1,
                    reponse: {
                      texte: texteAMC,
                      valeur: c * c,
                      alignement: 'center',
                      param: {
                        signe: false,
                        decimals: 0,
                        digits: nombreDeChiffresDe(c * c)
                      }
                    }
                  }]
                })
              }
              nbPuces++
            }
            break
          case 2 : // Rectangle
            if (this.sup2 !== 2) {
              texteAMC = numAlpha(nbPuces) + 'Calculer le périmètre, en cm, '
              texteAMC += this.sup3 ? 'du rectangle ci-dessus.' : `d'un rectangle de longueur${sp()}$${texNombre(L > l ? L : l)}$${sp()}cm et de largeur${sp()}$${texNombre(L > l ? l : L)}$${sp()}cm.`
              texte += texteAMC + ajouteChampTexteMathLive(this, incrementation * i + nbPuces, ' unites[longueurs,aires]') + '<br>'

              texteCorr += numAlpha(nbPuces) + `$\\mathcal{P}_{${nom[4] + nom[5] + nom[6] + nom[7]}}=${L}${sp()}\\text{cm}+${l}${sp()}\\text{cm}+${L}${sp()}\\text{cm}+${l}${sp()}\\text{cm}=${2 * L + 2 * l
                            }${sp()}\\text{cm}$<br>`
              setReponse(this, incrementation * i + nbPuces, new Grandeur((L + l) * 2, 'cm'), { formatInteractif: 'unites' })
              if (context.isAmc) {
                this.autoCorrection[i].propositions.push({
                  type: 'AMCNum',
                  propositions: [{
                    texte: '',
                    multicolsBegin: nbPuces === 0,
                    multicolsEnd: nbPuces === incrementation - 1,
                    reponse: {
                      texte: texteAMC,
                      valeur: (L + l) * 2,
                      alignement: 'center',
                      param: {
                        signe: false,
                        decimals: 0,
                        digits: nombreDeChiffresDe((L + l) * 2)
                      }
                    }
                  }]
                })
              }
              nbPuces++
            }
            if (this.sup2 !== 1) {
              texteAMC = numAlpha(nbPuces) + 'Calculer l\'aire, en cm$^2$, '
              texteAMC += this.sup3 ? 'du rectangle ci-dessus.' : `d'un rectangle de longueur${sp()}$${texNombre(L > l ? L : l)}$${sp()}cm et de largeur${sp()}$${texNombre(L > l ? l : L)}$${sp()}cm.`
              texte += texteAMC + ajouteChampTexteMathLive(this, incrementation * i + nbPuces, ' unites[longueurs,aires]') + '<br>'

              texteCorr += numAlpha(nbPuces) + `$\\mathcal{A}_{${nom[4] + nom[5] + nom[6] + nom[7]}}=${L}${sp()}\\text{cm}\\times${l}${sp()}\\text{cm}=${L * l
                            }${sp()}\\text{cm}^2$<br>`
              setReponse(this, incrementation * i + nbPuces, new Grandeur(L * l, 'cm^2'), { formatInteractif: 'unites' })
              if (context.isAmc) {
                this.autoCorrection[i].propositions.push({
                  type: 'AMCNum',
                  propositions: [{
                    texte: '',
                    multicolsBegin: nbPuces === 0,
                    multicolsEnd: nbPuces === incrementation - 1,
                    reponse: {
                      texte: texteAMC,
                      valeur: L * l,
                      alignement: 'center',
                      param: {
                        signe: false,
                        decimals: 0,
                        digits: nombreDeChiffresDe(L * l)
                      }
                    }
                  }]
                })
              }
              nbPuces++
            }
            break
          case 3 : // Triangle rectangle
            if (this.sup2 !== 2) {
              texteAMC = numAlpha(nbPuces) + 'Calculer le périmètre, en cm, '
              texteAMC += this.sup3 ? 'du triangle rectangle ci-dessus.' : `d'un triangle rectangle dont l'hypoténuse mesure $${texNombre(c2, 1)}$${sp()}cm et les côtés de l'angle droit mesurent respectivement $${texNombre(a)}$${sp()}cm et $${texNombre(b)}$${sp()}cm.`
              texte += texteAMC + ajouteChampTexteMathLive(this, incrementation * i + nbPuces, ' unites[longueurs,aires]') + '<br>'

              texteCorr += numAlpha(nbPuces) + `$\\mathcal{P}_{${nom[8] + nom[9] + nom[10]}}=${a}${sp()}\\text{cm}+${b}${sp()}\\text{cm}+${texNombre(c2, 1)}${sp()}\\text{cm}=${texNombre(pIJK)}${sp()}\\text{cm}$<br>`
              setReponse(this, incrementation * i + nbPuces, new Grandeur(pIJK, 'cm'), { formatInteractif: 'unites' })
              if (context.isAmc) {
                this.autoCorrection[i].propositions.push({
                  type: 'AMCNum',
                  propositions: [{
                    texte: '',
                    multicolsBegin: nbPuces === 0,
                    multicolsEnd: nbPuces === incrementation - 1,
                    reponse: {
                      texte: texteAMC,
                      valeur: pIJK,
                      alignement: 'center',
                      param: {
                        signe: false,
                        decimals: 0,
                        digits: nombreDeChiffresDe(pIJK)
                      }
                    }
                  }]
                })
              }
              nbPuces++
            }
            if (this.sup2 !== 1) {
              texteAMC = numAlpha(nbPuces) + 'Calculer l\'aire, en cm$^2$, '
              texteAMC += this.sup3 ? 'du triangle rectangle ci-dessus.' : `d'un triangle rectangle dont l'hypoténuse mesure $${texNombre(c2, 1)}$${sp()}cm et les côtés de l'angle droit mesurent respectivement $${texNombre(a)}$${sp()}cm et $${texNombre(b)}$${sp()}cm.`
              texte += texteAMC + ajouteChampTexteMathLive(this, incrementation * i + nbPuces, ' unites[longueurs,aires]') + '<br>'

              texteCorr += numAlpha(nbPuces) + `$\\mathcal{A}_{${nom[8] + nom[9] + nom[10]}}=${a}${sp()}\\text{cm}\\times${b}${sp()}\\text{cm}\\div2=${texNombre(calculANePlusJamaisUtiliser((a * b) / 2))}${sp()}\\text{cm}^2$<br>`
              setReponse(this, incrementation * i + nbPuces, new Grandeur(calculANePlusJamaisUtiliser((a * b) / 2), 'cm^2'), { formatInteractif: 'unites' })
              if (context.isAmc) {
                this.autoCorrection[i].propositions.push({
                  type: 'AMCNum',
                  propositions: [{
                    texte: '',
                    multicolsBegin: nbPuces === 0,
                    multicolsEnd: nbPuces === incrementation - 1,
                    reponse: {
                      texte: texteAMC,
                      valeur: calculANePlusJamaisUtiliser((a * b) / 2),
                      alignement: 'center',
                      param: {
                        signe: false,
                        decimals: 0,
                        digits: nombreDeChiffresDe(calculANePlusJamaisUtiliser((a * b) / 2))
                      }
                    }
                  }]
                })
              }
              nbPuces++
            }
            break
        }
      }
      if (this.questionJamaisPosee(i, texte)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireTexte = [
    'Type de figures',
    'Nombres séparés par des tirets\n1 : Carré\n2 : Rectangle\n3 : Triangle rectangle\n4 : Mélange'
  ]
  this.besoinFormulaire2Numerique = ['Niveau de difficulté', 3, '1 : Périmètres\n2 : Aires\n3 : Périmètres et aires']
  this.besoinFormulaire3CaseACocher = ['Avec figures']
}
