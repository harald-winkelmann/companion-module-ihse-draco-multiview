const { Regex } = require('@companion-module/base')

module.exports = {
	getConfigFields() {
		return [
			{
				type: 'static-text',
				id: 'info',
				width: 12,
				label: 'Information',
				value: 'This module is for IHSE Draco Multiviewer'
			},
			{
				type: 'textinput',
				id: 'host',
				label: 'Multiviewer IP',
				width: 12,
				default: '192.168.100.95',
				regex: Regex.IP
			},
			{
				type: 'textinput',
				id: 'port',
				label: 'Multiviewer Port',
				width: 12,
				default: '7055',
				regex: Regex.PORT
			},
		]
	},
}