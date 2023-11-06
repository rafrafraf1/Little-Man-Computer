counter = 0;
accumulator = 0;

speed = 3;
revspeed = 3;

play = false;
wait = false;

change = 3;
delay = 400;

checkLine = false;
turn = false;

altwait = false;

currentInstruction = 'none';

function clipsay(text, color) {
    var msg = document.getElementById('clipMsg');
    msg.style.color = color;
    msg.innerText = text;
}

function updateAcc() {
    stringAcc = `${accumulator}`;
    if (accumulator < 0) {
        // if accumulator val is negative
        tmp = Math.abs(accumulator);
        stringAcc = `${tmp}`;
        while (stringAcc.length <= 2) {
            stringAcc = `-0${tmp}`;
        }
        if (stringAcc.length === 3) {
            stringAcc = `-${stringAcc}`;
        }
    }
    else {
        while (stringAcc.length <= 2) {
            stringAcc = `0${stringAcc}`;
        }    
    }
    
    document.getElementById('accumulator').value = stringAcc;
}

function updateCounter() {
    var counterOutput = document.getElementById('counter');
    stringCounter = counter.toString();
    if (stringCounter.length === 1) {
        stringCounter = `0${stringCounter}`;
    }

    counterOutput.value = stringCounter;
}
function highlightMemory() {
    var all = document.getElementsByClassName('highlight');
    if (all.length === 1) {
        all[0].classList.remove('highlight');
    }
    document.getElementById(`${counter}`).classList.add('highlight');
}


function setSpeed() {
    var array1 = [1,2,3,4,5,6,5,4,3,2,1];
    var val = parseInt(document.getElementById('speedSlider').value);

    revspeed = array1[val+4];
    speed = val;
}

function checkline() {
    if (autoplay) {
        checkLine = true;
    }
    else {
        document.getElementById('runBtn').click();
        turn = true;
    }
}

function toggleRun() {
    //var lines = document.getElementById('interpret').value;
    if (play === false) {
        change = 3;

        document.getElementById('runBtn').innerHTML = `<div style='transform: translate(0, 27%); margin-left: 9px; user-select: none'>STOP &#9724;</div>`;;
        document.getElementById('runBtn').setAttribute('class', 'box2 to-top2');
        play = true;

        document.getElementById('clipPaused').style.opacity = '0';

        if (turn) {
            checkLine = true;
            turn = false;
        }

        start();
    }
    else {
        document.getElementById('runBtn').innerHTML = `<div style='transform: translate(0, 27%); margin-left: 9px; user-select: none'>RUN &#x25BA;</div>`;;
        document.getElementById('runBtn').setAttribute('class', 'box to-top');
        play = false;
        change = 0;

        document.getElementById('clipPaused').style.opacity = '1';
    }
}

function start() {
    if (play) {
        var counterOutput = document.getElementById('counter');
        setTimeout( function() {
            if (wait === false) {
                
                clipsay('Fetch cycle - gets current instruction and adds 1 to program counter.', 'black');
                wait = true;
                // FETCH CYCLE ------------------------------------------------------------
                // move counter data to alu and add or minus then return it to counter
                moveCounter(1);
                // get data from memory address and put values into instruction and address reg
                var data = document.getElementById('registersdata');
                goToReg(data, counter, false);
                // /FETCH CYCLE ------------------------------------------------------------

                stringCounter = counter.toString();
                if (stringCounter.length === 1) {
                    stringCounter = `0${stringCounter}`;
                }
                counterOutput.value = stringCounter;

                var interval = setInterval(function() {
                    if (currentInstruction != 'none') {
                        clearInterval(interval);

                        if (currentInstruction === '901') { // INP
                            inp_();
                        }
                        if (currentInstruction[0] === '3') { // STA
                            sta_(currentInstruction.substr(1));
                        }
                        if (currentInstruction[0] === '5') { // LDA
                            lda_(currentInstruction.substr(1));
                        }
                        if (currentInstruction[0] === '1') { // ADD
                            add_(currentInstruction.substr(1));
                        }
                        if (currentInstruction[0] === '2') { // SUB
                            sub_(currentInstruction.substr(1));
                        }
                        if (currentInstruction === '902') { // OUT
                            out_();
                        }
                        if (currentInstruction[0] === '0') { // HLT
                            hlt_();
                        }
                        if (currentInstruction[0] === '6') { // BRA
                            bra_(currentInstruction.substr(1));
                        }
                        if (currentInstruction[0] === '7') { // BRZ
                            if (parseInt(document.getElementById('accumulator').value) === 0) {
                                bra_(currentInstruction.substr(1));
                            }
                            else {
                                wait = false;
                            }
                        }
                        if (currentInstruction[0] === '8') { // BRP
                            if (parseInt(document.getElementById('accumulator').value) >= 0) {
                                bra_(currentInstruction.substr(1));
                            }
                            else {
                                wait = false;
                            }
                        }

                        currentInstruction = 'none';
                    }
                }, 100)
                
            }
            
            start();
        }, delay/speed);
    }
}

