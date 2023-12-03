// @ts-check

const { SlashCommandBuilder } = require("discord.js");
const db = require("croxydb");
const { Command } = require("../functions/command");
const { checkAdmin } = require("../functions/general");
const { YetkiYok, BakımAçık, BakımAçıldı } = require("../views/embeds");

module.exports = new Command({
  slash: true,
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("bakım-aç")
    .setDescription("Bot sahibi özel komutu.")
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("sebep")
        .setDescription("Bakım sebebini belirtin.")
        .setRequired(true)
    ),
  async execute(client, interaction) {
    if (!checkAdmin(interaction.user.id))
      return interaction.reply({ embeds: [YetkiYok] });

    const Bakım = db.fetch(`Bakım`);
    const Sebep = db.fetch(`BakımSebep`);
    const sebep = interaction.options.getString("sebep", true);

    if (Bakım) return interaction.reply({ embeds: [BakımAçık(Sebep)] });

    await interaction.reply({ embeds: [BakımAçıldı(sebep)] });
    db.set(`Bakım`, true);
    return db.set(`BakımSebep`, sebep);
  },
});
