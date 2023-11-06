<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  export let title: string = ''
  export let filterValue: string
  export let filtersGroup: string
  export let isChecked: boolean

  const dispatch = createEventDispatcher()
  function triggerAction () {
    dispatch('filterChecked', {
      msg: 'Action triggered !'
    })
  }
  // bind:checked={isAmcOnlySelected}
  //   on:change={triggerAction}
</script>

<div class="flex-row justify-start items-center pr-4 pl-6">
  <input
    id="checkbox-{filterValue}"
    aria-describedby="{title}"
    type="checkbox"
    class="w-3 h-3 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark border-coopmaths-action text-coopmaths-action dark:border-coopmathsdark-action dark:text-coopmathsdark-action focus:ring-3 focus:ring-coopmaths-action dark:focus:ring-coopmathsdark-action rounded"
    value={filterValue}
    bind:group={filtersGroup}
    on:change={triggerAction}
    checked={isChecked}
  />
  <label for="checkbox-{filterValue}" class="ml-2 text-xs font-light text-coopmaths-corpus dark:text-coopmathsdark-corpus"> {title} </label>
</div>
