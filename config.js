require("dotenv").config();

global.mongodb = process.env.MONGODB || "mongodb+srv://esananews:BjIJJjz1bcq9r9Yc@newswabot.yj7mcbl.mongodb.net/?retrywrites=true&w=majority";

module.exports = {
     mongodb: global.mongodb,
     };