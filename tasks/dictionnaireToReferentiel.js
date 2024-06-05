/**
 * L'exécuter avec node tasks/dictionnaireToReferentiel.js
 * Ce script met à jour le référentiel des exercices statiques en récupérant les mots clé et les url
 * dans les différents dictionnaires qu'il faut mettre à jour au préalable.
 */

import fs from 'fs'
// import { dictionnaireCrpe } from '../src/json/dictionnaireCrpe.js'
import { dictionnaireCrpeCoop } from '../src/json/dictionnaireCrpeCoop.js'
import { dictionnaireDNB } from '../src/json/dictionnaireDNB.js'
import { dictionnaireBAC } from '../src/json/dictionnaireBAC.js'
import { dictionnaireE3C } from '../src/json/dictionnaireE3C.js'
import { dictionnaireEVACOM } from '../src/json/dictionnaireEVACOM.js'

const referentielFR = {}
const referentielCH = {}

// Gestion du DNB
referentielFR.DNB = {}
referentielFR.DNBTags = {}
const setTagsDNB = new Set()

for (const ex in dictionnaireDNB) {
  dictionnaireDNB[ex].tags.forEach(e => {
    setTagsDNB.add(e)
  })
}

const tagsDNB = [...setTagsDNB].sort((a, b) => { return a.localeCompare(b) })
for (const annee of ['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013']) {
  referentielFR.DNB[annee] = {}
  for (const ex in dictionnaireDNB) {
    if (dictionnaireDNB[ex].annee === annee) {
      referentielFR.DNB[annee][ex] = { uuid: ex, ...dictionnaireDNB[ex] }
    }
  }
}

for (const tag of tagsDNB) {
  referentielFR.DNBTags[tag] = {}
  for (const ex in dictionnaireDNB) {
    if (dictionnaireDNB[ex].tags.includes(tag)) {
      referentielFR.DNBTags[tag][ex] = { uuid: ex, ...dictionnaireDNB[ex] }
    }
  }
}

// Gestion du BAC
referentielFR.BAC = {}
const setThemesBAC = new Set()

for (const ex in dictionnaireBAC) {
  dictionnaireBAC[ex].tags.forEach(e => {
    setThemesBAC.add(e)
  })
}

for (const annee of ['2021', '2022', '2023', '2024', '2025', '2026']) {
  referentielFR.BAC[annee] = {}
  for (const ex in dictionnaireBAC) {
    if (dictionnaireBAC[ex].annee === annee) {
      referentielFR.BAC[annee][ex] = { uuid: ex, ...dictionnaireBAC[ex] }
    }
  }
}

const tagsBAC = [...setThemesBAC].sort((a, b) => { return a.localeCompare(b) })
referentielFR.BACTags = {}

for (const tag of tagsBAC) {
  referentielFR.BACTags[tag] = {}
  for (const ex in dictionnaireBAC) {
    if (dictionnaireBAC[ex].tags.includes(tag)) {
      referentielFR.BACTags[tag][ex] = { uuid: ex, ...dictionnaireBAC[ex] }
    }
  }
}

// Gestion du BAC
referentielFR.E3C = {}
const setThemesE3C = new Set()

for (const ex in dictionnaireE3C) {
  dictionnaireE3C[ex].tags.forEach(e => {
    setThemesE3C.add(e)
  })
}

for (const annee of ['2020', '2021']) {
  referentielFR.E3C[annee] = {}
  for (const ex in dictionnaireE3C) {
    if (dictionnaireE3C[ex].annee === annee) {
      referentielFR.E3C[annee][ex] = { uuid: ex, ...dictionnaireE3C[ex] }
    }
  }
}

const tagsE3C = [...setThemesE3C].sort((a, b) => { return a.localeCompare(b) })
referentielFR.E3CTags = {}

for (const tag of tagsE3C) {
  referentielFR.E3CTags[tag] = {}
  for (const ex in dictionnaireE3C) {
    if (dictionnaireE3C[ex].tags.includes(tag)) {
      referentielFR.E3CTags[tag][ex] = { uuid: ex, ...dictionnaireE3C[ex] }
    }
  }
}

// Gestion du CRPE version Coopmaths ET COPIRELEM maintenant (05/06/2024)
referentielFR.crpe = {}
const setThemesCrpe = new Set()

for (const ex in dictionnaireCrpeCoop) {
  dictionnaireCrpeCoop[ex].tags.forEach(e => {
    setThemesCrpe.add(e)
  })
}

for (const annee of ['2019', '2018', '2017', '2016', '2015', '2022', '2023', '2025']) {
  referentielFR.crpe[annee] = {}
  for (const ex in dictionnaireCrpeCoop) {
    if (dictionnaireCrpeCoop[ex].annee === annee) {
      referentielFR.crpe[annee][ex] = { uuid: ex, ...dictionnaireCrpeCoop[ex] }
    }
  }
}

const tagsCrpe = [...setThemesCrpe].sort((a, b) => { return a.localeCompare(b) })
referentielFR.crpeTags = {}

