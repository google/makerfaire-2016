const MAX_BURGERS = 6;
const BURGER_LAYER_HEIGHT = 20;

function create_animation1(element_name, data, wrapper) {
    var element = wrapper.children.namedItem(element_name);
    var body = document.getElementsByTagName("BODY")[0];
    var width = body.getBoundingClientRect().width;
    var height = body.getBoundingClientRect().height;

    var timings = {
	duration: 500,
	iterations: 1,
	easing: "linear",
	direction: "normal",
	fill: "forwards",
	delay: data.delay,
    }

    var keyframes = [
	{ transform: 'translateX(' + (width/2 - 128) + 'px) translateY(' + data.initialY + ')', opacity: 1},
	{ transform: 'translateX(' + (width/2 - 128) + 'px) translateY(' + data.conveyorY + ')', opacity: 1},
    ];
    return new KeyframeEffect(element, keyframes, timings);
}


function create_animation2(element_name, data, wrapper) {
    var element = wrapper.children.namedItem(element_name);
    var dest = wrapper.getAttribute('id');
    var body = document.getElementsByTagName("BODY")[0];
    var width = body.getBoundingClientRect().width;
    var height = body.getBoundingClientRect().height;

    var timings = {
	duration: 500,
	iterations: 1,
	easing: "linear",
	direction: "normal",
	fill: "forwards",
    }

    var target = dest == 'left' ? 256 : width-256;
    
    var keyframes = [
	{ transform: 'translateX(' + (width/2 - 128) + 'px) translateY(' + data.conveyorY + ')', opacity: 1},
	{ transform: 'translateX(' + target + 'px) translateY(' + data.conveyorY + ')', opacity: 1},
    ];
    return new KeyframeEffect(element, keyframes, timings);
}

function create_animation3(element_name, data, wrapper) {
    var element = wrapper.children.namedItem(element_name);
    var dest = wrapper.getAttribute('id');
    var body = document.getElementsByTagName("BODY")[0];
    width = body.getBoundingClientRect().width;
    height = body.getBoundingClientRect().height;

    var timings = {
	duration: 500,
	iterations: 1,
	easing: "linear",
	direction: "normal",
	fill: "forwards",
    }
    var target = dest == 'left' ? 0 : width-256;
    var keyframes = [
	{ transform: 'translateX(' + target + 'px) translateY(' + data.conveyorY + ')', opacity: 1},
	{ transform: 'translateX(' + target + 'px) translateY(' + data.finalY + ')', opacity: 1},
    ];
    return new KeyframeEffect(element, keyframes, timings);
}

function create_group(wrapper, f) {
    var animation = create_animation();
    var kEffects = [];
    for (let a of animation) {
	var kf = f(a[0], a[1], wrapper);
	kEffects.push(kf);
    }
    var group = new GroupEffect(kEffects);
    return group;
}

const layers_enum = Object.freeze({
    0: "empty",
    1: "topbun",
    2: "lettuce",
    3: "tomato",
    4: "cheese",
    5: "patty",
    6: "bottombun"
});

function create_random_layers() {
    var layers = [];
    var empty_layers = Math.floor(Math.random() * (MAX_BURGERS-1));
    for (i = 0; i < empty_layers; i++) {
	layers.push("empty");
    }
    for (i = empty_layers; i < MAX_BURGERS; i++) {
	layers.push(layers_enum[Math.floor(Math.random() * 6)+1]);
    }
    return layers;
}

