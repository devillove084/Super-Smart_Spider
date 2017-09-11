const calfile = require('child_process');
const ip = '1.1.1.1';
const username = 'test';
const password = 'pwd';
const newpassword = 'newpwd';

calfile.execFile('script_sh.sh',['-H',ip,'-U',username,'-p',password,'-N',newpassword],null,function(err,stdout,stderr){
	console.log(stdout);
	console.log(err);
	console.log(stderr);
});
