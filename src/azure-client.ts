import { AuthenticationResult, AuthorizationCodeRequest, AuthorizationUrlRequest, ConfidentialClientApplication, Configuration, LogLevel } from '@azure/msal-node'
import { Request, Response, NextFunction } from 'express'
import axios from 'axios';

export const users : Map<string, AuthenticationResult> = new Map()

const config : Configuration = {
  auth: {
      clientId: process.env.CLIENT_ID,
      authority: "https://login.microsoftonline.com/common",
      clientSecret: process.env.CLIENT_SECRET
  },
  system: {
      loggerOptions: {
          loggerCallback(logLevel, message, containsPii) {
              console.log(message);
          },
          piiLoggingEnabled: false,
          logLevel: LogLevel.Verbose,
      }
  }
};

const cca = new ConfidentialClientApplication(config);

const authCodeUrlParameters : AuthorizationUrlRequest = {
  scopes: ["user.read", "profile", "openid"],
  redirectUri: "http://localhost:8080/redirect",
};

export async function login (req : Request, res : Response) {
  try {
    const uri = await cca.getAuthCodeUrl(authCodeUrlParameters)
    res.redirect(uri)
  } catch (error) {
    console.log(JSON.stringify(error))
  }
}

export async function getToken(req : Request, res : Response) {
  try {
    const code = req.query.code as string
    const request : AuthorizationCodeRequest = {...authCodeUrlParameters, code}
    const result = await cca.acquireTokenByCode(request)
    res.cookie('AuthToken', result.accessToken);
    users.set(result.accessToken, result)

    const response = await axios.get(`https://graph.microsoft.com/v1.0//users/${result.account.username}/photo/$value`, {
      headers: {
        'Authorization': `Bearer ${result.accessToken}`
      }
    })
    console.log(response.data)

    res.redirect('/')
  } catch (error) {
    console.log(JSON.stringify(error))
    res.status(500).redirect('/')
  }
}

export function isAuthenticated (req : Request, res : Response, next : NextFunction) {
  const { AuthToken } = req.cookies

  if (AuthToken !== undefined && users.has(AuthToken)) {
    req.user = users.get(AuthToken)
    next()
  } else {
    res.status(401).redirect('/login')
  }
}

