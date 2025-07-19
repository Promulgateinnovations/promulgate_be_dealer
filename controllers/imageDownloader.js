var fs = require('fs'),
  request = require('request');
const path = require("path")
const axios = require("axios")
const configs = require("../config/config.json")
const readJson = require("r-json");
const CREDENTIALS = readJson(path.join(__dirname, '../', '/credentials.json'));
const {google} = require('googleapis')
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId:"AKIA2FYXQIIBHJ5NUTFD",
    secretAccessKey:"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"
});

 const Youtube = require("youtube-api");
const { response } = require('../app');
const { resolve } = require('path');
let oauth = Youtube.authenticate({
    type: "oauth"
    , client_id: CREDENTIALS.web.client_id
    , client_secret: CREDENTIALS.web.client_secret
    , redirect_url: CREDENTIALS.web.redirect_uris[0]
});

// const { LocalFileData, constructFileFromLocalFileData } = require("get-file-object-from-local-path")

exports.downloader = (url, image_path) =>
  
  axios({
    url,
    responseType: 'stream',
  }).then(
   
    response =>
      new Promise((resolve, reject) => {
        let fileExtension = response.headers['content-type'].split("/")[1]
        console.log("fileExtension", fileExtension)
        // fileExtension="jpg"
        response.data
          .pipe(fs.createWriteStream(`${image_path}.${fileExtension}`))
          .on('finish', () => resolve({ fileExtension }))
          .on('error', (e) => {
            console.log(e.message) 
            reject({ fileExtension: null });
          })
      }),
  );

// const url = "https://picsum.photos/200/300"
// const url2 = "https://promulgatebucket.s3.ap-south-1.amazonaws.com/samvaada.mp4"
// this.download_image(url2, imagePath).then((res) => {
//   console.log(res)
// }).catch((err) => {
//   console.log(err)
// })

exports.downloader = (url, image_path) =>
  axios({
    url,
    responseType: 'stream',
  }).then(
    response =>
      new Promise((resolve, reject) => {
        // 💬 Log the incoming URL and path
        console.log('[Downloader] 🔗 Downloading from URL:', url);
        console.log('[Downloader] 📁 Will save to:', image_path);

        let fileExtension = response.headers['content-type'].split("/")[1];
        console.log('[Downloader] 🧩 Detected file extension:', fileExtension);

        response.data
          .pipe(fs.createWriteStream(`${image_path}.${fileExtension}`))
          .on('finish', () => {
            console.log('[Downloader] ✅ File written successfully to', `${image_path}.${fileExtension}`);
            resolve({ fileExtension });
          })
          .on('error', (e) => {
            console.error('[Downloader] ❌ Stream error:', e.message);
            reject({ fileExtension: null });
          });
      })
  );
// this.downloaderss().then((res) => {
//   console.log(res)
// }).catch((err) => {
//   console.log(err)
// })

exports.googleDownload = (accessToken, url) =>{

  return new Promise((resolve , reject) => {
    oauth.setCredentials(accessToken)

    const drive = google.drive({
        version: 'v3',
        auth: oauth
  })
  
    async function generatePublicUrl() {
        try {
            const fileId =url.match(/[-\w]{25,}(?!.*[-\w]{25,})/)
  
            await drive.permissions.create({
              fileId: fileId[0],
                requestBody: {
                    role: 'reader',
                    type: 'anyone'
                }
            })
          
            const result = await drive.files.get({
                fileId,
            fields: 'webViewLink, webContentLink'
            })
            resolve(result.data)
        }catch(err) {
            console.log(err.message);
        }
    }
  
    generatePublicUrl()
 
  })
 
}

exports.uploadS3File =(path, filename) => {
  console.log("filename", filename)
  console.log("path", path)
  return new Promise((resolve)=> {
    fs.readFile(path, (err, data) => {
      console.log(data)
      if (err) throw err;
      const params = {
          Bucket: 'instagram-pictures', // pass your bucket name
          Key: filename, // file will be saved as testBucket/contacts.csv
          Body:data,
          ACL: 'public-read'
      };
      s3.upload(params, function(s3Err, data) {
        console.log(s3Err)
          if (s3Err) throw s3Err
          console.log(`File uploaded successfully at ${data.Location}`)
          resolve(data.Location)
      });
   });
  })
 
}

