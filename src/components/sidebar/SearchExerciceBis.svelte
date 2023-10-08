<script lang="ts">
  import { stringToCriteria } from '../../lib/types/filters'
  import { type ResourceAndItsPath } from '../../lib/types/referentiels'
  import { selectedFilters } from '../store'
  import { getUniqueStringBasedOnTimeStamp } from '../utils/time'
  export let origin: ResourceAndItsPath[]
  export let results: ResourceAndItsPath[]
  let inputSearch: string = ''
  $: {
    if (inputSearch.replace(/^[\s"']/, '').length !== 0) {
      results = [
        ...stringToCriteria(
          inputSearch,
          $selectedFilters.types.CAN.isSelected
        ).meetCriterion(origin)
      ]
    }
    results = results
  }
</script>

<div class="flex flex-col space-x-2 justify-start items-center">
  <div class="relative flex flex-col w-full">
    <input
      type="text"
      id="searchInputField-{getUniqueStringBasedOnTimeStamp}"
      class="w-full border border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action-lightest dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark text-coopmaths-corpus-light dark:text-coopmathsdark-corpus-light text-sm"
      placeholder="🔍 Thème, identifiant..."
      bind:value={inputSearch}
    />
  </div>
</div>
