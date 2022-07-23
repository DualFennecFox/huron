const { EmbedBuilder } = require('discord.js')
const musicData = require("./requirements/musicData");
const { ClientCredentials, ResourceOwnerPassword, AuthorizationCode } = require('simple-oauth2');
const https =require('https');

const config = {
    client: {
      id: process.env.OAUTH2_CLIENT,
      secret: process.env.OAUTH_SECRET
    },
    auth: {
      tokenHost: 'https://api.genius.com/'
    }
  };

module.exports = {
    name : 'lyrics',
    category: "Musica",
    description : 'Este comando busca una musica en SoundCloud para escucharla en un chat de voz',
    usage: '!scplay <Busqueda, URL, Playlist>',
    examples: ['!scplay Super-Canción', '!scplay ""'],
    run: async(client, message, args) => {   

      https.request({
        auth: `Bearer ${process.env.OAUTH2_TOKEN}`,
        host: "api.genius.com",
        method: "GET",
        path: "/account"
      }, res => {

        console.log(`statusCode: ${res.statusCode}`)
      })

    
    }
    }