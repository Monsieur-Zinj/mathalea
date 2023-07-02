/**
 * détecte si le navigateur et safari ou chrome et renvoie un booléen
 * @author Sébastien Lozano
 */
export function detectSafariChromeBrowser () {
  let isChrome = navigator.userAgent.indexOf('Chrome') > -1
  // var is_explorer = navigator.userAgent.indexOf('MSIE') > -1;
  // var is_firefox = navigator.userAgent.indexOf('Firefox') > -1;
  let isSafari = navigator.userAgent.indexOf('Safari') > -1
  const isOpera = navigator.userAgent.toLowerCase().indexOf('op') > -1
  if ((isChrome) && (isSafari)) {
    isSafari = false
  }
  if ((isChrome) && (isOpera)) {
    isChrome = false
  }

  return (isChrome || isSafari)
}
