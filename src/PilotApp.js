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

  console.log("isLoggedIn", loggedIn)

  useWebsocket(messageHandler)

  const verify = async () => {
    const isVerified = await verifyLicense()
    setLicenseVerfied(isVerified)
  }

  console.log("api", apiPilot.isComponentLoaded(EComponentName.Api))
  console.log("map", apiPilot.isComponentLoaded(EComponentName.Map))
  console.log("ws", apiPilot.isComponentLoaded(EComponentName.Ws))
  console.log("thing", apiPilot.isComponentLoaded(EComponentName.Thing))
  console.log("tsa", apiPilot.isComponentLoaded(EComponentName.Tsa))


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
    if (isLoaded) {
      apiPilot.setPlatformMessage(
        '' + localStorage.getItem(ELocalStorageKey.PlatformName),
        localStorage.getItem(ELocalStorageKey.WorkspaceName),
        '' + localStorage.getItem(ELocalStorageKey.WorkspaceDesc)
      )
      return
    }

    apiPilot.setWorkspaceId(localStorage.getItem(ELocalStorageKey.WorkspaceId))

    getUserInfo().then(res => {
      localStorage.setItem(ELocalStorageKey.Username, 'pilot')
      // thing
      const param = {
        host: res.data.mqtt_addr,
        username: res.data.mqtt_username,
        password: res.data.mqtt_password,
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
    </div>
  );
}

export default PilotApp;
