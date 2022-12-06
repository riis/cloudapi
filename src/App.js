import './App.css';
import { useEffect, useState, useRef } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { EBizCode, ELocalStorageKey, EUserType } from './api/enums';
import { getBindingDevices, getDeviceTopo, login } from './api/manage';
import { Button, Flex, Container, useForceUpdate } from '@chakra-ui/react';
import DeviceCard from './components/project/device_card';
import { useWebsocket } from './hooks/use-websocket';
import { getUnreadDeviceHms } from './api/project';
import { TbDrone } from 'react-icons/tb'
import { Map, Marker } from 'react-map-gl';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN

function App() {
  const [devices, setDevices] = useState([])
  const [loggedIn, setLoggedIn] = useState(false)

  const [zoom, setZoom] = useState(9);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);

  const payload = useWebsocket()

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

    devices.data.list.map(async device => {
      console.log('hms', await getUnreadDeviceHms(workspaceId, device.device_sn))
    })
  }

  useEffect(() => {
    fetchDevices()
  }, [loggedIn])

  const updateMarker = (device) => {
    setLng(payload[device.device_sn].longitude)
    setLat(payload[device.device_sn].latitude)
  }

  return (
    <Flex width="100%" height={'100vh'} >
      <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v2.11.0/mapbox-gl.css' rel='stylesheet' />
      <Flex flexDir={"column"} width="300px" height={'100%'} p={2}>
        <Button onClick={() => fetchDevices()} >Refresh</Button>
        {devices.map(device => {
          return <DeviceCard device={device} key={device.device_sn} onClick={() => updateMarker(device)} />
        })}
      </Flex>
      <Flex style={{ borderLeftWidth: '1px', borderLeftColor: "componentBorderColor", borderLeftStyle: "solid", flexGrow: 1 }}>
        <Map
          mapboxAccessToken='pk.eyJ1IjoianJlZWR5LXJpaXMiLCJhIjoiY2xiYjh0MW04MGg4ejNxcGpvcTdic2E4cyJ9.3O96iR2olwbI6QVF7ZLe5Q'
          initialViewState={{
            longitude: lng,
            latitude: lat,
            zoom: zoom,
          }}
          latitude={lat}
          longitude={lng}
          mapStyle="mapbox://styles/mapbox/light-v11"
        >
          {Object.keys(payload).map(key => {
            const shouldShow = devices.find(device => device.device_sn === key && device.status)
            return shouldShow ? (<Marker latitude={payload[key].latitude} longitude={payload[key].longitude} key={key}>
              <TbDrone size={'50'} color='blue' />
            </Marker>) : null
          })}
        </Map>
      </Flex>
    </Flex>
  );
}

export default App;
