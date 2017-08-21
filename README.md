# Canvas Particle Network

Built during my internship at Unc Inc

## Usage

For a barebones implementation, simply add a HTML `div` to your body. You may specify its dimensions via CSS/JavaScript without any issues, as well as specify multiple instances. Then, simply add the JavaScript file to the end of your `body` and create a `ParticleNetwork` instance using your canvas ID.

```html
<body>
	<div id="particle-canvas"></div>
	<script type="text/javascript" src="particle-network.js"></script>
	<script type="text/javascript">
		var particleCanvas = new ParticleNetwork(canvasDiv, options);
	</script>
</body>
```

Additionally, a number of options are supported (see below). Simply append any of these options to your arguments on creation.

```js
var options = {
	particleColor: '#fff',
	interactive: true,
	speed: 0.1,
	density: 15,
	position: 'left'
};
var particleCanvas = new ParticleNetwork(document.getElementById('particle-canvas'), options);
```

## Options

#### options.particleColor

Type: `String`
Default: `#ffffff`

Color of the particles. Must be a valid hexadecimal code.

#### options.interactive

Type: `Boolean`
Default: `true`

Allow users to click on the canvas to create a new particleand push other particles around. Its velocity will depend on the specified speed (see below).

#### options.speed

Type: `float`

#### options.density

Type: `int`

Density of the particles. Actual amount.

#### options.position

Type: `string`

Must be either 'left' or 'right'.

Changes in which corner particles are displayed.
