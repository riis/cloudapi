import { HTTP_PREFIX } from "./config"

const defaultHeaders = () => {
  return {
    "x-auth-token": localStorage.getItem('x-auth-token'),
    "Content-Type": "application/json"
  }
}

const login = async (username, password, flag) => {
  const url = `${HTTP_PREFIX}/login`
  const result = await fetch(url, {
    method: "POST",
    headers: {
      'Content-Type': "application/json"
    },
    body: JSON.stringify({
      username: username,
      password: password,
      flag: flag,
    })
  })

  return await result.json()

}

const refreshToken = async () =>{
  const url = `${HTTP_PREFIX}/token/refresh`
  const result = await fetch(url, {
    method: "POST",
    headers: defaultHeaders()
  })
  return await result.json()
}

/**
 * Bind Device
 * @param {{device_sn: string, user_id: string, workspace_id: string}} body 
 * @returns 
 */
const bindDevice = async function (body) {
  console.log('binding', body.device_sn)
  const url = `${HTTP_PREFIX}/devices/${body.device_sn}/binding`
  const result = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: defaultHeaders()
  })
  return await result.json()
}

// Get Platform Info
const getPlatformInfo = async function (){
  const url = `${HTTP_PREFIX}/workspaces/current`
  const result = await fetch(url, {
    headers: defaultHeaders()
  })
  return await result.json()
}

const getBindingDevices = async function (workspace_id, page, page_size, domain) {
  console.log("gettingBoundDevices", workspace_id)
  const url = `${HTTP_PREFIX}/devices/${workspace_id}/devices/bound?&page=${page}&page_size=${page_size}&domain=${domain}`
  const result = await fetch(url, {
    headers: defaultHeaders()
  })
  return await result.json()
}

const getDeviceBySn = async function (workspace_id, device_sn) {
  const url = `${HTTP_PREFIX}/devices/${workspace_id}/devices/${device_sn}`
  const result = await fetch(url, {
    headers: defaultHeaders()
  })
  return await result.json()
}

const getUserInfo = async function () {
  const url = `${HTTP_PREFIX}/users/current`
  const result = await fetch(url, {headers: defaultHeaders()})
  return await result.json()
}

export {
  login,
  refreshToken,
  bindDevice,
  getBindingDevices,
  getPlatformInfo,
  getUserInfo,
  getDeviceBySn
}