const cachedConnections = {};


export function process(source) {
  return new Promise((resolve, reject) => {
    const connection = getConnection(source);
    const listParams = {
      Bucket: source.properties.bucket,
    };

    connection.listObjects(listParams, (error, data) => {
      if (error) reject(error);
      console.log(data);
      resolve();
    });
  });
}


/// Private
///
function getConnection(source) {
  const cached = cachedConnections[source.properties.access_key];

  if (cached) return cached;
  return makeConnection(source);
}


function makeConnection(source) {
  const conf = new AWS.Config({
    accessKeyId: source.properties.access_key,
    secretAccessKey: source.properties.secret_key,
  });

  // new
  const connection = new AWS.S3(conf);

  // cache
  cachedConnections[source.properties.access_key] = connection;

  // return
  return connection;
}
