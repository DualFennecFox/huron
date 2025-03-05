import { GatewayIntentBits, Partials, Collection } from 'discord.js';
import dotenvFlow from "dotenv-flow";
import { connect } from "mongoose";
import eventLoader from './util/eventLoader';
import commandHandler from './handlers/command';
import logsHandler from './handlers/logs';
import configsHandler from './handlers/configs';
import ExtendedClient from './classes/extendedClient';
import distubeLoader from './util/distubeLoader';

dotenvFlow.config();

const client = new ExtendedClient({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.DirectMessages, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent, 
        GatewayIntentBits.GuildMessageReactions, 
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates
    ],
    partials: [Partials.Channel] 
});

client.aliases = new Collection();
client.log = new Collection();
client.configs = new Collection();

connect(`${process.env.MONGOURI}/Guild`);

eventLoader(client);
distubeLoader(client)
commandHandler(client);
logsHandler(client);
configsHandler(client);

client.login(process.env.TOKEN);