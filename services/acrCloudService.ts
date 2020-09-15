const ACRCloud = require('acr-cloud');
const ACRCloudConfig = require('../config/external_apis/acrCloud.json');

export module ACRCloudService {
  /**
   * Identifies a sample of bytes
   */
  export const identify = async (buffer): Promise<any> => {
    let acr = new ACRCloud({
      // required
      access_key: ACRCloudConfig.access_key,
      access_secret: ACRCloudConfig.access_secret,
      // optional
      requrl: 'identify-eu-west-1.acrcloud.com',
      http_method: 'POST',
      http_uri: '/v1/identify',
      data_type: 'audio',
      signature_version: '2',
      timestamp: Date.now()
    });

    acr.createSignature();

    return await acr.identify(buffer);
  }
}