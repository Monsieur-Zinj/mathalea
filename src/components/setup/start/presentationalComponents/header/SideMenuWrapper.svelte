<script lang="ts">
  import { Sidenav } from 'tw-elements'

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
  class="flex justify-center items-center absolute left-0 bottom-0 h-10 w-10 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
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
      class="bx {sidenavOpen
        ? 'bx-right-arrow-alt'
        : 'bx-x'} text-2xl text-coopmaths-action dark:text-coopmathsdark-action hover:text-coopmaths-action-lightest hover:dark:text-coopmathsdark-action-lightest"
    />
  </button>
</div>
