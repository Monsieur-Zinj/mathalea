<script lang="ts">
    import * as ace from 'brace'
    import 'brace/mode/latex'
    import 'brace/theme/monokai'

    import type Latex from '../../../lib/Latex'
    import { tweened } from 'svelte/motion'
    import {
      buildImagesUrlsList,
      doesLatexNeedsPics,
      getExosContentList,
      getPicsNames,
      type LatexFileInfos
    } from '../../../lib/Latex'
    import Button from '../../shared/forms/Button.svelte'
    import FormRadio from '../../shared/forms/FormRadio.svelte'

    export let latex: Latex
    export let latexFileInfos: LatexFileInfos

    let clockAbled: boolean = false

    const original = 1 * 60 // TYPE NUMBER OF SECONDS HERE
    let timer = tweened(original)

    let defaultengine = 'lualatex'
    let defaultreturn = 'pdfjs'

    // ------ dont need to modify code below

    function addinput (f:HTMLFormElement, n:string, v:string) {
      const inp = document.createElement('input')
      inp.setAttribute('type', 'text')
      inp.setAttribute('name', n)
      inp.value = encodeURIComponent(v)
      f.appendChild(inp)
    }

    function addinputnoenc (f:HTMLFormElement, n:string, v:string) {
      const inp = document.createElement('input')
      inp.setAttribute('type', 'text')
      inp.setAttribute('name', n)
      inp.value = v
      f.appendChild(inp)
    }

    function addtextarea (f:HTMLFormElement, n:string, v:string) {
      const inp = document.createElement('textarea')
      inp.setAttribute('type', 'text')
      inp.setAttribute('name', n)
      inp.textContent = v
      f.appendChild(inp)
    }

    function submitFormToIframe (formData : FormData) {
      const form = document.getElementById('form') as HTMLFormElement
      form.innerHTML = ''
      form.action = 'https://texlive.net/cgi-bin/latexcgi'
      form.method = 'POST'
      form.target = 'pre0ifr'
      form.enctype = 'multipart/form-data'

      for (const [name, value] of formData.entries()) {
        if (name === 'filecontents[]') {
          addtextarea(form, name, value.toString())
        } else if (name === 'filename[]') {
          addinputnoenc(form, name, value.toString())
        } else {
          addinput(form, name, value.toString())
        }
      }
      form.style.display = 'none'
      form.submit()
    }

    function resetIframe () : HTMLElement {
      const iframe = document.getElementById('pre0ifr') as HTMLElement
      const parent = iframe.parentElement
      parent?.removeChild(iframe)
      const iframe2 = document.createElement('iframe')
      iframe2.setAttribute('title', 'output')
      iframe2.setAttribute('width', '100%')
      iframe2.setAttribute('height', '100%')
      iframe2.setAttribute('id', 'pre0ifr')
      iframe2.setAttribute('name', 'pre0ifr')
      parent?.appendChild(iframe2)
      return iframe2
    }

    async function compileToPDF () {
      const editor = ace.edit('editor')
      const t = editor.getValue()

      const iframe2 = resetIframe()

      const formData = new FormData()
      formData.append('filecontents[]', t)
      formData.append('filename[]', 'document.tex')
      formData.append('engine', defaultengine)
      formData.append('return', defaultreturn)

      const contents = await latex.getContents(
        latexFileInfos.style,
        latexFileInfos.nbVersions
      )
      const picsWanted = doesLatexNeedsPics(contents)
      const exosContentList = getExosContentList(latex.exercices)
      const picsNames = getPicsNames(exosContentList)
      const imagesUrls : string[] = picsWanted
        ? buildImagesUrlsList(exosContentList, picsNames)
        : []

      for (let im = 0; im < imagesUrls.length; im++) {
        const imaUrl = imagesUrls[im].replace('https://coopmaths.fr', window.location.origin)
        const visual = await fetch(imaUrl)
        const blob = await visual.blob()
        const stringfile = await blob.text()
        formData.append('filecontents[]', stringfile)
        formData.append('filename[]', imaUrl.split('/').slice(-1)[0])
      }

      clockAbled = true
      const timeValue = setInterval(() => {
        if ($timer > 0) {
          $timer--
        } else {
          clearInterval(timeValue)
        }
      }, 1000)

      iframe2.addEventListener('load', function (this) {
        clockAbled = false
        clearInterval(timeValue)
        timer = tweened(original)
      })

      submitFormToIframe(formData)
    }

    /**
     * Affiche ou ferme si déjà ouvert le code Latex dans une boite de dialogue
     */
    async function dialogToDisplayToggle () {
      const dialog = document.getElementById('editorLatex') as HTMLDialogElement
      if (dialog.open) {
        clockAbled = false
        dialog.close()
      } else {
        const contents = await latex.getContents(
          latexFileInfos.style,
          latexFileInfos.nbVersions
        )
        const picsWanted = doesLatexNeedsPics(contents)
        const exosContentList = getExosContentList(latex.exercices)
        const picsNames = getPicsNames(exosContentList)
        const imagesUrls : string[] = picsWanted
          ? buildImagesUrlsList(exosContentList, picsNames)
          : []

        const text = await latex.getFile(latexFileInfos)

        const editor = ace.edit('editor')
        editor.getSession().setMode('ace/mode/latex')
        editor.getSession().setNewLineMode('unix')
        editor.setTheme('ace/theme/monokai')
        editor.setOption('minLines', 10)
        editor.setOption('maxLines', 10)
        editor.setShowPrintMargin(false)
        editor.setValue(text)
        editor.gotoLine(1)

        resetIframe()

        const imageLatex = document.getElementById('imagesLatex') as HTMLElement
        imageLatex.innerHTML = 'Nombre d\'images: ' + imagesUrls.length
        dialog.showModal()

        /**
         * Recadre le ACE Editor en fonction de la hauteur
        */
        setTimeout(() => {
          const editorContainer = document.getElementById('editorContainer') as HTMLElement
          if (editorContainer.clientHeight > editor.container.clientHeight) {
            const lines = Math.floor(10 * editorContainer.clientHeight / editor.container.clientHeight)
            if (lines < 50) {
              editor.setOption('maxLines', lines)
            }
            editor.gotoLine(1)
          }
        }, 1000)
      }
    }

  </script>

  <!--
    @component
    Bouton déclenchant l'exportation vers OverLeaf

    ### Paramètres

    * `latex` : code latex du document
    * `latexFileInfos` : objet contenant les éléments de mise en forme du fichier
    * `disabled` : flag permettant de désactiver le bouton

    ### Exemple
    ```tsx
    <ButtonCompileLatexToPDF
      {latex}
      latexFileInfos={{ title, reference, subtitle, style, nbVersions }}
      disabled={false}
    />
    ```
   -->

    <form class={`${$$props.class || 'flex flex-col md:flex-row mx-4 pb-4 md:pb-8 md:space-x-4 space-y-3 justify-center md:justify-start items-center'}`} target="_blank">

      <button
        id="btn_overleaf"
        type="submit"
        on:click|preventDefault={dialogToDisplayToggle}
        class= 'px-2 py-1 rounded-md text-coopmaths-canvas dark:text-coopmathsdark-canvas bg-coopmaths-action hover:bg-coopmaths-action-lightest dark:bg-coopmathsdark-action dark:hover:bg-coopmathsdark-action-lightest'
      >
        Compiler et obtenir le PDF
      </button>
    </form>

    <dialog
        class="relative rounded-xl p-6 bg-coopmaths-canvas text-coopmaths-corpus left-[2%] top-[2%] w-[96%] h-[96%] dark:bg-coopmathsdark-canvas-dark dark:text-coopmathsdark-corpus-light shadow-lg"
        id="editorLatex"
    >
    <div class="mt-3 text-center">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-coopmaths-warn-100">
          <div class="h-6 w-6 text-coopmaths-warn-darkest">
            <i class="bx bx-sm bxs-file-pdf text-[100px]" />
          </div>
        </div>
        <div class="text-3xl pt-4 leading-6 font-medium text-coopmaths-warn-dark">
        <span class="header">
            <div class="absolute top-2 right-3">
                <button type="button" on:click={() => {
                  dialogToDisplayToggle()
                }} >
                <i
                    class="text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest text-xl bx bx-x"
                />
                </button>
            </div>
        </span>
        </div>
        <div id="editorContainer" class="font-light h-[40vh]">
            <div id="editor" class=''>
            </div>
            <div id="imagesLatex">
            </div>
            <div id="compilater" class='flex flex-row justify-center'>
            Compilateur :
            <FormRadio
              title="Compilateur"
              bind:valueSelected={defaultengine}
              labelsValues={[
                { label: 'pdflatex', value: 'pdflatex' },
                { label: 'lualatex', value: 'lualatex' }
              ]}
              orientation=row
            />
            </div>
            <div id="Sortie" class='flex flex-row justify-center'>
            Sortie :
            <FormRadio
              title="sortie"
              bind:valueSelected={defaultreturn}
              labelsValues={[
                { label: 'log', value: 'log' },
                { label: 'pdfjs', value: 'pdfjs' },
                { label: 'pdf', value: 'pdf' }
              ]}
              orientation=row
            />
            </div>
            <Button
                class="px-2 py-1 rounded-md"
                title="Compiler en PDF"
                on:click={compileToPDF}
            />
            <form id='form'>

            </form>

            {#if clockAbled}
              <span><progress value={$timer / original}></progress>{$timer.toFixed(0)}s</span>
            {/if}
            <div class='bg-gray-100 h-[30vh] mt-2'><iframe title="output" width="100%" height="100%" id="pre0ifr" name="pre0ifr"></iframe></div>
        </div>
    </dialog>

    <style>
   .editor {
        position: relative;
        top: 0;
        left: 0;
        width: 100%;
      }
    </style>
