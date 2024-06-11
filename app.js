require('dotenv').config();
const discord = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');

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
    if(message.content.startsWith('!gitprofile')){
        const username = message.content.split(' ')[1];
        if(!username){
            return message.reply('Please provide a GitHub username.');
        }
        
        try{
            const response = await axios.get(`https://api.github.com/users/${username}`);
            const {login, avatar_url, html_url, followers, following, public_repos, location} = response.data;
            // console.log(response.data);
            const contributionGraph = `https://ghchart.rshah.org/${username}`
            
            const profileEmbed = {
                color: Math.floor(Math.random() * 16777215),
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
                    {
                        name: 'Location',
                        value: `${location || 'Not Specified'}`,
                        inline: true,
                    },
                    {
                        name: 'Contribution Graph',
                        value: `[Click Here](${contributionGraph})`,
                        inline: true,
                    },
                ],
                image:{
                    url: contributionGraph,
                },
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

    if(message.content.startsWith('!gitrepo')){
        const username = message.content.split(' ')[1];
        if(!username){
            message.reply('Please provide valid username');
            return;
        }
        try{
            const response = await axios.get(`https://api.github.com/users/${username}/repos`,{
                headers:{
                    Authorization: `token ${process.env.GITHUB_TOKEN}`
                },
                params:{
                    visibility: 'all',
                    per_page: 100,
                    sort: 'updated',

                }
            });

            const repos = response.data;
            if(repos.length === 0){
                message.reply('No repositories found');
                return;
            }

            let repoList = repos.map(repo => `[${repo.name}](${repo.html_url})`).join('\n');
            // console.log(repoList);

            const repoEmbed = {
                color: Math.floor(Math.random() * 16777215),
                title: `${username}'s GitHub Repositories`,
                description: repoList,
                timestamp: new Date(),
                footer: {
                    text: 'GitHub Repositories',
                    icon_url: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
                },
            }

            message.channel.send({embeds: [repoEmbed]});
        }
        catch(err){
            console.log(err);
            message.reply('Could not fetch GitHub repositories. Make sure the username is correct.');
        }
    }

    if(message.content.startsWith('!gitfile')){
        const args = message.content.split(' ');
        if(args.length < 3){
            return message.reply('Please provide a valid GitHub username and repositrory name');
        }
        const username = args[1];
        const repo = args[2];

        try{
            const repoResponse = await axios.get(`https://api.github.com/repos/${username}/${repo}`,{
                headers:{
                    Authorization: `token ${process.env.GITHUB_TOKEN}`
                }
            });
            const { default_branch, html_url } = repoResponse.data;

            const zipURL = `${html_url}/archive/refs/heads/${default_branch}.zip`;

            const repoEmbed = {
                color: Math.floor(Math.random() * 16777215),
                title: `${username}/${repo}`,
                url: html_url,
                fields: [
                    {
                        name: 'Download',
                        value: `[Click Here](${zipURL})`,
                    },
                ],
                timestamp: new Date(),
                footer: {
                    text: 'GitHub Repository',
                    icon_url: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
                },
            };

            message.channel.send({ embeds: [repoEmbed] });

        }
        catch(err){
            console.log(err);
            message.reply('Could not fetch GitHub repository. Make sure the username and repository name are correct.');
        }
    }
});

client.login(process.env.DISCORD_TOKEN);