const routes = function(config) {
  let context = {};
  context.gid = config.gid || 'all';
  let distribution = global.distribution;
  if (!distribution) {
    throw new Error('Distribution not found');
  }
  return {
    put: function(serviceName, methodName, callback) {
      const message = [serviceName, methodName];
      const remote = {service: 'routes', method: 'put'};
      distribution[context.gid].comm.send(message, remote, callback);
    },
  };
};

module.exports = routes;
