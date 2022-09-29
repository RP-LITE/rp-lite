const { Connection, User } = require('../models');
const helpers = require('../utils/helper');
const hbs = require('handlebars');
const fs = require('fs/promises');
const path = require('path');

let socketPartial;
let challengeCard;
(async () => {
  socketPartial = await fs.readFile(path.join(__dirname,'../views/partials/socketChallengeCard.handlebars'),'utf8');
  challengeCard = await fs.readFile(path.join(__dirname,'../views/partials/challengeCard.handlebars'),'utf8');
  hbs.registerPartial('challengeCard',challengeCard);
})();

/**
 * 
 * @param {object} io - The IO instance
 * @param {string[]} cSocketIDs - Array of the challenger's socket IDs
 * @param {string[]} tSocketIDs - Array of the target's socket IDs
 * @param {object} data - The data describing the updated challenge
 */
const updateChallengers = async (io,data,del) => {
  const targetConnections = await Connection.findAll({
    where:{
      user_id:data.target_id
    },
    include:[User]
  });
  const challengerConnections = await Connection.findAll({
    where:{
      user_id:data.challenger_id
    },
    include:[User]
  });
  const challengeTemplate = hbs.compile(socketPartial)
  const involved = [...targetConnections,...challengerConnections];
  for await(connection of involved){
    const active = io.sockets.sockets.get(connection.id)
    if(active){
      active.emit('challengeUpdate',{delete:del,cardID:data.id,attackCreature:data.challenge_object,data,card:challengeTemplate({challenge:data.dataValues,user:connection.user})});
    }else{
      connection.destroy();
    }
  }
};

module.exports = updateChallengers;