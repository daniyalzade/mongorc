states = ["STARTUP", "PRIMARY", "SECONDARY", "RECOVERING", "FATAL",
  "STARTUP2", "UNKNOWN", "ARBITER", "DOWN", "ROLLBACK"]

host = db.serverStatus().host.split('.')[0]

getPrimaryOptimeDate = function() {
  var members = rs.status().members;
  for(var i=0; i < members.length; i++) {
    var member = members[i];
    if(member['stateStr'] == 'PRIMARY') {
      return member['optimeDate'];
    }
  }
}

getMyOptimeDate = function() {
  var members = rs.status().members;
  for(var i=0; i < members.length; i++) {
    var member = members[i];
    if(member['self']) {
      return member['optimeDate'];
    }
  }
}

getReplicationLag = function() {
  var members = rs.status().members;
  if(!members) {
    return null;
  }
  return ((getPrimaryOptimeDate() - getMyOptimeDate()) / 1000);
}

summary = function() {
  var uptime = db.serverStatus().uptime;
  var setName;
  var primary;
  if(db.serverStatus().repl){
    setName = db.serverStatus().repl.setName;
    primary = db.serverStatus().repl.primary;
  }
  var replag = getReplicationLag();
  var curConnections = db.serverStatus().connections.current;
  var resMem = db.serverStatus().mem.resident;
  var userAsserts = db.serverStatus().asserts.user;
  var warningAsserts = db.serverStatus().asserts.warning;
  var totalQueues = db.serverStatus().globalLock.currentQueue.total;
  var lockRatio = db.serverStatus().globalLock.ratio;
  var readQueues = db.serverStatus().globalLock.currentQueue.readers;
  
  print('\tSystem information as of ' + db.serverStatus().localTime)
  print('\n\t** Replication **');
  print("\tPrimary: " + primary + "\tReplag: " + replag + ' (s)');

  print('\n\t** Uptime **');
  var uptimeHours = Math.floor(uptime / (60 * 60));
  var uptimeMinutes = Math.floor((uptime - (uptimeHours * 60 * 60)) / 60);
  print("\tuptime: " + uptime + ' (s)' + '\thuman: ' + uptimeHours + 'h' + ' and ' + uptimeMinutes + 'm');

  print('\n\t** Connections **');
  print("\tCurrent: " + curConnections + "\tQueued: " + totalQueues + "\t% read:" + readQueues / (totalQueues + 1) + "\tLock Ratio: " + lockRatio);

  print('\n\t** Asserts **');
  print("\tUser: " + userAsserts + "\tWarning: " + warningAsserts);
}
summary();

prompt = function() {
  result = db.isMaster();
  if (result.ismaster) {
    var state = 'P';
  }
  else if (result.secondary) {
    var state = 'S';
  } else {
    result = db.adminCommand({replSetGetstate : 1})
    var state = states[result.myState];
  }
  return host + ':' + state  + ' ' + db + '> ';
}

