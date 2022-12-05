import { useEffect } from "react"
import { getWebsocketUrl } from "../utils/websocket"
import ConnectWebSocket from "../websocket"

/**
 * Callback function
 * @param {(data : {[key: string]: any}) => {}} messageHandler 
 */
export const useWebsocket = (messageHandler) => {
  const webSocket = new ConnectWebSocket(getWebsocketUrl())

  useEffect(() => {
    webSocket?.registerMessageHandler(messageHandler)
    webSocket?.initSocket()

    return () => {
      return webSocket?.close()
    }
  }, [])

}