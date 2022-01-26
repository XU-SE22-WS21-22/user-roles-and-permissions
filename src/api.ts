import { Router } from "express";
import { Request, Response, NextFunction } from 'express'
import uuidAPIKey from 'uuid-apikey';

import { allowedUsers, users } from './azure-client'

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
    res.status(403).send('API-Key is not Authorized')
  }
}

api.use(checkKey)

api.get('/', (req, res) => {
  res.send('api works')
})

api.get('/user', (req, res) => {
  res.send([...users.values()])
})

api.post('/user/:oid', (req, res) => {
  if (!allowedUsers.has(req.params.oid)) {
    allowedUsers.add(req.params.oid)
    res.status(200).send('User added')
  } else {
    res.status(409).send('User already exists')
  }
})

api.delete('/user/:oid', (req, res) => {
  if (!allowedUsers.has(req.params.oid)) {
    res.status(404).send('User does not exists')
  } else {
    allowedUsers.delete(req.params.oid)
    users.delete(req.params.oid)
    res.status(204).send('User deleted')
  }
})

api.get('/user/:oid', (req, res) => {
  const user = [...users.values()].find(user => 
    user.oid === req.params.oid
  )

  if (!user) {
    res.status(404).send('User not found')
  } else {
    res.status(200).send(user)
  }
})