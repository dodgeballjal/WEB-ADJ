// ===== SCRIPTS ESPECÍFICOS PARA MVV =====

// Variables para el zoom de la imagen
let currentScale = 1;
const minScale = 0.5;
const maxScale = 3;
const scaleStep = 0.2;

// Variables para el arrastre de la imagen
let isDragging = false;
let startX = 0;
let startY = 0;
let translateX = 0;
let translateY = 0;

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== SISTEMA DE TABS (MISIÓN, VISIÓN, VALORES) =====
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remover clase active de todos los botones
            tabButtons.forEach(btn => {
                btn.classList.remove('active1', 'active2', 'active3');
            });
            
            // Remover clase active de todos los paneles
            tabPanels.forEach(panel => {
                panel.classList.remove('active');
            });
            
            // Agregar clase active al botón clickeado
            if (targetTab === 'mision') {
                this.classList.add('active1');
            } else if (targetTab === 'vision') {
                this.classList.add('active2');
            } else if (targetTab === 'valores') {
                this.classList.add('active3');
            }
            
            // Mostrar el panel correspondiente
            const targetPanel = document.getElementById(targetTab);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
    
    // ===== FUNCIONALIDAD DE ZOOM PARA LA IMAGEN DEL LOGO =====
    const logoImage = document.getElementById('logoImage');
    
    if (logoImage) {
        // Doble clic para alternar zoom
        logoImage.addEventListener('dblclick', function(e) {
            e.preventDefault();
            if (currentScale === 1) {
                zoomImage('in');
            } else {
                resetImage();
            }
        });
        
        // Zoom con rueda del ratón
        logoImage.addEventListener('wheel', function(e) {
            e.preventDefault();
            
            if (e.deltaY < 0) {
                zoomImage('in');
            } else {
                zoomImage('out');
            }
        });
        
        // ===== FUNCIONALIDAD DE ARRASTRE =====
        logoImage.addEventListener('mousedown', function(e) {
            if (currentScale > 1) {
                isDragging = true;
                startX = e.clientX - translateX;
                startY = e.clientY - translateY;
                logoImage.classList.add('dragging');
                e.preventDefault();
            }
        });
        
        document.addEventListener('mousemove', function(e) {
            if (isDragging && currentScale > 1) {
                translateX = e.clientX - startX;
                translateY = e.clientY - startY;
                updateImageTransform();
            }
        });
        
        document.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;
                logoImage.classList.remove('dragging');
            }
        });
        
        // Prevenir el comportamiento de arrastre de imagen por defecto
        logoImage.addEventListener('dragstart', function(e) {
            e.preventDefault();
        });
    }
});

// ===== FUNCIONES DE ZOOM =====

// Función para hacer zoom en la imagen
function zoomImage(action) {
    const image = document.getElementById('logoImage');
    
    if (action === 'in') {
        currentScale = Math.min(currentScale + scaleStep, maxScale);
    } else if (action === 'out') {
        currentScale = Math.max(currentScale - scaleStep, minScale);
    }
    
    updateImageTransform();
    
    if (currentScale > 1) {
        image.classList.add('zoomed');
    } else {
        image.classList.remove('zoomed');
        translateX = 0;
        translateY = 0;
    }
}

// Función para restablecer la imagen al tamaño original
function resetImage() {
    const image = document.getElementById('logoImage');
    currentScale = 1;
    translateX = 0;
    translateY = 0;
    updateImageTransform();
    image.classList.remove('zoomed');
}

// Función para actualizar la transformación de la imagen
function updateImageTransform() {
    const image = document.getElementById('logoImage');
    if (image) {
        image.style.transform = `scale(${currentScale}) translate(${translateX / currentScale}px, ${translateY / currentScale}px)`;
    }
}