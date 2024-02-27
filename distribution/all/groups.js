const groups = function(config) {
  let context = {};
  context.gid = config.gid || 'all';
  let distribution = global.distribution;
  if (!distribution) {
    throw new Error('Distribution not found');
  }
  return {
    get: function(gid, callback) {
      const message = [gid];
      const remote = {service: 'groups', method: 'get'};
      distribution[context.gid].comm.send(message, remote, callback);
    },

    put: function(gid, group, callback) {
      // notify all the nodes in group to put;
      distribution.local.groups.put(gid, group, (e, v) => {
        const message = [gid, group];
        const remote = {service: 'groups', method: 'put'};
        distribution[context.gid].comm.send(message, remote, callback);
      });
    },

    del: function(gid, callback) {
      const message = [gid];
      const remote = {service: 'groups', method: 'del'};
      distribution[context.gid].comm.send(message, remote, callback);
    },

    add: function(gid, node, callback) {
      const message = [gid, node];
      const remote = {service: 'groups', method: 'add'};
      distribution[context.gid].comm.send(message, remote, callback);
    },

    rem: function(gid, nodeId, callback) {
      const message = [gid, nodeId];
      const remote = {service: 'groups', method: 'rem'};
      distribution[context.gid].comm.send(message, remote, callback);
    },
  };
};

module.exports = groups;
