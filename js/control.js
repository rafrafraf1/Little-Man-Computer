autoplay = true;
instant = false;

function toggleAutoplay(checked) {
    if (checked) {
        autoplay = true;
    }
    else {
        autoplay = false;
    }
}

function toggleInstant(checked) {
    if (checked) {
        instant = true;
    }
    else {
        instant = false;
    }
}

const adde = `INP
OUT
STA A
// Store input A

INP
OUT
STA B
// Store input B

LDA A
ADD B
// Load A and add B

OUT
HLT
A    DAT
B    DAT`;
const sube = `INP
OUT
STA A
// Store input A

INP
OUT
STA B
// Store input B

LDA A
SUB B
// Load A and subtract B

OUT
HLT
A    DAT
B    DAT`;
const mule = `INP
OUT
STA FIRST

INP
OUT
STA SECOND

LOOP    LDA SECOND
BRZ ENDTHIS
SUB ONE
STA SECOND
LDA ANS
ADD FIRST
STA ANS
BRA LOOP

ENDTHIS   LDA ANS
OUT
SUB ANS
STA ANS
HLT

FIRST   DAT
SECOND   DAT
ONE    DAT 1
ANS   DAT 0`;
const dive = `INP M
OUT
STA M

INP N
OUT
STA N

LOOP   LDA M
BRZ END
SUB N
STA M
LDA ANS
ADD ONE
STA ANS
BRA LOOP

END   LDA ANS
OUT
SUB ANS
STA ANS
HLT

M    DAT
N    DAT
ANS    DAT 0
ONE   DAT 1`;
function example(type) {
    if (type === 'add') {
        paste(adde);
    }
    if (type === 'sub') {
        paste(sube);
    }
    if (type === 'mul') {
        paste(mule);
    }
    if (type === 'div') {
        paste(dive);
    }

    document.getElementById('compileBtn').setAttribute('onclick', 'interpret()');
    document.getElementById('compileBtn').setAttribute('class', 'box1 box1A');
    document.getElementById('clearBtn').style.display = 'block';
}
function paste(data) {
    clearEditor();

    setTimeout(function() {
        var done = false;
        var editor = document.getElementById('lines');

        // creates all the lines needed
        var lines = data.split('\n');
        for (x=0; x < lines.length; x++) {
            addLine(`l${0}`);
            
            if (x === lines.length-1) {
                done = true;
            }
        }
        var wait = setInterval(function() {
            if (done) {
                clearInterval(wait);
                for (x=0; x < lines.length; x++) {
                    editor.children[x].getElementsByTagName('span')[0].innerText = lines[x];

                    if (x === lines.length-1) {
                        updateEditor();
                    }
                }        
            }
        }, 100)    
    }, 50)
    
}

function toggleDark(checked) {
    var editor = document.getElementById('editor');
    var interpret = document.getElementById('interpret');

    // dark theme
    if (checked) {
        // editor & interpreter
        editor.style.backgroundColor = 'rgb(12, 12, 73)';
        interpret.style.backgroundColor = 'rgb(12, 12, 73)';
        editor.style.color = 'white';
        interpret.style.color = 'white';

        // background
        document.body.style.backgroundColor = "rgb(8, 8, 42)";
        
        // notice
        document.getElementById('notice').style.color = '#a32d53';

        // bottom page text
        document.getElementById('container2').style.backgroundColor = 'rgb(32, 32, 61)';
        document.getElementById('examples').style.color = 'rgb(233, 231, 248)';
        document.getElementById('key').style.color = 'rgb(233, 231, 248)';

        // main
        document.getElementById('leftDiv').style.backgroundColor = 'rgb(19, 84, 114)';
        document.getElementById('rightDiv').style.backgroundColor = 'rgb(30, 122, 30)';

        document.getElementById('cpu').style.backgroundColor = 'rgb(211, 145, 22)';
        document.getElementById('alu').style.backgroundColor = 'rgb(211, 145, 22)';

        document.getElementById('output').style.backgroundColor = 'rgb(202, 13, 202)';
        document.getElementById('inputPrompt').style.backgroundColor = 'rgb(129, 178, 201)';

        // buttons background
        document.getElementById('btnsBackground').style.backgroundColor = 'rgb(12, 12, 73)';
    }
    // light theme
    else {
        editor.style.backgroundColor = 'rgb(251,247,245)';
        interpret.style.backgroundColor = 'rgb(251,247,245)';
        editor.style.color = 'black';
        interpret.style.color = 'black';

        document.body.style.backgroundColor = "#f8f8ff";

        document.getElementById('notice').style.color = 'red';

        document.getElementById('container2').style.backgroundColor = 'rgb(243, 238, 217)';
        document.getElementById('examples').style.color = 'black';
        document.getElementById('key').style.color = 'black';

        document.getElementById('leftDiv').style.backgroundColor = 'rgb(32, 140, 190)';
        document.getElementById('rightDiv').style.backgroundColor = 'rgb(4, 165, 4)';

        document.getElementById('cpu').style.backgroundColor = 'orange';
        document.getElementById('alu').style.backgroundColor = 'orange';

        document.getElementById('output').style.backgroundColor = 'magenta';
        document.getElementById('inputPrompt').style.backgroundColor = '#9CC3D5FF';

        document.getElementById('btnsBackground').style.backgroundColor = 'rgb(49, 49, 149)';
    }
}