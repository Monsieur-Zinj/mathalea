import { arrondi } from '../../lib/outils/nombres'
import { numAlpha, sp } from '../../lib/outils/outilString.js'
import { personne, prenom, prenomF } from '../../lib/outils/Personne'
import { texPrix } from '../../lib/format/style'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { context } from '../../modules/context.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { max, min } from 'mathjs'
import { setReponse } from '../../lib/interactif/gestionInteractif.js'

export const interactifReady = true
export const interactifType = 'mathLive'
export const titre = 'Résoudre des problèmes (plus complexes)'
export const dateDePublication = '27/11/2022'
export const dateDeModifImportante = '14/05/2023' // par EE : Décoquillage et passage en interactif

/**
 * Résoudre des problèmes (plus complexes)
 * @author Mikael Guironnet
 * Relecture typographique par Rémi Angot
 * Référence 6C32-1
 */
export const uuid = 'e906e'
export const ref = '6C32-1'
export const refs = {
  'fr-fr': ['6C32-1'],
  'fr-ch': []
}
export default function ExerciceProblemesComplexes () {
  // Multiplier deux nombres
  Exercice.call(this) // Héritage de la classe Exercice()
  this.sup = 11
  this.titre = titre
  this.spacing = 1.5
  if (context.isHtml) this.spacingCorr = 1.5
  this.nbQuestions = 3

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées

    const listeDesProblemes = gestionnaireFormulaireTexte({
      max: 10,
      defaut: 11,
      melange: 11,
      nbQuestions: this.nbQuestions,
      shuffle: false, // A GARDER POUR DEBUGGAGE
      saisie: this.sup
    })
    let indiceInteractif = 0
    for (let i = 0, cpt = 0, texte, texteCorr; i < this.nbQuestions && cpt < 50; cpt++) {
      texte = ''
      texteCorr = ''
      switch (listeDesProblemes[i]) {
        case 1 : {
          const calAgneau = 3 + randint(1, 3) * 0.1 // 3.3
          const calEpinards = 0.3 + randint(1, 3) * 0.01 // 0.32
          const calFro = 1 + randint(1, 3) * 0.1 // 1.2
          const calPom = 0.5 + randint(1, 3) * 0.01 // 0.52
          const quaAgneau = 120 + randint(1, 9) // 125
          const quaEpinards = 150 + randint(0, 5) // 150
          const quaFro = 40 + randint(0, 9) // 45
          const quaPom = 120 + randint(0, 5) // 120
          const personnage = personne()
          const prenomFP = personnage.prenom
          texte += `${prenomFP} suit un régime et ne doit pas absorber plus de $700$ calories par repas.<br>
                   Aujourd'hui, ${personnage.pronom} a mangé le repas suivant :<br>
                   une côtelette d'agneau de $${quaAgneau}$ g,<br> $${quaEpinards}$ g d'épinards,<br> $${quaFro}$ g de fromage blanc <br> et une pomme de $${quaPom}$ g. <br>
                   <br>On sait que $1$ g d'agneau fournit $${texNombre(calAgneau)}$ calories, <br> $1$ g d'épinards fournit $${texNombre(calEpinards)}$ calories, <br> $1$ g de fromage blanc fournit $${texNombre(calFro)}$ calories <br> et $1$ g de pomme $${texNombre(calPom)}$ calories.<br>`
          texteCorr += `Agneau : $${quaAgneau}\\times ${texNombre(calAgneau)} =   ${texNombre(calAgneau * quaAgneau)}$ calories. <br>
                        Epinards : $${quaEpinards}\\times ${texNombre(calEpinards)} =   ${texNombre(calEpinards * quaEpinards)}$ calories. <br>
                        Fromage blanc : $${quaFro}\\times ${texNombre(calFro)} =   ${texNombre(calFro * quaFro)}$ calories. <br>
                        Pomme : $${quaPom}\\times ${texNombre(calPom)} =   ${texNombre(calPom * quaPom)}$ calories. <br>
                        Cela fait un total de : $${texNombre(calAgneau * quaAgneau)} + ${texNombre(calEpinards * quaEpinards)} + ${texNombre(calFro * quaFro)} + ${texNombre(calPom * quaPom)} =  ${texNombre(calAgneau * quaAgneau + calEpinards * quaEpinards + calFro * quaFro + calPom * quaPom)} $ calories.<br>
                        ${calAgneau * quaAgneau + calEpinards * quaEpinards + calFro * quaFro + calPom * quaPom < 700 ? `${personnage.Pronom} respecte son règime` : `${personnage.Pronom} ne respecte pas son règime`}
                        car $${texNombre(calAgneau * quaAgneau + calEpinards * quaEpinards + calFro * quaFro + calPom * quaPom)} ${calAgneau * quaAgneau + calEpinards * quaEpinards + calFro * quaFro + calPom * quaPom < 700 ? '< 700' : '> 700'}$.`
          if (this.interactif) {
            texte += '<br>' + numAlpha(0) + `Combien de calories fournit une côtelette d'agneau de $${quaAgneau}$ g ?`
            setReponse(this, indiceInteractif, calAgneau * quaAgneau)
            texte += ajouteChampTexteMathLive(this, indiceInteractif, 'inline largeur25', { texteApres: ' calories' })

            texte += '<br>' + numAlpha(1) + `Combien de calories fournit $${quaEpinards}$ g d'épinards ?`
            setReponse(this, indiceInteractif + 1, calEpinards * quaEpinards)
            texte += ajouteChampTexteMathLive(this, indiceInteractif + 1, 'inline largeur25', { texteApres: ' calories' })

            texte += '<br>' + numAlpha(2) + `Combien de calories fournit $${quaFro}$ g de fromage blanc ?`
            setReponse(this, indiceInteractif + 2, calFro * quaFro)
            texte += ajouteChampTexteMathLive(this, indiceInteractif + 2, 'inline largeur25', { texteApres: ' calories' })

            texte += '<br>' + numAlpha(3) + `Combien de calories fournit une pomme de $${quaPom}$ g ?`
            setReponse(this, indiceInteractif + 3, calPom * quaPom)
            texte += ajouteChampTexteMathLive(this, indiceInteractif + 3, 'inline largeur25', { texteApres: ' calories' })

            texte += '<br>' + numAlpha(4)
          }
          texte += `${prenomFP} respecte-t-${personnage.pronom} son régime ?`
          setReponse(this, indiceInteractif + 4, calAgneau * quaAgneau + calEpinards * quaEpinards + calFro * quaFro + calPom * quaPom < 700 ? ['Oui', 'OUI', 'oui'] : ['Non', 'NON', 'non'])
          texte += ajouteChampTexteMathLive(this, indiceInteractif + 4, 'inline largeur25')

          indiceInteractif += 5

          break
        }
        case 2 : {
          const quaFro1 = 130 + randint(0, 9) // 133
          const masseFro1 = 2.3 + randint(0, 9) * 0.01 // 2,340
          const quaFro2 = 120 + randint(0, 9) // 122
          const masseFro2 = 3.1 + randint(0, 9) * 0.01 // 3,115
          const total = quaFro1 * masseFro1 + quaFro2 * masseFro2
          texte += `Le livreur d'une fromagerie charge $${quaFro1}$ fromages pesant chacun $${texNombre(masseFro1)}$ kg <br>
                                  et $${quaFro2}$ autres pesant chacun $${texNombre(masseFro2)}$ kg dans une voiture pouvant transporter $550$ kg.<br>
                                  Le véhicule est-il en surcharge ?`
          setReponse(this, indiceInteractif, total > 550 ? ['Oui', 'OUI', 'oui'] : ['Non', 'NON', 'non'])
          texte += ajouteChampTexteMathLive(this, indiceInteractif, 'inline largeur25')

          texte += '<br>Si oui, de combien ? Si non, combien reste-t-il ?'
          setReponse(this, indiceInteractif + 1, total > 550 ? total - 550 : 550 - total)
          texte += ajouteChampTexteMathLive(this, indiceInteractif + 1, 'inline largeur25', { texteApres: ' kg' })

          texteCorr += `Première sorte de fromage : $${quaFro1}\\times ${texNombre(masseFro1)}${sp()}\\text{kg} =   ${texNombre(quaFro1 * masseFro1)}${sp()}\\text{kg}$. <br>
                        Deuxième sorte de fromage : $${quaFro2}\\times ${texNombre(masseFro2)}${sp()}\\text{kg} =   ${texNombre(quaFro2 * masseFro2)}${sp()}\\text{kg}$. <br>
                        Cela fait un total de $${texNombre(quaFro1 * masseFro1)}${sp()}\\text{kg} + ${texNombre(quaFro2 * masseFro2)}${sp()}\\text{kg} = ${texNombre(quaFro1 * masseFro1 + quaFro2 * masseFro2)}${sp()}\\text{kg}$.<br>
                        ${total > 550 ? `La surcharge est de : $${texNombre(total)}${sp()}\\text{kg} - 550${sp()}\\text{kg} = ${texNombre(total - 550)}${sp()}\\text{kg}$.` : `Il n'y a pas de surcharge et il reste : $550${sp()}\\text{kg} - ${texNombre(total)}${sp()}\\text{kg} = ${texNombre(550 - total)}${sp()}\\text{kg}$.`}`

          indiceInteractif += 2

          break
        }
        case 3 : {
          const k1 = randint(1, 8) * 0.1 // 0.4
          const k2 = randint(10, 30) // 25
          const n1 = randint(2, 9)
          const n2 = randint(2, 9, [n1])
          texte += `On considère le programme de calcul :<br>
          • Choisir un nombre.<br>
          • Multiplier ce nombre par $${texNombre(k1)}$.<br>
          • Multiplier le résultat par $${texNombre(k2)}$.<br>`
          if (!this.interactif) {
            texte += `<br>${numAlpha(0)} Effectuer ce programme avec $${n1}$ et  $${n2}$.
            <br>${numAlpha(1)} Remplacer ce programme par un programme plus court. Expliquer.`
          } else {
            texte += `<br>${numAlpha(0)} Effectuer ce programme avec $${n1}$.`
            setReponse(this, indiceInteractif, arrondi(n1 * k1 * k2, 2))
            texte += ajouteChampTexteMathLive(this, indiceInteractif, 'inline largeur25')

            texte += `<br>${numAlpha(1)} Effectuer ce programme avec $${n2}$.`
            setReponse(this, indiceInteractif + 1, arrondi(n2 * k1 * k2, 2))
            texte += ajouteChampTexteMathLive(this, indiceInteractif + 1, 'inline largeur25')
          }
          texteCorr += `${numAlpha(0)} Si le nombre est $${n1}$ :<br>
                        • $${n1} \\times ${texNombre(k1)} = ${texNombre(n1 * k1)}$ ;<br>
                        • $${texNombre(n1 * k1)} \\times ${texNombre(k2)} = ${texNombre(n1 * k1 * k2)}$.<br>
                        Si le nombre est $${n2}$ :<br>
                        • $${n2} \\times ${texNombre(k1)} = ${texNombre(n2 * k1)}$ ;<br>
                        • $${texNombre(n2 * k1)} \\times ${texNombre(k2)} = ${texNombre(n2 * k1 * k2)}$.<br>
                        ${numAlpha(1)} Le programme de calcul se résume par cette expression :<br>
                        « nombre de départ $\\times ${texNombre(k1)} \\times ${texNombre(k2)}$ » <br>
                        C'est une expression avec uniquement des multiplications, il n'y a pas priorité, <br>
                        elle se résume par : « nombre de départ $\\times ${texNombre(k1 * k2)}$ » car : $${texNombre(k1)}\\times${texNombre(k2)}=${texNombre(k1 * k2)}$.<br>
                        Donc le programme peut être le suivant : <br>
                        • Choisir un nombre.<br>
                        • Multiplier ce nombre par $${texNombre(k1 * k2)}$.<br>`

          indiceInteractif += 2

          break
        }
        case 4 : {
          const range = randint(20, 40) // 35
          const fauteuils = randint(10, 20) // 12
          const prix = randint(5, 12) + randint(5, 8) * 0.1
          const n1 = randint(10, 15)
          texte += `Dans une salle de cinéma, il y a $${range}$ rangées de $${fauteuils}$ fauteuils.<br>
                    Le prix d'une place pour une séance est de $${texPrix(prix)}$ €.<br>
                  ${numAlpha(0)} Si toutes les places sont occupées, quelle est la somme d'argent récoltée ?`
          setReponse(this, indiceInteractif, arrondi(fauteuils * range * prix, 2))
          texte += ajouteChampTexteMathLive(this, indiceInteractif, 'inline largeur25', { texteApres: ' €' })

          texte += `<br>
                  ${numAlpha(1)} Pour une autre séance, $${n1}$ rangées sont pleines, le reste des
                  rangées étant vides. Quelle est la recette pour cette séance ?`
          setReponse(this, indiceInteractif + 1, arrondi(fauteuils * n1 * prix, 2))
          texte += ajouteChampTexteMathLive(this, indiceInteractif + 1, 'inline largeur25', { texteApres: ' €' })

          texteCorr += `${numAlpha(0)} $${range} \\times ${fauteuils} =${fauteuils * range}$<br>
                        Il y a $${fauteuils * range}$ places dans la salle.<br>
                        $${fauteuils * range} \\times ${texPrix(prix)} = ${texPrix(fauteuils * range * prix)}$<br>
                        La somme d'argent perçue est $${texPrix(fauteuils * range * prix)}$ €.<br>
                        ${numAlpha(1)} $${n1} \\times ${fauteuils} =${fauteuils * n1}$<br>
                        Il y a $${fauteuils * n1}$ places occupées dans la salle.<br>
                        $${fauteuils * n1} \\times ${texNombre(prix)} = ${texNombre(fauteuils * n1 * prix)}$<br>
                        La somme d'argent perçue est $${texPrix(fauteuils * n1 * prix)}$ €.<br>`

          indiceInteractif += 2

          break
        }
        case 5 : {
          const min = randint(1, 5) * 10 //  30
          const longueur = randint(2, 9) * 30 // 600m
          const nombreP = randint(3, 8)
          texte += `Avant l'arrivée du numérique, au cinéma, la pellicule était utilisée pour projeter des films.<br>
                   Le format souvent utilisé était le format $35$ mm ce qui signifie que la pellicule faisait $35$ mm de largeur.<br>
                   Avec $24$ images par seconde, une pellicule de film de $30$ mètres de long représente $1$ minute de projection.<br>
                   Pour projeter un film, plusieurs pellicules étaient nécessaires et le projectionniste avait pour rôle de les changer.<br>
                   ${numAlpha(0)} Si le film a $${nombreP}$ pellicules de $600$ m, quelle est la longueur totale en mètres du film ?`
          setReponse(this, indiceInteractif, arrondi(nombreP * 600, 2))
          texte += ajouteChampTexteMathLive(this, indiceInteractif, 'inline largeur25', { texteApres: ' m' })

          texte += `<br> ${numAlpha(1)} Si le film a $${nombreP}$ pellicules de $600$ m, quelle est la durée totale du film ?`
          setReponse(this, indiceInteractif + 1, arrondi(nombreP * 20, 2))
          texte += ajouteChampTexteMathLive(this, indiceInteractif + 1, 'inline largeur25', { texteApres: ' minutes' })

          texte += `<br>${numAlpha(2)} Si le film dure $1${sp()}\\text{h}${sp()}${min}$, quelle est la longueur totale, en mètres, du film ?`
          setReponse(this, indiceInteractif + 2, arrondi((60 + min) * 30, 2))
          texte += ajouteChampTexteMathLive(this, indiceInteractif + 2, 'inline largeur25', { texteApres: ' m' })

          texte += `<br>${numAlpha(3)} Si le film dure $1${sp()}\\text{h}${sp()}${min}$, combien faut-il de pellicules entières de $600$ m ?`
          setReponse(this, indiceInteractif + 3, Math.floor(((60 + min) * 30) / 600))
          texte += ajouteChampTexteMathLive(this, indiceInteractif + 3, 'inline largeur25', { texteApres: ' pellicules entières de $600$ m' })

          texte += `<br>${numAlpha(4)} Si la pellicule mesure $${longueur}$ m, quelle est la durée de la pellicule ?`
          setReponse(this, indiceInteractif + 4, Math.floor(longueur / 30))
          texte += ajouteChampTexteMathLive(this, indiceInteractif + 4, 'inline largeur25', { texteApres: ' minutes' })

          texte += `<br>${numAlpha(5)} Si la pellicule mesure $${longueur}$ m, combien d'images y a-t-il sur la pellicule ?`
          setReponse(this, indiceInteractif + 5, Math.floor(longueur / 30) * 60 * 24)
          texte += ajouteChampTexteMathLive(this, indiceInteractif + 5, 'inline largeur25', { texteApres: ' images' })

          texteCorr += `${numAlpha(0)} $${nombreP}${sp()}\\text{ pellicules} \\times 600${sp()}\\text{m} = ${texNombre(nombreP * 600)}${sp()}\\text{m}$<br>
                        La longueur totale du film est de $${texNombre(nombreP * 600)}$ mètres.<br>
                        ${numAlpha(1)} $30${sp()}\\text{m} \\times 20 = 600${sp()}\\text{m}$ donc une pellicule de $600$ m représente $1${sp()}\\text{min} \\times 20 = 20${sp()}\\text{min}$.<br>
                        $${nombreP}${sp()}\\text{pellicules} \\times 20${sp()}\\text{min} = ${texNombre(nombreP * 20)}${sp()}\\text{min}$<br>
                        La durée totale du film est de $${texNombre(nombreP * 20)}$ minutes.<br>
                        ${numAlpha(2)} $${60 + min}${sp()}\\text{min} \\times 30${sp()}\\text{m}= ${texNombre((60 + min) * 30)}${sp()}\\text{m}$<br>
                        La longueur totale en mètres d'un film de $1${sp()}\\text{h}${sp()}${min}$ est de $${texNombre((60 + min) * 30)}$ mètres.<br>
                        ${numAlpha(3)} $${texNombre(Math.floor(((60 + min) * 30) / 600))} \\times 600${sp()}\\text{m} = ${texNombre(Math.floor(((60 + min) * 30) / 600) * 600)}${sp()}\\text{m}$`
          texteCorr += ((60 + min) * 30) - Math.floor(((60 + min) * 30) / 600) * 600 !== 0
            ? ` et $${texNombre(1 + Math.floor(((60 + min) * 30) / 600))} \\times 600${sp()}\\text{m} = ${texNombre((1 + Math.floor(((60 + min) * 30) / 600)) * 600)}${sp()}\\text{m}$.`
            : ''
          texteCorr += `<br>Donc il faut $${texNombre(Math.floor(((60 + min) * 30) / 600))}$ bobines de $600$ mètres`

          texteCorr += ((60 + min) * 30) - Math.floor(((60 + min) * 30) / 600) * 600 !== 0 ? ` (et $1$ bobine de  $${texNombre(((60 + min) * 30) - Math.floor(((60 + min) * 30) / 600) * 600)}$ mètres).<br>` : '.<br>'
          texteCorr += `${numAlpha(4)} $${texNombre(Math.floor(longueur / 30))} \\times 30${sp()}\\text{m} = ${texNombre(longueur)}$ m<br>
                        Donc la durée de la pellicule est de $${texNombre(Math.floor(longueur / 30))}$ minutes.<br>
                        ${numAlpha(5)} $${texNombre(Math.floor(longueur / 30))} \\times 60 = ${texNombre(Math.floor(longueur / 30)) * 60}$ secondes<br>
                        $${texNombre(Math.floor(longueur / 30)) * 60}${sp()}\\text{secondes} \\times 24${sp()}\\text{images} = ${texNombre(Math.floor(longueur / 30) * 60 * 24)}${sp()}\\text{images}$<br>
                        Il y a $${texNombre(Math.floor(longueur / 30) * 60 * 24)}${sp()}\\text{images}$ dans la pellicule.`

          indiceInteractif += 6

          break
        }
        case 6 : {
          const nbBo = randint(2, 5)
          const prixBo = 1 + randint(1, 9) * 0.1 + randint(1, 9) * 0.01
          const nbSch = randint(2, 5, [nbBo])
          const prixSch = 3 + randint(1, 9) * 0.1 + randint(1, 9) * 0.01
          const prenomAcheteur = prenom()
          texte += `Dans une boulangerie, ${prenomAcheteur} achète ${nbSch} sandwichs à $${texNombre(prixSch)}$ € chacun.<br>
                    et ${nbBo} boissons à $${texNombre(prixBo, 2)}$ € chacune.<br>
                    ${prenomAcheteur} a un billet de 50 €, combien va lui rendre le caissier ?`
          setReponse(this, indiceInteractif, 50 - (nbBo * prixBo + nbSch * prixSch))
          texte += ajouteChampTexteMathLive(this, indiceInteractif, 'inline largeur25', { texteApres: ' €' })

          texteCorr += `$${nbSch} \\times ${texNombre(prixSch, 2)} =${texNombre(nbSch * prixSch, 2)}$<br>
                        Le prix des sandwichs est de $${texPrix(nbSch * prixSch)}$ €.<br>
                        $${nbBo} \\times ${texNombre(prixBo)} =${texNombre(nbBo * prixBo, 2)}$<br>
                        Le prix des boisons est de $${texPrix(nbBo * prixBo)}$ €.<br>
                        $${texNombre(nbBo * prixBo, 2)} + ${texNombre(nbSch * prixSch, 2)} =${texNombre(nbBo * prixBo + nbSch * prixSch, 2)}$<br>
                        Le prix total à payer est $${texPrix(nbBo * prixBo + nbSch * prixSch, 2)}$ €.<br>
                        $50 -  (${texNombre(nbBo * prixBo)} + ${texNombre(nbSch * prixSch, 2)}) = ${texNombre(50 - (nbBo * prixBo + nbSch * prixSch), 2)}$<br>
                        Le caissier va rendre la somme de $${texPrix(50 - (nbBo * prixBo + nbSch * prixSch))}$ €.<br>`

          indiceInteractif++

          break
        }
        case 7 : {
          const nbCagettes = randint(2, 5)
          const kgOranges = 5 + randint(2, 5) * 0.1
          const prixOranges = 6 + randint(2, 9) * 0.1 + randint(2, 9) * 0.01
          const prixOrangesKg = 1 + randint(5, 9) * 0.1
          texte += `Un commerçant achète $${nbCagettes}$ cagettes d'oranges. Chaque cagette contient <br>
                    $${texNombre(kgOranges)}$ kg d'oranges et coûte $${texPrix(prixOranges)}$ €.<br>
                    Le commerçant revend les oranges $${texPrix(prixOrangesKg)}$ € le kilogramme.<br>
                    Quel est son bénéfice s'il réussit à tout vendre ?`
          setReponse(this, indiceInteractif, nbCagettes * kgOranges * prixOrangesKg - nbCagettes * prixOranges)
          texte += ajouteChampTexteMathLive(this, indiceInteractif, 'inline largeur25', { texteApres: ' €' })

          texteCorr += `$${nbCagettes} \\times ${texNombre(kgOranges)} =${texNombre(nbCagettes * kgOranges)}$<br>
                        Il y a $${texNombre(nbCagettes * kgOranges)}$ kg d'oranges.<br>
                        $${texNombre(nbCagettes)} \\times ${texNombre(prixOranges)} =${texNombre(nbCagettes * prixOranges)}$<br>
                        Ce qui lui coûte $${texPrix(nbCagettes * prixOranges)}$ €.<br>
                        $${texNombre(nbCagettes * kgOranges)} \\times ${texNombre(prixOrangesKg)} =${texNombre(nbCagettes * kgOranges * prixOrangesKg)}$<br>
                        S'il revend tout, il va gagner $${texPrix(nbCagettes * kgOranges * prixOrangesKg)}$ €.<br>
                        $${texNombre(nbCagettes * kgOranges * prixOrangesKg)} - ${texNombre(nbCagettes * prixOranges)} = ${texNombre(nbCagettes * kgOranges * prixOrangesKg - nbCagettes * prixOranges)}$<br>
                        Le bénéfice sera alors de $${texPrix(nbCagettes * kgOranges * prixOrangesKg - nbCagettes * prixOranges)}$ €.<br>`

          indiceInteractif++

          break
        }
        case 8 : {
          const nbDix = randint(10, 20)
          const nbCinq = randint(10, 20, [nbDix])
          const prenomFe = prenomF()
          texte += `${prenomFe} a dans sa tirelire uniquement des billets de $5$ € et de $10$ €.<br>
                    Au total, elle a $${texNombre(nbDix + nbCinq)}$ billets qui représentent $${texNombre(nbDix * 10 + nbCinq * 5)}$ €.<br>`
          if (!this.interactif) {
            texte += 'Combien a-t-elle de billets de $5$ € et de $10$ € ?<br>'
          } else {
            texte += 'Combien a-t-elle de billets de $5$ € ?'
            setReponse(this, indiceInteractif, nbCinq)
            texte += ajouteChampTexteMathLive(this, indiceInteractif, 'inline largeur25', { texteApres: ' billets de 5 €' })

            texte += '<br>Combien a-t-elle de billets de $10$ € ?'
            setReponse(this, indiceInteractif + 1, nbDix)
            texte += ajouteChampTexteMathLive(this, indiceInteractif + 1, 'inline largeur25', { texteApres: ' billets de 10 €' })
          }
          texteCorr += `Après plusieurs essais, on trouve qu'elle a $${nbDix}$ billets de 10 € et $${nbCinq}$ billets de 5 €.`
          texteCorr += `<br><br>Vérification :<br>
                    Nombre de billets : $${nbDix} \\text{ billets de 10 €} +  ${nbCinq} \\text{ billets de 5 €} =${texNombre(nbDix + nbCinq)}${sp()}\\text{billets}$.<br>
                    Somme d'argent : $${nbDix} \\times 10${sp()}\\text{€} +  ${nbCinq} \\times 5${sp()}\\text{€} =${texNombre(nbDix * 10 + nbCinq * 5)}${sp()}\\text{€}$.`

          indiceInteractif += 2

          break
        }
        case 9 : {
          const nbBarquettesFr = randint(20, 30)
          const gBarquettesFr = 250 * randint(2, 5)
          const prixFr = 7 + randint(2, 5) * 0.1
          const nbBarquettesMy = randint(20, 30, [nbBarquettesFr])
          const gBarquettesMy = 250 * randint(2, 5)
          const prixMy = 8 + randint(2, 5) * 0.1
          const prixFinal = nbBarquettesFr * gBarquettesFr * 0.001 * prixFr + nbBarquettesMy * gBarquettesMy * 0.001 * prixMy
          const isEnviron = Math.abs(prixFinal * 100 - Math.round(prixFinal * 100)) > 0.001 ? 'environ' : ''
          texte += `Un marchand de fruits vend $${nbBarquettesFr}$ barquettes de $${texNombre(gBarquettesFr)}$ g de fraises des bois à $${texPrix(prixFr)}$ € le kg<br>
                    et $${nbBarquettesMy}$ barquettes de $${texNombre(gBarquettesMy)}$ g de myrtilles des bois à $${texPrix(prixMy)}$ € le kg.<br>
                    Combien d'argent lui rapporte cette vente ?`
          setReponse(this, indiceInteractif, prixFinal)
          texte += ajouteChampTexteMathLive(this, indiceInteractif, 'inline largeur25', { texteApres: ' €' })

          texteCorr += `$${nbBarquettesFr} \\times ${texNombre(gBarquettesFr)}${sp()}\\text{g} = ${texNombre(nbBarquettesFr * gBarquettesFr)}${sp()}\\text{g}$ de fraises.<br>
                        $${texNombre(nbBarquettesFr * gBarquettesFr)}${sp()}\\text{g} \\div 1${sp()}000 = ${texNombre(nbBarquettesFr * gBarquettesFr * 0.001, 4)} $ kg de fraises.<br>
                        $${texNombre(nbBarquettesFr * gBarquettesFr * 0.001)}${sp()}\\text{kg} \\times ${texNombre(prixFr)}${sp()}\\text{€/kg} =${texNombre(nbBarquettesFr * gBarquettesFr * 0.001 * prixFr)}$ € pour les fraises.<br>
                        $${nbBarquettesMy} \\times ${texNombre(gBarquettesMy)}${sp()}\\text{g} = ${texNombre(nbBarquettesMy * gBarquettesMy)}${sp()}\\text{g}$ de myrtilles.<br>
                        $${texNombre(nbBarquettesMy * gBarquettesMy)}${sp()}\\text{g} \\div 1${sp()}000 = ${texNombre(nbBarquettesMy * gBarquettesMy * 0.001)}${sp()}\\text{kg}$ de myrtilles.<br>
                        $${texNombre(nbBarquettesMy * gBarquettesMy * 0.001)}${sp()}\\text{kg} \\times ${texNombre(prixMy)}${sp()}\\text{€/kg} =${texNombre(nbBarquettesMy * gBarquettesMy * 0.001 * prixMy)}$ € pour les myrtilles.<br>
                        $${texNombre(nbBarquettesFr * gBarquettesFr * 0.001 * prixFr)} + ${texNombre(nbBarquettesMy * gBarquettesMy * 0.001 * prixMy)} = ${texNombre(nbBarquettesFr * gBarquettesFr * 0.001 * prixFr + nbBarquettesMy * gBarquettesMy * 0.001 * prixMy)}$<br>
                        Cette vente va lui rapporter ${isEnviron} $${texPrix(prixFinal)}$ €.<br>`

          indiceInteractif++

          break
        }
        case 10 : {
          const nbP = randint(5, 10)
          const nbD = randint(2, nbP - 1)
          const opP = randint(1, 3)
          const opD = randint(1, 3, [opP])
          texte += `Devinette : je pense à deux nombres entiers.<br>
                    Si j'effectue ${opP === 1 ? 'la somme' : opP === 2 ? 'la différence' : 'le produit'} entre ses deux nombres,
                    alors j'obtiens $${opP === 1 ? texNombre(nbP + nbD) : opP === 2 ? texNombre(nbP - nbD) : texNombre(nbP * nbD)}$.<br>
                    Si j'effectue ${opD === 1 ? 'la somme' : opD === 2 ? 'la différence' : 'le produit'} entre ses deux nombres,
                    alors j'obtiens $${opD === 1 ? texNombre(nbP + nbD) : opD === 2 ? texNombre(nbP - nbD) : texNombre(nbP * nbD)}$.<br>`
          if (!this.interactif) {
            texte += 'Quels sont ces deux nombres ?'
          } else {
            texte += 'Quel est le plus petit de ces deux nombres ?'
            setReponse(this, indiceInteractif, min(nbP, nbD))
            texte += ajouteChampTexteMathLive(this, indiceInteractif, 'inline largeur25')

            texte += 'Quel est le plus grand de ces deux nombres ?'
            setReponse(this, indiceInteractif + 1, max(nbP, nbD))
            texte += ajouteChampTexteMathLive(this, indiceInteractif + 1, 'inline largeur25')
          }

          texteCorr += `Par essais-erreurs, on trouve ${nbP} et ${nbD}.<br>
                        Vérification :<br>
                        $${nbP} ${opP === 1 ? '+' : opP === 2 ? '-' : '\\times'} ${nbD} = ${opP === 1 ? texNombre(nbP + nbD) : opP === 2 ? texNombre(nbP - nbD) : texNombre(nbP * nbD)}$<br>
                        $${nbP} ${opD === 1 ? '+' : opD === 2 ? '-' : '\\times'} ${nbD} = ${opD === 1 ? texNombre(nbP + nbD) : opD === 2 ? texNombre(nbP - nbD) : texNombre(nbP * nbD)}$<br>
                        `

          indiceInteractif += 2

          break
        }
      }

      if (this.listeQuestions.indexOf(texte) === -1) {
        // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireTexte = ['Type de questions', [
    'Nombres séparés par des tirets',
    '1 : Régime alimentaire',
    '2 : Fromagerie',
    '3 : Programme de calcul',
    '4 : Cinéma (siège)',
    '5 : Cinéma (pellicule)',
    '6 : Boulangerie (sandwichs)',
    '7 : Cagettes',
    '8 : Billets',
    '9 : Fruits',
    '10 : Devinette',
    '11 : Mélange'
  ].join('\n')
  ]
}
