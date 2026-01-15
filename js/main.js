// ===== FUNCIONALIDAD GLOBAL - ASOCIACIÓN DE DODGEBALL JALISCO =====

// =============================================
// CONFIGURACIÓN - ¡IMPORTANTE! CONFIGURACIÓN GOOGLE SHEETS
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzrT0BPt8JHjDbkLL1A2nYuGcNFQWkzadZWDjjYgCL2IEkHmHtqZyqNflyDSQvsB90/exec';
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== 1. MENÚ HAMBURGUESA =====
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const menuLinks = document.querySelectorAll('.menu-link');
    let activeMenu = null;
    
    
    // Toggle del menú hamburguesa (real)
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        navMenu.classList.toggle('active');
        this.innerHTML = navMenu.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });

    // Eventos para menú principal (real)
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const menuId = this.id;
            const submenuId = menuId.replace('menu', 'submenu');
            const submenu = document.getElementById(submenuId);
            
            // Si ya hay un menú activo, cerrarlo
            if (activeMenu && activeMenu !== submenu) {
                activeMenu.classList.remove('active');
                const activeLinkId = activeMenu.id.replace('submenu', 'menu');
                document.getElementById(activeLinkId).classList.remove('active');
            }
            
            // Alternar el estado del submenú actual
            submenu.classList.toggle('active');
            this.classList.toggle('active');
            
            // Actualizar referencia al menú activo
            if (submenu.classList.contains('active')) {
                activeMenu = submenu;
            } else {
                activeMenu = null;
            }
        });
        
        // Cerrar menús al hacer clic fuera
        document.addEventListener('click', function(e) {
            // Menú real
            if (!e.target.closest('.nav-menu') && !e.target.closest('.menu-toggle')) {
                navMenu.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                
                const activeSubmenus = document.querySelectorAll('.submenu.active');
                const activeMenuLinks = document.querySelectorAll('.menu-link.active');
                
                activeSubmenus.forEach(submenu => {
                    submenu.classList.remove('active');
                });
                
                activeMenuLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                activeMenu = null;
            }
        });
    });
    
    // ===== 2. SCROLL SUAVE PARA ENLACES INTERNOS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Solo procesa enlaces internos que no sean solo "#"
            if (href !== '#' && href.startsWith('#')) {
                e.preventDefault();
                
                const targetId = href;
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Calcula posición considerando header fijo
                    const headerHeight = document.querySelector('header')?.offsetHeight || 90;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Actualiza URL sin recargar
                    if (history.pushState) {
                        history.pushState(null, null, href);
                    }
                }
            }
        });
    });
    
    // ===== 3. ANIMACIONES AL SCROLL =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observa secciones para animaciones
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });
    
    // ===== 4. MANEJO DE FORMULARIOS =====
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validación básica
            const name = this.querySelector('#name')?.value.trim();
            const email = this.querySelector('#email')?.value.trim();
            const message = this.querySelector('#message')?.value.trim();
            
            if (!name || !email || !message) {
                alert('Por favor completa todos los campos');
                return;
            }
            
            // Aquí iría el envío real (AJAX)
            alert('Mensaje enviado (esto es una simulación)');
            this.reset();
        });
    }
    
    // ===== 5. ZOOM DE IMÁGENES (si existen) =====
    const zoomableImages = document.querySelectorAll('.logo-image, .about-image img');
    zoomableImages.forEach(img => {
        img.addEventListener('click', function() {
            this.classList.toggle('zoomed');
        });
        
        // Zoom con scroll
        img.addEventListener('wheel', function(e) {
            if (this.classList.contains('zoomed')) {
                e.preventDefault();
                
                if (e.deltaY < 0) {
                    this.style.transform = 'scale(1.2)';
                } else {
                    this.style.transform = 'scale(1)';
                    this.classList.remove('zoomed');
                }
            }
        });
    });
    
    // ===== 6. TOGGLES PARA CONTENIDO (MVV, etc.) =====
    document.querySelectorAll('.mvv-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetContent = document.getElementById(targetId);
            
            if (targetContent) {
                // Cierra todos los contenidos
                document.querySelectorAll('.mvv-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                // Quita activo de todos los botones
                document.querySelectorAll('.mvv-btn').forEach(b => {
                    b.classList.remove('active');
                    b.querySelector('.btn-arrow i')?.classList.remove('fa-chevron-up');
                    b.querySelector('.btn-arrow i')?.classList.add('fa-chevron-down');
                });
                
                // Abre el contenido seleccionado
                targetContent.classList.add('active');
                this.classList.add('active');
                const arrowIcon = this.querySelector('.btn-arrow i');
                if (arrowIcon) {
                    arrowIcon.classList.remove('fa-chevron-down');
                    arrowIcon.classList.add('fa-chevron-up');
                }
            }
        });
    });
    
    // ===== 7. FUNCIONES DE SCROLL =====
    window.scrollToTop = function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    window.scrollToBottom = function() {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    };
    
    // ===== 8. MANEJO DE IFRAMES RESPONSIVE =====
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
        iframe.addEventListener('load', function() {
            // Asegura que iframes sean responsivos
            this.style.maxWidth = '100%';
        });
    });
    
    // ===== 9. INICIALIZACIÓN DE GALERÍA (si existe) =====
    const galleryGrid = document.querySelector('.gallery-grid');
    if (galleryGrid) {
        // Añade efecto de carga progresiva
        const images = galleryGrid.querySelectorAll('img');
        images.forEach(img => {
            img.loading = 'lazy';
        });
    }
});

