// @ts-check

const { SlashCommandBuilder } = require("discord.js");
const db = require("croxydb");
const { Command } = require("../functions/command");
const { checkAdmin } = require("../functions/general");
const { YetkiYok, DuyuruYok, DuyuruKaldırıldı } = require("../views/embeds");

module.exports = new Command({
  slash: true,
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("duyuru-kaldır")
    .setDescription("Sistemdeki bir duyuruyu kaldırır.")
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("duyuru")
        .setDescription("Kaldırılacak duyuruyu belirtin.")
        .setRequired(true)
    ),
  async execute(client, interaction) {
    if (!checkAdmin(interaction.user.id))
      return interaction.reply({ embeds: [YetkiYok] });

    const duyuru = interaction.options.getString("duyuru", true);
    const duyurular = db.fetch(`Duyurular`) ?? [];

    if (!duyurular.includes(duyuru))
      return interaction.reply({ embeds: [DuyuruYok(duyuru)] });

    await interaction.reply({ embeds: [DuyuruKaldırıldı(duyuru)] });
    return db.unpush(`Duyurular`, `${duyuru}`);
  },
});
