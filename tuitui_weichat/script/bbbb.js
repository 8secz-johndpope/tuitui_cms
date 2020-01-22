const mem = require('../util/mem.js');

async function b() {
    let code = process.argv.slice(2)[0]
    if(!code){
    	let ticket = mem.get('cms_component_ticket')
    	console.log(ticket)
    }
    let token = await mem.get('access_token_' + code)
    console.log(token)
}
b()