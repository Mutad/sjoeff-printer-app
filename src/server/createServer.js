'use strict'
import cors from 'cors'
import express from 'express'
import printers from './printers'
import print from './print'

let app = express()
export let server
const port = 1337

export function createServer() {
  console.log('creating server')

  app.use(cors())
  app.use(express.json())

  // server.get('/printers',)
  app.get('/status', (req, res) => {
    res.send({ version: process.env.npm_package_version })
  })
  app.get('/printers', printers)
  app.post('/print', print)

  app.use(function(req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*')

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST')

    // Request headers you wish to allow
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-Requested-With,content-type,Authorization'
    )

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    // res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next()
  })

  server = app.listen(
    port,
    console.log('server started at http://localhost:' + port)
  )
}

export function stopServer() {
  if (server !== null) {
    server.close()
    console.log('server is stoped')
  }
}
