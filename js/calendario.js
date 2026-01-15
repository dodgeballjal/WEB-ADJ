// 🔗 PEGA AQUÍ LA URL DE TU WEB APP DE GOOGLE APPS SCRIPT
const EVENTS_API_URL = 'https://script.google.com/macros/s/AKfycbwozMGQwZ40j30atqJAGjvuySer4I_3uzLcw6nFqYf1xBkPUpHly9Su938den9kLFFWhA/exec';

function ordenarEventosPorFecha(eventos) {
    return eventos
        .filter(e => e.fechaISO && e.titulo)
        .sort((a, b) => new Date(a.fechaISO) - new Date(b.fechaISO));
}

function renderizarEventos(eventos) {
    const container = document.getElementById('eventsList');
    const iconos = {
        liga: "fa-trophy",
        torneo: "fa-award",
        amistoso: "fa-handshake",
        internacional: "fa-globe-americas"
    };
    if (eventos.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#777;">No hay eventos.</p>';
    return;
    }

    container.innerHTML = eventos.map(e => {
        const tipo = (e.tipo || 'evento').toLowerCase();
        const icon = iconos[tipo] || "fa-calendar-day";
        return `
        <div class="event-card ${tipo}">
            <div class="event-date"><i class="fas ${icon}"></i> ${e.fecha || e.fechaISO}</div>
            <span class="event-type ${tipo}">${tipo.toUpperCase()}</span>
            <div class="event-title">${e.titulo}</div>
            <div class="event-location"><i class="fas fa-map-marker-alt"></i> ${e.lugar || ''}</div>
        </div>`;
    }).join('');
}

async function cargarEventos() {
    const container = document.getElementById('eventsList');
    try {
        const res = await fetch(EVENTS_API_URL);
        if (!res.ok) throw new Error('Error al cargar');
            const eventos = await res.json();
            renderizarEventos(ordenarEventosPorFecha(eventos));
    } catch (err) {
        console.error(err);
        container.innerHTML = `<p style="text-align:center;color:#e74c3c;">⚠️ Error: ${err.message}</p>`;
    }
}

document.addEventListener('DOMContentLoaded', cargarEventos);