// ---------------------------------------------- INP ---------------------------------------------- //
function inp_() {
    var interval = setInterval( function() {
        if (checkLine) {
            checkLine = false;
            clearInterval(interval);

            clipsay('Input required.', 'red');

            var input = document.getElementById('userInput');
            input.readOnly = false;

            input.focus();
            input.addEventListener('keypress', function(e) {
                // on enter in input
                if (e.key === 'Enter') {
                    if (input.value.length >= 1) {
                        accumulator = input.value;

                        var data = document.getElementById('inputdata');
                        data.style.opacity = '1';
                        data.innerHTML = input.value;
                        var acc = document.getElementById('accumulator');
                        goToInp(data, acc);
                        clipsay('Input value is loaded into accumulator.', 'black');

                        input.value = '';
                        input.readOnly = true;
                        return;
                    }
                }
            });  
        }
    }, 100)
}
async function goToInp(element, target) {
    var next = false;
    var last = false;

    var x = element.offsetLeft;
    var y = element.offsetTop;

    var tx = target.offsetLeft + target.offsetWidth;
    var ty = target.offsetTop;

    // go right to circuit
    var i = 1;
    var timerx = setInterval( function() {
        if (!(i%revspeed)) {
            var newX = element.offsetLeft + change;
            element.style.left = `${newX}px`;

            if (element.offsetLeft + element.offsetWidth/2.5 >= tx) {
                next = true;
                clearInterval(timerx);
            }        
        }
        i++;
    }, delay/150);

    // go up circuit to y pos of ACC
    var timer = setInterval( function() {
        if (next == true) {
            clearInterval(timer);
            var i = 1;
            var timery = setInterval( function() {
                if (!(i%revspeed)) {
                    var newY = element.offsetTop - change;
                    element.style.top = `${newY}px`;
                    if (element.offsetTop <= -ty +(element.offsetHeight/3.2)) {
                        clearInterval(timery);
                        last = true;
                    }     
                }
                i++;
            }, delay/150);
        }
    },100)

    // go left into ACC
    var lastTimer = setInterval( function() {
        if (last == true) {
            clearInterval(lastTimer);
            var i = 1;
            var timerx2 = setInterval( function() {
                if (!(i%revspeed)) {
                    var newX = element.offsetLeft - change;
                    element.style.left = `${newX}px`;

                    if (element.offsetLeft <= (tx -(target.offsetWidth/2) -(element.offsetWidth/2) )) {
                        clearInterval(timerx2);

                        // finished moving inp to acc -----------------------------
                        element.style.opacity = '0';
                        element.style.left = `${x}px`;
                        element.style.top = `${y}px`;
                        element.style.backgroundColor = 'red';
                        element.innerText = '';
                        updateAcc();

                        wait = false;
                    }     
                }
                i++;
            }, delay/150);
        }
    }, 100)
}
// ---------------------------------------------- /INP ---------------------------------------------- //

