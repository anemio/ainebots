/*
* Thanks For 𝗠𝗵𝗮𝗻𝗸𝗕𝗮𝗿𝗕𝗮𝗿
*/

const
{
   WAConnection,
   MessageType,
   Presence,
   MessageOptions,
   Mimetype,
   WALocationMessage,
   WA_MESSAGE_STUB_TYPES,
   ReconnectMode,
   ProxyAgent,
   GroupSettingChange,
   waChatKey,
   mentionedJid,
   processTime,
} = require("@adiwajshing/baileys")
const qrcode = require("qrcode-terminal") //ANAK ASU
const moment = require("moment-timezone") //TOBAT SU
const fs = require("fs") //SU
const { color, bgcolor } = require('./AINE/color')
const { help } = require('./AINE/help')
const kagApi = require('@kagchi/kag-api')
const { donasi } = require('./AINE/donasi')
const { fetchJson } = require('./AINE/fetcher')
const { recognize } = require('./AINE/ocr')
const { wait, simih, getBuffer, h2k, generateMessageID, getGroupAdmins, getRandom, banner, start, info, success, close } = require('./AINE/functions')
const tiktod = require('tiktok-scraper')
const ffmpeg = require('fluent-ffmpeg')
const { removeBackgroundFromImageFile } = require('remove.bg')
const welkom = JSON.parse(fs.readFileSync('./AINE/welkom.json'))
const nsfw = JSON.parse(fs.readFileSync('./AINE/nsfw.json'))
const samih = JSON.parse(fs.readFileSync('./AINE/simi.json'))
const vcard = 'BEGIN:VCARD\n' // ANAK ANJING MAU NGAPAIN?
            + 'VERSION:3.0\n' // NGAPAIN LAGI KALO GA MAU NUMPANG NAMA DOANG XIXIXIXI
            + 'FN:Owner AINEBOT\n' // MENDING LU TOBAT SU!
            + 'ORG:Creator AINEBOT;\n' // KASIH CREDITS GUA SU!!!
            + 'TEL;type=CELL;type=VOICE;waid=62895330379186:+62 895-3303-79186\n' // JANGAN KEK BABI SU
            + 'END:VCARD' // AINE
prefix = '!'
const speed = require('performance-now')         
blocked = []            
const time = moment().tz('Asia/Jakarta').format("HH:mm:ss")
const arrayBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

const bulan = arrayBulan[moment().format('MM') - 1]

const config = {
    AINE: '🤖AINEBOT🤖', // TOBAT SU ASU
    instagram: 'https://instagram.com/anemio999', // INFO JANGAN DI UBAH
    nomer: 'wa.me/62895330379186', // INFO SU JNGAN DI UBAH
    youtube: 'https://www.youtube.com/channel/UCCOUPwMDA19sekkYzkdmu6w', // KINTIL
    whatsapp: 'https://chat.whatsapp.com/EYGeuRbVFkfI8JrH3cNrGV', // BABI
    tanggal: `TANGGAL: ${moment().format('DD')} ${bulan} ${moment().format('YYYY')}`,
    waktu: time
}

function kyun(seconds){
  function pad(s){
    return (s < 10 ? '0' : '') + s;
  }
  var hours = Math.floor(seconds / (60*60));
  var minutes = Math.floor(seconds % (60*60) / 60);
  var seconds = Math.floor(seconds % 60);

  //return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds)
  return `${pad(hours)} Jam ${pad(minutes)} Menit ${pad(seconds)} Detik`
}


const { tanggal, waktu, instagram, whatsapp, youtube, nomer, ontime } = config



const { exec } = require("child_process")

const client = new WAConnection()

client.on('qr', qr => {
   qrcode.generate(qr, { small: true })
   console.log(`[ ${time} ] QR code is ready now..`)
})

client.on('credentials-updated', () => {
   const authInfo = client.base64EncodedAuthInfo()
   console.log(`credentials updated!`)

   fs.writeFileSync('./session.json', JSON.stringify(authInfo, null, '\t'))
})

fs.existsSync('./session.json') && client.loadAuthInfo('./session.json')

client.connect();

// client.on('user-presence-update', json => console.log(json.id + ' presence is => ' + json.type)) || console.log(`${time}: Bot by ig:@anemio999`)

