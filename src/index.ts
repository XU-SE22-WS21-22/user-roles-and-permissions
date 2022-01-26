import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { getToken, isAuthenticated, login, users, userTokenMap } from "./azure-client";
import session from 'express-session';
import cookieParser from 'cookie-parser';
import {api} from './api';
import uuidAPIKey from 'uuid-apikey';
import { User } from '../types/User';

declare global{
  namespace Express {
      interface Request {
        user?: User & {
          AuthToken : string
        }
      }
  }
}

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  cookie: { maxAge: 60000 },
  saveUninitialized : false
}))

app.get("/", (req, res) => {
  res.send('Hello World!');
});

app.get("/login", login);

app.get("/redirect", getToken);

app.use('/api', api);

app.use(isAuthenticated)

app.get("/internal", (req, res) => {
  res.send('internal');
});

app.get("/getKey", (req, res) => {
  const key = uuidAPIKey.create()
  res.send(key.apiKey)
});

app.get("/logout", (req, res) => {
  userTokenMap.delete(req.user.AuthToken)
  res.cookie('AuthToken', undefined)
  res.status(204).send('Logout')
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});