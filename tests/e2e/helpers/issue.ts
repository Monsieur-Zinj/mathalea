const connection = true

export async function createIssue (urlExercice : string, messages : string[], labels : string[], log : (...args: unknown[]) => void) {
  if (!connection) {
    // pas de création de tickets
    return
  }

  const idPath = (new URL(urlExercice)).searchParams.get('id')

  labels.unshift('testIntegration')
  const formData = new FormData()
  const title = 'TI bug: ' + idPath
  formData.append('title', title)
  formData.append('description', '```\n' + urlExercice + '\n' + messages.join('\n') + '\n```')
  formData.append('labels', labels.join(','))

  // issues?search=foo&in=title
  let existIssue = true
  const headers = new Headers()
  headers.append('PRIVATE-TOKEN', 'glpat-7HAP-zfe6c461w6muAgV')
  await fetch(`https://forge.apps.education.fr/api/v4/projects/451/issues?search=${title}&in=title`, {
    method: 'GET',
    headers,
    signal: AbortSignal.timeout(60 * 1000)
  }).then((res : Response) => {
    log('response.status =' + res.status)
    if (res.status === 200) {
      return res.json()
    }
  }).then(data => {
    if (data instanceof Array) {
      const ouvert = data.find(ticket => ticket.state === 'opened')
      if (!ouvert) {
        existIssue = false
      } else {
        log('Issued existed : ' + JSON.stringify(ouvert))
      }
    }
  }).catch((err) => {
    log('Error occured' + err)
    log(err.name)
  })

  if (existIssue) {
    return
  }

  // curl --header "PRIVATE-TOKEN:glpat-7HAP-zfe6c461w6muAgV" --request POST --verbose --url "https://forge.apps.education.fr/api/v4/projects/451/issues?title=TItest&labels=TIlabels"

  await fetch('https://forge.apps.education.fr/api/v4/projects/451/issues', {
    method: 'POST',
    headers,
    body: formData,
    signal: AbortSignal.timeout(60 * 1000)
  }).then((res : Response) => {
    log('response.status =' + res.status)
    if (res.status === 201) {
      log('issue sended:' + urlExercice)
    } else {
      log('error to send issue:' + urlExercice)
    }
  })
}
