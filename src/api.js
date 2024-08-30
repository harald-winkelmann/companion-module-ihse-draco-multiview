const { TCPHelper, InstanceStatus } = require('@companion-module/base')

module.exports.initAPI = function () {
	var self = this;

	if(self.KEEPALIVE) {
		clearInterval(self.KEEPALIVE);
		delete self.KEEPALIVE;
	}

	if (self.socket) {
		self.socket.destroy();
		console.log('socked destroyed');
		delete self.socket;
		console.log('socked deleted');
	}

	const retrySocket = () => {
		// Ping multiviewer to keep connection alive
		try {
			// Establish new socket
			if (!self.socket) {
				if (self.config.host && self.config.host !== '') {
					startListeningSocket();
				}
			}
			// Existing socket
			else if (self.socket && self.socket.isConnected) {
				// Get status command
				var cmd = Buffer.from([0x1B, 0x5B, 0x7A]);
				self.socket.send(cmd);
				self.log('debug','Keep alive socket');
			}
		} catch (err) {
			self.log('error', 'Error with handling socket' + JSON.stringify(err));
		}
	}

	/**
	 * Create a socket connection
	 */
	const startListeningSocket = () => {
		self.socket = new TCPHelper(self.config.host, self.config.port);

		self.socket.on('status_change', function (status, message) {
			//console.log(this); 
			self.updateStatus(status);			
			self.log('info', 'IHSE multiviwer socket ' + status);
		});

		self.socket.on('error', function (err) {
			self.updateStatus(InstanceStatus.ConnectionFailure);			
			self.log('error',"Network error: " + err.message);
		});

		self.socket.on('connect', function () {
			self.updateStatus(InstanceStatus.Ok);			
			self.log('info', 'IHSE multiviewer socket connected');
		});

		self.socket.on('data', function (data) {
			if(data[2] == 0x7a) return;
			console.log('LAN ECHO');
			console.log(data);
		});
	}

	// Run keep alive function repeatedly.
	self.KEEPALIVE = setInterval(retrySocket, 25000);

	// Run establishing connection immediately once.
	retrySocket();
}
