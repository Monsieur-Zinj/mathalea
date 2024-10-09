import { cercle, cercleCentrePoint, traceCompas } from '../../lib/2d/cercle.js'
import { cibleCarree, dansLaCibleCarree } from '../../lib/2d/cibles.js'
import { codageSegments } from '../../lib/2d/codages.js'
import { droite } from '../../lib/2d/droites.js'
import { point, pointAdistance, pointIntersectionCC, tracePoint } from '../../lib/2d/points.js'
import { polygoneAvecNom } from '../../lib/2d/polygones.js'
import { segment } from '../../lib/2d/segmentsVecteurs.js'
import { labelPoint, texteParPoint } from '../../lib/2d/textes.ts'
import { rotation, similitude } from '../../lib/2d/transformations.js'
import { choice } from '../../lib/outils/arrayOutils'
import { choisitLettresDifferentes } from '../../lib/outils/aleatoires'
import { lettreDepuisChiffre, numAlpha } from '../../lib/outils/outilString.js'
import Exercice from '../deprecatedExercice.js'
import { fixeBordures, mathalea2d } from '../../modules/2dGeneralites.js'
import { listeQuestionsToContenu, randint, calculANePlusJamaisUtiliser, gestionnaireFormulaireTexte } from '../../modules/outils.js'
import Alea2iep from '../../modules/Alea2iep.js'
import { context } from '../../modules/context.js'

export const titre = 'Construire des parallélogrammes avec dispositif d\'auto-correction'
export const dateDeModifImportante = '18/04/2024'
export const dateDePublication = '30/11/2020'
export const amcReady = true
export const amcType = 'AMCHybride'

/**
 * Terminer la construction d'un parallélogramme
 * @author Jean-Claude Lhote (exercice) et Rémi Angot (animations)
 * Ajout de la possibilité de choisir le nombre de questions par Guillaume Valmont le 08/05/2022
 */
