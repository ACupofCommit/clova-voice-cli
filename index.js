// 네이버 음성합성 Open API 예제
const fs = require('fs')

const express = require('express')
const request = require('request')
const app = express()

var client_id = process.env.CLIENT_ID
var client_secret = process.env.CLIENT_SECRET
const text = "설정 확면에서 멈춰!"

app.get('/tts', function(req, res) {
  const api_url = 'https://naveropenapi.apigw.ntruss.com/tts-premium/v1/tts'
  const options = {
    url: api_url,
    form: { speaker: 'vara', volume: '0', speed: '0', pitch: '0', text, format: 'mp3' },
    headers: { 'X-NCP-APIGW-API-KEY-ID': client_id, 'X-NCP-APIGW-API-KEY': client_secret },
  }

  const now = new Date()
  const writeStream = fs.createWriteStream('./tts1.mp3')

  const result = request.post(options).on('response', function(response) {
    console.log(response.statusCode) // 200
    console.log(response.headers['content-type'])
  })
  result.pipe(writeStream) // file로 출력
  result.pipe(res) // 브라우저로 출력
})

app.listen(3002, function() {
  console.log('http://127.0.0.1:3000/tts app listening on port 3000!')
})
