// @ts-check

const { SlashCommandBuilder } = require("discord.js");
const db = require("croxydb");
const { Command } = require("../functions/command");
const { checkAdmin, sendLog } = require("../functions/general");
const {
  YetkiYok,
  PremiumAlındı,
  PremiumYok,
  PremiumBitirildi,
} = require("../views/embeds");

module.exports = new Command({
  slash: true,
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("premium-al")
    .setDescription("Bot sahibi özel komutu.")
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName("kullanıcı")
        .setDescription("Premiumu alınacak kullanıcıyı belirtin.")
        .setRequired(true)
    ),
  async execute(client, interaction) {
    if (!checkAdmin(interaction.user.id))
      return interaction.reply({ embeds: [YetkiYok] });

    const kullanıcı = interaction.options.getUser("kullanıcı", true);
    const PremiumÜye = db.fetch(`PremiumÜye_${kullanıcı.id}`);

    if (!PremiumÜye)
      return interaction.reply({ embeds: [PremiumYok(kullanıcı)] });

    db.delete(`PremiumÜye_${kullanıcı.id}`);
    db.subtract(`PremiumSayı`, 1);
    await interaction.reply({ embeds: [PremiumAlındı(kullanıcı)] });
    await sendLog("premiumLogChannel", {
      embeds: [PremiumBitirildi(kullanıcı)],
    });
  },
});
