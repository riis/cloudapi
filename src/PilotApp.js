import './App.css';
import { useEffect, useState } from 'react';
import { createBinding, checkToken, verifyLicense, apiPilot, messageHandler, connectCallback, wsConnectCallback } from './api/pilot';
import VConsole from 'vconsole';
import { DOMAIN, EComponentName, ELocalStorageKey } from './api/enums';
import { getBindingDevices, getPlatformInfo } from './api/manage';
import { Text } from '@chakra-ui/react'
import { useWebsocket } from './hooks/use-websocket';


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

    window.connectCallback = arg => {
      connectCallback(arg)
    }
    window.wsConnectCallback = arg => {
      wsConnectCallback(arg)
    }

    verify()

    return () => {
      vConsole.destroy()
    }
  }, [])

  useEffect(() => {
    setup()
  }, [licenseVerified])

  return (
    <div>
      <Text>License Verified: {licenseVerified.toString()}</Text>
      <Text>Logged In: {loggedIn.toString()}</Text>
      <Text>Bound: {bound.toString()}</Text>
    </div>
  );
}

export default PilotApp;
