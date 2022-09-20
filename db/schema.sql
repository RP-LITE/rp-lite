-- SQLBook: Code
DROP DATABASE IF EXISTS game_db;
CREATE DATABASE game_db;

USE game_db;

-- CREATE TABLE users (
--     player_name VARCHAR(8),
--     email VARCHAR(50),
--     ID INT --connects to user id in user_objects, challenges ID, challenger id, target id
--     user_password VARCHAR(15);
-- );

-- CREATE TABLE user_objects (
--     object_id INT, --connects to object id in object abilities
--     user_id INT, --users id 
--     rock_lvl INT,
--     paper_lvl INT,
--     scissor_lvl INT,
--     img IMAGE
-- );

-- CREATE TABLE object_abilities (
--     object_id INT, --object id from user objects
--     user_object_id INT,
--     ability_id INT
-- );

-- CREATE TABLE abilities (
--     ability_id INT,
--     ability_name VARCHAR(100)
-- );

-- CREATE TABLE challenges (
--     ID INT, 
--     challenger_id INT, --from users id
--     target_id INT, --users id
--     challenge_obj INT --user objects 
-- );



-- users
-- user obj contains (game pieces like rock/paper/scissors)
-- obj abilities (join table for abilities and objects)
-- abilities
-- challenges