const valid_burgers = [
    [0,0,0,1,5,6],
    [0,0,1,2,5,6],
    [0,0,1,3,5,6],
    [0,0,1,4,5,6],
    [0,0,1,5,2,6],
    [0,0,1,5,3,6],
    [0,0,1,5,4,6],
    [0,0,1,5,5,6],
    [0,1,2,2,5,6],
    [0,1,2,3,5,6],
    [0,1,2,4,5,6],
    [0,1,2,5,2,6],
    [0,1,2,5,3,6],
    [0,1,2,5,4,6],
    [0,1,2,5,5,6],
    [0,1,3,2,5,6],
    [0,1,3,3,5,6],
    [0,1,3,4,5,6],
    [0,1,3,5,2,6],
    [0,1,3,5,3,6],
    [0,1,3,5,4,6],
    [0,1,3,5,5,6],
    [0,1,4,2,5,6],
    [0,1,4,3,5,6],
    [0,1,4,4,5,6],
    [0,1,4,5,2,6],
    [0,1,4,5,3,6],
    [0,1,4,5,4,6],
    [0,1,4,5,5,6],
    [0,1,5,2,2,6],
    [0,1,5,2,3,6],
    [0,1,5,2,4,6],
    [0,1,5,2,5,6],
    [0,1,5,3,2,6],
    [0,1,5,3,3,6],
    [0,1,5,3,4,6],
    [0,1,5,3,5,6],
    [0,1,5,4,2,6],
    [0,1,5,4,3,6],
    [0,1,5,4,4,6],
    [0,1,5,4,5,6],
    [0,1,5,5,2,6],
    [0,1,5,5,3,6],
    [0,1,5,5,4,6],
    [0,1,5,5,5,6],
    [1,2,2,2,5,6],
    [1,2,2,3,5,6],
    [1,2,2,4,5,6],
    [1,2,2,5,2,6],
    [1,2,2,5,3,6],
    [1,2,2,5,4,6],
    [1,2,2,5,5,6],
    [1,2,3,2,5,6],
    [1,2,3,3,5,6],
    [1,2,3,4,5,6],
    [1,2,3,5,2,6],
    [1,2,3,5,3,6],
    [1,2,3,5,4,6],
    [1,2,3,5,5,6],
    [1,2,4,2,5,6],
    [1,2,4,3,5,6],
    [1,2,4,4,5,6],
    [1,2,4,5,2,6],
    [1,2,4,5,3,6],
    [1,2,4,5,4,6],
    [1,2,4,5,5,6],
    [1,2,5,2,2,6],
    [1,2,5,2,3,6],
    [1,2,5,2,4,6],
    [1,2,5,2,5,6],
    [1,2,5,3,2,6],
    [1,2,5,3,3,6],
    [1,2,5,3,4,6],
    [1,2,5,3,5,6],
    [1,2,5,4,2,6],
    [1,2,5,4,3,6],
    [1,2,5,4,4,6],
    [1,2,5,4,5,6],
    [1,2,5,5,2,6],
    [1,2,5,5,3,6],
    [1,2,5,5,4,6],
    [1,2,5,5,5,6],
    [1,3,2,2,5,6],
    [1,3,2,3,5,6],
    [1,3,2,4,5,6],
    [1,3,2,5,2,6],
    [1,3,2,5,3,6],
    [1,3,2,5,4,6],
    [1,3,2,5,5,6],
    [1,3,3,2,5,6],
    [1,3,3,3,5,6],
    [1,3,3,4,5,6],
    [1,3,3,5,2,6],
    [1,3,3,5,3,6],
    [1,3,3,5,4,6],
    [1,3,3,5,5,6],
    [1,3,4,2,5,6],
    [1,3,4,3,5,6],
    [1,3,4,4,5,6],
    [1,3,4,5,2,6],
    [1,3,4,5,3,6],
    [1,3,4,5,4,6],
    [1,3,4,5,5,6],
    [1,3,5,2,2,6],
    [1,3,5,2,3,6],
    [1,3,5,2,4,6],
    [1,3,5,2,5,6],
    [1,3,5,3,2,6],
    [1,3,5,3,3,6],
    [1,3,5,3,4,6],
    [1,3,5,3,5,6],
    [1,3,5,4,2,6],
    [1,3,5,4,3,6],
    [1,3,5,4,4,6],
    [1,3,5,4,5,6],
    [1,3,5,5,2,6],
    [1,3,5,5,3,6],
    [1,3,5,5,4,6],
    [1,3,5,5,5,6],
    [1,4,2,2,5,6],
    [1,4,2,3,5,6],
    [1,4,2,4,5,6],
    [1,4,2,5,2,6],
    [1,4,2,5,3,6],
    [1,4,2,5,4,6],
    [1,4,2,5,5,6],
    [1,4,3,2,5,6],
    [1,4,3,3,5,6],
    [1,4,3,4,5,6],
    [1,4,3,5,2,6],
    [1,4,3,5,3,6],
    [1,4,3,5,4,6],
    [1,4,3,5,5,6],
    [1,4,4,2,5,6],
    [1,4,4,3,5,6],
    [1,4,4,4,5,6],
    [1,4,4,5,2,6],
    [1,4,4,5,3,6],
    [1,4,4,5,4,6],
    [1,4,4,5,5,6],
    [1,4,5,2,2,6],
    [1,4,5,2,3,6],
    [1,4,5,2,4,6],
    [1,4,5,2,5,6],
    [1,4,5,3,2,6],
    [1,4,5,3,3,6],
    [1,4,5,3,4,6],
    [1,4,5,3,5,6],
    [1,4,5,4,2,6],
    [1,4,5,4,3,6],
    [1,4,5,4,4,6],
    [1,4,5,4,5,6],
    [1,4,5,5,2,6],
    [1,4,5,5,3,6],
    [1,4,5,5,4,6],
    [1,4,5,5,5,6],
    [1,5,2,2,2,6],
    [1,5,2,2,3,6],
    [1,5,2,2,4,6],
    [1,5,2,2,5,6],
    [1,5,2,3,2,6],
    [1,5,2,3,3,6],
    [1,5,2,3,4,6],
    [1,5,2,3,5,6],
    [1,5,2,4,2,6],
    [1,5,2,4,3,6],
    [1,5,2,4,4,6],
    [1,5,2,4,5,6],
    [1,5,2,5,2,6],
    [1,5,2,5,3,6],
    [1,5,2,5,4,6],
    [1,5,2,5,5,6],
    [1,5,3,2,2,6],
    [1,5,3,2,3,6],
    [1,5,3,2,4,6],
    [1,5,3,2,5,6],
    [1,5,3,3,2,6],
    [1,5,3,3,3,6],
    [1,5,3,3,4,6],
    [1,5,3,3,5,6],
    [1,5,3,4,2,6],
    [1,5,3,4,3,6],
    [1,5,3,4,4,6],
    [1,5,3,4,5,6],
    [1,5,3,5,2,6],
    [1,5,3,5,3,6],
    [1,5,3,5,4,6],
    [1,5,3,5,5,6],
    [1,5,4,2,2,6],
    [1,5,4,2,3,6],
    [1,5,4,2,4,6],
    [1,5,4,2,5,6],
    [1,5,4,3,2,6],
    [1,5,4,3,3,6],
    [1,5,4,3,4,6],
    [1,5,4,3,5,6],
    [1,5,4,4,2,6],
    [1,5,4,4,3,6],
    [1,5,4,4,4,6],
    [1,5,4,4,5,6],
    [1,5,4,5,2,6],
    [1,5,4,5,3,6],
    [1,5,4,5,4,6],
    [1,5,4,5,5,6],
    [1,5,5,2,2,6],
    [1,5,5,2,3,6],
    [1,5,5,2,4,6],
    [1,5,5,2,5,6],
    [1,5,5,3,2,6],
    [1,5,5,3,3,6],
    [1,5,5,3,4,6],
    [1,5,5,3,5,6],
    [1,5,5,4,2,6],
    [1,5,5,4,3,6],
    [1,5,5,4,4,6],
    [1,5,5,4,5,6],
    [1,5,5,5,2,6],
    [1,5,5,5,3,6],
    [1,5,5,5,4,6],
    [1,5,5,5,5,6]];

