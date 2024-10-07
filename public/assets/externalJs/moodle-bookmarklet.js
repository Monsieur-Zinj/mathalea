(() => {
  // Pour une raison inconnue JSzip ne fonctionne pas si requireJs est chargé
  // On contourne temporairement le soucis
  // const oldDefineAmd = window.define.amd
  window.define.amd = false
  const jsZipScript = document.createElement('script')
  jsZipScript.type = 'text/javascript'
  jsZipScript.src = 'https://coopmaths.fr/alea/assets/externalJs/jszip.min.js'
  document.body.appendChild(jsZipScript)
  // sera chargé à temps puisqu'on attend une interaction utilisateur ...

  // ////////////////////////////// //
  //    Modification de la popup    //
  // ////////////////////////////// //
  const popup = document.querySelector('.modchooser')
  if (!popup) {
    alert("Ce bouton doit être utilisé sur Moodle lorsque le sélecteur d'ajout d'activité est ouvert.")
    return
  }
  const SECTION = new URL(popup.querySelector('a[data-action="add-chooser-option"]').getAttribute('href')).searchParams.get('section')
  popup.setAttribute('style', 'max-width: 90% !important;')
  popup.querySelector('.modal-title').textContent = 'Ajouter une activité MathALÉA'
  popup.querySelector('.modal-footer').style.display = 'none'
  popup.querySelector('.modal-body').innerHTML = '<iframe src="https://coopmaths.fr/alea/?recorder=moodle" style="width:100%;height:100vh;"></iframe>'

  // ////////////////////////////// //
  //    Attente du postMessage      //
  // ////////////////////////////// //
  window.addEventListener('message', (message) => {
    if (message.data.action === 'mathalea:activityParams') {
      // ////////////////////////////// //
      //     Création du SCORM          //
      // ////////////////////////////// //
      const zip = new window.JSZip()
      const xmlScorm = document.implementation.createDocument('', '', null)
      const xmlManifest = xmlScorm.createElement('manifest')
      xmlManifest.setAttribute('identifier', 'MathAlea')
      xmlManifest.setAttribute('version', '1.0')
      xmlScorm.appendChild(xmlManifest)
      /* <metadata>
      <schema>ADL SCORM</schema>
      <schemaversion>1.2</schemaversion>
      </metadata> */
      const xmlMetadata = xmlScorm.createElement('metadata')
      const xmlSchema = xmlScorm.createElement('schema')
      xmlSchema.textContent = 'ADL SCORM'
      const xmlSchemaVersion = xmlScorm.createElement('schemaversion')
      xmlSchemaVersion.textContent = '1.2'
      xmlMetadata.appendChild(xmlSchema)
      xmlMetadata.appendChild(xmlSchemaVersion)
      xmlManifest.appendChild(xmlMetadata)
      const xmlOrganizations = xmlScorm.createElement('organizations')
      xmlOrganizations.setAttribute('default', 'coopmaths.fr')
      const xmlOrganization = xmlScorm.createElement('organization')
      xmlOrganization.setAttribute('identifier', 'coopmaths.fr')
      xmlOrganization.setAttribute('structure', 'hierarchical')
      const xmlTitle = xmlScorm.createElement('title')
      xmlTitle.textContent = 'MathAlea'
      xmlOrganization.appendChild(xmlTitle)
      xmlOrganizations.appendChild(xmlOrganization)
      xmlManifest.appendChild(xmlOrganizations)
      const xmlResources = xmlScorm.createElement('resources')
      xmlManifest.appendChild(xmlResources)
      let i = 0
      for (const exercice of message.data.exercices) {
        const xmlItem = xmlScorm.createElement('item')
        xmlItem.setAttribute('identifier', `MathAlea-Exo${i + 1}`)
        xmlItem.setAttribute('isvisible', 'true')
        xmlItem.setAttribute('identifierref', `MathAlea-Exo${i + 1}`)
        const xmlTitle = xmlScorm.createElement('title')
        xmlTitle.textContent = exercice.titre
        xmlItem.appendChild(xmlTitle)
        xmlOrganization.appendChild(xmlItem)
        const xmlResource = xmlScorm.createElement('resource')
        xmlResource.setAttribute('identifier', `MathAlea-Exo${i + 1}`)
        xmlResource.setAttribute('type', 'webcontent')
        xmlResource.setAttribute('adlcp:scormtype', 'sco')
        xmlResource.setAttribute('href', 'index.html#' + exercice.url)
        const xmlDependency = xmlScorm.createElement('dependency')
        xmlDependency.setAttribute('identifierref', 'COMMON_FILES')
        xmlResource.appendChild(xmlDependency)
        xmlResources.appendChild(xmlResource)
        i++
      }
      const xmlResource = xmlScorm.createElement('resource')
      xmlResource.setAttribute('identifier', 'COMMON_FILES')
      xmlResource.setAttribute('type', 'webcontent')
      xmlResource.setAttribute('adlcp:scormtype', 'asset')
      const xmlFile = xmlScorm.createElement('file')
      xmlFile.setAttribute('href', 'index.html')
      xmlResource.appendChild(xmlFile)
      xmlResources.appendChild(xmlResource)
      let contentScorm = new XMLSerializer().serializeToString(xmlScorm)
      let ident = ''
      // Debut Beautify XML
      // Remarque : il s'agit d'un code maison qui ne gère probablement pas tous les cas
      //            mais suffit emplement ici
      let dir = 1
      contentScorm = '<' + contentScorm.split('<').slice(1).reduce((a, x) => {
        if (x[0] === '/') {
          if (dir === 1) {
            a += '<' + x
          } else {
            a += '\n' + ident + '<' + x
          }
          ident = ident.slice(1)
          dir = -1
        } else {
          ident += ' '
          a += '\n' + ident + '<' + x
          dir = 1
          if (x.includes('/>')) {
            ident = ident.slice(1)
            dir = -1
          }
        }
        return a
      })
      // Fin Beautify XML
      contentScorm = '<?xml version="1.0" encoding="UTF-8"?>\n' + contentScorm
      zip.file('imsmanifest.xml', contentScorm)
      let indexHtml = ''
      indexHtml += '<html>\n'
      indexHtml += '  <head>\n'
      indexHtml += '    <title>MathAlea</title>\n'
      indexHtml += '    <scr' + 'ipt type="text/javascript" src="https://coopmaths.fr/alea/assets/externalJs/SCORM_API_wrapper.js"></scr' + 'ipt>\n'
      indexHtml += '    <scr' + 'ipt type="text/javascript" src="https://coopmaths.fr/alea/assets/externalJs/moodle.scorm.js"></scr' + 'ipt>\n'
      indexHtml += '  </head>\n'
      indexHtml += '  <body></body>\n'
      indexHtml += '</html>\n'
      zip.file('index.html', indexHtml)
      zip.generateAsync({ type: 'blob' }).then(function (file) {
        // ////////////////////////////// //
        //  Envoi du fichier sur Moodle   //
        // ////////////////////////////// //
        const formData = new FormData()
        formData.append('repo_upload_file', file, message.data.exercices.length === 1 ? message.data.exercices[0].titre : 'Activité MathALÉA')
        formData.append('sesskey', window.M.cfg.sesskey)
        formData.append('course', new URL(location.href).searchParams.get('id'))
        formData.append('section', SECTION)
        formData.append('module', 'scorm')
        formData.append('type', 'Files')

        fetch('dndupload.php', {
          body: formData,
          method: 'post'
        }).then(x => x.json())
          .then(x => {
            location.replace('../mod/scorm/view.php?id=' + x.cmid)
          })
      })
    }
  }, false)
})()
