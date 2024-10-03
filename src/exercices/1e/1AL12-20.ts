/* eslint-disable no-case-declarations */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { ecritureAlgebrique, ecritureAlgebriqueSauf1, rienSi1 } from '../../lib/outils/ecritures'
import Exercice from '../deprecatedExercice'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils'
import { tableauSignesFonction } from '../../lib/mathFonctions/etudeFonction'
import { texNombre } from '../../lib/outils/texNombre'
import { fraction } from '../../modules/fractions'
import FractionEtendue from '../../modules/FractionEtendue'

export const titre = 'Etudier le sens de variation d\'une suite définie de façon explicite'
export const interactifType = 'mathLive'
export const dateDePublication = '03/10/2024'
/**
 * @author Samuel Rattoray
 */
export const uuid = 'f3e42'
export const refs = {
  'fr-fr': ['1AL12-20'],
  'fr-ch': []
}
export default function VariationDUneSuiteDefinieExplicitement (this: any) {
  Exercice.call(this)
  this.titre = titre
  // this.consigne = 'Une suite étant donnée, étudier son sens de variation.'
  this.nbQuestions = 3
  this.sup = 4
  this.besoinFormulaireTexte = [
    'Type de questions', [
      'Nombres séparés par des tirets',
      '1 : Affine',
      '2 : Second degré',
      '3 : Homographique',
      '4 : Mélange'
    ].join('\n')
  ]
  this.nouvelleVersion = function () {
    this.autoCorrection = []
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    const typesDeQuestionsDisponibles = gestionnaireFormulaireTexte({
      saisie: this.sup,
      min: 1,
      max: 3,
      melange: 4,
      defaut: 4,
      nbQuestions: this.nbQuestions
    })
    const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions)
    this.listeQuestions = [] // Vide la liste de questions
    this.listeCorrections = [] // Vide la liste de questions corrigées

    // Tous les types de questions sont posées mais l'ordre diffère à chaque "cycle"

    for (let i = 0, texte:string, texteCorr:string, cpt = 0, alea1:number, alea2:number; i < this.nbQuestions && cpt < 50;) {
      switch (listeTypeDeQuestions[i]) { // listeTypeDeQuestions[i]
        case 1: // fonction affine avec Entiers Relatifs (m*x+p)
          const m = randint(1, 99) * choice([-1, 1])
          const p = randint(1, 99) * choice([-1, 1])
          alea1 = m
          alea2 = p

          texte = `Soit $(u_n)$ une suite définie pour tout entier $n\\in\\mathbb{N}$ par $u_n =${rienSi1(m)}n${ecritureAlgebrique(p)}$. `
          texte += '<br><br>'
          texte += 'Etudier le sens de variation de la suite $(u_n)$'
          texteCorr = 'Deux manières d\'étudier le sens de variation de $(u_n)$ sont possibles.'
          texteCorr += '<br><br>'
          texteCorr += 'Méthode 1  : en étudiant le signe de $u_{n+1} - u_n$ :'
          texteCorr += `<br>Pour tout $n\\in\\mathbb{N}$ :`
          texteCorr += `<br>$u_{n+1} - u_n = ${rienSi1(m)}(n+1) ${ecritureAlgebrique(p)}-(${rienSi1(m)}n ${ecritureAlgebrique(p)})$`
          texteCorr += `<br>$\\phantom{u_{n+1} - u_n} = ${rienSi1(m)}n ${ecritureAlgebrique(m)} ${ecritureAlgebrique(p)} ${ecritureAlgebrique(-m)}n ${ecritureAlgebrique(-p)}$`
          texteCorr += `<br>$\\phantom{u_{n+1} - u_n} = ${m}$ `
          texteCorr += '<br>'
          if (m >= 0) {
            texteCorr += `$${m}>0$, on en déduit que $u_{n+1} - u_n >0$, soit $u_{n+1} > u_n$. <br> La suite $(u_n)$ est donc croissante sur $\\mathbb{N}$.`
          } else {
            texteCorr += `$${m}<0$, on en déduit que $u_{n+1} - u_n <0$, soit $u_{n+1} < u_n$. <br> La suite $(u_n)$ est donc décroissante sur $\\mathbb{N}$.`
          }
          texteCorr += '<br><br>'
          texteCorr += `Méthode 2 : en utilisant le sens de variation de la fonction associée : <br> Pour tout $n\\in\\mathbb{N}$ on a $(u_n) = f(n)$ où $f$ est la fonction définie sur $[0;+\\infty[$ par $f(x) = ${rienSi1(m)}x ${ecritureAlgebrique(p)}$`
          texteCorr += '<br>'
          texteCorr += '$f$ est une fonction affine et le sens de variation d’une fonction affine dépend du signe de a :'
          texteCorr += '<br>'
          if (m >= 0) {
            texteCorr += `Or $a=${m}>0$, la fonction $f$ est donc croissante sur $[0;+\\infty[$. <br> On en déduit que la suite $(u_n)$ est croissante sur $\\mathbb{N}$.`
          } else {
            texteCorr += `Or $a=${m}<0$, la fonction $f$ est donc décroissante sur $[0;+\\infty[$. <br> On en déduit que la suite $(u_n)$ est décroissante sur $\\mathbb{N}$.`
          }
          break

        case 2: // fonction polynome de degré 2 (a*x²+b*x+c)
          const a = randint(1, 9) * choice([-1, 1])
          const b = randint(0, 50) * choice([-1, 1])
          const c = randint(0, 50) * choice([-1, 1])
          const alpha = -b / (2 * a)
          const rang_p = Math.ceil(alpha)
          alea1 = a
          alea2 = b

          texte = `Soit $(u_n)$ une suite définie pour tout entier $n\\in\\mathbb{N}$ par ${b === 0 ? `$u_n = ${rienSi1(a)}n^2 ${ecritureAlgebrique(c)}$` : `$u_n = ${rienSi1(a)}n^2 ${ecritureAlgebriqueSauf1(b)}n ${ecritureAlgebrique(c)}$`}.`
          texte += '<br><br>'
          texte += 'Etudier le sens de variation de la suite $(u_n)$'
          texteCorr = `Dans ce cas, l'étude du sens de variation de la fonction est plus simple que d'étudier le signe de $u_{n+1}-u_{n}$. <br> On a $(u_n) = f(n)$ avec $f(x) = $${b === 0 ? `$${rienSi1(a)}x^2 ${ecritureAlgebrique(c)}$` : `$ ${rienSi1(a)}x^2 ${ecritureAlgebriqueSauf1(b)}x ${ecritureAlgebrique(c)}$`}.`
          texteCorr += '<br>'
          texteCorr += 'Pour les suites définies de manière explicite, le sens de variation de la fonction $f$ donne le sens de variation de la la suite $u$. <br> On étudie donc le sens de variation de la fonction $f$.'
          texteCorr += '<br>'
          texteCorr += 'Or $f$ est une fonction polynomiale du second degré.'
          texteCorr += '<br>'
          texteCorr += `Pour étudier ses variations, nous calculons $\\alpha = \\dfrac{${'-b'}}{${'2a'}}$ qui correspond à l'abscisse du sommet de la parabole : $\\alpha = ${new FractionEtendue(-b , 2 * a).texFractionSimplifiee}$.`
          texteCorr += '<br>'
          if (a >= 0) {
            texteCorr += `De plus $a = ${a}>0$, la fonction $f$ est donc décroissante sur $]-\\infty;${new FractionEtendue(-b , 2 * a).texFractionSimplifiee}[$ et croissante sur $]${new FractionEtendue(-b , 2 * a).texFractionSimplifiee};+\\infty[$.`
            texteCorr += '<br>'
            if (rang_p >= 0) {
              texteCorr += `On en déduit que la suite $(u_n)$ est croissante pour tout entier $n \\geqslant ${rang_p}$.`
            } else {
              texteCorr += 'On en déduit que la suite $(u_n)$ est croissante sur $\\mathbb{N}$.'
            }
          } else {
            texteCorr += `De plus $${a}<0$, la fonction $f$ est donc croissante sur $]-\\infty;${new FractionEtendue(-b , 2 * a).texFractionSimplifiee}[$ et décroissante sur $]${new FractionEtendue(-b , 2 * a).texFractionSimplifiee};+\\infty[$.`
            texteCorr += '<br>'
            if (rang_p >= 0) {
              texteCorr += `On en déduit que la suite $(u_n)$ est décroissante pour tout entier $n \\geqslant${rang_p}$.`
            } else {
              texteCorr += 'On en déduit que la suite $(u_n)$ est décroissante sur $\\mathbb{N}$.'
            }
          }
          break

          case 3: // fonction homographique (num_a*x+num_b)/(denom_c*x+denom_d)
          do {
            var num_a = randint(1, 9)
            var num_b = randint(1, 9) * choice([-1, 1])
            var denom_c = randint(1, 9)
            var denom_d = randint(1, 9) * choice([-1, 1])
          } while (num_a + num_b === 0)
          alea1 = num_a
          alea2 = num_b
          const numerateur = (num_a + num_b) * denom_d - num_b * (denom_c + denom_d)
          const maFonction = (x: number) => (num_a * denom_d - num_b * denom_c) / ((denom_c * x + denom_d + denom_c) * (denom_c * x + denom_d))
          const monTableau = tableauSignesFonction(
            maFonction,
            -denom_d / denom_c - 2,
            -denom_d / denom_c + 1,
            {
              substituts: [{ antVal: -denom_d / denom_c - 2, antTex: '-\\infty', imgVal: -100, imgTex: '-\\infty' },  
                { antVal: -denom_d / denom_c + 1, antTex: '+\\infty', imgVal: 100, imgTex: '+\\infty' }
            ],
              step: 0.001,
              tolerance: 0.005,
              nomVariable: 'n',
              nomFonction: '$u_{n+1}-u_n$'
            } 
          )
          texte = `Soit $(u_n)$ une suite définie pour tout entier $n\\in\\mathbb{N}$ par $u_n = \\dfrac{${rienSi1(num_a)}n ${ecritureAlgebrique(num_b)}}{${rienSi1(denom_c)}n ${ecritureAlgebrique(denom_d)}}$.`
          texte += '<br><br>'
          texte += 'Etudier le sens de variation de la suite $(u_n)$'
          if (num_a * denom_d == num_b * denom_c) {
            texteCorr = `On remarque que $u_n = \\dfrac{${num_a}}{${denom_c}} \\times \\dfrac{n ${ecritureAlgebrique(fraction(num_b, num_a))}}{n ${ecritureAlgebrique(fraction(denom_d, denom_c))}}$`
            texteCorr += '<br>'
            texteCorr += `$u_n = ${new FractionEtendue(num_a, denom_c).texFractionSimplifiee} \\times \\dfrac{n ${ecritureAlgebrique(fraction(num_b, num_a).simplifie())}}{n ${ecritureAlgebrique(fraction(denom_d, denom_c).simplifie())}}$`
            texteCorr += '<br><br>'
            texteCorr += `Alors $u_n = ${new FractionEtendue(num_a, denom_c).texFractionSimplifiee}$`
            texteCorr += '<br>'
            texteCorr += `La suite $u_n$ est constante sur $\\mathbb{N}$`
          } else {
            texteCorr = 'On calcule la différence entre deux termes consécutifs :'
            texteCorr += '<br>'
            texteCorr += `$u_{n+1} - u_n = \\dfrac{${rienSi1(num_a)}(n+1) ${ecritureAlgebrique(num_b)}}{${rienSi1(denom_c)}(n+1) ${ecritureAlgebrique(denom_d)}} - \\dfrac{${rienSi1(num_a)}n ${ecritureAlgebrique(num_b)}}{${rienSi1(denom_c)}n ${ecritureAlgebrique(denom_d)}}$`
            texteCorr += '<br><br>'
            texteCorr += `$\\phantom{u_{n+1} - u_n} = \\dfrac{${rienSi1(num_a)}n ${ecritureAlgebrique(num_a)} ${ecritureAlgebrique(num_b)}}{${rienSi1(denom_c)}n ${ecritureAlgebrique(denom_c)} ${ecritureAlgebrique(denom_d)}} - \\dfrac{${rienSi1(num_a)}n ${ecritureAlgebrique(num_b)}}{${rienSi1(denom_c)}n ${ecritureAlgebrique(denom_d)}}$`
            texteCorr += '<br><br>'
            if (denom_c + denom_d == 0) {
              texteCorr += `$\\phantom{u_{n+1} - u_n} = \\dfrac{${rienSi1(num_a)}n ${ecritureAlgebrique(num_b + num_a)}}{${rienSi1(denom_c)}n} - \\dfrac{${rienSi1(num_a)}n ${ecritureAlgebrique(num_b)}}{${rienSi1(denom_c)}n ${ecritureAlgebrique(denom_d)}}$`
              texteCorr += '<br><br>'
              if (denom_c >= 0) {
                texteCorr += `$\\phantom{u_{n+1} - u_n} = \\dfrac{(${rienSi1(num_a)}n ${ecritureAlgebrique(num_b + num_a)})(${rienSi1(denom_c)}n ${ecritureAlgebrique(denom_d)})-(${rienSi1(num_a)}n ${ecritureAlgebrique(num_b)})${rienSi1(denom_c)}n}{${rienSi1(denom_c)}n (${rienSi1(denom_c)}n ${ecritureAlgebrique(denom_d)})}$`
                texteCorr += '<br><br>'
              } else {
                texteCorr += `$\\phantom{u_{n+1} - u_n} = \\dfrac{(${rienSi1(num_a)}n ${ecritureAlgebrique(num_b + num_a)})(${rienSi1(denom_c)}n ${ecritureAlgebrique(denom_d)})-(${rienSi1(num_a)}n ${ecritureAlgebrique(num_b)})(${rienSi1(denom_c)}n)}{${rienSi1(denom_c)}n (${rienSi1(denom_c)}n ${ecritureAlgebrique(denom_d)})}$`
                texteCorr += '<br><br>'
              }
              texteCorr += `$\\phantom{u_{n+1} - u_n} = \\dfrac{(${rienSi1(num_a * denom_c)}n² ${ecritureAlgebrique(num_a * denom_d)}n ${ecritureAlgebrique((num_a + num_b) * denom_c)}n ${ecritureAlgebrique((num_a + num_b) * denom_d)}) - (${rienSi1(num_a * denom_c)}n² ${ecritureAlgebrique(num_b * denom_c)}n)}{${rienSi1(denom_c)}n (${rienSi1(denom_c)}n ${ecritureAlgebrique(denom_d)})}$`
              texteCorr += '<br><br>'
              texteCorr += `$\\phantom{u_{n+1} - u_n} = \\dfrac{(${rienSi1(num_a * denom_c)}n² ${ecritureAlgebrique((num_a * denom_d) + (num_a + num_b) * denom_c)}n ${ecritureAlgebrique((num_a + num_b) * denom_d)}) - (${rienSi1(num_a * denom_c)}n² ${ecritureAlgebrique(num_b * denom_c)}n)}{${rienSi1(denom_c)}n (${rienSi1(denom_c)}n ${ecritureAlgebrique(denom_d)})}$`
              texteCorr += '<br><br>'
              texteCorr += `$\\phantom{u_{n+1} - u_n} = \\dfrac{${((num_a + num_b) * denom_d)}}{${rienSi1(denom_c)}n (${rienSi1(denom_c)}n ${ecritureAlgebrique(denom_d)})}$`
              texteCorr += '<br><br>'
            } else {
              texteCorr += `$\\phantom{u_{n+1} - u_n} = \\dfrac{${rienSi1(num_a)}n ${ecritureAlgebrique(num_b + num_a)}}{${rienSi1(denom_c)}n ${ecritureAlgebrique(denom_d + denom_c)}} - \\dfrac{${rienSi1(num_a)}n ${ecritureAlgebrique(num_b)}}{${rienSi1(denom_c)}n ${ecritureAlgebrique(denom_d)}}$`
              texteCorr += '<br><br>'
              texteCorr += `$\\phantom{u_{n+1} - u_n} = \\dfrac{(${rienSi1(num_a)}n ${ecritureAlgebrique(num_b + num_a)})(${rienSi1(denom_c)}n ${ecritureAlgebrique(denom_d)})-(${rienSi1(num_a)}n ${ecritureAlgebrique(num_b)})(${rienSi1(denom_c)}n ${ecritureAlgebrique(denom_d + denom_c)})}{(${rienSi1(denom_c)}n ${ecritureAlgebrique(denom_d + denom_c)}) (${rienSi1(denom_c)}n ${ecritureAlgebrique(denom_d)})}$`
              texteCorr += '<br><br>'
              texteCorr += `$\\phantom{u_{n+1} - u_n} = \\dfrac{(${rienSi1(num_a * denom_c)}n² ${ecritureAlgebrique(num_a * denom_d)}n ${ecritureAlgebrique((num_a + num_b) * denom_c)}n ${ecritureAlgebrique((num_a + num_b) * denom_d)}) - (${rienSi1(num_a * denom_c)}n² ${ecritureAlgebrique(num_a * (denom_c + denom_d))}n ${ecritureAlgebrique(num_b * denom_c)}n ${ecritureAlgebrique(num_b * (denom_c + denom_d))})}{(${rienSi1(denom_c)}n ${ecritureAlgebrique(denom_d + denom_c)}) (${rienSi1(denom_c)}n ${ecritureAlgebrique(denom_d)})}$`
              texteCorr += '<br><br>'
              texteCorr += `$\\phantom{u_{n+1} - u_n} = \\dfrac{(${rienSi1(num_a * denom_c)}n² ${ecritureAlgebrique((num_a * denom_d) + (num_a + num_b) * denom_c)}n ${ecritureAlgebrique((num_a + num_b) * denom_d)}) - (${rienSi1(num_a * denom_c)}n² ${ecritureAlgebrique(num_a * (denom_c + denom_d) + num_b * denom_c)}n ${ecritureAlgebrique(num_b * (denom_c + denom_d))})}{(${rienSi1(denom_c)}n ${ecritureAlgebrique(denom_d + denom_c)}) (${rienSi1(denom_c)}n ${ecritureAlgebrique(denom_d)})}$`
              texteCorr += '<br><br>'
              texteCorr += `$\\phantom{u_{n+1} - u_n} = \\dfrac{${((num_a + num_b) * denom_d)} ${ecritureAlgebrique(-num_b * (denom_c + denom_d))}}{(${rienSi1(denom_c)}n ${ecritureAlgebrique(denom_d + denom_c)}) (${rienSi1(denom_c)}n ${ecritureAlgebrique(denom_d)})}$`
              texteCorr += '<br><br>'
              texteCorr += `$\\phantom{u_{n+1} - u_n} = \\dfrac{${((num_a + num_b) * denom_d - num_b * (denom_c + denom_d))}}{(${rienSi1(denom_c)}n ${ecritureAlgebrique(denom_d + denom_c)}) (${rienSi1(denom_c)}n ${ecritureAlgebrique(denom_d)})}$`
              texteCorr += '<br><br>'
            }
            texteCorr += 'Nous allons maintenant étudier le signe de $u_{n+1} - u_n$ :'
            texteCorr += '<br><br>'
            if (denom_c >= 0) {
              texteCorr += `$${rienSi1(denom_c)}n ${ecritureAlgebrique(denom_d + denom_c)}>0$ si et seulement si $n > ${new FractionEtendue(-(denom_d + denom_c), denom_c).texFractionSimplifiee}$`
            } else {
              texteCorr += `$${rienSi1(denom_c)}n ${ecritureAlgebrique(denom_d + denom_c)}>0$ si et seulement si $n < ${new FractionEtendue(-(denom_d + denom_c), denom_c).texFractionSimplifiee}$`
            }
            texteCorr += '<br>'
            if (denom_c >= 0) {
              texteCorr += `$${rienSi1(denom_c)}n ${ecritureAlgebrique(denom_d)}>0$ si et seulement si $n > ${new FractionEtendue(-denom_d , denom_c).texFractionSimplifiee}$`
            } else {
              texteCorr += `$${rienSi1(denom_c)}n ${ecritureAlgebrique(denom_d)}>0$ si et seulement si $n < ${new FractionEtendue(-denom_d , denom_c).texFractionSimplifiee}$`
            }
            texteCorr += '<br>'
            if (numerateur >= 0) {
              texteCorr += `De plus : $${(num_a + num_b) * denom_d - num_b * (denom_c + denom_d)}>0$`
            } else {
              texteCorr += `De plus : $${(num_a + num_b) * denom_d - num_b * (denom_c + denom_d)}<0$`
            }
            texteCorr += '<br>'
            texteCorr += 'On peut alors en déduire le tableau de signe suivant :'
            texteCorr += '<br>' + monTableau
            texteCorr += '<br>'
            if (-denom_d / denom_c >= 0) {
              if (numerateur >= 0) {
                texteCorr += `On peut alors en déduire que $u_{n+1}-u_n > 0$ pour tout $n \\geqslant ${texNombre(Math.ceil(-denom_d / denom_c))}$.`
                texteCorr += '<br>'
                texteCorr += '<br>'
                texteCorr += `La suite $(u_n)$ est donc croissante à partir du rang $${texNombre(Math.ceil(-denom_d / denom_c))}$.`
              } else {
                texteCorr += `On peut alors en déduire que $u_{n+1}-u_n < 0$ pour tout $n \\geqslant ${texNombre(Math.ceil(-denom_d / denom_c))}$.`
                texteCorr += '<br>'
                texteCorr += '<br>'
                texteCorr += `La suite $(u_n)$ est donc décroissante à partir du rang $${texNombre(Math.ceil(-denom_d / denom_c))}$.`
              }
            } else {
              if (numerateur >= 0) {
                texteCorr += 'On peut alors en déduire que $u_{n+1}-u_n > 0$, soit $u_{n+1} > u_n$ pour tout entier $\\in\\mathbb{N}$.'
                texteCorr += '<br>'
                texteCorr += 'La suite $(u_n)$ est donc croissante sur $\\mathbb{N}$.'
              } else {
                texteCorr += 'On peut alors en déduire que $u_{n+1}-u_n < 0$ pour tout entier $\\in\\mathbb{N}$.'
                texteCorr += '<br>'
                texteCorr += 'La suite $(u_n)$ est donc décroissante sur $\\mathbb{N}$.'
              }
            }
          }
          break
      }

      if (this.questionJamaisPosee(i, alea1, alea2)) { // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte) // Sinon on enregistre la question dans listeQuestions
        this.listeCorrections.push(texteCorr) // On fait pareil pour la correction
        i++ // On passe à la question suivante
      }
      cpt++ // Sinon on incrémente le compteur d'essai pour avoir une question nouvelle
    }
    listeQuestionsToContenu(this) // La liste de question et la liste de la correction

    // sont transformés en chaine de caractère (avec une liste HTML ou LaTeX suivant le contexte)
  }
  // this.besoinFormulaireNumerique = ['Niveau de difficulté',3];
  // On aurait pu ajouter un formulaire pour régler le niveau de difficulté à l'aide de l'attribut this.sup
}
