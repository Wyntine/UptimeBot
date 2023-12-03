// @ts-check

const { SlashCommandBuilder } = require("discord.js");
const db = require("croxydb");
const { Command } = require("../functions/command");
const { checkAdmin, sendLog } = require("../functions/general");
const {
  YetkiYok,
  KaralistedeBulunuyor,
  KaralisteEklendi,
  KaralisteyeAlındı,
} = require("../views/embeds");

module.exports = new Command({
  slash: true,
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("karaliste-ekle")
    .setDescription("Bot sahibi özel komutu.")
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName("kullanıcı")
        .setDescription("Karalisteye eklenecek kullanıcıyı belirtin.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("sebep")
        .setDescription("Karalisteye ekleme sebebini belirtin.")
        .setRequired(true)
    ),
  async execute(client, interaction) {
    if (!checkAdmin(interaction.user.id))
      return interaction.reply({ embeds: [YetkiYok] });

    const kullanıcı = interaction.options.getUser("kullanıcı", true);
    const sebep = interaction.options.getString("sebep", true);
    const Karaliste = db.fetch(`Karaliste_${kullanıcı.id}`);

    if (Karaliste)
      return interaction.reply({ embeds: [KaralistedeBulunuyor(kullanıcı)] });

    db.set(`Karaliste_${kullanıcı.id}`, true);
    db.set(`KaralisteSebep_${kullanıcı.id}`, sebep);
    await interaction.reply({ embeds: [KaralisteEklendi(kullanıcı)] });
    await sendLog("blacklistLogChannel", {
      embeds: [KaralisteyeAlındı(kullanıcı, interaction.user, sebep)],
    });
  },
});
