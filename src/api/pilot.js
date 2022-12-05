import { HTTP_PREFIX, CURRENT_CONFIG } from "./config"
import { EComponentName, EPhotoType, EUserType, EVideoPublishType, ELocalStorageKey, EBizCode, EDownloadOwner, EStatusValue } from "./enums"
import { getDeviceBySn, login, refreshToken } from "./manage"
import { bindDevice } from "./manage"

const components = new Map()
let bindNum;

function returnBool(response) {
  console.log(response)
  const res = JSON.parse(response)
  const isError = errorHint(res)
  if (JSON.stringify(res.data) !== '{}') {
    return isError && res.data
  }
  return isError
}

function returnString(response) {
  const res = JSON.parse(response)
  return errorHint(res) ? res.data : ''
}

function returnNumber(response) {
  const res = JSON.parse(response)
  return errorHint(res) ? res.data : -1
}

function errorHint(response) {
  if (response.code !== 0) {
    console.error(response.message)
    return false
  }
  return true
}

export const apiPilot = {
  init() {
    const thingParam = {
      host: '',
      connectCallback: '',
      username: '',
      password: ''
    }
    components.set(EComponentName.Thing, thingParam)
    const liveshareParam = {
      videoPublishType: EVideoPublishType.VideoDemandAuxManual,
      statusCallback: 'liveStatusCallback'
    }
    components.set(EComponentName.Liveshare, liveshareParam)
    const mapParam = {
      userName: '',
      elementPreName: 'PILOT'
    }
    components.set(EComponentName.Map, mapParam)
    const wsParam = {
      host: CURRENT_CONFIG.websocketURL,
      token: '',
      connectCallback: 'wsConnectCallback'
    }
    components.set(EComponentName.Ws, wsParam)
    const apiParam = {
      host: '',
      token: ''
    }
    components.set(EComponentName.Api, apiParam)
    components.set(EComponentName.Tsa, {})
    const mediaParam = {
      autoUploadPhoto: true,
      autoUploadPhotoType: EPhotoType.Preview,
      autoUploadVideo: true
    }
    components.set(EComponentName.Media, mediaParam)
    components.set(EComponentName.Mission, {})

    return components
  },

  getComponentParam(key) {
    return components.get(key)
  },
  setComponentParam(key, value) {
    components.set(key, value)
  },
  loadComponent(name, param) {
    return returnString(window.djiBridge.platformLoadComponent(name, JSON.stringify(param)))
  },
  unloadComponent(name) {
    return returnString(window.djiBridge.platformUnloadComponent(name))
  },
  isComponentLoaded(module) {
    return returnBool(window.djiBridge.platformIsComponentLoaded(module))
  },
  setWorkspaceId(uuid) {
    return returnString(window.djiBridge.platformSetWorkspaceId(uuid))
  },
  setPlatformMessage(platformName, title, desc) {
    return returnBool(window.djiBridge.platformSetInformation(platformName, title, desc))
  },
  getRemoteControllerSN() {
    return returnString(window.djiBridge.platformGetRemoteControllerSN())
  },
  getAircraftSN() {
    return returnString(window.djiBridge.platformGetAircraftSN())
  },
  stopwebview() {
    return returnString(window.djiBridge.platformStopSelf())
  },
  setLogEncryptKey(key) {
    return window.djiBridge.platformSetLogEncryptKey(key)
  },
  clearLogEncryptKey() {
    return window.djiBridge.platformClearLogEncryptKey()
  },
  getLogPath() {
    return returnString(window.djiBridge.platformGetLogPath())
  },
  platformVerifyLicense: function (appId, appKey, appLicense) {
    return returnBool(window.djiBridge.platformVerifyLicense(appId, appKey, appLicense))
  },
  isPlatformVerifySuccess() {
    return returnBool(window.djiBridge.platformIsVerified())
  },
  isAppInstalled(pkgName) {
    return returnBool(window.djiBridge.platformIsAppInstalled(pkgName))
  },
  getVersion() {
    return window.djiBridge.platformGetVersion()
  },

  // thing
  thingGetConnectState() {
    return returnBool(window.djiBridge.thingGetConnectState())
  },

  thingGetConfigs() {
    const thingParam = JSON.parse(window.djiBridge.thingGetConfigs())
    return thingParam.code === 0 ? JSON.parse(thingParam.data) : {}
  },

  // api
  getToken() {
    return returnString(window.djiBridge.apiGetToken())
  },
  setToken(token) {
    return returnString(window.djiBridge.apiSetToken(token))
  },
  getHost() {
    return returnString(window.djiBridge.apiGetHost())
  },

  // liveshare
  /**
   *
   * @param type
   * video-on-demand: 服务器点播，依赖于thing模块，具体的点播命令参见设备物模型的直播服务
   * video-by-manual：手动点播，配置好直播类型参数之后，在图传页面可修改直播参数，停止直播
   * video-demand-aux-manual: 混合模式，支持服务器点播，以及图传页面修改直播参数，停止直播
   */
  setVideoPublishType(type) {
    return returnBool(window.djiBridge.liveshareSetVideoPublishType(type))
  },

  /**
   *
   * @returns
   * type: liveshare type， 0：unknown, 1:agora, 2:rtmp, 3:rtsp, 4:gb28181
   */
  getLiveshareConfig() {
    return returnString(window.djiBridge.liveshareGetConfig())
  },

  setLiveshareConfig(type, params) {
    return window.djiBridge.liveshareSetConfig(type, params)
  },

  setLiveshareStatusCallback(callbackFunc) {
    return window.djiBridge.liveshareSetStatusCallback(callbackFunc)
  },
  getLiveshareStatus() {
    return JSON.parse(JSON.parse(window.djiBridge.liveshareGetStatus()).data)
  },
  startLiveshare() {
    return returnBool(window.djiBridge.liveshareStartLive())
  },
  stopLiveshare() {
    return returnBool(window.djiBridge.liveshareStopLive())
  },
  // WebSocket
  wsGetConnectState() {
    return returnBool(window.djiBridge.wsGetConnectState())
  },
  wsConnect(host, token, callback) {
    return window.djiBridge.wsConnect(host, token, callback)
  },
  wsDisconnect() {
    return window.djiBridge.wsConnect()
  },
  wsSend(message) {
    return window.djiBridge.wsSend(message)
  },
  // media
  setAutoUploadPhoto(auto) {
    return window.djiBridge.mediaSetAutoUploadPhoto(auto)
  },
  getAutoUploadPhoto() {
    return returnBool(window.djiBridge.mediaGetAutoUploadPhoto())
  },
  setUploadPhotoType(type) {
    return window.djiBridge.mediaSetUploadPhotoType(type)
  },
  getUploadPhotoType() {
    return returnNumber(window.djiBridge.mediaGetUploadPhotoType())
  },
  setAutoUploadVideo(auto) {
    return window.djiBridge.mediaSetAutoUploadVideo(auto)
  },
  getAutoUploadVideo() {
    return returnBool(window.djiBridge.mediaGetAutoUploadVideo())
  },
  setDownloadOwner(rcIndex) {
    return window.djiBridge.mediaSetDownloadOwner(rcIndex)
  },
  getDownloadOwner() {
    return returnNumber(window.djiBridge.mediaGetDownloadOwner())
  },
  onBackClickReg() {
    // window.djiBridge.onBackClick = () => {
    //   if (root.$router.currentRoute.value.path === '/' + ERouterName.PILOT_HOME) {
    //     return false
    //   } else {
    //     history.go(-1)
    //     return true
    //   }
    // }
  },
  onStopPlatform() {
    window.djiBridge.onStopPlatform = () => {
      localStorage.clear()
    }
  }
}

