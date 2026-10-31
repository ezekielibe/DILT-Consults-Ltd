targetScope = 'subscription'

@minLength(1)
@maxLength(20)
@description('Environment name used for resource naming (azd env name).')
param environmentName string

@description('Azure region.')
param location string

@description('Custom domain, e.g. www.diltconsults.com. Leave empty to skip binding.')
param customDomain string = ''

@description('App Service plan SKU. Must be B1 or higher for custom domain TLS.')
param skuName string = 'B1'

param notifyTo string = ''
param smtpHost string = 'smtp-mail.outlook.com'
param smtpUser string = ''

@secure()
param smtpPass string = ''

var token = toLower(uniqueString(subscription().id, environmentName, location))

resource rg 'Microsoft.Resources/resourceGroups@2024-03-01' = {
  name: 'rg-${environmentName}'
  location: location
  tags: { 'azd-env-name': environmentName }
}

module web 'resources.bicep' = {
  name: 'web'
  scope: rg
  params: {
    location: location
    token: token
    environmentName: environmentName
    customDomain: customDomain
    skuName: skuName
    notifyTo: notifyTo
    smtpHost: smtpHost
    smtpUser: smtpUser
    smtpPass: smtpPass
  }
}

output AZURE_LOCATION string = location
output WEB_URI string = web.outputs.defaultUrl
output CUSTOM_DOMAIN_VERIFICATION_ID string = web.outputs.verificationId
output DEFAULT_HOSTNAME string = web.outputs.defaultHostName
