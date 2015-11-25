var wkhtmltopdf = require('wkhtmltopdf');
var streamBuffers = require('stream-buffers');

process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'] + '/bin';

exports.handler = function(event, context) {
	if (event.html) {
		var stream = new streamBuffers.WritableStreamBuffer();
		
		wkhtmltopdf(event.html, { pageSize: 'A4' }, function(code, signal) {
			if (code !== null) {
				console.log('Error: ' + code);
				context.fail(code, {});
			}
			
			context.succeed({
				pdf: stream.getContentsAsString('base64')
			});
		}).pipe(stream);
	} else {
		console.log('Error: Missing HTML content');
		context.fail('Missing HTML content', {});
	}

};