const { Client: DiscordClient } = require("discord.js-selfbot-v13"); 
const delay = async () => (await import('delay')).default;

class Spammer{
    constructor(token, channelId) {
        this.token = token;
        this.channelId = channelId;
        this.client = new DiscordClient({ checkUpdate: false });
        
        this.client.on('ready', this.onReady.bind(this));
        this.client.on("messageCreate", this.onMessageCreate.bind(this));
    }

    async onReady() {
        try {
            console.log("Client ready");
            const channel = this.client.channels.cache.get(this.channelId);
            if (channel) {
                channel.send(",spam");
            }
        } catch (error) {
            console.error("Error in onReady:", error);
        }
    }

    async onMessageCreate(message) {
        try {
            if (message.content.startsWith(",spam")) {
                while (true) {
                    await message.channel.send("message");
                    await delay(1000);
                }
            }
        } catch (error) {
            console.error("Error in onMessageCreate:", error);
        }
    }

    async login() {
        try {
            await this.client.login(this.token);
        } catch (error) {
            console.error("Error logging in:",this.channelId, error);
        }
    }
}

module.exports = Spammer;