import seedrandom from 'seedrandom'
/**
 * À partir d'un tableau passé en paramètre, construit un nouveau
 * tableau où l'ordre des éléments aura changé aléatoirement.
 *
 * <i>Principe :
 * <ol>
 * <li>on ajoute à chaque élément du tableau
 * une clé qui est un nombre aléatoire</li>
 * <li>on classe le tableau suivant ces clés</li>
 * <li>on reconstruit le tableau en enlevant les clés</li>
 * </ol></i>
 * [Source]{@link https://stackoverflow.com/a/46545530}
 * @param {Array.} unshuffledArray tableau à mélanger
 * @returns {Array.} un nouveau tableau mélangé
 * @author sylvain
 */
export const shuffle = <T>(unshuffledArray: T[]) => {
  const randomNumber = seedrandom()
  return unshuffledArray
    .map(value => ({ value, sortingKey: randomNumber() }))
    .sort((a, b) => a.sortingKey - b.sortingKey)
    .map(({ value }) => value)
}

/**
 * Construit une liste d'index aléatoires basée sur la taille
 * du tableau originel et le nombre d'index à prélever dans
 * ce tableau.
 * @param {number} originalArraySize taille du tableau d'origine
 * @param {number} nbOfIndexes nombre d'index à choisir
 * @returns {number[]} tableau d'index
 * @author sylvain
 */
export function listOfRandomIndexes (originalArraySize: number, nbOfIndexes: number) {
  const indexes = shuffle([...Array(originalArraySize).keys()])
  return indexes.slice(0, nbOfIndexes)
}

export default shuffle
