import last from 'lodash/array/last';


const cachedConnections = {};


/// Public
///
export function getTree(source) {
  const connection = getConnection(source);
  const params = {
    Bucket: source.properties.bucket,
    MaxKeys: 1000,
  };

  const filterFunc = (item) => {
    return !!item.match(/\.(mp3|mp4|m4a)$/);
  };

  return list(connection, params, filterFunc).then(
    (contents) => console.log(contents),
    (error) => console.error(error)
  );
}


/// Private
///
function getConnection(source) {
  const cached = cachedConnections[source.properties.access_key];

  if (cached) return cached;
  return makeConnection(source);
}


function makeConnection(source) {
  const connection = new AWS.S3(
    new AWS.Config({
      accessKeyId: source.properties.access_key,
      secretAccessKey: source.properties.secret_key,
    })
  );

  cachedConnections[source.properties.access_key] = connection;
  return connection;
}


function list(connection, params, filterFunc) {
  return new Promise((resolve, reject) => {
    const collection = [];
    return listInner({ connection, params, collection, filterFunc, resolve, reject });
  });
}


function listInner(args) {
  args.connection.listObjects(args.params, (error, response) => {
    if (error) return args.reject(error);

    const newKeys = response.Contents.map((item) => item.Key).filter(args.filterFunc);
    const newCollection = args.collection.concat(newKeys);

    if (response.IsTruncated) {
      args.params.Marker = last(response.Contents).Key;
      args.collection = newCollection;

      listInner(args);

    } else {
      args.resolve(newCollection);

    }
  });
}
