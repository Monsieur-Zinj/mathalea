<script>
  import { getContext } from 'svelte'
  const { toggleThirdAppsChoiceDialog } = getContext('thirdAppsChoiceContext')
</script>

<button
  type="button"
  class={`${$$props.class || ''} font-bold text-xl text-coopmaths-struct dark:text-coopmathsdark-struct`}
  on:click={toggleThirdAppsChoiceDialog}
>
  Applications tierces
</button>
