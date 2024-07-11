<script lang="ts">
  import type { InterfaceGlobalOptions } from '../../../../../lib/types'
  import type { CanOptions } from '../../../../../lib/types/can'
  import ButtonToggle from '../../../../shared/forms/ButtonToggle.svelte'

  export let globalOptions: InterfaceGlobalOptions
  export let canOptions: CanOptions
</script>

<div class="pl-2 pb-2 font-light text-2xl
  text-coopmaths-struct-light dark:text-coopmathsdark-struct-light"
>
  Correction
</div>
<div class="flex flex-row justify-start items-center px-4">
  <ButtonToggle
    isDisabled={canOptions.isChoosen}
    titles={['Accès aux corrections', 'Pas de corrections']}
    bind:value={globalOptions.isSolutionAccessible}
  />
</div>
