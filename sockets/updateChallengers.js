const { Connection } = require('../models');
const helpers = require('../utils/helper');
const hbs = require('handlebars');
const fs = require('fs/promises');
const path = require('path');


let challengeCard;
(async () => {
  challengeCard = await fs.readFile(path.join(__dirname,'../views/partials/challengeCard.handlebars'),'utf8');
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
    }
  });
  const challengerConnections = await Connection.findAll({
    where:{
      user_id:data.challenger_id
    }
  });
  const challengeTemplate = hbs.compile(challengeCard)
  const involved = [...targetConnections,...challengerConnections];
  for await(connection of involved){
    const active = io.sockets.sockets.get(connection.id)
    if(active){
      active.emit('challengeUpdate',{delete:del,cardID:data.id,card:challengeTemplate(data.dataValues)});
    }else{
      connection.destroy();
    }
  }
};

module.exports = updateChallengers;