const amqplib = require('amqplib');
var ch;
getChannel();
async function getChannel() {
    console.log('----- getChannel ----')
    try {
        let conn = await amqplib.connect('amqp://localhost')
        ch = await conn.createChannel();
    } catch (e) {
        console.log(e)
    }
}

module.exports.send = async function (msg,q) {
    await ch.assertQueue(q);
    ch.sendToQueue(q, Buffer.from(msg));
    return
}
