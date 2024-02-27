const {getSID} = require('../util/id.js');
const groupsTemplate = require('../all/groups');
const commTemplate = require('../all/comm');
const routesTemplate = require('../all/routes');
const statusTemplate = require('../all/status');

const groups = {};
global.groupsMap = {};

groups.get = function(groupName, callback) {
  callback =
    callback ||
    function(e, v) {
      e ? console.error(e) : console.log(v);
    };
  if (global.groupsMap === undefined) {
    callback(new Error('Groups map not init'), null);
    return;
  }
  if (global.groupsMap[groupName]) {
    callback(null, global.groupsMap[groupName]);
  } else {
    callback(new Error('Group not found'), null);
  }
};

groups.put = function(groupName, nodes, callback) {
  console.log(groupName, nodes);
  callback =
    callback ||
    function(e, v) {
      e ? console.error(e) : console.log(v);
    };
  if (global.groupsMap === undefined) {
    callback(new Error('Groups map not init'), null);
    return;
  }
  global.groupsMap[groupName] = nodes;
  // To support group service
  let distribution = global.distribution;
  distribution[groupName] = {};
  distribution[groupName].groups = groupsTemplate({gid: groupName});
  distribution[groupName].comm = commTemplate({gid: groupName});
  distribution[groupName].routes = routesTemplate({gid: groupName});
  distribution[groupName].status = statusTemplate({gid: groupName});
  callback(null, global.groupsMap[groupName]);
};

groups.del = function(groupName, callback) {
  callback =
    callback ||
    function(e, v) {
      e ? console.error(e) : console.log(v);
    };
  if (global.groupsMap === undefined) {
    callback(new Error('Groups map not init'), null);
    return;
  }
  if (global.groupsMap[groupName]) {
    const deletedGroup = global.groupsMap[groupName];
    delete global.groupsMap[groupName];
    callback(null, deletedGroup);
  } else {
    callback(new Error('Group not found'), null);
  }
};

groups.add = function(groupName, node, callback) {
  callback =
    callback ||
    function(e, v) {
      e ? console.error(e) : console.log(v);
    };
  const nodeId = getSID(node);
  if (global.groupsMap === undefined) {
    callback(new Error('Groups map not init'), null);
    return;
  }
  if (global.groupsMap[groupName]) {
    global.groupsMap[groupName][nodeId] = node;
    callback(null, node);
  } else {
    callback(new Error('Group not found'), null);
  }
};

groups.rem = function(groupName, nodeId, callback) {
  callback =
    callback ||
    function(e, v) {
      e ? console.error(e) : console.log(v);
    };
  if (global.groupsMap === undefined) {
    callback(new Error('Groups map not init'), null);
    return;
  }
  if (!global.groupsMap[groupName]) {
    callback(new Error('Group not found'), null);
    return;
  }
  if (!global.groupsMap[groupName][nodeId]) {
    callback(new Error('Node not found in given group'), null);
    return;
  }
  delete global.groupsMap[groupName][nodeId];
  callback(null, 1);
};

module.exports = groups;
