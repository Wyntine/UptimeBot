// @ts-check

const { ButtonBuilder, ButtonStyle } = require("discord.js");
const { Link, Davet, Çöp } = require("./emojis");
const { botId } = require("../functions/config").getConfig();

const EkleButon = new ButtonBuilder()
  .setEmoji(Davet)
  .setLabel("Ekle")
  .setStyle(ButtonStyle.Secondary)
  .setCustomId("eklebuton");
const SilButon = new ButtonBuilder()
  .setEmoji(Çöp)
  .setLabel("Sil")
  .setStyle(ButtonStyle.Secondary)
  .setCustomId("silbuton");
const ListeButon = new ButtonBuilder()
  .setEmoji(Link)
  .setLabel("Liste")
  .setStyle(ButtonStyle.Secondary)
  .setCustomId("listebuton");
const DestekButon = new ButtonBuilder()
  .setURL(`https://discord.gg/XjBRvvaUzM`)
  .setLabel("Destek sunucusu")
  .setStyle(ButtonStyle.Link);
const OyButon = new ButtonBuilder()
  .setURL(`https://top.gg/bot/${botId}/vote`)
  .setLabel(`Oy ver`)
  .setStyle(ButtonStyle.Link);
const DavetButon = new ButtonBuilder()
  .setURL(
    `https://discord.com/api/oauth2/authorize?client_id=${botId}&permissions=8&scope=bot%20applications.commands`
  )
  .setLabel(`Sunucuna ekle`)
  .setStyle(ButtonStyle.Link);

module.exports = {
  EkleButon,
  SilButon,
  ListeButon,
  DestekButon,
  OyButon,
  DavetButon,
};
