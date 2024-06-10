require('dotenv').config();
const discord = require('discord.js');
const axios = require('axios');

const GatewayIntentBits = discord.GatewayIntentBits;

const client = new discord.Client({
    intents: [GatewayIntentBits.Guilds , 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent]
});

client.once('ready', () =>{
    console.log('Bot is ready');
} )

client.on('messageCreate', async (message) => {
    if(message.author.bot) return;
    if(message.content.startsWith('!github')){
        const username = message.content.split(' ')[1];
        if(!username){
        }
        
        try{
            const response = await axios.get(`https://api.github.com/users/${username}`);
            const {login, avatar_url, html_url, followers, following, public_repos, public_gists} = response.data;
            
            const profileEmbed = {
                color: 0x0099ff,
                title: `${login}'s GitHub Profile`,
                url: html_url,
                author: {
                    name: login,
                    icon_url: avatar_url,
                    url: html_url,
                },
                thumbnail: {
                    url: avatar_url,
                },
                fields: [
                    {
                        name: 'Public Repositories',
                        value: `${public_repos}`,
                        inline: true,
                    },
                    {
                        name: 'Followers',
                        value: `${followers}`,
                        inline: true,
                    },
                    {
                        name: 'Following',
                        value: `${following}`,
                        inline: true,
                    },
                ],
                timestamp: new Date(),
                footer: {
                    text: 'GitHub Profile',
                    icon_url: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
                },
            };

            message.channel.send({ embeds: [profileEmbed] });
            
        }catch(err){
            console.log(err);
            message.reply('Could not fetch GitHub profile. Make sure the username is correct.');
        }
    }
});

client.login(process.env.DISCORD_TOKEN);