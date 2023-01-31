'use strict';

const { Client, Events, GatewayIntentBits, ActivityType, EmbedBuilder } = require('discord.js');
const config = require('./config.json');
const parameters = require('./parameters.json');
const roles = parameters.roles;
const channels = parameters.channels;
const findTeam = parameters.findTeam;
const autoReplies = parameters.autoReplies;
const AND = 'AND';
const OR = 'OR';
const GIF = 'https://media.tenor.com/5c9Owod1dSsAAAAC/infinite-infinito.gif';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages]});

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on("messageCreate", async (message) => {
    try {
        if (message.author.bot) 
            return false;

        evaluateFindTeamSuggestion(message);

        evaluteAutoReplies(message);
    } catch (error) {
        console.error(`Error on messageCreate listener`);
        console.error(error);
    }
});

client.login(config.token);

function evaluateFindTeamSuggestion(message) {
    if (containKeywords(message.content, findTeam.searchCriteria)) {
        let memberRoles = message.member.roles.cache;
        
        if (memberRoles.has(roles.EU)) {
            message.reply(`${findTeam.channelSuggestion} <#${channels.EU}>`);
        } else if (memberRoles.has(roles.NA)) {
            message.reply(`${findTeam.channelSuggestion} <#${channels.NA}>`);
        } else if (memberRoles.has(roles.SA)) {
            message.reply(`${findTeam.channelSuggestion} <#${channels.SA}>`);
        } else {
            message.reply(`${findTeam.pickRegion} <#${channels.pickRegion}>. ${findTeam.allChannels} <#${channels.EU}>, <#${channels.NA}> o <#${channels.SA}>`);
        }
    }
}

function evaluteAutoReplies(message) {
    for (let key in autoReplies) {
        if (containKeywords(message.content, autoReplies[key].searchCriteria)) {
            const embed = new EmbedBuilder()
            .setColor(0xFCAD03)
            .setTitle(resolveResponse(autoReplies[key].responses))
            .setImage(GIF);

            message.channel.send({ embeds: [embed] });
        }
    }
}

function containKeywords(content, searchCriteria) {
    let contentLowerCase = content.toLowerCase();
    for (let key in searchCriteria.keywords) {
        if (contentLowerCase.includes(searchCriteria.keywords[key])) {            
            if (searchCriteria.condition === OR) {
                return true;
            }
        } else if (searchCriteria.condition === AND) {
            return false;
        }
    }

    if (searchCriteria.condition === AND)
        return true;
    else
        return false;
}

function resolveResponse(responses) {
    if (responses.length == 1)
        return responses[0];
    
    return responses[Math.floor(Math.random() * responses.length)];
}
