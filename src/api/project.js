import { HTTP_PREFIX } from "./config"

const defaultHeaders = () => {
  return {
    "x-auth-token": localStorage.getItem('x-auth-token'),
    "Content-Type": "application/json"
  }
}

export const getUnreadDeviceHms = async function (workspace_id, device_sn) {
  const url = `${HTTP_PREFIX}/devices/${workspace_id}/devices/hms/${device_sn}`
  const result = await fetch(url, {headers: defaultHeaders()})
  return await result.json()
}

export const getDeviceHms = async function (body, workspace_id, pagination) {
  let url = `${HTTP_PREFIX}/devices/${workspace_id}/devices/hms?page=${pagination.page}&page_size=${pagination.page_size}` + 
    `&level=${body.level ?? ''}&begin_time=${body.begin_time ?? ''}&end_time=${body.end_time ?? ''}&message=${body.message ?? ''}&language=${body.language}`
  body.sns.forEach((sn) => {
    if (sn !== '') {
      url = url.concat(`&device_sn=${sn}`)
    }
  })
  const result = await fetch(url, {headers: defaultHeaders()})
  return await result.json()
}