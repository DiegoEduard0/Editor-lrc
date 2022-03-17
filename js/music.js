const mediaTags = document.querySelector('#media-tags');
let music_upload = document.getElementById('music-upload');
let audio = document.getElementById("audio");

var music = new Audio("./default/music/AURORA - Runaway.mp3");

window.addEventListener("load", loadMusic(music));

music_upload.addEventListener("change", (event) => {
    let file = event.target.files[0];
    console.log(file);
    loadMusic(file);
})

function loadMusic(file) {
    let f = undefined;
    if(!file.src) {
        audio.setAttribute("src", URL.createObjectURL(file));
        f = file;
        console.log(f);
    } else {
        audio.setAttribute("src", file.src);
        f = file.src
        console.log(f);
    }
    new jsmediatags.Reader(f).setTagsToRead(["artist", "lyrics", "picture", "title"]).read({
        onSuccess: function(tag) {
            console.log(tag);
            try{ 
                const data = tag.tags.picture.data;
                const format = tag.tags.picture.format;
                let base64String = "";
                data.forEach(element => {
                    base64String += String.fromCharCode(element);
                });
                document.getElementById("cover").style.backgroundImage = 'url(data:'+format+';base64,'+window.btoa(base64String)+')';
                document.getElementById("title-artist").textContent = `${tag.tags.title} - ${tag.tags.artist}`;
                audio.currentTime = 0;
            } catch(error){
                console.log(error);
                document.getElementById("cover").style.backgroundImage = 'url()';
                document.getElementById("title-artist").textContent = `${document.getElementById("music-upload").value.split(/(\\|\/)/g).pop()}`;
                audio.currentTime = 0;
            }
        },
        onError: function(error) {
            console.log(':(', error.type, error.info);
        }
    });
}

function back() {
    audio.currentTime -= 5.00;
}

function next() {
    audio.currentTime += 5.00;
}