export const verifyLicense = () => {
  let isVerified = apiPilot.platformVerifyLicense(CURRENT_CONFIG.appId, CURRENT_CONFIG.appKey, CURRENT_CONFIG.appLicense) &&
    apiPilot.isPlatformVerifySuccess()
  if (isVerified) {
    console.log('The license verification is successful.')
  } else {
    console.error('Filed to verify the license. Please check license whether the license is correct, or apply again.')
  }
  return isVerified
}

export const checkToken = async () => {
  const token = localStorage.getItem(ELocalStorageKey.Token)

  if (token) {
    try {
      const res = await refreshToken()
      console.log("res", res)
      apiPilot.setComponentParam(EComponentName.Api, {
        host: CURRENT_CONFIG.baseURL,
        token: res.data.access_token
      })
      const jsres = apiPilot.loadComponent(EComponentName.Api, apiPilot.getComponentParam(EComponentName.Api))
      if (!jsres) {
        console.error('Failed to load api module.')
        return false
      }
      apiPilot.setToken(res.data.access_token)
      localStorage.setItem(ELocalStorageKey.Token, res.data.access_token)
      return true
    } catch {
      return await pilotLogin()
    }
  } else {
    return await pilotLogin()
  }
}

const pilotLogin = async () => {
  const res = await login("pilot", "pilot123", EUserType.Pilot)
  if (res.code === 0) {
    apiPilot.setComponentParam(EComponentName.Api, {
      host: CURRENT_CONFIG.baseURL,
      token: res.data.access_token
    })
    const jsres = apiPilot.loadComponent(
      EComponentName.Api,
      apiPilot.getComponentParam(EComponentName.Api)
    )
    console.log('load api module res:', jsres)
    console.log('login', res.data.workspace_id)
    apiPilot.setToken(res.data.access_token)
    localStorage.setItem(ELocalStorageKey.Token, res.data.access_token)
    localStorage.setItem(ELocalStorageKey.WorkspaceId, res.data.workspace_id)
    localStorage.setItem(ELocalStorageKey.UserId, res.data.user_id)
    localStorage.setItem(ELocalStorageKey.Username, res.data.username)
    localStorage.setItem(ELocalStorageKey.Flag, EUserType.Pilot.toString())
    return true
    //root.$router.push(ERouterName.PILOT_HOME)
  } else {
    console.error(res.message)
    return false
  }
}

