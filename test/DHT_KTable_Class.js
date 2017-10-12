'use strict'
const dhtcrypto = require('./DHT_Crypto_Class.js');
const dhtc = new dhtcrypto();

class KTable{
	constructor(maxsize){
		this.nid = dhtc.randomID();
		this.nodes = [];
		this.maxsize = maxsize;
	}

	push(node){
		if (this.nodes.length >= this.maxsize){
			return;
		}

		this.nodes.push(node);
	}
}

module.exports = KTable;
