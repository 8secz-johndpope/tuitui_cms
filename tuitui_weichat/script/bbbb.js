const mem = require('../util/mem.js');

async function b() {
    let code = process.argv.slice(2)[0]
    let token = await mem.get('access_token_' + code)
    cosole.log(token)
}
b()