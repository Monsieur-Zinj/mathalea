import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { lampeMessage } from '../../lib/format/message.js'
import { texNombre } from '../../lib/outils/texNombre'
import { Triangle } from '../../modules/Triangle.js'
import Exercice from '../deprecatedExercice.js'
import { context } from '../../modules/context.js'
import { listeQuestionsToContenu, randint, calculANePlusJamaisUtiliser, texEnumerateSansNumero } from '../../modules/outils.js'
import { texteEnCouleurEtGras } from '../../lib/outils/embellissements'
export const dateDeModifImportante = '25/07/2023'
export const titre = 'Utiliser le vocabulaire des triangles'

/**
 * Vocabulaire des triangles
 * @author Sébastien Lozano
 */
export const uuid = 'c3781'
export const ref = '5G20-1'
export const refs = {
  'fr-fr': ['5G20-1'],
  'fr-ch': ['9ES2-7']
}
export default function VocabulaireDesTriangles () {
  Exercice.call(this)
  this.consigne = 'Donner la nature des triangles en justifiant.'
  this.sup = 1
  this.sup2 = false
  this.nbCols = 1
  this.nbColsCorr = 1
  if (this.classe === 6) {
    if (this.sup === 1) {
      this.nbQuestions = 4
    } else {
      this.nbQuestions = 5
    }
  } else if (this.classe === 5) {
    this.nbQuestions = 5
  }
  this.classe = 5

  let typeDeQuestionsDisponibles

  this.nouvelleVersion = function () {
    let texteIntro = ''
    // eslint-disable-next-line no-undef
    if (context.isHtml) {
      if (this.classe === 6) {
        texteIntro += '- Un <b>triangle quelconque</b> est un triangle qui ne présente aucune relation particulière entre ses angles ou ses côtés.'
        texteIntro += '<br>'
        texteIntro += '- Un <b>triangle isocèle</b> est un triangle qui a deux côtés de même longueur.'
        texteIntro += '<br>'
        texteIntro += '- Un <b>triangle équilatéral</b> est un triangle qui a trois côtés de même longueur.'
        texteIntro += '<br>'
        texteIntro += '- Un <b>triangle rectangle</b> est un triangle qui a un angle droit.'
      } else if (this.classe === 5) {
        texteIntro += '- Un <b>triangle quelconque</b> est un triangle qui ne présente aucune relation particulière entre ses angles ou ses côtés.'
        texteIntro += '<br>'
        texteIntro += '- Un <b>triangle isocèle</b> est un triangle qui a deux côtés ou deux angles de même mesure.'
        texteIntro += '<br>'
        texteIntro += '- Un <b>triangle équilatéral</b> est un triangle qui a trois côtés ou trois angles de même mesure.'
        texteIntro += '<br>'
        texteIntro += '- Un <b>triangle rectangle</b> est un triangle qui a un angle droit.'
      }
    } else {
      if (this.classe === 6) {
        texteIntro = texEnumerateSansNumero(
          [
            '- Un \\textbf{triangle quelconque} est un triangle qui ne présente aucune relation particulière entre ses angles ou ses côtés.',
            '- Un \\textbf{triangle isocèle} est un triangle qui a deux côtés de même longueur.',
            '- Un \\textbf{triangle équilatéral} est un triangle qui a trois côtés de même longueur.',
            '- Un \\textbf{triangle rectangle} est un triangle qui a un angle droit.'
          ],
          1
        )
      } else if (this.classe === 5) {
        texteIntro = texEnumerateSansNumero(
          [
            '- Un \\textbf{triangle quelconque} est un triangle qui ne présente aucune relation particulière entre ses angles ou ses côtés.',
            '- Un \\textbf{triangle isocèle} est un triangle qui a deux côtés ou deux angles de même mesure.',
            '- Un \\textbf{triangle équilatéral} est un triangle qui a trois côtés ou trois angles de même mesure.',
            '- Un \\textbf{triangle rectangle} est un triangle qui a un angle droit.'
          ],
          1
        )
      }

      this.introduction = lampeMessage({
        titre: 'Quelques définitions',
        texte: texteIntro,
        couleur: 'nombres'
      })
    }

    if (this.classe === 6) {
      if (this.sup === 1) {
        typeDeQuestionsDisponibles = [1, 3, 5, 7] // 6e facile isocèle, équilatéral et rectangle.
      } else if (this.sup === 2) {
        // typesDeQuestionsDisponibles = [1,3,4,5,6,7,8,9]; //6e tout sauf par les angles
        typeDeQuestionsDisponibles = [1, 4, 6, 8, 9] // 6e les autres cas sauf par les angles
      }
    } else if (this.classe === 5) {
      // typesDeQuestionsDisponibles = [1,2,3,4,5,6,7,8,9,10,11]; // 5e : on ajoute la caractéisation par les angles
      typeDeQuestionsDisponibles = [
        choice([1, 2]),
        choice([3, 4, 10]),
        choice([5, 6, 11]),
        7,
        choice([8, 9])
      ] // 5e : tout sauf les basiques de 6e, on ajoute la caractéisation par les angles
    }
    const listeTypeDeQuestions = combinaisonListes(
      typeDeQuestionsDisponibles,
      this.nbQuestions
    ) // Tous les types de questions sont posées mais l'ordre diffère à chaque "cycle"

    // let listeTypeDeQuestions = typesDeQuestionsDisponibles // Tous les types de questions sont posées --> à remettre comme ci-dessus
    for (let i = 0, texte, texteCorr, l1, l2, l3, a1, a2, a3, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      // on fixe longueur min et max en cm
      const longueurMin = 2
      const longueurMax = 20
      // on fixe angle min et max en degré
      const angleMin = 30
      const angleMax = 100

      // on crée les triangles
      const triangleQuelconque = new Triangle()
      const triangleIsocele = new Triangle()
      const triangleEquilateral = new Triangle()
      const triangleRectangle = new Triangle()
      const triangleIsoceleRectangle = new Triangle()
      let partieDecimale1, partieDecimale2, partieDecimale3
      if (this.sup2) {
        partieDecimale1 = calculANePlusJamaisUtiliser(randint(1, 9) / 10 * randint(0, 1))
        partieDecimale2 = calculANePlusJamaisUtiliser(randint(1, 9) / 10 * randint(0, 1))
        partieDecimale3 = calculANePlusJamaisUtiliser(randint(1, 9) / 10 * randint(0, 1))
      } else {
        partieDecimale1 = 0
        partieDecimale2 = 0
        partieDecimale3 = 0
      }
      switch (listeTypeDeQuestions[i]) {
        case 1: // triangle quelconque par les longueurs sans conversion
          while (!triangleQuelconque.isTrueTriangleLongueurs()) {
            l1 = randint(longueurMin, longueurMax)
            l2 = randint(longueurMin, longueurMax, l1)
            l3 = randint(longueurMin, longueurMax, [l1, l2])
            triangleQuelconque.l1 = l1 + partieDecimale1
            triangleQuelconque.l2 = l2 + partieDecimale2
            triangleQuelconque.l3 = l3 + partieDecimale3
          }

          texte = `${triangleQuelconque.getNom()} est un triangle tel que ${triangleQuelconque.getLongueurs()[0]} $= ${texNombre(triangleQuelconque.l1)}$ cm ; `
          texte += `${triangleQuelconque.getLongueurs()[1]} $= ${texNombre(triangleQuelconque.l2)}$ cm et ${triangleQuelconque.getLongueurs()[2]} $= ${texNombre(
            triangleQuelconque.l3)}$ cm.`
          texteCorr = `Les 3 côtés du triangle ${triangleQuelconque.getNom()} sont différents et nous n'avons aucune information sur les angles donc ${triangleQuelconque.getNom()} est un triangle ${texteEnCouleurEtGras('quelconque')}.`
          break
        case 2: // triangle quelconque par les angles
          while (!triangleQuelconque.isTrueTriangleAngles()) {
            a1 = randint(angleMin, angleMax)
            a2 = randint(angleMin, angleMax, a1)
            a3 = randint(angleMin, angleMax, [a1, a2])
            triangleQuelconque.a1 = a1
            triangleQuelconque.a2 = a2
            triangleQuelconque.a3 = a3
          }

          texte = `${triangleQuelconque.getNom()} est un triangle tel que ${triangleQuelconque.getAngles()[0]} $= ${triangleQuelconque.a1}^\\circ$ ; `
          texte += ` ${triangleQuelconque.getAngles()[1]} $= ${triangleQuelconque.a2}^\\circ$ et  ${triangleQuelconque.getAngles()[2]} $= ${triangleQuelconque.a3}^\\circ$ .`
          texteCorr = `Les 3 angles du triangle ${triangleQuelconque.getNom()} sont différents donc ${triangleQuelconque.getNom()} est un triangle ${texteEnCouleurEtGras('quelconque')}.`
          break

        case 3: // triangle isocèle sans conversion
          while (!triangleIsocele.isTrueTriangleLongueurs()) {
            l1 = randint(longueurMin, longueurMax)
            l2 = randint(longueurMin, longueurMax, l1)
            triangleIsocele.l1 = l1 + partieDecimale1
            triangleIsocele.l2 = l1 + partieDecimale1
            triangleIsocele.l3 = l2 + partieDecimale2
          }
          texte = `${triangleIsocele.getNom()} est un triangle tel que ${triangleIsocele.getLongueurs()[0]} $= ${texNombre(triangleIsocele.l1)}$ cm ; `
          texte += `${triangleIsocele.getLongueurs()[1]} $= ${texNombre(triangleIsocele.l2)}$ cm et ${triangleIsocele.getLongueurs()[2]} $= ${texNombre(triangleIsocele.l3)}$ cm.`
          texteCorr = `Les longueurs des côtés ${triangleIsocele.getCotes()[0]} et ${triangleIsocele.getCotes()[1]} du triangle ${triangleIsocele.getNom()} valent toutes les deux $${texNombre(triangleIsocele.l1)}$ cm donc ${triangleIsocele.getNom()} est un triangle ${texteEnCouleurEtGras('isocèle')} en ${triangleIsocele.getSommets()[1]}.`
          break
        case 4: // triangle isocèle avec conversion
          while (!triangleIsocele.isTrueTriangleLongueurs()) {
            l1 = randint(longueurMin, longueurMax)
            l2 = randint(longueurMin, longueurMax, l1)
            triangleIsocele.l1 = l1 + partieDecimale1
            triangleIsocele.l2 = l1 + partieDecimale1
            triangleIsocele.l3 = l2 + partieDecimale2
          }
          texte = `${triangleIsocele.getNom()} est un triangle tel que ${triangleIsocele.getLongueurs()[0]} $= ${triangleIsocele.l1 * 10}$ mm ; `
          texte += `${triangleIsocele.getLongueurs()[1]} $= ${texNombre(triangleIsocele.l2)}$ cm et ${triangleIsocele.getLongueurs()[2]} $= ${texNombre(triangleIsocele.l3)}$ cm.`
          texteCorr = `${triangleIsocele.getLongueurs()[0]} $= ${texNombre(triangleIsocele.l1 * 10)}$ mm $= ${texNombre(triangleIsocele.l1)}$ cm = ${triangleIsocele.getLongueurs()[1]}, ${triangleIsocele.getNom()} a donc deux côtés égaux, c'est un triangle ${texteEnCouleurEtGras('isocèle')} en ${triangleIsocele.getSommets()[1]}.`
          break
        case 5: // triangle équilatéral sans conversion
          while (!triangleEquilateral.isTrueTriangleLongueurs()) {
            l1 = randint(longueurMin, longueurMax)
            triangleEquilateral.l1 = l1 + partieDecimale1
            triangleEquilateral.l2 = l1 + partieDecimale1
            triangleEquilateral.l3 = l1 + partieDecimale1
          }
          texte = `${triangleEquilateral.getNom()} est un triangle tel que ${triangleEquilateral.getLongueurs()[0]} $= ${texNombre(triangleEquilateral.l1)}$ cm ; `
          texte += `${triangleEquilateral.getLongueurs()[1]} $= ${texNombre(triangleEquilateral.l2)}$ cm et ${triangleEquilateral.getLongueurs()[2]} $= ${texNombre(triangleEquilateral.l3)}$ cm.`
          texteCorr = `Les longeurs des trois côtés du triangle ${triangleEquilateral.getNom()} sont égales donc c'est un triangle ${texteEnCouleurEtGras('équilatéral')}.`
          break
        case 6: // triangle équilatéral avec conversion
          while (!triangleEquilateral.isTrueTriangleLongueurs()) {
            l1 = randint(longueurMin, longueurMax)
            triangleEquilateral.l1 = l1 + partieDecimale1
            triangleEquilateral.l2 = l1 + partieDecimale1
            triangleEquilateral.l3 = l1 + partieDecimale1
          }
          texte = `${triangleEquilateral.getNom()} est un triangle tel que ${triangleEquilateral.getLongueurs()[0]} $= ${texNombre(triangleEquilateral.l1)}$ cm ; `
          texte += `${triangleEquilateral.getLongueurs()[1]} $= ${texNombre(triangleEquilateral.l2 * 10)}$ mm et ${triangleEquilateral.getLongueurs()[2]} $= ${texNombre(
            triangleEquilateral.l3 / 10
          )}$ dm.`
          texteCorr = `${triangleEquilateral.getLongueurs()[1]} $= ${texNombre(triangleEquilateral.l2 * 10)}$ mm $= ${triangleEquilateral.l2}$ cm.`
          texteCorr += `<br> ${triangleEquilateral.getLongueurs()[2]} $= ${texNombre(triangleEquilateral.l3 / 10)}$ dm $= ${texNombre(triangleEquilateral.l3)}$ cm.`
          texteCorr += `<br> ${triangleEquilateral.getLongueurs()[0]} $= ${texNombre(triangleEquilateral.l1)}$ cm.`
          texteCorr += `<br> Les longeurs des trois côtés du triangle ${triangleEquilateral.getNom()} sont égales donc c'est un triangle ${texteEnCouleurEtGras('équilatéral')}.`
          break
        case 7: // triangle rectangle pas de conversion nécessaire
          l1 = randint(longueurMin, longueurMax)
          triangleRectangle.l1 = l1 + partieDecimale1
          triangleRectangle.l2 = randint(longueurMin, longueurMax, l1) + partieDecimale2
          triangleRectangle.a1 = 90

          texte = `${triangleRectangle.getNom()} est un triangle tel que ${triangleRectangle.getLongueurs()[0]} $= ${texNombre(triangleRectangle.l1)}$ cm ; `
          texte += `${triangleRectangle.getLongueurs()[1]} $= ${texNombre(triangleRectangle.l2)}$ cm `
          texte += 'et '
          if (this.classe === 6) {
            texte += ` qui a un angle droit en ${triangleRectangle.getSommets()[1]}.`
            texteCorr = `Le triangle ${triangleRectangle.getNom()} a un angle droit en ${triangleRectangle.getSommets()[1]} donc ${triangleRectangle.getNom()} est ${texteEnCouleurEtGras('rectangle')} en ${triangleRectangle.getSommets()[1]}.`
          } else {
            texte += `${triangleRectangle.getAngles()[0]} $= ${triangleRectangle.a1}^\\circ$.`
            texteCorr = `L'angle ${triangleRectangle.getAngles()[0]} du triangle ${triangleRectangle.getNom()} est un angle droit donc ${triangleRectangle.getNom()} est ${texteEnCouleurEtGras('rectangle')} en ${triangleRectangle.getSommets()[1]}.`
          }

          break
        case 8: // triangle isocèle rectangle sans conversion
          l1 = randint(longueurMin, longueurMax)
          triangleIsoceleRectangle.l1 = l1 + partieDecimale1
          triangleIsoceleRectangle.l2 = triangleIsoceleRectangle.l1
          triangleIsoceleRectangle.a1 = 90

          texte = `${triangleIsoceleRectangle.getNom()} est un triangle tel que ${triangleIsoceleRectangle.getLongueurs()[0]}$= ${texNombre(triangleIsoceleRectangle.l1)}$ cm ; `
          texte += `${triangleIsoceleRectangle.getLongueurs()[1]} $= ${texNombre(triangleIsoceleRectangle.l2)}$ cm `
          texte += 'et '
          if (this.classe === 6) {
            texte += `qui a un angle droit en ${triangleIsoceleRectangle.getSommets()[1]}.`
            texteCorr = `Le triangle ${triangleIsoceleRectangle.getNom()} a un angle droit en ${triangleIsoceleRectangle.getSommets()[1]} donc ${triangleIsoceleRectangle.getNom()} est rectangle en ${triangleIsoceleRectangle.getSommets()[1]}.`
            texteCorr += `<br> ${triangleIsoceleRectangle.getLongueurs()[0]} $=$ ${triangleIsoceleRectangle.getLongueurs()[1]} $= ${texNombre(triangleIsoceleRectangle.l1)}$ cm donc ${triangleIsoceleRectangle.getNom()} est isocèle en ${triangleIsoceleRectangle.getSommets()[1]}.`
            texteCorr += `<br> Le triangle ${triangleIsoceleRectangle.getNom()} est donc ${texteEnCouleurEtGras('isocèle')} et ${texteEnCouleurEtGras('rectangle')} en ${triangleIsoceleRectangle.getSommets()[1]}.`
          } else {
            texte += `${triangleIsoceleRectangle.getAngles()[0]} $= ${triangleIsoceleRectangle.a1}^\\circ$.`
            texteCorr = `L'angle ${triangleIsoceleRectangle.getAngles()[0]} du triangle ${triangleIsoceleRectangle.getNom()} est un angle droit donc ${triangleIsoceleRectangle.getNom()} est rectangle en ${triangleIsoceleRectangle.getSommets()[1]}.`
            texteCorr += `<br> ${triangleIsoceleRectangle.getLongueurs()[0]} $=$ ${triangleIsoceleRectangle.getLongueurs()[1]} $= ${triangleIsoceleRectangle.l1}$ cm donc ${triangleIsoceleRectangle.getNom()} est isocèle en ${triangleIsoceleRectangle.getSommets()[1]}.`
            texteCorr += `<br> Le triangle ${triangleIsoceleRectangle.getNom()} est donc ${texteEnCouleurEtGras('isocèle')} et ${texteEnCouleurEtGras('rectangle')} en ${triangleIsoceleRectangle.getSommets()[1]}.`
          }
          break
        case 9: // triangle isocèle rectangle avec conversion
          triangleIsoceleRectangle.l1 = randint(longueurMin, longueurMax) + partieDecimale1
          triangleIsoceleRectangle.l2 = triangleIsoceleRectangle.l1
          triangleIsoceleRectangle.a1 = 90

          texte = `${triangleIsoceleRectangle.getNom()} est un triangle tel que ${triangleIsoceleRectangle.getLongueurs()[0]} $= ${texNombre(triangleIsoceleRectangle.l1 * 10)}$ mm ; `
          texte += `${triangleIsoceleRectangle.getLongueurs()[1]} $= ${texNombre(triangleIsoceleRectangle.l2)}$ cm`
          texte += ' et '
          if (this.classe === 6) {
            texte += `qui a un angle droit en ${triangleIsoceleRectangle.getSommets()[1]}.`
            texteCorr = `Le triangle ${triangleIsoceleRectangle.getNom()} a un angle droit en ${triangleIsoceleRectangle.getSommets()[1]} donc ${triangleIsoceleRectangle.getNom()} est rectangle en ${triangleIsoceleRectangle.getSommets()[1]}.`
            texteCorr += `<br> ${triangleIsoceleRectangle.getLongueurs()[0]} $= ${triangleIsoceleRectangle.l1 * 10}$ mm $= ${texNombre(triangleIsoceleRectangle.l1)}$ cm =${triangleIsoceleRectangle.getLongueurs()[1]} donc ${triangleIsoceleRectangle.getNom()} est isocèle en ${triangleIsoceleRectangle.getSommets()[1]}.`
            texteCorr += `<br> Le triangle ${triangleIsoceleRectangle.getNom()} est donc ${texteEnCouleurEtGras('isocèle')} et ${texteEnCouleurEtGras('rectangle')} en ${triangleIsoceleRectangle.getSommets()[1]}.`
          } else {
            texte += `${triangleIsoceleRectangle.getAngles()[0]} $= ${triangleIsoceleRectangle.a1}^\\circ$.`
            texteCorr = `L'angle ${triangleIsoceleRectangle.getAngles()[0]} du triangle ${triangleIsoceleRectangle.getNom()} est un angle droit donc ${triangleIsoceleRectangle.getNom()} est rectangle en ${triangleIsoceleRectangle.getSommets()[1]}.`
            texteCorr += `<br> ${triangleIsoceleRectangle.getLongueurs()[0]} $= ${texNombre(triangleIsoceleRectangle.l1 * 10)}$ mm $= ${texNombre(triangleIsoceleRectangle.l1)}$ cm =${triangleIsoceleRectangle.getLongueurs()[1]} donc ${triangleIsoceleRectangle.getNom()} est isocèle en ${triangleIsoceleRectangle.getSommets()[1]}.`
            texteCorr += `<br> Le triangle ${triangleIsoceleRectangle.getNom()} est donc ${texteEnCouleurEtGras('isocèle')} et ${texteEnCouleurEtGras('rectangle')} en ${triangleIsoceleRectangle.getSommets()[1]}.`
          }
          break
        case 10: // triangle isocèle par les angles
          a3 = -1
          while (a3 < 0) {
            triangleIsocele.a1 = randint(angleMin, angleMax)
            triangleIsocele.a2 = triangleIsocele.a1
            a3 = 180 - 2 * triangleIsocele.a1
            triangleIsocele.a3 = a3
          }
          texte = `${triangleIsocele.getNom()} est un triangle tel que ${triangleIsocele.getAngles()[0]} $= ${triangleIsocele.a1}^\\circ$ ; `
          texte += ` ${triangleIsocele.getAngles()[1]} $= ${triangleIsocele.a2}^\\circ$ et  ${triangleIsocele.getAngles()[2]} $= ${triangleIsocele.a3}^\\circ$ .`
          texteCorr = `Le triangle ${triangleIsocele.getNom()} a deux angles égaux, ${triangleIsocele.getAngles()[0]} = ${triangleIsocele.getAngles()[1]} $= ${triangleIsocele.a1}^\\circ$ donc ${triangleIsocele.getNom()} est un triangle ${texteEnCouleurEtGras('isocèle')} en ${triangleIsocele.getSommets()[0]}.`
          break
        case 11: // triangle équilatéral par les angles
          triangleEquilateral.a1 = 60
          triangleEquilateral.a2 = 60
          triangleEquilateral.a3 = 60

          texte = `${triangleEquilateral.getNom()} est un triangle tel que ${triangleEquilateral.getAngles()[0]} $= ${triangleEquilateral.a1}^\\circ$ ; `
          texte += ` ${triangleEquilateral.getAngles()[1]} $= ${triangleEquilateral.a2}^\\circ$ et  ${triangleEquilateral.getAngles()[2]} $= ${triangleEquilateral.a3}^\\circ$.`
          texteCorr = `Le triangle ${triangleEquilateral.getNom()} a trois angles égaux, ${triangleEquilateral.getAngles()[0]} = ${triangleEquilateral.getAngles()[1]} = ${triangleEquilateral.getAngles()[2]} $= ${triangleEquilateral.a1}^\\circ$ donc ${triangleEquilateral.getNom()} est un triangle ${texteEnCouleurEtGras('équilatéral')}.`
          break
      }
      if (this.listeQuestions.indexOf(texte) === -1) {
        // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  if (this.classe === 6) { this.besoinFormulaireNumerique = ['Niveau de difficulté', 2, '1 : Sans conversion de longueurs\n2 : Avec conversions de longueurs'] }
  this.besoinFormulaire2CaseACocher = ['Avec des décimaux', false]
}
