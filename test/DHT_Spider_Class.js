'use strict'

const dgram = require('dgram');
const bencode = require('bencode');
const KTable = require('./DHT_KTable_Class.js');
const dhtcrypto = require('./DHT_Crypto_Class.js');
const dhtc = new dhtcrypto();


const BOOTSTRAP_NODES = [
	['router.bittorrent.com', 6881],
	['dht.transmissionbt.com', 6881]
];
const TID_LENGTH = 4;
const NODES_MAX_SIZE = 200;
const TOKEN_LENGTH = 2;


class DHTSpider{
	constructor(options){
		this.address = options.address;
		this.port = options.port;
		this.udp = dgram.createSocket('udp4');
		this.ktable = new KTable(NODES_MAX_SIZE);
	}
	
	sendKRPC(msg,rinfo){
		let buf = bencode.encode(msg);
		this.udp.send(buf, 0, buf.length, rinfo.port, rinfo.address);
	}

	onFindNoteResponse(nodes){
		let dnodes = dhtc.decodeNotes(nodes);
		dnodes.forEach(function(node){
			if (node.address != this.address && node.nid != this.ktable.nid && node.port < 65536 && node.port > 0){
				this.ktable.push(node);
			}
		}.bind(this));
	}

	sendFindNodeRequest(rinfo,nid){
		let _nid = nid != undefined ? dhtc.genNeighborID(nid,this.ktable.nid) : this.ktable.nid;
		let msg = {
			t: dhtc.randomID().slice(0,TID_LENGTH),
			y: 'q',
			q: 'find_node',
			a: {
				id: _nid,
				target: dhtc.randomID()
			}
		};
		this.sendKRPC(msg, rinfo);
	}

	joinDHTNetwork(){
		BOOTSTRAP_NODES.forEach(function(node){
			this.sendFindNodeRequest({
				address: node[0],
				port: node[1]
			}, node.nid);

		}.bind(this));

		this.ktable.nodes = [];
	}

	makeNeighbor(){
		this.ktable.nodes.forEach(function(node){
			this.sendFindNodeRequest({
				address: node.address,
				port: node.port
			}),node.nid;
		}.bind(this));
		this.ktable.nodes = [];
	}

	onGetPeerRequest(msg,rinfo){
		try{
			var infohash = msg.a.infohash;
			var tid = msg.t;
			var nid = msg.a.id;
			var token = infohash.slice(0,TOKEN_LENGTH);

			if (tid === undefined || infohash.length != 20 || nid.length != 20){
				throw new Error;
			}
		}catch(err){
			return;
		}

		this.sendKRPC({
			t: tid,
			y: 'r',
			r: {
				id: dhtc.genNeighborID(infohash,this,ktable.nid),
				nodes: '',
				token: token
			}
		},rinfo);
	}

	onAnnouncePeerRequest(msg,info){
		var port;

		try{
			var infohash = msg.a.info_hash;
			var token = msg.a.token;
			var nid = msg.a.id;
			var tid = msg.t;

			if (tid == undefined){
				throw new Error;
			}
		}catch (err){
			return;
		}

		if (infohash.slice(0, TOKEN_LENGTH).toString() != token.toString()) {
			return;
		}

		if (msg.a.implied_port != undefined && msg.a.implied_port != 0) {
			port = rinfo.port;
		}else {
			port = msg.a.port || 0;
		}

		if (port >= 65536 || port <= 0) {
			return;
		}

		this.sendKRPC({
			t: tid,
			y: 'r',
			r: {
				id: dhtc.genNeighborID(nid,this.ktable.nid)
			}
		},rinfo);

		console.log('magnet:?xt=urn:btih:%s from %s:%s', infohash.toString('hex'), rinfo.address,rinfo.port);
	}

	onMessage(msg,rinfo){
		try{
			let msg = bencode.decode(msg);
			if(msg.y == 'r' && msg.r.nodes){
				this.onFindNodeResponse(msg.r.nodes);
			}else if(msg.y == 'q' && msg.q == 'get_peers'){
				this.onGetPeerRequest(msg,rinfo);
			}else if(msg.y == 'q' && msg.q == 'announce_peer'){
				this.onAnnouncePeerRequest(msg,rinfo);
			}
		}catch(err){
		}
	}

	start(){
		this.udp.bind(this.port,this.address);

		this.udp.on('listening',function(){
			console.log('UDP Server listening on %s:%s', this.address,this.port);
		}.bind(this));

		this.udp.on('message',function(msg,rinfo){
			this.onMessage(msg,rinfo);
		}.bind(this));

		this.udp.on('error',function(){
			
		}.bind(this));

		setInterval(function(){
			this.joinDHTNetwork();
			this.makeNeighbor();
		}.bind(this),1000);
	}
}

module.exports = DHTSpider;
