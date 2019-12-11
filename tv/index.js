window.require = window.__require || function() {};
window.require('pixi.js');
window.require('Tween.js');

var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {backgroundColor : 0x000000});
document.body.appendChild(renderer.view);

var size = {
	width : 640,
	height: window.innerHeight
};
var info = {
	rows: 10,
	logo:["logo0.jpg", "logo1.jpg", "logo2.jpg", "logo3.jpg", "logo4.png", "logo5.jpg"],
	icon:["icon0.png", "icon1.png", "icon2.png", "icon3.png", "icon4.png", "icon5.png", "icon6.png", "icon7.png"]
};

var scroll = new PIXI.Container();
scroll.x = (window.innerWidth - size.width) / 2;

var backgound = (function(){
	var backgound = new PIXI.Graphics();
	backgound.beginFill(0xFFFFFF);
	backgound.drawRect(0, 0, size.width, 600 + 440 * info.rows);
	backgound.endFill();
	backgound.interactive = true;
	backgound.on('touchend', onDragEnd);
	backgound.on('touchmove', onDragMove);
	backgound.on('touchstart', onDragStart);
	backgound.on('touchendoutside', onDragEnd);
	scroll.addChild(backgound);
	return backgound;
})();

var rt = new PIXI.RenderTexture(renderer, size.width, 200, PIXI.SCALE_MODES.LINEAR, 1);
var head = (function(){
	var image = new PIXI.Sprite(rt);
	backgound.addChild(image);

	var head = new PIXI.Container();
	for (var idx = 0, len = info.logo.length; idx < len; idx++) {
		var logo = new PIXI.Sprite.fromImage(info.logo[idx]);
		logo.x 		= size.width * idx;
		logo.y		= 0;
		logo.width  = size.width;
		logo.height = 200;
		head.addChild(logo);
	}
	return head;
})();
var parent = new PIXI.Container();
parent.addChild(head);

(function(){
	var category = new PIXI.Container();
	category.y = 200;
	backgound.addChild(category);
	for (var i = 0; i < 2; i++) {
		for (var j = 0; j < 4; j++) {
			var icon = new PIXI.Sprite.fromImage(info.icon[4 * i + j]);
			icon.x 		= 40 + 160 * j;
			icon.y 		= 20 + 140 * i;
			icon.width  = 80;
			icon.height = 80;
			icon.interactive = true;
			icon.on('tap',   onClick);
			icon.on('click', onClick);
			category.addChild(icon);

			var text = new PIXI.Text('分类' + j, {font : '20px sans-serif', fill : 0x000, align : 'center'});
			text.x =  80 + 160 * j;
			text.y = 120 + 140 * i;
			text.anchor = new PIXI.Point(0.5, 0.5);
			category.addChild(text);
		}
	}
})();

var toutiao = (function(){
	var toutiao = new PIXI.Graphics();
	toutiao.y = 488;
	toutiao.lineStyle(2, 0xEAEAEA);
	toutiao.drawRect(0, 0, size.width, 48);
	backgound.addChild(toutiao);

	var icon = PIXI.Sprite.fromImage('toutiao.png');
	icon.x = 20;
	icon.y = 12;
	icon.width  = 100;
	icon.height = 30;
	toutiao.addChild(icon);

	var text = new PIXI.Text('84岁默多克娶59岁老牌超模,大亨家族都是新娘fans', {font : '20px sans-serif', fill : 0x000, align : 'center'});
	text.x = 360;
	text.y = 24;
	text.anchor = new PIXI.Point(0.5, 0.5);
	toutiao.addChild(text);

	return toutiao;
})();

var favorite = (function(){
	var favorite = new PIXI.Graphics();
	favorite.y = 540;
	favorite.lineStyle(1, 0xAAAAAA);
	favorite.moveTo(0, 30);
	favorite.lineTo(210, 30);
	favorite.endFill();
	favorite.moveTo(size.width, 30);
	favorite.lineTo(size.width - 210, 30);
	favorite.endFill();
	backgound.addChild(favorite);

	var text = new PIXI.Text('猜你喜欢', {font : '24px sans-serif', fill : 0xFF0000, align : 'center'});
	text.x = size.width / 2;
	text.y = 30;
	text.anchor = new PIXI.Point(0.5, 0.5);
	favorite.addChild(text);
	return text;
})();

