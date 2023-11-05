/*
  Author: Guillaume Valmont
  Date : November 5, 2023
  Licence: CC-BY-SA 4.0
  https://forge.aeif.fr/anki-templates/mathalea
*/

// v1.1.8 - https://github.com/SimonLammer/anki-persistence/blob/584396fea9dea0921011671a47a0fdda19265e62/script.js
if (void 0 === window.Persistence) { var e = "github.com/SimonLammer/anki-persistence/", t = "_default"; if (window.Persistence_sessionStorage = function () { var i = !1; try { "object" == typeof window.sessionStorage && (i = !0, this.clear = function () { for (var t = 0; t < sessionStorage.length; t++) { var i = sessionStorage.key(t); 0 == i.indexOf(e) && (sessionStorage.removeItem(i), t--) } }, this.setItem = function (i, n) { void 0 == n && (n = i, i = t), sessionStorage.setItem(e + i, JSON.stringify(n)) }, this.getItem = function (i) { return void 0 == i && (i = t), JSON.parse(sessionStorage.getItem(e + i)) }, this.removeItem = function (i) { void 0 == i && (i = t), sessionStorage.removeItem(e + i) }, this.getAllKeys = function () { for (var t = [], i = Object.keys(sessionStorage), n = 0; n < i.length; n++) { var s = i[n]; 0 == s.indexOf(e) && t.push(s.substring(e.length, s.length)) } return t.sort() }) } catch (n) { } this.isAvailable = function () { return i } }, window.Persistence_windowKey = function (i) { var n = window[i], s = !1; "object" == typeof n && (s = !0, this.clear = function () { n[e] = {} }, this.setItem = function (i, s) { void 0 == s && (s = i, i = t), n[e][i] = s }, this.getItem = function (i) { return void 0 == i && (i = t), void 0 == n[e][i] ? null : n[e][i] }, this.removeItem = function (i) { void 0 == i && (i = t), delete n[e][i] }, this.getAllKeys = function () { return Object.keys(n[e]) }, void 0 == n[e] && this.clear()), this.isAvailable = function () { return s } }, window.Persistence = new Persistence_sessionStorage, Persistence.isAvailable() || (window.Persistence = new Persistence_windowKey("py")), !Persistence.isAvailable()) { var i = window.location.toString().indexOf("title"), n = window.location.toString().indexOf("main", i); i > 0 && n > 0 && n - i < 10 && (window.Persistence = new Persistence_windowKey("qt")) } }

function rectoIframeUpdate (urlFieldRaw) {
  const url = formatUrl(urlFieldRaw, 'recto', seed.reroll())
  iframeUpdate('recto-iframe-container', url)
}

function versoIframeUpdate (urlFieldRaw) {
  const url = formatUrl(urlFieldRaw, 'verso', seed.get())
  iframeUpdate('verso-iframe-container', url)
}

function iframeUpdate (iframeId, url) {
  if (url === '') {
    document.getElementById(iframeId).innerHTML = 'Il y a un problème avec l\'url, vérifier que le champ "url" de la carte contient bien un lien vers un exercice de MathALÉA.<br><a href="https://coopmaths.fr/alea">https://coopmaths.fr/alea</a>'
  } else {
    document.getElementById(iframeId).innerHTML = `<iframe id="${iframeId}" src="${url}" allowfullscreen frameborder="0"></iframe>`
  }
}

const seed = {
  reroll () {
    if (Persistence.isAvailable()) {
      const existingSeed = Persistence.getItem('seed')
      if (existingSeed == null) {
        const newSeed = Math.random().toString(16).substring(2, 6)
        Persistence.setItem('seed', newSeed)
        return newSeed
      }
      return existingSeed
    }
    return ''
  },
  get () {
    if (Persistence.isAvailable()) {
      const existingSeed = Persistence.getItem('seed')
      Persistence.clear()
      return existingSeed
    }
    return ''
  }
}

function formatUrl (urlFieldRaw, view, seed) {
  let url = cleanseUrl(urlFieldRaw)
  if (isTemplateScreen(url)) url = 'https://coopmaths.fr/alea/?uuid=0e6bd'
  if (!isValidUrl(url)) return ''
  url = replaceParam(url, '&i=', '0')
  url = replaceParam(url, '&alea=', seed)
  url = replaceParam(url, '&v=', view)
  return url
}

function cleanseUrl (urlFieldRaw) {
  const urlField = urlFieldRaw.slice(16, urlFieldRaw.length - 4).trim()
  if (urlField.charAt(0) === '<') {
    const urlBeginningIndex = urlField.indexOf('>') + 1
    const urlEndingIndex = urlField.indexOf('</a>')
    return urlField.slice(urlBeginningIndex, urlEndingIndex).replace(/&amp;/g, '&')
  }
  return urlField.replace(/&amp;/g, '&')
}

function replaceParam (url, paramPattern, newValue) {
  if (url.includes(paramPattern)) {
    const beforePattern = url.split(paramPattern)[0]
    const afterPattern = url.slice(beforePattern.length + paramPattern.length)
    const otherParams = afterPattern.split('&')
    otherParams.shift()
    return beforePattern + paramPattern + newValue + otherParams.join('')
  } else {
    return url + paramPattern + newValue
  }
}

function isValidUrl (url) {
  if (url.startsWith('https://coopmaths.fr/alea') && url.includes('uuid=')) return true
  if (url.startsWith('https://topmaths.fr') && url.includes('uuid=')) return true
  return false
}

function isTemplateScreen (url) {
  return url === '(url)'
}
