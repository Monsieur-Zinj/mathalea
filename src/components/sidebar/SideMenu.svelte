<script lang="ts">
  import type { ReferentielForList, InterfaceReferentiel } from "src/lib/types"
  import SideMenuList from "./SideMenuList.svelte"
  export let referentiels: ReferentielForList[] = []
  export let isMenuOpen: boolean = true
  export let sidebarWidth: number = 300
  export let isMenuCloseable: boolean = false
  let isMenuDeployed: boolean = true
</script>

<aside
  class="z-50 relative transition-all duration-500 transform bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark md:min-h-full md:h-screen
  {isMenuOpen ? '-translate-x-0' : '-translate-x-full'}"
>
  <div style={isMenuOpen ? `width:${sidebarWidth}px;` : "width: 0px;"} class="overflow-y-auto overflow-x-hidden">
    <div class="flex flex-col items-start {isMenuDeployed ? 'pb-6' : 'pb-0'} md:pb-2 pt-2 md:pt-4 ml-0 md:mx-0">
      {#each referentiels as ref, i}
        <SideMenuList {ref} moreThanOne={referentiels.length > 1} on:filters />
      {/each}
    </div>
    <div
      class="z-50 absolute top-3 -right-10 hidden md:inline-flex justify-center items-center rounded-r-sm h-10 w-10 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark
      {isMenuOpen ? '-translate-x-full' : 'translate-x-0'}  transition-all duration-500 transform"
    >
      <button
        type="button"
        on:click={() => {
          if (isMenuCloseable) {
            isMenuOpen = !isMenuOpen
          }
        }}
      >
        <i
          class="bx {isMenuOpen
            ? 'bx-x'
            : 'bx-right-arrow-alt'} scale-150 text-coopmaths-action dark:text-coopmathsdark-action hover:text-coopmaths-action-lightest hover:dark:text-coopmathsdark-action-lightest"
        />
      </button>
    </div>
  </div>
</aside>
