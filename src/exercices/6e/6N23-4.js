import { texFractionFromString } from '../../lib/outils/deprecatedFractions.js'
import { nombreDeChiffresDansLaPartieDecimale, nombreDeChiffresDe } from '../../lib/outils/nombres'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { context } from '../../modules/context.js'
import { calculANePlusJamaisUtiliser, gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { setReponse } from '../../lib/interactif/gestionInteractif.ts'

export const titre = 'Donner l\'écriture décimale d\'un nombre à partir de différents textes'
export const amcReady = true
export const amcType = 'AMCNum'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDeModifImportante = '15/01/2022' // Ajout de paramètres
/**
 * Écriture décimale à partir de différentes manières de l'énoncé
 *
 * * 3 unités, 5 dixièmes et 8 centièmes
 * * 3 unités et 5 centièmes
 * * 5 dixièmes
 * * 128/10
 * * 8+5/100+7/100
 * @author Rémi Angot
 * Référence 6N23-4
 * Ajout de paramètres, Interactivité et AMC : Janvier 2022 par EE
 */
export const uuid = 'e8e24'
export const ref = '6N23-4'
export const refs = {
  'fr-fr': ['6N23-4'],
  'fr-ch': ['9NO10-3']
}
export default function NombreDecimalOraliseDeDifferentesManieres () {
  Exercice.call(this)
  this.consigne = "Donner l'écriture décimale de chaque nombre."
  this.nbQuestions = 5
  this.besoinFormulaireTexte = ['Type des textes', 'Nombres séparés par des tirets\n1 : 3 unités, 5 dixièmes et 8 centièmes\n2 : 3 unités et 5 centièmes\n3 : 5 dixièmes\n4 : Du genre 128/10\n5 : Du genre 8+5/100+7/100\n6 : Mélange']
  this.sup = 6

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []

    /*
        let typesDeQuestionsDisponibles = []
        if (!this.sup) { // Si aucune liste n'est saisie
          typesDeQuestionsDisponibles = range1(5)
        } else {
          if (typeof (this.sup) === 'number') { // Je n'ai jamais réussi à rentrer dans ce test.
            this.sup = Math.max(Math.min(parseInt(this.sup), 6), 1)
            typesDeQuestionsDisponibles[0] = this.sup
          } else {
            typesDeQuestionsDisponibles = this.sup.split('-')// Sinon on créé un tableau à partir des valeurs séparées par des -
            for (let i = 0; i < typesDeQuestionsDisponibles.length; i++) { // on a un tableau avec des strings : ['1', '1', '2']
              typesDeQuestionsDisponibles[i] = contraindreValeur(1, 6, parseInt(typesDeQuestionsDisponibles[i]), 6)
            }
          }
        }
        if (compteOccurences(typesDeQuestionsDisponibles, 6) > 0) typesDeQuestionsDisponibles = range1(5) // Teste si l'utilisateur a choisi tout
        const listeTypeDeQuestions = combinaisonListesSansChangerOrdre(typesDeQuestionsDisponibles, this.nbQuestions)
        */

    const listeTypeDeQuestions = gestionnaireFormulaireTexte({
      max: 5,
      defaut: 6,
      melange: 6,
      nbQuestions: this.nbQuestions,
      saisie: this.sup,
      shuffle: false
    })

    for (
      let i = 0, texte, texteCorr, cpt = 0, a, b, c, reponseAMC, n, choix; i < this.nbQuestions && cpt < 50;) {
      a = randint(2, 9)
      b = randint(2, 9, a)
      c = randint(2, 9, [a, b])
      switch (listeTypeDeQuestions[i]) {
        case 1: // 3 unités, 5 dixièmes et 8 centièmes
          texte = `${a} unités, ${b} dixièmes et ${c} centièmes`
          reponseAMC = calculANePlusJamaisUtiliser(a + b / 10 + c / 100)
          texteCorr = `$${a}+${texFractionFromString(b, 10)}+${texFractionFromString(c, 100)}=${texNombre(reponseAMC)}$`
          break
        case 2: // 3 unités et 5 centièmes
          texte = `${a} unités et ${c} centièmes`
          reponseAMC = calculANePlusJamaisUtiliser(a + c / 100)
          texteCorr = `$${a}+${texFractionFromString(c, 100)}=${texNombre(reponseAMC)}$`
          break
        case 3: // 5 dixièmes / centièmes ou millièmes
          choix = randint(1, 3)
          if (choix === 1) {
            texte = `${a} dixièmes`
            reponseAMC = calculANePlusJamaisUtiliser(a / 10)
            texteCorr = `$${texFractionFromString(a, 10)}=${texNombre(reponseAMC)}$`
          }
          if (choix === 2) {
            texte = `${a} centièmes`
            reponseAMC = calculANePlusJamaisUtiliser(a / 100)
            texteCorr = `$${texFractionFromString(a, 100)}=${texNombre(reponseAMC)}$`
          }
          if (choix === 3) {
            texte = `${a} millièmes`
            reponseAMC = calculANePlusJamaisUtiliser(a / 1000)
            texteCorr = `$${texFractionFromString(a, 1000)}=${texNombre(reponseAMC)}$`
          }
          break
        case 4: // 128/10
          n = a * 100 + b * 10 + c
          choix = randint(1, 3)
          if (choix === 1) {
            texte = `$${texFractionFromString(n, 10)}$`
            reponseAMC = calculANePlusJamaisUtiliser(n / 10)
            texteCorr = `$${texFractionFromString(n, 10)}=${texNombre(reponseAMC)}$`
          } else if (choix === 2) {
            texte = `$${texFractionFromString(n, 100)}$`
            reponseAMC = calculANePlusJamaisUtiliser(n / 100)
            texteCorr = `$${texFractionFromString(n, 100)}=${texNombre(reponseAMC)}$`
          } else {
            texte = `$${texFractionFromString(n, 1000)}$`
            reponseAMC = calculANePlusJamaisUtiliser(n / 1000)
            texteCorr = `$${texFractionFromString(n, 1000)}=${texNombre(reponseAMC)}$`
          }
          break
        case 5: // 8+5/100+7/100
          choix = randint(1, 2)
          if (choix === 1) {
            texte = `$${a}+${texFractionFromString(b, 100)}+${texFractionFromString(c, 100)}$`
            reponseAMC = calculANePlusJamaisUtiliser(a + (b + c) / 100)
            texteCorr = `$${a}+${texFractionFromString(b, 100)}+${texFractionFromString(c, 100)}=${a}+${texFractionFromString(b + c, 100)}=${texNombre(reponseAMC)}$`
          } else if (choix === 2) {
            texte = `$${a}+${texFractionFromString(b, 10)}+${texFractionFromString(c, 10)}$`
            reponseAMC = calculANePlusJamaisUtiliser(a + (b + c) / 10)
            texteCorr = `$${a}+${texFractionFromString(b, 10)}+${texFractionFromString(c, 10)}=${a}+${texFractionFromString(b + c, 10)}=${a}+${texNombre((b + c) / 10)}=${texNombre(reponseAMC)}$`
          }
          break
      }
      const choixDigit = randint(0, 1)
      setReponse(this, i, reponseAMC, {
        digits: nombreDeChiffresDe(reponseAMC) + randint(choixDigit, choixDigit + 1),
        decimals: nombreDeChiffresDansLaPartieDecimale(reponseAMC) + choixDigit,
        signe: false
      })
      if (this.interactif) {
        texte += ajouteChampTexteMathLive(this, i, 'largeur25 inline')
      }
      if (this.listeQuestions.indexOf(texte) === -1) {
        // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(texte)
        if (!context.isHtml && i === 0) {
          texteCorr = '\\setlength\\itemsep{2em}' + texteCorr
        } // espacement entre les questions
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
