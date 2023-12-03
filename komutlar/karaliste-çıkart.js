// @ts-check

const { SlashCommandBuilder } = require("discord.js");
const db = require("croxydb");
const { Command } = require("../functions/command");
const { sendLog, checkAdmin } = require("../functions/general");
const {
  YetkiYok,
  KaralistedeBulunmuyor,
  KaralisteGitti,
  KaralistedenÇıkartıldı,
} = require("../views/embeds");

module.exports = new Command({
  slash: true,
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("karaliste-çıkart")
    .setDescription("Bot sahibi özel komutu.")
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName("kullanıcı")
        .setDescription("Karalisteden çıkartılacak kullanıcıyı belirtin.")
        .setRequired(true)
    ),
  async execute(client, interaction) {
    if (!checkAdmin(interaction.user.id))
      return interaction.reply({ embeds: [YetkiYok] });

    const kullanıcı = interaction.options.getUser("kullanıcı", true);
    const Karaliste = db.fetch(`Karaliste_${kullanıcı.id}`);

    if (!Karaliste)
      return interaction.reply({ embeds: [KaralistedeBulunmuyor(kullanıcı)] });

    db.delete(`Karaliste_${kullanıcı.id}`);
    db.delete(`KaralisteSebep_${kullanıcı.id}`);
    interaction.reply({ embeds: [KaralisteGitti(kullanıcı)] });
    await sendLog("blacklistLogChannel", {
      embeds: [KaralistedenÇıkartıldı(kullanıcı, interaction.user)],
    });
  },
});
