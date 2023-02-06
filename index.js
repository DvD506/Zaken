'use strict';

const { Client, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const config = require('./config.json');

//Application parameters
const applicationParameters = require('./parameters.json');
const roles = applicationParameters.roles;
const channels = applicationParameters.channels;
const findTeam = applicationParameters.findTeam;
const autoReplies = applicationParameters.autoReplies;
const roleManager = applicationParameters.commands.roleManager;

//Application constants

//Auto-replies
const AND = 'AND';
const OR = 'OR';
const GIF = 'https://media.tenor.com/5c9Owod1dSsAAAAC/infinite-infinito.gif';

//Role manager
const memberPreffix = '<@';
const rolePreffix = '<@&';
const roleIdentifier = '&';
const commandDelimiter = ' ';
const missingPermissionsErrorCode = 50013;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages]});

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on("messageCreate", async (message) => {
    try {
        console.log(`Incoming message: content ${message.content}`);

        if (message.author.bot) 
            return false;

        manageRoles(message);

        //evaluateFindTeamSuggestion(message);

        //evaluteAutoReplies(message);
    } catch (error) {
        console.error(`Error on messageCreate listener`);
        console.error(error);
    }
});

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection: ', error);
});

client.on(Events.ShardError, error => {
	console.error('A websocket connection encountered an error: ', error);
});

client.login(config.token);

function manageRoles(message) {
    if (!message.content.startsWith(roleManager.preffix))
        return;

    console.log(`Role manager command found`);

    if (!message.member.roles.cache.has(roles.roleManager))
        return;

    console.log(`User is authorized to use role manager`);

    try {
        let command = message.content.substring(roleManager.preffix.length);
        let parameters = command.split(commandDelimiter);

        if (parameters.length < 4) {
            message.reply(roleManagerCommandFormat());
            return;
        }

        let operation = parameters[2];
        let memberId = getMemberId(parameters[1]);
        let member = message.guild.members.cache.get(memberId);
        let rolesToAssign = getRoles(parameters.slice(3), message.guild.roles.cache);

        assignRoles(operation, rolesToAssign, member, message);
    } catch (error) {
        if (error instanceof AssignRoleToRoleException) {
            message.reply(error.message);
        } else {
            message.reply(roleManagerCommandFormat());

            throw error;
        }
    }
}

function assignRoles(operation, rolesToAssign, member, message) {
    switch (operation) {
        case roleManager.operations.add:
            member.roles.add(rolesToAssign).catch(error => {
                handleMissingPermissions(error, message, roleManager.messages.cannotAddRole)
            });
        break;
        case roleManager.operations.remove:
            member.roles.remove(rolesToAssign).catch(error => {
                handleMissingPermissions(error, message, roleManager.messages.cannotRemoveRole);
            });;
        break;
        default:
            message.reply(roleManagerCommandFormat());
            return;
    }
}

function handleMissingPermissions(error, message, errorMessage) {
    if(error.code === missingPermissionsErrorCode)
        message.reply(errorMessage);
    else
        throw error;
}

function roleManagerCommandFormat() {
    return `${roleManager.messages.formatMessage}${roleManager.preffix} ${roleManager.messages.addRoleExample}\n${roleManager.preffix} ${roleManager.messages.removeRoleExample}`
}

function getRoles(roleMentions, roleCache) {
    let roles = [];

    roleMentions.forEach(roleMention => {
        if (!roleMention.includes(rolePreffix))
            throw new Error('Parameter is not a role');

        let roleId = getMentionId(roleMention, rolePreffix);
        let role = roleCache.get(roleId);
        roles.push(role);
    });
    
    return roles;
}

function getMemberId(memberMention) {
    if (memberMention.includes(roleIdentifier))
        throw new AssignRoleToRoleException(roleManager.messages.cannotAddRoleToAnotherRole);

    if (!memberMention.includes(memberPreffix))
        throw new Error('First Parameter is not a member');

    return getMentionId(memberMention, memberPreffix)
}

function getMentionId(mention, preffix) {
    return mention.substring(mention.indexOf(preffix) + preffix.length, mention.length - 1);
}

function evaluateFindTeamSuggestion(message) {
    if (containKeywords(message.content, findTeam.searchCriteria)) {
        let memberRoles = message.member.roles.cache;
        
        if (memberRoles.has(roles.region.EU)) {
            message.reply(`${findTeam.channelSuggestion} <#${channels.EU}>`);
        } else if (memberRoles.has(roles.region.NA)) {
            message.reply(`${findTeam.channelSuggestion} <#${channels.NA}>`);
        } else if (memberRoles.has(roles.region.SA)) {
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

function AssignRoleToRoleException(msg) {
    this.message = msg;
}
  
AssignRoleToRoleException.prototype = Object.create(Error.prototype);
