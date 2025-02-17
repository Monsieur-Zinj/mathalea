import { combinaisonListesSansChangerOrdre, shuffle } from '../../lib/outils/arrayOutils'
import { nombreDeChiffresDansLaPartieDecimale, nombreDeChiffresDansLaPartieEntiere } from '../../lib/outils/nombres'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { context } from '../../modules/context.js'
import { calculANePlusJamaisUtiliser, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { setReponse } from '../../lib/interactif/gestionInteractif'

export const amcReady = true
export const interactifReady = true
export const interactifType = 'mathLive'

export const amcType = 'AMCNum'
export const titre = 'Calculer le produit de deux décimaux connaissant le produit de deux entiers'

/**
 * * Calculer le produit de deux décimaux à partir d'un produit de deux entiers
 * * 6C30-2
 * @author Sébastien Lozano
 */

export const uuid = '625c0'
export const ref = '6C30-2'
export const refs = {
  'fr-fr': ['6C30-2'],
  'fr-ch': ['9NO8-10']
}
export default function ProduitDeDecimauxAPartirProduitConnu () {
  Exercice.call(this)
  this.beta = false
  this.sup = 1
  if (this.beta) {
    this.nbQuestions = 3
  } else {
    this.nbQuestions = 3
  }

  this.titre = titre
  this.consigne = ''

  this.nbCols = 1
  this.nbColsCorr = 1
  context.isHtml ? this.spacing = 3 : this.spacing = 2
  context.isHtml ? this.spacingCorr = 2.5 : this.spacingCorr = 1.5

  let typesDeQuestionsDisponibles

  this.nouvelleVersion = function () {
    if (this.beta) {
      typesDeQuestionsDisponibles = [0, 1, 2]
    } else {
      // typesDeQuestionsDisponibles = shuffle([choice([1,3]),choice([2,4]),0]);
      typesDeQuestionsDisponibles = shuffle([0, 1, 2])
    }

    let reponse
    // let listeTypeDeQuestions  = combinaisonListes(typesDeQuestionsDisponibles,this.nbQuestions) // Tous les types de questions sont posées mais l'ordre diffère à chaque "cycle"
    const listeTypeDeQuestions = combinaisonListesSansChangerOrdre(typesDeQuestionsDisponibles, this.nbQuestions) // Tous les types de questions sont posées --> à remettre comme ci-dessus

    for (let i = 0, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      // pour les situations, autant de situations que de cas dans le switch !
      this.autoCorrection[i] = {}
      const situations = [
        { // case 0 --> (d1u1xp1)xd2u2
          d1: randint(1, 9),
          u1: randint(1, 9),
          d2: randint(1, 9),
          u2: randint(1, 9),
          p1: randint(-3, 3, [0]),
          p2: randint(-3, 3, [0])
        }
      ]
      const enonces = []
      // for (let k=0;k<3;k++) {
      enonces.push({
        enonce: `
            Sachant que $${calculANePlusJamaisUtiliser(situations[0].d1 * 10 + situations[0].u1)}\\times ${calculANePlusJamaisUtiliser(situations[0].d2 * 10 + situations[0].u2)} = ${texNombre(calculANePlusJamaisUtiliser((situations[0].d1 * 10 + situations[0].u1) * (situations[0].d2 * 10 + situations[0].u2)))}$,
            calculer $${texNombre(calculANePlusJamaisUtiliser((situations[0].d1 * 10 + situations[0].u1) * (10 ** situations[0].p1)))}\\times ${calculANePlusJamaisUtiliser(situations[0].d2 * 10 + situations[0].u2)}$.
            `,
        question: '',
        correction: `
          $${texNombre(calculANePlusJamaisUtiliser((situations[0].d1 * 10 + situations[0].u1) * (10 ** situations[0].p1)))}\\times ${calculANePlusJamaisUtiliser(situations[0].d2 * 10 + situations[0].u2)} = ${calculANePlusJamaisUtiliser(situations[0].d1 * 10 + situations[0].u1)}\\times ${texNombre(10 ** situations[0].p1)} \\times ${calculANePlusJamaisUtiliser(situations[0].d2 * 10 + situations[0].u2)} = ${calculANePlusJamaisUtiliser(situations[0].d1 * 10 + situations[0].u1)}\\times ${calculANePlusJamaisUtiliser(situations[0].d2 * 10 + situations[0].u2)}\\times ${texNombre(10 ** situations[0].p1)} =  ${texNombre(calculANePlusJamaisUtiliser((situations[0].d1 * 10 + situations[0].u1) * (situations[0].d2 * 10 + situations[0].u2)))}\\times ${texNombre(10 ** situations[0].p1)} = ${texNombre(calculANePlusJamaisUtiliser((situations[0].d1 * 10 + situations[0].u1) * (situations[0].d2 * 10 + situations[0].u2)) * calculANePlusJamaisUtiliser(10 ** situations[0].p1))}$
          `,
        reponse: calculANePlusJamaisUtiliser((situations[0].d1 * 10 + situations[0].u1) * (situations[0].d2 * 10 + situations[0].u2) * 10 ** situations[0].p1)
      })
      enonces.push({
        enonce: `
          Sachant que $${calculANePlusJamaisUtiliser(situations[0].d1 * 10 + situations[0].u1)}\\times ${calculANePlusJamaisUtiliser(situations[0].d2 * 10 + situations[0].u2)} = ${texNombre(calculANePlusJamaisUtiliser((situations[0].d1 * 10 + situations[0].u1) * (situations[0].d2 * 10 + situations[0].u2)))}$,
          calculer $${texNombre(calculANePlusJamaisUtiliser((situations[0].d1 * 10 + situations[0].u1)))}\\times ${texNombre(calculANePlusJamaisUtiliser((situations[0].d2 * 10 + situations[0].u2) * (10 ** situations[0].p2)))}$.
            `,
        question: '',
        correction: `
          $${texNombre(calculANePlusJamaisUtiliser((situations[0].d1 * 10 + situations[0].u1)))}\\times ${texNombre(calculANePlusJamaisUtiliser((situations[0].d2 * 10 + situations[0].u2) * (10 ** situations[0].p2)))} = ${calculANePlusJamaisUtiliser(situations[0].d1 * 10 + situations[0].u1)}\\times ${calculANePlusJamaisUtiliser(situations[0].d2 * 10 + situations[0].u2)}\\times ${texNombre(10 ** situations[0].p2)} = ${texNombre(calculANePlusJamaisUtiliser((situations[0].d1 * 10 + situations[0].u1) * (situations[0].d2 * 10 + situations[0].u2)))}\\times ${texNombre(10 ** situations[0].p2)} = ${texNombre(calculANePlusJamaisUtiliser((situations[0].d1 * 10 + situations[0].u1) * (situations[0].d2 * 10 + situations[0].u2)) * calculANePlusJamaisUtiliser(10 ** situations[0].p2))}$
          `,
        reponse: calculANePlusJamaisUtiliser((situations[0].d1 * 10 + situations[0].u1) * (situations[0].d2 * 10 + situations[0].u2) * 10 ** situations[0].p2)
      })
      enonces.push({
        enonce: `
          Sachant que $${calculANePlusJamaisUtiliser(situations[0].d1 * 10 + situations[0].u1)}\\times ${calculANePlusJamaisUtiliser(situations[0].d2 * 10 + situations[0].u2)} = ${texNombre(calculANePlusJamaisUtiliser((situations[0].d1 * 10 + situations[0].u1) * (situations[0].d2 * 10 + situations[0].u2)))}$,
          calculer $${texNombre(calculANePlusJamaisUtiliser((situations[0].d1 * 10 + situations[0].u1) * (10 ** situations[0].p1)))}\\times ${texNombre(calculANePlusJamaisUtiliser((situations[0].d2 * 10 + situations[0].u2) * (10 ** situations[0].p2)))}$.
          `,
        question: '',
        correction: `
          $${texNombre(calculANePlusJamaisUtiliser((situations[0].d1 * 10 + situations[0].u1) * (10 ** situations[0].p1)))}\\times ${texNombre(calculANePlusJamaisUtiliser((situations[0].d2 * 10 + situations[0].u2) * (10 ** situations[0].p2)))} = ${calculANePlusJamaisUtiliser(situations[0].d1 * 10 + situations[0].u1)}\\times ${texNombre(10 ** situations[0].p1)} \\times ${calculANePlusJamaisUtiliser(situations[0].d2 * 10 + situations[0].u2)}\\times ${texNombre(10 ** situations[0].p2)} = ${calculANePlusJamaisUtiliser(situations[0].d1 * 10 + situations[0].u1)}\\times ${calculANePlusJamaisUtiliser(situations[0].d2 * 10 + situations[0].u2)}\\times ${texNombre(10 ** situations[0].p1)}\\times ${texNombre(10 ** situations[0].p2)} = ${texNombre(calculANePlusJamaisUtiliser((situations[0].d1 * 10 + situations[0].u1) * (situations[0].d2 * 10 + situations[0].u2)))}\\times ${texNombre(10 ** situations[0].p1)}\\times ${texNombre(10 ** situations[0].p2)} = ${texNombre(calculANePlusJamaisUtiliser((situations[0].d1 * 10 + situations[0].u1) * (situations[0].d2 * 10 + situations[0].u2)) * calculANePlusJamaisUtiliser(10 ** situations[0].p1) * calculANePlusJamaisUtiliser(10 ** situations[0].p2))}$
          `,
        reponse: calculANePlusJamaisUtiliser((situations[0].d1 * 10 + situations[0].u1) * (situations[0].d2 * 10 + situations[0].u2) * 10 ** situations[0].p1 * 10 ** situations[0].p2)
      })

      // };

      // autant de case que d'elements dans le tableau des situations
      switch (listeTypeDeQuestions[i]) {
        case 0:
          texte = `${enonces[0].enonce}`
          if (this.beta) {
            texte += '<br>'
            texte += `<br> =====CORRECTION======<br>${enonces[0].correction}`
            texte += '             '
            texteCorr = ''
          } else {
            texteCorr = `${enonces[0].correction}`
          }
          reponse = enonces[0].reponse
          break
        case 1:
          texte = `${enonces[1].enonce}`
          if (this.beta) {
            texte += '<br>'
            texte += `<br> =====CORRECTION======<br>${enonces[1].correction}`
            texteCorr = ''
          } else {
            texteCorr = `${enonces[1].correction}`
          }
          reponse = enonces[1].reponse
          break
        case 2:
          texte = `${enonces[2].enonce}`
          if (this.beta) {
            texte += '<br>'
            texte += `<br> =====CORRECTION======<br>${enonces[2].correction}`
            texteCorr = ''
          } else {
            texteCorr = `${enonces[2].correction}`
          }
          reponse = enonces[2].reponse
          break
      }
      if (context.isHtml && this.interactif) texte += ajouteChampTexteMathLive(this, i, '')
      setReponse(this, i, reponse)
      if (context.isAmc) {
        this.autoCorrection[i].enonce = texte
        this.autoCorrection[i].propositions = [{ texte: texteCorr, statut: '' }]
        this.autoCorrection[i].reponse.param = {
          digits: nombreDeChiffresDansLaPartieEntiere(reponse) + nombreDeChiffresDansLaPartieDecimale(reponse) + 2,
          decimals: nombreDeChiffresDansLaPartieDecimale(reponse) + 1,
          signe: false,
          exposantNbChiffres: 0
        }
      }
      if (this.listeQuestions.indexOf(texte) === -1) { // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
