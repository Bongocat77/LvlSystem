const Discord = require('discord.js');
const random = require('random');
const fs = require('fs');
const jsonfile = require('jsonfile');
const bot = new Discord.Client();

var stats = {};
if (fs.existsSync('stats.json')) {
    stats = jsonfile.readFileSync('stats.json');
}

bot.on('ready', () => {
    console.log(`${bot.user.tag} is ready lol`)
})

bot.on('message', (message) => {
    if (message.author.id == bot.user.id)
    return;

    if (message.guild.id in stats === false) {
        stats[message.guild.id] = {};
    }

    const guildStats = stats[message.guild.id];
    if (message.author.id in guildStats === false) {
        guildStats[message.author.id] = {
            xp: 0,
            level: 0,
            last_message: 0
        };
    }

            const userStats = guildStats[message.author.id];
            if (Date.now() - userStats.last_message > 1000) {
                userStats.xp += random.int(15, 25);
                userStats.last_message = Date.now();
        
                const xpToNextLevel = 5 * Math.pow(userStats.level, 2) + 50 * userStats.level + 100;
                const nxtLvl = 5 * (Math.pow(2, userStats.level) - 1);
                if (userStats.xp >= xpToNextLevel) {
                    userStats.level++;
                    userStats.xp = userStats.xp - xpToNextLevel;
                    message.channel.send(message.author.username + ' has reached lvl ' + userStats.level);
                }

        

            jsonfile.writeFileSync('stats.json', stats);

            console.log(message.author.username + ' now has ' + userStats.xp + 'xp');
            console.log(xpToNextLevel + ' XP needed for next lvl!')
            }


    if(message.content === '-level') {
        message.channel.send(`${message.author.username} is on level ` +  userStats.level);
    }
});


bot.login(process.env.token);