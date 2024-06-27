const intro = 'bounceInUp';
const outro = 'bounceOutRight';
let count = 0;
const winnum = 50;
var body = document.body;
let maxz = 50;
function randwin() {
	var mainwin = document.querySelector('.mainwin');
	// var div = document.createElement('div');
	var div = mainwin.appendChild(document.createElement('div'));
	div.className = 'randwin window animate__animated animate__' + intro;

	var titlebar = div.appendChild(document.createElement('div'));
	titlebar.className = 'title-bar';

	var titlebartext = titlebar.appendChild(document.createElement('div'));
	titlebartext.className = 'title-bar-text';
	titlebartext.textContent = 'AAAAAAAAaaaaa';

	var titlebarcontrols = titlebar.appendChild(document.createElement('div'));
	titlebarcontrols.className = 'title-bar-controls';
	titlebarcontrols.appendChild(document.createElement('button')).ariaLabel = 'Minimize';
	titlebarcontrols.appendChild(document.createElement('button')).ariaLabel = 'Maximize';
	var closebutton = titlebarcontrols.appendChild(document.createElement('button'));
	closebutton.ariaLabel = 'Close';
	closebutton.onclick = function() {
		closeCurrentWindow(div);
	}

	var windowbody = div.appendChild(document.createElement('div'));
	windowbody.className = 'window-body';

	windowbody.appendChild(document.createElement('p')).textContent = 'AAAAAAAAaaaaa';

	var winbodysection = windowbody.appendChild(document.createElement('section'));
	winbodysection.className = 'field-row';
	winbodysection.style.justifyContent = 'flex-end';

	winbodysection.appendChild(document.createElement('button')).textContent = 'OK';
	var cancelbutton = winbodysection.appendChild(document.createElement('button'));
	cancelbutton.textContent = 'Cancel';
	cancelbutton.onclick = function() {
		closeCurrentWindow(div);
	}

	div.onmouseover = function() {
		closeCurrentWindow(div);
	};

	div.style.position = 'absolute';
	div.style.left = Math.random() * 90 + '%';
	div.style.top = Math.random() * 90 + '%';
	div.style.width = '250px';
	div.style.margin = '32px';
	// div.style.width = Math.random() * 200 + 100 + 'px';
	// div.style.height = Math.random() * 200 + 50 + 'px';
	// div.style.backgroundColor = 'rgb(' + Math.random() * 255 + ',' + Math.random() * 255 + ',' + Math.random() * 255 + ')';
	body.appendChild(div);
	handleDragging(div);
	setTimeout(() => {
		div.classList.remove('animate__' + intro);
	}, 1000);
}

function removeWindow(win) {
	win.classList.add('animate__' + outro);
	setTimeout(() => {
		body.removeChild(win);
		count--;
	}, 1000);
}

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

function fillWindows() {
	const interval = setInterval(() => {
		randwin();
		count++;
		if (count > winnum) {
			clearInterval(interval);
		}
	}, 10);
};

function clearWindows() {
	const interval = setInterval(() => {
		let win = document.querySelector('.randwin');
		body.removeChild(win);
		count--;
		if (count < 1) {
			clearInterval(interval);
		}
	}, 5);
	document.querySelector('.coolwins').style.display = 'none';
}

function showall() {
	document.querySelector('.mainwin').style.display = 'block';
	document.querySelector('.coolwins').style.display = 'block';
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
