import './App.css';
import { useEffect, useState } from 'react';
import { ELocalStorageKey, EUserType } from './api/enums';
import { getBindingDevices, login } from './api/manage';
import { Button, Flex, Container } from '@chakra-ui/react';
import DeviceCard from './components/project/device_card';

function App() {

  const [devices, setDevices] = useState([])
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    const attemptLogin = async () => {
      const response = await login("adminPC", "adminPC", EUserType.Web)
      if (response.code === 0) {
        localStorage.setItem(ELocalStorageKey.Token, response.data.access_token)
        localStorage.setItem(ELocalStorageKey.WorkspaceId, response.data.workspace_id)
        localStorage.setItem(ELocalStorageKey.Username, response.data.username)
        localStorage.setItem(ELocalStorageKey.UserId, response.data.user_id)
        localStorage.setItem(ELocalStorageKey.Flag, EUserType.Web.toString())
        setLoggedIn(true)
      } else {
        console.error(response.message)
      }
    }
    attemptLogin()
  }, [])

  const fetchDevices = async () => {
    const workspaceId = localStorage.getItem(ELocalStorageKey.WorkspaceId)
    if (!workspaceId) return

    const devices = await getBindingDevices(workspaceId, 1, 100, 'sub-device')
    setDevices(devices.data.list)
  }

  useEffect(() => {
    fetchDevices()
  }, [loggedIn])


  return (
    <Flex width="100%" height={'100vh'} >
      <Flex flexDir={"column"} width="300px" height={'100%'} p={2}>
        <Button onClick={() => fetchDevices()} >Refresh</Button>
        {devices.map(device => {
          console.log(device)
          return <DeviceCard device={device} key={device.device_sn} />
        })}
      </Flex>
      <Flex style={{borderLeftWidth: '1px', borderLeftColor: "componentBorderColor", borderLeftStyle: "solid"}}>
        
      </Flex>
    </Flex>
  );
}

export default App;
