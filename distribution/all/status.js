const status = function(config) {
  let context = {};
  context.gid = config.gid || 'all';
  let distribution = global.distribution;
  if (!distribution) {
    throw new Error('Distribution not found');
  }
  return {
    get: function(key, callback) {
      const message = [key];
      const remote = {service: 'status', method: 'get'};
      distribution[context.gid].comm.send(message, remote, callback);
    },
    stop: function(callback) {
      // first, notify all the nodes to stop
      const remote = {service: 'status', method: 'stop'};
      distribution[context.gid].comm.send([], remote, callback);
    },
    spawn: function(nodeConfig, callback) {
      distribution.local.status.spawn(nodeConfig, (e, v) => {
        distribution.local.groups.add(
            context.gid,
            nodeConfig,
            (e, v) => {
              if (e && Object.keys(e).length !== 0) {
                callback(new Error('Add new node to groups failed!'), null);
              } else {
                callback(null, v);
              }
            },
        );
      });
    },
  };
};

module.exports = status;
