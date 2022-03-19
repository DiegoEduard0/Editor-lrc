let lyric_upload = document.getElementById('lyric-upload');
let timersLyrics = document.getElementById("timers-lyrics");
let lyric = [];

window.addEventListener("load", loadInicial());

function loadInicial() {
    timersLyrics.innerHTML += addLineLyric(timePlayerFormat(audio.currentTime), 'Insira o verso da letra da musica aqui!')
}

lyric_upload.addEventListener("change", (event) => {
    loadLyric(event);
})

function loadLyric(event) {
    let file = new FileReader();
    file.onload = () => {
        convertLyricAndShow(file.result)
      }
    file.readAsText(event.target.files[0]);
}

function convertLyricAndShow(lyric) {
    let lrc = [];
    let re1 = /\[([\d]{2}):([\d]{2}).([\d]{2})\]/g;
    let re2 = /\[([\d]{2}):([\d]{2}).([\d]{3})\]/g;
    let resultTime = undefined;
    let resultLyric = undefined;

    if (lyric.match(re1)) {
        resultTime = lyric.match(re1);
        resultLyric = lyric.replace(re1, '')
    } else {
        resultTime = lyric.match(re2);
        resultLyric = lyric.replace(re2, '')
    }
      
    resultLyric = resultLyric.split(/(\r\n|\n|\r)/gm)
    for(let i = 0; i < resultLyric.length; i++) {
        if(resultLyric[i].indexOf("[", 0) == 0 && resultLyric[i].indexOf("]", resultLyric[i].length-1) > 0 
          || resultLyric[i] == "\r\n" || resultLyric[i] == "\n" || resultLyric[i] == "\r") {
            resultLyric[i] = ''
        }
    }
    resultLyric = resultLyric.filter(r => r)
    
    for (let i = 0; i < resultTime.length; i++) {
        resultTime[i] = parseFloat(resultTime[i].match(/[(\d).]/g).join(''));
        resultTime[i] = parseFloat(resultTime[i].toFixed(2));
        let x = [resultTime[i], resultLyric[i]];
        lrc.push(x);
    }

    timersLyrics.innerHTML = '';
    lrc.forEach(l => {
        timersLyrics.innerHTML += addLineLyric(timeLrcFormat(l[0]), l[1])
    });
    
}

function remove() {
    timersLyrics.innerHTML = '';
}

function add() {
    let arrayInputs = [];
    let inputs = timersLyrics.getElementsByTagName('input');

    for (let i = 0; i < inputs.length; i += 2) {
        let input = [];
        input = [inputs[i].value, inputs[i+1].value];
        arrayInputs.push(input);
    }
    timersLyrics.innerHTML = ''
    arrayInputs.forEach(element => {
        timersLyrics.innerHTML += addLineLyric(element[0], element[1]);
    });
    timersLyrics.innerHTML += addLineLyric(timePlayerFormat(audio.currentTime), '');
}

function newTime(time) {
    timer = time.parentNode.querySelector("#timer");
    timer.value = timePlayerFormat(audio.currentTime);
}

function save() {
    let arrayInputs = [];
    let inputs = timersLyrics.getElementsByTagName('input');

    for (let i = 0; i < inputs.length; i += 2) {
        let input = [];
        input = [inputs[i].value, inputs[i+1].value];
        arrayInputs.push(input);
    }

    let text = '';
    arrayInputs.forEach(i => {
        text += '[' + i[0] + ']' + i[1] + '\n'
    })

    let blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    let title = document.getElementById('title-artist').textContent;
    saveAs(blob, title + ".lrc");
}

function removeInput(input) {
    input.parentNode.remove();
}

function mascara(i){
    let v = i.value;

    if(isNaN(v[v.length-1])) {
        i.value = v.substring(0, v.length-1);
        return;
    }
    i.setAttribute("maxlength", "9");
    if (v.length == 2) i.value += ":";
    if (v.length == 5) i.value += ".";
}

function subtrair(x) {
    let timer = x.parentNode.querySelector("#timer");
    let time = timer.value.match(/[(\d)]/g);
    let minutes = parseInt(time[0] + time[1]);
    let seconds = parseInt(time[2] + time[3]);
    let milliseconds = parseInt(time[4] + time[5] + time[6]);
    milliseconds -= 200;

    if(minutes <= 0 && seconds <= 0 && milliseconds <= 0) {
        timer.value = '00:00.000';
        return;
    }
    if(milliseconds < 0) {
        milliseconds *= -1;
        milliseconds = 1000 - milliseconds;
        seconds -= 1;
    }
    if(seconds < 0){
        seconds = 59;
        minutes -= 1;
    }
    if(minutes < 0) {
        minutes = 0;
    }
    
    timer.value = timeFormat(minutes ,seconds ,milliseconds);
}

