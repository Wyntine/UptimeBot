// @ts-check

const { SlashCommandBuilder } = require("discord.js");
const db = require("croxydb");
const { Command } = require("../functions/command");
const { checkAdmin } = require("../functions/general");
const { YetkiYok, BakımKapalı, BakımKapatıldı } = require("../views/embeds");

module.exports = new Command({
  slash: true,
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("bakım-kapat")
    .setDescription("Bot sahibi özel komutu.")
    .setDMPermission(false),
  async execute(client, interaction) {
    if (!checkAdmin(interaction.user.id))
      return interaction.reply({ embeds: [YetkiYok] });

    const Bakım = db.fetch(`Bakım`);

    if (!Bakım) return interaction.reply({ embeds: [BakımKapalı] });

    await interaction.reply({ embeds: [BakımKapatıldı] });
    db.delete(`Bakım`);
    return db.delete(`BakımSebep`);
  },
});
