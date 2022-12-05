import './App.css';
import { useEffect, useState } from 'react';
import { createBinding, checkToken, verifyLicense, apiPilot, messageHandler, connectCallback, wsConnectCallback, getDeviceInfo } from './api/pilot';
import VConsole from 'vconsole';
import { DOMAIN, EComponentName, ELocalStorageKey, EStatusValue } from './api/enums';
import { getBindingDevices, getPlatformInfo, getUserInfo } from './api/manage';
import { Text } from '@chakra-ui/react'
import { useWebsocket } from './hooks/use-websocket';

const components = apiPilot.init()

function PilotApp() {

  const [licenseVerified, setLicenseVerfied] = useState(false)
  const [loggedIn, setLogedIn] = useState(false)
  const [bound, setBind] = useState(false)

  const [isApiLoaded, setApiLoaded] = useState(apiPilot.isComponentLoaded(EComponentName.Api))
  const [isMapLoaded, setMapLoaded] = useState(apiPilot.isComponentLoaded(EComponentName.Map))
  const [isWsLoaded, setWsLoaded] = useState(apiPilot.isComponentLoaded(EComponentName.Ws))
  const [isThingLoaded, setThingLoaded] = useState(apiPilot.isComponentLoaded(EComponentName.Thing))
  const [isTsaLoaded, setTsaLoaded] = useState(apiPilot.isComponentLoaded(EComponentName.Tsa))

  console.log("isLoggedIn", loggedIn)

  useWebsocket(messageHandler)

  const verify = async () => {
    const isVerified = await verifyLicense()
    setLicenseVerfied(isVerified)
  }

  useEffect(() => {

    setApiLoaded(apiPilot.isComponentLoaded(EComponentName.Api))
    setMapLoaded(apiPilot.isComponentLoaded(EComponentName.Map))
    setWsLoaded(apiPilot.isComponentLoaded(EComponentName.Ws))
    setThingLoaded(apiPilot.isComponentLoaded(EComponentName.Thing))
    setTsaLoaded(apiPilot.isComponentLoaded(EComponentName.Tsa))

  }, [
    apiPilot.isComponentLoaded(EComponentName.Api),
    apiPilot.isComponentLoaded(EComponentName.Map),
    apiPilot.isComponentLoaded(EComponentName.Ws),
    apiPilot.isComponentLoaded(EComponentName.Thing),
    apiPilot.isComponentLoaded(EComponentName.Tsa),
  ])

  // console.log("api", apiPilot.isComponentLoaded(EComponentName.Api))
  // console.log("map", apiPilot.isComponentLoaded(EComponentName.Map))
  // console.log("ws", apiPilot.isComponentLoaded(EComponentName.Ws))
  // console.log("thing", apiPilot.isComponentLoaded(EComponentName.Thing))
  // console.log("tsa", apiPilot.isComponentLoaded(EComponentName.Tsa))


  const setup = async () => {
    if (licenseVerified) {
      localStorage.clear()
      const successfulSignIn = await checkToken()
      setLogedIn(successfulSignIn)
      const workspaceId = localStorage.getItem(ELocalStorageKey.WorkspaceId)
      if (successfulSignIn) {
        // Set Platform
        // const isLoaded = apiPilot.isComponentLoaded(EComponentName.Thing)
        // if (isLoaded) {
        //   apiPilot.setPlatformMessage(
        //     '' + localStorage.getItem(ELocalStorageKey.PlatformName),
        //     "Test Group React",
        //     '' + localStorage.getItem(ELocalStorageKey.WorkspaceDesc)
        //   )
        // }
        console.log(await getPlatformInfo())
        //console.log(workspaceId)
        // Bind Aircraft
        console.log("here")
        const binded = await createBinding()
        setBind(binded)
        const devices = await getBindingDevices(workspaceId, 1, 10, 'sub-device')
        const aircraftSn = apiPilot.getAircraftSN()

        if (devices.data.list.some(device => device.device_sn === aircraftSn && device.bound_status)) {
          setBind(true)
        }
      }
    }
  }

  useEffect(() => {
    const vConsole = new VConsole();
    verify()

    return () => {
      vConsole.destroy()
    }
  }, [])

  useEffect(() => {
    setup()
  }, [licenseVerified])

  useEffect(() => {
    window.connectCallback = arg => {
      connectCallback(arg)
    }
    window.wsConnectCallback = arg => {
      wsConnectCallback(arg)
    }

    const gatewaySn = apiPilot.getRemoteControllerSN()
    if (gatewaySn === EStatusValue.DISCONNECT.toString()) {
      console.warn('Data is not available, please restart the remote control.')
      return
    }

    getDeviceInfo()

    const isLoaded = apiPilot.isComponentLoaded(EComponentName.Thing)
    // if (isLoaded) {
    //   apiPilot.setPlatformMessage(
    //     '' + localStorage.getItem(ELocalStorageKey.PlatformName),
    //     localStorage.getItem(ELocalStorageKey.WorkspaceName),
    //     '' + localStorage.getItem(ELocalStorageKey.WorkspaceDesc)
    //   )
    //   return
    // }

    apiPilot.setWorkspaceId(localStorage.getItem(ELocalStorageKey.WorkspaceId))

    getUserInfo().then(res => {
      localStorage.setItem(ELocalStorageKey.Username, 'pilot')
      // thing
      console.log('getUserInfoRes', res)
      const param = {
        host: res.data.mqtt_addr,
        username: 'admin',//res.data.mqtt_username,
        password: 'public123',//res.data.mqtt_password,
        connectCallback: 'connectCallback'
      }
      components.set(EComponentName.Thing, param)
      apiPilot.loadComponent(EComponentName.Thing, components.get(EComponentName.Thing))
    })
  }, [])

  return (
    <div>
      <Text>License Verified: {licenseVerified.toString()}</Text>
      <Text>Logged In: {loggedIn.toString()}</Text>
      <Text>Bound: {bound.toString()}</Text>
      <Text>API: {isApiLoaded.toString()}</Text>
      <Text>Map: {isMapLoaded.toString()}</Text>
      <Text>WS: {isWsLoaded.toString()}</Text>
      <Text>Thing: {isThingLoaded.toString()}</Text>
      <Text>TSA: {isTsaLoaded.toString()}</Text>
    </div>
  );
}

export default PilotApp;
