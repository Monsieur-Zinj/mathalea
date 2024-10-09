/* eslint-disable camelcase */
import { point } from '../../lib/2d/points.js'
import { polygoneRegulierParCentreEtRayon } from '../../lib/2d/polygones.js'
import { longueur, segment } from '../../lib/2d/segmentsVecteurs.js'
import { latexParCoordonnees, latexParCoordonneesBox, texteParPoint } from '../../lib/2d/textes.ts'
import { homothetie, rotation, similitude } from '../../lib/2d/transformations.js'
import { choice } from '../../lib/outils/arrayOutils'
import { lettreMinusculeDepuisChiffre, sp } from '../../lib/outils/outilString.js'
import { contraindreValeur, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { calculer } from '../../modules/outilsMathjs.ts'
import Exercice from '../deprecatedExercice.js'
import { mathalea2d, colorToLatexOrHTML, vide2d, fixeBordures } from '../../modules/2dGeneralites.js'
import { ajouteChampTexteMathLive, remplisLesBlancs } from '../../lib/interactif/questionMathLive.js'
import { context } from '../../modules/context.js'
import * as pkg from '@cortex-js/compute-engine'
import FractionEtendue from '../../modules/FractionEtendue.ts'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard'
const { ComputeEngine } = pkg
export const interactifReady = true
export const interactifType = 'custom'
export const amcReady = true
export const amcType = 'AMCOpen'
let engine
if (context.versionMathalea) engine = new ComputeEngine()

/**
 * Travailler les tables de multiplication ou d'addition autrement
 * @author Jean-Claude Lhote
 */
export class Rose {
  constructor ({ values = [], nombreDeValeurs, rayon = 2, operation = 'addition', type = 'résultats', typeDonnees = 'entiers', cellulesPreremplies = Array.from('abcdefghi'), valeurMax = 10, indexInconnue = 999 }) {
    this.type = type
    this.operation = operation
    this.typeDonnees = typeDonnees
    this.nombreDeValeurs = nombreDeValeurs
    this.cellulesPreremplies = cellulesPreremplies
    this.rayon = rayon
    this.resultats = []
    this.valeurMax = valeurMax
    this.indexInconnue = indexInconnue

    if (values === undefined || values.length === 0) {
      while (this.valeurMax - 2 < this.nombreDeValeurs) {
        this.valeurMax++
      }
      const den = randint(2, this.valeurMax)
      for (let i = 0; i < this.nombreDeValeurs; i++) {
        switch (this.typeDonnees) {
          case 'entiers' :
            values.push(randint(2, this.valeurMax, values))
            this.rayon = 2
            break
          case 'entiers relatifs' :
            values.push(randint(-this.valeurMax, this.valeurMax, [0, 1, ...values]))
            this.rayon = 2
            break
          case 'litteraux' : {
            const value = calculer(`${randint(1, this.valeurMax)}x + ${randint(1, this.valeurMax)}`, null).printResult
            values.push(value)
            this.rayon = 3
          }
            break
          case 'fractions dénominateurs multiples':
            values.push(new FractionEtendue(randint(1, this.valeurMax), den).simplifie())
            this.rayon = 2.5
            break
          case 'fractions positives dénominateurs premiers':
            values.push(new FractionEtendue(randint(1, this.valeurMax), choice([2, 3, 5, 7])).simplifie())
            this.rayon = 2.5
            break

          case 'fractions positives' :
            values.push(new FractionEtendue(randint(1, this.valeurMax), randint(2, this.valeurMax)).simplifie())
            this.rayon = 2.5
            break
          case 'fractions relatives' :
            values.push(new FractionEtendue(randint(-this.valeurMax, this.valeurMax, 0), randint(2, this.valeurMax)).simplifie())
            this.rayon = 2.5
            break
        }
      }
    } else { // si elles sont définies, on complète éventuellement la grille aléatoirement.
      for (let i = this.values.length; i < this.nombreDeValeurs; i++) {
        switch (this.typeDonnees) {
          case 'entiers' :
            values.push(randint(2, this.valeurMax, values))
            break
          case 'entiers relatifs' :
            values.push(randint(-this.valeurMax, this.valeurMax, [0, 1, ...values]))
            break
          case 'litteraux' : {
            const value = calculer(`${randint(1, this.valeurMax)}x + ${randint(1, this.valeurMax)}`, null).printResult
            values.push(value)
          }
            break
          case 'fractions dénominateurs multiples':
            values.push(new FractionEtendue(randint(1, this.valeurMax), values[i - 1].d).simplifie())
            break
          case 'fractions positives dénominateurs premiers':
            values.push(new FractionEtendue(randint(1, this.valeurMax), choice([2, 3, 5, 7])).simplifie())
            break
          case 'fractions positives' :
            values.push(new FractionEtendue(randint(1, this.valeurMax), randint(2, this.valeurMax)).simplifie())
            break
          case 'fractions relatives' :
            values.push(new FractionEtendue(randint(-this.valeurMax, this.valeurMax, 0), randint(2, this.valeurMax)).simplifie())
            break
        }
      }
    }
    this.values = values
    this.calculeResultats()
  }

  // méthode qui calcule les résultats si on le veut (sinon on peut les renseigner dans this.resultats manuellement)
  calculeResultats () {
    for (let i = 0; i < this.nombreDeValeurs; i++) {
      this.resultats[i] = this.operate(this.values[i], this.values[(i + 1) % this.nombreDeValeurs])
    }
  }

  // fonction utilisée par calculeResultats
  operate (a, b) {
    switch (this.operation) {
      case 'addition':
        if (this.typeDonnees !== 'litteraux') {
          if (this.typeDonnees.substring(0, 4) === 'frac') {
            return a.sommeFraction(b) // math.fraction(math.add(a, b))
          } else {
            return a + b // math.add(a, b)
          }
        } else {
          return calculer(`${String(a).replace('\\times', '*')}+${String(b).replace('\\times', '*')}`, null).printResult
        }
      case 'multiplication':
        if (this.typeDonnees !== 'litteraux') {
          if (this.typeDonnees.substring(0, 4) === 'frac') {
            return a.produitFraction(b)
          } else {
            return a * b
          }
        } else {
          return calculer(`(${String(a).replace('\\times', '*')}) * (${String(b).replace('\\times', '*')})`, null).printResult
        }
    }
  }

  representation () {
    if (this.type === 'résultats') {
      this.rayonBoite = 1
    } else {
      if (this.typeDonnees.substring(0, 4) === 'frac') this.rayonBoite = 1.5
      else if (this.typeDonnees === 'litteraux') {
        if (this.operation === 'multiplication') this.rayonBoite = 3.2
        else this.rayonBoite = 2.5
      } else this.rayonBoite = 1
    }
    const objets = []
    const O = point(0, 0, '', '')
    const A = rotation(point(this.rayon, 0, '', ''), O, 180 / this.nombreDeValeurs - 90, 'A')
    for (let i = 0, bulle1, bulle2; i < this.nombreDeValeurs; i++) {
      const M = rotation(A, O, 360 * i / this.nombreDeValeurs, 'M')
      M.positionLabel = 'center'
      const B = similitude(M, O, 180 / this.nombreDeValeurs, 1.2, 'B')
      const D = similitude(M, O, -180 / this.nombreDeValeurs, 1.2, 'D')
      const C = homothetie(M, O, 1.5, 'C')
      const N = rotation(C, O, 360 / this.nombreDeValeurs, 'N')
      const P = similitude(M, O, 180 / this.nombreDeValeurs, 2.5, 'P')
      const s = segment(O, B, 'black')
      const t = segment(B, C, 'black')
      const u = segment(C, D, 'black')
      const M2 = homothetie(C, O, 0.6)// pointIntersectionDD(droite(B, D), droite(O, C), 'M2')
      const s1 = homothetie(segment(C, P), C, (longueur(C, P) - this.rayonBoite) / longueur(C, P))
      s1.styleExtremites = '->'
      s1.tailleExtremites = 5
      s1.pointilles = 2
      const s2 = homothetie(segment(N, P), N, (longueur(N, P) - this.rayonBoite) / longueur(N, P))
      s2.styleExtremites = '->'
      s2.tailleExtremites = 5
      s2.pointilles = 2
      if (this.type === 'can1') {
        bulle1 = vide2d() // rotation(boite({??????}), M, 180 / this.nombreDeValeurs - 90)
      } else {
        bulle1 = vide2d()
      }
      objets.push(bulle1)
      objets.push(s, t, u, s1, s2)
      bulle2 = rotation(polygoneRegulierParCentreEtRayon(P, this.rayonBoite, this.nombreDeValeurs), P, 360 / this.nombreDeValeurs - 90)
      if (this.type === 'résultats' || this.type === 'solutions' || this.type === 'can1' || this.type === 'can2') {
        if (!(this.type === 'can1' && (this.indexInconnue === i || i === (this.indexInconnue - 1) % this.nombreDeValeurs || i === (this.indexInconnue + 1) % this.nombreDeValeurs))) {
          if (!(this.type === 'can2' && (this.indexInconnue === i || i === (this.indexInconnue + 1) % this.nombreDeValeurs))) {
            if (this.typeDonnees !== 'litteraux' && this.typeDonnees.substring(0, 4) !== 'frac') {
              objets.push(texteParPoint(this.values[i], M, 0, 'black', 1, 'milieu', true))
            } else {
              if (this.typeDonnees !== 'litteraux') {
                if (this.values[i] instanceof FractionEtendue) {
                  objets.push(latexParCoordonnees(this.values[i].texFSD, M.x, M.y, 'black', 0, 0, 'none', 8))
                } else {
                  objets.push(texteParPoint(String(this.values[i]), M, 0, 'black', 1, 'milieu', true))
                }
              } else {
                objets.push(latexParCoordonneesBox(this.values[i], M2.x, M2.y, 'black', 50, 12, 'none', 8, { anchor: 'center' }))
              }
            }
          }
        }
        if (this.type === 'can1' && this.indexInconnue === i) {
          objets.push(texteParPoint(lettreMinusculeDepuisChiffre(i + 1), M))
        }
      }
      if (this.type === 'solutions' || this.type === 'valeurs' || this.type === 'can1' || this.type === 'can2') { // on ajoute les produits
        if (!(this.type === 'can2' && this.indexInconnue === i)) {
          if (this.typeDonnees !== 'litteraux' && this.typeDonnees.substring(0, 4) !== 'frac') {
            objets.push(texteParPoint((this.resultats[i]), P, 0, 'black', 1, 'milieu', true))
          } else {
            if (this.resultats[i] instanceof FractionEtendue) {
              objets.push(latexParCoordonnees(this.resultats[i].texFSD, P.x, P.y, 'black', 0, 0, 'none', 8))
            } else {
              objets.push(latexParCoordonnees(String(this.resultats[i]), P.x, P.y, 'black', 0, 0, 'none', 8))
            }
          }
        }
        if (this.type === 'can2' && this.indexInconnue === i) {
          objets.push(texteParPoint(lettreMinusculeDepuisChiffre(i + 1), P))
        } else {
          bulle2.color = colorToLatexOrHTML('black')
          if (this.type === 'valeurs') {
            objets.push(texteParPoint(lettreMinusculeDepuisChiffre(i + 1), M))
          }
        }
      } else {
        if (this.cellulesPreremplies[i] instanceof FractionEtendue) {
          objets.push(texteParPoint(this.cellulesPreremplies[i].texFSD, P, 0, 'black', 1, 'milieu', true))
        } else {
          objets.push(texteParPoint(this.cellulesPreremplies[i], P, 0, 'black', 1, 'milieu', true))
        }
      }

      objets.push(bulle2)
    }
    return objets
  }
}
export function ExoRose () {
  Exercice.call(this)
  this.spacing = 2
  this.tailleDiaporama = 1
  this.nbQuestions = 1
  this.sup = 10
  this.sup2 = 4
  this.sup3 = 1
  this.operation = 'multiplication'
  this.type = 'résultats'
  this.typeDonnees = 'entiers'
  this.nombreDeValeurs = 4
  this.valeurMax = 10
  this.roses = []
  this.clavier = KeyboardType.clavierDeBase

  this.indexInconnue = []
  this.nouvelleVersion = function () {
    this.valeurMax = contraindreValeur(10, 30, this.sup, 10)
    this.nombreDeValeurs = contraindreValeur(3, 9, this.sup2, 5)
    switch (this.sup3) {
      case 1:
        this.type = 'résultats'
        if (this.typeDonnees.substring(0, 4) === 'frac' || this.typeDonnees === 'litteraux') {
          if (this.nombreDeValeurs > 5) this.nombreDeValeurs = 5
        }
        break
      case 2:
        this.type = 'valeurs'
        break
      case 3:
        if (this.typeDonnees.substring(0, 4) === 'frac' || this.typeDonnees === 'litteraux') {
          if (this.nombreDeValeurs > 5) this.nombreDeValeurs = 5
        }
        this.type = 'can1'
        break
      case 4:
        this.type = 'can2'
        if (this.typeDonnees.substring(0, 4) === 'frac' || this.typeDonnees === 'litteraux') {
          if (this.nombreDeValeurs > 5) this.nombreDeValeurs = 5
        }
        break
    }

    if (this.typeDonnees === 'litteraux') {
      this.clavier = KeyboardType.clavierDeBaseAvecVariable
    } else if (this.typeDonnees.includes('frac')) {
      this.clavier = KeyboardType.clavierDeBaseAvecFraction
    } else {
      this.clavier = KeyboardType.clavierDeBase
    }

    for (
      let i = 0, objets, objetsCorr, texte, texteCorr, cpt = 0;
      i < this.nbQuestions && cpt < 50;

    ) {
      this.indexInconnue[i] = randint(0, this.nombreDeValeurs - 1)
      if (this.operation === 'multiplication') {
        this.introduction = 'Les nombres situés à l\'extrémité des flèches sont les produits des nombres dont les flèches sont issues.'
      } else {
        this.introduction = 'Les nombres situés à l\'extrémité des flèches sont les sommes des nombres dont les flèches sont issues.'
      }
      switch (this.type) {
        case 'résultats':
          if (this.operation === 'multiplication') {
            texte = 'Calculer les produits à l\'extrémité des flèches.<br>'
          } else {
            texte = 'Calculer les sommes à l\'extrémité des flèches.<br>'
          }
          break
        case 'valeurs':
          if (this.operation === 'multiplication') {
            texte = 'Retrouver les facteurs à l\'origine des flèches.<br>'
          } else {
            texte = 'Retrouver les termes à l\'origine des flèches.<br>'
          }
          break
        case 'can1':
          if (this.typeDonnees.includes('entiers')) {
            texte = `Trouver le nombre de la case ${lettreMinusculeDepuisChiffre(this.indexInconnue[i] + 1)}.<br>`
          } else {
            texte = `Trouver l'expression de la case ${lettreMinusculeDepuisChiffre(this.indexInconnue[i] + 1)}.<br>`
          }
          break
        case 'can2':
          if (this.typeDonnees.includes('entiers')) {
            texte = `Trouver le nombre de la case ${lettreMinusculeDepuisChiffre(this.indexInconnue[i] + 1)}.<br>`
          } else {
            texte = `Trouver l'expression de la case ${lettreMinusculeDepuisChiffre(this.indexInconnue[i] + 1)}.<br>`
          }
          break
      }

      this.roses[i] = new Rose({
        nombreDeValeurs: this.nombreDeValeurs,
        type: this.type,
        operation: this.operation,
        valeurMax: this.valeurMax,
        typeDonnees: this.typeDonnees,
        indexInconnue: this.indexInconnue[i]
      })
      objets = this.roses[i].representation()
      this.roses[i].type = 'solutions'
      objetsCorr = this.roses[i].representation()
      texte += mathalea2d(Object.assign({ scale: 0.6 }, fixeBordures(objets)), objets)
      if (this.interactif) {
        if (this.type.substring(0, 3) === 'can') {
          texte += ajouteChampTexteMathLive(this, i, 'nospacebefore largeur01 ' + this.clavier, { texteAvant: `${lettreMinusculeDepuisChiffre(this.indexInconnue[i] + 1)}=` })
        } else {
          let question = ''
          for (let k = 0; k < this.nombreDeValeurs; k++) {
            question += `${lettreMinusculeDepuisChiffre(k + 1)}=%{champ${k + 1}}${sp(3)}`
          }
          texte += remplisLesBlancs(this, i, question, this.clavier, '\\ldots')
        }
      }
      texteCorr = mathalea2d(Object.assign({ scale: 0.6 }, fixeBordures(objetsCorr)), objetsCorr)
      if (this.questionJamaisPosee(i, ...this.roses[i].values)) {
        // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        if (context.isAmc) {
          this.autoCorrection[i] = {
            enonce: this.introduction + '<br>' + texte,
            propositions: [
              {
                texte: '',
                statut: (this.type === 'can1' || this.type === 'can2') ? 1 : Math.ceil(this.sup2 / 4), // OBLIGATOIRE (ici c'est le nombre de lignes du cadre pour la réponse de l'élève sur AMC)
                sanscadre: false, // EE : ce champ est facultatif et permet (si true) de cacher le cadre et les lignes acceptant la réponse de l'élève
                pointilles: false // EE : ce champ est facultatif et permet (si true) de cacher le cadre et les lignes acceptant la réponse de l'élève
              }
            ]
          }
        }
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = ['Valeur maximale (entre 10 et 30) des facteurs', 30]
  this.besoinFormulaire2Numerique = ['Nombre de facteur entre 3 et 9 (limité à 5 pour les valeurs fractionnaires ou littérales)', 9]
  this.besoinFormulaire3Numerique = ['Type de questions', 4, '1 : Calculer les produits\n2 : Calculer les facteurs\n3 : Course aux nombres 1\n4 : Course aux nombres 2']

  this.correctionInteractive = i => {
    const taille = this.nombreDeValeurs
    const champsTexte = []
    const spanResultat = document.querySelector(`#resultatCheckEx${this.numeroExercice}Q${i}`)
    const saisies = []
    if (this.type.substring(0, 3) === 'can') {
      champsTexte[0] = document.getElementById(`champTexteEx${this.numeroExercice}Q${i}`)
      saisies[0] = champsTexte[0].value.replace(',', '.').replace(/\((\+?-?\d+)\)/, '$1')
    } else {
      const mfe = document.querySelector(`math-field#champTexteEx${this.numeroExercice}Q${i}`)
      for (let k = 0; k < taille; k++) {
        champsTexte[k] = mfe.getPromptValue(`champ${k + 1}`)
        saisies[k] = champsTexte[k].replace(',', '.').replace(/\((\+?-?\d+)\)/, '$1')
      }
    }
    let resultat
    if (this.saisieCoherente(saisies, taille, i)) {
      spanResultat.innerHTML = '😎'
      resultat = 'OK'
    } else {
      spanResultat.innerHTML = '☹️'
      resultat = 'KO'
    }
    return resultat
  }
  this.saisieCoherente = function (saisies, taille, question) {
    let resultatOK = true
    let stringSaisie = saisies[0]
    let stringResultat
    if (this.type === 'can2') {
      stringResultat = this.roses[question].typeDonnees.substring(0, 4) === 'frac'
        ? this.roses[question].resultats[this.indexInconnue[question]].toLatex().replace('dfrac', 'frac')
        : this.roses[question].resultats[this.indexInconnue[question]].toString()
      return engine.parse(stringResultat).isSame(engine.parse(stringSaisie))
    } else if (this.type === 'can1') {
      stringSaisie = saisies[0]
      stringResultat = this.roses[question].typeDonnees.substring(0, 4) === 'frac'
        ? this.roses[question].values[this.indexInconnue[question]].toLatex().replace('dfrac', 'frac')
        : this.roses[question].values[this.indexInconnue[question]].toString()
      return engine.parse(stringSaisie).isSame(engine.parse(stringResultat))
    } else {
      for (let i = 0; i < taille; i++) {
        stringSaisie = saisies[i]
        if (this.type === 'résultats') {
          stringResultat = this.roses[question].typeDonnees.substring(0, 4) === 'frac'
            ? this.roses[question].resultats[i].toLatex().replace('dfrac', 'frac')
            : this.roses[question].resultats[i].toString()
        } else {
          stringResultat = this.roses[question].typeDonnees.substring(0, 4) === 'frac'
            ? this.roses[question].resultats[i].toLatex().replace('dfrac', 'frac')
            : String(this.roses[question].resultats[i])
          stringSaisie = this.roses[question].typeDonnees.substring(0, 4) === 'frac'
            ? `${saisies[i]}${this.roses[question].operation === 'addition' ? '+' : '\\times '}${saisies[(i + 1) % this.nombreDeValeurs]}`
            : String(this.roses[question].operate(saisies[i], saisies[(i + 1) % this.nombreDeValeurs]))
        }
        resultatOK = resultatOK && engine.parse(stringSaisie).isEqual(engine.parse(stringResultat))
      }
      return resultatOK
    }
  }
}
