/** Renvoie une liste exhaustive de tableaux contenant les mêmes élèments que tab mais jamais dans le même ordre
 * Fonction fort utile quand reponse est une suite de nombres par exemple. Voir ligne 111 Exercice 3A10-6.
 * Gros défaut :  Si tab contient plus de 6 éléments, cette fonction est chronophage. A ne pas utiliser
 * @example reponse = diversesReponsesPossibles([3,4,5]) renvoie [[3,4,5],[3,5,4],[4,3,5],[4,5,3],[5,3,4],[5,4,3]]
 * et ensuite pour les tous les i : reponse[i]=reponse[i].join(';') et reponse contient alors toutes les réponses possibles
 * @author Eric Elter
 * Septembre 2022
 */
export function diversesReponsesPossibles (tab) {
  let tab2, tab3
  const rep = []
  if (tab.length === 1) return (tab)
  for (let ee = 0; ee < tab.length; ee++) {
    tab2 = tab.slice()
    tab2.splice(ee, 1)
    tab3 = diversesReponsesPossibles(tab2)
    for (let k = 0; k < tab3.length; k++) {
      rep.push([tab[ee]].concat(tab3[k]))
    }
  }
  return rep
}