export const createBinding = async () => {
  const sn = apiPilot.getAircraftSN()
  const userId = localStorage.getItem(ELocalStorageKey.UserId)
  const workspace_id = localStorage.getItem(ELocalStorageKey.WorkspaceId)
  if (sn === undefined || userId === undefined || workspace_id === undefined) return false

  const bindParam = {
    device_sn: sn,
    user_id: userId,
    workspace_id: workspace_id
  }

  const bindRes = await bindDevice(bindParam)
  if (bindRes.code !== 0) {
    console.error('bind failed:' + bindRes.message)
    console.error(bindRes.message)
    return false
  }
  console.log('bindRes', bindRes)
  return true
  //drone.data.bound_status = true
  //localStorage.setItem(ELocalStorageKey.Device, JSON.stringify(drone.data))
}

export const messageHandler = async (payload) => {
  if (!payload) {
    return
  }
  switch (payload.biz_code) {
    case EBizCode.DeviceOnline: {
      console.info('online: ', payload)
      break
    }
    case EBizCode.DeviceOffline: {
      console.info('offline: ', payload)

    }

    default:
      break
  }
}

export const connectCallback = async (arg) => {
  console.log("inside callback", arg)
  if (arg) {
    console.log("Connected")
    const sn = apiPilot.getAircraftSN()
    const userId = localStorage.getItem(ELocalStorageKey.UserId)
    const workspace_id = localStorage.getItem(ELocalStorageKey.WorkspaceId)

    const bindParam = {
      device_sn: sn,
      user_id: userId,
      workspace_id: workspace_id
    }
    // liveshare
    apiPilot.loadComponent(EComponentName.Liveshare, components.get(EComponentName.Liveshare))

    // ws
    const wsParam = components.get(EComponentName.Ws)
    wsParam.token = apiPilot.getToken()
    apiPilot.loadComponent(EComponentName.Ws, components.get(EComponentName.Ws))

    // map
    const mapParam = components.get(EComponentName.Map)
    mapParam.userName = 'pilot'
    apiPilot.loadComponent(EComponentName.Map, components.get(EComponentName.Map))

    // tsa
    apiPilot.loadComponent(EComponentName.Tsa, components.get(EComponentName.Tsa))

    // media
    apiPilot.loadComponent(EComponentName.Media, components.get(EComponentName.Media))
    apiPilot.setDownloadOwner(EDownloadOwner.Mine.valueOf())

    // mission
    apiPilot.loadComponent(EComponentName.Mission, {})

    bindNum = setInterval(() => {
      bindDevice(bindParam).then(bindRes => {
        if (bindRes.code !== 0) {
          console.error(bindRes.message)
        } else {
          clearInterval(bindNum)
        }
      })
    }, 2000)
    setTimeout(getDeviceInfo, 3000)
  } else {
    console.log("Disconnected")
  }
}

export const wsConnectCallback = async (arg) => {
  console.log('wsConnectedCallback', arg)
}

export const getDeviceInfo = () => {
  const sn = apiPilot.getAircraftSN()
  const userId = localStorage.getItem(ELocalStorageKey.UserId)
  const workspace_id = localStorage.getItem(ELocalStorageKey.WorkspaceId)

  const bindParam = {
    device_sn: sn,
    user_id: userId,
    workspace_id: workspace_id
  }

  if (sn === EStatusValue.DISCONNECT) {
    return
  }
  getDeviceBySn(bindParam.workspace_id, sn).then(res => {
    if (res.code !== 0) {
      return
    }
    console.log(res.data)
  })
}