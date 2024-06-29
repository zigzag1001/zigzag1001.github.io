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

	windowbody.appendChild(document.createElement('button')).textContent = 'OK';

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

// custom window
function customWin() {
	var windowbody = document.createElement('div');
	windowbody.className = 'window-body';

	var form = windowbody.appendChild(document.createElement('div'));
	form.style.display = 'flex';
	form.style.flexDirection = 'column';
	var in_winname = form.appendChild(document.createElement('input'));
	var in_winbody = form.appendChild(document.createElement('textarea'));
	var submit = form.appendChild(document.createElement('button'));
	in_winname.style.padding = '5px';
	in_winname.placeholder = 'Window Title';
	in_winbody.placeholder = 'Window Body';
	in_winbody.style.padding = '5px';
	submit.textContent = 'Submit';
	submit.onclick = function() {
		removeWindow(windowbody.closest('.window'));
		var div = createWindow({
			title: in_winname.value,
			body: simplebody(in_winbody.value)
		});
		div.classList.add('customwin');
		var currentwindow = windowbody.closest('.window');
		var x = currentwindow.getBoundingClientRect().left + parseInt(currentwindow.style.margin.substring(0, currentwindow.style.margin.length - 2));
		var y = currentwindow.getBoundingClientRect().top + parseInt(currentwindow.style.margin.substring(0, currentwindow.style.margin.length - 2));
		addWindow(div, x, y);
	}

	var custom = createWindow({ body: windowbody, title: 'Create Custom Window' })
	custom.classList.add('customwincontrol');

	addWindow(custom);
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
		win.style.top = Math.floor(Math.random() * (window.innerHeight - 240)) + 'px';
		win.style.left = Math.floor(Math.random() * (window.innerWidth - 500)) + 'px';
	} else {
		win.dataset.width = win.style.width;
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
