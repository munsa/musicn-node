import fs = require('fs');
import crypto = require('crypto');
import request = require('request');
import path = require('path');

var defaultOptions = {
  host: 'identify-eu-west-1.acrcloud.com',
  endpoint: '/v1/identify',
  signature_version: '1',
  data_type: 'audio',
  secure: true,
  access_key: '9889cb9595b637e46131c4c09a614f8c',
  access_secret: 'VARSwscc7gmCzud968yhijjceONgBU5VyCV2GPit'
};

function buildStringToSign(
  method,
  uri,
  accessKey,
  dataType,
  signatureVersion,
  timestamp
) {
  return [method, uri, accessKey, dataType, signatureVersion, timestamp].join(
    '\n'
  );
}

function sign(signString, accessSecret) {
  return crypto
    .createHmac('sha1', accessSecret)
    .update(new Buffer(signString, 'utf-8'))
    .digest()
    .toString('base64');
}

/**
 * Identifies a sample of bytes
 */
function identify(data, options, cb) {
  var current_data = new Date();
  var timestamp = current_data.getTime() / 1000;

  var stringToSign = buildStringToSign(
    'POST',
    options.endpoint,
    options.access_key,
    options.data_type,
    options.signature_version,
    timestamp
  );

  var signature = sign(stringToSign, options.access_secret);

  var formData = {
    sample: data,
    access_key: options.access_key,
    data_type: options.data_type,
    signature_version: options.signature_version,
    signature: signature,
    sample_bytes: data.length,
    timestamp: timestamp
  };
  request.post(
    {
      url: 'http://' + options.host + options.endpoint,
      method: 'POST',
      formData: formData
    },
    cb
  );
}

/*var filename = './sample.wav';
var bitmap = fs.readFileSync(path.resolve(__dirname, filename));*/

export const identifyAudio = bitmap => {
  identify(new Buffer(bitmap), defaultOptions, function(
    err,
    httpResponse,
    body
  ) {
    if (err) console.log(err);
    console.log(body);
  });
};
