const intro = 'bounceInUp';
const outro = 'bounceOutRight';
let count = 0;
var winnum = 50;
var body = document.body;
let maxz = 50;
let removing = false;

// returns window element
// opts: title, body, width, className
function createWindow(opts = {}) {
	var window_ = document.createElement('div');
	if (opts.className) {
		window_.className = opts.className;
	} else {
		window_.className = 'window animate__animated animate__' + intro;
	}

	var titlebar = window_.appendChild(document.createElement('div'));
	titlebar.className = 'title-bar';

	var titlebartext = titlebar.appendChild(document.createElement('div'));
	titlebartext.className = 'title-bar-text';
	if (opts.title) {
		titlebartext.textContent = opts.title;
	} else {
		titlebartext.textContent = 'Warning';
	}

	var titlebarcontrols = titlebar.appendChild(document.createElement('div'));
	var minbutton = titlebarcontrols.appendChild(document.createElement('button'));
	var maxbutton = titlebarcontrols.appendChild(document.createElement('button'));
	var closebutton = titlebarcontrols.appendChild(document.createElement('button'));
	titlebarcontrols.className = 'title-bar-controls';
	minbutton.ariaLabel = 'Minimize';
	maxbutton.ariaLabel = 'Maximize';
	closebutton.ariaLabel = 'Close';
	minbutton.onclick = function() {
		minimizeWindow(window_);
	}
	maxbutton.onclick = function() {
		maximizeWindow(window_);
	}
	closebutton.onclick = function() {
		removeWindow(window_);
	}

	if (opts.body) {
		window_.appendChild(opts.body);
	} else {
		window_.appendChild(simplebody('This is a warning message.'));
	}

	if (opts.width) {
		window_.style.width = opts.width;
	} else {
		window_.style.width = '250px';
	}

	window_.style.margin = '32px';

	handleDragging(window_);

	return window_;
}

function addWindow(win, x = 0, y = 0) {

	taskbar(win, 'add');

	if (x == 0 && y == 0) {
		x = Math.floor(Math.random() * (window.innerWidth - 500));
		y = Math.floor(Math.random() * (window.innerHeight - 240));
	}
	win.style.zIndex = maxz++;
	win.style.left = x + 'px';
	win.style.top = y + 'px';
	body.appendChild(win);
	setTimeout(() => {
		win.classList.remove('animate__' + intro);
	}, 1000);
}

function simplebody(text) {
	if (text == "") {
		text = 'This is a warning message.';
	}
	var windowbody = document.createElement('div');
	windowbody.className = 'window-body';
	windowbody.appendChild(document.createElement('p')).textContent = text;

	var okbutton = windowbody.appendChild(document.createElement('button'));
	okbutton.textContent = 'OK';
	okbutton.onclick = function() {
		randwin();
	}

	var cancelbutton = windowbody.appendChild(document.createElement('button'));
	cancelbutton.textContent = 'Cancel';
	cancelbutton.onclick = function() {
		removeWindow(windowbody.closest('.window'));
	}

	return windowbody;
}

function randwin() {
	var windowbody = simplebody('AAAAAAAAaaaaa');

	var div = createWindow({ body: windowbody });

	div.classList.add('randwin');

	div.onmouseover = function() {
		// closeCurrentWindow(div);
		div.onmouseover = null;
		count--;
		removeWindow(div);
	};

	let screenWidth = window.innerWidth;
	let screenHeight = window.innerHeight;
	let winWidth = 256;
	let winHeight = 240;

	let x = Math.floor(Math.random() * (screenWidth - winWidth));
	let y = Math.floor(Math.random() * (screenHeight - winHeight));

	addWindow(div, x, y);

	setTimeout(() => {
		div.classList.remove('animate__' + intro);
	}, 1000);
}

// Fancy window removal
function removeWindow(win) {
	win.classList.add('animate__' + outro);
	taskbar(win, 'remove');
	setTimeout(() => {
		win.remove();
	}, 1000);
}

const winbarmap = new Map();
const openwins = document.querySelector('.open-windows');
const namemap = {
	'randwincontrol': '💥AAAAAAA',
	'customwincontrol': '📁NEW WINDOW',
	'customwin': '✅CUSTOM WINDOW',
};

