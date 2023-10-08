<script lang="ts">
  import { FILTER_SECTIONS_TITLES, type FilterType } from '../../lib/types'
  import type { Level } from '../../lib/types/referentiels'
  import { selectedFilters } from '../store'
  import { getUniqueStringBasedOnTimeStamp } from '../utils/time'
  export let filterType: FilterType = 'levels'
  const timeTag: string = getUniqueStringBasedOnTimeStamp()
  /**
   * Gérer le cochage des filtres. On a juste à gérer les niveaux multiples
   * collège et lycée qui concernent plusieurs niveaux.
   * @remarks __Bizarrerie__ : Pour être sûr que la fonction callback de `subsribe` du store
   * `selectedFilters` soit appelée, on ajoute 1 à la propriété `clicked`
   * @param selectedEntry
   */
  function handleFiltersChanges (selectedEntry: Level | string) {
    if (filterType === 'levels') {
      switch (selectedEntry) {
        case 'college':
        case 'lycee':
          Object.values($selectedFilters.levels[selectedEntry].values).forEach(
            (level) => {
              // on met tous les niveaux college/lycee à `true` ou `false`
              if ($selectedFilters.levels[selectedEntry].isSelected) {
                $selectedFilters.levels[level].isSelected = true
              } else {
                $selectedFilters.levels[level].isSelected = false
              }
            }
          )
          $selectedFilters.levels[selectedEntry].clicked++
          break
        default:
          $selectedFilters.levels[selectedEntry].clicked++
          break
      }
      // on décoche `college` si tous les niveaux de college ne sont pas cochés
      $selectedFilters.levels.college.values.forEach((level) => {
        if (!$selectedFilters.levels[level].isSelected) {
          $selectedFilters.levels.college.isSelected = false
        }
      })
      // on décoche `lycee` si tous les niveaux de lycee ne sont pas cochés
      $selectedFilters.levels.lycee.values.forEach((level) => {
        if (!$selectedFilters.levels[level].isSelected) {
          $selectedFilters.levels.lycee.isSelected = false
        }
      })
    } else {
      $selectedFilters[filterType][selectedEntry].clicked++
    }
  }
</script>

<div class="flex-col px-4">
  <div
    class="text-coopmaths-struct font-semibold text-sm border-b w-full border-coopmaths-struct"
  >
    {FILTER_SECTIONS_TITLES[filterType]}
  </div>
  <div>
    <ul>
      {#each Object.entries($selectedFilters[filterType]) as [key, filter], i}
        <li class="flex-row justify-start items-center pr-4 pl-6">
          <input
            id="checkbox-{key}-{i}-{timeTag}"
            aria-describedby="checkbox-{key}-{i}-{timeTag}"
            type="checkbox"
            class="w-3 h-3 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark border-coopmaths-action text-coopmaths-action dark:border-coopmathsdark-action dark:text-coopmathsdark-action focus:ring-3 focus:ring-coopmaths-action dark:focus:ring-coopmathsdark-action rounded"
            value={key}
            bind:checked={filter.isSelected}
            on:change={() => {
              handleFiltersChanges(key)
            }}
          />
          <label
            for="checkbox-{key}-{i}-{timeTag}"
            class="ml-2 text-xs font-light text-coopmaths-corpus dark:text-coopmathsdark-corpus"
          >
            {filter.title}
          </label>
        </li>
      {/each}
    </ul>
  </div>
</div>
