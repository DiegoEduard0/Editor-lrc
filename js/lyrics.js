let lyric_upload = document.getElementById('lyric-upload');
let timersLyrics = document.getElementById("timers-lyrics");
let lyric = [];

window.addEventListener("load", loadInicial());

function loadInicial() {
    timersLyrics.innerHTML += addLineLyric(timePlayerFormat(audio.currentTime), 'Insira a frase da letra da musica aqui!')
}

lyric_upload.addEventListener("change", (event) => {
    loadLyric(event);
})

function loadLyric(event) {
    let file = new FileReader();
    file.onload = () => {
        console.log(file.result);
        convertLyricAndShow(file.result)
      }
    file.readAsText(event.target.files[0]);
}

function convertLyricAndShow(lyric) {
    let lrc = [];
    re = /\[([\d]{2}):([\d]{2}).([\d]{2})\]/g
    resultTime = lyric.match(re)
    console.log(resultTime);
    resultLyric = lyric.replace(re, '')
    resultLyric = resultLyric.split(/(\r\n|\n|\r)/gm)
    for(let i = 0; i < resultLyric.length; i++) {
        if(resultLyric[i].indexOf("[", 0) == 0 && resultLyric[i].indexOf("]", resultLyric[i].length-1) > 0 
          || resultLyric[i] == "\r\n" || resultLyric[i] == "\n" || resultLyric[i] == "\r") {
            resultLyric[i] = ''
            console.log('remove []');
        }
    }
    resultLyric = resultLyric.filter(r => r)
    
    for (let i = 0; i < resultTime.length; i++) {
        resultTime[i] = parseFloat(resultTime[i].match(/[(\d).]/g).join(''));
        resultTime[i] = parseFloat(resultTime[i].toFixed(2));
        let x = [resultTime[i], resultLyric[i]];
        lrc.push(x);
    }
    console.log(lrc);
    timersLyrics.innerHTML = '';
    lrc.forEach(l => {
        timersLyrics.innerHTML += addLineLyric(timeLrcFormat(l[0]), l[1])
    });
    
}

function remove() {
    console.log(audio.currentTime);
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
    console.log(timer.value);
    time = timer.value.match(/[(\d)]/g);
    minutes = parseInt(time[0] + time[1]);
    seconds = parseInt(time[2] + time[3]);
    milliseconds = parseInt(time[4] + time[5] + time[6]);
    milliseconds -= 200;
    if(minutes <= 0 && seconds <= 0 && milliseconds <= 0) {
        timer.value = '00:00.000';
        return;
    }
    if(milliseconds < 0) {
        milliseconds *= -1;
        milliseconds = 1000 - milliseconds;
        seconds -= 1;
        console.log('mili');
    }
    if(seconds < 0){
        seconds = 59;
        minutes -= 1;
        console.log('second');
    }
    if(minutes < 0) {
        minutes = 0;
    }
    
    console.log('subtrair');
    
    timer.value = timeFormat(minutes ,seconds ,milliseconds);
}

function somar(x) {
    let timer = x.parentNode.querySelector("#timer");
    !timer.value ? timer.value = '00:00.000' : 
    time = timer.value.match(/[(\d)]/g);
    minutes = parseInt(time[0] + time[1]);
    seconds = parseInt(time[2] + time[3]);
    milliseconds = parseInt(time[4] + time[5] + time[6]);
    milliseconds += 200;
    if(milliseconds > 999) {
        milliseconds -= 1000;
        seconds += 1;
        console.log('mili');
    }
    if(seconds > 59){
        seconds = 0;
        minutes += 1;
        console.log('second');
    }
    console.log('somar');
    console.log(`${minutes}:${seconds}.${milliseconds}`);
    timer.value = timeFormat(minutes ,seconds ,milliseconds);
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

    console.log("time format");
    return `${minutes}:${seconds}.${milliseconds}`;
}

function timeLrcFormat(value) {
    val = value
    value = parseFloat(value);
    if(value >= 100 && value <= 999.99) {
        value = value.toString();
        sec = parseFloat(value.substr(1))
        min = parseFloat(value.substr(0, 1))
        time = (min * 60) + sec
        time = parseFloat(time.toFixed(2))
        return timePlayerFormat(time);
    } else if(value > 0 && value < 60) {
        return timePlayerFormat(value);
    }
}

function timePlayerFormat(value) {
    value = new Date(value * 1000)

    minutes = parseInt(value.getUTCMinutes());
    seconds = parseInt(value.getSeconds());
    milliseconds = parseInt(value.getMilliseconds());

    time = timeFormat(minutes ,seconds ,milliseconds);
    console.log(time);

    return time;
}

function addLineLyric(time, lyric) {
    return `<div class="flex inputs">
    <span onclick="newTime(this)" class="material-icons">
        add
    </span>
    <div class="flex timers">
        <input type="text" class="timer" id="timer" oninput="mascara(this)" value="${time}">
        <span class="material-icons" onclick="subtrair(this)">
            remove
        </span>
        <span class="material-icons" onclick="somar(this)">
            add
        </span>
    </div>
    <span class="material-icons">
        link
    </span>
    <div class="flex lyrics">
        <input type="text" class="lyric" value="${lyric}">
    </div>
    <span onclick="removeInput(this)" class="material-icons">
        remove
    </span>
</div>`
}