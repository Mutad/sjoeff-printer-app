import fs from 'fs'
import path from 'path'
import printer from 'pdf-to-printer'
import fetch from 'node-fetch'
import store from '../renderer/store'
import {app} from 'electron'

function print(request, response) {
  function onSuccess() {
    response.send({ status: 'completed' })
  }

  function onError(error) {
    console.log({ status: 'error', error: error })
    response.send({ status: 'error', error: error.toString() })
  }

  console.log('printer: ' + request.query.printer)
  fetch(request.query.url)
    .then((res) => res.buffer())
    .then((buffer) => {
      const pdf = save(buffer)
      console.log(pdf)

      console.log('printing from url: ' + request.query.url)
      printer
        .print(pdf, { printer: request.query.printer })
        .then(onSuccess)
        .catch(onError)
        .then(() => {
          console.log('completed!')
          store.dispatch('addTask', {
            url: request.query.url,
            printer: request.query.printer
          })
          remove(pdf)
        })
    })
    .catch(onError)
}

function save(buffer) {
  // saving pdf to temp directory
  const pdfPath = path.join(app.getPath('temp'), randomString() + '.pdf')
  fs.writeFileSync(pdfPath, buffer, 'binary')
  return pdfPath
}

function remove(pdf) {
  fs.unlinkSync(pdf)
}

function randomString() {
  return Math.random()
    .toString(36)
    .substring(7)
}

export default print
