const id = require('../util/id');
const {serialize} = require('../util/serialization.js');
const {createRPC, toAsync} = require('../util/wire.js');
const {spawn} = require('node:child_process');
const path = require('path');

const status = {};

global.moreStatus = {
  sid: id.getSID(global.nodeConfig),
  nid: id.getNID(global.nodeConfig),
  counts: 0,
};

status.get = function(configuration, callback) {
  callback = callback || function() {};

  if (configuration in global.nodeConfig) {
    callback(null, global.nodeConfig[configuration]);
  } else if (configuration in moreStatus) {
    callback(null, moreStatus[configuration]);
  } else if (configuration === 'heapTotal') {
    callback(null, process.memoryUsage().heapTotal);
  } else if (configuration === 'heapUsed') {
    callback(null, process.memoryUsage().heapUsed);
  } else {
    callback(new Error('Status key not found'));
  }
};

status.stop = function(callback) {
  // if (global.thisServer) {
  //   global.thisServer.close();
  // }
  // wrapping the close process in async
  setTimeout(() => {
    process.exit(0);
  }, 10);
  // callback
  callback(null, 1);
};

status.spawn = function(conf, callback) {
  try {
    console.log(conf);
    // multiple onStarts
    if (conf.onStart) {
      const firstCb = conf.onStart;
      let funcStr = `
        let firstCb = ${firstCb.toString()};
        let callbackRPC = ${createRPC(toAsync(callback)).toString()};
        firstCb();
        callbackRPC(null, global.nodeConfig, () => {});
      `;
      conf.onStart = new Function(funcStr);
    } else {
      let funcStr = `
        let callbackRPC = ${createRPC(toAsync(callback)).toString()};
        callbackRPC(null, global.nodeConfig, () => {});
      `;
      conf.onStart = new Function(funcStr);
    }
    const serializedConf = serialize(conf);
    // init the new child
    const correctPath = path.join(__dirname, '../../distribution.js');
    // start a new process
    const child = spawn('node', [correctPath, '--config', serializedConf]);
    child.on('error', (err) => {
      console.log(`spawn failed: ${err}`);
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports = status;
