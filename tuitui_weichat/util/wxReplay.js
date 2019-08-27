const ejs = require('ejs');
const wechatCrypto = require('../util/cryptoUtil.js');

/*!
 * 响应模版
 */
var tpl = ['<xml>',
    '<ToUserName><![CDATA[<%-toUsername%>]]></ToUserName>',
    '<FromUserName><![CDATA[<%-fromUsername%>]]></FromUserName>',
    '<CreateTime><%=createTime%></CreateTime>',
    '<% if (msgType === "device_event" && (Event === "subscribe_status" || Event === "unsubscribe_status")) { %>',
      '<% if (Event === "subscribe_status" || Event === "unsubscribe_status") { %>',
        '<MsgType><![CDATA[device_status]]></MsgType>',
        '<DeviceStatus><%=DeviceStatus%></DeviceStatus>',
      '<% } else { %>',
        '<MsgType><![CDATA[<%=msgType%>]]></MsgType>',
        '<Event><![CDATA[<%-Event%>]]></Event>',
      '<% } %>',
    '<% } else { %>',
      '<MsgType><![CDATA[<%=msgType%>]]></MsgType>',
    '<% } %>',
  '<% if (msgType === "news") { %>',
    '<ArticleCount><%=content.length%></ArticleCount>',
    '<Articles>',
    '<% content.forEach(function(item){ %>',
      '<item>',
        '<Title><![CDATA[<%-item.title%>]]></Title>',
        '<Description><![CDATA[<%-item.description%>]]></Description>',
        '<PicUrl><![CDATA[<%-item.picUrl || item.picurl || item.pic %>]]></PicUrl>',
        '<Url><![CDATA[<%-item.url%>]]></Url>',
      '</item>',
    '<% }); %>',
    '</Articles>',
  '<% } else if (msgType === "music") { %>',
    '<Music>',
      '<Title><![CDATA[<%-content.title%>]]></Title>',
      '<Description><![CDATA[<%-content.description%>]]></Description>',
      '<MusicUrl><![CDATA[<%-content.musicUrl || content.url %>]]></MusicUrl>',
      '<HQMusicUrl><![CDATA[<%-content.hqMusicUrl || content.hqUrl %>]]></HQMusicUrl>',
      '<% if (content.thumbMediaId) { %> ',
      '<ThumbMediaId><![CDATA[<%-content.thumbMediaId || content.mediaId %>]]></ThumbMediaId>',
      '<% } %>',
    '</Music>',
  '<% } else if (msgType === "voice") { %>',
    '<Voice>',
      '<MediaId><![CDATA[<%-content.mediaId%>]]></MediaId>',
    '</Voice>',
  '<% } else if (msgType === "image") { %>',
    '<Image>',
      '<MediaId><![CDATA[<%-content.mediaId%>]]></MediaId>',
    '</Image>',
  '<% } else if (msgType === "video") { %>',
    '<Video>',
      '<MediaId><![CDATA[<%-content.mediaId%>]]></MediaId>',
      '<Title><![CDATA[<%-content.title%>]]></Title>',
      '<Description><![CDATA[<%-content.description%>]]></Description>',
    '</Video>',
  '<% } else if (msgType === "hardware") { %>',
    '<HardWare>',
      '<MessageView><![CDATA[<%-HardWare.MessageView%>]]></MessageView>',
      '<MessageAction><![CDATA[<%-HardWare.MessageAction%>]]></MessageAction>',
    '</HardWare>',
    '<FuncFlag>0</FuncFlag>',
  '<% } else if (msgType === "device_text" || msgType === "device_event") { %>',
    '<DeviceType><![CDATA[<%-DeviceType%>]]></DeviceType>',
    '<DeviceID><![CDATA[<%-DeviceID%>]]></DeviceID>',
    '<% if (msgType === "device_text") { %>',
      '<Content><![CDATA[<%-content%>]]></Content>',
    '<% } else if ((msgType === "device_event" && Event != "subscribe_status" && Event != "unsubscribe_status")) { %>',
      '<Content><![CDATA[<%-content%>]]></Content>',
      '<Event><![CDATA[<%-Event%>]]></Event>',
    '<% } %>',
      '<SessionID><%=SessionID%></SessionID>',
  '<% } else if (msgType === "transfer_customer_service") { %>',
    '<% if (content && content.kfAccount) { %>',
      '<TransInfo>',
        '<KfAccount><![CDATA[<%-content.kfAccount%>]]></KfAccount>',
      '</TransInfo>',
    '<% } %>',
  '<% } else { %>',
    '<Content><![CDATA[<%-content%>]]></Content>',
  '<% } %>',
  '</xml>'].join('');

/*!
 * 编译过后的模版
 */
var compiled = ejs.compile(tpl);

function encryptXml(req,xml) {
    if (!req.query.encrypt_type || req.query.encrypt_type === 'raw') {
        return xml;
    } else {
    let cryptor = new wechatCrypto('mingxingshuo', 'tw4a1yTUv0VJURGNif96ibI4z3oWPJJWpuo2mHTvzLb', 'wx4b715a7b61bfe0a4');
    return cryptor.encrypt(xml)
    }
}

function reply(content, fromUsername, toUsername, message) {
    var info = {};
    var type = 'text';
    info.content = content || '';
    info.createTime = new Date().getTime();
    if (message && (message.MsgType === 'device_text' || message.MsgType === 'device_event')) {
      info.DeviceType = message.DeviceType;
      info.DeviceID = message.DeviceID;
      info.SessionID = isNaN(message.SessionID) ? 0 : message.SessionID;
      info.createTime = Math.floor(info.createTime / 1000);
      if (message['Event'] === 'subscribe_status' || message['Event'] === 'unsubscribe_status') {
        delete info.content;
        info.DeviceStatus = isNaN(content) ? 0 : content;
      } else {
        if (!(content instanceof Buffer)) {
          content = String(content);
        }
        info.content = new Buffer(content).toString('base64');
      }
      type = message.MsgType;
      if (message.MsgType === 'device_event') {
        info['Event'] = message['Event'];
      }
    } else if (Array.isArray(content)) {
      type = 'news';
    } else if (typeof content === 'object') {
      if (content.hasOwnProperty('type')) {
        type = content.type;
        if (content.content) {
          info.content = content.content;
        }
        if (content.HardWare) {
          info.HardWare = content.HardWare;
        }
      } else {
        type = 'music';
      }
    }
    info.msgType = type;
    info.toUsername = toUsername;
    info.fromUsername = fromUsername;
    return compiled(info);
};

function get_reply(req,content,message){
    return encryptXml(req,reply(content,message.ToUserName,message.FromUserName,message));
}

exports.get_reply = get_reply