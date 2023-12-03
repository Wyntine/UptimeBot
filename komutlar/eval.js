// @ts-check

const { SlashCommandBuilder } = require("discord.js");
const { Command } = require("../functions/command");
const { checkAdmin } = require("../functions/general");
const { YetkiYok, Token, Eval, EvalHata } = require("../views/embeds");

module.exports = new Command({
  slash: true,
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("eval")
    .setDescription("Bot sahibi özel komutu.")
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("kod")
        .setDescription("Denenecek kodu belirtin.")
        .setRequired(true)
    ),
  async execute(client, interaction) {
    if (!checkAdmin(interaction.user.id))
      return interaction.reply({ embeds: [YetkiYok] });

    const code = interaction.options.getString("kod", true);

    try {
      const evaled = clean(await eval(code));

      if (evaled.includes(client.token))
        return interaction.reply({ embeds: [Token] });

      return interaction.reply({ embeds: [Eval(code, evaled)] });
    } catch (err) {
      return interaction.reply({ embeds: [EvalHata(code, err)] });
    }

    function clean(text) {
      if (typeof text !== "string")
        text = require("util").inspect(text, { depth: 0 });
      return text
        .replace(/`/g, "`" + String.fromCharCode(8203))
        .replace(/@/g, "@" + String.fromCharCode(8203));
    }
  },
});
