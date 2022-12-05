import { CURRENT_CONFIG } from "../api/config"
import { ELocalStorageKey } from "../api/enums"

export function getWebsocketUrl () {
  const token = localStorage.getItem(ELocalStorageKey.Token) || ''
  const url = CURRENT_CONFIG.websocketURL + '?x-auth-token=' + encodeURI(token)
  return url
}