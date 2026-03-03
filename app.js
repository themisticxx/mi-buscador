const formulario = document.getElementById('formulario-input')
const input = document.getElementById('input')
const contenedor = document.getElementById('contenedor')
const audio=document.getElementById('audio')
const a=document.getElementById('cancion')
const API='https://auraproyect.share.zrok.io'



function Targetas(nombre, imagen, artista,id) {
    const card = document.createElement('div')
    card.className = 'card'
    card.onclick=()=>{
        fetch(`${API}/get_url?id=${id}`)
        .then(res=>res.json())
        .then(data=>{
            console.log(data.url)
            audio.src=data.url
            audio.play()
            a.innerText=`${nombre}--${artista}`
            
        })
        
    }
    
    const infoContainer = document.createElement('div') 
    infoContainer.className = 'informacion' 

    const img = document.createElement('img')
    img.src = imagen
    img.className = 'Imagen'

    const title = document.createElement('p')
    title.className = 'titulos'
    title.innerText = nombre

    const artistas = document.createElement('p')
    artistas.className = 'artistas'
    artistas.innerText = artista

  
    infoContainer.appendChild(title)
    infoContainer.appendChild(artistas)
    
    card.appendChild(img)
    card.appendChild(infoContainer) 
    
    contenedor.appendChild(card)
}

input.addEventListener('keydown', function (event) {
    if (event.key === "Enter") {
        contenedor.innerText = ''
        
        fetch(`${API}/search?q=${input.value}`)
            .then(res => res.json())
            .then(respuesta => {
                input.value=''
                for (let i of respuesta) {
                    let nombre = i.title
                    let id = i.videoId
                    let artista = i.artist
                    let imagen = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`

                    Targetas(nombre, imagen, artista,id)
                }
            })
    }
})