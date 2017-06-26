/**
 * http://usejsdoc.org/
 */
exports.Server = {
		ip : '127.0.0.1',
		port : 8080
};
exports.Expires = {
		fileMatch : /^(gif|png|jpg|js|css)$/ig,
		maxAge : 60*60*24*365
};

exports.Compress = {
		match : /^(html|js|css)$/ig
};

exports.Welcome = {
		file : 'index.html'
};