function randomWinodws() {
	var windowbody = document.createElement('div');
	windowbody.className = 'window-body';
	windowbody.appendChild(document.createElement('p')).textContent = 'AAAAAAAAaaaaa';

	var okbutton = windowbody.appendChild(document.createElement('button'));
	okbutton.textContent = 'OK';
	okbutton.onclick = function() {
		fillRandWin();
	}

	var cancelbutton = windowbody.appendChild(document.createElement('button'));
	cancelbutton.textContent = 'Cancel';
	cancelbutton.onclick = function() {
		clearWins('randwin');
		setTimeout(function() {
			removeWindow(windowbody.closest('.window'));
		}, 350);
	}

	var div = createWindow({ body: windowbody });

	addWindow(div);
	count++;
}
