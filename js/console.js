const cmdInput = document.getElementById('consoleInput');
const cmd = document.getElementById('consoleContainer');
const cursor = document.getElementById('cursor');
const span = cmd.getElementsByTagName('span')[0];
cursorPos = -110;

cmd.addEventListener("click", cmdClick);

function cmdClick() {
    cmdInput.focus();

    cursorPos = -110;
    cursor.style.transform = `translate(${cursorPos}%, 100%)`;

    // cursor flickers while cmd is selected every half a second
    flicker = setInterval(function() {
        if (cursor.style.visibility === 'visible') {
            cursor.style.visibility = 'hidden';
        }
        else {
            cursor.style.visibility = 'visible';
        }
    }, 500)
}

// sets span text to hidden cmd input text 
cmdInput.addEventListener("keydown", event => {
    if (span.innerHTML != '>&nbsp;'+cmdInput.value) {
        span.innerHTML = '>&nbsp;'+cmdInput.value;
    }
})
// sets span text to hidden cmd input text 
cmdInput.addEventListener("keyup", event => {
    if (span.innerHTML != '>&nbsp;'+cmdInput.value) {
        span.innerHTML = '>&nbsp;'+cmdInput.value;
    }
})
// 
cmdInput.addEventListener("keydown", function(event) {
    if (event.key === 'ArrowLeft') {
        if (doGetCaretPosition(cmdInput) > 0) {
            moveCursor('left');
        }
    }
    if (event.key === 'ArrowRight') {
        if (doGetCaretPosition(cmdInput) < cmdInput.value.length) {
            moveCursor('right');
        }
    }
    if (event.key === 'Enter') {
        enter();
    }
})

logT = false;
function enter() {
    var error = true;
    // enters cmd input
    var txt = document.getElementById("consoleInputArea").innerText;

    if (cmdInput.value.includes('/help')) {
        txt += `<br>The console can be used to log each<br> instruction performed with the ${'/log'.fontcolor('blue')} <br>command. To undo, use ${'/stoplog'.fontcolor('blue')}.`.fontcolor('white');
        error = false;
    }
    if (cmdInput.value.includes('/log')) {
        logT = true;
        error = false;
    }
    if (cmdInput.value.includes('/stoplog')) {
        logT = false;
        error = false;
    }
    
    if (error) {
        txt += `<br>"${cmdInput.value}" is not recognized as a <br>command or operable program.`.fontcolor('red');
    }

    log(txt, 'white');

    cmdInput.value = '';
    document.getElementById("consoleInputArea").getElementsByTagName('span').innerHTML = '>&nbsp;';
}
function moveCursor(direction) {
    if (direction === 'left') {
        cursorPos = cursorPos - 110;
    }
    if (direction === 'right') {
        cursorPos = cursorPos + 110;
    }
    cursor.style.transform = `translate(${cursorPos}%, 100%)`;
}

// when cmd input is not selected anymore stops cursor flickering
cmdInput.addEventListener("blur", event => {
    clearInterval(flicker);
    cursor.style.visibility = 'hidden';
})

// log to console
function log(text, color){
    var txt = document.getElementById('consoleContainer').getElementsByTagName('p')[0];
    txt.innerHTML = `${txt.innerHTML}<p style='color:${color}'>${text}</p>`;

    var objDiv = document.getElementById("consoleContainer");
    objDiv.scrollTop = objDiv.scrollHeight;
}

// Returns the caret (cursor) position of the specified text field (oField).
// Return value range is 0-oField.value.length.
function doGetCaretPosition (oField) {
    // IE Support
    if (document.selection) {
        // Set focus on the element
        oField.focus();
        // To get cursor position, get empty selection range
        var oSel = document.selection.createRange();
        // Move selection start to 0 position
        oSel.moveStart('character', -oField.value.length);
        // The caret position is selection length
        iCaretPos = oSel.text.length;
    }
    // Firefox support
    else if (oField.selectionStart || oField.selectionStart == '0') {
        iCaretPos = oField.selectionDirection=='backward' ? oField.selectionStart : oField.selectionEnd;
    }

    return iCaretPos;
}

// resizing the console box
document.addEventListener('DOMContentLoaded', function() {
    // Query the element
    const resizer = document.getElementById('dragMe');
    const leftSide = resizer.previousElementSibling;
    const rightSide = resizer.nextElementSibling;

    // The current position of mouse
    let x = 0;
    let y = 0;
    let leftWidth = 0;

    // Handle the mousedown event
    // that's triggered when user drags the resizer
    const mouseDownHandler = function(e) {
        // Get the current mouse position
        x = e.clientX;
        y = e.clientY;
        leftWidth = leftSide.getBoundingClientRect().width;

        // Attach the listeners to `document`
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);

        // stops wiggling bar
        document.getElementById('bar').setAttribute('class', '');
    };

    const mouseMoveHandler = function(e) {
        // How far the mouse has been moved
        const dx = e.clientX - x;
        const dy = e.clientY - y;

        const newLeftWidth = (leftWidth + dx) * 100 / resizer.parentNode.getBoundingClientRect().width;
        leftSide.style.width = `${newLeftWidth}%`;

        resizer.style.cursor = 'col-resize';
        document.body.style.cursor = 'col-resize';

        leftSide.style.userSelect = 'none';
        leftSide.style.pointerEvents = 'none';

        rightSide.style.userSelect = 'none';
        rightSide.style.pointerEvents = 'none';

        // if near to hidden  lock in place
        var width = parseInt(leftSide.style.width);

        if (width <= 5 && width >= 0.5) {
            if (!resizer.classList.contains('close')) {
                resizer.classList.add('close');
            }
        }
        else {
            if (resizer.classList.contains('close')) {
                resizer.classList.remove('close');
            }
        }
    };

    const mouseUpHandler = function() {
        resizer.style.removeProperty('cursor');
        document.body.style.removeProperty('cursor');

        leftSide.style.removeProperty('user-select');
        leftSide.style.removeProperty('pointer-events');

        rightSide.style.removeProperty('user-select');
        rightSide.style.removeProperty('pointer-events');

        // Remove the handlers of `mousemove` and `mouseup`
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);

        // if near to hidden  lock in place
        var width = parseInt(leftSide.style.width);

        if (width <= 5) {
            leftSide.style.width = '0%';
            if (resizer.classList.contains('close')) {
                resizer.classList.remove('close');
            }
        }
    };

    // Attach the handler
    resizer.addEventListener('mousedown', mouseDownHandler);
});

function toggleConsole() {
    var resizer = document.getElementById('dragMe');
    var leftSide = resizer.previousElementSibling;
    var width = leftSide.getBoundingClientRect().width;

    // take into account content scale
    var w = window.innerWidth;

    var left = document.getElementById('leftDiv').offsetWidth;
    var right = document.getElementById('rightDiv').offsetWidth;
    var con = document.getElementById('console').offsetWidth;
    
    var scale = w/(left+right+con) - 0.1;
    if (scale <= 0.75) {
        scale = 0.75;
    }
    else if (scale >= 1.25) {
        scale = 1.25;
    }

    if (width/scale <= 5) {
        leftSide.style.width = '100%';
    }
    else {
        leftSide.style.width = '0%';
    }
}