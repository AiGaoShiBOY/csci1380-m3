const comm = function(config) {
  let context = {};
  context.gid = config.gid || 'all';
  let distribution = global.distribution;
  if (!distribution) {
    throw new Error('Distribution not found');
  }
  return {
    send: function(message, remote, callback) {
      callback = callback || function(e, v) {};
      distribution.local.groups.get(context.gid, (e, v) => {
        const nodeMap = v;
        let errors = {};
        let results = {};
        let ongoingReqs = Object.keys(nodeMap).length;
        for (let [nid, nodeConf] of Object.entries(nodeMap)) {
          let conf = {ip: nodeConf.ip, port: nodeConf.port};
          let remoteWithNode = {
            node: conf,
            service: remote.service,
            method: remote.method,
          };
          distribution.local.comm.send(message, remoteWithNode, (e, v) => {
            if (e) {
              errors[nid] = e;
            }
            if (v) {
              results[nid] = v;
            }
            ongoingReqs -= 1;
            if (ongoingReqs === 0) {
              if (
                remoteWithNode.service === 'status' &&
                remoteWithNode.method === 'get'
              ) {
                if (
                  message[0] === 'heapTotal' ||
                  message[0] === 'heapUsed' ||
                  message[0] === 'counts'
                ) {
                  const sum = Object.values(results).reduce(
                      (acc, curr) => acc + curr,
                      0,
                  );
                  callback(errors, sum);
                  return;
                }
              }
              callback(errors, results);
            }
          });
        }
      });
    },
  };
};

module.exports = comm;
