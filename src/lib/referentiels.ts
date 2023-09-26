// ===========================================================================
//
//    Typage des bouts de chaînes des référentiels (les données des exercices)
//
// ===========================================================================
export interface Feature {
  name: string
  isActive: boolean
  type: string
}

export interface AppTierce {
  uuid: string
  title: string
  presentation: string
  imgPath: string
}

export interface AppTierceGroup {
  rubrique: string
  liste: AppTierce[]
}

export interface ItemInReferentielBase {
  uuid: string
  tags: string[]
  typeExercice: 'alea' | 'dnb' | 'crpe' | 'bac' | 'simple' | 'html' | 'svelte'
}

export interface ItemInReferentielStatic extends ItemInReferentielBase {
  png: string[]
  pngCor: string[]
  tex: string
  texCor: string
}

export interface ItemInReferentielExamen extends ItemInReferentielStatic {
  mois?: string
  annee: string
  lieu: string
  numeroInitial: string
}

export interface ItemInReferentielExamenWithoutTex extends ItemInReferentielBase {
  png: string[]
  pngCor: string[]
  annee: string
  lieu: string
  numeroInitial: string
}

export interface ItemInReferentielExercice extends ItemInReferentielBase {
  url: string
  id: string
  titre: string
  features: Feature[]
  datePublication?: string
  dateModification?: string
}

// ===========================================================================
//
//    Types pour les référentiels eux-mêmes
//
// ===========================================================================

export type JSONValue = string | { [x: string]: JSONValue } | Array<JSONValue>
