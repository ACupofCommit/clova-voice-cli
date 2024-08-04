
// 네이버 음성합성 Open API 예제
const fs = require('fs')
const axios = require('axios')

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const API_URL = 'https://naveropenapi.apigw.ntruss.com/tts-premium/v1/tts'

const run = async (text) => {
  const now = new Date()
  const summaryInFileName = text.slice(0,10)
    .replace(/ /g, '-')
    // 파일이름으로 쓸 수 없는 특수문자 제거
    .replace(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, '')
  const fileName = `${now.toISOString().replace(/:/g, '-')}-${summaryInFileName}.mp3`

  const params = {
    speaker: 'nara',
    volume: '0',
    speed: '0',
    pitch: '0',
    text,
    format: 'mp3',
  }

  try {
    const response = await axios.post(API_URL, params, {
      responseType: 'stream',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-NCP-APIGW-API-KEY-ID': CLIENT_ID,
        'X-NCP-APIGW-API-KEY': CLIENT_SECRET,
      },
    })
    const writeStream = fs.createWriteStream(fileName)
    response.data.pipe(writeStream)
    return fileName

  } catch (err) {
    err.response.data.destroy()
    console.error(err)
    throw err
  }
}

if (require.main === module) {
  const text = process.argv[2]?.trim()
  if (!text) {
    console.error('text is required')
    process.exit(1)
  }

  console.log('=============================================')
  console.log(text)
  console.log('=============================================')

  run(text)
    .then((fileName) => console.log(`${fileName} is created`))
    .catch(err => {
      console.error(err)
      console.error(err.message)
    })
}
