<script lang="ts">
  import type { Vue } from '../../../types'

  export let slideView: Vue

</script>

<div class="flex flex-row">
  <div>
    {#each slideView.consigneSvgs as consigneSvg}
      <div>
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html consigneSvg}
      </div>
    {/each}
  </div>
  <div>
    <div>
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html slideView.consigneText}
    </div>
    <div>
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html slideView.questionText}
    </div>
  </div>
  <div class="flex flex-row">
    {#each slideView.questionSvgs as questionSvg}
      <div>
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html questionSvg}
      </div>
    {/each}
  </div>
</div>
