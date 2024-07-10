<script lang="ts">
  import { Sidenav } from 'tw-elements'

  export let isCapytale: boolean
  let sidenavOpen: boolean = false

  /**
   * OUvre/ferme le menu de choix
   * @param testSideMenuOpenedNeeded flag indiquant la nécessité de contrôler si le menu est ouvert avant de
   * déclencher le basculement
   */
  export const toggleMenu = (testSideMenuOpenedNeeded: boolean): void => {
    const instance = Sidenav.getOrCreateInstance(
      document.getElementById('choiceSideMenuWrapper')
    )
    if (testSideMenuOpenedNeeded) {
      if (sidenavOpen === true) {
        instance.toggle()
        sidenavOpen = !sidenavOpen
      }
    } else {
      instance.toggle()
      sidenavOpen = !sidenavOpen
    }
  }
</script>

<div
  class="flex justify-center items-center absolute h-10 w-10 z-50 left-0
    {isCapytale
      ? `${!sidenavOpen ? 'translate-x-[400px]' : ' translate-x-0'} top-0 rounded-r-md transition-transform ease-in-out`
      : 'bottom-0 rounded-t-md'}
    bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
>
  <button
    type="button"
    data-te-sidenav-toggle-ref
    data-te-target="#choiceSideMenuWrapper"
    aria-controls="#choiceSideMenuWrapper"
    aria-haspopup="true"
    on:click={() => {
      toggleMenu(false)
    }}
  >
    <i
      class="bx text-2xl
        {sidenavOpen ? 'bx-right-arrow-alt' : 'bx-x'}
        text-coopmaths-action dark:text-coopmathsdark-action
        hover:text-coopmaths-action-lightest hover:dark:text-coopmathsdark-action-lightest"
    />
  </button>
</div>
