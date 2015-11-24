var wkhtmltopdf = require('wkhtmltopdf');
var fs = require('fs');

process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'] + '/bin';

exports.handler = function(event, context) {
	if (event.html) {
		var output_filename = Math.random().toString(36).slice(2) + '.pdf';
		var output = '/tmp/' + output_filename;
		
		writeStream = fs.createWriteStream(output);
		
		wkhtmltopdf(event.html, { pageSize: 'A4' }, function(code, signal) {
			if (code !== null) {
				console.log('Error: ' + code);
				context.fail(code, {});
			}
			
			var data = new Buffer(fs.readFileSync(output)).toString('base64');
			
			context.succeed({
				pdf: data
			});
		}).pipe(writeStream);
	} else {
		console.log('Error: Missing HTML content');
		context.fail('Missing HTML content', {});
	}

};