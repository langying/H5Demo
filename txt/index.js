window.require = window.__require || function() {};
window.require('pixi.js');


var stage, text, trans = 0;
var renderer = PIXI.autoDetectRenderer(800, 480, {backgroundColor : 0x1099bb});
document.body.appendChild(renderer.view);

text = new PIXI.Text('This is a pixi text', {font : '24px Arial', fill : 0xffffff, align : 'center'});
text.anchor		= new PIXI.Point(0.5, 0.5);
text.position	= new PIXI.Point(200, 200);

var image	= PIXI.Texture.fromImage('bunny.png');
var bunny	= new PIXI.Sprite(image);
bunny.anchor	= new PIXI.Point(0.5, 0.5);
bunny.position 	= new PIXI.Point(200, 200);

stage = new PIXI.Container();
stage.addChild(text);
stage.addChild(bunny);

function update() {
	trans += 0.01;
	bunny.rotation = trans;
	text.rotation = trans;
	renderer.render(stage);
	requestAnimationFrame(update);
}

requestAnimationFrame(update);
