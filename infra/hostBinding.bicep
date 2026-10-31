param appName string
param hostName string
param sslEnabled bool
param thumbprint string

resource app 'Microsoft.Web/sites@2023-12-01' existing = {
  name: appName
}

resource binding 'Microsoft.Web/sites/hostNameBindings@2023-12-01' = {
  parent: app
  name: hostName
  properties: {
    hostNameType: 'Verified'
    sslState: sslEnabled ? 'SniEnabled' : 'Disabled'
    thumbprint: sslEnabled ? thumbprint : null
  }
}
