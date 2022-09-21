const sequelize = require('../config/connection');
const { User, UserObjects } = require('../models');
const userSeedData = require('./userSeedData.json');

(async () => {
  await sequelize.sync({ force: true });
  const users = await User.bulkCreate(userSeedData);
  users.forEach(user => {
    [1,4,8].forEach((n)=>{
      UserObjects.create({
        user_id:user.id,
        rock_lvl: n,
        paper_lvl: Math.floor(n/4),
        img:'/public/portraits/rock.png'
      });
    });
  });
  process.exit(0);
})();
