const { Regex } = require('@companion-module/base')

module.exports.initActions = function () {
	var self = this
		
	let actions = {

		'setdisplaymode': {
			name: 'Set Display Mode',
			options: [{
				type: 'dropdown',
				label: 'MODE',
				id: 'mode',
				default: '00',
				choices: [
						 { id: '00', label: 'Full Screen' }
						,{ id: '20', label: 'PiP (Picture in Picture)' }
						,{ id: '30', label: 'Quad (2x2)' }
						,{ id: '60', label: 'Preview' }
						,{ id: '70', label: 'True PiP' }
						,{ id: '80', label: 'PbP (Picture by Picture)' }
						,{ id: '90', label: 'Free Layout 1' }
						,{ id: '91', label: 'Free Layout 2' }
						,{ id: '92', label: 'Free Layout 3' }
						,{ id: '93', label: 'Free Layout 4' }
				],
				tooltip: 'Select display mode'
			}],
			callback: async function (action) {
				self.executeAction(action);
			}
		},

		'asyncswitching': {
			name: 'Set asynchronous video',
			options: [{
				type: 'dropdown',
				label: 'Input',
				id: 'input',
				default: '1',
				choices: [
						 { id: '1', label: 'Input 1' }
						,{ id: '2', label: 'Input 2' }
						,{ id: '3', label: 'Input 3' }
						,{ id: '4', label: 'Input 4' }
				],
				tooltip: 'Select input'
			},{
				type: 'dropdown',
				label: 'Output',
				id: 'output',
				default: '1',
				choices: [
						 { id: '1', label: 'Output 1' }
						,{ id: '2', label: 'Output 2' }
				],
				tooltip: 'Select output'
			}],
			callback: async function (action) {
				self.executeAction(action);
			}
		},

		'kvmactivity': {
			name: 'Set keyboard and mouse control',
			options: [{
				type: 'dropdown',
				label: 'Input',
				id: 'input',
				default: '1',
				choices: [
						 { id: '1', label: 'Input 1' }
						,{ id: '2', label: 'Input 2' }
						,{ id: '3', label: 'Input 3' }
						,{ id: '4', label: 'Input 4' }
				],
				tooltip: 'Select input for keyboard and mouse control'
			}],
			callback: async function (action) {
				self.executeAction(action);
			}
		}
	}

	self.setActionDefinitions(actions);
}


module.exports.executeAction = function (action) {
    var self = this;
	var opt = action.options;
	var cmd;

	switch (action.actionId) {

        case 'setdisplaymode':
            // Command for setting display mode.
            var cmd = Buffer.from([0x1B, 0x5B, 0x46, 0x07, 0x00, 0x00, 0x00])

            // Split option to digits.
            var stringDigits = opt.mode.split('')
            var realDigits   = stringDigits.map(Number)

            // Write options to command.
            if(realDigits.length > 0)
                cmd.writeUInt8(realDigits[0], 5)
            if(realDigits.length > 1)
                cmd.writeUInt8(realDigits[1], 6)
            self.log('debug', 'CMD setdisplaymode:  ' + cmd.toString('hex'))

        break;

        case 'asyncswitching':
            // Command for asynchronius switching.
            var cmd = Buffer.from([0x1B, 0x5B, 0x50, 0x09, 0x00, 0x00, 0x00, 0x00, 0x00])

            // Write options to command.
            cmd.writeInt8(parseInt(opt.input), 5)
            cmd.writeInt8(parseInt(opt.output), 7)
            self.log('debug', 'CMD asyncswitching:  ' + cmd.toString('hex'))
    
        break

        case 'kvmactivity':
            // Command for HID control.
            var cmd = Buffer.from([0x1B, 0x5B, 0x47, 0x07, 0x00, 0x00, 0x00])

            // Write options to command.
            cmd.writeInt8(parseInt(opt.input), 5)
            self.log('debug', 'CMD kvmactivity:  ' + cmd.toString('hex'))
    
        break

    }
	

    if (cmd !== undefined) {
        if (self.socket !== undefined) {
            self.log('debug', 'sending ' + cmd.toString('hex'))
            self.socket.send(cmd)
        }
    }
}