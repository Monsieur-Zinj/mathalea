<script lang="ts">
  import EntreeListeOutils from "./EntreeListeOutils.svelte"
  export let referentiel = []
  let isMenuOpen: boolean = true
</script>

<aside
  class="relative {isMenuOpen
    ? '-translate-x-0'
    : '-translate-x-full'} transition-all duration-500 transform w-full bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark min-h-full h-screen flex flex-col items-center pb-2"
>
  <div class="w-full flex justify-start font-bold text-xl text-coopmaths-struct pl-6 py-5">Choix des outils</div>
  <ul class="pl-4 flex flex-col">
    {#each referentiel as item, i}
      <li>
        <EntreeListeOutils outil={item} />
      </li>
    {/each}
  </ul>
  <div
    class="absolute top-0 -right-10 {isMenuOpen
      ? '-translate-x-full'
      : 'translate-x-0'}  transition-all duration-500 transform inline-flex justify-center items-center rounded-r-sm h-10 w-10 bg-coopmaths-canvas-dark"
  >
    <button
      type="button"
      on:click={() => {
        isMenuOpen = !isMenuOpen
      }}><i class="bx {isMenuOpen ? 'bx-x' : 'bx-right-arrow-alt'} scale-150 text-coopmaths-action" /></button
    >
  </div>
</aside>