function create_valid_layers() {
    var layers_idx = valid_burgers[Math.floor(Math.random() * valid_burgers.length)];
    var layers = [];
    for (i = 0; i < layers_idx.length; i++) {
	layers.push(layers_enum[layers_idx[i]]);
    }
    return layers;
}

function create_burger(layers) {
    var svgNS = 'http://www.w3.org/2000/svg';
    var wrapper = document.createElement("div");
    wrapper.setAttribute('class', "wrapper");
    wrapper.setAttribute('id', 'hopper');
    for (i = 0; i < layers.length; i++) {
    	var svg = document.createElementNS(svgNS, "svg");
    	svg.setAttributeNS(null, 'id', 'layer' + (i+1).toString());
    	svg.setAttributeNS(null, 'class', layers[i]);
	if (layers[i] != 'empty') {
    	    var use = document.createElementNS(svgNS, 'use');
	    var href = '../assets/' + layers[i] + '.svg#g10';
    	    use.setAttributeNS(null, 'href', href);
    	    svg.appendChild(use);
	}
    	wrapper.appendChild(svg);
    }
    return wrapper;
}

function create_chute(name, center_x, height) {
    var svgNS = 'http://www.w3.org/2000/svg';
    var chute = document.createElementNS(svgNS, "svg");
    chute.setAttributeNS(null, 'id', 'chute_' + name);
    chute.setAttributeNS(null, 'class', 'chute');
    document.body.appendChild(chute);

    var SIZE=Math.floor(128);
    var chuteline1 = document.createElementNS(svgNS, 'line');
    chuteline1.setAttributeNS(null, 'class', 'chuteline');
    chuteline1.setAttributeNS(null, 'style', 'stroke:rgb(255,0,0);stroke-width:5');
    chuteline1.setAttributeNS(null, 'x1', center_x - SIZE);
    chuteline1.setAttributeNS(null, 'y1', 0);
    chuteline1.setAttributeNS(null, 'x2', center_x - SIZE);
    chuteline1.setAttributeNS(null, 'y2', height);
    chute.appendChild(chuteline1);

    var chuteline2 = document.createElementNS(svgNS, 'line');
    chuteline2.setAttributeNS(null, 'class', 'chuteline');
    chuteline2.setAttributeNS(null, 'style', 'stroke:rgb(255,0,0);stroke-width:5');
    chuteline2.setAttributeNS(null, 'x1', center_x + SIZE);
    chuteline2.setAttributeNS(null, 'y1', 0);
    chuteline2.setAttributeNS(null, 'x2', center_x + SIZE);
    chuteline2.setAttributeNS(null, 'y2', height);
    chute.appendChild(chuteline2);
}

