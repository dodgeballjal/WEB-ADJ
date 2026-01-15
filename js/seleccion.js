// =====================================================
// SELECCION.JS - Sistema de Carga de Convocados Jalisco
// CON SOPORTE PARA PROXY DE IMÁGENES
// =====================================================

// URL del Google Apps Script (REEMPLAZAR con tu URL)
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbzfqtQyDiHSm8ivJ_P5hEEGiiC6kjNHsZI_Ki7kmG1BtHvjV1CLbQYH0ZuBIJ1TiJYrXA/exec';

// =====================================================
// FUNCIÓN AUXILIAR: PROCESAR URL DE IMAGEN
// =====================================================
/**
 * Convierte URLs de Google Drive al formato googleusercontent
 * que NO tiene problemas de CORS
 */
function processImageURL(foto) {
    // Si no hay foto, retornar placeholder
    if (!foto || foto.trim() === '') {
        return 'imagen/placeholder-player.png';
    }
    
    // Si es URL de Google Drive, convertir a googleusercontent
    if (foto.includes('drive.google.com')) {
        const fileId = extractDriveFileId(foto);
        if (fileId) {
            // Formato que funciona sin CORS
            return `https://lh3.googleusercontent.com/d/${fileId}`;
        }
    }
    
    // Si ya es una URL completa, retornarla tal cual
    if (foto.startsWith('http://') || foto.startsWith('https://')) {
        return foto;
    }
    
    // Si es una ruta relativa local
    return foto.startsWith('imagen/') ? foto : `imagen/${foto}`;
}

/**
 * Extrae el File ID de diferentes formatos de URL de Google Drive
 */
function extractDriveFileId(url) {
    if (!url) return null;
    
    // Formato 1: /file/d/FILE_ID/view
    let match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match) return match[1];
    
    // Formato 2: /d/FILE_ID/
    match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match) return match[1];
    
    // Formato 3: ?id=FILE_ID
    match = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (match) return match[1];
    
    // Formato 4: Ya es googleusercontent
    match = url.match(/googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/);
    if (match) return match[1];
    
    return null;
}

// Estado global de la aplicación
let convocadosData = [];
let currentCategoria = '';
let currentSubcategoria = '';
let currentRama = 'mixto';

// =====================================================
// 1. INICIALIZACIÓN
// =====================================================
document.addEventListener('DOMContentLoaded', async function() {
    const params = new URLSearchParams(window.location.search);
    const jalisco = params.get('jalisco');
    
    if (!jalisco) {
        showError('No se especificó categoría');
        return;
    }
    
    parseCategoria(jalisco);
    updatePageTitle();
    setupRamaButtons();
    await loadConvocados();
    renderConvocados();
});

// =====================================================
// 2. PARSEO DE CATEGORÍA
// =====================================================
function parseCategoria(jalisco) {
    const mapping = {
        'infantil_menor': { cat: 'infantil', sub: 'menor' },
        'infantil_intermedio': { cat: 'infantil', sub: 'intermedio' },
        'infantil_mayor': { cat: 'infantil', sub: 'mayor' },
        'juvenil_menor': { cat: 'juvenil', sub: 'menor' },
        'juvenil_mayor': { cat: 'juvenil', sub: 'mayor' },
        'libre_foam': { cat: 'libre', sub: 'espuma' },
        'libre_cloth': { cat: 'libre', sub: 'tela' },
        'libre_sub20': { cat: 'libre', sub: 'sub20' },
        'master': { cat: 'master', sub: '' }
    };
    
    const parsed = mapping[jalisco];
    if (parsed) {
        currentCategoria = parsed.cat;
        currentSubcategoria = parsed.sub;
    } else {
        console.error('Categoría no reconocida:', jalisco);
    }
}

// =====================================================
// 3. ACTUALIZAR TÍTULO DE PÁGINA
// =====================================================
function updatePageTitle() {
    const titleEl = document.querySelector('.section-title');
    if (titleEl) {
        let title = `SELECCIÓN JALISCO - ${currentCategoria.toUpperCase()}`;
        if (currentSubcategoria) {
            title += ` ${currentSubcategoria.toUpperCase()}`;
        }
        titleEl.textContent = title;
    }
}

