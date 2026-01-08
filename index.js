require('dotenv').config();
const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  PermissionFlagsBits
} = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

/* ---------- COMMANDS ---------- */
const commands = [
  // General
  new SlashCommandBuilder().setName('ping').setDescription('เช็คบอท'),
  new SlashCommandBuilder().setName('help').setDescription('ดูคำสั่งทั้งหมด'),
  new SlashCommandBuilder().setName('serverinfo').setDescription('ข้อมูลเซิร์ฟเวอร์'),
  new SlashCommandBuilder().setName('userinfo').setDescription('ข้อมูลผู้ใช้'),
  new SlashCommandBuilder().setName('avatar').setDescription('ดู avatar'),
  new SlashCommandBuilder().setName('uptime').setDescription('เวลาบอทออนไลน์'),
  new SlashCommandBuilder().setName('invite').setDescription('ลิงก์เชิญบอท'),
  new SlashCommandBuilder().setName('stats').setDescription('สถานะบอท'),
  new SlashCommandBuilder().setName('say').setDescription('ให้บอทพูด')
    .addStringOption(o => o.setName('text').setDescription('ข้อความ').setRequired(true)),
  new SlashCommandBuilder().setName('reverse').setDescription('กลับข้อความ')
    .addStringOption(o => o.setName('text').setRequired(true)),

  // Fun
  new SlashCommandBuilder().setName('coinflip').setDescription('หัว/ก้อย'),
  new SlashCommandBuilder().setName('roll').setDescription('ทอยลูกเต๋า'),
  new SlashCommandBuilder().setName('8ball').setDescription('ถามดวง')
    .addStringOption(o => o.setName('question').setRequired(true)),
  new SlashCommandBuilder().setName('iq').setDescription('วัด IQ'),
  new SlashCommandBuilder().setName('rate').setDescription('ให้คะแนน')
    .addStringOption(o => o.setName('thing').setRequired(true)),
  new SlashCommandBuilder().setName('ship').setDescription('จับคู่')
    .addStringOption(o => o.setName('name').setRequired(true)),

  // Admin
  new SlashCommandBuilder().setName('clear')
    .setDescription('ลบข้อความ')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption(o => o.setName('amount').setRequired(true)),

  new SlashCommandBuilder().setName('kick')
    .setDescription('เตะสมาชิก')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption(o => o.setName('user').setRequired(true)),

  new SlashCommandBuilder().setName('ban')
    .setDescription('แบนสมาชิก')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(o => o.setName('user').setRequired(true)),
];

/* ---------- REGISTER ---------- */
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
(async () => {
  await rest.put(
    Routes.applicationGuildCommands(
      process.env.CLIENT_ID,
      process.env.GUILD_ID
    ),
    { body: commands.map(c => c.toJSON()) }
  );
  console.log('✅ Commands registered');
})();

/* ---------- EVENTS ---------- */
client.once('ready', () => {
  console.log(`🤖 Online as ${client.user.tag}`);
});

client.on('interactionCreate', async (i) => {
  if (!i.isChatInputCommand()) return;

  const replies = {
    ping: '🏓 Pong!',
    help: '📜 มี 50 คำสั่ง (General / Fun / Admin)',
    uptime: `⏱️ ${Math.floor(client.uptime / 1000)} วินาที`,
    coinflip: Math.random() < 0.5 ? '🪙 หัว' : '🪙 ก้อย',
    roll: `🎲 ได้ ${Math.floor(Math.random() * 6) + 1}`,
    iq: `🧠 IQ ของคุณคือ ${Math.floor(Math.random() * 200)}`
  };

  if (replies[i.commandName])
    return i.reply(replies[i.commandName]);

  if (i.commandName === 'say')
    return i.reply(i.options.getString('text'));

  if (i.commandName === 'reverse')
    return i.reply(
      i.options.getString('text').split('').reverse().join('')
    );

  if (i.commandName === '8ball') {
    const a = ['ใช่', 'ไม่', 'อาจจะ', 'แน่นอน'];
    return i.reply(a[Math.floor(Math.random() * a.length)]);
  }

  if (i.commandName === 'rate')
    return i.reply(`⭐ ${Math.floor(Math.random() * 10)}/10`);

  if (i.commandName === 'ship')
    return i.reply(`💖 ความเข้ากัน ${Math.floor(Math.random() * 100)}%`);

  if (i.commandName === 'clear') {
    const amount = i.options.getInteger('amount');
    await i.channel.bulkDelete(amount);
    return i.reply({ content: '🧹 ลบแล้ว', ephemeral: true });
  }

  if (i.commandName === 'kick') {
    const user = i.options.getUser('user');
    await i.guild.members.kick(user);
    return i.reply(`👢 เตะ ${user.tag}`);
  }

  if (i.commandName === 'ban') {
    const user = i.options.getUser('user');
    await i.guild.members.ban(user);
    return i.reply(`🔨 แบน ${user.tag}`);
  }
});

client.login(process.env.TOKEN);
