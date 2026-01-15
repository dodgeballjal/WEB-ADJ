// ===== SCRIPTS ESPECÍFICOS PARA GALERÍA DETALLE =====

// --- Configuración de eventos ---
const eventConfig = {
    "TEI1": {
        title: "Torneo Estatal Infantil",
        date: "Domingo 13 de abril - Parque San Jacinto, Guadalajara"
    },
    "TEL1": {
        title: "Torneo Estatal Libre",
        date: "Domingo 27 de abril - Parque San Jacinto, Guadalajara"
    },
    "TEJ1": {
        title: "Torneo Estatal Juvenil",
        date: "Domingo 8 de junio - Parque San Jacinto, Guadalajara"
    },
    "CNI9": {
        title: "Campeonato Nacional Infantil",
        date: "16 - 18 de Mayo 2025 - Iztapalapa, Ciudad de México"
    },
    "CNJ9": {
        title: "Campeonato Nacional Juvenil",
        date: "18-20 de Julio 2025 - Amecameca de Juárez, Estado de México"
    },
    "CNL9": {
        title: "Campeonato Nacional Libre",
        date: "31 de mayo - 1 de junio 2025 - Oaxtepec, Morelos"
    },
    "TEI2": {
        title: "Torneo Estatal Infantil 2025-2026",
        date: "Domingo 12 de Octubre 2025 - Parque San Jacinto, Guadalajara"
    },
    "TEL2": {
        title: "Torneo Estatal Libre 2025-2026",
        date: "Domingo 23 de Noviembre 2025 - Gimnasio Río de Janeiro, Guadalajara"
    },
    "TEJ2": {
        title: "Torneo Estatal Juvenil 2025-2026",
        date: "Domingo 09 de Noviembre 2025 - Gimnasio Río de Janeiro, Guadalajara"
    },
    "TMST": {
        title: "Torneo Masters 2025",
        date: "20 de septiembre 2025 - Utopia Cuauhtlicalli, Ciudad de México"
    }
};

// ID del script de Google Apps (deberás reemplazarlo con el tuyo)
const SCRIPT_ID = "AKfycbwzP5J06Bt062ZVpyFSZOsMogNoBkhZPSpanfZdzfUfGMVeSSDPn9J94fgeYleec-SoPA";

// Variables globales de la galería
let images = [];
let currentImageIndex = 0;

// Obtener parámetros de la URL
const urlParams = new URLSearchParams(window.location.search);
const eventCode = urlParams.get('event') || 'TEI1';

// Configurar el evento actual
const currentEvent = eventConfig[eventCode] || eventConfig["TEI1"];

// URL del API con parámetro
const API_URL = `https://script.google.com/macros/s/${SCRIPT_ID}/exec?event=${eventCode}`;

// --- Funciones de la galería ---

// Función para desplazarse al final de la página
function scrollToBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

// Función para desplazarse al inicio de la página
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Función para cargar imágenes desde la API
async function loadImages() {
    showLoading();
    hideError();
    document.getElementById('gallery-container').style.display = 'none';
    document.getElementById('refresh-btn').style.display = 'none';

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Error de red");
        
        const data = await response.json();
        if (data && data.error) throw new Error(data.error);

        images = data;

        if (!Array.isArray(images) || images.length === 0) {
            showError('No se encontraron imágenes en esta galería.');
            return;
        }
        
        displayImages(images);
        updateImageCount(images.length);
        document.getElementById('gallery-container').style.display = 'grid';
        
    } catch (error) {
        console.error(error);
        showError(`Error al cargar las imágenes: ${error.message}`);
        document.getElementById('refresh-btn').style.display = 'block';
    } finally {
        hideLoading();
    }
}

// Función para mostrar imágenes en la galería
function displayImages(imageUrls) {
    const galleryContainer = document.getElementById('gallery-container');
    galleryContainer.innerHTML = '';
    
    imageUrls.forEach((url, index) => {
        const imageContainer = document.createElement('div');
        imageContainer.className = 'image-container';
        
        const img = document.createElement('img');
        img.src = url;
        img.alt = `Imagen ${index + 1} - ${currentEvent.title}`;
        img.loading = 'lazy';
        img.onclick = () => openModal(index);
        
        imageContainer.appendChild(img);
        galleryContainer.appendChild(imageContainer);
    });
}

// Función para abrir el modal
function openModal(index) {
    currentImageIndex = index;
    const modal = document.getElementById('imageModal');
    const imgUrl = images[currentImageIndex];
    
    // Actualizar Imagen
    document.getElementById('modalImage').src = imgUrl;
    
    // Actualizar Botón de Descarga
    const downloadBtn = document.getElementById('downloadBtn');
    downloadBtn.href = imgUrl; 
    
    // Actualizar Contadores
    document.getElementById('current-index').textContent = currentImageIndex + 1;
    document.getElementById('total-images').textContent = images.length;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Función para cerrar el modal
function closeModal() {
    document.getElementById('imageModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Función para mostrar siguiente imagen
function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    updateModalContent();
}

// Función para mostrar imagen anterior
function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    updateModalContent();
}

// Función para actualizar contenido del modal
function updateModalContent() {
    const imgUrl = images[currentImageIndex];
    document.getElementById('modalImage').src = imgUrl;
    document.getElementById('downloadBtn').href = imgUrl;
    document.getElementById('current-index').textContent = currentImageIndex + 1;
}

// Función para actualizar contador de imágenes
function updateImageCount(count) {
    document.getElementById('image-count').textContent = `${count} fotografías capturadas`;
}

// Funciones de utilidad para mostrar/ocultar estados
function showLoading() { 
    document.getElementById('loading').style.display = 'block'; 
}
function hideLoading() { 
    document.getElementById('loading').style.display = 'none'; 
}
function showError(msg) { 
    const err = document.getElementById('error-container');
    err.textContent = msg;
    err.style.display = 'block';
}
function hideError() { 
    document.getElementById('error-container').style.display = 'none'; 
}

// --- Inicialización cuando el DOM está listo ---
document.addEventListener('DOMContentLoaded', () => {
    // Actualizar título y fecha en la página
    document.title = currentEvent.title + " - Galería ADJ";
    document.getElementById('event-title').textContent = currentEvent.title;
    document.getElementById('event-date').textContent = currentEvent.date;
    
    // Cargar imágenes
    loadImages();
    
    // Event Listeners del Modal
    document.querySelector('.close').addEventListener('click', closeModal);
    document.querySelector('.prev').addEventListener('click', showPrevImage);
    document.querySelector('.next').addEventListener('click', showNextImage);
    document.getElementById('refresh-btn').addEventListener('click', loadImages);
    
    // Cerrar modal al hacer clic fuera de la imagen
    document.getElementById('imageModal').addEventListener('click', (e) => {
        if (e.target.id === 'imageModal') closeModal();
    });
    
    // Navegación con teclado
    document.addEventListener('keydown', (e) => {
        if (document.getElementById('imageModal').style.display === 'flex') {
            if (e.key === 'ArrowLeft') showPrevImage();
            else if (e.key === 'ArrowRight') showNextImage();
            else if (e.key === 'Escape') closeModal();
        }
    });
});