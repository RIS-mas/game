# Blox Fruits Discord Service Price Bot

A Discord bot for your server that returns your custom Blox Fruits service/item prices.

## Features

- `!price <service/item>` → returns the configured price.
- `!list` → returns all supported services/items grouped by category.
- `!categories` → returns the category names.
- `!help` → shows command help.
- Uses a JSON data file so you can quickly edit prices.

## Setup

1. Install Node.js 18+.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root:

   ```env
   DISCORD_BOT_TOKEN=your_discord_bot_token_here
   ```

4. Start the bot:

   ```bash
   npm start
   ```

## Update prices

Edit `data/blox-fruit-prices.json`.

Each category and item follows this shape:

```json
{
  "name": "Raids",
  "items": [
    {
      "name": "Normal Raid",
      "price": "2M per",
      "notes": null
    }
  ]
}
```

You can add as many categories/items as you want.
