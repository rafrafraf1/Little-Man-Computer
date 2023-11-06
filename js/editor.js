lines = 0;
instructions2tmp = ['INP', 'STA', 'LDA', 'ADD', 'SUB', 'OUT', 'HLT', 'DAT', 'BRZ', 'BRP', 'BRA'];
instructions2 = []
for (i=0;i<instructions2tmp.length;i++) {
    instructions2.push(instructions2tmp[i].toLowerCase());
    instructions2.push(instructions2tmp[i]);
}

// focus on line
function focusLine(line) {
    var num = line.split('line')[1];
    document.getElementById(`l${num}`).focus();
}
// select line
function selectLine(line) {
    var num = line.split('l')[1];

    document.getElementById(`line${num}`).style.backgroundColor = 'rgba(180,180,180,0.15)';

    var line = document.getElementById(`l${num}`);

    // remove all coloring from line selected
    var newline = line.innerHTML;
    if (newline.includes(`<font color="blue">`)) {
        newline = newline.replace(/<font color="blue">/g, "");
    }
    if (newline.includes(`<font color="orange">`)) {
        newline = newline.replace(/<font color="orange">/g, "");
    }
    if (newline.includes(`<font color="pink">`)) {
        newline = newline.replace(/<font color="pink">/g, "");
    }
    if (newline.includes(`</font>`)) {
        newline = newline.split('</font>').join('');
    }

    if (newline.includes(`<span class="comment" style="color: green">`)) {
        newline = newline.replace(/<span class="comment" style="color: green">/g, "");
    }
    if (newline.includes(`</span>`)) {
        newline = newline.split('</span>').join("");
    }

    line.innerHTML = newline;

    moveCursorAtTheEnd(line);
}
//unselect line
function unselectLine(line) {
    var num = line.split('l')[1];
    var line = document.getElementById(`l${num}`);
    var highlightLine = document.getElementById(`line${num}`);

    var txt = line.innerText;
    highlightLine.style.backgroundColor = 'transparent';

    // functions
    if (!line.innerHTML.includes('font')) {
        // functions coloring
        for (i = 0; i < instructions2.length; i++) {
            if (txt.includes(instructions2[i])) {
                var nxt = txt[txt.indexOf(instructions2[i])+3];
                if (nxt === ' ' || nxt === undefined ||  /\s$/.test(nxt)) {
                    var color = 'orange';
                    if (txt.includes('dat') || txt.includes('DAT')) {
                        color = 'blue';
                    }

                    var str = line.innerHTML.split(instructions2[i]);
                    str = str[0] + instructions2[i].fontcolor(color) + str[1];
                    
                    line.innerHTML = str;
                }
            } 
        }
    }
    else {
        var none = true;
        var wait1 = true;

        // if line contains instruction keep color but only color instruction
        for (i = 0; i < instructions2.length; i++) {
            if (txt.includes(instructions2[i])) {
                var nxt = txt[txt.indexOf(instructions2[i])+3];
                if ( (nxt === ' ' || nxt === undefined ||  /\s$/.test(nxt))) {
                    none = false;

                    var str = line.innerHTML.split('</font>').join('');

                    var position = str.indexOf(instructions2[i]) + 3;
                    var output = str.substring(0, position) + '</font>' + str.substring(position);
                    
                    line.innerHTML = output;
                }
            }
            if (i === instructions2.length-1) {
                wait1 = false;
            }
        }
        if (wait1 === false) {
            wait1 = true;
            if (none) {
                var color = 'orange';
                if (txt.includes('dat') || txt.includes('DAT')) {
                    color = 'blue';
                }

                var str = txt.split(`<font color="${color}">`).join('');
                str = txt.split('</font>').join('');
                line.innerHTML = str;
            }    
        }
    }  
    
    var goahead = false;
    // numbers
    if (txt.includes('//')) {
        if (/\d/.test(txt.split('//')[0])) {
            goahead = true;
        }
    }
    else {
        goahead = true;
    }
    if (/\d/.test(txt) && !line.innerHTML.includes('<font color="pink">') && goahead) {
        var newtxt = line.innerHTML;
        for (i=0; i < 10; i++) {
            try {
                newtxt = newtxt.split(`${i}`).join(`${i}`.fontcolor('pink'));
            }
            catch(err) {
            }
        }
        var amt = parseInt(newtxt.replace(/[^</font><font color="pink">]/g, "").length/26);
        
        if (amt > 1) {
            var newtxt = newtxt.split('</font><font color="pink">').join('').split('</font>');
            if (!(newtxt[0].includes('<font color="blue">') || newtxt[0].includes('<font color="orange">'))) {
                if (!newtxt[1] == '') {
                    if (amt >= 4) {
                        amt--;
                    }
                    for (z=1; z < amt; z++) {
                        try {
                            newtxt[z] = newtxt[z].split('<font color="pink">').join('');   
                        }
                        catch(err) {
                            console.log(err, newtxt, z)
                        }
                    }
                }
                newtxt[0] = newtxt[0]+'</font>';
                newtxt = newtxt.join('');    
            }
            else {
                newtxt[0] += '</font>';
                newtxt[1] += '</font>';
                newtxt = newtxt.join('');
            }
            
        }
        line.innerHTML = newtxt;
    }
    else if (line.innerHTML.includes('<font color="pink">')) {
        var newtxt = line.innerHTML;
        
        var part1 = newtxt.split('<font color="pink">')[0];
        var part2 = newtxt.split('<font color="pink">')[1].split('</font>').join('');


        if (newtxt.split('<font color="pink">')[1].includes('</font>')) {
            part2 = newtxt.split('<font color="pink">')[1].split('</font>')[0];
        }
        if (!(part2.match(/^[0-9]+$/) != null)) {
            var newpart2 = `<font color="pink">${part2}</font>`;

            line.innerHTML = `${part1}${newpart2}` ;
        } 
    }

    // comments
    if (!line.innerHTML.includes('span')) {
        // comments coloring
        if (txt.includes('//')) {
            var str = line.innerHTML.split('//');
            var color = 'orange';
            if (txt.includes('dat') || txt.includes('DAT')) {
                color = 'blue';
            }
            if (line.innerHTML.includes('<font color="pink">')) {
                // makes any functions green if they are commented
                color = 'pink';
            }

            // makes any functions green if they are commented
            if (str[1].includes(`<font color="${color}">`)) {
                var string = str[1].split(`<font color="${color}">`).join('');
                string = string.split('</font>').join('');
            }
            else {
                var string = str[1];
            }
            str = str[0] + (`<span class='comment' style='color: green'>//${string}</span>`);

            line.innerHTML = str;
        }  
    }
    else {
        if (!txt.includes('//')) {
            var str = line.innerHTML.split('</span>').join('');
            str = str.split('<span class="comment" style="color: green">').join('');
            line.innerHTML = str;
        }
        else {
            var str = line.innerHTML.split('//');
            var color = 'orange';
            if (txt.includes('dat') || txt.includes('DAT')) {
                color = 'blue';
            }
            if (line.innerHTML.includes('<font color="pink">')) {
                // makes any functions green if they are commented
                if (str[1].includes(`<font color="pink">`)) {
                    var string = str[1].split(`<font color="pink">`).join('');
                    string = string.split('</font>').join('');
                }
                else {
                    var string = str[1];
                }
                str = str[0] + '//' + string;

                line.innerHTML = str;
            }

            // makes any functions green if they are commented
            if (str[1].includes(`<font color="${color}">`)) {
                var string = str[1].split(`<font color="${color}">`).join('');
                string = string.split('</font>').join('');
            }
            else {
                var string = str[1];
            }
            str = str[0] + '//' + string;

            line.innerHTML = str;
        }
    }
}

