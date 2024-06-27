const intro = 'bounceInUp';
const outro = 'bounceOutRight';
let count = 0;
const winnum = 50;
var body = document.body;
let maxz = 50;

// returns empty window element
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
		closeCurrentWindow(window_);
	}
	closebutton.onclick = function() {
		closeCurrentWindow(window_);
	}

	if (opts.body) {
		window_.appendChild(opts.body);
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

function addWindow(win) {
	body.appendChild(win);
}

function simplebody(text) {
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
		closeCurrentWindow(div);
	};

	div.style.left = Math.random() * 90 + '%';
	div.style.top = Math.random() * 90 + '%';

	addWindow(div);

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
	var in_winwidth = form.appendChild(document.createElement('input'));
	var in_winbody = form.appendChild(document.createElement('textarea'));
	var submit = form.appendChild(document.createElement('button'));
	in_winname.style.padding = '5px';
	in_winname.placeholder = 'Window Title';
	in_winwidth.placeholder = 'Window Width';
	in_winwidth.style.padding = '5px';
	in_winbody.placeholder = 'Window Body';
	in_winbody.style.padding = '5px';
	submit.textContent = 'Submit';
	submit.onclick = function() {
		console.log(in_winname.value, in_winwidth.value, in_winbody.value);
		var div = createWindow({
			title: in_winname.value,
			width: in_winwidth.value,
			body: simplebody(in_winbody.value)
		});
		addWindow(div);
		removeWindow(windowbody.closest('.window'));
	}

	addWindow(createWindow({ body: windowbody }));
}

// Fancy window removal
function removeWindow(win) {
	win.classList.add('animate__' + outro);
	setTimeout(() => {
		win.parentNode.removeChild(win);
		count--;
	}, 1000);
}

// general window hider, removes randwin
// accepts elements inside the window
function closeCurrentWindow(win) {
	if (!win.classList.contains('window')) {
		win = win.closest('.window');
	}
	if (win.classList.contains('randwin')) {
		removeWindow(win);
	}
	else {
		win.style.display = 'none';
	}
}

// fill the screen with random windows
function fillRandWin() {
	const interval = setInterval(() => {
		randwin();
		count++;
		if (count > winnum) {
			clearInterval(interval);
		}
	}, 10);
};

// clear all random windows
// and hide control window
function clearRandWin() {
	const interval = setInterval(() => {
		let win = document.querySelector('.randwin');
		body.removeChild(win);
		count--;
		if (count < 1) {
			clearInterval(interval);
		}
	}, 5);
	document.querySelector('.randwins').style.display = 'none';
}

// show hidden windows
function showall() {
	document.querySelector('.mainwin').style.display = 'block';
	document.querySelector('.randwins').style.display = 'block';
}

// MOVEABLE WINDOWS

function handleDragging(item) {
	let offsetX, offsetY, isDragging = false;
	item.style.position = 'absolute';
	item.querySelector('.title-bar').style.cursor = 'move';
	item.addEventListener('mousedown', (e) => {
		item.style.zIndex = maxz++;
		if (e.target.classList.contains('title-bar-controls')) return;
		if (e.target.classList.contains('title-bar')) {
			e.preventDefault();
			offsetX = e.clientX + 32 - item.getBoundingClientRect().left;
			offsetY = e.clientY + 32 - item.getBoundingClientRect().top;
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
