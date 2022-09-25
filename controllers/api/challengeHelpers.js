const { UserObjects } = require('../../models');

const weaknessOf = {
  rock:'paper',
  paper:'scissor',
  scissor:'rock'
};

const awardXP = (winner,loser) => {
  const loserLevel = Object.keys(weaknessOf).reduce((memo,key)=>{
    if(!loser[`${memo}_lvl`] || loser[`${memo}_lvl`] < loser[`${key}_lvl`]){
      memo = key;
    }
    return memo;
  });
  winner.experience += loser[`${loserLevel}_lvl`];
};

/**
 * Resolves a challenge by comparing relevant levels (and eventually abilities). Results are figured as follows:
 * - Attackers use only their highest level
 * - Defenders use their level when defending against the same type
 * - their level + 4 when defending against the type they are strong against
 * - their level -4 (min 0) when defending against the type they are weak against.
 * - Ties go to the defender.
 * A lvl 8 rock attacking a lvl 8 paper => defender Wins
 * A lvl 12 rock attacking a lvl 8 paper => defender Wins
 * A lvl 13 Rock attacking a lvl 8 paper => attacker Wins
 * A lvl 13 Rock attacking a lvl 8 paper / lvl 1 rock => defender wins
 * @param {object} challenge - The challenge info from the database
 * @returns {number} - ID of the winner
 */
const resolve = async (challenge) => {
  console.log('resolving',challenge);
  const challenger = challenge.attacker;
  const defender = challenge.defender;

  const challengerDetails = {
    type: challenger.type,
    level: challenger[`${challenger.type}_lvl`]
  };

  const defenderLevel = Object.entries(weaknessOf).reduce((total,[t,w])=>{
    const dLvl = defender[`${t}_lvl`];
    if(dLvl){
      // Apply the appropriate level adjustment
      const realLevel = challengerDetails.type === t ?
        dLvl :
        (
          challengerDetails.type === w ?
            dLvl - 4 :
            dLvl + 4
        );
        // Add the adjustedLevel
      total += Math.max(0,realLevel);
    }
    return total;
  },0);

  const result = challengerDetails.level - defenderLevel;
  challenge.winner = result > 0 ? 
    challenge.challenger_id :
    challenge.target_id;
  
  if(result > 0){
    awardXP(challenger,defender);
  }else{
    awardXP(defender,challenger);
  }
};

module.exports = { resolve };