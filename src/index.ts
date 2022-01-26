import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import { getToken, isAuthenticated, login, users } from "./azure-client";
import session from 'express-session';
import cookieParser from 'cookie-parser';
import {api} from './api';
import uuidAPIKey from 'uuid-apikey';
import { AuthenticationResult } from '@azure/msal-node'

declare global{
  namespace Express {
      interface Request {
        user?: AuthenticationResult
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

app.get("/login", login);

app.get("/redirect", getToken);

app.use('/api', api);

app.use(isAuthenticated)

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "index.html"));
});

app.get("/getKey", (req, res) => {
  const key = uuidAPIKey.create()
  res.send(key.apiKey)
});

app.get("/logout", (req, res) => {
  users.delete(req.user.accessToken)
  res.cookie('AuthToken', undefined)
  res.status(200).send('Logout')
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});