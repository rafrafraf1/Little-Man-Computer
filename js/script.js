instructions = ['INP', 'STA', 'LDA', 'ADD', 'SUB', 'OUT', 'HLT', 'DAT', 'BRZ', 'BRP', 'BRA'];
errorstop = false;

function interpret() {
    errorstop = false;

    document.getElementById('runBtn').setAttribute('onclick', 'toggleRun()');
    document.getElementById('runBtn').setAttribute('class', 'box to-top');

    document.getElementById('resetBtn').setAttribute('onclick', 'clearR()');
    document.getElementById('resetBtn').setAttribute('class', 'box1 box1A');

    document.getElementById('compileBtn').setAttribute('onclick', '');
    document.getElementById('compileBtn').setAttribute('class', 'box1');

    highlightMemory()
    
    clipsay('Your assembley code has been interpreted. Click RUN to start the fetch-decode-execute cycle.', 'black')

    // gets code in text form
    var input = '';
    var editor = document.getElementById('lines');
    for (i=0; i<editor.children.length; i++) {
        input += editor.children[i].getElementsByTagName('span')[0].innerText + '\n';
    }

    var interpretedText = document.getElementById('interpret');

    var lines = input.split('\n');

    // removes all comments
    for (i=0; i < lines.length; i++) {
        if (lines[i].includes('//')) {
            lines[i] = lines[i].substring(0, lines[i].indexOf('//'));
        }
    }
    
    // removes all empty lines from lines list
    for (i=0; i < lines.length; i++) {
        if (lines[i] === '') {
            lines.splice(i, 1);
            i--;
        }
        else if(!lines[i].replace(/\s/g, '').length) {
            lines.splice(i, 1);
            i--;
        }
    }    
    
    // gets all values of variables and removes variable name from line if it is the first word in the line
    variables = {};
    for (i=0; i < lines.length; i++) {
        var lineNum = `${i}`;
        if (i.toString().length === 1) {
            lineNum = `0${lineNum}`;
        }

        var arr = lines[i].split(' ').filter(x => x !== '');

        // finds all instances of variables being set
        if (!instructions.includes(arr[0].toUpperCase())) { // finds all lines that are given named
            variables[arr[0].toUpperCase()] = lineNum;
            var strippedOfVar = '';
            for (x=1; x < arr.length; x++) {
                strippedOfVar += arr[x] + ' ';
            }
            lines[i] = strippedOfVar;
        }    
    }

    // interprets the lines from lines list and sets string to the interpreted version
    var string = '';
    for (i=0; i < lines.length; i++) {
        var lineNum = `${i}`;
        if (i.toString().length === 1) {
            lineNum = `0${lineNum}`;
        }
        try {
            if (lines[i].toUpperCase().includes('INP')) {
                string += inp(lines[i], lineNum) + '\n';
            }
            if (lines[i].toUpperCase().includes('STA')) {
                string += sta(lines[i], lineNum) + '\n';
            }
            if (lines[i].toUpperCase().includes('LDA')) {
                string += lda(lines[i], lineNum) + '\n';
            }
            if (lines[i].toUpperCase().includes('ADD')) {
                string += add(lines[i], lineNum) + '\n';
            }
            if (lines[i].toUpperCase().includes('SUB')) {
                string += sub(lines[i], lineNum) + '\n';
            }
            if (lines[i].toUpperCase().includes('OUT')) {
                string += out(lines[i], lineNum) + '\n';
            }
            if (lines[i].toUpperCase().includes('HLT')) {
                string += hlt(lines[i], lineNum) + '\n';
            }
            if (lines[i].toUpperCase().includes('DAT')) {
                string += dat(lines[i], lineNum) + '\n';
            }
            if (lines[i].toUpperCase().includes('BRZ')) {
                string += brz(lines[i], lineNum) + '\n';
            }
            if (lines[i].toUpperCase().includes('BRP')) {
                string += brp(lines[i], lineNum) + '\n';
            }
            if (lines[i].toUpperCase().includes('BRA')) {
                string += bra(lines[i], lineNum) + '\n';
            }    
        }
        catch(err) {
            console.log(err)
            errorstop = true;
        }
    }

    if (!errorstop) {
        interpretedText.innerHTML = string;
    }
}

function getAddress(line, lineNum) {
    var line = line.split(' ').filter(x => x !== '');

    var address = line[1];

    // if address is variable, replaces the var with its value
    if (!Number.isNaN(parseInt(address))) {
        if (address.length === 1) {
            address = `0${address}`;
        }
    }
    else {
        try {
            address = variables[address.toUpperCase()];    
        }
        catch(err) {
            error(lineNum, `MISSING ADDRESS ERROR -<br> &emsp;&emsp; Traceback (most recent call):<br>"${line}  " <`, 'red')
            errorstop = true;
        }
    }

    if (address.length >= 3) {
        error(lineNum, `INVALID ADDRESS ERROR -<br> &emsp;&emsp; Traceback (most recent call):<br>"${line[0]+' '+line[1]}" <`, 'red')
        errorstop = true;
    }
    
    return address;
}

