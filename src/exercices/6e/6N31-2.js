import { choice, combinaisonListesSansChangerOrdre, shuffle } from '../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { context } from '../../modules/context.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { tableauColonneLigne } from '../../lib/2d/tableau'
import { AddTabDbleEntryMathlive } from '../../lib/interactif/tableaux/AjouteTableauMathlive'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
export const titre = 'Trouver un ordre de grandeur d\'opérations sur les décimaux'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * * Ordre de grandeur d'une opération entre décimaux
 * * 6N31-2
 * @author Sébastien Lozano
 */

export const dateDeModificationImportante = '27/06/2024' // suppression de coquilles, nettoyage du code et interactivité. Jean-Claude Lhote
export const uuid = '843e5'
export const ref = '6N31-2'
export const refs = {
  'fr-fr': ['6N31-2'],
  'fr-ch': ['9NO8-12']
}
// une fonction pour ordre de grandeur en fonction de ... opération 1
function myOrdreOpe1 (c, d) {
  if (c * d > 50000) {
    return ['', '', '', '', '', `${miseEnEvidence('\\text{X}')}`]
  } else {
    return ['', '', '', '', `${miseEnEvidence('\\text{X}')}`, '']
  }
}
// une fonction pour ordre de grandeur en fonction de ... opération 2
function myOrdreOpe2 (c1, c2) {
  if (c1 + c2 >= 500) {
    return ['', '', '', `${miseEnEvidence('\\text{X}')}`, '', '']
  } else {
    return ['', '', `${miseEnEvidence('\\text{X}')}`, '', '', '']
  }
}
// une fonction pour ordre de grandeur en fonction de ... opération 3
function myOrdreOpe3 (n) {
  if (n > 500) {
    return ['', '', '', `${miseEnEvidence('\\text{X}')}`, '', '']
  } else {
    return ['', '', `${miseEnEvidence('\\text{X}')}`, '', '', '']
  }
}
export default function OrdreDeGrandeurOperationsDecimaux () {
  Exercice.call(this)
  this.beta = false
  if (this.beta) {
    this.nbQuestions = 1
  } else {
    this.nbQuestions = 1
  }
  // une fonction pour ordre de grandeur en fonction de ... opération 4
  function myOrdreOpe4 (d, n) {
    let sortie
    switch (d) {
      case 0.1:
        if (n > 5000) {
          sortie = ['', '', '', `${miseEnEvidence('\\text{X}')}`, '', '']
        } else {
          sortie = ['', '', `${miseEnEvidence('\\text{X}')}`, '', '', '']
        }
        break
      case 0.01:
        if (n > 5000) {
          sortie = ['', '', `${miseEnEvidence('\\text{X}')}`, '', '', '']
        } else {
          sortie = ['', `${miseEnEvidence('\\text{X}')}`, '', '', '', '']
        }
        break
      case 0.001:
        if (n > 5000) {
          sortie = ['', `${miseEnEvidence('\\text{X}')}`, '', '', '', '']
        } else {
          sortie = [`${miseEnEvidence('\\text{X}')}`, '', '', '', '', '']
        }
        break
    }
    return sortie
  }
  // une fonction pour ordre de grandeur en fonction de ... opération 5
  function myOrdreOpe5 (mult) {
    let sortie
    switch (mult) {
      case 1:
        return ['', '', '', `${miseEnEvidence('\\text{X}')}`, '', '']
      case 10:
        return ['', '', `${miseEnEvidence('\\text{X}')}`, '', '', '']
      case 100:
        return ['', `${miseEnEvidence('\\text{X}')}`, '', '', '', '']
      case 1000:
        return [`\\text{${miseEnEvidence(('X'))}`, '', '', '', '', '']
    }
    return sortie
  }

  this.consigne = 'Pour chaque opération proposée dans la première colonne, cocher la case correspondant à l\'ordre de grandeur du résultat.'

  this.nbCols = 1
  this.nbColsCorr = 1
  // this.nbQuestionsModifiable = false;
  context.isHtml ? this.spacing = 3 : this.spacing = 2
  context.isHtml ? this.spacingCorr = 2.5 : this.spacingCorr = 1.5

  let typesDeQuestionsDisponibles

  this.nouvelleVersion = function () {
    if (this.beta) {
      typesDeQuestionsDisponibles = [0]
    } else {
      // typesDeQuestionsDisponibles = shuffle([choice([1,3]),choice([2,4]),0]);
      typesDeQuestionsDisponibles = shuffle([0])
    }

    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []

    // let listeTypeDeQuestions  = combinaisonListes(typesDeQuestionsDisponibles,this.nbQuestions) // Tous les types de questions sont posées mais l'ordre diffère à chaque "cycle"
    const listeTypeDeQuestions = combinaisonListesSansChangerOrdre(typesDeQuestionsDisponibles, this.nbQuestions) // Tous les types de questions sont posées --> à remettre comme ci-dessus

    for (let i = 0, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      const ligneEntete = ['\\text{Opération}', '\\phantom{000}' + texNombre(1) + '\\phantom{000}', '\\phantom{00}' + texNombre(10) + '\\phantom{00}', '\\phantom{00}' + texNombre(100) + '\\phantom{00}', '\\phantom{0}' + texNombre(1000) + '\\phantom{0}', texNombre(10000), texNombre(100000)]
      const ligneEnteteCorr = ['\\text{Opération}', '\\phantom{000}' + texNombre(1) + '\\phantom{000}', '\\phantom{00}' + texNombre(10) + '\\phantom{00}', '\\phantom{00}' + texNombre(100) + '\\phantom{00}', '\\phantom{0}' + texNombre(1000) + '\\phantom{0}', texNombre(10000), texNombre(100000)]

      const m = randint(1, 9, [4, 5, 6])
      const c1 = randint(1, 9, 5)
      const c2 = randint(1, 9, 5)
      const c3 = randint(1, 9, [4, 5, 6])
      const c4 = randint(1, 4)
      const d = randint(1, 9)
      const d1 = randint(1, 9)
      const d2 = randint(1, 9)
      const d3 = randint(1, 9)
      const u = randint(1, 9)
      const u1 = randint(1, 9)
      const u2 = randint(1, 9)
      const u3 = randint(1, 9)

      let cbis, d1bis
      do {
        cbis = randint(2, 9)
        d1bis = randint(2, 9)
      } while (cbis * d1bis > 3 && cbis * d1bis < 7)

      const divAleatoireOpe3 = choice([10, 100])
      const divAleatoireOpe5 = choice([1, 10, 100, 1000])
      const multAleatoireOpe4 = choice([0.1, 0.01, 0.001])
      const nb11 = cbis * 100 + d * 10 + u
      const nb11Rounded = (cbis + (d > 4 ? 1 : 0)) * 100
      const nb12 = d1bis * 10 + u1
      const nb12Rounded = (d1bis + (u1 > 4 ? 1 : 0)) * 10
      const nb21 = (c2 * 100 + d2 * 10 + u1) / 10
      const nb21Rounded = 10 * (c2 + (d2 > 4 ? 1 : 0))
      const nb22 = c1 * 100 + d1 * 10 + u1
      const nb22Rounded = 100 * (c1 + (d1 > 4 ? 1 : 0))
      const nb31 = c3 * 100 + d3 * 10 + u3
      const nb31Rounded = 100 * (c3 + (d3 > 4 ? 1 : 0))
      const nb32 = (c2 * 100 + d2 * 10 + u2) / divAleatoireOpe3
      const nb32Rounded = 100 * (c2 + (d2 > 4 ? 1 : 0)) / divAleatoireOpe3
      const nb41 = m * 1000 + c3 * 100 + d2 * 10 + u1
      const nb41Rounded = 1000 * (m + (c3 > 4 ? 1 : 0))
      const nb51 = (m * 1000 + c4 * 100 + d3 * 10 + u) / divAleatoireOpe5
      const nb51Rounded = 1000 * (m + (c4 > 4 ? 1 : 0)) / divAleatoireOpe5

      const situations = [
        {
          operation: `${nb11}\\times ${nb12}`,
          operation_corr: `${nb11}\\times ${nb12} \\approx  ${nb11Rounded}\\times ${nb12Rounded} \\text{, soit } ${texNombre(nb11Rounded * nb12Rounded, 0)}`,
          operation_coche: myOrdreOpe1(nb11Rounded, nb12Rounded)
        },
        {
          operation: `${texNombre(nb21, 1)}+${nb22}`,
          operation_corr: `${texNombre(nb21, 1)}+${nb22} \\approx ${nb21Rounded}+${nb22Rounded} \\text{, soit } ${nb21Rounded + nb22Rounded}`,
          operation_coche: myOrdreOpe2(nb21Rounded, nb22Rounded)
        },
        {
          operation: `${nb31}-${texNombre(nb32, 2)}`,
          operation_corr: `${nb31}-${texNombre(nb32, 2)} \\approx ${nb31Rounded}-${nb32Rounded} \\text{, soit } ${nb31Rounded - nb32Rounded}`,
          operation_coche: myOrdreOpe3(nb31Rounded - nb32Rounded)
        },
        {
          operation: `${texNombre(nb41)}\\times ${texNombre(multAleatoireOpe4, 3)}`,
          operation_corr: `${texNombre(nb41, 0)}\\times ${texNombre(multAleatoireOpe4, 3)} \\approx ${texNombre(nb41Rounded)}\\times ${texNombre(multAleatoireOpe4, 3)} \\text{, soit } ${texNombre(nb41Rounded * multAleatoireOpe4, 0)}`,
          operation_coche: myOrdreOpe4(multAleatoireOpe4, nb41Rounded)
        },
        {
          operation: `${texNombre(nb51, 3)}\\div ${m}`,
          operation_corr: `${texNombre(nb51, 3)}\\div ${m} \\approx ${texNombre(nb51Rounded, 3)}\\div ${m} \\text{, soit } ${texNombre(nb51Rounded / m, 0)}`,
          operation_coche: myOrdreOpe5(divAleatoireOpe5)
        }
      ]

      const tabValue = AddTabDbleEntryMathlive.convertTclToTableauMathlive(ligneEntete, [situations[0].operation, situations[1].operation, situations[2].operation, situations[3].operation, situations[4].operation],
        [
          '', '', '', '', '', '',
          '', '', '', '', '', '',
          '', '', '', '', '', '',
          '', '', '', '', '', '',
          '', '', '', '', '', ''
        ]
      )
      const coches = [
        situations[0].operation_coche[0], situations[0].operation_coche[1], situations[0].operation_coche[2], situations[0].operation_coche[3], situations[0].operation_coche[4], situations[0].operation_coche[5],
        situations[1].operation_coche[0], situations[1].operation_coche[1], situations[1].operation_coche[2], situations[1].operation_coche[3], situations[1].operation_coche[4], situations[1].operation_coche[5],
        situations[2].operation_coche[0], situations[2].operation_coche[1], situations[2].operation_coche[2], situations[2].operation_coche[3], situations[2].operation_coche[4], situations[2].operation_coche[5],
        situations[3].operation_coche[0], situations[3].operation_coche[1], situations[3].operation_coche[2], situations[3].operation_coche[3], situations[3].operation_coche[4], situations[3].operation_coche[5],
        situations[4].operation_coche[0], situations[4].operation_coche[1], situations[4].operation_coche[2], situations[4].operation_coche[3], situations[4].operation_coche[4], situations[4].operation_coche[5]
      ]
      const tableau = AddTabDbleEntryMathlive.create(this.numeroExercice, i, tabValue, 'tableauMathlive', this.interactif, {})
      const material = {
        enonce: tableau.output,
        question: '',
        correction: `
          Commençons par calculer un ordre de grandeur du résultat de chaque opération dans la première colonne du tableau.
          <br>
          ${tableauColonneLigne(ligneEnteteCorr, [situations[0].operation_corr, situations[1].operation_corr, situations[2].operation_corr, situations[3].operation_corr, situations[4].operation_corr],
            coches
          )}`
      }
      const reponses = Object.assign({}, Object.fromEntries(coches.map((el, index) => [`L${Math.floor(index / 6) + 1}C${(index % 6) + 1}`, Object.assign({}, { value: el !== '' ? '\\times' : '' })]).filter(el => el[1].value !== '')))
      console.log(reponses)
      handleAnswers(this, i, reponses)
      // autant de case que d'elements dans le tableau des situations
      switch (listeTypeDeQuestions[i]) {
        case 0:
          texte = `${material.enonce}`
          if (this.beta) {
            texte += '<br>'
            texte += `<br> =====CORRECTION======<br>${material.correction}`
            texte += '             '
            texteCorr = ''
          } else {
            texteCorr = `${material.correction}`
          }
          break
      }

      if (this.questionJamaisPosee(i, nb11, nb21, nb31, nb41)) { // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
