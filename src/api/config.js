const CURRENT_CONFIG = {
  // Office - 10.5.3.82
  // license
  appId: '116285', // You need to go to the development website to apply.
  appKey: 'ec7677a595061e5f12c363d67d6e06c', // You need to go to the development website to apply.
  appLicense: 'OUDHXiTprnOlksxwDmSmAbdjEfAeLiJ2EJj6dgodkwY97RZfO0tUo7Iu3Izz+z66x7XL441Dz7f5qXXAmOMohwPXacHTwY+qTxP2hlOwdt7iUdjm3v4QoFoUebYH56cCxVZer6DI7JMWhbU07/rnY5IIcx6s3A1Pur9uCokUOx8=', // You need to go to the development website to apply.

  // http
  baseURL: 'http://10.5.3.82:6789/', // This url must end with "/". Example: 'http://192.168.1.1:6789/'
  websocketURL: 'ws://10.5.3.82:6789/api/v1/ws',  // Example: 'ws://192.168.1.1:6789/api/v1/ws'

  // livestreaming
  // RTMP  Note: This IP is the address of the streaming server. If you want to see livestream on web page, you need to convert the RTMP stream to WebRTC stream.
  rtmpURL: 'rtmp://10.5.3.82/live/',  // Example: 'rtmp://192.168.1.1/live/' 
  // GB28181 Note:If you don't know what these parameters mean, you can go to Pilot2 and select the GB28181 page in the cloud platform. Where the parameters same as these parameters.

}

const HTTP_PREFIX = 'http://10.5.3.82:6789/manage/api/v1'

export {
  HTTP_PREFIX,
  CURRENT_CONFIG
}