function inp(line, lineNum) {
    if (!errorstop) {
        setAt(lineNum, '901');
    }

    return `${lineNum}  INP`;
}
function sta(line, lineNum) {
    var address = getAddress(line, lineNum);

    if (!errorstop) {
        setAt(lineNum, `3${address}`);
    }

    return `${lineNum}  STA    ${address}`;
}
function lda(line, lineNum) {
    var address = getAddress(line, lineNum);

    if (!errorstop) {
        setAt(lineNum, `5${address}`);
    }

    return `${lineNum}  LDA    ${address}`;
}
function add(line, lineNum) {
    var address = getAddress(line, lineNum);

    if (!errorstop) {
        setAt(lineNum, `1${address}`);
    }

    return `${lineNum}  ADD    ${address}`;
}
function sub(line, lineNum) {
    var address = getAddress(line, lineNum);

    if (!errorstop) {
        setAt(lineNum, `2${address}`);
    }

    return `${lineNum}  SUB    ${address}`;
}
function out(line, lineNum) {
    if (!errorstop) {
        setAt(lineNum, '902');
    }

    return `${lineNum}  OUT`;
}
function hlt(line, lineNum) {
    if (!errorstop) {
        setAt(lineNum, '000');
    }

    return `${lineNum}  HLT`;
}
function dat(line, lineNum) {
    var line = line.split(' ').filter(x => x !== '');

    var address = line[1];
    if (address === undefined) {
        address = '0';
    }
    if (address.length >= 3) {
        error(lineNum, `INVALID ADDRESS ERROR -<br> &emsp;&emsp; Traceback (most recent call):<br>"${line[0]+' '+line[1]}" <`, 'red')
        errorstop = true;
    }
    else if (address.length === 1) {
        address = `0${address}`;
    }
    
    if (!errorstop) {
        setAt(lineNum, numlen3(address));
    }

    return `${lineNum}  DAT    ${address}`;
}
function brz(line, lineNum) {
    var address = getAddress(line, lineNum);

    if (!errorstop) {
        setAt(lineNum, `7${address}`);
    }

    return `${lineNum}  BRZ    ${address}`;
}
function brp(line, lineNum) {
    var address = getAddress(line, lineNum);

    if (!errorstop) {
        setAt(lineNum, `8${address}`);
    }

    return `${lineNum}  BRP    ${address}`;
}
function bra(line, lineNum) {
    var address = getAddress(line, lineNum);

    if (!errorstop) {
        setAt(lineNum, `6${address}`);
    }

    return `${lineNum}  BRA    ${address}`;
}


function error(line, txt, color) {
    log(txt, color);

    // wiggles console bar 
    document.getElementById('bar').setAttribute('class', 'wiggle');
        
    // gets code in text form
    var input = '';
    var editor = document.getElementById('lines');
    for (i=0; i<editor.children.length; i++) {
        input += editor.children[i].getElementsByTagName('span')[0].id + 'wontguess' + editor.children[i].getElementsByTagName('span')[0].innerText + '\n';
    }

    var lines = input.split('\n');

    // removes all comments
    for (i=0; i < lines.length; i++) {
        if (lines[i].includes('//')) {
            lines[i] = lines[i].substring(0, lines[i].indexOf('//'));
        }
    }
    
    // removes all empty lines from lines list
    for (i=0; i < lines.length; i++) {
        if (lines[i].split('wontguess').length === 1) {
            lines.splice(i, 1);
            i--;
        }
        else if (lines[i].split('wontguess')[1] === '') {
            lines.splice(i, 1);
            i--;
        }
        else if (!lines[i].split('wontguess')[1].replace(/\s/g, '').length) {
            lines.splice(i, 1);
            i--;
        }
    }
    
    document.getElementById(lines[parseInt(line)].split('wontguess')[0]).parentElement.style.backgroundColor = 'rgba(255,0,0,0.3)';
    clipsay('Uh-oh! looks like your code has an error. Click compile when it is ready.', 'red');
}


// scale page
window.onresize = function(event) {
    scale();
};

function scale() {
    var w = window.innerWidth;

    var left = document.getElementById('leftDiv').offsetWidth;
    var right = document.getElementById('rightDiv').offsetWidth;
    var con = document.getElementById('console').offsetWidth;
    
    var scale = w/(left+right+con) - 0.05
    if (scale <= 0.75) {
        scale = 0.75;
    }
    else if (scale >= 1.25) {
        scale = 1.25;
    }
    document.body.style.transform = `scale(${scale}, ${scale}) `;

    document.body.style.visibility = 'visible';
}