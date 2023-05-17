<script lang="ts">
  import type { ReferentielForList } from "src/lib/types"
  import EntreeListeOutils from "./EntreeListeOutils.svelte"
  import SideMenuList from "./SideMenuList.svelte"
  export let referentiel = []
  let isMenuOpen: boolean = true
  let isMenuDeployed: boolean = true
  let refList: ReferentielForList[] = [{ title: "Choix des outils", content: [...referentiel] }]
</script>

<aside
  class="relative {isMenuOpen
    ? '-translate-x-0'
    : '-translate-x-full'} transition-all duration-500 transform w-full bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark md:min-h-full md:h-screen flex flex-col items-start {isMenuDeployed
    ? 'pb-6'
    : 'pb-0'} md:pb-2 pt-4"
>
  <div class="overflow-y-auto overflow-x-hidden">
    {#each refList as ref, i}
      <SideMenuList {ref} moreThanOne={refList.length > 1} />
    {/each}
  </div>
  <div
    class="absolute top-0 -right-10 hidden md:inline-flex justify-center items-center rounded-r-sm h-10 w-10 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark {isMenuOpen
      ? '-translate-x-full'
      : 'translate-x-0'}  transition-all duration-500 transform"
  >
    <button
      type="button"
      on:click={() => {
        isMenuOpen = !isMenuOpen
      }}
      ><i
        class="bx {isMenuOpen
          ? 'bx-x'
          : 'bx-right-arrow-alt'} scale-150 text-coopmaths-action dark:text-coopmathsdark-action hover:text-coopmaths-action-lightest hover:dark:text-coopmathsdark-action-lightest"
      /></button
    >
  </div>
</aside>
