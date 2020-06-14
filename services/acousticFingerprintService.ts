import crypto = require('crypto');
import request = require('request');
import fs = require('fs');
import {promisify} from "util";
const writeFile = promisify(fs.writeFile);
import {v4} from 'uuid';
import path = require('path');

let options = {
  host: 'identify-eu-west-1.acrcloud.com',
  endpoint: '/v1/identify',
  signature_version: '1',
  data_type: 'audio',
  secure: true,
  access_key: '9889cb9595b637e46131c4c09a614f8c',
  access_secret: 'VARSwscc7gmCzud968yhijjceONgBU5VyCV2GPit'
};

function buildStringToSign(method, uri, accessKey, dataType, signatureVersion, timestamp) {
  return [method, uri, accessKey, dataType, signatureVersion, timestamp].join('\n');
}

function sign(signString, accessSecret) {
  return crypto.createHmac('sha1', accessSecret)
      .update(new Buffer(signString, 'utf-8'))
      .digest().toString('base64');
}

/**
 * Identifies a sample of bytes
 */
export function identify(data, cb) {

  let current_data = new Date();
  let timestamp = current_data.getTime()/1000;

  let stringToSign = buildStringToSign('POST',
      options.endpoint,
      options.access_key,
      options.data_type,
      options.signature_version,
      timestamp);

  let signature = sign(stringToSign, options.access_secret);

  let formData = {
    sample: data,
    access_key:options.access_key,
    data_type:options.data_type,
    signature_version:options.signature_version,
    signature:signature,
    sample_bytes:data.length,
    timestamp:timestamp,
  };
  request.post({
    url: "http://"+options.host + options.endpoint,
    method: 'POST',
    formData: formData
  }, cb);
}

// Writes a .wav file from the buffer
// Useful for developing purposes
function writeWavFile(buffer: Buffer) {
  const messageId = v4();
  writeFile('./temp/' + messageId + '.wav', new Buffer(buffer), 'base64').then(() => {
    let filename = './../../temp/' + messageId + '.wav';
    let bitmap: Buffer = fs.readFileSync(path.resolve(__dirname, filename));
    //identify(bitmap);
  }).catch(err => {
    console.log('Error writing message to file', err);
  });
}