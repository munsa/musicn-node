const ACRCloud = require('acr-cloud');

export module ACRCloudService {
  /**
   * Identifies a sample of bytes
   */
  export const identify = async (buffer): Promise<any> => {
    let acr = new ACRCloud({
      // required
      access_key: '9889cb9595b637e46131c4c09a614f8c',
      access_secret: 'VARSwscc7gmCzud968yhijjceONgBU5VyCV2GPit',
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