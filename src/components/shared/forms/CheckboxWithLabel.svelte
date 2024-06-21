<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  export let id: string
  export let isChecked: boolean
  export let isDisabled: boolean = false
  export let label: string

  const dispatch = createEventDispatcher()
</script>

<div class="flex flex-row justify-start items-center px-4 mt-1">
  <input
    id="{id}"
    aria-describedby="{id}"
    type="checkbox"
    class="w-4 h-4 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas { isDisabled
      ? 'border-opacity-10 text-coopmaths-action-100'
      : 'border-opacity-100 cursor-pointer'}
      border-coopmaths-action text-coopmaths-action dark:border-coopmathsdark-action dark:text-coopmathsdark-action
      focus:ring-3 focus:ring-coopmaths-action dark:focus:ring-coopmathsdark-action h-4 w-4 rounded"
    bind:checked={isChecked}
    on:change={() => dispatch('change', isChecked)}
    disabled={isDisabled}
  />
  <label
    for="{id}"
    class="ml-3 text-sm text-coopmaths-corpus dark:text-coopmathsdark-corpus {isDisabled
      ? 'text-opacity-10 dark:text-opacity-10'
      : 'text-opacity-70 dark:text-opacity-70 cursor-pointer'} {isChecked
        ? 'font-semibold'
        : 'font-light'}"
  >
    {label}
  </label>
</div>
