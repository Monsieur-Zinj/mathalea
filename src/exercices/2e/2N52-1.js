import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { texteEnCouleur } from '../../lib/outils/embellissements'
import { ecritureAlgebrique, ecritureParentheseSiNegatif, reduireAxPlusB } from '../../lib/outils/ecritures'
import Exercice from '../deprecatedExercice.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { fraction, obtenirListeFractionsIrreductiblesFaciles } from '../../modules/fractions.js'
import { ajouteChampTexteMathLive, ajouteFeedback } from '../../lib/interactif/questionMathLive'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import engine from '../../lib/interactif/comparisonFunctions'
import { sp } from '../../lib/outils/outilString'
export const titre = 'Résoudre les équations produit-nul'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '06/02/2021'

/**
 * Résoudre des équations (ax+b)(cx+d)=0
* @author Stéphane Guyon & Jean-claude Lhote
*/
export const uuid = '53762'
export const ref = '2N52-1'
export const refs = {
  'fr-fr': ['2N52-1'],
  'fr-ch': ['11FA10-2']
}
export default function EquationsProduitsNuls2 () {
  Exercice.call(this)
  this.titre = titre
  this.nbCols = 1
  this.nbColsCorr = 1
  this.spacing = 1
  this.spacingCorr = 1
  this.nbQuestions = 3
  this.sup = 1
  this.spacingCorr = 3
  this.nbQuestions = 2
  this.correctionDetailleeDisponible = true
  this.correctionDetaillee = true

  function verifReponse (exo, question, variable) {
    const saisieElt = document.querySelector(`#champTexteEx${exo.numeroExercice}Q${question}`)
    const objetReponse = Object.fromEntries(variable)
    const reponse = objetReponse.reponse.value.replace(';', ' ').replaceAll('dfrac', 'frac') // on remplace le ; par un espace pour que la regex fonctionne
    let feedback = ''
    let isOk = true
    const sols = /^{(\S*)\s?(\S*)}$/g.exec(reponse)
    if (sols[2] === '' && saisieElt.value.includes(';')) {
      feedback += 'Il n\'y a qu\'une seule solution.<br>'
    }
    let saisie = saisieElt.value.replace(';', ' ').replace('\\{', '{').replace('\\}', '}')
    if (saisie[0] !== '{' || saisie[saisie.length - 1] !== '}') {
      feedback += 'Les solutions doivent être données sous la forme d\'un ensemble.<br>'
      // On rend la saisie propre pour la régex
      if (saisie[0] !== '{') saisie = '{' + saisie
      if (saisie[saisie.length - 1] !== '}') saisie += '}'
    }
    let valeursSaisies
    if (sols[2] === '') {
      // il n'y a qu'une solution
      if (/\s/.exec(saisie) != null) {
        valeursSaisies = /^{(\S*)\s(\S*)}$/g.exec(saisie)
        if (valeursSaisies[1] !== valeursSaisies[2]) return { resultat: 'KO', feedback, score: { nbBonnesReponses: 0, nbReponses: 1 } }
      } else valeursSaisies = /^{(.*)}$/g.exec(saisie)
      const valeur = valeursSaisies[1] ?? '99999999' // Si il n'y a pas de valeur saisie on met un truc improbable pour la comparaison
      isOk = engine.parse(valeur).isEqual(engine.parse(sols[1]))
    } else {
      // il y a deux solutions
      valeursSaisies = /^{(\S*)\s*(\S*)}$/g.exec(saisie)
      if (valeursSaisies == null) return { resultat: 'KO', feedback, score: { nbBonnesReponses: 0, nbReponses: 1 } }
      if (valeursSaisies.length < 3) {
        feedback += 'Il y a deux solutions.<br>'
        isOk = false
        const val1 = engine.parse(valeursSaisies[1] ?? '99999999')
        if (val1.isEqual(engine.parse(sols[1])) || val1.isEqual(engine.parse(sols[2]))) feedback += 'La solution donnée est correcte mais ce n\'est pas la seule.<br>'
      } else {
        const val1 = engine.parse(valeursSaisies[1] ?? '9999999')
        const val2 = engine.parse(valeursSaisies[2] ?? '9999999')
        const sol1 = engine.parse(sols[1])
        const sol2 = engine.parse(sols[2])
        const isOk1 = val1.isEqual(sol1) || val1.isEqual(sol2)
        const isOk2 = val2.isEqual(sol1) || val2.isEqual(sol2)
        const isOk3 = !val2.isEqual(val1)
        isOk = isOk1 && isOk2 && isOk3
        if (!isOk) {
          if (!isOk3) feedback += 'Il y a deux solutions différentes à donner.<br>'
          if (!isOk1) feedback += 'La première solution donnée est fausse.<br>'
          if (!isOk2) feedback += 'La deuxième solution donnée est fausse.<br>'
        } else {
          if (val1.N().value > val2.N().value) feedback += 'Les solutions seraient mieux dans l\'ordre croissant.<br>'
        }
      }
    }
    const spanResult = document.querySelector(`#resultatCheckEx${exo.numeroExercice}Q${question}`)
    if (spanResult != null) spanResult.textContent = isOk ? '😎' : '☹️'
    spanResult.style.fontSize = 'large'
    saisieElt.readOnly = true
    return { resultat: isOk ? 'OK' : 'KO', feedback, score: { nbBonnesReponses: isOk ? 1 : 0, nbReponses: 1 } }
  }

  this.nouvelleVersion = function () {
    this.consigne = 'Résoudre dans $\\mathbb R$ ' + (this.nbQuestions !== 1 ? 'les équations suivantes' : 'l\'équation suivante') + '.'
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    let typesDeQuestionsDisponibles = []
    if (this.sup < 4) {
      typesDeQuestionsDisponibles = [parseInt(this.sup)]
    } else {
      typesDeQuestionsDisponibles = [1, 2, 3]
    }

    const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions)
    for (let i = 0, texte, texteCorr, cpt = 0, typesDeQuestions; i < this.nbQuestions && cpt < 50;) {
      typesDeQuestions = listeTypeDeQuestions[i]
      const a = randint(-9, 9, 0)
      const b = randint(-9, 9, 0)
      const c = randint(-9, 9, [0, a])
      const d = randint(1, 9, [0, b])
      const fractions = obtenirListeFractionsIrreductiblesFaciles()
      const index = randint(0, fractions.length - 1)
      let f1 = fractions[index].multiplieEntier(choice([-1, 1]))
      const index2 = randint(0, fractions.length - 1, index)
      let f2 = fractions[index2].multiplieEntier(choice([-1, 1]))
      let f3, f4
      let reponse

      switch (typesDeQuestions) {
        case 1:
          texte = `$(${reduireAxPlusB(a, b)})(${reduireAxPlusB(c, d)})=0$`
          texteCorr = `On reconnaît une équation produit-nul, donc on applique la propriété :<br>
                    ${texteEnCouleur('Un produit est nul si et seulement si au moins un de ses facteurs est nul.')}<br>`
          texteCorr += texte + '<br>' // optimisation du code
          texteCorr += `$\\iff ${reduireAxPlusB(a, b)}=0$ ou $${reduireAxPlusB(c, d)}=0$<br>`
          if (this.correctionDetaillee) { // on ajoute les étapes de résolution si la correction détaillée est cochée.
            texteCorr += `$\\iff ${reduireAxPlusB(a, 0)}=${-b}$ ou $ ${reduireAxPlusB(c, 0)}=${-d}$<br>`
          }
          f1 = fraction(-b, a)
          f2 = fraction(-d, c)
          texteCorr += `$\\iff x=${f1.texFraction}$ ou $ x=${f2.texFraction}$<br>On en déduit :  `
          if (-b / a > -d / c) {
            texteCorr += `$S=\\left\\{${f2.texFractionSimplifiee};${f1.texFractionSimplifiee}\\right\\}$`
            reponse = { value: `{${f2.texFractionSimplifiee};${f1.texFractionSimplifiee}}` }
          } else if (-b / a < -d / c) {
            texteCorr += `$S=\\left\\{${f1.texFractionSimplifiee};${f2.texFractionSimplifiee}\\right\\}$`
            reponse = { value: `{${f1.texFractionSimplifiee};${f2.texFractionSimplifiee}}` }
          } else {
            texteCorr += `$S=\\left\\{${f1.texFractionSimplifiee}\\right\\}$`
            reponse = { value: `{${f1.texFractionSimplifiee}}` }
          }
          break
        case 2:
          f3 = f1.inverse().multiplieEntier(-b)
          f4 = f2.inverse().multiplieEntier(-d)
          texte = `$(${f1.texFraction}x${ecritureAlgebrique(b)})(${f2.texFraction}x${ecritureAlgebrique(d)})=0$`
          texteCorr = `On reconnaît une équation produit-nul, donc on applique la propriété :<br>
                    ${texteEnCouleur('Un produit est nul si et seulement si au moins un de ses facteurs est nul.')}<br>
                    $(${f1.texFraction}x${ecritureAlgebrique(b)})(${f2.texFraction}x${ecritureAlgebrique(d)})=0$<br>`
          texteCorr += `$\\iff ${f1.texFraction}x${ecritureAlgebrique(b)}=0$ ou $${f2.texFraction}x${ecritureAlgebrique(d)}=0$<br>`
          if (this.correctionDetaillee) {
            texteCorr += `$\\iff ${f1.texFraction}x=${-b}$ ou $${f2.texFraction}x=${-d}$<br>`
            texteCorr += `$\\iff x=${-b}\\div ${f1.texFraction}$ ou $x=${-d}\\div ${f2.texFraction}$<br>`
            texteCorr += `$\\iff x=${-b}\\times ${f1.inverse().texFraction}$ ou $x=${-d}\\times ${f2.inverse().texFraction}$<br>`
          }
          texteCorr += `$\\iff x=${f3.texFractionSimplifiee}$ ou $ x=${f4.texFractionSimplifiee}$<br>
                     On en déduit :  `
          if (f3.differenceFraction(f4).s > 0) {
            texteCorr += `$S=\\left\\{${f4.texFractionSimplifiee};${f3.texFractionSimplifiee}\\right\\}$`
            reponse = { value: `{${f4.texFractionSimplifiee};${f3.texFractionSimplifiee}}` }
          } else if (f3.differenceFraction(f4).s < 0) {
            texteCorr += `$S=\\left\\{${f3.texFractionSimplifiee};${f4.texFractionSimplifiee}\\right\\}$`
            reponse = { value: `{${f3.texFractionSimplifiee};${f4.texFractionSimplifiee}}` }
          } else {
            texteCorr += `$S=\\left\\{${f3.texFractionSimplifiee}\\right\\}$`
            reponse = { value: `{${f3.texFractionSimplifiee}}` }
          }

          break
        case 3: // (ax+f1)(bx+f2)=0
          f3 = f1.entierDivise(-a)
          f4 = f2.entierDivise(-b)
          texte = `$(${reduireAxPlusB(a, 0)}${f1.texFractionSignee})(${reduireAxPlusB(b, 0)}${f2.texFractionSignee})=0$`
          texteCorr = `On reconnaît une équation produit-nul, donc on applique la propriété :<br>
                        ${texteEnCouleur('Un produit est nul si et seulement si au moins un de ses facteurs est nul.')}<br>
                        $(${reduireAxPlusB(a, 0)}${f1.texFractionSignee})(${reduireAxPlusB(b, 0)}${f2.texFractionSignee})=0$<br>`
          texteCorr += `$\\iff ${reduireAxPlusB(a, 0)}${f1.texFractionSignee}=0$ ou $${reduireAxPlusB(b, 0)}${f2.texFractionSignee}=0$<br>`
          if (this.correctionDetaillee) {
            texteCorr += `$\\iff ${reduireAxPlusB(a, 0)}=${f1.multiplieEntier(-1).texFraction}$ ou $${reduireAxPlusB(b, 0)}=${f2.multiplieEntier(-1).texFraction}$<br>`
            texteCorr += `$\\iff x=${f1.multiplieEntier(-1).texFraction}\\div ${ecritureParentheseSiNegatif(a)}$ ou $x=${f2.multiplieEntier(-1).texFraction}\\div ${ecritureParentheseSiNegatif(b)}$<br>`
            texteCorr += `$\\iff x=${f1.multiplieEntier(-1).texFraction}\\times ${fraction(1, a).texFSP}$ ou $x=${f2.multiplieEntier(-1).texFraction}\\times ${fraction(1, b).texFSP}$<br>`
          }
          texteCorr += `$\\iff x=${f3.texFractionSimplifiee}$ ou $ x=${f4.texFractionSimplifiee}$<br>
                         On en déduit :  `
          if (f3.differenceFraction(f4).s > 0) {
            texteCorr += `$S=\\left\\{${f4.texFractionSimplifiee};${f3.texFractionSimplifiee}\\right\\}$`
            reponse = { value: `{${f4.texFraction};${f3.texFraction}}` }
          } else if (f3.differenceFraction(f4).s < 0) {
            texteCorr += `$S=\\left\\{${f3.texFractionSimplifiee};${f4.texFractionSimplifiee}\\right\\}$`
            reponse = { value: `{${f3.texFractionSimplifiee};${f4.texFractionSimplifiee}}` }
          } else {
            texteCorr += `$S=\\left\\{${f3.texFractionSimplifiee}\\right\\}$`
            reponse = { value: `{${f3.texFractionSimplifiee}}` }
          }
          break
      }
      texte += sp(4) + ajouteChampTexteMathLive(this, i, 'inline lycee nospacebefore largeur01', { texteAvant: ' $S=$' })
      texte += ajouteFeedback(this, i)
      handleAnswers(this, i, { reponse, callback: verifReponse }, { formatInteractif: 'calcul' })
      if (this.questionJamaisPosee(i, a, b, c, d, ...fractions)) {
        // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = ['Niveau de difficulté', 5, '1 : (ax+b)(cx+d)=0 a,b,c et d entiers\n 2 : (ax+b)(cx+d)=0 a et c rationnels\n 3 : (ax+b)(cx+d)=0 b et d rationnels\n4 : Mélange des cas précédents']
}
