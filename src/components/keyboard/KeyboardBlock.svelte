<script lang="ts">
  import type { BlockContent } from './layouts/keyboardTypes'
  import Key from './KeycapV2.svelte'
  export let block: BlockContent
</script>
<div class={$$props.class || ''}>
  {#each Object.values(block).reverse() as row}
            {#each row as data}
              <Key {data} />
            {/each}
          {/each}
</div>
