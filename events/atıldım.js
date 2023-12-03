// @ts-check

const { EmbedBuilder } = require("discord.js");
const { sendLog } = require("../functions/general");
const { Event } = require("../functions/event");

module.exports = new Event({
  name: "guildDelete",
  async execute(guild, client) {
    const Atıldım = new EmbedBuilder()
      .setColor("Red")
      .setTitle("Bir sunucudan atıldım")
      .addFields({
        name: `<:Isim:1047166644281163786> **Sunucu adı**`,
        value: `${guild}`,
      })
      .addFields({
        name: `<:Id:1047166052741697587> **Sunucu id**`,
        value: `${guild.id}`,
      })
      .addFields({
        name: `<:Sunucu:1046824609758060624> **Toplam sunucu**`,
        value: `${client.guilds.cache.size}`,
      })
      .addFields({
        name: `<:Kullanici:1046824624165486685> **Toplam kullanıcı**`,
        value: `${client.users.cache.size}`,
      });
    return sendLog("guildLogChannel", { embeds: [Atıldım] });
  },
});