// ===== MANEJO DE REDIMENSIONAMIENTO =====
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // Recalcula posiciones después de redimensionar
        if (document.querySelector('nav ul.active')) {
            document.querySelector('nav ul').classList.remove('active');
            const icon = document.querySelector('.mobile-menu i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    }, 250);
});

// =============================================
// MODAL EN CONSTRUCCIÓN
// =============================================

// =============================================
// BUSCAR EN main.js LA LÍNEA QUE DICE:
// const modalData = {
// 
// Y REEMPLAZAR TODO EL BLOQUE HASTA EL }; FINAL
// (Son aproximadamente 120 líneas)
// =============================================

const modalData = {
    cursos: {
        title: 'Cursos y Certificación',
        subtitle: 'Capacitación profesional en dodgeball',
        icon: 'fa-graduation-cap',
        content: `
            <div class="info-section">
                <h3><i class="fas fa-star"></i> ¿Qué encontrarás aquí?</h3>
                <p>Estamos preparando una plataforma completa de formación que incluirá:</p>
                <ul class="features-list">
                    <li><i class="fas fa-check-circle"></i> Cursos de arbitraje certificados por FMDB</li>
                    <li><i class="fas fa-check-circle"></i> Capacitación para entrenadores</li>
                    <li><i class="fas fa-check-circle"></i> Material didáctico especializado</li>
                    <li><i class="fas fa-check-circle"></i> Certificaciones oficiales</li>
                    <li><i class="fas fa-check-circle"></i> Talleres y clínicas deportivas</li>
                </ul>
            </div>
            <div class="info-section">
                <h3><i class="fas fa-calendar-alt"></i> Fecha estimada</h3>
                <p><strong>Marzo 2026</strong> - Primera generación de cursos</p>
            </div>
            <div class="notify-form">
                <h4>📧 Recibe notificación cuando esté listo</h4>
                <form id="notifyForm" onsubmit="handleSubmit(event)">
                    <div class="form-group">
                        <input type="text" name="nombre" placeholder="Tu nombre completo *" required>
                    </div>
                    <div class="form-group">
                        <input type="email" name="email" placeholder="Tu email *" required>
                    </div>
                    <div class="form-group">
                        <input type="tel" name="telefono" placeholder="Teléfono (opcional)">
                    </div>
                    
                    <!-- ⭐ NUEVO: Aviso de Privacidad con check verde -->
                    <div class="privacy-notice">
                        <p>
                            <i class="far fa-check-square"></i>
                            Al enviar este formulario, aceptas nuestro 
                            <a href="docs/AVISO_PRIVACIDAD_USO_DATOS_PERSONALES_2026.pdf" target="_blank" class="privacy-link">
                                Aviso de Privacidad
                            </a>
                        </p>
                    </div>
                    
                    <div class="error-message" id="errorMessage"></div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary" id="submitBtn">
                            <i class="fas fa-bell"></i> <span>Notificarme</span>
                        </button>
                        <button type="button" class="btn btn-secondary" onclick="contactWhatsApp()">
                            <i class="fab fa-whatsapp"></i> WhatsApp
                        </button>
                    </div>
                </form>
            </div>
        `
    },
    afiliaciones: {
        title: 'Afiliaciones ADJ',
        subtitle: 'Únete a nuestra asociación',
        icon: 'fa-users',
        content: `
            <div class="info-section">
                <h3><i class="fas fa-handshake"></i> Sistema de Afiliaciones</h3>
                <p>Estamos desarrollando una plataforma para gestionar:</p>
                <ul class="features-list">
                    <li><i class="fas fa-check-circle"></i> Registro de clubes y escuelas</li>
                    <li><i class="fas fa-check-circle"></i> Afiliación de jugadores</li>
                    <li><i class="fas fa-check-circle"></i> Credenciales digitales</li>
                    <li><i class="fas fa-check-circle"></i> Seguimiento de membresías</li>
                    <li><i class="fas fa-check-circle"></i> Beneficios exclusivos</li>
                </ul>
            </div>
            <div class="info-section">
                <h3><i class="fas fa-calendar-alt"></i> Disponibilidad</h3>
                <p><strong>Febrero 2026</strong> - Sistema de afiliaciones en línea</p>
            </div>
            <div class="notify-form">
                <h4>📋 Pre-registro de interesados</h4>
                <p style="text-align: center; margin-bottom: 15px; color: #555;">
                    Regístrate ahora y recibe prioridad cuando lancemos el sistema
                </p>
                <form id="notifyForm" onsubmit="handleSubmit(event)">
                    <div class="form-group">
                        <input type="text" name="nombre" placeholder="Nombre del club/jugador *" required>
                    </div>
                    <div class="form-group">
                        <input type="email" name="email" placeholder="Email de contacto *" required>
                    </div>
                    <div class="form-group">
                        <input type="tel" name="telefono" placeholder="Teléfono *" required>
                    </div>
                    
                    <!-- ⭐ NUEVO: Aviso de Privacidad con check verde -->
                    <div class="privacy-notice">
                        <p>
                            <i class="far fa-check-square"></i>
                            Al enviar este formulario, aceptas nuestro 
                            <a href="docs/AVISO_PRIVACIDAD_USO_DATOS_PERSONALES_2026.pdf" target="_blank" class="privacy-link">
                                Aviso de Privacidad
                            </a>
                        </p>
                    </div>
                    
                    <div class="error-message" id="errorMessage"></div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary" id="submitBtn">
                            <i class="fas fa-bell"></i> <span>Pre-registrarme</span>
                        </button>
                        <button type="button" class="btn btn-secondary" onclick="contactWhatsApp()">
                            <i class="fab fa-whatsapp"></i> WhatsApp
                        </button>
                    </div>
                </form>
            </div>
        `
    }
};

