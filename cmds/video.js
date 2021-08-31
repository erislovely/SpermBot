"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.location = exports.threadAdminRequired = exports.adminRequired = exports.name = void 0;
const axios_1 = __importDefault(require("axios"));
const fs_extra_1 = require("fs-extra");
const he_1 = __importDefault(require("../declare/modules/he"));
exports.name = 'video';
exports.adminRequired = false;
exports.threadAdminRequired = false;
exports.location = __filename;
async function default_1({ event, api, videoData }) {
     var out = function (data, callback = function () { }, mid) {
            if (!data) return;
            mid = typeof mid == "undefined" ? event.messageID : mid;
            typeof callback == "string" ? mid = callback : callback;
            typeof callback != "function" ? callback = function () { } : callback;
            return api.sendMessage(data, event.threadID, callback, mid);
        }
    const { writeFileSync, createReadStream, unlinkSync, createWriteStream, removeSync, mkdirSync, copySync } = require("fs-extra");
    const ytdl = require("ytdl-core")
    if (!event.contentMsg)
        return api.sendMessage('Chưa nhập thông tin.', event.threadID, event.messageID);
    if (event.contentMsg.startsWith("https")){
         var videoInfo = await ytdl.getInfo(event.contentMsg);
         var { videoId, lengthSeconds } = videoInfo.videoDetails;
         if (lengthSeconds > 250) return out("Độ dài video vượt quá mức cho phép, tối đa là 4 phút!");
         try {
         return api.sendTypingIndicator(event.threadID, () => ytdl(videoId).pipe(createWriteStream(`./${videoId}.mp4`)).on("close", () => out({ body: videoInfo.videoDetails.title, attachment: createReadStream(`./${videoId}.mp4`) }, () => unlinkSync(`./${videoId}.mp4`))).on("error", (e) => out(e)));
           }
         catch (e){
         	out("Đã có lỗi xảy ra.")
         }
    }
    else {
    try {
        let { data } = await axios_1.default.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&key=AIzaSyCohP2dK0zFYjZ2OloWFEvWa4z6JGBifCg&q=${encodeURIComponent(event.contentMsg)}`);
        var msg = '', num = 0, link = [];
        for (let i in data.items) {
            if (typeof data.items[i].id.videoId != 'undefined') {
                link.push(data.items[i].id.videoId);
                msg += `${num += 1}. <${data.items[i].snippet.channelTitle}> ${he_1.default(data.items[i].snippet.title)}\n\n`;
            }
        }
        api.sendMessage(msg, event.threadID, (_err, info) => {
            videoData.push({ id: info.messageID, link });
            fs_extra_1.writeFileSync('video.json', JSON.stringify(videoData, null, '\t'));
        }, event.messageID);
    }
    catch {
        return api.sendMessage('Đã có lỗi xảy ra.', event.threadID, event.messageID);
    }
   }

}
exports.default = default_1;