function typeLine(e, line) {
    // enter key
    if (e.which == '13') {
        e.preventDefault();
        addLine(line);
    }
    // tab 
    if (e.which == '9') {
        e.preventDefault();
    }
    // up arrow
    if (e.which == '38') {
        e.preventDefault();
        moveLine(line, 'up');
    }
    // down arrow
    if (e.which == '40') {
        e.preventDefault();
        moveLine(line, 'down');
    }
    // delete
    var num = parseInt(line.split('l')[1]);
    if (document.getElementById(`line${num}`).innerText == '') {
        if (e.which == '8') {
            deleteLine(num);
        }    
    }
    else {
        matchNumHeight(line);    
    }
}
function matchNumHeight(line1) {
    var num = parseInt(line1.split('l')[1]);
    // get line index
    var line = document.getElementById(`line${num}`);
    var parent1 = line.parentNode;
    var index = Array.prototype.indexOf.call(parent1.children, line);

    // get line num index
    var numline = document.getElementById(`n0`);
    var parent2 = numline.parentNode;

    parent2.children[index].style.height = `${parent1.children[index].offsetHeight}px`;
}
function deleteLine(num) {
    var element = document.getElementById(`line${num}`);

    // select line before element
    var parent = element.parentNode;

    var index = Array.prototype.indexOf.call(parent.children, element);
    if (index != 0) {
        parent.children[index-1].click();
        
        // (gets deleted by backspace instantly)
        parent.children[index-1].getElementsByTagName('span')[0].innerText += '_';

        moveCursorAtTheEnd(parent.children[index-1].getElementsByTagName('span')[0]);
        // delete line
        element.remove();

        // delete line num
        var numparent = document.getElementById('nums');
        numparent.children[numparent.children.length-1].remove();
    }
}
function moveLine(line, direction) {
    var num = parseInt(line.split('l')[1]);

    var child = document.getElementById(`line${num}`);
    var parent = child.parentNode;

    var index = Array.prototype.indexOf.call(parent.children, child);
    
    if (direction === 'up') {
        if (index != 0) {
            parent.children[index-1].click();
            moveCursorAtTheEnd(parent.children[index-1].getElementsByTagName('span')[0]);
        }    
    }
    else {
        if (index != parent.children.length-1) {
            parent.children[index+1].click();
            moveCursorAtTheEnd(parent.children[index+1].getElementsByTagName('span')[0]);
        } 
    }
    
}
function addLine(line) {
    lines++;
    var num = parseInt(line.split('l')[1]);
    
    var referenceNode = document.getElementById(`line${num}`);

    // line clone
    var cln = referenceNode.cloneNode(true);

    cln.id = `line${lines}`;

    cln.getElementsByTagName('span')[0].id = `l${lines}`;
    cln.getElementsByTagName('span')[0].innerHTML = '';
    cln.getElementsByTagName('span')[0].classList.remove('try');

    document.getElementById('lines').appendChild(cln);
    insertAfter(cln, referenceNode);

    // num clone
    var cln = document.getElementById(`n${0}`).cloneNode(true);
    
    var numparent = document.getElementById('nums');

    cln.id = `n${numparent.children.length}`;
    cln.innerHTML = `${numparent.children.length}`;

    document.getElementById('nums').appendChild(cln);

    // select next line
    document.getElementById(`l${lines}`).focus();
}