// =====================================================
// 4. CONFIGURAR BOTONES DE RAMA
// =====================================================
function setupRamaButtons() {
    const buttons = document.querySelectorAll('.selector-btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            buttons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const ramaId = this.id.replace('btn-', '');
            currentRama = ramaId;
            
            renderConvocados();
        });
    });
}

// =====================================================
// 5. CARGAR DATOS DESDE GOOGLE SHEETS
// =====================================================
async function loadConvocados() {
    try {
        showLoading(true);
        
        console.log('🔄 Cargando convocados desde:', SHEET_URL);
        
        const response = await fetch(`${SHEET_URL}?action=getConvocados`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        console.log('📦 Respuesta recibida:', data);
        
        if (data.success) {
            convocadosData = data.convocados;
            console.log('✅ Datos cargados:', convocadosData.length, 'registros');
            
            // Mostrar primer registro para debug
            if (convocadosData.length > 0) {
                console.log('📋 Primer registro:', convocadosData[0]);
            }
        } else {
            throw new Error(data.message || 'Error desconocido');
        }
        
    } catch (error) {
        console.error('❌ Error:', error);
        showError('No se pudieron cargar los convocados. Intenta recargar la página.');
    } finally {
        showLoading(false);
    }
}

// =====================================================
// 6. FILTRAR CONVOCADOS
// =====================================================
function filterConvocados() {
    const filtered = convocadosData.filter(conv => {
        // Filtro por categoría
        if (conv.categoria.toLowerCase() !== currentCategoria) {
            return false;
        }
        
        // Filtro por subcategoría
        if (currentSubcategoria && conv.subcategoria.toLowerCase() !== currentSubcategoria) {
            return false;
        }
        
        // Filtro por rama
        const convRama = conv.rama.toLowerCase();
        const currentRamaLower = currentRama.toLowerCase();
        
        let normalizedConvRama = convRama;
        if (convRama === 'masculino') normalizedConvRama = 'varonil';
        if (convRama === 'femenino') normalizedConvRama = 'femenil';
        
        if (currentRamaLower === 'mixto') {
            return normalizedConvRama === 'mixto';
        } else if (currentRamaLower === 'varonil') {
            return normalizedConvRama === 'varonil';
        } else if (currentRamaLower === 'femenil') {
            return normalizedConvRama === 'femenil';
        }
        
        return false;
    });
    
    console.log(`🔍 Filtrado: ${filtered.length} de ${convocadosData.length} registros`);
    console.log(`   Categoría: ${currentCategoria}, Subcategoría: ${currentSubcategoria}, Rama: ${currentRama}`);
    
    return filtered;
}

// =====================================================
// 7. RENDERIZAR CONVOCADOS
// =====================================================
function renderConvocados() {
    const filtered = filterConvocados();
    
    const jugadores = filtered.filter(c => c.rol === 'jugador');
    const staff = filtered.filter(c => c.rol === 'tecnico' || c.rol === 'auxiliar');
    
    console.log(`👥 Jugadores: ${jugadores.length}, 👔 Staff: ${staff.length}`);
    
    renderJugadores(jugadores);
    renderStaff(staff);
    
    if (filtered.length === 0) {
        showEmptyState();
    }
}

// =====================================================
// 8. RENDERIZAR JUGADORES
// =====================================================
function renderJugadores(jugadores) {
    const grid = document.querySelector('.players-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    jugadores.forEach(jugador => {
        const card = createJugadorCard(jugador);
        grid.appendChild(card);
    });
}

function createJugadorCard(jugador) {
    const div = document.createElement('div');
    div.className = 'credential';
    
    // La URL ya viene procesada desde el backend
    const imgSrc = processImageURL(jugador.foto);
    
    console.log(`🖼️ Cargando imagen para ${jugador.nombre}:`, imgSrc);
    
    const clubLogo = jugador.club ? `imagen/club/${jugador.club.toLowerCase().replace(/\s+/g, '-')}.svg` : '';
    
    div.innerHTML = `
        <div class="role-badge">Jugador</div>
        <div class="photo-frame">
            <img src="${imgSrc}" 
                 alt="${jugador.nombre}" 
                 onerror="console.error('Error cargando imagen:', this.src); this.src='imagen/placeholder-player.png';"
                 onload="console.log('✅ Imagen cargada:', '${jugador.nombre}')">
        </div>
        <div class="shield-circle">
            ${clubLogo ? 
                `<img src="${clubLogo}" 
                     alt="${jugador.club}"
                     onerror="this.parentElement.innerHTML='<div class=\\'shield-placeholder\\'>${jugador.club || 'Club'}</div>'">` 
                : 
                `<div class="shield-placeholder">${jugador.club || 'Club'}</div>`
            }
        </div>
        <div class="name-section">
            ${jugador.nombre.toUpperCase()}
        </div>
    `;
    
    return div;
}

