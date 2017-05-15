exports.updateNotifier = function () {
  let updateNotifier

  try {
    updateNotifier = require('update-notifier')
  } catch (e) {
    updateNotifier = function shimUpdateNotifier () {
      console.error('module `update-notifier` not installed. Not checking for new version.')
      return { notify: function () { return false } }
    }
  }
}
