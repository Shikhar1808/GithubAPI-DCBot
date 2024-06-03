const discord = require('discord.js');
const Client = discord.Client;
const GatewayIntentBits = discord.GatewayIntentBits;
const dotenv = require('dotenv').config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds , 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent]
});

client.on("messageCreate", message =>{
    if(message.author.bot) return;
    else if(message.content === "ping"){
        message.reply("pong");
    }
    else{
        message.reply(message.content);
    }
    console.log(message.content);
})

client.login(process.env.BOT_TOKEN);