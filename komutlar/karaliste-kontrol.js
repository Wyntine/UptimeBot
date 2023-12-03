// @ts-check

const { SlashCommandBuilder } = require("discord.js");
const db = require("croxydb");
const { Command } = require("../functions/command");
const { checkAdmin } = require("../functions/general");
const { YetkiYok, KaralistedeVar, KaralistedeYok } = require("../views/embeds");

module.exports = new Command({
  slash: true,
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("karaliste-kontrol")
    .setDescription("Bot sahibi özel komutu.")
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName("kullanıcı")
        .setDescription("Karaliste bilgisine bakılacak kullanıcıyı belirtin.")
        .setRequired(true)
    ),
  async execute(client, interaction) {
    if (!checkAdmin(interaction.user.id))
      return interaction.reply({ embeds: [YetkiYok] });

    const kullanıcı = interaction.options.getUser("kullanıcı", true);
    const Karaliste = db.fetch(`Karaliste_${kullanıcı.id}`);
    return interaction.reply({
      embeds: [(Karaliste ? KaralistedeVar : KaralistedeYok)(kullanıcı)],
    });
  },
});
