const Koa = require('koa');
const app = new Koa();
const serve = require('koa-static');

app.use(serve('.'));

app.listen(3000);
console.log('UI is running on port 3000!!!');
