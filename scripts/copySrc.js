const path = require('path')

const copySrc = require('../../../../scripts/copySrc')

copySrc([
	{
		from: abs('../typings/app.d.ts'),
		to: abs('../dist/app/typings/app.d.ts')
	},
	{
		from: abs('../typings/global.d.ts'),
		to: abs('../dist/app/typings/global.d.ts')
	},
	{
		from: abs('../.npmignore'),
		to: abs('../dist/app/.npmignore')
	},
	{
		from: abs('../LICENSE'),
		to: abs('../dist/app/LICENSE')
	},
	{
		from: abs('../package.json'),
		to: abs('../dist/app/package.json')
	},
	{
		from: abs('../package-lock.json'),
		to: abs('../dist/app/package-lock.json')
	},
	{
		from: abs('../README.md'),
		to: abs('../dist/app/README.md')
	},
])

function abs(fragment) {
	return path.resolve(__dirname, fragment)
}
