<script lang="ts">
  import EntreeListeOutils from "./EntreeListeOutils.svelte"
  export let referentiel = []
  let isMenuOpen: boolean = true
  let isMenuDeployed: boolean = true
</script>

<aside
  class="relative {isMenuOpen
    ? '-translate-x-0'
    : '-translate-x-full'} transition-all duration-500 transform w-full bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark md:min-h-full md:h-screen flex flex-col items-start {isMenuDeployed
    ? 'pb-6'
    : 'pb-0'} md:pb-2"
>
  <div class="w-full flex flex-row justify-between md:justify-start px-6 py-5">
    <div class=" font-bold text-xl text-coopmaths-struct">Choix des outils</div>
    <div class="flex md:hidden">
      <button
        type="button"
        on:click={() => {
          isMenuDeployed = !isMenuDeployed
        }}
      >
        <i
          class="bx bxs-up-arrow {isMenuDeployed
            ? 'rotate-0'
            : 'rotate-180'} transition-transform ease-in-out duration-500 bx-xl text-coopmaths-action dark:text-coopmathsdark-action hover:text-coopmaths-action-lightest hover:dark:text-coopmathsdark-action-lightest"
        />
      </button>
    </div>
  </div>
  <ul class={isMenuDeployed ? "flex flex-col pl-4 " : "hidden"}>
    {#each referentiel as item, i}
      <li>
        <EntreeListeOutils outil={item} />
      </li>
    {/each}
  </ul>
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
