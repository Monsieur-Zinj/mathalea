<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import Button from '../forms/Button.svelte'
  import Chip from '../forms/Chip.svelte'
  import { getUniqueStringBasedOnTimeStamp } from '../utils/time'

  export let isVisible: boolean = false
  const levelsMap = new Map([
    [
      '6e',
      {
        title: 'Sixième',
        values: ['6e']
      }
    ],
    [
      '5e',
      {
        title: 'Cinquième',
        values: ['5e']
      }
    ],
    [
      '4e',
      {
        title: 'Quatrième',
        values: ['4e']
      }
    ],
    [
      '3e',
      {
        title: 'Troisième',
        values: ['3e']
      }
    ],
    [
      'college',
      {
        title: 'Collège',
        values: ['6e', '5e', '4e', '3e']
      }
    ],
    [
      '2e',
      {
        title: 'Seconde',
        values: ['2e']
      }
    ],
    [
      '1e',
      {
        title: 'Première',
        values: ['1e']
      }
    ],
    [
      '1techno',
      {
        title: 'Première Technologique',
        values: ['1techno']
      }
    ],
    [
      'Ex',
      {
        title: 'Terminale Expert',
        values: ['Ex']
      }
    ],
    [
      'HP',
      {
        title: 'Hors-Programme (Lycée)',
        values: ['HP']
      }
    ],
    [
      'lycee',
      {
        title: 'Lycée',
        values: ['2e', '1e', '1techno', 'Ex', 'HP']
      }
    ],
    [
      'crpe',
      {
        title: 'CRPE',
        values: ['crpe']
      }
    ]
  ])

  const typesMap = new Map([
    [
      'interactif',
      {
        title: 'Interactif',
        values: ['interactif']
      }
    ],
    [
      'amc',
      {
        title: 'AMC (AutoMultipleChoice)',
        values: ['amc']
      }
    ],
    [
      'static',
      {
        title: 'Statique',
        values: ['static']
      }
    ]
  ])

  // pour pouvoir différentier les ID des checkboxes
  const timeTag = getUniqueStringBasedOnTimeStamp()

  $: selectedFilters = []

  let levelsBoxes = {}
  const multipleSelections = ['college', 'lycee']
  /**
   * Mise à jour des checkboxes des filtres de niveaux
   * (prise en compte des sélections multiples comme `college` ou `lycee`)
   */
  function updateLevelsBoxes () {
    levelsBoxes = {}
    for (const key of levelsMap.keys()) {
      if (selectedFilters.includes(key)) {
        if (multipleSelections.includes(key)) {
          levelsBoxes[key] = true
          for (const k of levelsMap.get(key).values) {
            levelsBoxes[k] = true
          }
        } else {
          levelsBoxes[key] = true
        }
      } else {
        levelsBoxes[key] = false
      }
    }
  }

  let typesBoxes = {}
  /**
   * Mise à jour des checkboxes des filtres de types
   * (prise en compte des sélections multiples comme `college` ou `lycee`)
   */
  function updateTypesBoxes () {
    typesBoxes = {}
    for (const key of typesMap.keys()) {
      if (selectedFilters.includes(key)) {
        typesBoxes[key] = true
      } else {
        typesBoxes[key] = false
      }
    }
  }
  /**
   * Vérifie si une clé appartient à une liste multiple
   * @param {string} key clé à tester
   * @returns {string} le groupe auquel appartient la clé (chaîne vide si pas d'appartenance)
   */
  const isInOneMultipleSelectedFilters = (key) => {
    for (const k of multipleSelections) {
      if (levelsMap.get(k).values.includes(key)) {
        return k
      }
    }
    return ''
  }

  const dispatch = createEventDispatcher()
  /**
   * Gestion de la liste des filtres sélectionnés
   * @param {string} key la clé à ajouter/enlever
   */
  function updateFilters (key) {
    // on vérifie si la clé ne fait pas partie d'une clé multiple
    const group = isInOneMultipleSelectedFilters(key)
    if (group.length !== 0 && selectedFilters.includes(group)) {
      // on retire le groupe de la liste si il est présent
      const index = selectedFilters.indexOf(group)
      if (index > -1) {
        selectedFilters.splice(index, 1)
      }
      // on ajoute les éléments du groupe
      const elts = levelsMap.get(group).values
      for (const e of elts) {
        selectedFilters.push(e)
      }
    }
    // ajouter la clé si absente ; l'enlever si présente
    if (selectedFilters.includes(key)) {
      const index = selectedFilters.indexOf(key)
      if (index > -1) {
        selectedFilters.splice(index, 1)
      }
    } else {
      selectedFilters.push(key)
      if (multipleSelections.includes(key)) {
        // si le filtre est multiple, on retire les clés redondantes
        const filtersGroup = levelsMap.get(key).values
        for (const filter of filtersGroup) {
          const index = selectedFilters.indexOf(filter)
          if (index > -1) {
            selectedFilters.splice(index, 1)
          }
        }
      }
    }
    // mettre à jour les checkboxes
    updateLevelsBoxes()
    updateTypesBoxes()
    selectedFilters = selectedFilters

    // retirer les doublons d'un tableau
    // source: https://stackoverflow.com/a/1584377
    Array.prototype.unique = function () {
      const a = this.concat()
      for (let i = 0; i < a.length; ++i) {
        for (let j = i + 1; j < a.length; ++j) {
          if (a[i] === a[j]) a.splice(j--, 1)
        }
      }
      return a
    }
    // retrouver les niveaux/types sélectionnés (sans doublons)
    const concatFilters = (array: string[], t: 'level' | 'type') => {
      let filters = []
      for (const filter of array) {
        switch (t) {
          case 'level':
            if (levelsMap.has(filter)) {
              filters = filters.concat(levelsMap.get(filter).values).unique()
            }
            break
          case 'type':
            if (typesMap.has(filter)) {
              filters = filters.concat(typesMap.get(filter).values).unique()
            }
            break
          default:
            break
        }
      }
      return filters
    }
    const selectedLevels = [...concatFilters(selectedFilters, 'level')]
    const selectedTypes = [...concatFilters(selectedFilters, 'type')]
    dispatch('filters', {
      levels: selectedLevels,
      types: selectedTypes,
      size: selectedLevels.length + selectedTypes.length
    })
  }
