<script lang="ts">
  export let subtitle: string = ''
  export let type: 'export' | 'design' = 'export'
</script>

<!--
  @component
  Sous-titre du header de NavBarV2

  __Paramètres__ :

  * `subtitle` :  titre du groupe de boutons
  * `type`: `export`(défaut) ou `design`

  __Exemple__ :

    ```tsx
  <NavBarV2Subtitle
    subtitle = "Mon sous-titre"
    type = "design"
  />
  ```
 -->
<div
  class="flex flex-row items-center space-x-4 pt-6 md:pt-0 md:inline-flex text-xl md:text-3xl xl:text-5xl font-logo9 tracking-tighter"
>
  <div
    class="pl-0 md:pl-10 font-light text-coopmaths-corpus-lightest dark:text-coopmathsdark-corpus-lightest"
  >
    <i
      class={type === 'export'
        ? 'bx bx-export rotate-90 translate-y-1'
        : 'hidden'}
    />
    <i
      class={type === 'design' ? 'bx bx-chevron-right translate-y-1' : 'hidden'}
    />
  </div>
  <div
    class="pl-0 lg:pl-2 font-black text-coopmaths-struct dark:text-coopmathsdark-struct"
  >
    {subtitle}
  </div>
</div>
