<script lang="ts">
  import {
    type JSONReferentielObject, type ReferentielInMenu
  } from '../lib/types/referentiels'
  import referentielAlea from '../json/referentiel2022.json'
  import referentielStatic from '../json/referentielStatic.json'
  const baseReferentiel: JSONReferentielObject = {
    ...referentielAlea,
    static: { ...referentielStatic }
  }
  import referentielProfs from '../json/referentielProfs.json'
  const referentielOutils: JSONReferentielObject = { ...referentielProfs }
  import referentielRessources from '../json/referentielRessources.json'
  import SideMenuBis from './sidebar/SideMenuBis.svelte'
  const referentielHtml: JSONReferentielObject = { ...referentielRessources }
  const referentiels: ReferentielInMenu[] = [
    {
      title: 'Exercices',
      referentiel: baseReferentiel
    },
    {
      title: 'Outils',
      referentiel: referentielOutils
    },
    {
      title: 'Vos ressources',
      referentiel: referentielHtml
    }
  ]
</script>
<h1 class="text-4xl font-black text-coopmaths-struct mb-10">Tests</h1>
<SideMenuBis {referentiels} sidebarWidth={400} />
