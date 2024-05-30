import { combinaisonListes } from '../../lib/outils/arrayOutils'
import Exercice from '../deprecatedExercice.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { context } from '../../modules/context.js'
import { setReponse } from '../../lib/interactif/gestionInteractif'

export const titre = 'Utiliser la notation puissance'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCOpen'

export const dateDePublication = '21/11/2021' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag
export const dateDeModifImportante = '24/09/2023'
/**
 * Passer d'un produit à la notation puissance et inversement
 * @author Guillaume Valmont
 */
export const uuid = '1d078'
export const ref = '4C33-0'
export const refs = {
  'fr-fr': ['4C33-0'],
  'fr-ch': ['10NO2-1']
}
export default function NotationPuissance () {
  Exercice.call(this)
  this.nbQuestions = 4
  this.besoinFormulaireNumerique = ['Type de calcul', 3, '1 : Écrire sous forme de produit\n2 : Écrire sous forme de puissance\n3 : Mélange'] // le paramètre sera numérique de valeur max 2 (le 2 en vert)
  this.sup = 1
  this.besoinFormulaire2Numerique = ['Mantisse', 3, '1 : Positive\n2 : Négative\n3 : Mélange']
  this.sup2 = 3
  this.besoinFormulaire3Numerique = false
  this.sup3 = 1
  this.besoinFormulaire4Numerique = ['Signe devant la mantisse', 3, '1 : Positif\n2 : Négatif\n3 : Mélange']
  this.sup4 = 3
  this.classe = 4

  this.nouvelleVersion = function () {
    this.titre = titre
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []
    let listeTypeDeQuestions
    switch (this.sup) {
      case 1:
        this.consigne = 'Écrire l\'expression '
        this.consigne += this.classe === 2 ? '(avec des $\\times$ si besoin) ' : 'avec des $\\times$ et '
        this.consigne += 'sans utiliser la notation puissance. Aucun calcul n\'est nécessaire.'
        listeTypeDeQuestions = ['produit']
        break
      case 2:
        this.consigne = 'Simplifier l\'écriture en utilisant la notation puissance.'
        listeTypeDeQuestions = ['puissance']
        break
      default:
        this.consigne = ''
        listeTypeDeQuestions = ['produit', 'puissance']
        break
    }
    listeTypeDeQuestions = combinaisonListes(listeTypeDeQuestions, this.nbQuestions)
    let listeSignesExposants
    switch (this.sup3) {
      case 1:
        listeSignesExposants = ['positif']
        break
      case 2:
        listeSignesExposants = ['négatif']
        break
      default:
        listeSignesExposants = ['positif', 'négatif']
        break
    }
    listeSignesExposants = combinaisonListes(listeSignesExposants, this.nbQuestions)
    const listeSignes = combinaisonListes(this.sup4 === 1 ? [''] : this.sup4 === 2 ? ['-'] : ['', '-'], this.nbQuestions)
    let listeSignesMantisse = combinaisonListes(['', '-'], this.nbQuestions)
    switch (this.sup2) {
      case 1:
        listeSignesMantisse = ['']
        break
      case 2:
        listeSignesMantisse = ['-']
        break
      default:
        listeSignesMantisse = ['', '-']
        break
    }
    listeSignesMantisse = combinaisonListes(listeSignesMantisse, this.nbQuestions)
    for (let i = 0, texte, texteCorr, mantisse, exposant, pl, pr, apl, apr, signeContraire, produitSansParenthesesInitialesEtSansFois, produitSansParenthesesInitiales, produit, produitAlt, puissance, puissances, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      this.autoCorrection[i] = {}
      mantisse = randint(2, 10)
      if (listeSignesMantisse[i] === '-') mantisse = -mantisse
      if (listeTypeDeQuestions[i] === 'puissance') {
        exposant = randint(2, 8)
      } else {
        exposant = randint(this.classe > 2 ? 2 : 0, 5)
      }
      if (mantisse < 0) {
        pl = '('
        pr = ')'
        apl = ''
        apr = ''
      } else {
        pl = ''
        pr = ''
        apl = '('
        apr = ')'
      }
      listeSignes[i] === '-' ? signeContraire = '' : signeContraire = '-'
      if (listeSignesExposants[i] === 'négatif') {
        exposant = exposant * -1
      }
      puissance = `${listeSignes[i] + pl + mantisse + pr}^{${exposant}}`
      puissances = []
      let exp
      exposant < 0 ? exp = `{${exposant}}` : exp = `${exposant}` // distinction importante pour comparer les chaînes de caractères en interactif
      puissances.push(`${listeSignes[i] + pl + mantisse + pr}^${exp}`) // réponse de base
      exposant % 2 === 0 ? puissances.push(`${listeSignes[i] + apl + -mantisse + apr}^${exp}`) : puissances.push(`${signeContraire + apl + -mantisse + apr}^${exp}`) // si l'exposant est pair, on peut changer le signe de la mantisse sans changer le signe devant et s'il est impair, on peut changer les deux signes
      produit = `${pl + mantisse + pr}`
      produitSansParenthesesInitiales = `${mantisse}`
      produitAlt = produit
      produitSansParenthesesInitialesEtSansFois = produitSansParenthesesInitiales
      for (let j = 0; j < Math.abs(exposant) - 1; j++) {
        produit += `\\times${pl + mantisse + pr}`
        produitSansParenthesesInitiales += `\\times${pl + mantisse + pr}`
        produitAlt += `(${mantisse})`
        produitSansParenthesesInitialesEtSansFois += `(${mantisse})`
      }
      switch (listeTypeDeQuestions[i]) {
        case 'produit':
          if (this.sup === 3) {
            texte = `Écrire $${puissance}$ `
            texte += this.classe === 2 ? '(avec des $\\times$ si besoin) ' : 'avec des $\\times$ et '
            texte += 'sans utiliser la notation puissance'
          } else {
            texte = `$${puissance}$`
          }
          texteCorr = `$${puissance} = `
          if (exposant === 0) {
            texteCorr += listeSignes[i] + 1 + '$'
            setReponse(this, i, listeSignes[i] + 1, { formatInteractif: 'ignorerCasse' })
          } else if (exposant === 1) {
            if (listeSignes[i] === '') {
              pl = ''
              pr = ''
            }
            texteCorr += `${listeSignes[i] + pl + mantisse + pr}$`
            setReponse(this, i, listeSignes[i] + pl + mantisse + pr, { formatInteractif: 'ignorerCasse' })
          } else if (exposant > 1) {
            texteCorr += listeSignes[i] + produit + '$'
            setReponse(this, i, [listeSignes[i] + produit, listeSignes[i] + produitAlt, listeSignes[i] + produitSansParenthesesInitiales, listeSignes[i] + produitSansParenthesesInitialesEtSansFois], { formatInteractif: 'ignorerCasse' })
          } else if (exposant === -1) {
            texteCorr += `${listeSignes[i]}\\dfrac{1}{${mantisse}}$`
            setReponse(this, i, `${listeSignes[i]}\\frac{1}{${mantisse}}`, { formatInteractif: 'ignorerCasse' })
          } else if (exposant < -1) {
            texteCorr += `${listeSignes[i]}\\dfrac{1}{${produit}}$`
            setReponse(this, i, [`${listeSignes[i]}\\frac{1}{${produit}}`, `${listeSignes[i]}\\frac{1}{${produitAlt}}`, `${listeSignes[i]}\\frac{1}{${produitSansParenthesesInitiales}}`, `${listeSignes[i]}\\frac{1}{${produitSansParenthesesInitialesEtSansFois}}`], { formatInteractif: 'ignorerCasse' })
          }
          break
        case 'puissance':
        {
          let enonce, correction
          if (exposant < 0) {
            enonce = `$${listeSignes[i]} \\dfrac{1}{${produit}}$`
            correction = `$${listeSignes[i]} \\dfrac{1}{${produit}} = ${puissance}$`
          } else {
            enonce = `$${listeSignes[i]} ${produit}$`
            correction = `$${listeSignes[i]} ${produit} = ${puissance}$`
          }
          texte = this.sup === 3 ? `Simplifier ${enonce} en utilisant la notation puissance` : enonce
          texteCorr = correction
          setReponse(this, i, puissances, { formatInteractif: 'ignorerCasse' })
          break
        }
      }

      texte += this.interactif ? ' = ' + ajouteChampTexteMathLive(this, i, 'inline largeur01', { tailleExtensible: true }) : ''
      if (this.sup === 3) texte += '.'

      if (context.isAmc) {
        if (this.sup !== 3) this.titre = this.consigne
        this.autoCorrection[i].enonce = this.sup === 3 ? texte + ' $=\\ldots$<br>' : ('Compléter : ' + texte + ' $=\\ldots$')
        this.autoCorrection[i].propositions = [{ statut: 1, sanscadre: true, texte: texteCorr }]
      }
      // Si la question n'mantisse jamais été posée, on l'enregistre
      if (this.questionJamaisPosee(i, mantisse, exposant, listeTypeDeQuestions[i], listeSignesExposants[i], listeSignes[i])) { // <- laisser le i et ajouter toutes les variables qui rendent les exercices différents (par exemple mantisse, exposant, c et d)
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
