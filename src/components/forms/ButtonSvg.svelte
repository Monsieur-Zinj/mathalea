<script lang="ts">
  import { getUniqueStringBasedOnTimeStamp } from '../utils/time'
  import LatexIcon from '../icons/LatexIcon.svelte'
  export let isDisabled: boolean = false
  export let classDeclaration: string = 'w-4 h-4 hover:fill-coopmaths-action-lightest fill-coopmaths-action dark:fill-coopmathsdark-action dark:hover:fill-coopmathsdark-action-lightest'
  export let idLabel: string = getUniqueStringBasedOnTimeStamp('btn-')
</script>

<button type="button" on:click disabled={isDisabled} id={idLabel}>
  <slot name="svelte-icon">
    <LatexIcon class={classDeclaration} />
  </slot>
</button>
