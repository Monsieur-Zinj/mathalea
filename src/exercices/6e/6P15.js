import Decimal from 'decimal.js'
import { Tableau } from '../../lib/2d/tableau.js'
import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { nombreDeChiffresDansLaPartieEntiere } from '../../lib/outils/nombres'
import { numAlpha } from '../../lib/outils/outilString.js'
import { stringNombre, texNombre } from '../../lib/outils/texNombre'
import { fixeBordures, mathalea2d } from '../../modules/2dGeneralites.js'
import { context } from '../../modules/context.js'
import FractionEtendue from '../../modules/FractionEtendue.ts'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import Exercice from '../deprecatedExercice.js'
import { setReponse } from '../../lib/interactif/gestionInteractif.js'

export const titre = 'Calculer le coefficient de proportionnalité'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'
export const dateDePublication = '18/03/2023'

export const uuid = '2d5eb'
export const ref = '6P15'
export const refs = {
  'fr-fr': ['6P15'],
  'fr-ch': ['9FA3-2']
}
/**
 * @author jean-claude Lhote
 * @constructor
 */
export default function CalculerCoeffPropo () {
  Exercice.call(this)
  this.sup = 1
  this.spacing = 2
  this.spacingCorr = 3
  this.nbQuestions = 5
  this.besoinFormulaireNumerique = ['Type de coefficient', 4, '1 : Entier\n2 : Decimal\n3 : Fraction\n4 : Mélange']
  this.nouvelleVersion = function () {
    const isBetterWithLinearity = function (nombres) {
      const [a, b, c] = nombres
      if (a % b === 0 || a % c === 0 || b % c === 0 || b % a === 0 || c % a === 0 || c % b === 0) return true
      if (a + b === c || a + c === b || b + c === a) return true
      if (a - b === c || a - c === b || b - c === a || b - a === c || c - a === c || c - b === a) return true
      if (2 * a - 3 * b === 0 || 2 * a - 3 * c === 0 || 2 * b - 3 * c === 0 || 3 * a - 2 * b === 0 || 3 * a - 2 * c === 0 || 3 * b - 2 * c === 0) return true
      return false
    }
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []
    const typeDeCoefficient = ['Entier', 'Decimal', 'Fraction']
    let listeTypesDeCoefficient = []
    const tableauxEntiers = [[2, 3, 4, 5, 6, 7, 8, 9], [10, 12, 15, 16], [20, 24, 25, 30, 35, 40], [50, 60, 70, 80, 90]]
    const tableauxCoefficientsEntiers = [[2, 4, 6, 8, 10], [3, 5, 7, 9, 80, 90], [11, 5, 19, 15, 25, 50, 75], [12, 15, 20, 25, 30, 40]]
    const tableauxCoefficientsFractions = [[[2, 5], [3, 4], [2, 3], [2, 7]], [[3, 7], [4, 7], [4, 9], [5, 9]], [[7, 3], [8, 3], [3, 2], [7, 2]], [[9, 4], [7, 8], [8, 7], [9, 5]]]
    // @todo prévoir un tableau de choix des fractions plutôt que d'aléatoiriser leur construction

    if (this.sup === 4) listeTypesDeCoefficient = combinaisonListes(typeDeCoefficient, this.nbQuestions)
    else listeTypesDeCoefficient = combinaisonListes([typeDeCoefficient[this.sup - 1]], this.nbQuestions)
    for (let i = 0, texte, texteCorr; i < this.nbQuestions; i++) {
      if (context.isAmc) this.autoCorrection[i] = {}
      // Je suis en js, je fais du typage inline JsDoc pratique pour récupérer l'autocomplétion
      /** @type number | Decimal | FractionEtendue */
      let coefficient
      /** @type Array<{ nombre: number, visible: boolean }> */
      const premiereLigne = []
      /** @type Array<{ nombre: number, visible: boolean }> */
      const deuxiemeLigne = []
      const colonneReference = randint(0, 2) // La colonne qui contiendra deux valeurs visibles pour faire le calcul
      do {
        switch (listeTypesDeCoefficient[i]) {
          case 'Entier': // On choisit un coefficient dans les listes => tout est entier
            coefficient = choice(tableauxCoefficientsEntiers[i % 4])
            for (let colonne = 0; colonne < 3; colonne++) {
              const contenuVisible = choice([true, false])
              premiereLigne[colonne] = {
                nombre: choice(choice(tableauxEntiers), premiereLigne.map(elt => elt.nombre)),
                visible: colonne === colonneReference ? true : contenuVisible
              }
              deuxiemeLigne[colonne] = {
                nombre: premiereLigne[colonne].nombre * coefficient,
                visible: colonne === colonneReference ? true : !contenuVisible
              }
            }
            break
          case 'Decimal': // On construit un coefficient... on pourrait le choisir dans une liste
            coefficient = new Decimal(randint(1, 9) + randint(0, 2) * 10).div(10)
            for (let colonne = 0; colonne < 3; colonne++) {
              const contenuVisible = choice([true, false])
              premiereLigne[colonne] = {
                nombre: choice(choice(tableauxEntiers), premiereLigne.map(elt => elt.nombre)),
                visible: colonne === colonneReference ? true : contenuVisible
              }
              deuxiemeLigne[colonne] = {
                nombre: coefficient.mul(premiereLigne[colonne].nombre),
                visible: colonne === colonneReference ? true : !contenuVisible
              }
            }
            break
          case 'Fraction': { // construction de la fraction => prévoir une liste simplifiera le code
            let allNumberAreGood
            do {
              allNumberAreGood = true
              const [numerateur, denominateur] = choice(choice(tableauxCoefficientsFractions))
              coefficient = new FractionEtendue(numerateur, denominateur)
              for (let colonne = 0; colonne < 3; colonne++) {
                const contenuVisible = choice([true, false])
                let unNombre
                let antiBoucleInfinie = 0
                do { // On choisit un nombre à multiplier par une fraction => on veut un résultat entier obligatoirement !
                  unNombre = choice(choice(tableauxEntiers), premiereLigne.map(elt => elt.nombre))
                  antiBoucleInfinie++
                } while (!coefficient.multiplieEntier(unNombre).estEntiere && antiBoucleInfinie < 20)
                if (antiBoucleInfinie === 20) allNumberAreGood = false
                premiereLigne[colonne] = {
                  nombre: unNombre,
                  visible: colonne === colonneReference ? true : contenuVisible
                }
                deuxiemeLigne[colonne] = {
                  nombre: premiereLigne[colonne].nombre * coefficient,
                  visible: colonne === colonneReference ? true : !contenuVisible
                }
              }
            } while (!allNumberAreGood)
            break
          }
        }
      } while (isBetterWithLinearity(premiereLigne.map(elt => elt.nombre)))
      const coefficientRationnel = coefficient instanceof FractionEtendue
      const coefficientDecimal = coefficient instanceof Decimal
      const coefficientTex = coefficientRationnel ? coefficient.texFraction : stringNombre(coefficient)
      // remplissage du tableau énoncé et correction.
      const ligne1 = [{ texte: 'Grandeur A' }].concat(premiereLigne.map(elt => {
        return elt.visible ? { texte: stringNombre(elt.nombre), math: true } : { texte: '...' }
      }))
      const ligne2 = [{ texte: 'Grandeur B' }].concat(deuxiemeLigne.map(elt => {
        return elt.visible ? { texte: stringNombre(elt.nombre), math: true } : { texte: '...' }
      }))
      const monTableau = listeTypesDeCoefficient[i] === 'Fraction'
        ? new Tableau({
          largeurTitre: 6,
          largeur: 3,
          hauteur: 2,
          nbColonnes: 4,
          ligne1,
          ligne2,
          flecheDroite: { texte: '\\times \\ldots', latex: true },
          flecheDroiteSens: 'bas',
          flecheGauche: { texte: '\\times \\ldots', latex: true },
          flecheGaucheSens: 'haut'
        })
        : new Tableau({
          largeurTitre: 6,
          largeur: 3,
          hauteur: 2,
          nbColonnes: 4,
          ligne1,
          ligne2,
          flecheDroite: { texte: '×...' },
          flecheDroiteSens: 'bas'
        })
      const ligne1Corr = [{ texte: 'Grandeur A' }].concat(premiereLigne.map(elt => {
        return { texte: stringNombre(elt.nombre), math: true }
      }))
      const ligne2Corr = [{ texte: 'Grandeur B' }].concat(deuxiemeLigne.map(elt => {
        return { texte: stringNombre(elt.nombre), math: true }
      }))
      const monTableauCorr = listeTypesDeCoefficient[i] === 'Fraction'
        ? new Tableau({
          largeurTitre: 7,
          largeur: 3,
          hauteur: 2,
          nbColonnes: 4,
          ligne1: ligne1Corr,
          ligne2: ligne2Corr,
          flecheDroite: { texte: `\\times ${coefficientTex}`, latex: true },
          flecheDroiteSens: 'bas',
          flecheGauche: { texte: `\\times ${coefficient.inverse().texFraction}`, latex: true },
          flecheGaucheSens: 'haut'
        })
        : new Tableau({
          largeurTitre: 7,
          largeur: 3,
          hauteur: 2,
          nbColonnes: 4,
          ligne1: ligne1Corr,
          ligne2: ligne2Corr,
          flecheDroite: { texte: `× ${coefficientTex}`, math: true },
          flecheDroiteSens: 'bas'
        })
      texte = 'Le tableau ci-dessous représente une situation de proportionnalité.<br>'
      texte += numAlpha(0) + 'Calculer le coefficient de proportionnalité.<br>'
      texte += numAlpha(1) + 'Compléter le tableau de proportionnalité.<br>'
      // dessin du tableau selon le contexte
      // définition d'un objet pour les réponses attendues
      const reponsesAttendue = { reponse1: {}, reponse2: {} }
      for (let colonne = 1, rep = 1; colonne < 4; colonne++) {
        if (colonne !== colonneReference + 1) {
          reponsesAttendue[`reponse${rep.toString()}`] = {
            lettre: premiereLigne[colonne - 1].visible ? 'B' : 'A',
            colonne,
            reponse: premiereLigne[colonne - 1].visible
              ? {
                  valeur: deuxiemeLigne[colonne - 1].nombre,
                  digits: 4
                }
              : { valeur: premiereLigne[colonne - 1].nombre, digits: 2 }
          }
          rep++
        }
      }
      if (context.isHtml) { // Pour HTML on utilise mathalea2d
        texte += mathalea2d(Object.assign({}, fixeBordures([monTableau])), monTableau)
        if (this.interactif) {
          texte += 'Coefficient de proportionnalité de A à B : ' + ajouteChampTexteMathLive(this, 3 * i, 'largeur15 inline')
          setReponse(this, 3 * i, coefficient, { formatInteractif: coefficientRationnel ? 'fractionEgale' : 'calcul' })
          texte += `<br>Valeur de la grandeur ${reponsesAttendue.reponse1.lettre} pour la colonne ${reponsesAttendue.reponse1.colonne} :`
          texte += ajouteChampTexteMathLive(this, 3 * i + 1, 'largeur15 inline')
          setReponse(this, 3 * i + 1, reponsesAttendue.reponse1.reponse.valeur, { formatInteractif: 'calcul' })
          texte += `<br>Valeur de la grandeur ${reponsesAttendue.reponse2.lettre} pour la colonne ${reponsesAttendue.reponse2.colonne} :`
          texte += ajouteChampTexteMathLive(this, 3 * i + 2, 'largeur15 inline')
          setReponse(this, 3 * i + 2, reponsesAttendue.reponse2.reponse.valeur, { formatInteractif: 'calcul' })
        }
      } else { // pour LAtex, c'est profCollege dans le texte
        texte += '\n\\Propor[Math,Stretch=2,largeur=15]{'
        for (let colonne = 0; colonne < 3; colonne++) {
          texte += `${ligne1[colonne + 1].texte.replace('...', '\\ldots')}/`
          texte += `${ligne2[colonne + 1].texte.replace('...', '\\ldots')}`
          if (colonne < 2) texte += ','
          else texte += '}\n'
        }
        texte += '\n\\FlechesPD{1}{2}{$\\times$\\ldots}\n'
        if (context.isAmc) {
          this.autoCorrection[i] = {
            enonce: texte,
            options: { multicols: true, barreseparation: true }, // facultatif. Par défaut, multicols est à false. Ce paramètre provoque un multicolonnage (sur 2 colonnes par défaut) : pratique quand on met plusieurs AMCNum. !!! Attention, cela ne fonctionne pas, nativement, pour AMCOpen. !!!
            propositions: [
              {
                type: 'AMCNum',
                propositions: [{
                  texte: '',
                  statut: '',
                  reponse: { // coefficient
                    texte: 'valeur du coefficient',
                    valeur: [coefficient],
                    param: coefficientDecimal
                      ? {
                          digits: 3,
                          decimal: 2,
                          signe: false,
                          approx: 0
                        }
                      : coefficientRationnel
                        ? {
                            digitsNum: nombreDeChiffresDansLaPartieEntiere(deuxiemeLigne[colonneReference].nombre),
                            digitsDen: nombreDeChiffresDansLaPartieEntiere(premiereLigne[colonneReference].nombre),
                            digits: nombreDeChiffresDansLaPartieEntiere(deuxiemeLigne[colonneReference].nombre) + nombreDeChiffresDansLaPartieEntiere(premiereLigne[colonneReference].nombre),
                            approx: 0//,
                            // aussiCorrect: new FractionEtendue(deuxiemeLigne[colonneReference].nombre, premiereLigne[colonneReference].nombre)
                          }
                        : {
                            digits: 2,
                            decimals: 0,
                            signe: false,
                            approx: 0
                          }
                  }
                }]
              },
              {
                type: 'AMCNum',
                propositions: [{
                  texte: '',
                  statut: '',
                  reponse: {
                    texte: `Réponse de la ligne ${reponsesAttendue.reponse1.lettre} colonne ${reponsesAttendue.reponse1.colonne} :`,
                    valeur: [reponsesAttendue.reponse1.reponse.valeur],
                    param: {
                      digits: reponsesAttendue.reponse1.reponse.digits,
                      decimals: 0,
                      signe: false,
                      approx: 0
                    }
                  }
                }]
              },
              {
                type: 'AMCNum',
                propositions: [{
                  texte: '',
                  statut: '',
                  reponse: {
                    texte: `Réponse de la ligne ${reponsesAttendue.reponse2.lettre} colonne ${reponsesAttendue.reponse2.colonne} :`,
                    valeur: [reponsesAttendue.reponse2.reponse.valeur],
                    param: {
                      digits: reponsesAttendue.reponse2.reponse.digits,
                      decimals: 0,
                      signe: false,
                      approx: 0
                    }
                  }
                }]
              }
            ]
          }
        }
      }
      texteCorr = numAlpha(0) +
                `Le coefficient de proportionnalité est donné par le quotient de $${texNombre(deuxiemeLigne[colonneReference].nombre)}$
 par $${texNombre(premiereLigne[colonneReference].nombre)}$.<br>Soit $\\dfrac{${texNombre(deuxiemeLigne[colonneReference].nombre)}}{${texNombre(premiereLigne[colonneReference].nombre)}}`
      if (coefficientRationnel) {
        const quotient = new FractionEtendue(deuxiemeLigne[colonneReference].nombre, premiereLigne[colonneReference].nombre)
        if (!quotient.estIrreductible) {
          texteCorr += `= ${coefficient.texFraction}$.<br>`
        } else {
          texteCorr += '$.<br>'
        }
      } else {
        texteCorr += `= ${texNombre(coefficient)}$.<br>`
      }
      for (let colonne = 1; colonne < 4; colonne++) { // La première colonne ici c'est la colonne des entêtes
        if (premiereLigne[colonne - 1].visible && colonne !== colonneReference + 1) { // on a la première valeur, on calcule donc la deuxième
          texteCorr += `Pour la colonne ${colonne}, on calcule : $${ligne1Corr[colonne].texte}\\times ${coefficientTex}=`
          if (coefficientRationnel) {
            texteCorr += `\\dfrac{${ligne1Corr[colonne].texte}\\times ${coefficient.num}}{${coefficient.den}}=`
          }
          texteCorr += `${ligne2Corr[colonne].texte}$.`
        } else {
          if (colonne !== colonneReference + 1) {
            texteCorr += `Pour la colonne ${colonne}, on calcule : $${ligne2Corr[colonne].texte}${coefficientRationnel ? '\\times' + coefficient.inverse().texFraction : '\\div' + coefficientTex}=`
            if (coefficientRationnel) {
              texteCorr += `\\dfrac{${ligne2Corr[colonne].texte}\\times ${coefficient.den}}{${coefficient.num}}=`
            }
            texteCorr += `${ligne1Corr[colonne].texte}$.`
          }
        }
        if (colonne < 4 && colonne !== colonneReference + 1) texteCorr += '<br>'
      }
      // dessin du tableau selon le contexte
      if (context.isHtml) { // Pour HTML on utilise mathalea2d
        texteCorr += mathalea2d(Object.assign({}, fixeBordures([monTableauCorr])), monTableauCorr)
      } else { // pour LAtex, c'est profCollege dans le texte
        texteCorr += '\\Propor[Math,\nStretch=2,\nlargeur=1.5]{'
        for (let colonne = 0; colonne < 3; colonne++) {
          texteCorr += `$${ligne1Corr[colonne + 1].texte}$/`
          texteCorr += `$${ligne2Corr[colonne + 1].texte}$`
          if (colonne < 2) texteCorr += ','
          else texteCorr += '}\n'
        }
        if (coefficientRationnel) {
          texteCorr += `\\FlechesPG{2}{1}{$\\times ${coefficient.inverse().texFraction}$}\n`
        }
        texteCorr += `\\FlechesPD{1}{2}{$\\times ${coefficientTex}$}`
        if (context.isAmc) {
          this.autoCorrection[i].propositions[0].propositions[0].texte = texteCorr
        }
      }
      if (this.questionJamaisPosee(i, ...premiereLigne.map(elt => elt.nombre), ...deuxiemeLigne.map(elt => elt.nombre))) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
      }
    }
    listeQuestionsToContenu(this)
  }
}
