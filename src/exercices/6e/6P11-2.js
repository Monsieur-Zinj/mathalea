import { prenom } from '../../lib/outils/Personne.js'
import { texMasse, texPrix } from '../../lib/outils/style.js'
import { stringNombre, texNombre } from '../../lib/outils/texNombre.js'
import { tableau } from '../../modules/2d.js'
import { fixeBordures, mathalea2d } from '../../modules/2dGeneralites.js'
import { context } from '../../modules/context.js'
import { setReponse } from '../../modules/gestionInteractif.js'
import { ajouteChampTexteMathLive } from '../../modules/interactif/questionMathLive.js'
import { Decimal } from 'decimal.js'
import {
  choice,
  combinaisonListes,
  listeQuestionsToContenu,
  randint,
  sp
} from '../../modules/outils.js'
import Exercice from '../Exercice.js'

export const titre = 'Résoudre des problèmes de proportionnalité avec la linéarité (avec ou sans un tableau)'
export const interactifReady = true
export const interactifType = 'mathLive'

export const dateDeModifImportante = '30/04/2023' // EE : Rajout de 2 paramètres

/**
 * Résoudre un problème de proportionnalité avec linéarité via tableau
 * @MireilleGain, 30 mai 2021
 */
export const uuid = '65288'
export const ref = '6P11-2'
export default function ProportionnaliteParLineariteTableau () {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.nbQuestions = 5
  this.nbCols = 1 // Uniquement pour la sortie LaTeX
  this.nbColsCorr = 1 // Uniquement pour la sortie LaTeX
  this.sup = 4 // Niveau de difficulté
  this.sup2 = false
  this.sup3 = false
  this.tailleDiaporama = 3 // Pour les exercices chronométrés. 50 par défaut pour les exercices avec du texte
  this.video = '' // Id YouTube ou url

  this.nouvelleVersion = function () {
    this.consigne = `On considère que ${this.nbQuestions > 1 ? 'les' : 'la'} situation${this.nbQuestions > 1 ? 's' : ''} suivante${this.nbQuestions > 1 ? 's' : ''}`
    this.consigne += this.sup3 ? ', sauf cas flagrant,' : ''
    this.consigne += ` ${this.nbQuestions > 1 ? 'sont des' : 'est une'} situation${this.nbQuestions > 1 ? 's' : ''} de proportionnalité.`
    this.consigne += this.sup2 ? ` ${context.isHtml ? '<br>' : '\\\\\n'}On demande de ${this.nbQuestions > 1 ? 'les' : 'la'} résoudre à l'aide d'un tableau.` : ''
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []

    let typeDeQuestionsDisponibles
    if (this.sup === 1) {
      typeDeQuestionsDisponibles = this.sup3 ? [1, 1, 1, 1, 4] : [1]
    } else if (this.sup === 2) {
      typeDeQuestionsDisponibles = this.sup3 ? [2, 2, 2, 2, 4] : [2]
    } else if (this.sup === 3) {
      typeDeQuestionsDisponibles = this.sup3 ? [3, 3, 3, 3, 4] : [3]
    } else if (this.sup === 4) {
      typeDeQuestionsDisponibles = this.sup3 ? [1, 2, 3, 2, 4] : [1, 2, 3]
    }

    const listeTypeQuestions = combinaisonListes(typeDeQuestionsDisponibles, this.nbQuestions) // Tous les types de questions sont posés mais l'ordre diffère à chaque "cycle"

    let np, cm, ng, o, pp, pg, pu, tp, index, a
    const fruits = [
      ['pêches', new Decimal('0.24')],
      ['noix', new Decimal('0.29')],
      ['cerises', new Decimal('0.31')],
      ['pommes', new Decimal('0.12')],
      ['framboises', new Decimal('0.75')],
      ['fraises', new Decimal('0.37')],
      ['citrons', new Decimal('0.08')],
      ['bananes', new Decimal('0.09')]
    ]

    const objets = [
      ['billes', new Decimal('0.1')],
      ['bonbons', new Decimal('0.1')],
      ['bougies', new Decimal('1.2')],
      ['crayons', new Decimal('0.5')],
      ['gâteaux', new Decimal('1.3')],
      ['gommes', new Decimal('0.4')],
      ['stickers', new Decimal('0.2')],
      ['cahiers', new Decimal('1.4')]
    ]

    for (let i = 0, texte, texteCorr, texteApres, monTableau, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      a = choice([1, 2, 3])
      // Boucle principale où i+1 correspond au numéro de la question

      switch (listeTypeQuestions[i]) { // Suivant le type de question, le contenu sera différent
        case 1: // multiplication
          if (a === 1) {
            index = randint(0, 7)
            np = randint(1, 10)
            cm = randint(2, 7)
            ng = np * cm
            pp = objets[index][1].mul(np * randint(8, 9)).div(10)
            pg = pp.mul(cm)
            o = objets[index][0]
            texte = `${prenom()} achète $${np}$ ${np === 1 ? o.slice(0, -1) : o} pour $${texPrix(pp)}$ €. Combien faudrait-il payer pour en acheter $${ng}$ ? `
            monTableau = tableau({
              largeurTitre: 10,
              ligne1: [{ texte: `Nombre de ${o}` }, { texte: stringNombre(np, 0), math: true }, {
                texte: stringNombre(ng, 0),
                math: true
              }],
              ligne2: [{ texte: 'Prix (en euros)' }, {
                texte: `${stringNombre(pp, 2, true, false)}`,
                math: true
              }, { texte: `${stringNombre(pg, 2, true, false)}`, math: true, gras: true, color: '#f15929' }],
              flecheHaut: [[1, 2, { texte: '×' + stringNombre(cm, 0), math: true, gras: true, color: '#f15929' }]]
            })
            setReponse(this, i, pg)
            texteApres = '€'
          } else if (a === 2) {
            index = randint(0, 7)
            np = randint(1, 10)
            cm = randint(2, 7)
            ng = np * cm
            pp = fruits[index][1].mul(np)
            pg = pp.mul(cm)
            o = choice([fruits[index][0]])
            texte = `${prenom()} achète $${texMasse(pp)}$ kg de ${o} pour $${texPrix(np)}$ €. Quelle masse de ${o} pourrait être achetée avec $${ng}$ € ? `
            monTableau = tableau({
              largeurTitre: 10,
              ligne1: [{ texte: `Prix des ${o} (en euros)` }, {
                texte: stringNombre(np, 0),
                math: true
              }, { texte: stringNombre(ng, 0), math: true }],
              ligne2: [{ texte: `Masse des ${o} (en kg)` }, {
                texte: `${stringNombre(pp, 3, true, false)}`,
                math: true
              }, { texte: `${stringNombre(pg, 3, true, false)}`, math: true, color: '#f15929', gras: true }],
              flecheHaut: [[1, 2, { texte: '×' + stringNombre(cm, 0), math: true, gras: true, color: '#f15929' }]]
            })
            setReponse(this, i, pg)
            texteApres = 'kg'
          } else {
            index = randint(0, 7)
            np = randint(2, 10)
            cm = randint(2, 7)
            ng = np * cm
            pp = new Decimal(randint(11, 48)).mul(np).div(10)
            pg = pp.mul(cm)
            texte = `$${np}$ objets occupent un volume de $${texNombre(pp, 1, false)}$ cm³. Quel volume serait occupé par $${ng}$ de ces objets ? `
            monTableau = tableau({
              largeurTitre: 10,
              ligne1: [{ texte: 'Nombre d\'objets' }, { texte: stringNombre(np, 0), math: true }, {
                texte: stringNombre(ng, 0),
                math: true
              }],
              ligne2: [{ texte: 'Volume des objets (en cm³)' }, {
                texte: `${stringNombre(pp, 1)}`,
                math: true
              }, { texte: `${stringNombre(pg, 1)}`, math: true, gras: true, color: '#f15929' }],
              flecheHaut: [[1, 2, { texte: '×' + stringNombre(cm, 0), math: true, gras: true, color: '#f15929' }]]
            })
            setReponse(this, i, pg)
            texteApres = 'cm³'
          }
          break

        case 2: // division
          if (a === 1) {
            index = randint(0, 7)
            np = randint(1, 10)
            cm = randint(2, 7)
            ng = np * cm
            pp = new Decimal(randint(8, 9)).mul(np).div(10)
            pg = pp.mul(cm)
            o = objets[index][0]
            texte = `${prenom()} achète $${ng}$ ${ng === 1 ? o.slice(0, -1) : o} pour $${texPrix(pg)}$ €. Combien faudrait-il payer pour en acheter $${np}$ ? `
            monTableau = tableau({
              largeurTitre: 10,
              ligne1: [{ texte: `Nombre de ${o}` }, { texte: stringNombre(ng, 0) }, { texte: stringNombre(np, 0) }],
              ligne2: [{ texte: 'Prix (en euros)' }, {
                texte: `${stringNombre(pg, 2, true, false)}`,
                math: true
              }, { texte: `${stringNombre(pp, 2, true, false)}`, math: true, gras: true, color: '#f15929' }],
              flecheHaut: [[1, 2, { texte: '÷' + stringNombre(cm, 0), math: true, gras: true, color: '#f15929' }]]
            })
            setReponse(this, i, pp)
            texteApres = '€'
          } else if (a === 2) {
            np = randint(1, 10)
            cm = randint(2, 7)
            ng = np * cm
            pp = np * randint(40, 60)
            pg = cm * pp
            texte = `${prenom()} peint une surface de $${stringNombre(pg, 0)}$ m² en $${ng}$ jours. Quelle surface serait peinte en $${np}$ ${np === 1 ? 'jour' : 'jours'} ? `
            monTableau = tableau({
              largeurTitre: 10,
              ligne1: [{ texte: 'Durée (en jours)' }, { texte: stringNombre(ng, 0), math: true }, {
                texte: stringNombre(np, 0),
                math: true
              }],
              ligne2: [{ texte: 'Surface peinte (en m²)' }, {
                texte: `${stringNombre(pg, 0)}`,
                math: true
              }, { texte: `${stringNombre(pp, 0)}`, math: true, gras: true, color: '#f15929' }],
              flecheHaut: [[1, 2, { texte: '÷' + stringNombre(cm, 0), math: true, gras: true, color: '#f15929' }]]
            })
            setReponse(this, i, pp)
            texteApres = 'm²'
          } else {
            index = randint(0, 7)
            np = randint(1, 10)
            cm = randint(2, 7)
            ng = np * cm
            pp = fruits[index][1].mul(np)
            pg = pp.mul(cm)
            o = fruits[index][0]
            texte = `${prenom()} achète $${texMasse(pg)}$ kg de ${o} pour $${texPrix(ng)}$ €. Quelle masse pourrait être achetée avec $${np}$ € ? `
            monTableau = tableau({
              largeurTitre: 10,
              ligne1: [{ texte: `Prix des ${o} (en euros)` }, {
                texte: stringNombre(ng, 0),
                math: true
              }, { texte: stringNombre(np, 0), math: true }],
              ligne2: [{ texte: `Masse des ${o} (en kg)` }, {
                texte: `${stringNombre(pg, 3, true, false)}`,
                math: true
              }, { texte: `${stringNombre(pp, 3, true, false)}`, math: true, gras: true, color: '#f15929' }],
              flecheHaut: [[1, 2, { texte: '÷' + stringNombre(cm, 0), math: true, gras: true, color: '#f15929' }]]
            })
            setReponse(this, i, pp)
            texteApres = 'kg'
          }
          break

        case 3: // passage par l'unité
          if (a === 1) {
            index = randint(0, 7)
            pu = objets[index][1].mul(randint(1, 19)).div(10)
            np = randint(2, 10)
            pp = pu.mul(np)
            ng = randint(2, 10, [np, 2 * np, 3 * np, 4 * np, 5 * np, np / 2, np / 3, np / 4, np / 5])
            pg = pu.mul(ng)
            o = objets[index][0]
            texte = `${prenom()} achète $${np}$ ${np === 1 ? o.slice(0, -1) : o} pour $${texPrix(pp)}$ €. Combien faudrait-il payer pour en acheter $${ng}$ ? `
            monTableau = tableau({
              largeurTitre: 10,
              ligne1: [{ texte: `Nombre de ${o}` }, { texte: stringNombre(np, 0), math: true }, {
                texte: '1',
                math: true
              }, { texte: stringNombre(ng, 0), math: true }],
              ligne2: [{ texte: 'Prix (en euros)' }, {
                texte: `${stringNombre(pp, 2, true, false)}`,
                math: true
              }, {
                texte: `${stringNombre(pu, 2, true, false)}`,
                math: true,
                gras: true,
                color: '#f15929'
              }, { texte: `${stringNombre(pg, 2, true, false)}`, math: true, gras: true, color: '#f15929' }],
              flecheHaut: [[1, 2, {
                texte: '÷' + stringNombre(np, 0),
                math: true,
                gras: true,
                color: '#f15929'
              }], [2, 3, { texte: '×' + stringNombre(ng, 0), math: true, gras: true, color: '#f15929' }]]
            })
            setReponse(this, i, pg)
            texteApres = '€'
          } else if (a === 2) {
            pu = randint(40, 60)
            np = randint(2, 10)
            pp = pu * np
            ng = randint(2, 10, [np, 2 * np, 3 * np, 4 * np, 5 * np, np / 2, np / 3, np / 4, np / 5])
            pg = pu * ng
            texte = `${prenom()} peint une surface de $${stringNombre(pp, 0)}$ m² en $${np}$ jours. Quelle surface serait peinte en $${ng}$ jours ? `
            monTableau = tableau({
              largeurTitre: 10,
              ligne1: [{ texte: 'Durée (en jours)' }, { texte: stringNombre(np, 0), math: true }, {
                texte: '1',
                math: true
              }, { texte: stringNombre(ng, 0), math: true }],
              ligne2: [{ texte: 'Surface peinte (en m²)' }, {
                texte: stringNombre(pp, 0),
                math: true
              }, { texte: stringNombre(pu, 0), math: true, gras: true, color: '#f15929' }, {
                texte: stringNombre(pg, 0),
                math: true,
                gras: true,
                color: '#f15929'
              }],
              flecheHaut: [[1, 2, {
                texte: '÷' + stringNombre(np, 0),
                math: true,
                gras: true,
                color: '#f15929'
              }], [2, 3, { texte: '×' + stringNombre(ng, 0), math: true, gras: true, color: '#f15929' }]]
            })
            setReponse(this, i, pg)
            texteApres = 'm²'
          } else {
            index = randint(0, 7)
            pu = objets[index][1].mul(randint(8, 12)).div(10)
            np = randint(2, 10)
            pp = pu.mul(np)
            ng = randint(2, 10, [np, 2 * np, 3 * np, 4 * np, 5 * np, np / 2, np / 3, np / 4, np / 5])
            pg = pu.mul(ng)
            o = fruits[index][0]
            texte = `${prenom()} achète $${texMasse(pp)}$ kg de ${o} pour $${texPrix(np)}$ €. Quelle masse de ${o} pourrait être achetée avec $${ng}$ € ? `
            monTableau = tableau({
              largeurTitre: 10,
              ligne1: [{ texte: `Prix des ${o} (en euros)` }, { texte: stringNombre(np, 0), math: true }, {
                texte: '1',
                math: true
              }, { texte: stringNombre(ng, 0), math: true }],
              ligne2: [{ texte: `Masse des ${o} (en kg)` }, {
                texte: `${stringNombre(pp, 3, true, false)}`,
                math: true
              }, {
                texte: `${stringNombre(pu, 3, true, false)}`,
                math: true,
                gras: true,
                color: '#f15929'
              }, { texte: `${stringNombre(pg, 3, true, false)}`, math: true, gras: true, color: '#f15929' }],
              flecheHaut: [[1, 2, {
                texte: '÷' + stringNombre(np, 0),
                math: true,
                gras: true,
                color: '#f15929'
              }], [2, 3, { texte: '×' + stringNombre(ng, 0), math: true, gras: true, color: '#f15929' }]]
            })
            setReponse(this, i, pg)
            texteApres = 'kg'
          }
          break

        case 4: // Non proportionnalité
          if (a === 1) {
            tp = new Decimal(randint(120, 165)).div(100)
            np = randint(10, 14)
            cm = randint(2, 4)
            ng = np * cm
            texte = `${prenom()} mesure $${texNombre(tp, 2, true, false)}$ m à $${np}$ ans. Quelle sera sa taille à $${ng}$ ans ?`
            texteCorr = 'On ne peut pas savoir car la taille n\'est pas proportionnelle à l\'âge.'
            texteApres = 'm'
          } else if (a === 2) {
            tp = randint(30, 45)
            np = randint(10, 13)
            cm = randint(2, 5)
            ng = np * cm
            texte = `${prenom()} pèse $${texMasse(tp)}$ kg à $${np}$ ans. Quelle sera son poids à $${ng}$ ans ?`
            texteCorr = 'On ne peut pas savoir car le poids (plus précisément la masse) n\'est pas proportionnel à l\'âge.'
            texteApres = 'kg'
          } else if (a === 3) {
            tp = randint(35, 39)
            np = randint(10, 13)
            cm = randint(2, 5)
            ng = np * cm
            texte = `${prenom()} chausse du $${tp}$ à $${np}$ ans. Quelle sera sa pointure à $${ng}$ ans ?`
            texteCorr = 'On ne peut pas savoir car la pointure n\'est pas proportionnelle à l\'âge.'
            texteApres = ''
          }
          setReponse(this, i, 'non')
          break
      }
      if (listeTypeQuestions[i] !== 4) {
        const { xmin, xmax, ymin, ymax } = fixeBordures([monTableau])
        texteCorr = mathalea2d(Object.assign({ xmin, xmax, ymin, ymax }, {
          scale: 0.7,
          style: 'display:block'
        }), monTableau)
      }
      if (this.interactif && this.sup3) {
        this.consigne += 'Si ce n\'est pas une situation de proportionnalité, écrire : non proportionnel.'
      }
      texte += ajouteChampTexteMathLive(this, i, ' inline', { texteApres: sp(2) + texteApres })
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
  this.besoinFormulaireNumerique = ['Niveau de difficulté', 4, '1 : Multiplication\n2 : Division\n3 : Passage par l\'unité\n4 : Mélange']
  this.besoinFormulaire2CaseACocher = ['Avec tableau dans la consigne']
  this.besoinFormulaire3CaseACocher = ['Avec des situations de non-proportionnalité']
}
