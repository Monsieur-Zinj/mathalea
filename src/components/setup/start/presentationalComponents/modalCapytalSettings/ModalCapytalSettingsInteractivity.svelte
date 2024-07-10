<script lang="ts">
  import type { InterfaceGlobalOptions } from '../../../../../lib/types'
  import ButtonToggle from '../../../../shared/forms/ButtonToggle.svelte'
  import FormRadio from '../../../../shared/forms/FormRadio.svelte'

  export let globalOptions: InterfaceGlobalOptions
  export let isDisabled: boolean

</script>

<div class="pl-2 pb-2 font-light text-2xl
  text-coopmaths-struct-light dark:text-coopmathsdark-struct-light"
>
  Interactivité
</div>
<FormRadio
  title="Interactif"
  bind:valueSelected={globalOptions.setInteractive}
  {isDisabled}
  labelsValues={[
    { label: 'Laisser tel quel', value: '2' },
    { label: 'Tout interactif', value: '1' },
    { label: "Pas d'interactivité", value: '0' }
  ]}
/>
<div class="pl-2 pt-2">
  <ButtonToggle
    titles={[
      'Les élèves peuvent répondre une seule fois',
      'Les élèves peuvent répondre plusieurs fois'
    ]}
    bind:value={globalOptions.oneShot}
  />
</div>
