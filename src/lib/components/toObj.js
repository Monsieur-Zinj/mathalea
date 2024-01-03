export function toObject (m) {
  const lo = {}
  for (const [k, v] of m) {
    if (v instanceof Map) {
      lo[k] = toObject(v)
    } else {
      lo[k] = v
    }
  }
  return lo
}
