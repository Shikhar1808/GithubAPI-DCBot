const axios = require('axios');

const gitProfile = async(message,username) =>{
    if (!username) {
        return message.reply('Please provide a GitHub username.');
    }

    try {
        const response = await axios.get(`https://api.github.com/users/${username}`);
        const { login, avatar_url, html_url, followers, following, public_repos, location } = response.data;
        // console.log(response.data);
        const contributionGraph = `https://ghchart.rshah.org/${username}`

        const color = Math.floor(Math.random() * 16777215);

        const profileEmbed = {
            color: color,
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
            image: {
                url: contributionGraph,
            },
            timestamp: new Date(),
            footer: {
                text: 'GitHub Profile',
                icon_url: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
            },
        };

        message.channel.send({ embeds: [profileEmbed] });

    } catch (err) {
        console.log(err);
        message.reply('Could not fetch GitHub profile. Make sure the username is correct.');
    }
}

module.exports = gitProfile;
