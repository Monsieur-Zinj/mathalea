<script lang="ts">
  import ZoomButtons from './ZoomButtons.svelte'
  import InteractivityButton from './InteractivityButton.svelte'
  import ReorderButton from './ReorderButton.svelte'
  import NewDataButton from './NewDataButton.svelte'
  import TrashButton from './TrashButton.svelte'
  import FullscreenButton from './FullscreenButton.svelte'

  export let reorderModalDisplayed: boolean
  export let zoomUpdate: (plusMinus: ('+' | '-')) => void
  export let setAllInteractive: (isAllInteractive: boolean) => void
  export let newDataForAll: () => void
  export let trash: () => void
  export let setFullScreen: (isFullScreen: boolean) => void

</script>

<ZoomButtons
  {zoomUpdate}
/>
<InteractivityButton
  {setAllInteractive}
/>
<ReorderButton
  bind:reorderModalDisplayed
/>
<NewDataButton
  {newDataForAll}
/>
<TrashButton
  {trash}
/>
<FullscreenButton
  callback={setFullScreen}
/>
