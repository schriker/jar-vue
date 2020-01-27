let messageInterval
let timeInterval

onmessage = ({ data }) => {
  const intervalFunction = () => {
    const messagesInView = data.fetched.filter((message, index) => {
      const condition = (message.timestamp * 1000) <= data.startTime
      if (condition) {
        data.fetched.splice(index, 1)
      }
      return condition
    })

    for (let message of messagesInView) {
      data.messages.push(message)
      postMessage({
        type: 'ADD_MESSAGE',
        message: message
      })
    }

    if (data.messages.length > 100) {
      data.messages.splice(0, 1)
      postMessage({
        type: 'SPLICE',
        messages: data.messages
      })
    }
  }

  const timeFunction = () => {
    data.startTime = data.startTime + 1 * data.playbackRate * 50
  }

  switch (data.type) {
    case 'START':
      clearInterval(messageInterval)
      clearInterval(timeInterval)
      messageInterval = setInterval(intervalFunction, 50)
      timeInterval = setInterval(timeFunction, 50)
      break
    case 'STOP':
      clearInterval(messageInterval)
      clearInterval(timeInterval)
      break
  }
}

onerror = (error) => {
  console.log(error)
}