var list = (function(){
	var list = new PIXI.Container();
	list.y = 600;
	backgound.addChild(list);
	for (var i = 0; i < info.rows; i++) {
		var img0 = PIXI.Sprite.fromImage('item0.jpg');
		img0.x = 0;
		img0.y = 440 * i;
		img0.width  = 316;
		img0.height = 316;
		list.addChild(img0);

		var txt0 = new PIXI.Text('[为你推荐]潮土简约现代电脑桌家用\n台式书柜小书桌书架组合简易办公', {font : '20px sans-serif', fill : 0x000, align : 'center'});
		txt0.x = 160;
		txt0.y = 440 * i + 350;
		txt0.anchor = new PIXI.Point(0.5, 0.5);
		list.addChild(txt0);

		var pri0 = new PIXI.Text('￥ 100.00', {font : '24px sans-serif', fill : 0xFF0000, align : 'center'});
		pri0.x = 160;
		pri0.y = 440 * i + 400;
		pri0.anchor = new PIXI.Point(0.5, 0.5);
		list.addChild(pri0);

		var img1 = PIXI.Sprite.fromImage('item0.jpg');
		img1.x = 324;
		img1.y = 440 * i;
		img1.width  = 316;
		img1.height = 316;
		list.addChild(img1);

		var txt1 = new PIXI.Text('[为你推荐]潮土简约现代电脑桌家用\n台式书柜小书桌书架组合简易办公', {font : '20px sans-serif', fill : 0x000, align : 'center'});
		txt1.x = 480;
		txt1.y = 440 * i + 350;
		txt1.anchor = new PIXI.Point(0.5, 0.5);
		list.addChild(txt1);

		var pri1 = new PIXI.Text('￥ 100.00', {font : '24px sans-serif', fill : 0xFF0000, align : 'center'});
		pri1.x = 480;
		pri1.y = 440 * i + 400;
		pri1.anchor = new PIXI.Point(0.5, 0.5);
		list.addChild(pri1);
	}
	return list;
})();

function onDragStart(event) {
    this.dragging = true;
    this.data = event.data;
    this.pt = this.data.getLocalPosition(this.parent);
}
function onDragEnd() {
    this.dragging = false;
    this.data 	  = null;
    if (backgound.y > 0) {
    	var tween = new TWEEN.Tween(backgound.position)
			.easing(TWEEN.Easing.Quintic.Out)
			.interpolation(TWEEN.Interpolation.Linear)
		    .to({ x: 0, y: 0 }, 500)
		    .onUpdate(function() {
		        backgound.y = this.y;
		    }).start();
    }
    else if (backgound.y + backgound.height < size.height) {
    	var tween = new TWEEN.Tween(backgound.position)
			.easing(TWEEN.Easing.Quintic.Out)
			.interpolation(TWEEN.Interpolation.Linear)
		    .to({ x: 0, y: size.height - backgound.height }, 500)
		    .onUpdate(function() {
		        backgound.y = this.y;
		    }).start();
    }
}
function onDragMove() {
    if (this.dragging) {
        var pt = this.data.getLocalPosition(this.parent);
        backgound.position.y += (pt.y - this.pt.y);
        this.pt = pt;
    }
}

function onClick() {
	try {
		getUserInfo();
	}
	catch(e) {
		setTimeout(function() {
			favorite.text = '非法环境';
		}, 2000);
	}
}
function applyUserInfo(info) {
	favorite.text = info;
}

function update(time) {
	requestAnimationFrame(update);
	TWEEN.update(time);
	rt.render(parent);
	renderer.render(scroll);
}

requestAnimationFrame(update);

var idx = 0;
setInterval(function() {
	if (backgound.dragging) {
		return;
	}
 	idx++;
	if (idx >= info.logo.length) {
		idx = 0;
	}
	var x = -size.width * idx;
	var tween = new TWEEN.Tween(head.position)
		.easing(TWEEN.Easing.Back.InOut)
		.interpolation(TWEEN.Interpolation.Linear)
	    .to({ x: x, y: 0 }, 500)
	    .onUpdate(function() {
	        head.x = this.x;
	    }).start();
}, 5000);