// ---------------------------------------------- STA ---------------------------------------------- //
function sta_(line) {
    var interval = setInterval( function() {
        if (checkLine) {
            checkLine = false;

            clearInterval(interval);

            var address = line;

            clipsay(`Store value in accumulator in RAM address ${parseInt(address)}.`, 'black');
            if (logT) {
                log(`STA contents of ACC in RAM address ${parseInt(address)}.`, 'orange')
            }

            // address data
            var element = document.getElementById('ARdata');
            moveToRam(address, address, element, 'red', true);

            return;
        }
    }, 100)
}
function moveToRam(address, value, element, color, atf) {
    var target = document.getElementById('counterContainer');

    if (atf) {
        // instant mode
        if (instant) {
            var v = parseInt(document.getElementById('accumulator').value);
            var e = document.getElementById('ACCdata');
            moveToRam(address, v, e, 'blue', false);
            return;
        }

        element.style.left = `${target.offsetLeft + target.offsetWidth - element.offsetWidth*1.5}px`;
    }
    else {
        // instant mode
        if (instant) {
            setAt(address, numlen3(value));
            setTimeout(function() {
                wait = false;
            }, (delay*2)/speed)
            return;
        }

        element.style.left = `${target.offsetLeft + target.offsetWidth - element.offsetWidth*2.5}px`;
    }
    
    element.style.backgroundColor = color;
    element.innerHTML = parseInt(value);
    element.style.opacity = '1';

    var next = false;
    var last = false;
    var third = false;
    var final = false;

    var memoryLocation = document.getElementById(parseInt(address));

    var x = element.offsetLeft;
    var y = element.offsetTop;
    var w = element.offsetWidth;
    var h = element.offsetHeight;

    // registers data goes to right of counter
    var newX = element.offsetLeft;
    var i = 1;
    var timerx = setInterval( function() {
        if (!(i%revspeed)) {
            newX = newX + change;
            element.style.left = `${newX}px`;
            if (element.offsetLeft >= (target.offsetLeft + target.offsetWidth)-w/1.5) {
                next = true;
                clearInterval(timerx)
            } 
        }
        i++;
    }, delay/150);            

    // registers data goes down to circuit line
    var timer = setInterval( function() {
        if (next == true) {
            clearInterval(timer);
            var target2 = document.getElementById("90");
            target2 = target2.offsetTop-target2.offsetHeight*3.2;

            var newY = element.offsetTop;

            var i=1;
            var timery = setInterval( function() {

                if (!(i%revspeed)) {
                    newY = newY + change;
                    element.style.top = `${newY}px`;
                    if (element.offsetTop - element.offsetHeight >= target2) {
                        clearInterval(timery);
                        third = true;

                        // acc data
                        if (atf) {
                            var v = parseInt(document.getElementById('accumulator').value);
                            var e = document.getElementById('ACCdata');
                            moveToRam(address, v, e, 'blue', false);    
                        }
                    }
                }
                i++;
            }, delay/150);
        }
    },100)

    // go right on circuit to ram
    var timer2 = setInterval( function() {
        if (third == true) {
            clearInterval(timer2);
            var target3 = element.offsetLeft + w;

            var newX = element.offsetLeft;

            var i = 1;
            var timerx = setInterval( function() {  
                if (!(i%revspeed)) {
                    newX = newX + change;
                    element.style.left = `${newX}px`;
                    if (element.offsetLeft >= target3) {
                        clearInterval(timerx);
                        last = true;
                    }
                }
                i++; 
            }, delay/150);           
        }
    },100)

    // go up the circuit to the y position of memory address
    var lastTimer = setInterval( function() {
        if (last == true) {
            clearInterval(lastTimer);
            var target4 = memoryLocation.offsetTop - memoryLocation.offsetHeight*3.2;

            var newY = element.offsetTop;

            var i = 1;
            var timery2 = setInterval( function() {   
                if (!(i%revspeed)) {
                    newY = newY - change;
                    element.style.top = `${newY}px`;

                    if (element.offsetTop - element.offsetHeight <= target4) {
                        clearInterval(timery2);
                        final = true;
                    }     
                }
                i++;
            }, delay/150);
        }
    }, 100)

    // go right into ram to memory address
    var finalTimer = setInterval( function() {
        if (final == true) {
            clearInterval(finalTimer);
            var target5 = memoryLocation.offsetLeft + memoryLocation.offsetWidth*4.9;

            var newX = element.offsetLeft;
            
            var i = 1;
            var timerx2 = setInterval( function() {  
                if (!(i%revspeed)) {
                    newX = newX + change;
                    element.style.left = `${newX}px`;

                    if (element.offsetLeft >= target5) {
                        clearInterval(timerx2);
                        element.style.left = `${x}px`;
                        element.style.top = `${y}px`;
                        element.style.opacity = '0';
                        element.innerText = '';
                        
                        if (!atf) {
                            // finished moving acc and address data to ram -----------------------------
                            setAt(address, numlen3(value));
                            wait = false;
                        }
                    }     
                }
                i++;    
            }, delay/150);
        }
    }, 100)
}
// ---------------------------------------------- /STA ---------------------------------------------- //

// ---------------------------------------------- LDA ---------------------------------------------- //
function lda_(line) {
    var interval = setInterval( function() {
        if (checkLine) {
            checkLine = false;
            clearInterval(interval);

            clipsay(`Load value at RAM address ${parseInt(address)} into accumulator.`, 'black');
            if (logT) {
                log(`LDA contents of RAM address ${parseInt(address)} into ACC.`, 'orange')
            }

            var address = line;

            // instant mode
            if (instant) {
                var memoryLocation = document.getElementById(parseInt(address));
                var element = memoryLocation.getElementsByTagName('input')[0].value;
                accumulator = element;
                updateAcc();
                setTimeout(function() {
                    wait = false;
                }, (delay*2)/speed)
                return;
            }

            // address data element
            var element = document.getElementById('ARdata');

            // get value in ram address and put into acc
            
            goToReg(element, parseInt(address), true);

            return;
        }
    }, 100)
}
// ---------------------------------------------- /LDA ---------------------------------------------- //

// ---------------------------------------------- ADD SUB ---------------------------------------------- //
aluDelay = false;
operDelay = false;

