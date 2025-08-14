const audio = document.getElementById('audio');
let tracks = [];
let currentIndex = -1;

// fetch and render
async function loadTracks(){
  tracks = await fetch('/api/tracks').then(r=>r.json());
  const container = document.getElementById('tracks');
  container.innerHTML = '';
  tracks.forEach((t, i) => {
    const div = document.createElement('div'); div.className='item';
    div.innerHTML = `<span>${t.title}</span><div><button data-i="${i}" class="playBtn">Play</button></div>`;
    container.appendChild(div);
  });
  document.querySelectorAll('.playBtn').forEach(b => b.addEventListener('click', e => playIndex(+e.target.dataset.i)));
}
function playIndex(i){
  if(!tracks[i]) return;
  currentIndex = i;
  audio.src = tracks[i].url;
  audio.play();
  document.getElementById('now').textContent = tracks[i].title;
}
document.getElementById('play').addEventListener('click', ()=> audio.play());
document.getElementById('pause').addEventListener('click', ()=> audio.pause());
document.getElementById('next').addEventListener('click', ()=> playIndex((currentIndex+1) % tracks.length));
document.getElementById('prev').addEventListener('click', ()=> playIndex((currentIndex-1+tracks.length) % tracks.length));
document.getElementById('volume').addEventListener('input', e => audio.volume = e.target.value);
audio.addEventListener('timeupdate', ()=> {
  if(audio.duration) document.getElementById('progress').value = (audio.currentTime/audio.duration)*100;
});
document.getElementById('progress').addEventListener('input', e => {
  if(audio.duration) audio.currentTime = (e.target.value/100)*audio.duration;
});

// uploader
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const files = document.getElementById('uploadInput').files;
  if (!files.length) return;
  const fd = new FormData();
  Array.from(files).forEach(f => fd.append('songs', f));
  const res = await fetch('/upload', { method: 'POST', body: fd });
  const data = await res.json();
  if (data.success) {
    alert('Uploaded ' + data.files.length + ' file(s)');
    loadTracks();
  }
});

// initial load
loadTracks();
