import asus from 'amazon-s3-url-signer';
import aws4 from 'aws4';
import fetch from 'isomorphic-fetch';
import he from 'he';
import last from 'lodash/array/last';
import querystring from 'querystring-browser';
import xmlParser from 'xml-parser';


/// Public
///
/// ! DO NOT USE THESE DIRECTLY
//  ! USE THE COMMON INTERFACE INSTEAD (./index.js)
///
export function getTree(source, pathRegex) {
  const filterFunc = (key) => {
    return !!key.match(pathRegex);
  };

  const args = {
    source,
    filterFunc,
    collection: [],
    idx: 0,
  };

  return getBucketRegion(source).then(
    (region) => list({ ...args, region })
  ).then(
    (results) => results.collection
  );
}


export function getSignedUrl(source, path, method, expiresInMinutes) {
  const bucket = asus.urlSigner(
    source.properties.accessKey,
    source.properties.secretKey,
    { useSubdomain: true }
  );

  return bucket.getUrl(method, path, source.properties.bucket, expiresInMinutes);
}


/// Private
///
function getBucketRegion(source) {
  const defaultRegion = 'us-east-1';
  const signature = makeSignature(source, defaultRegion, { location: '1' });
  const url = `//${signature.hostname}${signature.path}`;

  return fetch(url, signature).then(
    (response) => response.text()
  ).then(
    (xmlText) => {
      const obj = xmlParser(xmlText);
      const regionObj = obj.root.children.filter((c) => c.name === 'Region')[0];
      const region = regionObj ? regionObj.content : defaultRegion;

      return region;
    }
  );
}


function makeSignature(source, region, queryAttributes = {}) {
  return aws4.sign({
    hostname: `${source.properties.bucket}.s3.amazonaws.com`,
    path: `?${querystring.stringify(queryAttributes)}`,
    region: region,
    service: 's3',
    signQuery: true,
  }, {
    accessKeyId: source.properties.accessKey,
    secretAccessKey: source.properties.secretKey,
  });
}


function makeListRequest(args) {
  const signature = makeSignature(args.source, args.region, {
    'marker': args.marker,
    'max-keys': '1000',
    'X-Amz-Expires': '60',
  });

  const url =
    `//${signature.hostname}${signature.path}`;

  return fetch(url, signature).then(
    (response) => response.text()
  ).then(
    (xmlText) => {
      const obj = xmlParser(xmlText);
      const results = { isTruncated: false, keys: [] };

      obj.root.children.forEach(function loop(child) {
        switch (child.name) {
        case 'IsTruncated':
          results.isTruncated = (child.content === 'true');
          break;
        case 'Contents':
          for (let i = 0, j = child.children.length; i < j; i++) {
            if (child.children[i].name === 'Key') {
              results.keys.push(he.decode(child.children[i].content));
            }
          }
          break;
        }
      });

      return results;
    }
  );
}


function list(args) {
  return makeListRequest(args).then(
    (results) => {
      const newArgs = Object.assign({}, args, {
        collection: args.collection.concat(
          results.keys.filter(args.filterFunc)
        ),
      });

      if (results.isTruncated) {
        newArgs.marker = last(results.keys);
        newArgs.idx = newArgs.idx + 1;

        // infinite loop protection
        if (newArgs.idx > 10000) {
          return newArgs;
        }

        return list(newArgs);
      }

      return newArgs;
    }
  );
}
