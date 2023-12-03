// @ts-check

const { SlashCommandBuilder } = require("discord.js");
const db = require("croxydb");
const { Command } = require("../functions/command");
const { checkAdmin } = require("../functions/general");
const { YetkiYok, DuyuruEklendi } = require("../views/embeds");

module.exports = new Command({
  slash: true,
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("duyuru-ekle")
    .setDescription("Sisteme bir duyuru ekler.")
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("duyuru")
        .setDescription("Eklenecek duyuruyu belirtin.")
        .setRequired(true)
    ),
  async execute(client, interaction) {
    if (!checkAdmin(interaction.user.id))
      return interaction.reply({ embeds: [YetkiYok] });

    const duyuru = interaction.options.getString("duyuru", true);
    await interaction.reply({ embeds: [DuyuruEklendi(duyuru)] });
    return db.push(`Duyurular`, `${duyuru}`);
  },
});
