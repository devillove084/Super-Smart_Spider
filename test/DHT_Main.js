const dht = require('./DHT_Spider_Class.js');

const spider = new dht({address: '0.0.0.0',port: 6881});
spider.start();

