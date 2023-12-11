import { combinaisonListes, enleveElement } from '../../lib/outils/arrayOutils.js'
import { miseEnEvidence, texteEnCouleurEtGras } from '../../lib/outils/embellissements'
import { texNombre } from '../../lib/outils/texNombre.js'
import { Triangle } from '../../modules/Triangle.js'
import Exercice from '../Exercice.js'
import { listeQuestionsToContenu, randint, calculANePlusJamaisUtiliser } from '../../modules/outils.js'
import { propositionsQcm } from '../../lib/interactif/qcm.js'
import { context } from '../../modules/context.js'

export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = true
export const amcType = 'AMCHybride'
export const titre = 'Constructibilité des triangles via les longueurs ou les angles'
export const dateDeModifImportante = '10/12/2023'

/**
 * Constructibilité des triangles
 * 5G2 exercice parent il faudra supprimmer la version beta5G2 de la liste des choix du fichier mathalea_exercices.js
 * 5G21-1
 * 5G31-1
 * Dans ces exercices je me servais de this.beta pour faire passer l'exo de beta.html à context.html
 * this.beta pouvait prendre la valeur 'beta' ou '', tous les autres this.beta sont devenus des this.debug
 * @author Sébastien Lozano
 */
export default function ConstructibiliteDesTriangles () {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.sup = 1
  this.sup2 = false
  this.nbQuestions = 3
  this.beta = ''

  this.nbCols = 1
  this.nbColsCorr = 1

  this.listePackages = 'bclogo'

  let typesDeQuestionsDisponibles

  this.nouvelleVersion = function () {
    let consigneAMC
    if (this.exo === this.beta + '5G21-1') { // via longueurs
      consigneAMC = !this.interactif || context.isAmc
        ? 'Justifier si les longueurs données permettent de construire le triangle'
        : 'Indiquer si, avec les informations fournies, le triangle est constructible'
        // this.consigne += '<br>Dire si tous les élèves qui doivent construire ce triangle auront la même figure.'
    } else { // via angles
      consigneAMC = !this.interactif || context.isAmc
        ? 'Justifier si les angles donnés permettent de construire le triangle'
        : 'Indiquer si, avec les informations fournies, le triangle est constructible'
        // this.consigne += '<br>Dire si tous les élèves qui doivent construire ce triangle auront la même figure.'
    }
    this.consigne = consigneAMC + '.'
    if (this.exo === this.beta + '5G21-1') { // via longueurs
      if (this.sup === 1) {
        typesDeQuestionsDisponibles = [1, 2, 3]
      } else if (this.sup === 3) {
        const a = randint(1, 3)
        if (this.nbQuestions === 1) typesDeQuestionsDisponibles = [4]
        else if (this.nbQuestions === 2) typesDeQuestionsDisponibles = [4, a]
        else if (this.nbQuestions === 3) typesDeQuestionsDisponibles = [4, a, a % 3 + 1]
        else typesDeQuestionsDisponibles = [4, 1, 2, 3]
      } else {
        typesDeQuestionsDisponibles = [4]
      }
    } else if (this.exo === this.beta + '5G31-1') { // via angles
      if (this.sup === 1) {
        typesDeQuestionsDisponibles = [5, 6, 7]
      } else if (this.sup === 3) {
        const a = randint(5, 7)
        if (this.nbQuestions === 1) typesDeQuestionsDisponibles = [8]
        else if (this.nbQuestions === 2) typesDeQuestionsDisponibles = [8, a]
        else if (this.nbQuestions === 3) typesDeQuestionsDisponibles = [8, a, (a - 4) % 3 + 5]
        else typesDeQuestionsDisponibles = [8, 5, 6, 7]
      } else {
        typesDeQuestionsDisponibles = [8]
      }
    } else {
      typesDeQuestionsDisponibles = [1, 2, 3, 4, 5, 6, 7, 8]
    }

    if (!this.sup2) {
      enleveElement(typesDeQuestionsDisponibles, 2)
      enleveElement(typesDeQuestionsDisponibles, 6)
    }
    const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions) // Tous les types de questions sont posées mais l'ordre diffère à chaque "cycle"

    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    for (let i = 0, texte, texteCorr, l1, l2, l3, a1, a2, a3, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      // on fixe longueur min et max en cm
      const lMin = 2
      const lMax = 20
      // on fixe angle min et max en degré
      const aMin = 0
      const aMax = 180

      // on crée un objet triangle
      const triangle = new Triangle()
      // on crée un tableau pour le triangle courant
      const currentTriangle = []

      switch (listeTypeDeQuestions[i]) {
        case 1: // 3 longueurs constructible
          while (!triangle.isTrueTriangleLongueurs()) {
            l1 = randint(lMin, lMax)
            l2 = randint(lMin, lMax)
            l3 = randint(lMin, lMax)
            triangle.l1 = l1
            triangle.l2 = l2
            triangle.l3 = l3
          }
          texte = `${triangle.getNom()} tel que ${triangle.getLongueurs()[0]} $= ${triangle.l1}$ cm ; `
          texte += `${triangle.getLongueurs()[1]} $= ${triangle.l2}$ cm et ${triangle.getLongueurs()[2]} $= ${triangle.l3}$ cm.`
          // on crée l'objet longueurs + valeurs des côtés du triangle
          for (let i = 0; i < 3; i++) {
            currentTriangle.push({ longueur: triangle.getLongueurs()[i], cote: triangle.getCotes()[i], valeur: triangle.getLongueursValeurs()[i] })
          }
          // on trie les couples longueurs/valeurs du triangle selon les valeurs croissantes.
          currentTriangle.sort(function (a, b) {
            return a.valeur - b.valeur
          })
          texteCorr = `Supposons que l'on puisse construire un triangle ${triangle.getNom()} avec ces mesures.`
          texteCorr += `<br>Dans le triangle ${triangle.getNom()}, ${currentTriangle[2].cote}, qui mesure $${currentTriangle[2].valeur}$ cm, est le plus grand côté.`
          texteCorr += `<br> De plus ${currentTriangle[0].longueur} + ${currentTriangle[1].longueur} = $${currentTriangle[0].valeur}$ cm + $${currentTriangle[1].valeur}$ cm = $${calculANePlusJamaisUtiliser(currentTriangle[0].valeur + currentTriangle[1].valeur)}$ cm.`
          texteCorr += `<br> On constate que ${currentTriangle[0].longueur} + ${currentTriangle[1].longueur} > ${currentTriangle[2].longueur}.`
          texteCorr += `<br> ${texteEnCouleurEtGras('On peut donc construire le triangle ')}` + `$${miseEnEvidence(triangle.getNom().substring(1, triangle.getNom().length - 1) + '.')}$`
          // texteCorr += `<br><br>  Si on considère que le triangle nommé dans le sens des aiguilles d'une montre et celui nommé dans le sens inverse sont différents, ${texteEnCouleurEtGras('plusieurs tels triangles existent')}.`
          // texteCorr += '<br> Ils sont obtenus les uns à partir des autres par symétrie axiale par rapport à un des côtés.'
          break
        case 2: // 3 longueurs plat
          while (!triangle.isPlatTriangleLongueurs()) {
            l1 = randint(lMin, lMax)
            l2 = randint(lMin, lMax)
            l3 = calculANePlusJamaisUtiliser(l1 + l2)
            triangle.l1 = l1
            triangle.l2 = l2
            triangle.l3 = l3
          }
          texte = `${triangle.getNom()} tel que ${triangle.getLongueurs()[0]} $ = ${triangle.l1}$ cm ; `
          texte += `${triangle.getLongueurs()[1]} $= ${triangle.l2}$ cm et ${triangle.getLongueurs()[2]} $= ${triangle.l3}$ cm.`
          // on crée l'objet longueurs + valeurs des côtés du triangle
          for (let i = 0; i < 3; i++) {
            currentTriangle.push({ longueur: triangle.getLongueurs()[i], cote: triangle.getCotes()[i], valeur: triangle.getLongueursValeurs()[i] })
          }
          // on trie les couples longueurs/valeurs du triangle selon les valeurs croissantes.
          currentTriangle.sort(function (a, b) {
            return a.valeur - b.valeur
          })
          texteCorr = `Supposons que l'on puisse construire un triangle ${triangle.getNom()} avec ces mesures.`
          texteCorr += `<br>Dans le triangle ${triangle.getNom()}, ${currentTriangle[2].cote}, qui mesure $${currentTriangle[2].valeur}$ cm, est le plus grand côté.`
          texteCorr += `<br> De plus ${currentTriangle[0].longueur} + ${currentTriangle[1].longueur} = $${currentTriangle[0].valeur}$ cm + $${currentTriangle[1].valeur}$ cm = $${currentTriangle[2].valeur}$ cm aussi.`
          texteCorr += `<br> ${texteEnCouleurEtGras('On peut donc construire le triangle ')}` + `$${miseEnEvidence(triangle.getNom().substring(1, triangle.getNom().length - 1))}$` + `${texteEnCouleurEtGras(', c\'est un triangle plat.')}`

          texteCorr += `<br><br>${texteEnCouleurEtGras('Un seul triangle de ce type existe')}, il s'agit du segment ${currentTriangle[2].cote} sur lequel on place le point `
          if ((currentTriangle[0].longueur.split('')[2] === currentTriangle[2].cote.split('')[1]) || (currentTriangle[0].longueur.split('')[2] === currentTriangle[2].cote.split('')[2])) {
            texteCorr += `${currentTriangle[0].longueur.split('')[1]}`
          } else {
            texteCorr += `${currentTriangle[0].longueur.split('')[2]}`
          }
          texteCorr += '.'
          // `${currentTriangle[0].longueur.split('')[2]}.`;
          break
        case 3: // 3 longueurs non constructible
          // on initialise les longueurs sinon la méthode isTrueTriangleLongueurs() renvoie false!
          l1 = randint(lMin, lMax)
          l2 = randint(lMin, lMax)
          l3 = randint(lMin, lMax)
          triangle.l1 = l1
          triangle.l2 = l2
          triangle.l3 = l3

          while (triangle.isTrueTriangleLongueurs() || triangle.isPlatTriangleLongueurs()) {
            l1 = randint(lMin, lMax)
            l2 = randint(lMin, lMax)
            l3 = randint(lMin, lMax)
            triangle.l1 = l1
            triangle.l2 = l2
            triangle.l3 = l3
          }
          texte = `${triangle.getNom()} tel que ${triangle.getLongueurs()[0]} $= ${triangle.l1}$ cm ; `
          texte += `${triangle.getLongueurs()[1]} $= ${triangle.l2}$ cm et ${triangle.getLongueurs()[2]} $= ${triangle.l3}$ cm.`
          // on crée l'objet longueurs + valeurs des côtés du triangle
          for (let i = 0; i < 3; i++) {
            currentTriangle.push({ longueur: triangle.getLongueurs()[i], cote: triangle.getCotes()[i], valeur: triangle.getLongueursValeurs()[i] })
          }
          // on trie les couples longueurs/valeurs du triangle selon les valeurs croissantes.
          currentTriangle.sort(function (a, b) {
            return a.valeur - b.valeur
          })
          texteCorr = `Supposons que l'on puisse construire un triangle ${triangle.getNom()} avec ces mesures.`
          texteCorr += `<br>Dans le triangle ${triangle.getNom()}, ${currentTriangle[2].cote}, qui mesure $${currentTriangle[2].valeur}$ cm, est le plus grand côté.`
          texteCorr += `<br> De plus ${currentTriangle[0].longueur} + ${currentTriangle[1].longueur} = $${currentTriangle[0].valeur}$ cm + $${currentTriangle[1].valeur}$ cm = $${calculANePlusJamaisUtiliser(currentTriangle[0].valeur + currentTriangle[1].valeur)}$ cm.`
          texteCorr += `<br> On constate que ${currentTriangle[0].longueur} + ${currentTriangle[1].longueur} < ${currentTriangle[2].longueur}, les longueurs données ne permettent donc pas de satisfaire à l'inégalité triangulaire.`
          texteCorr += `<br> ${texteEnCouleurEtGras('On ne peut donc pas construire le triangle ')}` + `$${miseEnEvidence(triangle.getNom().substring(1, triangle.getNom().length - 1) + '.')}$`

          // texteCorr += `<br><br>  ${texteEnCouleurEtGras('Aucun triangle de ce type n\'existe')}.`
          break
        case 4: // 2 longueurs et le périmètre
          // on utilise la méthode isTrueTriangleLongueurs(), le triangle ne sera pas plat.
          while (!triangle.isTrueTriangleLongueurs()) {
            l1 = randint(lMin, lMax)
            l2 = randint(lMin, lMax)
            l3 = randint(lMin, lMax)
            triangle.l1 = l1
            triangle.l2 = l2
            triangle.l3 = l3
          }
          texte = `${triangle.getNom()} tel que ${triangle.getLongueurs()[0]} $= ${triangle.l1}$ cm ; `
          texte += `${triangle.getLongueurs()[1]} $= ${triangle.l2}$ cm et dont le périmètre vaut $${triangle.getPerimetre()}$ cm.`
          // on crée l'objet longueurs + valeurs des côtés du triangle
          for (let i = 0; i < 3; i++) {
            currentTriangle.push({ longueur: triangle.getLongueurs()[i], cote: triangle.getCotes()[i], valeur: triangle.getLongueursValeurs()[i] })
          }
          // on trie les couples longueurs/valeurs du triangle selon les valeurs croissantes.
          currentTriangle.sort(function (a, b) {
            return a.valeur - b.valeur
          })
          texteCorr = `Supposons que l'on puisse construire un triangle ${triangle.getNom()} avec ces mesures.`
          texteCorr += `<br>Puisque le périmètre vaut $${triangle.getPerimetre()}$ cm alors la troisième longueur vaut ${triangle.getLongueurs()[2]} = $${triangle.getPerimetre()}$ cm - $${triangle.l1}$ cm - $${triangle.l2}$ cm = $${triangle.l3}$ cm.`
          texteCorr += `<br> Donc dans le triangle ${triangle.getNom()}, ${currentTriangle[2].cote}, qui mesure $${currentTriangle[2].valeur}$ cm, est le plus grand côté.`
          texteCorr += `<br> De plus ${currentTriangle[0].longueur} + ${currentTriangle[1].longueur} = $${currentTriangle[0].valeur}$ cm + $${currentTriangle[1].valeur}$ cm = $${calculANePlusJamaisUtiliser(currentTriangle[0].valeur + currentTriangle[1].valeur)}$ cm.`
          texteCorr += `<br> On constate que ${currentTriangle[0].longueur} + ${currentTriangle[1].longueur} > ${currentTriangle[2].longueur}`
          texteCorr += `<br> ${texteEnCouleurEtGras('On peut donc construire le triangle ')}` + `$${miseEnEvidence(triangle.getNom().substring(1, triangle.getNom().length - 1))}$.`
          // texteCorr += `<br><br>  Si on considère que le triangle nommé dans le sens des aiguilles d'une montre et celui nommé dans le sens inverse sont différents, ${texteEnCouleurEtGras('deux tels triangles existent')}.`;
          // texteCorr += `<br> Les deux étant obtenus l'un à partir de l'autre par symétrie axiale.`;
          // texteCorr += `<br><br>  Si on considère que le triangle nommé dans le sens des aiguilles d'une montre et celui nommé dans le sens inverse sont différents, ${texteEnCouleurEtGras('plusieurs tels triangles existent')}.`
          // texteCorr += '<br> Ils sont obtenus les uns à partir des autres par symétrie axiale par rapport à un des côtés.'
          break
        case 5: // 3 angles constructible
          while (!triangle.isTrueTriangleAngles()) {
            a1 = randint(aMin, aMax, [0, 180])
            a2 = randint(aMin, aMax, [0, 180])
            a3 = calculANePlusJamaisUtiliser(180 - a1 - a2)
            triangle.a1 = a1
            triangle.a2 = a2
            triangle.a3 = a3
          }
          texte = ''
          texteCorr = ''
          texte = `${triangle.getNom()} tel que ${triangle.getAngles()[0]} $= ${triangle.a1}\\degree$ ; `
          texte += `${triangle.getAngles()[1]} $= ${triangle.a2}\\degree$ et ${triangle.getAngles()[2]} $= ${triangle.a3}\\degree$.`
          // on crée l'objet longueurs + valeurs des côtés du triangle
          for (let i = 0; i < 3; i++) {
            currentTriangle.push({ angle: triangle.getAngles()[i], valeur: triangle.getAnglesValeurs()[i] })
          }
          // on trie les couples longueurs/valeurs du triangle selon les valeurs croissantes.
          currentTriangle.sort(function (a, b) {
            return a.valeur - b.valeur
          })
          texteCorr = `Supposons que l'on puisse construire un triangle ${triangle.getNom()} avec ces mesures.`
          texteCorr += `<br>Dans le triangle ${triangle.getNom()}, ${currentTriangle[0].angle} + ${currentTriangle[1].angle} + ${currentTriangle[2].angle} = $${currentTriangle[0].valeur}\\degree + ${currentTriangle[1].valeur}\\degree + ${currentTriangle[2].valeur}\\degree = ${calculANePlusJamaisUtiliser(currentTriangle[0].valeur + currentTriangle[1].valeur + currentTriangle[2].valeur)}\\degree$.`
          texteCorr += '<br> On constate que la somme des trois angles du triangle vaut bien $180\\degree$.'
          texteCorr += `<br> ${texteEnCouleurEtGras('On peut donc construire le triangle ')}` + `$${miseEnEvidence(triangle.getNom().substring(1, triangle.getNom().length - 1))}$.`
          // texteCorr += `<br><br>  ${texteEnCouleurEtGras('Il existe une infinité de triangles avec ces mesures.')}`
          // texteCorr += '<br> On les obtient les uns à partir des autres par un agrandissement ou une réduction.'
          break
        case 6: // 3 angles plat
          while (!triangle.isPlatTriangleAngles()) {
            a1 = randint(aMin, aMax)
            a2 = randint(aMin, aMax)
            a3 = calculANePlusJamaisUtiliser(180 - a1 - a2)
            triangle.a1 = a1
            triangle.a2 = a2
            triangle.a3 = a3
          }
          texte = ''
          texteCorr = ''
          texte = `${triangle.getNom()} tel que ${triangle.getAngles()[0]} $= ${triangle.a1}\\degree$ ; `
          texte += `${triangle.getAngles()[1]} $= ${triangle.a2}\\degree$ et ${triangle.getAngles()[2]} $= ${triangle.a3}\\degree$.`
          // on crée l'objet longueurs + valeurs des côtés du triangle
          for (let i = 0; i < 3; i++) {
            currentTriangle.push({ angle: triangle.getAngles()[i], valeur: triangle.getAnglesValeurs()[i] })
          }
          // on trie les couples longueurs/valeurs du triangle selon les valeurs croissantes.
          currentTriangle.sort(function (a, b) {
            return a.valeur - b.valeur
          })
          texteCorr = `Supposons que l'on puisse construire un triangle ${triangle.getNom()} avec ces mesures.`
          texteCorr += `<br>Dans le triangle ${triangle.getNom()}, ${currentTriangle[0].angle} + ${currentTriangle[1].angle} + ${currentTriangle[2].angle} = $${currentTriangle[0].valeur}\\degree + ${currentTriangle[1].valeur}\\degree + ${currentTriangle[2].valeur}\\degree = ${calculANePlusJamaisUtiliser(currentTriangle[0].valeur + currentTriangle[1].valeur + currentTriangle[2].valeur)}\\degree$.`
          texteCorr += '<br> On constate que la somme des trois angles du triangle vaut bien $180\\degree$.'
          texteCorr += `<br> ${texteEnCouleurEtGras('On peut donc construire le triangle ')}` + `$${miseEnEvidence(triangle.getNom().substring(1, triangle.getNom().length - 1))}$.`
          texteCorr += '<br> Deux des trois angles du triangle valent $0\\degree$, ' + `$${miseEnEvidence(triangle.getNom().substring(1, triangle.getNom().length - 1))}$` + texteEnCouleurEtGras(' est donc un triangle plat.')
          // texteCorr += `<br><br>  ${texteEnCouleurEtGras('Il existe une infinité de triangles avec ces mesures.')}`
          // texteCorr += '<br> On les obtient en traçant des segments et en plaçant le troisième sommet sur ce segment, les longueurs n\'ayant aucune importance.'
          // texteCorr += `<br> Dans le cas présent, il s'agit d'un segment $[${currentTriangle[2].angle.split('')[12]}${currentTriangle[2].angle.split('')[14]}]$ sur lequel on place un point ${currentTriangle[2].angle.split('')[13]}.`
          break
        case 7: // 3 angles non constructible
          // on initialise les angles sinon la méthode isTrueTriangleAngles() renvoie false!
          a1 = randint(aMin, aMax)
          a2 = randint(aMin, aMax)
          a3 = randint(aMin, aMax)
          triangle.a1 = a1
          triangle.a2 = a2
          triangle.a3 = a3
          while (triangle.isTrueTriangleAngles()) {
            a1 = randint(aMin, aMax)
            a2 = randint(aMin, aMax)
            a3 = randint(aMin, aMax)
            triangle.a1 = a1
            triangle.a2 = a2
            triangle.a3 = a3
          }
          texte = `${triangle.getNom()} tel que ${triangle.getAngles()[0]} $= ${triangle.a1}\\degree$ ; `
          texte += `${triangle.getAngles()[1]} $= ${triangle.a2}\\degree$ et ${triangle.getAngles()[2]} $= ${triangle.a3}\\degree$.`
          // on crée l'objet longueurs + valeurs des côtés du triangle
          for (let i = 0; i < 3; i++) {
            currentTriangle.push({ angle: triangle.getAngles()[i], valeur: triangle.getAnglesValeurs()[i] })
          }
          // on trie les couples longueurs/valeurs du triangle selon les valeurs croissantes.
          currentTriangle.sort(function (a, b) {
            return a.valeur - b.valeur
          })
          texteCorr = `Supposons que l'on puisse construire un triangle ${triangle.getNom()} avec ces mesures.`
          texteCorr += `<br>Dans le triangle ${triangle.getNom()}, ${currentTriangle[0].angle} + ${currentTriangle[1].angle} + ${currentTriangle[2].angle} = $${currentTriangle[0].valeur}\\degree + ${currentTriangle[1].valeur}\\degree + ${currentTriangle[2].valeur}\\degree = ${calculANePlusJamaisUtiliser(currentTriangle[0].valeur + currentTriangle[1].valeur + currentTriangle[2].valeur)}\\degree$.`
          texteCorr += '<br> Si le triangle était constructible, la somme des trois angles vaudrait $180\\degree$,'
          texteCorr += ' or ce n\'est pas le cas.'
          texteCorr += `<br> ${texteEnCouleurEtGras('On ne peut donc pas construire le triangle ')}` + `$${miseEnEvidence(triangle.getNom().substring(1, triangle.getNom().length - 1) + '.')}$`
          // texteCorr += `<br><br>  ${texteEnCouleurEtGras('Aucun triangle de ce type n\'existe')}.`
          break
        case 8: { // 2 angles et le 3e fonction du 1er ou du 2eme
          const angleRg = randint(0, 1)
          const operationsPossibles = ['triple', 'quadruple', 'quart']
          let operation = ''
          texte = ''
          texteCorr = ''
          texteCorr = `Supposons que l'on puisse construire un triangle ${triangle.getNom()} avec ces mesures.`
          switch (angleRg) {
            case 0:
              a1 = randint(aMin, aMax)
              triangle.a1 = a1
              operation = operationsPossibles[randint(0, 2)]
              texte += `${triangle.getNom()} tel que ${triangle.getAngles()[0]} $= ${texNombre(triangle.a1)}\\degree$ ; `
              switch (operation) {
                case 'triple':
                  a2 = calculANePlusJamaisUtiliser((180 - a1) / 4)
                  a3 = calculANePlusJamaisUtiliser(3 * a2)
                  break
                case 'quadruple':
                  a2 = calculANePlusJamaisUtiliser((180 - a1) / 5)
                  a3 = calculANePlusJamaisUtiliser(4 * a2)
                  break
                case 'quart':
                  a2 = calculANePlusJamaisUtiliser(4 * (180 - a1) / 5)
                  a3 = calculANePlusJamaisUtiliser(a2 / 4)
                  break
              }
              triangle.a2 = a2
              triangle.a3 = a3
              texte += `${triangle.getAngles()[1]} $= ${texNombre(triangle.a2)}\\degree$ et ${triangle.getAngles()[2]} est le ${operation} de ${triangle.getAngles()[1]}.`
              // on crée l'objet longueurs + valeurs des côtés du triangle
              for (let i = 0; i < 3; i++) {
                currentTriangle.push({ angle: triangle.getAngles()[i], valeur: triangle.getAnglesValeurs()[i] })
              }
              texteCorr += `<br>Dans le triangle ${triangle.getNom()}, ${currentTriangle[2].angle} est le ${operation} de ${currentTriangle[1].angle} = $${texNombre(currentTriangle[1].valeur)}\\degree$  d'où ${currentTriangle[2].angle} = $${texNombre(currentTriangle[2].valeur)}\\degree$.`
              break
            case 1:
              a2 = randint(aMin, aMax)
              triangle.a2 = a2
              operation = operationsPossibles[randint(0, 2)]
              texte += `${triangle.getNom()} tel que ${triangle.getAngles()[1]} $= ${texNombre(triangle.a2)}\\degree$ ; `
              switch (operation) {
                case 'triple':
                  a1 = calculANePlusJamaisUtiliser((180 - a2) / 4)
                  a3 = calculANePlusJamaisUtiliser(3 * a1)
                  break
                case 'quadruple':
                  a1 = calculANePlusJamaisUtiliser((180 - a2) / 5)
                  a3 = calculANePlusJamaisUtiliser(4 * a1)
                  break
                case 'quart':
                  a1 = calculANePlusJamaisUtiliser(4 * (180 - a2) / 5)
                  a3 = calculANePlusJamaisUtiliser(a1 / 4)
                  break
              }
              triangle.a1 = a1
              triangle.a3 = a3
              texte += `${triangle.getAngles()[0]} $= ${texNombre(triangle.a1)}\\degree$ et ${triangle.getAngles()[2]} est le ${operation} de ${triangle.getAngles()[0]}.`
              // on crée l'objet longueurs + valeurs des côtés du triangle
              for (let i = 0; i < 3; i++) {
                currentTriangle.push({ angle: triangle.getAngles()[i], valeur: triangle.getAnglesValeurs()[i] })
              }
              texteCorr += `<br>Dans le triangle ${triangle.getNom()}, ${currentTriangle[2].angle} est le ${operation} de ${currentTriangle[0].angle} = $${texNombre(currentTriangle[0].valeur)}\\degree$  d'où ${currentTriangle[2].angle} = $${texNombre(currentTriangle[2].valeur)}\\degree$.`
              break
          }
          texteCorr += `<br>Donc ${currentTriangle[0].angle} + ${currentTriangle[1].angle} + ${currentTriangle[2].angle} = $${texNombre(currentTriangle[0].valeur)}\\degree + ${texNombre(currentTriangle[1].valeur)}\\degree + ${texNombre(currentTriangle[2].valeur)}\\degree = ${texNombre(currentTriangle[0].valeur + currentTriangle[1].valeur + currentTriangle[2].valeur)}\\degree$.`
          texteCorr += '<br> On constate que la somme des trois angles du triangle vaut bien $180\\degree$.'
          texteCorr += `<br> ${texteEnCouleurEtGras('On peut donc construire le triangle ')}` + `$${miseEnEvidence(triangle.getNom().substring(1, triangle.getNom().length - 1))}$.`
          // texteCorr += `<br><br>  ${texteEnCouleurEtGras('Il existe une infinité de triangles avec ces mesures.')}`
          // texteCorr += '<br> On les obtient les uns à partir des autres par un agrandissement ou une réduction.'
          break
        }
      }
      if (this.listeQuestions.indexOf(texte) === -1) { // Si la question n'a jamais été posée, on en créé une autre
        const propositionsDuQcm = [
          {
            texte: `Le triangle ${triangle.getNom()} est constructible`,
            statut: !(listeTypeDeQuestions[i] === 2 || listeTypeDeQuestions[i] === 7),
            feedback: (this.exo === this.beta + '5G21-1') ? 'Effectue la somme des longueurs les plus petites et compare-la à la plus grande longueur.' : 'Effectue la somme des angles du triangle.'
          },
          {
            texte: `Le triangle ${triangle.getNom()} n'est pas constructible`,
            statut: (listeTypeDeQuestions[i] === 2 || listeTypeDeQuestions[i] === 7),
            feedback: (this.exo === this.beta + '5G21-1') ? 'Effectue la somme des longueurs les plus petites et compare-la à la plus grande longueur.' : 'Effectue la somme des angles du triangle.'
          },
          {
            texte: `On ne peut pas savoir si le triangle ${triangle.getNom()} est constructible ou pas`,
            statut: false,
            feedback: (this.exo === this.beta + '5G21-1') ? 'Effectue la somme des longueurs les plus petites et compare-la à la plus grande longueur.' : 'Effectue la somme des angles du triangle.'
          }
        ]

        if (this.interactif) {
          this.autoCorrection[i] = {
            enonce: texte,
            propositions: propositionsDuQcm,
            options: {
              ordered: false, // (si les réponses doivent rester dans l'ordre ci-dessus, false s'il faut les mélanger),
              lastChoice: 2 // (en cas de mélange, l'index à partir duquel les propositions restent à leur place, souvent le dernier choix par défaut)
            }
          }
        }
        if (context.isAmc) {
          this.autoCorrection[i] = {
            enonce: consigneAMC + ' :<br>' + texte,
            options: { numerotationEnonce: true }, // facultatif.
            propositions: [
              {
                type: 'AMCOpen',
                propositions: [
                  {
                    texte: '',
                    numQuestionVisible: false,
                    statut: 2, // (ici c'est le nombre de lignes du cadre pour la réponse de l'élève sur AMC)
                    feedback: ''
                    //   enonce: ' Justifier la réponse.' // EE : ce champ est facultatif et fonctionnel qu'en mode hybride (en mode normal, il n'y a pas d'intérêt)
                  }
                ]
              },
              {
                type: 'qcmMono',
                enonce: 'Suite à votre justification, noircir la case adéquate parmi les suivantes :',
                propositions: propositionsDuQcm,
                options: {
                  ordered: false, // (si les réponses doivent rester dans l'ordre ci-dessus, false s'il faut les mélanger),
                  lastChoice: 2 // (en cas de mélange, l'index à partir duquel les propositions restent à leur place, souvent le dernier choix par défaut)
                }
              }
            ]
          }
        }
        if (this.interactif) {
          texte += propositionsQcm(this, i).texte
        }
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)

        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  if (this.exo === this.beta + '5G21-1') {
    this.besoinFormulaireNumerique = ['Niveau de difficulté', 2, '1 : 3 longueurs\n2 : 2 longueurs et le périmètre\n3 : Mélange']
  } else {
    this.besoinFormulaireNumerique = ['Niveau de difficulté', 2, '1 : 3 angles\n2 : 2 angles et le 3ème en fonction du 1er ou du 2ème\n3 : Mélange']
  }
  this.besoinFormulaire2CaseACocher = ['Accepter triangle plat']
}
