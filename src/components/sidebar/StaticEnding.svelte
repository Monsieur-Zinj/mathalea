<script lang='ts'>
  export let pathToThisNode: string[] = []
</script>
<div>
  {#each pathToThisNode as step}
    <span>/{step}</span>
  {/each}
</div>
