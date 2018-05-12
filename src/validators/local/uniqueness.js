import $ from 'jquery'

export const uniquenessLocalValidator = function (element, options) {
  const name = element.attr('name')

  if (!/_attributes\]\[\d/.test(name)) {
    return
  }

  const matches = name.match(/^(.+_attributes\])\[\d+\](.+)$/)
  const namePrefix = matches[1]
  const nameSuffix = matches[2]
  let value = element.val()

  if (!(namePrefix && nameSuffix)) {
    return
  }

  const form = element.closest('form')
  let valid = true

  form.find(':input[name^="' + namePrefix + '"][name$="' + nameSuffix + '"]').each(function () {
    var otherValue = $(this).val()

    if (!options.case_sensitive) {
      value = value.toLowerCase()
      otherValue = otherValue.toLowerCase()
    }

    if ($(this).attr('name') !== name) {
      if (otherValue === value) {
        valid = false
        return $(this).data('notLocallyUnique', true)
      } else {
        if ($(this).data('notLocallyUnique')) {
          return $(this).removeData('notLocallyUnique').data('changed', true)
        }
      }
    }
  })

  if (!valid) {
    return options.message
  }
}

export default {
  uniquenessLocalValidator
}
