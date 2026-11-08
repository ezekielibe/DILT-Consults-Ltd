param location string
param token string
param environmentName string
param customDomain string
param skuName string
param notifyTo string
param smtpHost string
param smtpUser string

@secure()
param smtpPass string

resource plan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: 'plan-${token}'
  location: location
  kind: 'linux'
  sku: { name: skuName }
  properties: { reserved: true }
}

resource app 'Microsoft.Web/sites@2026-08-01' = {
  name: 'dilt-consults-ltd-${token}'
  location: location
  kind: 'app,linux'
  tags: {
    'azd-env-name': environmentName
    'azd-service-name': 'web'
  }
  properties: {
    serverFarmId: plan.id
    httpsOnly: true
    clientAffinityEnabled: false
    siteConfig: {
      linuxFxVersion: 'NODE|24-lts'
      appCommandLine: 'npm start'
      alwaysOn: true
      http20Enabled: true
      minTlsVersion: '1.2'
      ftpsState: 'Disabled'
      healthCheckPath: '/healthz'
      appSettings: [
        { name: 'SCM_DO_BUILD_DURING_DEPLOYMENT', value: 'true' }
        // /home is persistent storage on App Service Linux.
        { name: 'DATA_DIR', value: '/home/data' }
        { name: 'NOTIFY_TO', value: notifyTo }
        { name: 'SMTP_HOST', value: smtpHost }
        { name: 'SMTP_USER', value: smtpUser }
        { name: 'SMTP_PASS', value: smtpPass }
      ]
    }
  }
}

// Step 1: bind hostname without TLS (requires DNS records to exist already).
module bind 'hostBinding.bicep' = if (!empty(customDomain)) {
  name: 'bind-${token}'
  params: {
    appName: app.name
    hostName: customDomain
    sslEnabled: false
    thumbprint: ''
  }
}

// Step 2: free App Service managed certificate for that hostname.
resource cert 'Microsoft.Web/certificates@2023-12-01' = if (!empty(customDomain)) {
  name: 'cert-${token}'
  location: location
  properties: {
    serverFarmId: plan.id
    canonicalName: customDomain
  }
  dependsOn: [ bind ]
}

// Step 3: re-bind the hostname with SNI TLS using the certificate.
module bindTls 'hostBinding.bicep' = if (!empty(customDomain)) {
  name: 'bind-tls-${token}'
  params: {
    appName: app.name
    hostName: customDomain
    sslEnabled: true
    thumbprint: !empty(customDomain) ? cert.properties.thumbprint : ''
  }
}

output defaultHostName string = app.properties.defaultHostName
output defaultUrl string = 'https://${app.properties.defaultHostName}'
output verificationId string = app.properties.customDomainVerificationId
