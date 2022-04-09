// cleanup
const cleanupString = (str) => {
  return str.split('\n').join('').replace(/\s+/g, ' ').trim()
}

module.exports = { cleanupString }