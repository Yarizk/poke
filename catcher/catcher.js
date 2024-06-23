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
        this.poke = fs.readFileSync('pokes.txt', 'utf8')
        .toString()
        .replace(/\r\n/g, '\n') 
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
        this.hint = {};

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

            if (message.content.startsWith("Congratulations")) {
                let name = message.content.split(" ").slice(4).join(" ");
                this.client.channels.cache.get("1253691191179083898").send(`${this.count} - ${name} at ${message.channel.id}`);
                this.count++;
            }

            if (command == "pk") message.channel.send(`<@${process.env.POKE_ID}> pk`);
            if (command == "shiny") message.channel.send(`<@${process.env.POKE_ID}> pk --shiny`);
            if (command == "speed") message.channel.send(`<@${process.env.POKE_ID}> pk --speed 31`);
            if (command == "legend") message.channel.send(`<@${process.env.POKE_ID}> pk --legendary`);
            if (command == "duel") message.channel.send(`<@${process.env.POKE_ID}> pk --spdiv 31 --atkiv >25 --defiv > 20 --spdefiv > 20 --hpiv > 20`);
            if (command == "duel2") message.channel.send(`<@${process.env.POKE_ID}> pk --spdiv 31 --spatkiv > 25 --defiv > 20 --spdefiv > 20 --hpiv > 20`);
            if (command == "raids") message.channel.send(`<@${process.env.POKE_ID}> pk --defiv > 25 --spdefiv > 25 --hpiv > 25`);

            if (command == "say") message.channel.send(message.content.split("$say")[1].trim());

            if (this.run) {
                for (let i = 0; i < message.embeds.length; i++) {
                    console.log(message.embeds[i].title);
                    if (this.verificate(message.channel.id, message.author.id)) {
                        console.log("in");
                        if (message.embeds[i].title.includes("A wild pokémon has аppeаred!")) {
                            this.hint[message.channel.id] = { count: 0, responses: [] };

                            message.channel.sendTyping();
                            setTimeout(() => {
                                this.sendHintRequest(message.channel);
                            }, 5000); 
                        }
                        if (message.embeds[i].title.includes("fled")) {
                            this.client.channels.cache.get("1005818166775119994").send(message.embeds[i].title.split("A new")[0]);
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Error in onMessageCreate:", error);
        }
    }

    async sendHintRequest(channel) {
        await channel.send(`<@${process.env.POKE_ID}> hint`);

        const filter = response => response.author.id === process.env.POKE_ID && response.content.startsWith("The wild pokémon is");
        try {
            const collected = await channel.awaitMessages({ filter, max: 1, time: 10000, errors: ['time'] });
            const response = collected.first();
            const channelId = channel.id;

            this.hint[channelId].responses.push(response.content.split("The wild pokémon is")[1].trim().replace(/\\/g, ''));
            // console.log(this.hint[channelId].responses);
            // console.log(this.hint[channelId].count);

            if (this.hint[channelId].count < 2) {
                channel.sendTyping();
                setTimeout(() => {
                    this.sendHintRequest(channel);
                }, 1000); 
                this.hint[channelId].count++;
            } else {
                let combined = Array(this.hint[channelId].responses[0].length).fill('_');

                for (const hint of this.hint[channelId].responses) {
                    for (let i = 0; i < hint.length; i++) {
                        if (hint[i] !== '_' && combined[i] === '_') {
                            combined[i] = hint[i];
                        }
                    }
                }
                // console.log(combined);

                const anon = combined.join('');
                console.log(anon);
                let predict = [];
                let data = this.poke;
                for (let i = 0; i < anon.length - 1; i++) {
                    if (anon.charAt(i) == '_') continue;
                    predict = [];
                    for (let j = 0; j < data.length; j++) {
                        if (data[j].length !== anon.length-1) continue;
                        if (anon.charAt(i).toLowerCase() == data[j].charAt(i).toLowerCase()) {
                            predict.push(data[j]);
                        }
                    }
                    data = predict;
                }
                console.log(predict);
                for (let name in predict) {
                    if (predict.length > 10) {
                        channel.send("Not enough hint");
                        break;
                    }
                    if (predict[name].length == anon.length-1) {
                        channel.sendTyping();
                        setTimeout(() => {
                            channel.send(`<@${process.env.POKE_ID}> catch ${predict[name]}`);
                        }, 1000); 
                    }
                }
            }
        } catch (error) {
            console.error('Error collecting hint response:', error);
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
