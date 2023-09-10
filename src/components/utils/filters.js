/**
   * Trier un tableau de chaînes de caractères contenant des tirets
   * comme `4A10`, `4A10-1` `4A10-10`, etc.
   * Source : https://stackoverflow.com/a/47051217
   * @param data tableau à trier
   * @param order `asc` (défaut) ou `desc`
   */
export function sortArrayOfStringsWithHyphens (data, order = 'asc') {
  function isNumber (v) {
    return (+v).toString() === v
  }
  const sorting = {
    asc: function (a, b) {
      let i = 0
      const l = Math.min(a.value.length, b.value.length)

      while (i < l && a.value[i] === b.value[i]) {
        i++
      }
      if (i === l) {
        return a.value.length - b.value.length
      }
      if (isNumber(a.value[i]) && isNumber(b.value[i])) {
        return a.value[i] - b.value[i]
      }
      return a.value[i].localeCompare(b.value[i])
    },
    desc: function (a, b) {
      return sorting.asc(b, a)
    }
  }
  const mapped = data.map(function (el, i) {
    const string = el.replace(/\d(?=[a-z])|[a-z](?=\.)/gi, '$&. .')
    const regex = /(\d+)|([^0-9.]+)/g
    let m
    const parts = []

    while ((m = regex.exec(string)) !== null) {
      parts.push(m[0])
    }
    return { index: i, value: parts, o: el, string }
  })
  mapped.sort(sorting[order] || sorting.asc)
  return mapped.map(function (el) {
    return data[el.index]
  })
}
