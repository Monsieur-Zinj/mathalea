<script lang="ts">
  import type { InterfaceGlobalOptions } from '../../../../../lib/types'
  import ButtonToggle from '../../../../shared/forms/ButtonToggle.svelte'

  export let globalOptions: InterfaceGlobalOptions
</script>

<div class="pl-2 pb-2 font-light text-2xl
text-coopmaths-struct-light dark:text-coopmathsdark-struct-light"
>
  Affichage des titres
</div>
<div class="flex flex-row justify-start items-center px-4">
  <ButtonToggle
    titles={['Tous les titres sont affichés', 'Tous les titres sont masqués']}
    bind:value={globalOptions.isTitleDisplayed}
  />
</div>
