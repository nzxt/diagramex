const findParent = function (elem) {
  if (!elem) return
  const types = ['uc', 'vr', 'ct']
  const { id } = elem.node
  if (id && (types.includes(id.substring(0, 2)) || id === 'canvas')) {
    return elem
  } else {
    const parent = elem.parent()
    return findParent(parent)
  }
}

export { findParent }
