
    // Agregar parámetros a las URLs de las tarjetas
    const cards = document.querySelectorAll('.category-card');
    cards.forEach(card => {
        const id = card.id;
        card.href = `convocados_jalisco.html?categoria=${id}`;
    });

document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar todas las tarjetas
    const cards = document.querySelectorAll('.card');
    
    // Añadir evento de clic a cada tarjeta
    cards.forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('flipped');
        });
    });
    
    // Botón para voltear todas las tarjetas
    document.getElementById('flipAll').addEventListener('click', function() {
        cards.forEach(card => {
            card.classList.add('flipped');
        });
    });

    // Hacer las tarjetas enfocables para accesibilidad
    cards.forEach(card => {
        card.setAttribute('tabindex', '0');
    });
});