function add_(line) {
    var interval = setInterval( function() {
        if (checkLine) {
            checkLine = false;
            clearInterval(interval);

            var address = line;

            clipsay(`Load value at RAM address ${parseInt(address)}.`, 'black');

            // instant mode
            if (instant) {
                var memoryLocation = document.getElementById(parseInt(address));
                var element = memoryLocation.getElementsByTagName('input')[0].value;
                accumulator = parseInt(accumulator) + parseInt(element);
                updateAcc();
                setTimeout(function() {
                    wait = false;
                }, (delay*2)/speed)
                return;
            }

            // address data element
            var element = document.getElementById('ARdata');

            // get value in ram address and put into alu, add and put into acc
            goToReg(element, parseInt(address), true, false, true);

            // get value from acc and add to other data value
            aluOper('add');

            return;
        }
    }, 100)
}
function sub_(line) {
    var interval = setInterval( function() {
        if (checkLine) {
            checkLine = false;
            clearInterval(interval);

            var address = line;

            clipsay(`Load value at RAM address ${parseInt(address)}.`, 'black');

            // instant mode
            if (instant) {
                var memoryLocation = document.getElementById(parseInt(address));
                var element = memoryLocation.getElementsByTagName('input')[0].value;
                accumulator = parseInt(accumulator) - parseInt(element);
                updateAcc();
                setTimeout(function() {
                    wait = false;
                }, (delay*2)/speed)
                return;
            }

            // address data element
            var element = document.getElementById('ARdata');

            // get value in ram address and put into alu, add and put into acc
            goToReg(element, parseInt(address), true, false, true);

            // get value from acc and add to other data value
            aluOper('sub');

            return;
        }
    }, 100)
}
function aluOper(type) {
    var next = false;
    var last = false;

    var alu = document.getElementById('alu');

    var element = document.getElementById('ACCOperdata');
    var child = element.getElementsByTagName('div')[0];
    if (type === 'add') {
        child.innerHTML = '+';
    }
    else {
        child.innerHTML = '-';
    }
    element.innerHTML = parseInt(document.getElementById('accumulator').value);
    element.appendChild(child);
    element.style.backgroundColor = 'blue';

    var ox = element.offsetLeft;
    var oy = element.offsetTop;

    element.style.left = `${element.offsetLeft + element.offsetWidth*1.4}px`;
    element.style.top = `${element.offsetTop + 4}px`;

    var x = element.offsetLeft;
    var y = element.offsetTop;

    // counter data left to alu left side x pos
    var timer = setInterval(function() {
        if (operDelay) {
            operDelay = false;
            clearInterval(timer);
            
            if (type === 'add') {
                clipsay(`Add value to contents of accumulator.`, 'black');
                if (logT) {
                    log('ADD value to contents of ACC.', 'orange')
                }
            }
            else {
                clipsay(`Subtract value from contents of accumulator.`, 'black');
                if (logT) {
                    log('SUB value from contents of ACC.', 'orange')
                }
            }

            element.style.opacity = '1';

            var i = 1;
            var timerx = setInterval( function() {
                if (!(i%revspeed)) {
                    var newX = element.offsetLeft - change;
                    element.style.left = `${newX}px`;
                    if (element.offsetLeft <= x - element.offsetWidth*1.2) {
                        next = true;
                        clearInterval(timerx);
                    }        
                }
                i++;
            }, delay/150);
                }
    }, 100)

    // go down into alu
    var timer2 = setInterval( function() {
        if (next == true) {
            clearInterval(timer2);
            var newY = element.offsetTop;
            
            var i = 1;
            var timery = setInterval( function() {
                if (!(i%revspeed)) {
                    newY = newY + change;
                    element.style.top = `${newY}px`;

                    if (element.offsetTop - element.offsetHeight*1.1 >= alu.offsetTop/2) {
                        clearInterval(timery);
                        
                        // ------------------------- add value to other data node
                        child.style.opacity = '1';

                        setTimeout(function() {
                            element.style.opacity = '0';
                            child.style.opacity = '0';

                            aluDelay = type;

                            element.style.left = `${ox}px`;
                            element.style.top = `${oy}px`;
                            element.style.backgroundColor = 'red';
                            element.innerText = '';
                            element.append(child);
                        }, 1500/speed)
                    }     
                }
                i++;
            }, delay/150);         
        }
    },100)
    
}
// ---------------------------------------------- /ADD SUB ---------------------------------------------- //

// ---------------------------------------------- OUT ---------------------------------------------- //
function out_() {
    var interval = setInterval( function() {
        if (checkLine) {
            checkLine = false;
            clearInterval(interval);

            clipsay(`Output the contents of accumulator.`, 'black');
            if (logT) {
                log('OUT contents of ACC.', 'orange')
            }

            moveAccToOut();

            return;
        }
    }, 100)
}
function moveAccToOut() {
    var output = document.getElementById("outputText");

    // instant mode
    if (instant) {
        output.value += `${parseInt(document.getElementById('accumulator').value)}\n`
        setTimeout(function() {
            wait = false;
        }, (delay*2)/speed)
        return;
    }

    // address data element
    var element = document.getElementById('ACCdata');

    element.style.opacity = '1';
    element.innerHTML = accumulator;
    element.style.backgroundColor = 'blue';

    var next = false;
    var last = false;

    var ox = element.offsetLeft;

    var x = element.offsetLeft + element.offsetWidth*1.5;
    element.style.left = `${x}px`;
    var y = element.offsetTop;
    var w = element.offsetWidth;
    var h = element.offsetHeight;

    // output data goes to right of counter
    var target = document.getElementById('counterContainer');
    var newX = element.offsetLeft;

    var i = 1;
    var timerx = setInterval( function() {
        if (!(i%revspeed)) {
            newX = newX + change;
            element.style.left = `${newX}px`;
            if (element.offsetLeft >= (target.offsetLeft + target.offsetWidth)-w/1.5) {
                next = true;
                clearInterval(timerx);
            }    
        }
        i++;
    }, delay/150);
    
    // output data goes up to circuit line
    var timer = setInterval( function() {
        if (next == true) {
            clearInterval(timer);

            var target2 = output;
            target2 = target2.offsetTop - target2.offsetHeight;

            var newY = element.offsetTop;
            var i=1;
            var timery = setInterval( function() {
                if (!(i%revspeed)) {
                    newY = newY - change;
                    element.style.top = `${newY}px`;
                    if (element.offsetTop <= target2) {
                        clearInterval(timery);
                        last = true;
                    }
                }
                i++;
            }, delay/150);
        }
    },100)

    var timer2 = setInterval(function() {
        if (last === true) {
            clearInterval(timer2)
            var target3 = output;
            target3 = target3.offsetLeft + target3.offsetWidth/2;
            var i = 1;
            var timerx = setInterval( function() {
                if (!(i%revspeed)) {
                    newX = newX - change;
                    element.style.left = `${newX}px`;
                    if (element.offsetLeft <= target3) {
                        clearInterval(timerx);

                        // ------------------------------- output finished
                        output.value += `${parseInt(document.getElementById('accumulator').value)}\n`;

                        element.style.opacity = '0';
                        element.style.left = `${ox}px`;
                        element.style.top = `${y}px`;
                        element.style.backgroundColor = 'red';
                        element.innerText = '';

                        wait = false;
                    }    
                }
                i++;
            }, delay/150);
        }
    }, 100)
}
// ---------------------------------------------- /OUT ---------------------------------------------- //