client.on('group-participants-update', async (anu) => {
		if (!welkom.includes(anu.jid)) return
		try {
			const mdata = await client.groupMetadata(anu.jid)
			console.log(anu)
			if (anu.action == 'add') {
				num = anu.participants[0]
				try {
					ppimg = await client.getProfilePicture(`${anu.participants[0].split('@')[0]}@c.us`)
				} catch {
					ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
				}
				teks = `*Hallo @${num.split('@')[0]}\n*Selamat datang di group* _*${mdata.subject}*_ `
				let buff = await getBuffer(ppimg)
				client.sendMessage(mdata.id, buff, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
			} else if (anu.action == 'remove') {
				num = anu.participants[0]
				try {
					ppimg = await client.getProfilePicture(`${num.split('@')[0]}@c.us`)
				} catch {
					ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
				}
				teks = `*Titip salam yah* @${num.split('@')[0]}\n *I will miss you* 🤭`
				let buff = await getBuffer(ppimg)
				client.sendMessage(mdata.id, buff, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
			}
		} catch (e) {
			console.log('Error : %s', color(e, 'red'))
		}
	})
	client.on('CB:Blocklist', json => {
		if (blocked.length > 2) return
	    for (let i of json[1].blocklist) {
	    	blocked.push(i.replace('c.us','s.whatsapp.net'))
	    }
	})

	client.on('message-new', async (mek) => {
		try {
			if (!mek.message) return
			if (mek.key && mek.key.remoteJid == 'status@broadcast') return
			if (mek.key.fromMe) return
			global.prefix
			global.blocked
			const content = JSON.stringify(mek.message)
			const from = mek.key.remoteJid
			const type = Object.keys(mek.message)[0]
			
			const { text, extendedText, contact, location, liveLocation, image, video, stiker, document, audio, product } = MessageType
			const time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')
			body = (type === 'conversation' && mek.message.conversation.startsWith(prefix)) ? mek.message.conversation : (type == 'imageMessage') && mek.message.imageMessage.caption.startsWith(prefix) ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption.startsWith(prefix) ? mek.message.videoMessage.caption : (type == 'extendedTextMessage') && mek.message.extendedTextMessage.text.startsWith(prefix) ? mek.message.extendedTextMessage.text : ''
			budy = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : ''
			const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
			const args = body.trim().split(/ +/).slice(1)
			const isCmd = body.startsWith(prefix)

			mess = {
				wait: '*(❕)* *WAIT PROSES KAK*',
				success: '️*( ✅ )* *SUCCESS KAK*😅',
				error: {
					stick: '*YEAH GAGAL* :( , *COBA LAGI YAH KAK*  ><',
					Iv: '*MAAF LINK TIDAK VALID*☹️'
				},
				only: {
					group: '*Maaf perintah ini hanya bisa di gunakan dalam group*',
					ownerG: '*Maaf perintah ini hanya bisa di gunakan oleh owner group*',
					ownerB: '*Maaf perintah ini hanya bisa di gunakan oleh owner bot*',
					admin: '*Maaf perintah ini hanya bisa di gunakan oleh admin group*',
					Badmin: '*Maaf perintah ini hanya bisa di gunakan jika bot menjadi admin*'
				}
			}

			const botNumber = client.user.jid
			const ownerNumber = ["62895330379186@s.whatsapp.net"] // ganti nomer lu
			const isGroup = from.endsWith('@g.us')
			const sender = isGroup ? mek.participant : mek.key.remoteJid
			const groupMetadata = isGroup ? await client.groupMetadata(from) : ''
			const groupName = isGroup ? groupMetadata.subject : ''
			const groupId = isGroup ? groupMetadata.jid : ''
			const groupMembers = isGroup ? groupMetadata.participants : ''
			const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
			const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
			const isGroupAdmins = groupAdmins.includes(sender) || false
			const isWelkom = isGroup ? welkom.includes(from) : false
			const isNsfw = isGroup ? nsfw.includes(from) : false
			const isSimi = isGroup ? samih.includes(from) : false
			const isOwner = ownerNumber.includes(sender)
			const isUrl = (url) => {
			    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
			}
			const reply = (teks) => {
				client.sendMessage(from, teks, text, {quoted:mek})
			}
			const sendMess = (hehe, teks) => {
				client.sendMessage(hehe, teks, text)
			}
			const mentions = (teks, memberr, id) => {
				(id == null || id == undefined || id == false) ? client.sendMessage(from, teks.trim(), extendedText, {contextInfo: {"mentionedJid": memberr}}) : client.sendMessage(from, teks.trim(), extendedText, {quoted: mek, contextInfo: {"mentionedJid": memberr}})
			}

			colors = ['red','white','black','blue','yellow','green']
			const isMedia = (type === 'imageMessage' || type === 'videoMessage')
			const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
			const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
			const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
			if (!isGroup && isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
			if (!isGroup && !isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
			if (isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))
			if (!isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))
			switch(command) {
				case 'help': 
				case 'menu':
					client.sendMessage(from, help(prefix), text)
					break				
					case 'info':
					me = client.user
					uptime = process.uptime()
					teks = `➽*Nama bot* : ${me.name}\n➽*Nomor bot*: @${me.jid.split('@')[0]}\n➽*Prefix* : ${prefix}\n➽*Total block* : ${blocked.length}\n➽*Aktif sejak* : ${kyun(uptime)}\n➽*Instagram* : https://www.instagram.com/anemio999\n➽*Youtube* : https://www.youtube.com/channel/UCCOUPwMDA19sekkYzkdmu6w\n➽*Script By* : *Muhammad Ridwan Reynaldy*\n➽*Special Thanks To:*\n➽*Allah SWT*\n➽*Mhankbarbar*\n➽*Seluruh creator bot*\n➽*Seluruh pemilik web penyedia layanan APIKEY*`
					buffer = await getBuffer(me.imgUrl)
					client.sendMessage(from, buffer, image, {caption: teks, contextInfo:{mentionedJid: [me.jid]}})
					break
				case 'blocklist':
					teks = 'This is list of blocked number :\n'
					for (let block of blocked) {
						teks += `~> @${block.split('@')[0]}\n`
					}
					teks += `Total : ${blocked.length}`
					client.sendMessage(from, teks.trim(), extendedText, {quoted: mek, contextInfo: {"mentionedJid": blocked}})
					break
				case 'ocr':
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						reply(mess.wait)
						await recognize(media, {lang: 'eng+ind', oem: 1, psm: 3})
							.then(teks => {
								reply(teks.trim())
								fs.unlinkSync(media)
							})
							.catch(err => {
								reply(err.message)
								fs.unlinkSync(media)
							})
					} else {
						reply('Foto aja kak')
					}
					break				
					case 'ytmp3':
				if (args.length < 1) return reply('link YouTube nya mana kak?')
					tels = body.slice(7)				
					reply(mess.wait)
					anu = await fetchJson(`https://tobz-api.herokuapp.com/api/yta?url=${tels}`, {method: 'get'})
					buffer = await getBuffer(anu.thumb)
					hasil = `Judul ➼* ${anu.title}\n*Filesize ➼* ${anu.filesize}\n*Tipe ➼* ${anu.ext}\n*Link ➼* ${anu.result}`					
					client.sendMessage(from, buffer, image, {quoted: mek, caption: hasil})
					break				
					case 'ytmp4':
				if (args.length < 1) return reply('link YouTube nya mana kak?')
					tels = body.slice(7)				
					reply(mess.wait)
					buffer = await getBuffer(anu.thumb)
					anu = await fetchJson(`https://tobz-api.herokuapp.com/api/ytv?url=${tels}`, {method: 'get'})
					hasil = `Judul ➼* ${anu.title}\n*Filesize ➼* ${anu.filesize}\n*resolution ➼* ${anu.resolution}\n*Tipe ➼* ${anu.ext}\n*Link ➼* ${anu.result}`					
					client.sendMessage(from, buffer, image,  {quoted: mek, caption: hasil})
					break							
				case 'logowolf':
					var gh = body.slice(11)
					var teks1 = gh.split("|")[0];
					var teks2 = gh.split("|")[1];
					if (args.length < 1) return reply(`teksnya mana? contoh ${prefix}logowolf Aine|Cool`)
					reply(mess.wait)
					anu = await fetchJson(`https://tobz-api.herokuapp.com/api/textpro?theme=wolflogo1&text1=${teks1}&text2=${teks2}`, {method: 'get'})
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, image, {quoted: mek})
					break
				case 'logolion':
					var gh = body.slice(11)
					var teks1 = gh.split("|")[0];
					var teks2 = gh.split("|")[1];
					if (args.length < 1) return reply(`teksnya mana? contoh ${prefix}logowolf Aine|Cool`)
					reply(mess.wait)
					anu = await fetchJson(`https://tobz-api.herokuapp.com/api/textpro?theme=lionlogo&text1=${teks1}`, {method: 'get'})
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, image, {quoted: mek})
					break
				case 'logojoker':
					var gh = body.slice(11)
					var teks1 = gh.split("|")[0];
					var teks2 = gh.split("|")[1];
					if (args.length < 1) return reply(`teksnya mana? contoh ${prefix}logowolf Aine|Cool`)
					reply(mess.wait)
					anu = await fetchJson(`https://tobz-api.herokuapp.com/api/textpro?theme=jokerlogo&text1=${teks1}&text2=${teks2}`, {method: 'get'})
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, image, {quoted: mek})
					break
				case 'logoglitch':
					var gh = body.slice(11)
					var teks1 = gh.split("|")[0];
					var teks2 = gh.split("|")[1];
					if (args.length < 1) return reply(`teksnya mana? contoh ${prefix}logowolf Aine|Cool`)
					reply(mess.wait)
					anu = await fetchJson(`https://tobz-api.herokuapp.com/api/textpro?theme=glitch&text1=${teks1}&text2=${teks2}`, {method: 'get'})
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, image, {quoted: mek})
					break
					case 'setpp': 
                        if (!isGroup) return reply(mess.only.group)
                       if (!isGroupAdmins) return reply(mess.only.admin)
                        if (!isBotGroupAdmins) return reply(mess.only.Badmin)
                       media = await client.downloadAndSaveMediaMessage(mek)
                         await client.updateProfilePicture (from, media)
                        reply('*ICON GROUP BERASIL DI UBAH* ')
                                        break											
				case 'qrcode':
					const tex = encodeURIComponent(body.slice(8))
					if (!tex) return client.sendMessage(from, 'masukan teks/url!', text, {quoted: mek})
					const buff = await getBuffer(`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${tex}`)
					client.sendMessage(from, buff, image, {quoted: mek})
					break
				case 'map':
					if (args.length < 1) return reply('*Lokasi yang mau di cari dimana kak?*')
					tels = body.slice(5)
					reply(mess.wait)
					anu = await fetchJson(`https://mnazria.herokuapp.com/api/maps?search=${tels}`, {method: 'get'})
					buffer = await getBuffer(anu.gambar)
					client.sendMessage(from, buffer, image, {quoted: mek})
					break
           case 'demote':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('*Tag target yang mau di turunkan admin!*')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = ''
						for (let _ of mentioned) {
							teks += `*Perintah diterima, Menurunkan jadi admin group* :\n`
							teks += `@_.split('@')[0]`
						}
						mentions(teks, mentioned, true)
						client.groupDemoteAdmin(from, mentioned)
					} else {
						mentions(`*Perintah diterima, Menurunkan* @${mentioned[0].split('@')[0]}\n *Jadi admin group* _*${groupMetadata.subject}*_`, mentioned, true)
						client.groupDemoteAdmin(from, mentioned)
					}
					break
				case 'promote':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('*Tag target yang mau di jadikan admin!*')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = ''
						for (let _ of mentioned) {
							teks += `*Perintah diterima, Menambahkan jadi admin group*:\n`
							teks += `@_.split('@')[0]`
						}
						mentions(teks, mentioned, true)
						client.groupMakeAdmin(from, mentioned)
					} else {
						mentions(`Perintah diterima, Menambahkan @${mentioned[0].split('@')[0]}\n *Jadi admin group* _*${groupMetadata.subject}*_ `, mentioned, true)
						client.groupMakeAdmin(from, mentioned)
					}
					break	
			    case 'waifu':
					gatauda = body.slice(7)
					reply(mess.wait)
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/nekonime`, {method: 'get'})
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, image,{quoted: mek})
					break
				case 'loli':
					gatauda = body.slice(6)
					reply(mess.wait)
					anu = await fetchJson(`https://tobz-api.herokuapp.com/api/randomloli`, {method: 'get'})
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, image,{quoted: mek})
					break
				case 'spamsms':
					if (args.length < 1) return reply('*Nomor Target*')
					tels = body.slice(9)
					reply(mess.wait)
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/spamsms?no=${tels}&jum=10`, {method: 'get'})
					reply(anu.logs)
					break	
				case 'spamgmail':
					if (args.length < 1) return reply('*Gmail Target*')
					tels = body.slice(11)
					reply(mess.wait)
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/spamgmail?target=${tels}&jum=10`, {method: 'get'})
					reply(anu.logs)
					break	
				case 'spamcall':
					if (args.length < 1) return reply('*Nomor target*')
					tels = body.slice(10)
					reply(mess.wait)
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/spamcall?no=${tels}`, {method: 'get'})
					reply(anu.logs)
					break			
				case 'randomanime':
					gatauda = body.slice(13)
					reply(mess.wait)
					anu = await fetchJson(`https://tobz-api.herokuapp.com/api/randomanime`, {method: 'get'})
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, image, {quoted: mek})
					break						
				
				case 'neko':
					gatauda = body.slice(6)
					reply(mess.wait)
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/nekonime`, {method: 'get'})
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, image, {quoted: mek})
					break				 						
				case 'nama':
					tels = body.slice(6)					
					anu = await fetchJson(`https://mnazria.herokuapp.com/api/arti?nama=${tels}`, {method: 'get'})
					reply(anu.result)
					break
				case 'shortlink':
					tels = body.slice(11)					
					anu = await fetchJson(`https://tobz-api.herokuapp.com/api/shorturl?url=${tels}`, {method: 'get'})
					reply(anu.result)
					break									
				case 'tagme':
					var nom = mek.participant
					const tag = {
					text: `@${nom.split("@s.whatsapp.net")[0]} *Tuh udah aku tag!*`,
					contextInfo: { mentionedJid: [nom] }
					}
					client.sendMessage(from, tag, text, {quoted: mek})
					break					
               case 'adminbot':
              case 'owner':
                case 'creator':
                  client.sendMessage(from, {displayname: "Jeff", vcard: vcard}, MessageType.contact, { quoted: mek})
               client.sendMessage(from, '*Nih nomor developer ku kak, Jika mau masukan aku ke group kalian chat dia yah kak :)*',MessageType.text, { quoted: mek} )
                break  
            
				case 'nsfw':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (args.length < 1) return reply('*Ketik 1 untuk mengaktifkan*')
					if (Number(args[0]) === 1) {
						if (isNsfw) return reply('*Fitur sudah aktif*')
						nsfw.push(from)
						fs.writeFileSync('./src/nsfw.json', JSON.stringify(nsfw))
						reply('*(SUCCSES)* *Mengaktifkan fitur nsfw pada group ini*')
					} else if (Number(args[0]) === 0) {
						nsfw.splice(from, 1)
						fs.writeFileSync('./src/nsfw.json', JSON.stringify(nsfw))
						reply('*(SUCCSES)* *Menonaktifkan fitur nsfw pada group ini*')
					} else {
						reply('*Ketik 1 untuk mengaktifkan, 0 untuk menonaktifkan fitur*')
					}
					break	
					case 'nsfwloli': 
				    try {
						if (!isNsfw) return reply('*Maaf fitur ini belum di aktifkan*')
						res = await fetchJson(`https://api.lolis.life/random?nsfw=true`, {method: 'get'})
						buffer = await getBuffer(res.url)
						client.sendMessage(from, buffer, image, {quoted: mek, caption: 'Jangan jadiin bahan buat comli om'})
					} catch (e) {
						console.log(`Error :`, color(e,'red'))
						reply('*ERROR*')
					}
					break
					case 'donasi':
				case 'donate':
					client.sendMessage(from, donasi(prefix), text)
					break				
              
                case 'jago':
              case 'abangjago':
              case 'abgjago':
                    let eerrr = fs.readFileSync('./AINE/abangjago.mp3')
                    client.sendMessage(from, eerrr, MessageType.audio, { ptt: true, quoted: mek })
                    break    
                
				case 'bucin':
					gatauda = body.slice(7)					
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/howbucins`, {method: 'get'})
					reply(anu.desc)
					break	
				case 'quotes':
					gatauda = body.slice(8)					
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/randomquotes`, {method: 'get'})
					reply(anu.quotes)
					break		
				case 'chord':
					if (args.length < 1) return reply('*Judul lagu kak*')
					tels = body.slice(7)					
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/chord?q=${tels}`, {method: 'get'})
					reply(anu.result)
					break						 
				case 'wiki':
					if (args.length < 1) return reply('*Masukkan kata kunci*')
					tels = body.slice(6)					
					anu = await fetchJson(`https://tobz-api.herokuapp.com/api/wiki?q=${tels}`, {method: 'get'})
					reply(anu.result)
					break	
				case 'wikien':
					if (args.length < 1) return reply('*Masukkan kata kunci')
					tels = body.slice(8)					
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/wikien?q=${tels}`, {method: 'get'})
					reply(anu.result)
					break				
				case 'blocklist': 
					teks = '*BLOCK LIST* :\n'
					for (let block of blocked) {
						teks += `┣➢ @${block.split('@')[0]}\n`
					}
					teks += `*TOTAL* : ${blocked.length}`
					client.sendMessage(from, teks.trim(), extendedText, {quoted: mek, contextInfo: {"mentionedJid": blocked}})
					break
				case 'ocr': 
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						reply(mess.wait)
						await recognize(media, {lang: 'eng+ind', oem: 1, psm: 3})
							.then(teks => {
								reply(teks.trim())
								fs.unlinkSync(media)
							})
							.catch(err => {
								reply(err.message)
								fs.unlinkSync(media)
							})
					} else {
						reply(`*Kirim foto atau tag foto yang sudah terikirim* ${prefix}𝗼𝗰𝗿`)
					}
					break
					case 'tstiker':
				case 'tsticker':
					if (args.length < 1) return reply('Textnya mana kak?')
					ranp = getRandom('.png')
					rano = getRandom('.webp')
					teks = body.slice(9).trim()
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/text2image?text=${teks}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					exec(`wget ${anu.result} -O ${ranp} && ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${rano}`, (err) => {
						fs.unlinkSync(ranp)
						if (err) return reply(mess.error.stick)
						buffer = fs.readFileSync(rano)
						client.sendMessage(from, buffer, sticker, {quoted: mek})
						fs.unlinkSync(rano)
					})
					break
				case 'stiker': 
				case 'sticker':
				case 's':
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						await ffmpeg(`./${media}`)
							.input(media)
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								reply(mess.error.stick)
							})
							.on('end', function () {
								console.log('Finish')
								buff = fs.readFileSync(ran)
								client.sendMessage(from, buff, sticker, {quoted: mek})
								fs.unlinkSync(media)
								fs.unlinkSync(ran)
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)
					} else if ((isMedia && mek.message.videoMessage.seconds < 11 || isQuotedVideo && mek.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 11) && args.length == 0) {
						const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						reply(mess.wait)
						await ffmpeg(`./${media}`)
							.inputFormat(media.split('.')[1])
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								tipe = media.endsWith('.mp4') ? 'video' : 'gif'
								reply(`*YEAH GAGAL* :(, *ULANGI LAGI IYA KAK* ^_^`)
							})
							.on('end', function () {
								console.log('Finish')
								buff = fs.readFileSync(ran)
								client.sendMessage(from, buff, sticker, {quoted: mek})
								fs.unlinkSync(media)
								fs.unlinkSync(ran)
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)
					} else if ((isMedia || isQuotedImage) && args[0] == 'nobg') {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ranw = getRandom('.webp')
						ranp = getRandom('.png')
						reply(mess.wait)
						keyrmbg = 'Your-ApiKey'
						await removeBackgroundFromImageFile({path: media, apiKey: keyrmbg.result, size: 'auto', type: 'auto', ranp}).then(res => {
							fs.unlinkSync(media)
							let buffer = Buffer.from(res.base64img, 'base64')
							fs.writeFileSync(ranp, buffer, (err) => {
								if (err) return reply('*YEAH GAGAL* :(, *ULANGI LAGI IYA KAK* ^_^')
							})
							exec(`ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${ranw}`, (err) => {
								fs.unlinkSync(ranp)
								if (err) return reply(mess.error.stick)
								buff = fs.readFileSync(ranw)
								client.sendMessage(from, buff, sticker, {quoted: mek})
							})
						})					
					} else {
						reply(`*Kirim gambar dengan caption* ${prefix}*Sticker atau reply/tag gambar*`)
					}
					break
				
				case 'gtts':	
				case 'tts':
					if (args.length < 1) return client.sendMessage(from, '*Diperlukan kode bahasa setan!*', text, {quoted: mek})
					const gtts = require('./AINE/gtts')(args[0])
					if (args.length < 2) return client.sendMessage(from, '*Teks yang mau dijadiin suara mana setan? Setan kah?*', text, {quoted: mek})
					dtt = body.slice(9)
					ranm = getRandom('.mp3')
					rano = getRandom('.ogg')
					dtt.length > 300
					? reply('*idih ngelunjak setan, teksnya jangan kepanjangan setan!* 😤')
					: gtts.save(ranm, dtt, function() {
						exec(`ffmpeg -i ${ranm} -ar 48000 -vn -c:a libopus ${rano}`, (err) => {
							fs.unlinkSync(ranm)
							buffer = fs.readFileSync(rano)
							if (err) return reply('*YEAH GAGAL :( , COBA LAGI KAK ><')
							client.sendMessage(from, buffer, audio, {quoted: mek, ptt:true})
							fs.unlinkSync(rano)
						})
					})
					break
				case 'setprefix':
					if (args.length < 1) return
					if (!isOwner) return reply(mess.only.ownerB)
					prefix = args[0]
					reply(`*Prefix berhasil di ubah menjadi* : ${prefix}`)
					break 	
				case 'meme': 
					meme = await kagApi.memes()
					buffer = await getBuffer(`https://imgur.com/${meme.hash}.jpg`)
					client.sendMessage(from, buffer, image, {quoted: mek, caption: '.......'})
					break
				case 'memeindo': 
					memein = await kagApi.memeindo()
					buffer = await getBuffer(`https://imgur.com/${memein.hash}.jpg`)
					client.sendMessage(from, buffer, image, {quoted: mek, caption: '.......'})
					break							
				
				case 'hilih': 
					if (args.length < 1) return reply('*Text kak!*')
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/hilih?teks=${body.slice(7)}`, {method: 'get'})
					reply(anu.result)
					break
				
				case 'ytsearch': 
					if (args.length < 1) return reply('*Yang mau di cari apa setan? Setan kah?*')
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/ytsearch?q=${body.slice(10)}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					teks = '=================\n'
					for (let i of anu.result) {
						teks += `*Title* : ${i.title}\n*Id* : ${i.id}\n*Published* : ${i.publishTime}\n*Duration* : ${i.duration}\n*Views* : ${h2k(i.views)}\n=================\n`
					}
					reply(teks.trim())
					break
					 
				case 'tiktok': 
					if (args.length < 1) return reply('*urlnya mana kak?*')
					if (!isUrl(args[0]) && !args[0].includes('tiktok.com')) return reply(mess.error.Iv)
					reply(mess.wait)
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/tiktok?url=${args[0]}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, video, {quoted: mek})
					break
				case 'tiktokstalk':
					try {
						if (args.length < 1) return client.sendMessage(from, '*Username nya mana kak?* ', text, {quoted: mek})
						let { user, stats } = await tiktod.getUserProfileInfo(args[0])
						reply(mess.wait)
						teks = `*ID* : ${user.id}\n*Username* : ${user.uniqueId}\n*Nickname* : ${user.nickname}\n*Followers* : ${stats.followerCount}\n*Followings* : ${stats.followingCount}\n*Posts* : ${stats.videoCount}\n*Luv* : ${stats.heart}\n`
						buffer = await getBuffer(user.avatarLarger)
						client.sendMessage(from, buffer, image, {quoted: mek, caption: teks})
					} catch (e) {
						console.log(`Error :`, color(e,'red'))
						reply('*Username tidak valid!*')
					}
					break
				case 'nulis': 
				case 'tulis': ini
					if (args.length < 1) return reply('*Aku suruh nulis apa kak? Setan kah?*')
					teks = body.slice(7)
					reply(mess.wait)
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/nulis?text=halo`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					buff = await getBuffer(anu.result)
					client.sendMessage(from, buff, image, {quoted: mek, caption: mess.success})
					break
				
		 	
				
				case 'url2img': 
					tipelist = ['desktop','tablet','mobile']
					if (args.length < 1) return reply('*Pilih tipenya kak?*')
					if (!tipelist.includes(args[0])) return reply('*Tipe apa destop|tablet|mobile*')
					if (args.length < 2) return reply('*Url nya mana kak?*')
					if (!isUrl(args[1])) return reply(mess.error.Iv)
					reply(mess.wait)
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/url2image?tipe=${args[0]}&url=${args[1]}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					buff = await getBuffer(anu.result)
					client.sendMessage(from, buff, image, {quoted: mek})					 
							break
				
                 
                  case 'tagall':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					members_id = []
					teks = (args.length > 1) ? body.slice(8).trim() : ''
					teks += '\n\n'
					for (let mem of groupMembers) {
						teks += `*>* @${mem.jid.split('@')[0]}\n`
						members_id.push(mem.jid)
					}
					mentions(teks, members_id, true)
					break				
				
				case 'clearall':
					if (!isOwner) return reply(mess.only.ownerB)
					anu = await client.chats.all()
					client.setMaxListeners(25)
					for (let _ of anu) {
						client.deleteChat(_.jid)
					}
					reply('*Clear all succses* :)')
					break			       
                 	
                 			                    
				case 'bc': 
					if (!isOwner) return reply(mess.only.ownerB)
					if (args.length < 1) return reply('.......')
					anu = await client.chats.all()
					if (isMedia && !mek.message.videoMessage || isQuotedImage) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						buff = await client.downloadMediaMessage(encmedia)
						for (let _ of anu) {
							client.sendMessage(_.jid, buff, image, {caption: `❮ *PESAN BROADCAST AINEBOT* ❯\n\n${body.slice(4)}`})
						}
						reply('*Succses broadcast*')
					} else {
						for (let _ of anu) {
							sendMess(_.jid, `❮ *PESAN BROADCAST AINEBOT* ❯\n\n${body.slice(4)}`)
						}
						reply('*Succses broadcast*')
					}
					break
			       	case 'setpp': 
                        if (!isGroup) return reply(mess.only.group)
                       if (!isGroupAdmins) return reply(mess.only.admin)
                        if (!isBotGroupAdmins) return reply(mess.only.Badmin)
                       media = await client.downloadAndSaveMediaMessage(mek)
                         await client.updateProfilePicture (from, media)
                        reply('*ICON GROUP BERHASIL DI UBAH :)* ')
                                        break						
				case 'add':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (args.length < 1) return reply('*Mau menambahkan anak pungut kah kak?* :v')
					if (args[0].startsWith('08')) return reply('*Gunakan kode bahasa setan!')
					try {
						num = `${args[0].replace(/ /g, '')}@s.whatsapp.net`
						client.groupAdd(from, [num])
					} catch (e) {
						console.log('Error :', e)
						reply('*Gagal menambahkan target, Mungkin karena di private*')
					}
					break
					case 'grup':
					case 'gc':
					case 'group':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (args[0] === 'buka') {
					    reply(`*Perintah diterima, Berhasil mengubah group semua orang bisa mengirim pesan* :)`)
						client.groupSettingChange(from, GroupSettingChange.messageSend, false)
					} else if (args[0] === 'tutup') {
						reply(`*Perintah diterima, Berhasil mengubah group hanya admin yang bisa mengirim pesan* :)`)
						client.groupSettingChange(from, GroupSettingChange.messageSend, true)
					}
					break
		   		
				
			     	case 'kick':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('*Tag target yang mau dikick!*')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = ''
						for (let _ of mentioned) {
							teks += `*Perintah diterima, Maaf kamu di kick dari group ini* :\n`
							teks += `@_.split('@')[0]`
						}
						mentions(teks, mentioned, true)
						client.groupRemove(from, mentioned)
					} else {
						mentions(`*Perintah diterima, Maaf* @${mentioned[0].split('@')[0]}\n*Kamu di kick dari group* _*${groupMetadata.subject}*_ `, mentioned, true)
						client.groupRemove(from, mentioned)
					}
					break
				case 'listadmin':
					if (!isGroup) return reply(mess.only.group)
					teks = `*List admin group* _*${groupMetadata.subject}*_\n*Total* : _${groupAdmins.length}_\n\n`
					no = 0
					for (let admon of groupAdmins) {
						no += 1
						teks += `┣➥ @${admon.split('@')[0]}\n`
					}
					mentions(teks, groupAdmins, true)
					break
				case 'toimg':
					if (!isQuotedSticker) return reply('*Reply sticker kak*')
					reply(mess.wait)
					encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					media = await client.downloadAndSaveMediaMessage(encmedia)
					ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('*YEAH GAGAL* :( , *COBA LAGI KAK* ><')
						buffer = fs.readFileSync(ran)
						client.sendMessage(from, buffer, image, {quoted: mek, caption: '*Dah jadi setan*'})
						fs.unlinkSync(ran)
					})
					break
		
			 
				case 'simih':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (args.length < 1) return reply('*Ketik 1 untuk mengaktifkan*')
					if (Number(args[0]) === 1) {
						if (isSimi) return reply('*Fitur sudah aktiv*')
						samih.push(from)
						fs.writeFileSync('./src/simi.json', JSON.stringify(samih))
						reply('*(SUCCSES)* *Mengaktifkan fitur simih pada group ini*')
					} else if (Number(args[0]) === 0) {
						samih.splice(from, 1)
						fs.writeFileSync('./src/simi.json', JSON.stringify(samih))
						reply('*(SUCCSES)* *Menonaktifkan fitur simih pada group ini*')
					} else {
						reply('*Ketik 1 untuk mengaktifkan, 0 untuk menonaktifkan fitur*')
					}
					break 
				
				case 'welcome':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (args.length < 1) return reply('*Ketik 1 untuk mengaktifkan')
					if (Number(args[0]) === 1) {
						if (isWelkom) return reply('*Fitur sudah aktiv*')
						welkom.push(from)
						fs.writeFileSync('./src/welkom.json', JSON.stringify(welkom))
						reply('*(SUCCSES)* *Mengaktifkan fitur welcome pada group ini*')
					} else if (Number(args[0]) === 0) {
						welkom.splice(from, 1)
						fs.writeFileSync('./src/welkom.json', JSON.stringify(welkom))
						reply('*(SUCCSES)* *Menonaktifkan fitur welcome pada group ini*')
					} else {
						reply('*Ketik 1 untuk mengaktifkan, 0 untuk menonaktifkan fitur*')
					}
				case 'clone':
					if (!isGroup) return reply(mess.only.group)
					if (!isOwner) return reply(mess.only.ownerB)
					if (args.length < 1) return reply('*Tag target yang mau di clone!*')
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('Tag cvk')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid[0]
					let { jid, id, notify } = groupMembers.find(x => x.jid === mentioned)
					try {
						pp = await client.getProfilePicture(id)
						buffer = await getBuffer(pp)
						client.updateProfilePicture(botNumber, buffer)
						mentions(`*Foto profile bot berhasil di perbarui oleh owner, Menggunakan foto profile* @${id.split('@')[0]}`, [jid], true)
					} catch (e) {
						reply('YEAH GAGAL :( , COBA LAGI KAK ><')
					}
					break
				case 'wait':
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						reply(mess.wait)
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						media = await client.downloadMediaMessage(encmedia)
						await wait(media).then(res => {
							client.sendMessage(from, res.video, video, {quoted: mek, caption: res.teks.trim()})
						}).catch(err => {
							reply(err)
						})
					} else {
						reply('*Kirim foto atau tag foto yang sudah terkirim*')
					}
					break
				default:
			if (isGroup && isSimi && budy != undefined) {
						console.log(budy)
						muehe = await simih(budy)
						console.log(muehe)
						reply(muehe)
					} else {
						console.log(color('[ERROR]','red'), 'Unregistered Command from', color(sender.split('@')[0]))
					}
					}
		} catch (e) {
			console.log('Error : %s', color(e, 'red'))
		}
	})

                     
/*
*Thanks For 𝗠𝗵𝗮𝗻𝗸𝗕𝗮𝗿𝗕𝗮𝗿
*/

 