for (const tag of tagsCrpe) {
  referentielFR.crpeTags[tag] = {}
  for (const ex in dictionnaireCrpeCoop) {
    if (dictionnaireCrpeCoop[ex].tags.includes(tag)) {
      referentielFR.crpeTags[tag][ex] = { uuid: ex, ...dictionnaireCrpeCoop[ex] }
    }
  }
}

// Gestion du CRPE version Copirelem
/* referentielFR.crpeCopirelem = {}
const setThemesCrpeCopirelem = new Set()

for (const ex in dictionnaireCrpe) {
  dictionnaireCrpe[ex].tags.forEach(e => {
    setThemesCrpeCopirelem.add(e)
  })
}

for (const annee of ['2019', '2018', '2017', '2016', '2015']) {
  referentielFR.crpeCopirelem[annee] = {}
  for (const ex in dictionnaireCrpe) {
    if (dictionnaireCrpe[ex].annee === annee) {
      referentielFR.crpeCopirelem[annee][ex] = { uuid: ex, ...dictionnaireCrpe[ex] }
    }
  }
}

const tagsCrpeCopirelem = [...setThemesCrpeCopirelem].sort((a, b) => { return a.localeCompare(b) })
referentielFR.crpeCopirelemTags = {}

for (const tag of tagsCrpeCopirelem) {
  referentielFR.crpeCopirelemTags[tag] = {}
  for (const ex in dictionnaireCrpe) {
    if (dictionnaireCrpe[ex].tags.includes(tag)) {
      referentielFR.crpeCopirelemTags[tag][ex] = { uuid: ex, ...dictionnaireCrpe[ex] }
    }
  }
} */

// Gestion du ref EVACOM
referentielCH.EVACOM = {}
referentielCH.EVACOMTags = {}
const setTagsEVACOM = new Set()

for (const ex in dictionnaireEVACOM) {
  dictionnaireEVACOM[ex].tags.forEach(e => {
    setTagsEVACOM.add(e)
  })
}

const tagsEVACOM = [...setTagsEVACOM].sort((a, b) => { return a.localeCompare(b) })
for (const annee of ['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013']) {
  referentielCH.EVACOM[annee] = {}
  for (const ex in dictionnaireEVACOM) {
    if (dictionnaireEVACOM[ex].annee === annee) {
      referentielCH.EVACOM[annee][ex] = { uuid: ex, ...dictionnaireEVACOM[ex] }
    }
  }
}

for (const tag of tagsEVACOM) {
  referentielCH.EVACOMTags[tag] = {}
  for (const ex in dictionnaireEVACOM) {
    if (dictionnaireEVACOM[ex].tags.includes(tag)) {
      referentielCH.EVACOMTags[tag][ex] = { uuid: ex, ...dictionnaireEVACOM[ex] }
    }
  }
}

// On renomme les clés à la racine du référentiel
delete Object.assign(referentielFR, { 'Brevet des collèges par thème - APMEP': referentielFR.DNBTags }).DNBTags
delete Object.assign(referentielFR, { 'Brevet des collèges par année - APMEP': referentielFR.DNB }).DNB
delete Object.assign(referentielFR, { 'BAC par thème - APMEP': referentielFR.BACTags }).BACTags
delete Object.assign(referentielFR, { 'BAC par année - APMEP': referentielFR.BAC }).BAC
// delete Object.assign(referentielFR, { 'CRPE (2015-2019) par thème - COPIRELEM': referentielFR.crpeCopirelemTags }).crpeCopirelemTags
// delete Object.assign(referentielFR, { 'CRPE (2015-2019) par année - COPIRELEM': referentielFR.crpeCopirelem }).crpeCopirelem
// delete Object.assign(referentielFR, { 'CRPE (2022-2023) par thème': referentielFR.crpeTags }).crpeTags
// delete Object.assign(referentielFR, { 'CRPE (2022-2023) par année': referentielFR.crpe }).crpe
delete Object.assign(referentielFR, { 'CRPE par thème': referentielFR.crpeTags }).crpeTags
delete Object.assign(referentielFR, { 'CRPE par année': referentielFR.crpe }).crpe
// delete Object.assign(referentielFR, { 'E3C par thème - APMEP': referentielFR.E3CTags }).E3CTags
// delete Object.assign(referentielFR, { 'E3C par specimen - APMEP': referentielFR.E3C }).E3C
delete Object.assign(referentielFR, { 'E3C par thème': referentielFR.E3CTags }).E3CTags
delete Object.assign(referentielFR, { 'E3C par année': referentielFR.E3C }).E3C

delete Object.assign(referentielCH, { 'EVACOM par thème': referentielCH.EVACOMTags }).EVACOMTags
delete Object.assign(referentielCH, { 'EVACOM par année': referentielCH.EVACOM }).EVACOM

const dataFR = JSON.stringify(referentielFR, null, 2)
fs.writeFileSync('src/json/referentielStaticFR.json', dataFR)

const dataCH = JSON.stringify(referentielCH, null, 2)
fs.writeFileSync('src/json/referentielStaticCH.json', dataCH)