// =============================================
// FUNCIONES PRINCIPALES DEL MODAL
// =============================================

function openModal(section) {
    const data = modalData[section];
    const overlay = document.getElementById('modalOverlay');
    const title = document.getElementById('modalTitle');
    const subtitle = document.getElementById('modalSubtitle');
    const content = document.getElementById('modalContent');
    const icon = document.querySelector('.modal-icon i');

    if (!data || !overlay) return;

    title.textContent = data.title;
    subtitle.textContent = data.subtitle;
    content.innerHTML = data.content;
    icon.className = `fas ${data.icon}`;

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const overlay = document.getElementById('modalOverlay');
    if (!overlay) return;
    
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    setTimeout(() => {
        const successMsg = document.getElementById('successMessage');
        const contentDiv = document.getElementById('modalContent');
        const errorMsg = document.getElementById('errorMessage');
        
        if (successMsg) successMsg.classList.remove('active');
        if (contentDiv) contentDiv.style.display = 'block';
        if (errorMsg) errorMsg.classList.remove('active');
    }, 300);
}

function closeModalIfOutside(event) {
    if (event.target.id === 'modalOverlay') {
        closeModal();
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// =============================================
// ENVÍO DEL FORMULARIO
// =============================================

async function handleSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Validación
    if (!data.nombre || !data.email) {
        showError('Por favor completa los campos obligatorios');
        return;
    }
    
    if (!validateEmail(data.email)) {
        showError('Por favor ingresa un email válido');
        return;
    }
    
    // UI: Deshabilitar botón
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('span');
    const originalText = btnText.textContent;
    submitBtn.disabled = true;
    btnText.textContent = 'Enviando...';
    submitBtn.querySelector('i').className = 'fas fa-spinner fa-spin';
    
    // Obtener sección
    const modalTitle = document.getElementById('modalTitle').textContent;
    const section = modalTitle.includes('Cursos') ? 'Cursos y Certificación' : 'Afiliaciones';
    
    // Enviar datos
    const result = await sendToGoogleSheets(data, section);
    
    if (result.success) {
        // Éxito
        document.getElementById('modalContent').style.display = 'none';
        document.getElementById('successMessage').classList.add('active');
        form.reset();
        
        setTimeout(() => {
            closeModal();
        }, 3500);
    } else {
        // Error
        showError(result.message || 'Hubo un error. Por favor intenta de nuevo o contacta por WhatsApp.');
    }
    
    // Restaurar botón
    submitBtn.disabled = false;
    btnText.textContent = originalText;
    submitBtn.querySelector('i').className = 'fas fa-bell';
}

// =============================================
// ENVÍO A GOOGLE SHEETS
// =============================================

async function sendToGoogleSheets(formData, section) {
    try {
        const data = {
            nombre: formData.nombre,
            email: formData.email,
            telefono: formData.telefono || '',
            seccion: section
        };
        
        console.log('📤 Enviando datos:', data);
        console.log('🔗 URL:', APPS_SCRIPT_URL);
        
        const response = await fetch(APPS_SCRIPT_URL, {
            redirect: 'follow',
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify(data)
        });
        
        console.log('📡 Response status:', response.status);
        console.log('📡 Response ok:', response.ok);
        
        const text = await response.text();
        console.log('📄 Response text:', text);
        
        let result;
        try {
            result = JSON.parse(text);
        } catch (e) {
            console.warn('⚠️ Respuesta no es JSON válido, asumiendo éxito');
            if (response.ok) {
                result = { success: true, message: 'Datos enviados correctamente' };
            } else {
                throw new Error('Error en el servidor');
            }
        }
        
        console.log('✅ Resultado final:', result);
        return result;
        
    } catch (error) {
        console.error('❌ Error al enviar:', error);
        console.error('❌ Error completo:', {
            message: error.message,
            stack: error.stack
        });
        
        return {
            success: false,
            message: 'Error de conexión: ' + error.message + '. Verifica que el script esté implementado correctamente.'
        };
    }
}

// =============================================
// FUNCIONES AUXILIARES
// =============================================

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    if (!errorDiv) return;
    
    errorDiv.textContent = '⚠️ ' + message;
    errorDiv.classList.add('active');
    
    setTimeout(() => {
        errorDiv.classList.remove('active');
    }, 5000);
}

function contactWhatsApp() {
    const mensaje = encodeURIComponent('Hola, me gustaría información sobre las secciones en desarrollo de la ADJ.');
    window.open(`https://wa.me/523332363937?text=${mensaje}`, '_blank');
}