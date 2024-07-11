<script lang="ts">
  import type { NumberRange } from '../../../../../lib/types'
  import FormRadio from '../../../../shared/forms/FormRadio.svelte'

  export let nbOfViews: NumberRange<1, 4>
  export let updateNbOfViews: (nbOfViews: NumberRange<1, 4>) => void

  const labelsForMultivue = [
    { label: 'Pas de multivue', value: 1 },
    { label: 'Deux vues', value: 2 },
    { label: 'Trois vues', value: 3 },
    { label: 'Quatre vues', value: 4 }
  ]
</script>

<div class="flex text-lg font-bold mb-2
  text-coopmaths-struct dark:text-coopmathsdark-struct"
>
  Multivue
</div>
<div class="flex px-4 pb-8">
  <FormRadio
    bind:valueSelected={nbOfViews}
    on:newvalue={() => updateNbOfViews(nbOfViews)}
    title="multivue"
    labelsValues={labelsForMultivue}
  />
</div>
