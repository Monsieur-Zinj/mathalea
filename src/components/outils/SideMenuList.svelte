<script lang="ts">
  import type ReferentielForList from "src/lib/types"
  import type ReferentielTypes from "src/lib/types"
  import NiveauListeExos from "../sidebar/NiveauListeExos.svelte"
  import EntreeListeOutils from "./EntreeListeOutils.svelte"
  import codeList from "../../json/codeToLevelList.json"
  import { onMount } from "svelte"
  import { toMap } from "../utils/toMap"

  export let ref: ReferentielForList
  export let moreThanOne: boolean = false

  let isMenuDeployed: boolean = true
  onMount(async () => {
    console.log(ref)
  })

  /**
   * Retrouve le titre d'un niveau basé sur son
   * @param levelId
   */
  function codeToLevelTitle(code: string) {
    if (codeList[code]) {
      return codeList[code]
    } else {
      return code
    }
  }
</script>

<div class="w-full flex flex-row justify-between items-center px-6 py-2 md:py-5">
  <div class=" font-bold text-xl text-coopmaths-struct">{ref.title}</div>
  <div class={moreThanOne ? "flex" : "flex md:hidden"}>
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
  {#if ref.type === "outils"}
    {#each ref.content as item, i}
      <li>
        <EntreeListeOutils outil={item} />
      </li>
    {/each}
  {:else if ref.type === "exercices"}
    {#each ref.content as item, i}
      <!-- {#each Array.from(toMap(entries), ([key, obj]) => ({ key, obj })) as item, i} -->
      <li>
        <NiveauListeExos indexBase={i.toString()} nestedLevelCount={1} pathToThisNode={[item.key]} levelTitle={codeToLevelTitle(item.key)} items={item.obj} />
      </li>
      <!-- {/each} -->
    {/each}
  {:else}
    <li class="italic font-light">Référentiel de type inconnu...</li>
  {/if}
</ul>