function create_conveyor(width, height) {
    var svgNS = 'http://www.w3.org/2000/svg';
    var conveyor = document.createElementNS(svgNS, "svg");
    conveyor.setAttributeNS(null, 'id', 'conveyor');
    conveyor.setAttributeNS(null, 'class', 'conveyor');
    document.body.appendChild(conveyor);
    var conveyorLine = document.createElementNS(svgNS, 'line');
    conveyorLine.setAttributeNS(null, 'class', 'chuteline');
    conveyorLine.setAttributeNS(null, 'style', 'stroke:rgb(255,0,0);stroke-width:5');
    conveyorLine.setAttributeNS(null, 'x1', 0);
    conveyorLine.setAttributeNS(null, 'y1', height);
    conveyorLine.setAttributeNS(null, 'x2', width);
    conveyorLine.setAttributeNS(null, 'y2', height);
    conveyor.appendChild(conveyorLine);
}

function create_animation(width, height) {
    var body = document.getElementsByTagName('body')[0];
    var width = body.getBoundingClientRect().width;
    var height = body.getBoundingClientRect().height;

    var baseInitialY = -300;
    var baseConveyorY = height-100-10;
    var baseFinalY = 1000;
    var animation = [];
    for (i = 0; i < 8; i++) {
	animation.push(["layer" + (MAX_BURGERS-i+1), {
	    delay: i*100,
	    initialY: (baseInitialY - i * BURGER_LAYER_HEIGHT) + 'px',
	    conveyorY: (baseConveyorY - i * BURGER_LAYER_HEIGHT) + 'px',
	    finalY: (baseFinalY - i * BURGER_LAYER_HEIGHT) + 'px',
	}]);
    }
    return animation;
}

