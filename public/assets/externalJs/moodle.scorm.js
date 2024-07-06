const scorm = window.pipwerks.SCORM

window.onload = function () {
  scorm.init()
  const exo = location.hash.slice(1)
  const iframe = document.createElement('iframe')
  const answers = scorm.get('cmi.suspend_data')
  iframe.src = 'https://coopmaths.fr/alea/?' + exo + '&i=1&v=eleve&recorder=moodle&title=&es=011010' + (answers !== '' ? '&done=1&answers=' + answers : '')
  iframe.setAttribute('frameborder', '0')
  iframe.setAttribute('width', '100%')
  iframe.setAttribute('height', '100%')
  document.getElementById('content').appendChild(iframe)

  try {
    // Pour éviter que les élèves ne se rendent pas compte qu'il y a plusieurs exercices, on déplie le menu si besoin
    const boutonSommaire = window.parent.document.getElementById('scorm_toc_toggle_btn')
    const sommaireCache = window.parent.document.getElementById('scorm_toc').classList.contains('disabled')
    const multiplesExos = window.parent.document.getElementById('scorm_tree').getElementsByTagName('li').length > 1
    if (sommaireCache && multiplesExos) {
      boutonSommaire.click()
    }
  } catch (e) { }
}

window.onunload = function () {
  scorm.quit()
}

window.addEventListener('message', (event) => {
  if (typeof event.data.action !== 'undefined' && event.data.action.startsWith('mathalea:')) {
    if (event.data.action === 'mathalea:score') {
      const score = Math.round((event.data.resultsByExercice[0].numberOfPoints / event.data.resultsByExercice[0].numberOfQuestions) * 100)
      scorm.status('set', 'completed')
      scorm.set('cmi.core.score.raw', score)
      scorm.set('cmi.core.score.min', '0')
      scorm.set('cmi.core.score.max', '100')
      scorm.set('cmi.suspend_data', JSON.stringify(event.data.resultsByExercice[0].answers))
      // scorm.set("cmi.success_status", "passed");
      scorm.save()
    }
  }
})
