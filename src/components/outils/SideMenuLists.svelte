<script lang="ts">
  import type { ReferentielForList } from "src/lib/types"
  import EntreeListeOutils from "./EntreeListeOutils.svelte"

  export let ref: ReferentielForList
  export let moreThanOne: boolean = false

  let isMenuDeployed: boolean = true
</script>

<div class="w-full flex flex-row justify-between items-center px-6 py-5">
  <div class=" font-bold text-xl text-coopmaths-struct">{ref.title}</div>
  <div class={moreThanOne ? "flex" : "hidden"}>
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
  {#each ref.content as item, i}
    <li>
      <EntreeListeOutils outil={item} />
    </li>
  {/each}
</ul>
