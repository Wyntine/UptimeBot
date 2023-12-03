// @ts-check

const { SlashCommandBuilder } = require("discord.js");
const { checkAdmin } = require("../functions/general");
const { YetkiYok, YenidenBaşlat } = require("../views/embeds");
const { Command } = require("../functions/command");

module.exports = new Command({
  slash: true,
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("yeniden-başlat")
    .setDescription("Bot sahibi özel komutu.")
    .setDMPermission(false),
  async execute(client, interaction) {
    if (!checkAdmin(interaction.user.id))
      return interaction.reply({ embeds: [YetkiYok] });

    await interaction.reply({ embeds: [YenidenBaşlat] });
    setTimeout(() => {
      console.log(`Bot Yeniden Başlatılıyor`);
      process.exit(0);
    }, 2000);
  },
});