export const uuid = 'b611a'
export const ref = '5G40'
export const refs = {
  'fr-fr': ['5G40'],
  'fr-ch': ['9ES4-4']
}
export default function ConstructionsParallelogrammes () {
  Exercice.call(this)
  this.nbQuestions = 1
  this.nbCols = 1
  this.nbColsCorr = 1
  this.sup = 5
  this.sup2 = 2
  this.spacingCorr = 2
  this.correctionDetaillee = false
  this.correctionDetailleeDisponible = true
  this.typeExercice = 'IEP'
  this.nouvelleVersion = function (numeroExercice) {
    const tailleGrille = 0.2 + this.sup2 * 0.2
    this.autoCorrection = [] // Tous les types de questions sont posés mais l'ordre diffère à chaque "cycle"
    // const typeQuestionsDisponibles = [1, 2, 3, 4]
    //    if (this.sup < 5) typeQuestionsDisponibles = [parseInt(this.sup)]

    //  const listeTypeQuestions = combinaisonListes(typeQuestionsDisponibles, this.nbQuestions)

    const listeTypeQuestions = gestionnaireFormulaireTexte({
      saisie: this.sup,
      min: 1,
      max: 4,
      melange: 5,
      defaut: 5,
      nbQuestions: this.nbQuestions
    })

    for (let i = 0, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      const celluleAlea = function (rang) {
        const lettre = lettreDepuisChiffre(randint(1, rang))
        const chiffre = Number(randint(1, rang)).toString()
        return lettre + chiffre
      }
      // On prépare la figure...
      const noms = choisitLettresDifferentes(5, 'QO', true) // on choisit 5 lettres, les 4 premières sont les sommets, la 5e est le centre
      const nom = `${noms[0] + noms[1] + noms[2] + noms[3]}`
      const objetsEnonce = []
      const objetsCorrection = []
      // Préparation de la figure aléatoire et des objets 2d utiles
      const O = point(0, 0, noms[4])
      const A = rotation(pointAdistance(O, calculANePlusJamaisUtiliser(randint(50, 70) / 10)), O, randint(0, 179) * choice([-1, 1]), noms[0])
      const C = rotation(A, O, 180, noms[2])
      const B = similitude(A, O, randint(50, 80) * choice([-1, 1]), randint(6, 7) * choice([-1, 1]) / 5, noms[1])
      const D = rotation(B, O, 180, noms[3])
      const p = polygoneAvecNom(A, B, C, D)
      const d1 = segment(O, A)
      const d2 = segment(O, B)
      const d3 = segment(O, C)
      const d4 = segment(O, D)
      const c1 = segment(A, B)
      const c4 = segment(D, A)
      const dd1 = droite(A, B)
      const dd2 = droite(A, D)
      const dd3 = droite(C, D)
      const dd4 = droite(C, B)
      const cellule = celluleAlea(5)
      const cellule2 = celluleAlea(5)
      const cellule3 = celluleAlea(5)

      const result = dansLaCibleCarree(C.x, C.y, 5, tailleGrille, cellule)
      const result2 = dansLaCibleCarree(D.x, D.y, 5, tailleGrille, cellule2)
      const result3 = dansLaCibleCarree(B.x, B.y, 5, tailleGrille, cellule3)

      const cible = cibleCarree({ x: result[0], y: result[1], rang: 5, num: listeTypeQuestions[i] > 2 ? 1 : '', taille: tailleGrille, color: 'gray', opacite: 0.7 })
      const cible2 = cibleCarree({ x: result2[0], y: result2[1], rang: 5, num: 2, taille: tailleGrille, color: 'gray', opacite: 0.7 })
      const cible3 = cibleCarree({ x: result3[0], y: result3[1], rang: 5, num: 3, taille: tailleGrille, color: 'gray', opacite: 0.7 })
      const xMin = Math.min(A.x, B.x, C.x, D.x) - 3
      const yMin = Math.min(A.y, B.y, C.y, D.y) - 4
      const xMax = Math.max(A.x, B.x, C.x, D.x) + 4
      const yMax = Math.max(A.y, B.y, C.y, D.y) + 3

      let P
      const animIEP = new Alea2iep()
      animIEP.recadre(xMin, yMax) // Il faut recadrer en première étape pour bien calculer les coordonnées des points
      const reponseLettres = ['A', 'B', 'C', 'D', 'E']
      const reponseChiffres = ['1', '2', '3', '4', '5']
      switch (listeTypeQuestions[i]) {
        case 1: // deux côtés consécutifs
          texte = `Construire le parallélogramme $${nom}$`
          texte += ' et le coder afin de faire comprendre par quelle méthode ce parallélogramme a été construit.'
          texteCorr = 'Plusieurs constructions sont possibles'
          if (this.correctionDetaillee) {
            texteCorr += ' :<br>'
            texteCorr += `- En utilisant l'égalité des longueurs : $${noms[0] + noms[1]}=${noms[3] + noms[2]}$ et $${noms[2] + noms[1]}=${noms[3] + noms[0]}$.<br>`
            texteCorr += `- En traçant la parallèle à $(${noms[0] + noms[1]})$ passant par $${noms[3]}$ et la parallèle à $(${noms[3] + noms[0]})$ passant par $${noms[1]}$.<br>`
            texteCorr += '- En utilisant la propriété des diagonales qui se coupent en leur milieu.<br>'
            texteCorr += 'Nous avons choisi la première méthode qui nous semble la plus efficace ici.<br>'
          } else {
            texteCorr += '.<br>'
            texteCorr += `En voici une utilisant l'égalité des longueurs : $${noms[0] + noms[1]}=${noms[3] + noms[2]}$ et $${noms[2] + noms[1]}=${noms[3] + noms[0]}$.<br>`
          }
          texteCorr += `Le point $${noms[2]}$ se trouve dans la case ${cellule} de la cible.<br>`

          c1.styleExtremites = '-|'
          c4.styleExtremites = '|-'
          P = polygoneAvecNom(D, A, B)
          objetsEnonce.push(c1, c4, P[1], cible)
          objetsCorrection.push(p[0], p[1], cible, traceCompas(D, C, 30), traceCompas(B, C, 30), codageSegments('||', 'red', A, B, D, C), codageSegments('///', 'blue', A, D, B, C))
          animIEP.parallelogramme3sommetsConsecutifs(D, A, B, C.nom)
          break
        case 2: // trois sommets consécutifs
          texte = `Construire le parallélogramme $${nom}$`
          texte += ' et le coder afin de faire comprendre par quelle méthode ce parallélogramme a été construit.'
          texteCorr = 'Plusieurs constructions sont possibles :<br>'
          if (this.correctionDetaillee) {
            texteCorr += `- En utilisant l'égalité des longueurs : $${noms[0] + noms[1]}=${noms[3] + noms[2]}$ et $${noms[2] + noms[1]}=${noms[3] + noms[0]}$.<br>`
            texteCorr += `- En traçant la parallèle à $(${noms[0] + noms[1]})$ passant par $${noms[3]}$ et la parallèle à $(${noms[3] + noms[0]})$ passant par $${noms[1]}$.<br>`
            texteCorr += '- En utilisant la propriété des diagonales qui se coupent en leur milieu.<br>'
            texteCorr += 'Nous avons choisi la première méthode qui nous semble la plus efficace ici.<br>'
          } else {
            texteCorr += `En voici une utilisant l'égalité des longueurs : $${noms[0] + noms[1]}=${noms[3] + noms[2]}$ et $${noms[2] + noms[1]}=${noms[3] + noms[0]}$.<br>`
          }
          texteCorr += `Le point $${noms[2]}$ se trouve dans la case ${cellule} de la cible.<br>`
          P = polygoneAvecNom(D, A, B)
          animIEP.pointCreer(D, D.nom, 0)
          animIEP.pointCreer(A, A.nom, 0)
          animIEP.pointCreer(B, B.nom, 0)
          animIEP.regleSegment(D, A)
          animIEP.regleSegment(A, B)
          animIEP.regleMasquer(0)
          animIEP.crayonMasquer(0)
          animIEP.parallelogramme3sommetsConsecutifs(D, A, B, C.nom)
          objetsEnonce.push(tracePoint(A, B, D), P[1], cible)
          objetsCorrection.push(p[0], p[1], cible, traceCompas(D, C, 30), traceCompas(B, C, 30), codageSegments('||', 'red', A, B, D, C), codageSegments('///', 'blue', A, D, B, C))

          break
        case 3: // deux sommets consécutifs plus le centre
          texte = `Construire le parallélogramme $${nom}$ de centre $${noms[4]}$`
          texte += ' et le coder afin de faire comprendre par quelle méthode ce parallélogramme a été construit.'
          texteCorr = `O est le centre de symétrie du parallélogramme $${nom}$.<br>`
          if (this.correctionDetaillee) {
            texteCorr += `Le point $${noms[3]}$ est le symétrique du point $${noms[1]}$ par rapport à $${noms[4]}$.<br>`
            texteCorr += `Le point $${noms[2]}$ est le symétrique du point $${noms[0]}$ par rapport à $${noms[4]}$.<br>`
          }
          texteCorr += `Le point $${noms[2]}$ se trouve dans la case ${cellule} de la cible 1.<br>`
          texteCorr += `Le point $${noms[3]}$ se trouve dans la case ${cellule2} de la cible 2.<br>`
          P = polygoneAvecNom(O, A, B)
          animIEP.parallelogramme2sommetsConsecutifsCentre(A, B, O)
          objetsEnonce.push(tracePoint(A, B, O), P[1], cible, cible2)
          objetsCorrection.push(p[0], p[1], labelPoint(O), cible, cible2, d1, d2, d3, d4, codageSegments('||', 'red', A, O, O, C), codageSegments('|||', 'blue', B, O, O, D))

          break
        case 4: // Un angle formé par deux demi-droites et le centre
          texte = `Construire le parallélogramme $${nom}$ de centre ${noms[4]}`
          texte += ' et le coder afin de faire comprendre par quelle méthode ce parallélogramme a été construit.'
          texte += ` Le point $${noms[3]}$ est sur la demi-droite $[${noms[0]}x)$ et le point $${noms[1]}$ est sur la demi-droite $[${noms[0]}y)$.<br>`
          texteCorr = ''
          if (this.correctionDetaillee) {
            texteCorr += `Le point $${noms[2]}$ est le symétrique du point $${noms[0]}$ par rapport à $${noms[4]}$.<br>`
            texteCorr += `La symétrique de la droite $(${noms[0] + noms[1]})$ par rapport à $${noms[4]}$ est la droite passant par $${noms[2]}$ parallèle à $(${noms[0] + noms[1]})$.<br>`
            texteCorr += `La symétrique de la droite $(${noms[0] + noms[3]})$ par rapport à $${noms[4]}$ est la droite passant par $${noms[2]}$ parallèle à $(${noms[0] + noms[3]})$.<br>`
          }
          texteCorr += `Le point $${noms[2]}$ se trouve dans la case ${cellule} de la cible 1.<br>`
          texteCorr += `Le point $${noms[3]}$ se trouve dans la case ${cellule2} de la cible 2.<br>`
          texteCorr += `Le point $${noms[1]}$ se trouve dans la case ${cellule3} de la cible 3.<br>`
          animIEP.regleZoom(200)
          animIEP.equerreZoom(200)
          animIEP.parallelogrammeAngleCentre(D, A, B, O)
          objetsEnonce.push(dd1, dd2, tracePoint(O), labelPoint(O, A), texteParPoint('x', pointIntersectionCC(cercleCentrePoint(A, D), cercle(D, 0.5), 1)), texteParPoint('y', similitude(B, A, 4, 1.3)), cible, cible2, cible3)
          objetsCorrection.push(dd1, dd2, dd3, dd4, p[0], p[1], tracePoint(O), labelPoint(O), cible, cible2, cible3, d1, d3, codageSegments('||', 'red', A, O, O, C))

          break
      }
      let texteAMC = texte + '<br><br>'
      texteAMC += listeTypeQuestions[i] > 2 ? 'Les sommets manquants devraient se trouver respectivement dans les cibles ci-dessous.' : 'Le sommet manquant devrait se trouver dans la cible ci-dessous.'
      texteAMC += '<br>Une fois la construction terminée et afin de vérifier votre soin, noircir, ci-contre,'
      texteAMC += listeTypeQuestions[i] > 2 ? ' pour chacune des cibles,' : ''
      texteAMC += ' la lettre et le chiffre correspondants à la case dans laquelle se trouve le sommet construit.'
      texte += '<br>' + mathalea2d(Object.assign({ pixelsParCm: 20, scale: 0.5 }, fixeBordures(objetsEnonce)), objetsEnonce)
      texteCorr += mathalea2d(Object.assign({ pixelsParCm: 20, scale: 0.5 }, fixeBordures(objetsCorrection)), objetsCorrection)
      texteCorr += animIEP.htmlBouton(numeroExercice, i)

      if (context.isAmc) {
      // Construction des QCM valables en AMC
        const propositionsQcm1 = []
        for (let ee = 0; ee < 5; ee++) {
          propositionsQcm1.push({
            texte: reponseLettres[ee],
            statut: cellule[0] === reponseLettres[ee]
          })
        }

        const propositionsQcm2 = []
        for (let ee = 0; ee < 5; ee++) {
          propositionsQcm2.push({
            texte: ee + 1,
            statut: cellule[1] === reponseChiffres[ee]
          })
        }

        this.autoCorrection[i] = {}
        this.autoCorrection[i].options = {
          ordered: true, barreseparation: true, multicolsAll: true
        }
        this.autoCorrection[i].enonce = ''// texte
        this.autoCorrection[i].propositions =
         [
           {
             type: 'AMCOpen',
             propositions: [{
               texte: texteCorr,
               enonce: texteAMC + '<br>' + mathalea2d({ xmin: xMin, ymin: yMin, xmax: xMax, ymax: yMax, pixelsParCm: 20, scale: 0.5 }, objetsEnonce),
               statut: 0,
               sanscadre: true
             }]
           },
           {
             type: 'qcmMono',
             propositions: propositionsQcm1,
             enonce: (listeTypeQuestions[i] > 2 ? numAlpha(0) + 'Pour la cible 1 : <br>' : '') + 'Lettre de la case du sommet construit, dans la cible' + (listeTypeQuestions[i] > 2 ? ' 1' : '')
           },
           {
             type: 'qcmMono',
             propositions: propositionsQcm2,
             enonce: 'Chiffre de la case du sommet construit, dans la cible' + (listeTypeQuestions[i] > 2 ? ' 1' : '')
           }]

        if (listeTypeQuestions[i] > 2) {
          const propositionsQcm3 = []
          for (let ee = 0; ee < 5; ee++) {
            propositionsQcm3.push({
              texte: reponseLettres[ee],
              statut: cellule2[0] === reponseLettres[ee]
            })
          }

          const propositionsQcm4 = []
          for (let ee = 0; ee < 5; ee++) {
            propositionsQcm4.push({
              texte: ee + 1,
              statut: cellule2[1] === reponseChiffres[ee]
            })
          }

          this.autoCorrection[i].propositions.push(
            {
              type: 'qcmMono',
              propositions: propositionsQcm3,
              enonce: '\\vspace{1cm}' + numAlpha(1) + 'Pour la cible 2 : <br>Lettre de la case du sommet construit, dans la cible 2'
            },
            {
              type: 'qcmMono',
              propositions: propositionsQcm4,
              enonce: 'Chiffre de la case du sommet construit, dans la cible 2'
            }
          )
        }
        if (listeTypeQuestions[i] === 4) {
          const propositionsQcm5 = []
          for (let ee = 0; ee < 5; ee++) {
            propositionsQcm5.push({
              texte: reponseLettres[ee],
              statut: cellule3[0] === reponseLettres[ee]
            })
          }

          const propositionsQcm6 = []
          for (let ee = 0; ee < 5; ee++) {
            propositionsQcm6.push({
              texte: ee + 1,
              statut: cellule3[1] === reponseChiffres[ee]
            })
          }

          this.autoCorrection[i].propositions.push(
            {
              type: 'qcmMono',
              propositions: propositionsQcm5,
              enonce: '\\vspace{1cm}' + numAlpha(2) + 'Pour la cible 3 : <br>Lettre de la case du sommet construit, dans la cible 3'
            },
            {
              type: 'qcmMono',
              propositions: propositionsQcm6,
              enonce: 'Chiffre de la case du sommet construit, dans la cible 3'
            }
          )
        }
      }

      // Si la question n'a jamais été posée, on l'enregistre
      if (this.questionJamaisPosee(i, texte)) { // <- laisser le i et ajouter toutes les variables qui rendent les exercices différents (par exemple a, b, c et d)
        // Supprime b, c et d dans la ligne ci-dessus et remplace les par NombreAAjouter !
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireTexte = ['Type de questions', 'Nombres séparés par des tirets\n1 : Deux côtés consécutifs\n2 : Trois sommets consécutifs\n3 : Deux sommets consécutifs et le centre\n4 : Un angle et le centre\n5 : Mélange']
  this.besoinFormulaire2Numerique = ['Taille des cases de la grille', 3, '1 : taille 0,4cm\n2 : taille 0,6 cm\n3 : taille 0,8cm']
}