</script>

<!-- Chips des filtres -->
<div
  class="{selectedFilters.length === 0
    ? 'hidden'
    : 'flex'} flex-row flex-wrap text-sm mt-2 {isVisible ? 'mb-0' : 'mb-2'} "
>
  {#each selectedFilters as filter}
    <Chip
      text={(levelsMap.get(filter) ?? typesMap.get(filter)).title}
      textColor="canvas"
      bgColor="struct"
      isVisible={selectedFilters.includes(filter)}
      on:action={() => {
        updateFilters(filter)
      }}
    />
  {/each}
</div>
<!-- Listes des filtres (déployée par bouton) -->
<div class="{isVisible ? 'flex' : 'hidden'} flex-col px-4">
  <div
    class="text-coopmaths-struct font-semibold text-sm border-b w-full border-coopmaths-struct"
  >
    Types
  </div>
  <ul>
    {#each Array.from(typesMap.keys()) as key, i}
      <li>
        <div class="flex-row justify-start items-center pr-4 pl-6">
          <input
            id="checkbox-{key}-{i}-{timeTag}"
            aria-describedby="checkbox-{key}-{i}-{timeTag}"
            type="checkbox"
            class="w-3 h-3 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark border-coopmaths-action text-coopmaths-action dark:border-coopmathsdark-action dark:text-coopmathsdark-action focus:ring-3 focus:ring-coopmaths-action dark:focus:ring-coopmathsdark-action rounded"
            value={key}
            bind:checked={typesBoxes[key]}
            on:change={() => {
              updateFilters(key)
            }}
          />
          <label
            for="checkbox-{key}-{i}-{timeTag}"
            class="ml-2 text-xs font-light text-coopmaths-corpus dark:text-coopmathsdark-corpus"
          >
            {typesMap.get(key).title}
          </label>
        </div>
      </li>
    {/each}
  </ul>
  <div
    class="text-coopmaths-struct font-semibold text-sm border-b w-full border-coopmaths-struct mt-2"
  >
    Niveaux
  </div>
  <ul>
    {#each Array.from(levelsMap.keys()) as key, i}
      <li>
        <div class="flex-row justify-start items-center pr-4 pl-6">
          <input
            id="checkbox-{key}-{i}-{timeTag}"
            aria-describedby="checkbox-{key}-{i}-{timeTag}"
            type="checkbox"
            class="w-3 h-3 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark border-coopmaths-action text-coopmaths-action dark:border-coopmathsdark-action dark:text-coopmathsdark-action focus:ring-3 focus:ring-coopmaths-action dark:focus:ring-coopmathsdark-action rounded"
            value={levelsMap.get(key).values}
            bind:checked={levelsBoxes[key]}
            on:change={() => {
              updateFilters(key)
            }}
          />
          <label
            for="checkbox-{key}-{i}-{timeTag}"
            class="ml-2 text-xs font-light text-coopmaths-corpus dark:text-coopmathsdark-corpus"
          >
            {levelsMap.get(key).title}
          </label>
        </div>
      </li>
    {/each}
  </ul>
  <!-- <div class="border-t h-0 w-full border-coopmaths-struct px-4" /> -->
</div>
