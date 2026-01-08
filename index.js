const { Client, GatewayIntentBits, REST, Routes } = require("discord.js");
require("dotenv").config();

const commands = require("./commands");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once("ready", () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands.map(c => c.toJSON()) }
    );
    console.log("✅ Registered 50 slash commands");
  } catch (err) {
    console.error(err);
  }
})();

client.login(process.env.TOKEN);
