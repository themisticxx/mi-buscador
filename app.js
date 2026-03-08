const input = document.getElementById('input');
const contenedor = document.getElementById('contenedor');
const carruselElem = document.getElementById('carruzel');
const audio = document.getElementById('audio');
const cancionTexto = document.getElementById('cancion');
const PlayBtn = document.getElementById('play');
const Volumen = document.getElementById('volumen');
const Progreso = document.getElementById('progress-bar');
const Previus = document.getElementById('previus');
const Next = document.getElementById('next');
const Descarga = document.getElementById("download");

const API = 'https://auraproyect.share.zrok.io';

// Listas para el manejo de la cola de reproducción
let Index = [];   // Guardará los IDs (videoId)
let Nombres = []; // Guardará los títulos de las canciones
let contador = 0; // Índice de la canción actual en la lista

// --- FUNCIONES DE CONTROL ---

function actualizarProgreso() {
    if (audio.duration) {
        const value = (Progreso.value - Progreso.min) / (Progreso.max - Progreso.min) * 100;
        // Efecto visual de la barra verde
        Progreso.style.background = `linear-gradient(to right, #1DB954 ${value}%, #535353 ${value}%)`;
    }
}

// Función principal para cargar y reproducir
function reproducirCancion(indiceLista) {
    if (indiceLista < 0 || indiceLista >= Index.length) return;

    const id = Index[indiceLista];
    const nombre = Nombres[indiceLista];
    
    contador = indiceLista; // Actualizamos el índice global
    cancionTexto.innerText = nombre;

    fetch(`${API}/get_url?id=${id}`)
        .then(res => res.json())
        .then(data => {
            audio.src = data.url;
            audio.play();
            PlayBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        })
        .catch(err => console.error("Error al obtener la URL:", err));
}

// --- EVENTOS DE AUDIO ---

audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        const porcentaje = (audio.currentTime / audio.duration) * 100;
        Progreso.value = porcentaje;
        actualizarProgreso();
    }
});

// Cuando la canción termina, pasa a la siguiente automáticamente
audio.addEventListener('ended', () => {
    if (contador + 1 < Index.length) {
        reproducirCancion(contador + 1);
    }
});

Progreso.addEventListener('input', () => {
    const tiempo = (Progreso.value / 100) * audio.duration;
    audio.currentTime = tiempo;
    actualizarProgreso();
});

// --- BOTONES DE CONTROL ---

PlayBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        PlayBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    } else {
        audio.pause();
        PlayBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    }
});

Next.addEventListener('click', () => {
    if (contador + 1 < Index.length) {
        reproducirCancion(contador + 1);
    }
});

Previus.addEventListener('click', () => {
    if (contador - 1 >= 0) {
        reproducirCancion(contador - 1);
    }
});

Volumen.addEventListener('input', (e) => {
    audio.volume = e.target.value / 100;
});

// --- GENERACIÓN DE INTERFAZ ---

function crearTarjeta(nombre, imagen, artista, id, destino, esListaPropia) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <img src="${imagen}" class="Imagen">
        <div class="info-card">
            <p class="titulos">${nombre}</p>
            <p class="artistas">${artista}</p>
        </div>
    `;

    card.onclick = () => {
        // Al hacer click, cargamos la canción y actualizamos la cola de reproducción
        // con la lista actual donde se hizo click
        reproducirCancion(esListaPropia);
    };
    
    destino.appendChild(card);
}

// --- BÚSQUEDA ---

input.addEventListener('keydown', (event) => {
    if (event.key === "Enter") {
        const query = input.value;
        if (!query) return;

        contenedor.innerHTML = '';
        carruselElem.innerHTML = '';
        Index = [];
        Nombres = [];

        fetch(`${API}/search?q=${query}`)
            .then(res => res.json())
            .then(respuesta => {
                input.value = '';
                
                // Llenamos nuestras listas globales para que Next/Previus funcionen
                respuesta.forEach((item, i) => {
                    Index.push(item.videoId);
                    Nombres.push(item.title);
                    
                    const imagen = `https://img.youtube.com/vi/${item.videoId}/maxresdefault.jpg`;
                    
                    // Repartimos entre carrusel y lista inferior
                    if (i < 16) {
                        crearTarjeta(item.title, imagen, item.artist, item.videoId, carruselElem, i);
                    } else {
                        crearTarjeta(item.title, imagen, item.artist, item.videoId, contenedor, i);
                    }
                });
            });
    }
});

// Botón de descarga
Descarga.addEventListener('click', () => {
    if (audio.src) {
        const link = document.createElement('a');
        link.href = audio.src;
        link.download = `${cancionTexto.innerText}.mp3`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        alert("Primero selecciona una canción");
    }
});

function scrollCarrusel(direccion) {
    const carrusel = document.getElementById('carruzel');
    
    if (!carrusel) {
        console.error("No se encontró el elemento #carruzel");
        return;
    }

    // Calculamos el ancho de una tarjeta (210px) + el gap (20px)
    // Multiplicamos por 2 para que avance de dos en dos
    const tarjetaAncho = 230; 
    const desplazamiento = tarjetaAncho * 2 * direccion;

    console.log("Moviendo carrusel:", desplazamiento, "px");

    carrusel.scrollBy({
        left: desplazamiento,
        behavior: 'smooth'
    });
}