import { useEffect, useState } from "react"
import ReconnectingWebSocket from 'reconnecting-websocket'
import { getWebsocketUrl } from "../utils/websocket"
import { EBizCode } from "../api/enums"

/**
 * Websocket connection to Drone
 */
export const useWebsocket = () => {
  const webSocket = new ReconnectingWebSocket(getWebsocketUrl(), [], {
    maxReconnectionDelay: 20000,
    minReconnectionDelay: 5000,
    maxRetries: 5
  })

  const [payload, setPayload] = useState({})

  useEffect(() => {
    webSocket.addEventListener('open', onOpen)
    webSocket.addEventListener('close', onClose)
    webSocket.addEventListener('error', onError)
    webSocket.addEventListener('message', onMessage)

    return () => {
      return webSocket?.close()
    }
  }, [])

  const onOpen = () => {
    console.log("Open Socket...")
  }

  const onClose = () => {
    console.log("Closed Socket")
  }

  const onError = () => {
    console.error("ws error")
  }

  const onMessage = (msg) => {
    const data = JSON.parse(msg.data)

    if (!data) {
      return
    }

    switch (data.biz_code) {
      case EBizCode.DeviceOsd:
        const osd = {
          ...payload,
          [data.data.sn]: data.data.host
        }
        setPayload(osd)
        break;
      default:
        break
    }
  }

  return payload

}