const ACRCloud = require('acr-cloud');
const dotenv = require('dotenv');
dotenv.config();

export module ACRCloudService {
  /**
   * Identifies a sample of bytes
   */
  export const identify = async (buffer): Promise<any> => {
    let acr = new ACRCloud({
      // required
      access_key: process.env.ACR_CLOUD_ACCESS_KEY,
      access_secret: process.env.ACR_CLOUD_ACCESS_SECRET,
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