// ---------------------------------------------- HLT ---------------------------------------------- //
function hlt_() {
    var interval = setInterval( function() {
        if (checkLine) {
            checkLine = false;
            clearInterval(interval);

            clipsay('Program halted. Click reset to run current (or new) program again.');
            if (logT) {
                log('HLT', 'orange')
            }

            wait = true;
            setTimeout(function() {
                wait = false;
            }, 300)
            
            document.getElementById('runBtn').click();

            altwait = true;
        }
    }, 100)
}
// ---------------------------------------------- /HLT ---------------------------------------------- //

// ---------------------------------------------- BRA BRZ BRP ---------------------------------------------- //
function bra_(line) {
    var interval = setInterval( function() {
        if (checkLine) {
            checkLine = false;
            clearInterval(interval);
            var address = line;
            
            clipsay(`Branch to RAM address ${parseInt(address)}.`, 'black');
            if (logT) {
                log(`BRA to RAM address ${parseInt(address)}.`, 'orange')
            }

            // instant mode
            if (instant) {
                counter = parseInt(address);
                updateCounter();
                highlightMemory();
                setTimeout(function() {
                    wait = false;
                }, (delay*2)/speed)
                return;
            }

            branch(address);
        }
    }, 100)
}
function branch(address) {
    var target = document.getElementById('counterContainer');

    var element = document.getElementById('ARdata');

    var x = element.offsetLeft;
    var y = element.offsetTop;

    element.style.left = `${target.offsetLeft + target.offsetWidth - element.offsetWidth*1.5}px`;
    
    element.style.backgroundColor = 'red';
    element.innerHTML = parseInt(document.getElementById('addressreg').value);
    element.style.opacity = '1';

    var target1 = document.getElementById('counter');

    var next = false;

    // go to counter y pos
    var i = 1;
    var timery = setInterval( function() {
        if (!(i%revspeed)) {
            var newY = element.offsetTop - change;
            element.style.top = `${newY}px`;
            if (element.offsetTop - element.offsetHeight*1.1 <= target1.offsetTop) {
                next = true;
                clearInterval(timery);
            }        
        }
        i++;
    }, delay/150);

    // go left into counter
    var timer = setInterval( function() {
        if (next == true) {
            clearInterval(timer);

            var newX = element.offsetLeft;
            var i = 1;
            var timerx = setInterval( function() {
                if (!(i%revspeed)) {
                    newX = newX - change;
                    element.style.left = `${newX}px`;
                    if (element.offsetLeft - element.offsetWidth/1.5 <= (target1.offsetLeft)) {
                        clearInterval(timerx);

                        //----------------- branch finished here
                        counter = parseInt(address);
                        updateCounter();
                        highlightMemory();

                        element.style.opacity = '0';
                        element.style.left = `${x}px`;
                        element.style.top = `${y}px`;
                        element.innerText = '';
                        
                        wait = false;
                    }    
                }
                i++;
            }, delay/150);
        }
    },100)
}
// ---------------------------------------------- /BRA BRZ BRP---------------------------------------------- //

