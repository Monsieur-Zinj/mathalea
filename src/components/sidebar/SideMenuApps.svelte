<script>
  import { getContext } from "svelte"
  const thirdAppsChoiceContext = getContext("thirdAppsChoiceContext")
  let toogleThirdAppsChoiceDialog
  if (thirdAppsChoiceContext !== undefined) {
    toogleThirdAppsChoiceDialog = thirdAppsChoiceContext.toogleThirdAppsChoiceDialog
  }
</script>

<button type="button" class="px-6 py-2 font-bold text-xl text-coopmaths-struct dark:text-coopmathsdark-struct" on:click={toggleThirdAppsChoiceDialog}> Applications tierces </button>
