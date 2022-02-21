const Discord = require("discord.js");
const intents = new Discord.Intents();
const client = new Discord.Client({ intents: 32767 });

//////////////////////////BOT LISTO/////////////////////////
client.on("ready", () => {
  console.log("Bot Listo")
 
});

//COMANDO HANDLER
const fs = require("fs");
let { readdirSync } = require("fs");

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync("./comandos").filter(file => file.endsWith(".js"))

for (const file of commandFiles){
 const command = require(`./comandos/${file}`);
 client.commands.set(command.name, command);
}
//////Slash///
client.slashcommands = new Discord.Collection();
const slashcommandsFiles = fs.readdirSync("./slashcmd").filter(file => file.endsWith("js"))

for(const file of slashcommandsFiles){
  const slash = require(`./slashcmd/${file}`)
  console.log(`Slash commands - ${file} cargado`)
  client.slashcommands.set(slash.data.name, slash)
}

client.on("interactionCreate", async(interaction) => {
  if(!interaction.isCommand()) return;

  const slashcmds = client.slashcommands.get(interaction.commandName)

  if(!slashcmds) return; 

  try{
    await slashcmds.run(client, interaction)
  } catch(e){
  console.error(e)
}
})
//////
client.on("messageCreate", (message) => {

 let prefix = "p!"

 if(message.author.bot) return;

 if(message.channel.type === "dm") return;

 if(!message.content.startsWith(prefix)) return;


 let usuario = message.mentions.members.first() || message.member;
 const args = message.content.slice(prefix.length).trim().split(/ +/g)
 const command = args.shift().toLowerCase();

  let cmd = client.commands.find((c) => c.name === command || c.alias &&  c.alias.includes (command));

  if(cmd){
    cmd.execute(client, message, args)
  }
  if(!cmd){
    if(message.content === prefix) return;
    const embed = new Discord.MessageEmbed()
    .setTitle("❌ | Comando no encontrado")
    .setDescription(`El comando "${command}" no existe.`)
    .setColor("RED")
    .setTimestamp()

    message.channel.send({ embeds: [embed] })
  }
  
});

client.on("guilMemberAdd", async (member) => {
   if(member.guild.id === "814263202136981514"){
     const Canvas = require("canvas")
     const canvas = Canvas.createCanvas(1018, 468)
     const ctx = canvas.getContext("2d")

     const background = await Canvas.loadImage("https://cdn.discordapp.com/attachments/814280389841256488/935953248844673064/f.jpg")
     ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

     ctx.fillStyle = "#ffffff"
     ctx.font = "100px Arial"

     ctx.fillText("Bienvenido", 460, 260)
     ctx.fillText(`${member.user.username}`, 460, 340)
     
     ctx.beginPath()
     ctx.arc(247, 238, 175, 0, Math.PI * 2, true)
     ctx.closePath()
     ctx.clip()

     const avatar = await Canvas.loadImage(member.user.displayAvatarUrl({ size: 1024, dynamic: true}))
     ctx.drawImage(avatar, 72, 63, 350, 350)

     const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "bienvenida-prueba.png")
     client.channel.cache.get("814280389841256488").send({ files: [attachment] }) 
   }
})

client.login("OTM1ODY0MDQyODY4ODM4NDEw.YfE1Tw.XWGud2_ZNFibtkIolsTgdX-VJeY");
