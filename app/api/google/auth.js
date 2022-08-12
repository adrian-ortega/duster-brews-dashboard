const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const { parseJson, isFunction } = require('../../util/helpers');
const path = require('path');

let GoogleAuth;

const STORAGE_PATH = path.join(__dirname, '../../../storage');
const TOKEN_PATH = 'token.json';
const CLIENT_CREDENTIALS_PATH = 'credentials.json'

// If modifying these scopes, delete token.json.
const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets.readonly'
];

/**
 *
 * @param {google.auth.OAuth2} oAuth2Client
 * @param {function|*} callback
 * @return {Promise<google.auth.OAuth2>}
 */
const getNewToken = (oAuth2Client, callback) => new Promise((resolve, reject) => {
  const oauthUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });

  console.clear();
  console.log('Authorize this app by visiting this URL:', oauthUrl);

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question('Enter the code from that page here:', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) {
        reject(err)
        return console.error('Error while trying to retrieve access token', err);
      }

      oAuth2Client.setCredentials(token);

      // Store the token
      const tokenFullPath = `${STORAGE_PATH}/${TOKEN_PATH}`
      fs.writeFile(tokenFullPath, JSON.stringify(token), (err) => {
        if (err) {
          reject(err);
          return console.error(err);
        }
        console.log('Token stored to', tokenFullPath);
      });

      if(callback && isFunction(callback)) callback(oAuth2Client);
      resolve(oAuth2Client);
    });
  });
});

/**
 * @param {Object} credentials
 * @param {function|*} callback
 * @return {Promise<google.auth.OAuth2>}
 */
const attemptToAuthorize = (credentials, callback) => new Promise((resolve) => {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  // Check for previously stored Token
  fs.readFile(`${STORAGE_PATH}/${TOKEN_PATH}`, (err, token) => {
    if (err) return getNewToken (oAuth2Client, callback);
    oAuth2Client.setCredentials(parseJson(token));

    if(callback && isFunction(callback)) callback(oAuth2Client);

    resolve(oAuth2Client);
  });
});

module.exports = {
  google,
  authorize: () => new Promise((resolve, reject) => {
    fs.readFile(`${STORAGE_PATH}/${CLIENT_CREDENTIALS_PATH}`, (err, content) => {
      if(err) {
        reject(err)
        return console.log('Error loading client credentials file:', err);
      }

      attemptToAuthorize(parseJson(content)).then((oAuth2Client) => {
        GoogleAuth = oAuth2Client
        resolve(GoogleAuth);
      });
    });
  })
}