// ---------------------------------------------- counter ---------------------------------------------- //
function moveCounter(changeBy) {
    // instant mode
    if (instant) {
        setTimeout(function() {
            counter++;
            updateCounter();
            highlightMemory();
        }, 30)
        return;
    }

    var data = document.getElementById('counterdata');
    data.style.opacity = '1';
    var child = data.getElementsByTagName('div')[0];
    data.innerHTML = counter;
    data.appendChild(child);

    var alu = document.getElementById('alu');
    goToCounter(data, alu, changeBy);
}
async function goToCounter(element, target, changeBy) {
    var next = false;
    var last = false;
    var third = false;

    var x = element.offsetLeft;
    var y = element.offsetTop;

    var tx = target.offsetLeft + target.offsetWidth;
    var ty = target.offsetTop;

    element.style.backgroundColor = 'red';

    // counter data go down to alu
    var i = 1;
    var timery = setInterval( function() {
        if (!(i%revspeed)) {
            var newY = element.offsetTop + change;
            element.style.top = `${newY}px`;
            if (element.offsetTop >= ty/2) {
                next = true;
                clearInterval(timery);
            }        
        }
        i++;
    }, delay/150);
    
    // counter data add 1 and go to right of alu
    var timer = setInterval( function() {
        if (next == true) {
            var oper = document.getElementById('counteroper');
            oper.style.opacity = '1';
            if (changeBy < 0) {
                oper.innerHTML = `${changeBy}`;
            }
            else {
                oper.innerHTML = `+${changeBy}`;
            }
            clearInterval(timer);
            var newX = element.offsetLeft;
            setTimeout( function() {
                oper.style.opacity = '0';
                element.style.backgroundColor = 'blue';
                var child = element.getElementsByTagName('div')[0];
                element.innerText = counter + changeBy;
                element.appendChild(child);

                var i = 1;
                var timerx = setInterval( function() {
                    if (!(i%revspeed)) {
                        newX = newX + change;
                        element.style.left = `${newX}px`;
                        if (element.offsetLeft >= (target.offsetWidth/1.5)) {
                            clearInterval(timerx);
                            third = true;
                        }    
                    }
                    i++;
                }, delay/150);
            }, 1500/(speed));
        }
    },100)

    // counter data go up to program counter
    var timer2 = setInterval( function() {
        if (third == true) {
            clearInterval(timer2);
            var newY = element.offsetTop;
            
            var i = 1;
            var timery = setInterval( function() {
                if (!(i%revspeed)) {
                    newY = newY - change;
                    element.style.top = `${newY}px`;
                    if (element.offsetTop <=  y) {
                        clearInterval(timery);
                        last = true;
                    }     
                }
                i++;
            }, delay/150);         
        }
    },100)

    // counter data go left into program counter
    var lastTimer = setInterval( function() {
        if (last == true) {
            clearInterval(lastTimer);
            var newX = element.offsetLeft - 10;
            
            var i = 1;
            var timerx2 = setInterval( function() {
                if (!(i%revspeed)) {
                    newX = newX - change;
                    element.style.left = `${newX}px`;

                    if (element.offsetLeft <= x) {
                        clearInterval(timerx2);

                        // finished moving counter to alu and back -----------------------------
                        element.style.opacity = '0';
                        element.style.left = `${x-10}px`;
                        element.style.top = `${y}px`;
                        counter++;
                        updateCounter();
                    }     
                }
                i++;
            }, delay/150);
        }
    }, 100)
}
// ---------------------------------------------- /counter ---------------------------------------------- //