// =====================================================
// 9. RENDERIZAR STAFF
// =====================================================
function renderStaff(staff) {
    const grid = document.querySelector('.staff-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    staff.forEach(miembro => {
        const card = createStaffCard(miembro);
        grid.appendChild(card);
    });
}

function createStaffCard(miembro) {
    const div = document.createElement('div');
    div.className = 'credential-tecnico';
    
    const imgSrc = processImageURL(miembro.foto);
    const rolText = miembro.rol === 'tecnico' ? 'Entrenador' : 'Auxiliar Técnico';
    const badgeText = miembro.rol === 'tecnico' ? 'COACH' : 'AUXILIAR';
    
    console.log(`🖼️ Cargando imagen para ${miembro.nombre}:`, imgSrc);
    
    div.innerHTML = `
        <div class="role-badge">${rolText}</div>
        <div class="photo-frame">
            <img src="${imgSrc}" 
                 alt="${miembro.nombre}"
                 onerror="console.error('Error cargando imagen staff:', this.src); this.src='imagen/placeholder-coach.png';"
                 onload="console.log('✅ Imagen staff cargada:', '${miembro.nombre}')">
        </div>
        <div class="shield-tecnico">
            <div class="shield-placeholder">${badgeText}</div>
        </div>
        <div class="name-section" style="color: #2c3e50;">
            ${miembro.nombre.toUpperCase()}
        </div>
    `;
    
    return div;
}

// =====================================================
// 10. ESTADOS DE UI
// =====================================================
function showLoading(show) {
    let loader = document.getElementById('loading-overlay');
    
    if (show) {
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'loading-overlay';
            loader.innerHTML = `
                <div style="background: rgba(0,0,0,0.8); position: fixed; top: 0; left: 0; 
                            width: 100%; height: 100%; display: flex; align-items: center; 
                            justify-content: center; z-index: 9999;">
                    <div style="text-align: center; color: white;">
                        <i class="fas fa-spinner fa-spin" style="font-size: 3rem; margin-bottom: 20px;"></i>
                        <p style="font-size: 1.2rem;">Cargando convocados...</p>
                    </div>
                </div>
            `;
            document.body.appendChild(loader);
        }
        loader.style.display = 'block';
    } else {
        if (loader) {
            loader.style.display = 'none';
        }
    }
}

function showError(message) {
    const container = document.querySelector('.main-container');
    if (container) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-state';
        errorDiv.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; background: white; 
                        border-radius: 15px; margin: 40px auto; max-width: 600px;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                <i class="fas fa-exclamation-triangle" style="font-size: 4rem; color: #e63946; margin-bottom: 20px;"></i>
                <h2 style="color: #2c3e50; margin-bottom: 15px;">Error al cargar</h2>
                <p style="color: #666; font-size: 1.1rem;">${message}</p>
                <button onclick="location.reload()" class="btn" style="margin-top: 20px; padding: 12px 30px; background: #4fc3f7; color: white; border: none; border-radius: 50px; cursor: pointer;">
                    <i class="fas fa-redo"></i> Reintentar
                </button>
            </div>
        `;
        container.prepend(errorDiv);
    }
}

function showEmptyState() {
    const playersGrid = document.querySelector('.players-grid');
    const staffGrid = document.querySelector('.staff-grid');
    
    const emptyHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
            <i class="fas fa-search" style="font-size: 3rem; color: #ccc; margin-bottom: 20px;"></i>
            <h3 style="color: #666; margin-bottom: 10px;">No hay convocados</h3>
            <p style="color: #999;">No se encontraron jugadores para esta categoría y rama.</p>
        </div>
    `;
    
    if (playersGrid) playersGrid.innerHTML = emptyHTML;
    if (staffGrid) staffGrid.innerHTML = '';
}