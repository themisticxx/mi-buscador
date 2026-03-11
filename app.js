
const input = document.getElementById('input');
const contenedor = document.getElementById('contenedor');
const carruzelElem = document.getElementById('carruzel');
const audio = document.getElementById('audio');
const cancionTexto = document.getElementById('cancion');
const PlayBtn = document.getElementById('play');
const Volumen = document.getElementById('volumen');
const Progreso = document.getElementById('progress-bar');
const Previus = document.getElementById('previus');
const Next = document.getElementById('next');
const Descarga = document.getElementById("download");
const API = 'https://auraproyect.share.zrok.io';

// Variables de estado para la cola de reproducción
let Index = [];   // IDs de video
let Nombres = []; // Títulos de canciones
let contador = 0; // Índice de la canción actual

let c=0
function Home(){
    c=0
fetch(`${API}/recommendations`)
    
    .then(res=>res.json())
    .then(data=>{
        for (i of data){
            nombre=i.title
            artista=i.artist
            id=i.videoId
            imagen= `https://img.youtube.com/vi/${id}/maxresdefault.jpg`

            if (c < 16) {
                        crearTarjeta(i.title, imagen, i.artist, i.videoId, carruzelElem);
                    } else {
                        crearTarjeta(i.title, imagen, i.artist, i.videoId, contenedor);
                    }
                    c++;
        }
        
    })}
Home()
    

/**
 * Función maestra para reproducir una canción y cargar sus relacionadas
 * @param {string} id - VideoID de YouTube
 * @param {string} nombre - Título
 * @param {string} artista - Nombre del artista
 */
function reproducirYRelacionados(id, nombre, artista) {
    // 1. Reiniciamos la cola con la canción seleccionada como primera posición
    Index = [id];
    Nombres = [`${nombre}--${artista}`];
    contador = 0; 

    // 2. Actualizamos UI y cargamos el audio principal
    cancionTexto.innerText = `${nombre}--${artista}`;
    
    fetch(`${API}/get_url?id=${id}`)
        .then(res => res.json())
        .then(data => {
            audio.src = data.url;
            audio.play();
            PlayBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        })
        .catch(err => console.error("Error al obtener URL:", err));

    // 3. Cargamos las canciones relacionadas para llenar el resto de la cola (Next)
    fetch(`${API}/related?id=${id}`)
        .then(res => res.json())
        .then(data => {
            data.forEach(track => {
                Index.push(track.videoId);
                Nombres.push(`${track.title}--${track.artist}`);
            });
            console.log("Cola de reproducción actualizada con relacionados");
        })
        .catch(err => console.error("Error al cargar relacionados:", err));
}

// Función para navegar en la lista actual (Next/Previus)
function cambiarCancion(nuevoIndice) {
    if (nuevoIndice >= 0 && nuevoIndice < Index.length) {
        contador = nuevoIndice;
        const id = Index[contador];
        cancionTexto.innerText = Nombres[contador];

        fetch(`${API}/get_url?id=${id}`)
            .then(res => res.json())
            .then(data => {
                audio.src = data.url;
                audio.play();
                PlayBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
            });
    }
}

// --- EVENTOS DE AUDIO ---

audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        const porcentaje = (audio.currentTime / audio.duration) * 100;
        Progreso.value = porcentaje;
        actualizarEstiloBarra();
    }
});

audio.addEventListener('ended', () => {
    // Al terminar, pasa automáticamente a la siguiente de la cola de relacionados
    if (contador + 1 < Index.length) {
        cambiarCancion(contador + 1);
    }
});

// --- BARRA DE PROGRESO Y CONTROLES ---

function actualizarEstiloBarra() {
    const value = (Progreso.value - Progreso.min) / (Progreso.max - Progreso.min) * 100;
    Progreso.style.background = `linear-gradient(to right, #1DB954 ${value}%, #535353 ${value}%)`;
}

Progreso.addEventListener('input', () => {
    if (audio.duration) {
        audio.currentTime = (Progreso.value / 100) * audio.duration;
        actualizarEstiloBarra();
    }
});

PlayBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        PlayBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    } else {
        audio.pause();
        PlayBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    }
});

Next.addEventListener('click', () => cambiarCancion(contador + 1));
Previus.addEventListener('click', () => cambiarCancion(contador - 1));

Volumen.addEventListener('input', (e) => {
    audio.volume = e.target.value / 100;
});

// --- GENERACIÓN DE INTERFAZ ---

function crearTarjeta(nombre, imagen, artista, id, destino) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <img src="${imagen}" class="Imagen">
        <div class="informacion">
            <p class="titulos">${nombre}</p>
            <p class="artistas">${artista}</p>
        </div>
    `;

    card.onclick = () => reproducirYRelacionados(id, nombre, artista);
    destino.appendChild(card);
}

// --- BÚSQUEDA ---

input.addEventListener('keydown', (event) => {
    if (event.key === "Enter") {
        const query = input.value;
        if (!query) {
            Home()
        };

        contenedor.innerHTML = '';
        carruzelElem.innerHTML = '';
        let c = 0;

        fetch(`${API}/search?q=${query}`)
            .then(res => res.json())
            .then(respuesta => {
                input.value = '';
                respuesta.forEach(i => {
                    const imagen = `https://img.youtube.com/vi/${i.videoId}/maxresdefault.jpg`;
                    
                    if (c < 16) {
                        crearTarjeta(i.title, imagen, i.artist, i.videoId, carruzelElem);
                    } else {
                        crearTarjeta(i.title, imagen, i.artist, i.videoId, contenedor);
                    }
                    c++;
                });
            });
    }
});
//Fyp Inicio





// Botón de descarga utilizando tu proxy del servidor
Descarga.addEventListener('click', () => {
    if (Index[contador]) {
        window.location.href = `${API}/download_proxy?id=${Index[contador]}`;
    }
});

// Función para el scroll de los botones de Recomendados
function scrollCarrusel(direccion) {
    const desplazamiento = 230 * 2 * direccion;
    carruzelElem.scrollBy({ left: desplazamiento, behavior: 'smooth' });
}