// ---------------------------------------------- fetch ---------------------------------------------- //
async function goToReg(element, mar, startatAR, finish=true, aos=false) {
    var memoryLocation = document.getElementById(mar);

    // instant mode
    if (!startatAR) {
        if (instant) {
            var element = memoryLocation.getElementsByTagName('input')[0].value;

            var addressreg = document.getElementById('addressreg');
            addressreg.value = element.slice(1);

            var targettmp = document.getElementById("instructionreg");
            targettmp.value = element[0];

            currentInstruction = element;

            clipsay('Fetch done, decoding instruction.', 'black');
            setTimeout(function() {
                checkline();
            }, (delay*2)/speed)
            
            return;
        }
    }

    element.style.opacity = '1';
    element.innerHTML += mar;
    element.style.backgroundColor = 'red';

    var next = false;
    var last = false;
    var third = false;
    var final = false;

    var back1 = false;
    var back2 = false;
    var back3 = false;
    var back4 = false;
    var back5 = false;
    var back6 = false;

    var goToALU = false;
    var upalu = false;
    var rightalu = false;

    if (startatAR) {
        target = document.getElementById('counterContainer')
        element.style.left = `${target.offsetLeft + target.offsetWidth - element.offsetWidth}px`;
    }

    var x = element.offsetLeft;
    var y = element.offsetTop;
    var w = element.offsetWidth;
    var h = element.offsetHeight;

    // registers data goes to right of counter
    var target = document.getElementById('counterContainer');
    var newX = element.offsetLeft;

    var i = 1;
    var timerx = setInterval( function() {
        if (!(i%revspeed)) {
            newX = newX + change;
            element.style.left = `${newX}px`;
            if (element.offsetLeft >= (target.offsetLeft + target.offsetWidth)-w/1.5) {
                next = true;
                clearInterval(timerx);
            }    
        }
        i++;
    }, delay/150);
    
    // registers data goes down to circuit line
    var timer = setInterval( function() {
        if (next == true) {
            clearInterval(timer);
            var target2 = document.getElementById("90");
            target2 = target2.offsetTop-target2.offsetHeight*3.2;
            if (startatAR) {
                target2 = target2 + element.offsetHeight;
            }

            var newY = element.offsetTop;

            var i=1;
            var timery = setInterval( function() {

                if (!(i%revspeed)) {
                    newY = newY + change;
                    element.style.top = `${newY}px`;
                    if (element.offsetTop >= target2) {
                        clearInterval(timery);
                        third = true;
                    }
                }
                i++;
            }, delay/150);
        }
    },100)

    // go right on circuit to ram
    var timer2 = setInterval( function() {
        if (third == true) {
            clearInterval(timer2);
            var target3 = element.offsetLeft + w;

            var newX = element.offsetLeft;

            var i = 1;
            var timerx = setInterval( function() {  
                if (!(i%revspeed)) {
                    newX = newX + change;
                    element.style.left = `${newX}px`;
                    if (element.offsetLeft >= target3) {
                        clearInterval(timerx);
                        last = true;
                    }
                }
                i++; 
            }, delay/150);           
        }
    },100)

    // go up the circuit to the y position of memory address
    var lastTimer = setInterval( function() {
        if (last == true) {
            clearInterval(lastTimer);
            var target4 = memoryLocation.offsetTop - memoryLocation.offsetHeight*3.2;
            if (startatAR) {
                target4 = target4 + element.offsetHeight;
            }

            var newY = element.offsetTop;

            var i = 1;
            var timery2 = setInterval( function() {   
                if (!(i%revspeed)) {
                    newY = newY - change;
                    element.style.top = `${newY}px`;

                    if (element.offsetTop <= target4) {
                        clearInterval(timery2);
                        final = true;
                    }     
                }
                i++;
            }, delay/150);
        }
    }, 100)

    // go right into ram to memory address
    var finalTimer = setInterval( function() {
        if (final == true) {
            clearInterval(finalTimer);
            var target5 = memoryLocation.offsetLeft + memoryLocation.offsetWidth*4.9;

            var newX = element.offsetLeft;
            
            var i = 1;
            var timerx2 = setInterval( function() {  
                if (!(i%revspeed)) {
                    newX = newX + change;
                    element.style.left = `${newX}px`;

                    if (element.offsetLeft >= target5) {
                        clearInterval(timerx2);
                        element.style.backgroundColor = 'blue';
                        element.innerText = memoryLocation.getElementsByTagName('input')[0].value;
                        back1 = true;
                    }     
                }
                i++;    
            }, delay/150);
        }
    }, 100)

    // go left out of ram into circuit line
    var backTimer1 = setInterval( function() {
        if (back1 == true) {
            clearInterval(backTimer1);
            var target6 = target.offsetLeft + target.offsetWidth + 8;
            if (startatAR) {
                target6 = target6 + element.offsetWidth/3.5;
            }

            var newX = element.offsetLeft - 10;
            
            var i = 1;
            var timerx2 = setInterval( function() {
                if (!(i%revspeed)) {
                    newX = newX - change;
                    element.style.left = `${newX}px`;

                    if (element.offsetLeft <= target6) {
                        clearInterval(timerx2);
                        back2 = true;
                    }     
                }
                i++; 
            }, delay/150);
        }
    }, 100)

    // go down the circuit to the bottom position of ram
    var backTimer2 = setInterval( function() {
        if (back2 == true) {
            clearInterval(backTimer2);
            var target2 = document.getElementById("90");
            target2 = target2.offsetTop-target2.offsetHeight*3.2;
            if (startatAR) {
                target2 = target2 + element.offsetHeight;
            }

            var newY = element.offsetTop;
            
            var i = 1;
            var timery = setInterval( function() {
                if (!(i%revspeed)) {
                    newY = newY + change;
                    element.style.top = `${newY}px`;
                    if (element.offsetTop >= target2) {
                        clearInterval(timery);
                        back3 = true;
                    }     
                }
                i++;
            }, delay/150);
        }
    },100)

    // go left on circuit away from ram
    var backTimer3 = setInterval( function() {
        if (back3 == true) {
            clearInterval(backTimer3);
            var target3 = element.offsetLeft - w;

            var newX = element.offsetLeft - 8;
            
            var i = 1;
            var timerx = setInterval( function() {
                if (!(i%revspeed)) {
                    newX = newX - change;
                    element.style.left = `${newX}px`;
                    if (element.offsetLeft <= target3) {
                        clearInterval(timerx);
                        back4 = true;
                        // highlight memory address that the counter is on next
                        highlightMemory();
                    }     
                }
                i++;
            }, delay/150);           
        }
    },100)

    // ----------------------------------------------------- go to AR
    if (!startatAR) {
        // go up circuit line to address register
        var backTimer4 = setInterval( function() {
            if (back4 == true) {
                clearInterval(backTimer4);
                var target2 = document.getElementById("addressreg");
                target2 = target2.offsetTop - h;

                var newY = element.offsetTop;
                
                var i = 1;
                var timery = setInterval( function() {
                    if (!(i%revspeed)) {
                        newY = newY - change;
                        element.style.top = `${newY}px`;
                        if (element.offsetTop <= target2) {
                            clearInterval(timery);
                            back5 = true;
                        }     
                    }
                    i++;
                }, delay/150);
            }
        },100)

        // go left to x pos of instruction register
        var backTimer5 = setInterval( function() {
            if (back5 == true) {
                clearInterval(backTimer5);
                var target3 = document.getElementById('instructionreg');
                target3 = target3.offsetLeft;

                var addressreg = document.getElementById('addressreg');
                var justOnce = true;

                var newX = element.offsetLeft - 8;
                
                var i = 1;
                var timerx = setInterval( function() { 
                    if (!(i%revspeed)) {
                        newX = newX - change;
                        element.style.left = `${newX}px`;
                        if (element.offsetLeft <= target3) {
                            clearInterval(timerx);
                            back6 = true;
                        }

                        if (justOnce && element.offsetLeft <= addressreg.offsetLeft) {
                            addressreg.value = element.innerText.slice(1);
                        }     
                    }
                    i++;
                }, delay/150);           
            }
        },100)

        // go up circuit line to address register
        var backTimer6 = setInterval( function() {
            if (back6 == true) {
                clearInterval(backTimer6);
                var targettmp = document.getElementById("instructionreg");
                target2 = targettmp.offsetTop - targettmp.offsetHeight;

                var newY = element.offsetTop;
                
                var i = 1;
                var timery = setInterval( function() {
                    if (!(i%revspeed)) {
                        newY = newY - change;
                        element.style.top = `${newY}px`;
                        if (element.offsetTop <= target2) {
                            clearInterval(timery);
                            
                            // finished moving address data to ram and back -----------------------------
                            targettmp.value = element.innerText[0];

                            currentInstruction = element.innerText;

                            element.style.opacity = '0';
                            element.style.left = `${x-10}px`;
                            element.style.top = `${y}px`;
                            element.style.backgroundColor = 'red';
                            element.innerText = '';

                            clipsay('Fetch done, decoding instruction.', 'black');
                            setTimeout(function() {
                                checkline();
                            }, (delay/speed)*2)
                        }     
                    }
                    i++;
                }, delay/150);
            }
        },100)    
    }
    // ----------------------------------------------------- go to ACC
    else {
        var acc = document.getElementById('accumulator');

        // go up circuit line to accumulator
        var backTimer4 = setInterval( function() {
            if (back4 == true) {
                clearInterval(backTimer4);
                var i = 1;
                var timery = setInterval( function() {
                    if (!(i%revspeed)) {
                        var newY = element.offsetTop - change;
                        element.style.top = `${newY}px`;
                        if (element.offsetTop -4 <= acc.offsetTop) {
                            clearInterval(timery);
                            last = true;
                            back5 = true;
                        }
                    }
                    i++;
                }, delay/150);
            }
        },100)

        // go left into ACC
        var backTimer5 = setInterval( function() {
            if (back5 == true) {
                clearInterval(backTimer5);
                var i = 1;
                var target = acc.offsetLeft;
                if (!finish) {
                    target = target - 3;
                }

                var first = true;
                var timerx2 = setInterval( function() {
                    if (!(i%revspeed)) {
                        var newX = element.offsetLeft - change;
                        element.style.left = `${newX}px`;

                        if (element.offsetLeft <= target) {
                            clearInterval(timerx2);
                            if (finish) {
                                // finished moving inp to acc -----------------------------
                                accumulator = element.innerText;
                                updateAcc();

                                element.style.opacity = '0';
                                element.style.left = `${x}px`;
                                element.style.top = `${y}px`;
                                element.style.backgroundColor = 'red';
                                element.innerText = '';
                                
                                wait = false;    
                            }
                            else {
                                goToALU = true;
                            }
                        } 

                        // if add or sub then operdelay set to true now
                        if (first && aos && element.offsetLeft <= target + 41.5) {
                            operDelay = true;
                            first = false;
                        } 
                    }
                    i++;
                }, delay/150);
            }
        }, 100)

        // ----------------------------------------- go to alu (ADD OR SUB)
        var alu = document.getElementById('alu');

        // go down into alu
        var alutimer = setInterval( function() {
            if (goToALU === true) {
                clearInterval(alutimer);
                var i = 1;
                var timery = setInterval( function() {
                    if (!(i%revspeed)) {
                        var newY = element.offsetTop + change;
                        element.style.top = `${newY}px`;

                        if (element.offsetTop - element.offsetHeight*1.1 >= alu.offsetTop/2) {
                            clearInterval(timery);
                            upalu = true;
                        }
                    }
                    i++;
                }, delay/150);
            }
        },100)

        // go up to accumulator y pos
        var alutimer2 = setInterval( function() {
            if (upalu == true && aluDelay !== false) {
                clearInterval(alutimer2);

                if (aluDelay === 'add') {
                    element.innerHTML = parseInt(element.innerHTML) + parseInt(acc.value);
                }
                else {
                    element.innerHTML = parseInt(acc.value) - parseInt(element.innerHTML);
                }
                aluDelay = false;
                setTimeout(function() {
                    var i = 1;
                    var timery = setInterval( function() {
                        if (!(i%revspeed)) {
                            var newY = element.offsetTop - change;
                            element.style.top = `${newY}px`;
                            if (element.offsetTop -4 <= acc.offsetTop) {
                                clearInterval(timery);
                                rightalu = true;
                            }
                        }
                        i++;
                    }, delay/150);
                }, 500/speed)
            }
        },100)

        // go right into ACC
        var alutimer3 = setInterval( function() {
            if (rightalu == true) {
                clearInterval(alutimer3);
                var i = 1;
                var timerx2 = setInterval( function() {
                    if (!(i%revspeed)) {
                        var newX = element.offsetLeft + change;
                        element.style.left = `${newX}px`;

                        if (element.offsetLeft - element.offsetWidth/2 >= acc.offsetLeft) {
                            clearInterval(timerx2);

                            // finished moving value to acc -----------------------------
                            accumulator = element.innerText;
                            updateAcc();

                            element.style.opacity = '0';
                            element.style.left = `${x}px`;
                            element.style.top = `${y}px`;
                            element.style.backgroundColor = 'red';
                            element.innerText = '';
                            
                            wait = false;
                        }     
                    }
                    i++;
                }, delay/150);
            }
        }, 100)
    }
}
// ---------------------------------------------- /fetch ---------------------------------------------- //