function somar(x) {
    let timer = x.parentNode.querySelector("#timer");
    let time = '';
    !timer.value ? timer.value = '00:00.000' : time = timer.value.match(/[(\d)]/g);
    let minutes = parseInt(time[0] + time[1]);
    let seconds = parseInt(time[2] + time[3]);
    let milliseconds = parseInt(time[4] + time[5] + time[6]);
    milliseconds += 200;

    if(milliseconds > 999) {
        milliseconds -= 1000;
        seconds += 1;
    }
    if(seconds > 59){
        seconds = 0;
        minutes += 1;
    }

    timer.value = timeFormat(minutes ,seconds ,milliseconds);
}

function play(x){
    let timer = x.parentNode.parentNode.querySelector("#timer");

    if(!timer.value) {
        return;
    }

    let time = timer.value.match(/[(\d)]/g);
    let minutes = parseInt(time[0] + time[1]);
    let seconds = parseInt(time[2] + time[3]);
    let milliseconds = parseInt(time[4] + time[5] + time[6]);
    time = parseFloat((minutes * 60) + seconds + '.' + milliseconds);
    audio.currentTime = time;
    audio.play();
}

function timeFormat(minutes ,seconds ,milliseconds) {
    if(minutes >= 1 && minutes <= 9) {
        minutes = '0'+ minutes;
    }
    else if(minutes >= 10 && minutes <= 60) {
        minutes = minutes;
    } else {
        minutes = '00'
    }

    if(seconds >= 1 && seconds <= 9) {
        seconds = '0'+ seconds;
    }
    else if(seconds >= 10 && seconds <= 60) {
        seconds = seconds;
    } else {
        seconds = '00'
    }

    if(milliseconds >= 1 && milliseconds <= 9) {
        milliseconds = '00'+ milliseconds;
    }
    else if(milliseconds >= 10 && milliseconds <= 99) {
        milliseconds = '0'+ milliseconds;
    } else if (milliseconds == 0){
        milliseconds = '000';
    }   

    return `${minutes}:${seconds}.${milliseconds}`;
}

function timeLrcFormat(value) {
    val = value
    value = parseFloat(value);

    if (value > 999 && value < 10000) {
        value = value.toString();
        let sec = parseFloat(value.substr(2))
        let min = parseFloat(value.substr(0, 2))
        let time = (min * 60) + sec
        time = parseFloat(time.toFixed(2))
        return timePlayerFormat(time);
    } else if(value >= 100 && value <= 999.99) {
        value = value.toString();
        let sec = parseFloat(value.substr(1))
        let min = parseFloat(value.substr(0, 1))
        let time = (min * 60) + sec
        time = parseFloat(time.toFixed(2))
        return timePlayerFormat(time);
    } else if(value > 0 && value < 60) {
        return timePlayerFormat(value);
    } else if(value == 0) {
        return '00:00.000'
    }
}

function timePlayerFormat(value) {
    value = new Date(value * 1000)

    let minutes = parseInt(value.getUTCMinutes());
    let seconds = parseInt(value.getSeconds());
    let milliseconds = parseInt(value.getMilliseconds());

    let time = timeFormat(minutes ,seconds ,milliseconds);

    return time;
}

function addLineLyric(time, lyric) {
    return `
    <div class="flex inputs">
        <span onclick="newTime(this)" class="material-icons">
            add
        </span>
        <div class="flex timers">
            <input type="text" class="timer" id="timer" oninput="mascara(this)" value="${time}" inputmode="numeric">
            <span class="material-icons" onclick="subtrair(this)">
                remove
            </span>
            <span class="material-icons" onclick="somar(this)">
                add
            </span>
        </div>
        <span class="material-icons" id="link">
            link
        </span>
        <div class="flex lyrics">
            <input type="text" class="lyric" spellcheck="false" value="${lyric}">
            <span class="material-icons" onclick="play(this)">
                play_arrow
            </span>
        </div>
        <span onclick="removeInput(this)" class="material-icons">
            remove
        </span>
    </div>`
}