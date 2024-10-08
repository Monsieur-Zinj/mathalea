<script lang="ts">
  import ButtonsDeck from '../../../../../shared/ui/ButtonsDeck.svelte'
  import SetupButtons from './setupButtons/SetupButtons.svelte'
  import ExportButtons from './exportButtons/ExportButtons.svelte'
  import type { VueType } from '../../../../../../lib/types'

  export let reorderModalDisplayed: boolean = false
  export let zoomUpdate: (plusMinus: ('+' | '-')) => void
  export let setAllInteractive: (isAllInteractive: boolean) => void
  export let newDataForAll: () => void
  export let trash: () => void
  export let setFullScreen: (isFullScreen: boolean) => void
  export let handleExport: (vue: VueType) => void

</script>

<ButtonsDeck class="md:pl-10 hidden md:flex">
  <div
    slot="setup-buttons"
    class="flex flex-row justify-start items-center space-x-4"
  >
    <SetupButtons
      bind:reorderModalDisplayed
      {zoomUpdate}
      {setAllInteractive}
      {newDataForAll}
      {trash}
      {setFullScreen}
    />
  </div>
  <div
    slot="export-buttons"
    class="flex flex-row justify-end items-center space-x-4"
  >
    <ExportButtons
      {handleExport}
    />
  </div>
</ButtonsDeck>
