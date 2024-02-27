global.nodeConfig = {ip: '127.0.0.1', port: 8080};
const distribution = require('../distribution');
const id = distribution.util.id;

const groupsTemplate = require('../distribution/all/groups');
const mygroupGroup = {};

beforeAll((done) => {
  const n1 = {ip: '127.0.0.1', port: 8000};


  // First, stop the nodes if they are running
  let remote = {service: 'status', method: 'stop'};
  remote.node = n1;
  distribution.local.comm.send([], remote, (e, v) => {});


  mygroupGroup[id.getSID(n1)] = n1;

  // Now, start the base listening node
  distribution.node.start((server) => {
    localServer = server;
    // Now, start the nodes
    distribution.local.status.spawn(n1, (e, v) => {
      groupsTemplate({gid: 'mygroup'})
          .put('mygroup', mygroupGroup, (e, v) => {
            done();
          });
    });
  });
});

afterAll((done) => {
  distribution.mygroup.status.stop((e, v) => {
    const nodeToSpawn = {ip: '127.0.0.1', port: 9001};
    let remote = {node: nodeToSpawn, service: 'status', method: 'stop'};
    distribution.local.comm.send([], remote, (e, v) => {
      localServer.close();
      done();
    });
  });
});


test('test all.comm.status.get(counts)', (done) => {
  const remote = {service: 'status', method: 'get'};
  distribution.mygroup.comm.send(['counts'], remote, (e, v) => {
    expect(e).toEqual({});
    expect(v).toEqual(0);
    done();
  });
});

test('test all.comm.status.get(heapTotal)', (done) => {
  const remote = {service: 'status', method: 'get'};
  distribution.mygroup.comm.send(['heapTotal'], remote, (e, v) => {
    expect(e).toEqual({});
    expect(typeof v).toBe('number');
    done();
  });
});

test('test all.comm.status.get(heapUsed)', (done) => {
  const remote = {service: 'status', method: 'get'};
  distribution.mygroup.comm.send(['heapUsed'], remote, (e, v) => {
    expect(e).toEqual({});
    expect(typeof v).toBe('number');
    done();
  });
});

test('test all.node.spawn works as expected', (done) => {
  const nodeToSpawn = {ip: '127.0.0.1', port: 9001};
  distribution.mygroup.status.spawn(nodeToSpawn, (e, v) => {
    expect(e).toBeFalsy();
    expect(v.ip).toBeDefined();
    expect(v.port).toBeDefined();
    done();
  });
});

test('test adding a new group service, and use the method', (done) =>{
  let g = {
    '507aa': {ip: '127.0.0.1', port: 8080},
    '12ab0': {ip: '127.0.0.1', port: 9001},
  };
  const nodeToBeAdd = {ip: '127.0.0.1', port: 9003};
  distribution.mygroup.groups.put('mytest', g, (e, v)=>{
    distribution.mytest.groups.add('mytest', nodeToBeAdd, (e, v) => {
      expect(e).toEqual({});
      Object.values(v).forEach((item) =>{
        expect(item).toEqual(nodeToBeAdd);
      });
      done();
    });
  });
});