// handles taskbar to window interaction
function taskbar(win, action) {
	if (action == 'add') {
		win.classList.forEach((classname) => {
			if (classname in namemap) {
				var winname = namemap[classname];
				var taskbarbutton = document.createElement('button');
				taskbarbutton.className = 'taskbar-button';
				taskbarbutton.textContent = winname;
				taskbarbutton.onclick = function() {
					minimizeWindow(win);
				}

				// winbarmap[win] = taskbarbutton;
				winbarmap.set(win, taskbarbutton);
				openwins.appendChild(taskbarbutton);
				return;
			}
		});
	} else if (action == 'remove') {
		if (winbarmap.has(win)) {
			winbarmap.get(win).remove();
			winbarmap.delete(win);
			return;
		}
	}
}

// handles minimizing windows
function minimizeWindow(win) {
	if (win.style.display == 'none') {
		win.style.zIndex = maxz++;
		win.style.display = 'block';
	} else {
		win.style.display = 'none';
	}
}

// handles maximizing windows
function maximizeWindow(win) {
	if (win.style.width == '100%') {
		win.style.width = win.dataset.width;
		win.style.height = null;
		win.style.left = win.dataset.x;
		win.style.top = win.dataset.y;
	} else {
		win.dataset.width = win.style.width;
		win.dataset.x = win.style.left;
		win.dataset.y = win.style.top;
		win.style.top = '-' + win.style.margin;
		win.style.left = '-' + win.style.margin;
		win.style.width = '100%';
		win.style.height = '100%';
	}
}

// fill the screen with random windows
function fillRandWin() {
	if (removing) return;
	const interval = setInterval(() => {
		randwin();
		count++;
		if (count >= winnum) {
			clearInterval(interval);
		}
	}, 10);
};

// clear all random windows
// and hide control window
function clearWins(classname, except = 'norem') {
	if (removing) return;
	removing = true;
	count = 0;
	var targets = document.querySelectorAll('.' + classname);
	targets.forEach((target) => {
		if (target.classList.contains(except)) return;
		removeWindow(target);
	});
	removing = false;
}

function closeAll() {
	clearWins('window');
	maxz = 50;
}

// MOVEABLE WINDOWS

function handleDragging(item) {
	let offsetX, offsetY, isDragging = false;
	item.style.position = 'absolute';
	// item.querySelector('.title-bar').style.cursor = 'move';
	item.querySelector('.title-bar-text').style.cursor = 'default';
	item.addEventListener('mousedown', (e) => {
		item.style.zIndex = maxz++;
		if (e.target.classList.contains('title-bar-controls')) return;
		if (e.target.classList.contains('title-bar') || e.target.classList.contains('title-bar-text')) {
			e.preventDefault();
			let margin = parseInt(item.style.margin.substring(0, item.style.margin.length - 2));
			offsetX = e.clientX + margin - item.getBoundingClientRect().left;
			offsetY = e.clientY + margin - item.getBoundingClientRect().top;
			isDragging = true;
		}
	});
	document.addEventListener('mousemove', (e) => {
		if (isDragging) {
			item.style.left = e.clientX - offsetX + 'px';
			item.style.top = e.clientY - offsetY + 'px';
		}
	});
	document.addEventListener('mouseup', () => {
		isDragging = false;
	});
}

let items = document.querySelectorAll('.mainwin .window');
items.forEach(handleDragging);

// ---------


function toggleStartmenu() {
	var startmenu = document.querySelector('.startmenu');
	if (startmenu.style.display == 'block') {
		startmenu.classList.add('animate__slideOutDown');
		setTimeout(() => {
			startmenu.classList.remove('animate__slideOutDown');
			startmenu.style.display = 'none';
			startmenu.style.zIndex = 0;
		}, 200);
	} else {
		startmenu.classList.add('animate__slideInUp');
		startmenu.style.display = 'block';
		startmenu.style.zIndex = maxz++;
	}
}


function desktopSelectSquare() {
	var desktop = document.querySelector('.desktop');
	desktop.addEventListener('mousedown', (e) => {
		let x = e.clientX;
		let y = e.clientY;
		let square = document.createElement('div');
		square.className = 'square';
		square.style.left = x + 'px';
		square.style.top = y + 'px';
		desktop.appendChild(square);
		desktop.addEventListener('mousemove', (e) => {
			let width = e.clientX - x;
			let height = e.clientY - y;
			if (width < 0) {
				square.style.left = e.clientX + 'px';
				width = -width;
			}
			if (height < 0) {
				square.style.top = e.clientY + 'px';
				height = -height;
			}
			square.style.width = width + 'px';
			square.style.height = height + 'px';
		});
		desktop.addEventListener('mouseup', () => {
			square.remove();
			desktop.removeEventListener('mousemove', () => { });
			desktop.removeEventListener('mouseup', () => { });
		});
	});
}
desktopSelectSquare();
