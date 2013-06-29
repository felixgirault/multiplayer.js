exports.config =
	paths:
		public: 'build'

	files:
		javascripts:
			joinTo:
				'multiplayer.js': /^lib/
				'vendors.js': /^vendors/
			order:
				before: [ ]

		templates:
			joinTo: 'javascripts/app.js'
