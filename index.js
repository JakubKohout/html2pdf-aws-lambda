var wkhtmltopdf = require('wkhtmltopdf');
var streamBuffers = require('stream-buffers');

process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'] + '/bin';

exports.handler = function(event, context) {
	var options = {
		pageSize: event.pageSize || 'A4', // A5/A4/A3
		orientation: event.orientation || 'Portrait', // Portrait/Landscape
		grayscale: typeof event.grayscale == "undefined" ? true : event.grayscale
	};
	
	if (event.html) {
		var stream = new streamBuffers.WritableStreamBuffer();
		
		wkhtmltopdf(event.html, options, function(code, signal) {
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