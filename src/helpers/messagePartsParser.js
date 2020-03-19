import emojisArray from './emojis'
import shortid from 'shortid'
import linkifyHtml from 'linkifyjs/html'
import replaceTag from '../helpers/escapeTags'

export const messageParser = (messageToParse, emoticons) => {
  let messageComponents = []
  let message = linkifyHtml(messageToParse.replace(/[&<>]/g, replaceTag), {
    defaultProtocol: 'https'
  })

  message = message.replace('\u0001ACTION', '')
  const messageParts = message.split(' ')

  for (let part of messageParts) {
    messageComponents = [
      ...messageComponents,
      ...messagePartsParser(part, emoticons)
    ]
  }

  return messageComponents.reduce(parserReducer, [])
}

const messagePartsParser = (part, emoticons) => {
  const emojiRegex = new RegExp(/:(\D\d|\w*?):/, 'g')

  if (emojiRegex.test(part)) {
    const emojis = []
    const shortCodes = part.split(':')
    for (let shortCode of shortCodes) {
      if (shortCode.length > 0) {
        const emoji = emojisArray.filter(el => el.shortcodes.includes(shortCode))
        if (emoji.length === 0) {
          emojis.push({
            id: shortid.generate(),
            type: 'text',
            value: shortCode,
            body: shortCode
          })
        } else {
          emojis.push({
            id: shortid.generate(),
            type: 'emoji',
            value: `:${shortCode}:`,
            body: window.twemoji.parse(emoji[0].emoji)
          })
        }
      }
    }
    return emojis
  }

  for (const emoticon of emoticons) {
    const emoticonRegex = new RegExp('\\b' + emoticon.name + '\\b', 'g')
    if (emoticonRegex.test(part)) {
      return [{
        id: shortid.generate(),
        type: 'emoticon',
        value: part,
        body: `<img alt="${emoticon.name}" class="chat__emoticon" src="https://static.poorchat.net/emoticons/${emoticon.file}/4x" />`
      }]
    }
  }

  return [{
    id: shortid.generate(),
    type: 'text',
    value: part,
    body: part
  }]
}

const parserReducer = (acc, obj) => {
  if (acc.length === 0) {
    return [obj]
  } else if (acc[acc.length - 1].type === 'text' && obj.type === 'text') {
    acc[acc.length - 1].body = `${acc[acc.length - 1].body} ${obj.body}`
    return [
      ...acc
    ]
  } else {
    acc[acc.length - 1].body = `${acc[acc.length - 1].body} `
    return [
      ...acc,
      obj
    ]
  }
}
