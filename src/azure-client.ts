import { AuthorizationCodeRequest, AuthorizationUrlRequest, ConfidentialClientApplication, Configuration, LogLevel } from '@azure/msal-node'
import { Request, Response, NextFunction } from 'express'
import axios from 'axios';
import { User } from '../types/User';

export const allowedUsers : Set<string> = new Set()

// Viktoria Hafner
allowedUsers.add('7c4f6cda-48d7-4d1f-b2f2-c8552c85943c')
// Dominik Schatilow
allowedUsers.add('f34a1bb6-311e-4308-a9db-f722d4081fc0')
// Til Schwarze
allowedUsers.add('3f3add76-edaa-4d42-ad27-feb6f1dd8333')
// Maximilian Bala
allowedUsers.add('17026709-4621-4e75-834e-c9f2ddb1bc97')
// Fabian Mergner
allowedUsers.add('700775bd-d5e5-4729-91a4-3481fd1d6ba9')
// Mohammed AbuJarour
allowedUsers.add('cbb6d981-ed2f-4b92-a298-3bd205e29a0a')

export const users : Map<string, User> = new Map()
export const userTokenMap : Map<string, string> = new Map()

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

    if (!allowedUsers.has(result.idTokenClaims['oid'])) {
      return res.status(403).redirect('/')
    }

    res.cookie('AuthToken', result.accessToken);

    let user : User

    if (!users.has(result.idTokenClaims['oid'])) {
      const response = await axios.get(`https://graph.microsoft.com/oidc/userinfo`, {
        headers: {
          'Authorization': `Bearer ${result.accessToken}`
        }
      })

      user = {
        email: response.data.email,
        sub: result.idTokenClaims['sub'],
        oid: result.idTokenClaims['oid'],
        given_name: response.data.given_name,
        family_name: response.data.family_name,
      }

      users.set(user.oid, user)
    } else {
      user = users.get(result.idTokenClaims['oid'])
    }

    userTokenMap.set(result.accessToken, user.oid)

    res.redirect('/internal')
  } catch (error) {
    console.log(JSON.stringify(error))
    res.status(500).redirect('/')
  }
}

export function isAuthenticated (req : Request, res : Response, next : NextFunction) {
  const { AuthToken } = req.cookies

  if (AuthToken !== undefined && userTokenMap.has(AuthToken)) {
    const sub = userTokenMap.get(AuthToken)

    if (users.has(sub)) {
      req.user = {...users.get(sub), AuthToken}
      return next()
    }

    userTokenMap.delete(AuthToken)
    res.cookie('AuthToken', undefined)
    res.status(401).redirect('/')
  } else {
    res.status(401).redirect('/login')
  }
}