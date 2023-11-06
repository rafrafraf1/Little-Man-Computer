
function makeRam() {
    var itm = document.getElementById("0");
    
    for (i=1; i < 100; i++) {
        var cln = itm.cloneNode(true);
        cln.id = i;
        cln.getElementsByTagName('h3')[0].innerText = i;
        document.getElementById("ram").appendChild(cln);
    }
    defaultL = document.getElementById("rightDiv").innerHTML;
}

function setAt(ma, val) {
    memory = document.getElementById(`${parseInt(ma)}`);

    memory.getElementsByTagName('input')[0].value = `${val}`;
}

function numlen3(num) {
    num = parseInt(num).toString();
    while (true) {
        if (num.length > 3) {
            return num; // -----------------------------------ERROR HANDLE HERE !!!!!!!!!!!!!
            break;

        }
        if (num.length === 3) {
            return num;
            break;
        }
        num = `0${num}`;
    }
}

function clearR() {
    document.getElementById('resetBtn').setAttribute('onclick', '');
    document.getElementById('resetBtn').setAttribute('class', 'box1');

    clipsay('Awaiting reset. Keep program running until next fetch cycle.', 'black');

    var stall = setInterval(function() {
        if (wait === false || altwait) {
            wait = true;
            clearInterval(stall)

            document.getElementById("rightDiv").innerHTML = defaultL;
            document.getElementById('interpret').innerText = '';

            document.getElementById('resetBtn').disabled = true;
            document.getElementById('resetBtn').setAttribute('onclick', '');
            document.getElementById('resetBtn').setAttribute('class', 'box1');

            document.getElementById('runBtn').innerHTML = `<div style='transform: translate(0, 27%); margin-left: 9px; user-select: none'>RUN &#x25BA;</div>`;
            document.getElementById('runBtn').setAttribute('onclick', '');
            document.getElementById('runBtn').setAttribute('class', 'box');

            document.getElementById('clipPaused').style.opacity = '0';

            document.getElementById('compileBtn').setAttribute('onclick', 'interpret()');
            document.getElementById('compileBtn').setAttribute('class', 'box1 box1A');

            counter = 0;
            accumulator = 0;
            play = false;
            setTimeout(function() {
                wait = false;
            }, 300)

            altwait = false;
            
            checkLine = false;
            turn = false;

            clipsay('System reset. Click compile when your assembly code is complete.', 'black');
        }
    }, 10)
}