// insert element after referenceNode
function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function moveCursorAtTheEnd(element) {
    var selection = document.getSelection();
    var range = document.createRange();
    var contenteditable = element;
    try {
        if (contenteditable.lastChild.nodeType == 3) {
            range.setStart(contenteditable.lastChild,contenteditable.lastChild.length);
        }
        else {
            range.setStart(contenteditable,contenteditable.childNodes.length);
        }
        selection.removeAllRanges();
        selection.addRange(range);    
    }
    catch(err) {
    }
}

// disabled/enables compile btn
var inputText = document.getElementById('editor');
var compileBtn = document.getElementById('compileBtn');
inputText.addEventListener("DOMSubtreeModified", function() {
    var line = document.getElementById('l0');

    if (inputText.innerText.length === 1) { // 1227 is default length of editor without any user input
        compileBtn.setAttribute('onclick', '');
        compileBtn.setAttribute('class', 'box1');

        document.getElementById('clearBtn').style.display = 'none';

        if (!line.classList.contains('try')) {
            line.classList.add('try');
        }
    }
    else {
        compileBtn.setAttribute('onclick', 'interpret()');
        compileBtn.setAttribute('class', 'box1 box1A');

        document.getElementById('clearBtn').style.display = 'block';
        try {
            if (line.classList.contains('try')) {
                line.classList.remove('try');
            }
        }
        catch (err) {
        }
    }
})

// updates every line in editor to color correctly and sizes the linenum height
function updateEditor() {
    var editor = document.getElementById('lines');

    for (y=0; y < editor.children.length; y++) {
        unselectLine(editor.children[y].getElementsByTagName('span')[0].id);
        matchNumHeight(editor.children[y].getElementsByTagName('span')[0].id);
    }
}

// clears editor / sets to default html
function clearEditor() {
    var editor = document.getElementById('editor');
    
    editor.innerHTML = `<div id='nums'>
                        <div id='n0' class='lineNum'>0</div>
                    </div>

                    <div id='lines'>
                        <div id='line0' class='line' onclick='focusLine(this.id)'>
                            <span id='l0' class='in try' onfocus='selectLine(this.id)' onblur="unselectLine(this.id)" onkeydown="typeLine(event, this.id)" data-placeholder="Not sure what to do? try some examples below" contenteditable></span>
                        </div>
                    </div>`;
    lines = 0;
}