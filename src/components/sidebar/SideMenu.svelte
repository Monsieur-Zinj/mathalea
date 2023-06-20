<script lang="ts">
  import type { ReferentielForList } from "src/lib/types"
  import SideMenuList from "./SideMenuList.svelte"
  export let referentiels: ReferentielForList[] = []
  export let isMenuOpen: boolean = true
  export let sidebarWidth: number = 300
  export let isMenuCloseable: boolean = false
  // let isMenuDeployed: boolean = true
</script>

<aside
  class="flex md:min-h-screen md:h-screen z-40 relative transition-all duration-500 transform bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark
  {isMenuOpen ? '-translate-x-0  pr-4 overflow-y-auto' : '-translate-x-full'}"
>
  <div style={isMenuOpen ? `width:${sidebarWidth}px;` : "width: 2.5rem;"}>
    <div class="{isMenuOpen ? 'flex' : 'hidden'} flex-col items-start pb-4 pt-2 md:pt-4 ml-0 md:mx-0">
      {#each referentiels as ref, i}
        <SideMenuList {ref} moreThanOne={referentiels.length > 1} isMenuDeployed={ref.type === "exercices" ? true : false} on:filters />
      {/each}
    </div>
    <div
      class="z-40 absolute top-3 hidden md:inline-flex justify-center items-center rounded-r-sm h-10 w-10 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark
      {isMenuOpen ? '-translate-x-full -right-10' : 'translate-x-10'}  transition-all duration-500 transform"
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
