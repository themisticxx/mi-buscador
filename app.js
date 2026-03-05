const formulario = document.getElementById('formulario-input')
const input = document.getElementById('input')
const contenedor = document.getElementById('contenedor')
const audio=document.getElementById('audio')
const a=document.getElementById('cancion')
const API='https://auraproyect.share.zrok.io'
const Play=document.getElementById('play')
const Volumen=document.getElementById('volumen')
const Descarga=document.getElementById("download")
const Previus=document.getElementById('previus')
const Next=document.getElementById('next')





let Index=[]
let Nombres=[]
let contador=0

Previus.addEventListener('click',()=>{
    contador--
    fetch(`${API}/get_url?id=${Index[contador]}`)
        .then(res=>res.json())
        .then(data=>{
            audio.src=data.url
            audio.play()
            a.innerText=Nombres[contador]
            
            
            
        })


})

Next.addEventListener('click',()=>{
    contador++
    fetch(`${API}/get_url?id=${Index[contador]}`)
        .then(res=>res.json())
        .then(data=>{
            audio.src=data.url
            audio.play()
            a.innerText=Nombres[contador]
            
            
            
        })


})


Descarga.addEventListener('click',()=>{

    const urlBackend = `${API}/download_proxy?id=${Index[contador]}`;

    // 3. Abrir en una pestaña nueva o redirigir
    // window.location.href forzará la descarga gracias a los headers que pusiste en Python
    window.location.href = urlBackend;




})

audio.addEventListener('ended',(e)=>{
    contador=contador+1
    fetch(`${API}/get_url?id=${Index[contador]}`)
        .then(res=>res.json())
        .then(data=>{
            
            audio.src=data.url
            audio.play()
            a.innerText=Nombres[contador]
            
            
            
        })


    
    
})

Volumen.addEventListener('input',(e)=>{
    const valor=e.target.value;
    audio.volume=valor/100
})

let reproduccion=true
Play.addEventListener('click',()=>{
    if (reproduccion==true){
        audio.pause()
        reproduccion=false
        
    }
    else{
        audio.play()
        reproduccion=true
    }
    

})

function Targetas(nombre, imagen, artista,id) {
    const card = document.createElement('div')
    card.className = 'card'
    card.onclick=()=>{
        Index=[]

        fetch(`${API}/related?id=${id}`)
        .then(res=>res.json())
        .then(data=>{
            

            for (i of data){
                
                Index.push(i.videoId)
                Nombres.push(i.title)
           }
        })


        fetch(`${API}/get_url?id=${id}`)
        .then(res=>res.json())
        .then(data=>{
            console.log(data.url)
            audio.src=data.url
            audio.play()
            a.innerText=`${nombre}--${artista}`
            Index[0]=id
            
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