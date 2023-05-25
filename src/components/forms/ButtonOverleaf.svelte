<script lang="ts">
  import type Latex from "src/lib/Latex"
  import { buildImagesUrlsList, doesLatexNeedsPics, getExosContentList, getPicsNames, type LatexFileInfos } from "../../lib/Latex"

  export let latex: Latex
  export let latexFileInfos: LatexFileInfos

  let textForOverleafInput: HTMLInputElement
  let imagesUrls = [] as string[]

  /**
   * Construction du matériel nécessaire au téléversement vers Overleaf :
   * -- constitution des URLs pour le téléchargement des images (elles doivent pointer vers un serveur)
   * -- encodage du contenu du code LaTeX de la feuille d'exercices
   */
  async function copyDocumentToOverleaf() {
    const contents = latex.getContents(latexFileInfos.style, latexFileInfos.nbVersions)
    const picsWanted = doesLatexNeedsPics(contents)
    const exosContentList = getExosContentList(latex.exercices)
    const picsNames = getPicsNames(exosContentList)
    imagesUrls = picsWanted ? buildImagesUrlsList(exosContentList, picsNames) : []
    // console.log(imagesUrls)

    const text = await latex.getFile(latexFileInfos)
    textForOverleafInput.value = "data:text/plain;base64," + btoa(unescape(encodeURIComponent(text)))
  }
</script>

<div class="flex flex-col md:flex-row mx-4 pb-4 md:pb-8 md:space-x-4 space-y-3 justify-center md:justify-start items-center">
  <form method="POST" action="https://www.overleaf.com/docs" target="_blank">
    {#each imagesUrls as imageUrl}
      <input type="hidden" name="snip_uri[]" value={imageUrl} autocomplete="off" />
      <input type="hidden" name="snip_name[]" value={imageUrl.split("/")[imageUrl.split("/").length - 1]} autocomplete="off" />
    {/each}
    <input type="hidden" name="snip_uri[]" bind:this={textForOverleafInput} autocomplete="off" />
    <input type="hidden" name="snip_name[]" value="coopmath.tex" autocomplete="off" />
    <input type="hidden" name="engine" value="lualatex" autocomplete="off" />
    <button
      id="btn_overleaf"
      type="submit"
      on:click={copyDocumentToOverleaf}
      class="p-2 rounded-xl text-coopmaths-canvas dark:text-coopmathsdark-canvas bg-coopmaths-action hover:bg-coopmaths-action-lightest dark:bg-coopmathsdark-action dark:hover:bg-coopmathsdark-action-lightest"
    >
      Compiler en PDF sur Overleaf.com
    </button>
  </form>
</div>
