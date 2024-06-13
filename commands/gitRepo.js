const axios = require('axios');

const gitAllRepo = async(message,username,repo) =>{
        if (!username || !repo) {
            return message.reply('Please provide a valid GitHub username and repository name.');
        }

        try {
            const repoResponse = await axios.get(`https://api.github.com/repos/${username}/${repo}`, {
                headers: {
                    Authorization: `token ${process.env.GITHUB_TOKEN}`
                }
            });

            const repoDetails = repoResponse.data

            const zipURL = `${repoDetails.html_url}/archive/refs/heads/${repoDetails.default_branch}.zip`;

            const color = Math.floor(Math.random() * 16777215);

            const repoEmbed = {
                color: color,
                title: `${repoDetails.owner.login}/${repoDetails.name}`,
                url: repoDetails.html_url,
                description: repoDetails.description || 'No description available.',
                fields: [
                    {
                        name: 'Language',
                        value: repoDetails.language || 'Not specified',
                        inline: true,
                    },
                    {
                        name: 'Stars',
                        value: `${repoDetails.stargazers_count}`,
                        inline: true,
                    },
                    {
                        name: 'Forks',
                        value: `${repoDetails.forks_count}`,
                        inline: true,
                    },
                    {
                        name: 'Watchers',
                        value: `${repoDetails.watchers_count}`,
                        inline: true,
                    },
                    {
                        name: 'Open Issues',
                        value: `${repoDetails.open_issues_count}`,
                        inline: true,
                    },
                    {
                        name: 'License',
                        value: repoDetails.license ? repoDetails.license.name : 'None',
                        inline: true,
                    },
                    {
                        name: 'Default Branch',
                        value: repoDetails.default_branch,
                        inline: true,
                    },
                    {
                        name: 'Created At',
                        value: new Date(repoDetails.created_at).toLocaleDateString(),
                        inline: true,
                    },
                    {
                        name: 'Last Updated',
                        value: new Date(repoDetails.updated_at).toLocaleDateString(),
                        inline: true,
                    },
                    {
                        name: 'Last Pushed',
                        value: new Date(repoDetails.pushed_at).toLocaleDateString(),
                        inline: true,
                    },
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
        catch (err) {
            console.log(err);
            message.reply('Could not fetch GitHub repository. Make sure the username and repository name are correct.');
        }
}

module.exports = gitAllRepo;