function start_animation() {
    console.log("starting a new animation if needed");
    var hopperBurger = document.getElementById('hopper');
    if (hopperBurger != null) {	
	console.log("hopper is not empty, conveying burger.");
	convey_burger(hopperBurger);
	return;
    }
    console.log("Animating a new burger in the hopper");
    if (Math.random() < 0.5) {
	var layers = create_random_layers();
    } else {
	var layers = create_valid_layers();
    }

    hopperBurger = create_burger(layers);
    document.body.appendChild(hopperBurger);
    var group1 = create_group(hopperBurger, create_animation1);

    var player = new Animation(group1, document.timeline);
    player.onfinish = function() {
	convey_burger(hopperBurger);
    }
    player.play();
}

function convey_burger(wrapper) {
    console.log("conveying burger if needed.");
    // use leftBurger and rightBurger to determine if we need to make a random choice;
    var dest;
    var leftBurger = document.getElementById('left');
    var rightBurger = document.getElementById('right');
    if (leftBurger == null && rightBurger == null) {
	if (Math.random() < 0.5) {
	    dest = 'left';
	} else {
	    dest = 'right';
	}
    } else if (leftBurger == null) {
	dest = 'left'; 
    } else if (rightBurger == null) {
	dest = 'right';
    } else {
	console.log("Cannot convey burger.");
	return;
    }
    console.log("Chose conveyor dest:", dest);
    wrapper.setAttribute('id', dest);

    var group2 = create_group(wrapper, create_animation2);
    var player = new Animation(group2, document.timeline);
    player.onfinish = function() {
	wait_for_keypress(wrapper);
    }
    player.play();
}

function after_keypress(wrapper) {
    console.log("after keypress for", wrapper);
    var dest = wrapper.getAttribute('id');
    console.log("dest is", dest);
    create_animation();
    var group = create_group(wrapper, create_animation3);
    var player = new Animation(group, document.timeline);
    player.onfinish = function() {
	if (dest == 'left') {
	    leftBurger = false;
	} else if (dest == 'right') {
	    rightBurger = false;
	}
	wrapper.remove();
	start_animation();
    }
    player.play();
}

function wait_for_keypress(wrapper) {
    console.log("wait for keypress for", wrapper);
    var dest = wrapper.getAttribute('id');
    console.log("dest is", dest);
    var yesCode, noCode;
    function keydownHandlerLeft(e) {
	var yesCode = "Z".charCodeAt(0);
	var noCode = "X".charCodeAt(0);
	console.log("keydownHandlerLeft waiting for", yesCode, noCode, "got", e.keyCode);
	if (e.keyCode == yesCode || e.keyCode == noCode) {
	    document.removeEventListener('keydown', keydownHandlerLeft, false);
	    after_keypress(wrapper);
	}
    }
    function keydownHandlerRight(e) {
	var yesCode = "M".charCodeAt(0);
	var noCode = "N".charCodeAt(0);
	console.log("keydownHandlerRight waiting for", yesCode, noCode, "got", e.keyCode);
	if (e.keyCode == yesCode || e.keyCode == noCode) {
	    document.removeEventListener('keydown', keydownHandlerRight, false);
	    after_keypress(wrapper);
	}
    }
    if (dest == 'left')
	document.addEventListener('keydown', keydownHandlerLeft, false);
    else if (dest == 'right')
	document.addEventListener('keydown', keydownHandlerRight, false);
    start_animation();
}

$(window).ready(function() {
    var body = document.getElementsByTagName('body')[0];
    var width = body.getBoundingClientRect().width;
    var height = body.getBoundingClientRect().height;
    create_conveyor(width, height-100);
    create_chute('left', 256, height-100);
    create_chute('right', width-256, height-100);
    start_animation();
});

