import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { Polynome } from '../../lib/mathFonctions/Polynome.js'
import { ecritureAlgebrique, rienSi1 } from '../../lib/outils/ecritures'
import { signe } from '../../lib/outils/nombres'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import Exercice from '../deprecatedExercice.js'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import engine, { functionCompare } from '../../lib/interactif/comparisonFunctions'

export const titre = 'Dérivée de $u\\times v$'
export const dateDePublication = '22/01/2022'
export const dateDeModifImportante = '06/05/2024'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * Calculer la dérivée d'un produit
 * @author Jean-Léon Henry modifié par Rémi Angot (choix des fonctions + parenthèses)
 * mise en jour par Jean-Claude Lhote à la demande des collègues de lycée (notations + paramétrage + quelques améliorations esthétiques)
 * Référence 1AN14-4
 */

export const uuid = '1a60f'
export const refs = {
  'fr-fr': ['1AN14-5'],
  'fr-ch': []
}
/**
 * @param {string} expression expression parsée
 * @returns expression en LaTeX avec multication implicite
 * @author Jean-Léon Henry()
 */
export function prettyTex (expression) {
  return expression.toTex({ implicit: 'hide' }).replaceAll('\\cdot', '').replaceAll('~', '')
}

export default function DeriveeProduit () {
  Exercice.call(this)
  this.titre = titre
  this.consigne = 'Pour chacune des fonctions suivantes, déterminer l\'expression de sa fonction dérivée.'
  this.nbQuestions = 3
  // Sortie LaTeX
  this.nbCols = 2 // Nombre de colonnes
  this.nbColsCorr = 2 // Nombre de colonnes dans la correction
  this.sup = '6'
  // On modifie les règles de simplifications par défaut de math.js pour éviter 10x+10 = 10(x+1) et -4x=(-4x)
  // const reglesDeSimplifications = math.simplify.rules.slice()
  // reglesDeSimplifications.splice(reglesDeSimplifications.findIndex(rule => rule.l === 'n1*n2 + n2'), 1)
  // reglesDeSimplifications.splice(reglesDeSimplifications.findIndex(rule => rule.l === 'n1*n3 + n2*n3'), 1)
  // reglesDeSimplifications.push({ l: '-(n1*v)', r: '-n1*v' })
  // reglesDeSimplifications.push('-(n1/n2) -> -n1/n2')

  this.nouvelleVersion = function () {
    this.liste_valeurs = [] // Les questions sont différentes du fait du nom de la fonction, donc on stocke les valeurs

    // Types d'énoncés
    // const listeTypeDeQuestionsDisponibles = ['monome2/poly1', 'inv/poly1']
    // if (this.sup === 2) {
    //   listeTypeDeQuestionsDisponibles.push('racine/poly', 'racine/poly2centre', 'monome2/racine')
    //   if (this.sup2) {
    //     listeTypeDeQuestionsDisponibles.push('exp/poly', 'exp/poly2centre')
    //   }
    const listeTypeDeQuestions = gestionnaireFormulaireTexte({
      saisie: this.sup,
      nbQuestions: this.nbQuestions,
      listeOfCase: [
        'monome2/poly1',
        'inv/poly1',
        'racine/poly',
        'racine/poly2centre',
        'monome2/racine'
      ],
      min: 1,
      max: 5,
      melange: 6,
      defaut: 1
    })
    for (let i = 0, texte, texteCorr, terme1, terme2, expression, askFacto, askFormule, askQuotient, ensembleDerivation, namef, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      // On commence par générer des fonctions qui pourrait servir
      const dictFonctions = {
        exp: 'e^x',
        racine: '\\sqrt{x}',
        inv: '1/x',
        poly1: new Polynome({ rand: true, deg: 1 }),
        poly2centre: new Polynome({ rand: true, coeffs: [[10, true], 0, [10, true]] }),
        monome2: new Polynome({ rand: true, coeffs: [0, 0, [10, true]] }),
        poly: new Polynome({ rand: true, deg: randint(1, 2) })
      }
      const listeTypeFonctions = listeTypeDeQuestions[i].split('/')
      // On précise les énoncés
      askFacto = listeTypeFonctions.includes('exp')
      askFormule = listeTypeFonctions.includes('poly1')
      askQuotient = listeTypeFonctions.includes('inv')
      // On randomise l'ordre des termes, sauf pour l'inverse et un monome devant une racine/une affine
      let f1 = 0
      let f2 = 1
      if (!(['monome2/racine', 'monome2/poly1', 'inv/poly1'].includes(listeTypeDeQuestions[i]))) {
        f1 = randint(0, 1)
        f2 = 1 - f1
      }
      const typef1 = listeTypeFonctions[f1]
      const typef2 = listeTypeFonctions[f2]
      // On gère les parenthèses autour des fonctions spéciales
      const noPar = type => ['monome2', 'racine', 'exp', 'inv'].includes(type)
      const parenth = (expr, type) => (noPar(type) ? expr : `(${expr})`)
      // On crée les expressions des fonctions : les polynômes dans dictFonctions ne sont pas des chaînes
      const exprf1 = ['poly', 'mono'].includes(typef1.substring(0, 4)) ? dictFonctions[typef1].toMathExpr() : dictFonctions[typef1]
      const exprf2 = ['poly', 'mono'].includes(typef2.substring(0, 4)) ? dictFonctions[typef2].toMathExpr() : dictFonctions[typef2]
      terme1 = parenth(exprf1, typef1)
      terme2 = parenth(exprf2, typef2)
      // Expression finale de la fonction
      expression = `${terme1}*${terme2}`
      // Ensemble de dérivation
      ensembleDerivation = listeTypeFonctions.includes('racine') ? '\\mathbb{R}_+^*' : '\\mathbb{R}'
      ensembleDerivation = listeTypeFonctions.includes('inv') ? '\\mathbb{R}^*' : ensembleDerivation

      // Enoncé
      namef = ['f', 'g', 'h', 'l', 'm', 'p', 'r', 's', 't', 'u', 'v', 'w', 'b', 'c', 'd', 'e'][i % 16]
      texte = askFacto ? 'Dans cette question, on demande la réponse sous forme factorisée.<br>' : ''
      texte = askFormule
        ? `Dans cette question, on demande d'utiliser la formule de dérivation d'un produit${askQuotient
          ? ' et de mettre le résultat sous forme d\'un quotient.'
          : '.'}<br>`
        : texte
      texte += `$${namef}(x)=${engine.parse(expression).latex}$`
      // Correction
      texteCorr = `$${namef}$ est dérivable sur $${ensembleDerivation}$. Soit $x\\in${ensembleDerivation}$.<br>`
      texteCorr += 'On rappelle le cours : si $u,v$ sont  deux fonctions dérivables sur un même intervalle $I$ alors leur produit est dérivable sur $I$ et on a la formule : '
      texteCorr += '\\[(u\\times v)\'=u\'\\times v+u\\times v\'.\\]'
      texteCorr += `Ici $${namef}=u\\times v$ avec : `
      texteCorr += `\\[\\begin{aligned}u(x)&=${engine.parse(exprf1).latex}\\\\ v(x)&=${engine.parse(exprf2).latex}.\\end{aligned}\\]`
      switch (listeTypeDeQuestions[i]) {
        case 'inv/poly1': {
          const b = dictFonctions[typef2].monomes[0] // coeffs du poly1
          const a = dictFonctions[typef2].monomes[1] // coeffs du poly1
          const f2 = dictFonctions[typef2]
          // Début correction
          texteCorr += 'On utilise la formule rappelée plus haut et on a : '
          texteCorr += `\\[${namef}'(x)=\\underbrace{-\\frac{1}{x^2}}_{u'(x)}\\times${engine.parse(terme2).latex}+\\frac{1}{x}\\times\\underbrace{${a > 0 ? a : `(${a})`}}_{v'(x)}.\\]`
          texteCorr += `Ce qui donne, en simplifiant : \\[${namef}'(x)=\\frac{${f2.multiply(-1)}}{x^2}+\\frac{${a}}{x}.\\]`
          texteCorr += 'On additionne les deux fractions pour obtenir : '
          texteCorr += `\\[${namef}'(x)=\\frac{${f2.multiply(-1)}}{x^2}+\\frac{${Polynome.print([0, a])}}{x^2}=\\frac{${f2.multiply(-1)}${Polynome.print([0, a], true)}}{x^2}.\\]`
          texteCorr += 'Des termes se simplifient au numérateur et on a : '
          texteCorr += `\\[${namef}'(x)=\\frac{${Polynome.print([-b])}}{x^2}.\\]`
          // Remarque sur la méthode alternative
          const fExpand = engine.parse(`${a}${ecritureAlgebrique(b)}/x`).latex
          texteCorr += `Remarque : on pourrait bien entendu développer avant de dériver.<br>Dans ce cas, $${namef}(x)=${fExpand}$.<br>`
          const maReponse = engine.box(['D', engine.parse(fExpand), 'x']).evaluate().latex
          texteCorr += `Et donc $${namef}'(x)=${maReponse}$. Ce qui est bien cohérent avec le résultat trouvé plus haut.`
          // Sans le replace { x} est mal interprété par le parser de mathLive
          handleAnswers(this, i, { reponse: { value: maReponse, compare: functionCompare } })
          break
        }
        case 'monome2/poly1': {
          const mon2 = dictFonctions[typef1]
          const poly1 = dictFonctions[typef2]
          const a = poly1.monomes[1]
          const polExpand = mon2.multiply(poly1)
          // Début correction
          texteCorr += `On utilise la formule rappelée plus haut et on a  \\[${namef}'(x)=\\underbrace{${mon2.derivee()}}_{u'(x)}\\times(${exprf2})+(${mon2.toMathExpr()})\\times\\underbrace{${a > 0 ? a : `(${a})`}}_{v'(x)}.\\]`
          texteCorr += `On développe pour obtenir : \\[${namef}'(x)=${mon2.derivee().multiply(poly1)}${mon2.multiply(a).toMathExpr(true)}.\\]`
          texteCorr += `Puis, en regroupant les termes de même degré : \\[${namef}'(x)=${polExpand.derivee()}.\\]`
          // Remarque sur la méthode alternative
          texteCorr += `Remarque : on pourrait bien entendu développer avant de dériver.<br>Dans ce cas, $${namef}(x)=${polExpand}$.<br>`
          texteCorr += `Et donc $${namef}'(x)=${polExpand.derivee()}$. Ce qui est bien cohérent avec le résultat trouvé plus haut.`
          handleAnswers(this, i, { reponse: { value: polExpand.derivee().toString(), compare: functionCompare } })
          break
        }
        case 'monome2/racine': {
          const mon2 = dictFonctions[typef1]
          const m = mon2.monomes[2] // coeff du monome2
          texteCorr += 'On applique la  formule rappellée plus haut : '
          texteCorr += `\\[${namef}'(x)=\\underbrace{${mon2.derivee()}}_{u'(x)}\\times\\sqrt{x}+(${mon2.toMathExpr()})\\times\\underbrace{\\frac{1}{2\\sqrt{x}}}_{v'(x)}.\\]`
          texteCorr += 'On peut réduire un peu l\'expression : '
          texteCorr += `\\[${namef}'(x)=${rienSi1(2 * m)}x\\sqrt{x}${signe(m)}` // attention l'équation finit ligne suivante
          if (m % 2 !== 0) {
            texteCorr += `\\frac{${rienSi1(Math.abs(m))}x^2}{2\\sqrt{x}}.\\]`
            handleAnswers(this, i, { reponse: { value: `${rienSi1(2 * m)}x\\sqrt{x}${signe(m)}\\frac{${rienSi1(Math.abs(m))}x^2}{2\\sqrt{x}}`, compare: functionCompare } })
            // Réponse réduite à ajouter
          } else {
            texteCorr += `\\frac{${Polynome.print([0, 0, Math.abs(m / 2)])}}{\\sqrt{x}}.\\]`
            handleAnswers(this, i, { reponse: { value: `${rienSi1(2 * m)}x\\sqrt{x}${signe(m)}\\frac{${Polynome.print([0, 0, Math.abs(m / 2)])}}{\\sqrt{x}}`, compare: functionCompare } })
            // Réponse réduite à ajouter
          }
          break
        }
        case 'racine/poly2centre': // traité ci-après
        case 'racine/poly': {
          const racineGauche = typef1 === 'racine'
          const poly = listeTypeDeQuestions[i] === 'racine/poly2centre' ? dictFonctions.poly2centre : dictFonctions.poly
          const derivee = poly.derivee()
          const tex = derivee.toLatex()
          const neg = tex.startsWith('-')
          // 1ère étape : application de la formule
          let intermediaire
          if (racineGauche) intermediaire = `\\underbrace{\\frac{1}{2\\sqrt{x}}}_{u'(x)}\\times(${poly})+\\sqrt{x}\\times\\underbrace{(${derivee})}_{v'(x)}`
          else intermediaire = `\\underbrace{${derivee.isMon() ? derivee.toLatex() : '(' + derivee.toLatex() + ')'}}_{u'(x)}\\times\\sqrt{x}+(${poly})\\times\\underbrace{\\frac{1}{2\\sqrt{x}}}_{v'(x)}`
          texteCorr += `On utilise la formule rappelée plus haut et on a \\[${namef}'(x)=${intermediaire}.\\]`
          // 2ème étape : simplification
          let interm2
          if (racineGauche) {
            interm2 = `\\frac{${poly}}{2\\sqrt{x}}${derivee.isMon()
              ? neg
                  ? tex
                  : '+' + tex
                : '+' + `(${derivee.toLatex()})`}\\sqrt{x}`
          } else interm2 = `${derivee.isMon() ? `${derivee.toLatex()}` : `(${derivee.toLatex()})`}\\sqrt{x}+\\frac{${poly}}{2\\sqrt{x}}`
          texteCorr += 'L\'énoncé ne demandant rien de plus, on se contente de simplifier l\'expression :'
          texteCorr += `\\[${namef}'(x)=${interm2}\\]`
          handleAnswers(this, i, { reponse: { value: interm2, compare: functionCompare } })
          break
        }
        case 'exp/poly': // traité ci-après
        case 'exp/poly2centre': {
          const expGauche = typef1 === 'exp'
          const poly = listeTypeDeQuestions[i] === 'exp/poly2centre' ? dictFonctions.poly2centre : dictFonctions.poly
          const derivee = poly.derivee()
          // 1ère étape : application de la formule
          let intermediaire
          if (expGauche) intermediaire = `\\underbrace{e^x}_{u'(x)}\\times(${poly})+e^x\\times\\underbrace{(${derivee})}_{v'(x)}`
          else intermediaire = `\\underbrace{${derivee.isMon() ? `${derivee.toLatex()}` : `(${derivee.toLatex()})`}}_{u'(x)}\\times e^x+(${poly})\\times\\underbrace{e^x}_{v'(x)}`
          texteCorr += `On utilise la formule rappelée plus haut et on a \\[${namef}'(x)=${intermediaire}.\\]`
          // 2ème étape : Factorisation
          const interm2 = `(${poly.add(derivee).toLatex()})`
          const termeGauche = expGauche ? 'e^x' : interm2
          const termeDroite = expGauche ? interm2 : 'e^x'
          texteCorr += 'Comme demandé, on factorise l\'expression par $e^x$ : '
          texteCorr += `\\[${namef}'(x)=${termeGauche}${termeDroite}\\]`
          handleAnswers(this, i, { reponse: { value: `${termeGauche}${termeDroite}`, compare: functionCompare } })
          // 3e étape : Simplification si nécessaire
          const interm2Simp = `(${poly.add(derivee)})`
          const termeGauche2 = expGauche ? 'e^x' : interm2Simp
          const termeDroite2 = expGauche ? interm2Simp : 'e^x'
          if (`${termeGauche2}${termeDroite2}` !== `${termeGauche}${termeDroite}`) {
            texteCorr += 'On peut réduire ou réordonner l\'expression entre parenthèses : '
            texteCorr += `\\[${namef}'(x)=${termeGauche2}${termeDroite2}\\]`
            handleAnswers(this, i, { reponse: { value: `${termeGauche2}${termeDroite2}`, compare: functionCompare } })
          }
        }
          break
        default:
          texteCorr += 'Correction non encore implémentée.'
          break
      }
      texte = texte.replaceAll('\\frac', '\\dfrac')
      texteCorr = texteCorr.replaceAll('\\frac', '\\dfrac')
      if (this.interactif) {
        texte += '<br><br>' + ajouteChampTexteMathLive(this, i, '', { texteAvant: `$${namef}'(x)=$` })
      }

      if (this.liste_valeurs.indexOf(expression) === -1) {
        this.liste_valeurs.push(expression)
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireTexte = ['types de fonctions :', 'Nombres séparés par des tirets\n1 monome2 et affine\n2 : inverse et affine\n3 : racine et polynome\n4 : racine et polynome degré 2 sans degré 1\n5 : monome2 et racine\n6 : mélange']
}
