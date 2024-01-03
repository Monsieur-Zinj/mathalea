<script lang="ts">
  import { Sidenav } from 'tw-elements'

  let sidenavOpen: boolean = false
</script>

<div
  class="flex justify-center items-center absolute left-0 bottom-0 h-10 w-10 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
>
  <button
    type="button"
    data-te-sidenav-toggle-ref
    data-te-target="#choiceSideMenuWrapper"
    aria-controls="#choiceSideMenuWrapper"
    aria-haspopup="true"
    on:click={() => {
      sidenavOpen = !sidenavOpen
      const instance = Sidenav.getOrCreateInstance(
        document.getElementById('choiceSideMenuWrapper')
      )
      instance.toggle()
    }}
  >
    <i
      class="bx {sidenavOpen
        ? 'bx-right-arrow-alt'
        : 'bx-x'} text-2xl text-coopmaths-action dark:text-coopmathsdark-action hover:text-coopmaths-action-lightest hover:dark:text-coopmathsdark-action-lightest"
    />
  </button>
</div>
