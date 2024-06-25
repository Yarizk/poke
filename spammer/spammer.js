const { Client: DiscordClient } = require("discord.js-selfbot-v13"); 
const delay = async () => (await import('delay')).default;

class Spammer{
    constructor(token, channelId, catchId, pokemon = "Unknown", level = "N/A") {
        this.token = token;
        this.channelId = channelId;
        this.catchId = catchId;
        this.client = new DiscordClient({ checkUpdate: false });
        this.running = false;
        this.pokemon = pokemon;
        this.level = level;
        this.server = "Loading...";
        
        this.client.on('ready', this.onReady.bind(this));
        this.client.on("messageCreate", this.onMessageCreate.bind(this));
    }

    async onReady() {
        console.log("Client ready");
        this.start();
    }

    async onMessageCreate(message) {
        try {
            if (message.content.startsWith(",spam") && this.running) {
                this.server = message.guild.name;
                while (this.running) {  
                    await message.channel.send("message");
                    await delay(1000);
                }
            }
        } catch (error) {
            console.error("Error in onMessageCreate:", error);
        }
    }

    stop() {
        this.running = false; 
    }

    start() {
        const channel = this.client.channels.cache.get(this.channelId);
        if (channel) {
            channel.send(",spam");
            this.running = true;
        }
    }

    updatePokemon(pokemon) {
        this.pokemon = pokemon;
    }

    updateLevel(level) {
        this.level = level;
    }

    getStatus() {
        return this.running ? "Running" : "Stopped";
    }

    getDetails() {
        return {
            pokemon: this.pokemon,
            level: this.level,
            status: this.getStatus()
        };
    }
    getServer() {
        return this.server;
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