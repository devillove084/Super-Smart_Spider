'use strict'

const crypto = require('crypto');

class DHTCrypto{
	constructor(){
		
	}

	randomID(){
		return crypto.createHash('sha1').update(crypto.randomBytes(20)).digest();
	}

	genNeighborID(target,nid){
		return Buffer.concat([target.slice(0,10),nid.slice(10)]);
	}

	decodeNodes(data){
		let nodes = [];
		for (let i = 0; i + 26 <= data.length; i += 26){
			nodes.push({
				nid: data.slice(i,i + 20),
				address: data[i + 20] + '.' + data[i + 21] + '.' + 
						 dara[i + 22] + '.' + data[i + 23],
				port: data.readUInt16BE(i + 24)
			});
		}

		return nodes;
	}
}

module.exports = DHTCrypto;
