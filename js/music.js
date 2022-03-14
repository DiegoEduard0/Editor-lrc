const mediaTags = document.querySelector('#media-tags');
let input = document.getElementById('music-upload');
let audio = document.getElementById("audio");

input.addEventListener("change", (event) => {
    var file = event.target.files[0];
    audio.setAttribute("src", URL.createObjectURL(file));
    new jsmediatags.Reader(file).setTagsToRead(["artist", "lyrics", "picture", "title"]).read({
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
          }catch(error){
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
})

function back() {
    console.log(audio.currentTime);
    console.log(this);
    audio.currentTime -= 5.00;
}

function next() {
    console.log(audio.currentTime);
    audio.currentTime += 5.00;
}