const axios = require('axios');

const gitAllRepo = async(message,username) =>{
    if (!username) {
        message.reply('Please provide valid username');
        return;
    }
    try {
        const response = await axios.get(`https://api.github.com/users/${username}/repos`, {
            headers: {
                Authorization: `token ${process.env.GITHUB_TOKEN}`
            },
            params: {
                visibility: 'all',
                per_page: 1000,
                sort: 'updated',
                
            }
        });
        
        const color = Math.floor(Math.random() * 16777215);
        const repos = response.data;
        if (repos.length === 0) {
            message.reply('No repositories found');
            return;
        }

        const repoLinks = repos.map(repo => `[${repo.name}](${repo.html_url})`);
        // console.log(repoList);

        const chunkSize = 1024;
        let chunk = '';
        const chunks = [];
        repoLinks.forEach(repo => {
            if (chunk.length + repo.length > chunkSize) {
                chunks.push(chunk);
                chunk = '';
            }
            chunk += repo + '\n';
        });
        if (chunk.length > 0) {
            chunks.push(chunk);
        }

        for (const chunk of chunks) {
            const repoEmbed = {
                color: color,
                title: `${username}'s GitHub Repositories`,
                description: chunk,
                timestamp: new Date(),
                footer: {
                    text: 'GitHub Repositories',
                    icon_url: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
                },
            }

            await message.channel.send({ embeds: [repoEmbed] });
        }

    }
    catch (err) {
        console.log(err);
        message.reply('Could not fetch GitHub repositories. Make sure the username is correct.');
    }
}

module.exports = gitAllRepo;