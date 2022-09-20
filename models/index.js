const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');

class userObjects extends Model {}

userObjects.init(
    {
        object_id: {
            type: DataTypes.INTEGER
        },
        user_id: {
            type: DataTypes.INTEGER
        },
        rock_lvl: {
            type: DataTypes.INTEGER
        },
        paper_lvl: {
            type: DataTypes.INTEGER
        },
        scissor_lvl: {
            type: DataTypes.INTEGER
        },
        img: {
            type: DataTypes.IMAGE
        },
    },
    {
    sequelize,
        timestamps: false,
        underscored: true,
        modelName: 'userObjects'
    }
);

module.exports = userObjects;

class objectAbilities extends Model {}

objectAbilities.init(
    {
        object_id: {
            type: DataTypes.INTEGER
        },
        user_object_id: {
            type: DataTypes.INTEGER
        },
        ability_id: {
            type: DataTypes.INTEGER
        },
    },
    {
    sequelize,
        timestamps: false,
        underscored: true,
        modelName: 'objectAbilities'
    }
);

module.exports = objectAbilities;

class abilities extends Model {}

abilities.init(
    {
        ability_id: {
            type: DataTypes.INTEGER
        },
        ability_name: {
            type: DataTypes.STRING
        },
    },
    {
    sequelize,
        timestamps: false,
        underscored: true,
        modelName: 'abilities'
    }
);

module.exports = abilities;

class challenges extends Model {}

challenges.init(
    {
        challenge_id: {
            type: DataTypes.INTEGER
        },
        challenger_id: {
            type: DataTypes.INTEGER
        },
        target_id: {
            type: DataTypes.INTEGER
        },
        challenge_object: {
            type: DataTypes.INTEGER
        },
    },
    {
    sequelize,
        timestamps: false,
        underscored: true,
        modelName: 'challenges'
    }
);

module.exports = challenges;