var child = require('child_process');
var mpstat = child.spawn('mpstat', ['1']);

//Linux 3.13.0-32-generic (ape3)  03/20/2015      _x86_64_        (4 CPU)
////11:27:12 AM  CPU    %usr   %nice    %sys %iowait    %irq   %soft  %steal  %guest  %gnice   %idle
////11:27:13 AM  all   96.50    0.00    3.50    0.00    0.00    0.00    0.00    0.00    0.00    0.00

var line = 0;
var cols = ["time","day","CPU","%usr","%nice","%sys","%iowait","%irq","%soft","%steal","%guest","%gnice","%idle"];

mpstat.stdout.on('data', function (data) {
	var str = data.toString();
	if(line > 2) {
		var arr = str.split(/\s+/);
		//console.log(arr);
		console.log(arr[0]+" "+cols[3]+" "+arr[3]);
	}else{
		line++;
	}
});

mpstat.stderr.on('data', function (data) {
	console.log('stderr: ' + data);
});

mpstat.on('exit', function (code) {
	console.log('child process exited with code ' + code);
});
