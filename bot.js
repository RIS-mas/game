const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const DATA_PATH = path.join(__dirname, 'data', 'blox-fruit-prices.json');

function loadPriceData() {
  const raw = fs.readFileSync(DATA_PATH, 'utf8');
  const parsed = JSON.parse(raw);

  const items = parsed.categories.flatMap((category) =>
    category.items.map((item) => ({
      ...item,
      category: category.name,
      normalizedName: item.name.toLowerCase()
    }))
  );

  return {
    ...parsed,
    items
  };
}

const data = loadPriceData();

function findItemByName(query) {
  const normalized = query.toLowerCase().trim();
  if (!normalized) {
    return null;
  }

  const exactMatch = data.items.find((item) => item.normalizedName === normalized);
  if (exactMatch) {
    return exactMatch;
  }

  return data.items.find((item) => item.normalizedName.includes(normalized));
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) {
    return;
  }

  const content = message.content.trim();

  if (content === '!help') {
    await message.reply([
      '📌 **Blox Fruits Service Price Bot Commands**',
      '`!price <service/item name>` - Show the requested price.',
      '`!list` - Show all supported services/items.',
      '`!categories` - Show available categories.',
      '`!help` - Show this help message.'
    ].join('\n'));
    return;
  }

  if (content === '!categories') {
    const categories = data.categories.map((category) => category.name);
    await message.reply(`🗂️ Categories: ${categories.join(', ')}`);
    return;
  }

  if (content === '!list') {
    const listByCategory = data.categories
      .map((category) => `**${category.name}**: ${category.items.map((item) => item.name).join(', ')}`)
      .join('\n');

    await message.reply(`📦 **Available services/items**\n${listByCategory}`);
    return;
  }

  if (!content.startsWith('!price ')) {
    return;
  }

  const itemName = content.slice('!price '.length);
  const item = findItemByName(itemName);

  if (!item) {
    await message.reply(`❌ I could not find **${itemName}**. Use \`!list\` to see supported entries.`);
    return;
  }

  await message.reply([
    `💰 **${item.name}**`,
    `Category: ${item.category}`,
    `Price: ${item.price}`,
    item.notes ? `Notes: ${item.notes}` : null
  ].filter(Boolean).join('\n'));
});

if (!process.env.DISCORD_BOT_TOKEN) {
  console.error('❌ Missing DISCORD_BOT_TOKEN in your .env file.');
  process.exit(1);
}

client.login(process.env.DISCORD_BOT_TOKEN);
