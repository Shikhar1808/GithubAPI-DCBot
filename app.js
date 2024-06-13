require('dotenv').config();
const discord = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');

const GatewayIntentBits = discord.GatewayIntentBits;

const client = new discord.Client({
    intents: [GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent]
});

const gitProfile = require('./commands/gitProfile');
const gitRepo = require('./commands/gitRepo');
const gitAllRepo = require('./commands/gitAllRepo');

client.once('ready', () => {
    console.log('Bot is ready');
})

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    const args= message.content.split(' ');

    if(message.content.startsWith('!gitProfile')){
        const username = args[1];
        await gitProfile(message,username);
    }
    else if(message.content.startsWith('!gitAllRepo')){
        const username = args[1];
        await gitAllRepo(message,username);
    }
    else if(message.content.startsWith('!gitRepo')){
        const username = args[1];
        const repo = args[2];
        await gitRepo(message,username,repo);
    }
});

client.login(process.env.DISCORD_TOKEN);