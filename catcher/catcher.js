const { Client } = require("discord.js-selfbot-v13");
const fs = require('fs');
const delay = async () => (await import('delay')).default;
const dotenv = require('dotenv');
dotenv.config();

class Catcher {

    constructor(token, channel) {
        this.client = new Client({ checkUpdate: false });
        this.token = token;
        this.count = 0;
        this.run = true;
        this.channel = channel;
        this.data = fs.readFileSync('pokes.txt', 'utf8').toString().split('\n');

        this.client.on('ready', this.onReady.bind(this));
        this.client.on("messageCreate", this.onMessageCreate.bind(this));
    }

    async onReady() {
        try {
            console.log("user ready");
        } catch (error) {
            console.error("Error in onReady:", error);
        }
    }

    async onMessageCreate(message) {
        console.log("as")
        try {
            let prefix = "$";
            const args = message.content.slice(prefix.length).trim().split(/ +/g);
            const command = args.shift().toLowerCase();

            if (command == "stop") {
                this.run = false;
                message.channel.send("stop");
            }

            if (command == "start") {
                this.run = true;
                message.channel.send("start");
            }

            if (this.run) {
                for (let i = 0; i < message.embeds.length; i++) {
                    console.log(message.embeds[i].title);
                    if (this.verificate(message.channel.id, message.author.id)) {
                        console.log("in");
                        if (message.embeds[i].title.includes("A wild pokémon has аppeаred!")) {
                            // await delay(3000);
                            // message.channel.send(`<@!${process.env.POKE_ID}> hint`);
                            setTimeout(() => {
                                message.channel.send(`<@!${process.env.POKE_ID}> hint`);
                            }, 3000);
                        
                        }
                        if (message.embeds[i].title.includes("fled")) {
                            this.client.channels.cache.get("1005818166775119994").send(message.embeds[i].title.split("A new")[0]);
                        }
                    }
                }

                if (this.verificate(message.channel.id, message.author.id)) {
                    if (message.content.startsWith("The wild pokémon is ")) {
                        const anon = message.content.split("is ")[1].split("\\").join("");
                        try {
                            let predict = [];
                            for (let i = 0; i < anon.length - 1; i++) {
                                if (anon.charAt(i) == '_') continue;
                                predict = [];
                                for (let j = 0; j < this.data.length; j++) {
                                    if (anon.charAt(i).toLowerCase() == this.data[j].charAt(i).toLowerCase()) {
                                        predict.push(this.data[j]);
                                    }
                                }
                            }
                            console.log(predict);
                            for (let name in predict) {
                                if (predict[name].length == anon.length) {
                                    message.channel.send(`<@!${process.env.POKE_ID}> catch ${predict[name]}`);
                                    this.client.channels.cache.get("1253691191179083898").send(`${this.count} - ${predict[name]}`);
                                    this.count++;
                                }
                            }
                        } catch (e) { 
                            console.log('Error:', e.stack);
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Error in onMessageCreate:", error);
        }
    }

    verificate(channel, author) {
        return (
           this.channel.includes(channel) &&
            author == process.env.POKE_ID
        );
    }

    async login() {
        try {
            await this.client.login(this.token);
        } catch (error) {
            console.error("Error logging in:", error);
        }
    }
}

module.exports = Catcher;

// Instantiate and use the User class
// const userInstance = new Catcher(token.user.token);
// userInstance.login();
