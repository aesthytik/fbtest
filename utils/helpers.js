/* eslint-disable import/prefer-default-export */
import AWS from 'aws-sdk';
import aws4 from 'react-native-aws4';
// import '../shim.js';
// import crypto from 'crypto';

const crypto = require('../crypto');
import fetch from 'isomorphic-fetch';
import url from 'url';

const poolId = 'us-east-1:c8290d25-a498-49cf-a5a7-b08100615c9b';

const sign_in = async (provider_id, external_token) => {
  return new Promise((resolve, reject) => {
    const aws_cognito_config = {};
    aws_cognito_config.IdentityPoolId = poolId;
    aws_cognito_config.Logins = {};
    aws_cognito_config.Logins[`graph.facebook.com`] = external_token;

    AWS.config.update({
      region: 'us-east-1',
      credentials: new AWS.CognitoIdentityCredentials(aws_cognito_config),
    });

    console.log('AWS.config.credentials', AWS.config.credentials);

    const s3 = new AWS.S3();
    s3.listObjects(
      {
        Bucket: 'dev1.content.kravein.com.au',
      },
      (err, data) => {
        if (err) reject(err);
        console.log('testing response data', data);
        resolve(AWS.config.credentials);
      },
    );
  });
};

const hash = (string, encoding) =>
  crypto
    .createHash('sha256')
    .update(string, 'utf8')
    .digest(encoding);

const apolloAuthRequest = async (fetchParams, tokens) => {
  const {uri, options} = fetchParams;
  const {data} = options;
  const urlParse = url.parse;
  const urlObject = urlParse(uri);
  const opts = {
    host: urlObject.host,
    path: urlObject.path,
    method: 'POST',
    service: 'appsync',
    region: 'us-east-1',
    headers: {},
    fetchPolicy: 'network-only',
  };
  if (data) {
    opts.data = data;
    opts.body = JSON.stringify(data);
    opts.headers['Content-Type'] = 'application/json';
  }
  opts.headers['X-Amz-Content-Sha256'] = hash(
    JSON.stringify(data) || '',
    'hex',
  );
  const signedRequest = aws4.sign(opts, {
    accessKeyId: tokens.accessKeyId,
    secretAccessKey: tokens.secretAccessKey,
    sessionToken: tokens.sessionToken,
  });

  opts.headers = signedRequest.headers;

  const fetchProfile = await fetch(uri, opts);
  const responseBody = await fetchProfile.json();

  return responseBody;
};

const sampleQuery = ` query {
        test_secured_dummy_response {
            status
            message
        }
    }
`;

export const fetchAPI = async accessToken => {
  const tokens = await sign_in('graph.facebook.com', accessToken);
  //   console.log(
  //     'token',
  //     tokens.accessKeyId,
  //     tokens.secretAccessKey,
  //     tokens.sessionToken,
  //   );
  const response = await apolloAuthRequest(
    {
      uri:
        'https://zmhowbobjvfnpbutlbp2ca5f2y.appsync-api.us-east-1.amazonaws.com/graphql',
      options: {
        data: {
          query: sampleQuery,
          variables: {},
        },
      },
    },
    tokens,
  );
  const {
    data: {test_secured_dummy_response},
  } = response;
  return test_secured_dummy_response;
};
