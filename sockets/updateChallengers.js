const { Connection } = require('../models');

/**
 * 
 * @param {object} io - The IO instance
 * @param {string[]} cSocketIDs - Array of the challenger's socket IDs
 * @param {string[]} tSocketIDs - Array of the target's socket IDs
 * @param {object} data - The data describing the updated challenge
 */
const updateChallengers = async (io,data) => {
  const targetConnections = await Connection.findAll({
    where:{
      user_id:data.target_id
    }
  });

  const challengerConnections = await Connection.findAll({
    where:{
      user_id:data.challenger_id
    }
  });
  const challengeMsg = data.winner ?
    'completedChallenge' :
    'sentChallenge';
  const targetMsg = data.winner ?
    'completedChallenge' :
    'receivedChallenge';
    
  targetConnections.forEach(connection => io.sockets.sockets.get(connection.id).emit(targetMsg,data));
  challengerConnections.forEach(connection => io.sockets.sockets.get(connection.id).emit(challengeMsg,data));
};

module.exports = updateChallengers;