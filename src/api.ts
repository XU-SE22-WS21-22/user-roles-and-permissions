import { Router } from "express";
import { Request, Response, NextFunction } from 'express'
import uuidAPIKey from 'uuid-apikey';

import { users } from './azure-client'

export const api = Router()

function checkKey (req : Request, res : Response, next : NextFunction) {
  const key = req.query.apiKey as string | undefined

  if (!key || !uuidAPIKey.isAPIKey(key)) {
    return res.status(401).send('API-Key is missing or invalid')
  }

  const uuid = uuidAPIKey.toUUID(key)

  if (uuidAPIKey.check(key, uuid)) {
    next()
  } else {
    res.status(401).send('API-Key is not Authorized')
  }
}

api.use(checkKey)

api.get('/', (req, res) => {
  res.send('api works')
})

api.get('/user', (req, res) => {
  res.send([...users.values()])
})

api.get('/user/:oid', (req, res) => {
  console.log(req.params.oid)
  const user = [...users.values()].find(user => 
    user.idTokenClaims['oid'] === req.params.oid
  )

  if (!user) {
    res.status(404).send('User not found')
  } else {
    res.status(200).send(user)
  }
})