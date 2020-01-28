const replaceTag = (tag) => {
  const escapeTags = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#039;'
  }
  return escapeTags[tag] || tag
}

export default replaceTag
