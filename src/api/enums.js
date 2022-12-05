const EVideoPublishType = {
  VideoOnDemand: 'video-on-demand',
  VideoByManual: 'video-by-manual',
  VideoDemandAuxManual: 'video-demand-aux-manual'
}

const ELocalStorageKey = {
  Username: 'username',
  WorkspaceId: 'workspace_id',
  Token: 'x-auth-token',
  PlatformName: 'platform_name',
  WorkspaceName: 'workspace_name',
  WorkspaceDesc: 'workspace_desc',
  Flag: 'flag',
  UserId: 'user_id',
  Device: 'device',
  GatewayOnline: 'gateway_online',
}

const EUserType = {
  Web: 1,
  Pilot: 2,
}

const EStatusValue = {
  CONNECTED: 'Connected',
  DISCONNECT: 'Disconnect',
  LIVING: 'Living'
}

const ELiveStatusValue = {
  DISCONNECT: "DISCONNECT",
  CONNECTED: "CONNECTED",
  LIVING: "LIVING"
}

const DOMAIN = {
  DRONE: '0', // 飞行器
  PAYLOAD:  '1', // 负载
  RC: '2', // 遥控
  DOCK: '3', // 机场
}

const EComponentName = {
  Thing: 'thing',
  Liveshare: 'liveshare',
  Api: 'api',
  Ws: 'ws',
  Map: 'map',
  Tsa: 'tsa',
  Media: 'media',
  Mission: 'mission'
}

const EPhotoType = {
  Original: 0,
  Preview: 1,
  Unknown: -1
}

const ERouterName = {
  ELEMENT: 'element',
  PROJECT: 'project',
  HOME: 'home',
  TSA: 'tsa',
  LAYER: 'layer',
  MEDIA: 'media',
  WAYLINE: 'wayline',
  LIVESTREAM: 'livestream',
  LIVING: 'living',
  WORKSPACE: 'workspace',
  MEMBERS: 'members',
  DEVICES: 'devices',
  TASK: 'task',
  CREATE_PLAN: 'create-plan',
  SELECT_PLAN: 'select-plan',

  PILOT: 'pilot-login',
  PILOT_HOME: 'pilot-home',
  PILOT_MEDIA: 'pilot-media',
  PILOT_LIVESHARE: 'pilot-liveshare',
  PILOT_BIND: 'pilot-bind'
}

export {
  EComponentName,
  EPhotoType,
  EVideoPublishType,
  ERouterName,
  ELocalStorageKey,
  EUserType,
  EStatusValue,
  ELiveStatusValue,
  DOMAIN
}