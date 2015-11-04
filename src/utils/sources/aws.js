import aws4 from 'aws4';
import fetch from 'isomorphic-fetch';
import he from 'he';
import last from 'lodash/array/last';
import queryString from 'query-string';
import xmlParser from 'xml-parser';


/// Public
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

  return list(args).then(
    (results) => results.collection
  );
}


/// Private
///
function makeSignature(source, queryAttributes) {
  return aws4.sign({
    hostname: `${source.properties.bucket}.s3.amazonaws.com`,
    path: `?` + queryString.stringify(queryAttributes),
    region: 'eu-west-1',
    service: 's3',
    signQuery: true,
  }, {
    accessKeyId: source.properties.access_key,
    secretAccessKey: source.properties.secret_key,
  });
}


function makeListRequest(args) {
  const signature = makeSignature(args.source, {
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
