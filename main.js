// Application Logic for Event Invitation (Baby Shower - Killari Cataleya)

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializar animaciones AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 80
        });
    }

    // 2. Inicializar partículas en el canvas
    initParticles();
});

// Referencias del DOM
const btnOpen = document.getElementById('btn-open');
const envelopeModal = document.getElementById('envelope-modal');
const bgMusic = document.getElementById('bg-music');
const btnMusicContainer = document.getElementById('btn-music-container');
const btnMusic = document.getElementById('btn-music');
const musicText = document.getElementById('music-text');
const equalizerBars = document.querySelectorAll('.music-bar');

let isMusicPlaying = false;

// 3. Apertura de la Invitación (Sobre de Bienvenida)
if (btnOpen && envelopeModal) {
    btnOpen.addEventListener('click', () => {
        // Habilitar el desplazamiento (scroll) en la página
        document.body.classList.remove('overflow-hidden');

        // Animación de cierre del modal sobre
        envelopeModal.style.opacity = '0';
        envelopeModal.style.transform = 'scale(1.05)';
        
        setTimeout(() => {
            envelopeModal.style.display = 'none';
        }, 700);

        // Lanzar lluvia de confeti
        triggerConfetti();

        // Reproducir música
        playMusic();
    });
}

// 4. Control de Audio y Ecualizador
function playMusic() {
    if (!bgMusic) return;
    
    bgMusic.play().then(() => {
        isMusicPlaying = true;
        updateMusicUI(true);
        if (btnMusicContainer) btnMusicContainer.classList.remove('hidden');
    }).catch(err => {
        console.log('Autoplay prevenido por el navegador:', err);
        if (btnMusicContainer) btnMusicContainer.classList.remove('hidden');
        updateMusicUI(false);
    });
}

function toggleMusic() {
    if (!bgMusic) return;

    if (isMusicPlaying) {
        bgMusic.pause();
        isMusicPlaying = false;
        updateMusicUI(false);
    } else {
        bgMusic.play();
        isMusicPlaying = true;
        updateMusicUI(true);
    }
}

function updateMusicUI(playing) {
    if (musicText) {
        musicText.innerText = playing ? 'Pausar Música' : 'Reproducir Música';
    }
    equalizerBars.forEach(bar => {
        if (playing) {
            bar.classList.remove('music-bar-paused');
        } else {
            bar.classList.add('music-bar-paused');
        }
    });
}

if (btnMusic) {
    btnMusic.addEventListener('click', toggleMusic);
}

// 5. Configuración de la Cuenta Regresiva
// FECHA DEL EVENTO: 26 de Septiembre del 2026 a las 6:00 PM (18:00 hrs)
const targetDate = new Date('2026-09-26T18:00:00').getTime();

const countdown = setInterval(() => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    const daysElem = document.getElementById('days');
    const hoursElem = document.getElementById('hours');
    const minutesElem = document.getElementById('minutes');
    const secondsElem = document.getElementById('seconds');

    if (distance < 0) {
        clearInterval(countdown);
        const container = document.getElementById('countdown-container');
        if (container) {
            container.innerHTML = `
                <div class="col-span-full bg-pink-100 p-6 rounded-3xl border border-pink-200">
                    <h3 class="text-3xl font-script text-pink-600 font-bold">¡El gran día ha llegado! 🎉</h3>
                    <p class="text-gray-600 text-sm mt-2">Estamos celebrando el Baby Shower de Killari Cataleya.</p>
                </div>
            `;
        }
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysElem) daysElem.innerText = days < 10 ? '0' + days : days;
    if (hoursElem) hoursElem.innerText = hours < 10 ? '0' + hours : hours;
    if (minutesElem) minutesElem.innerText = minutes < 10 ? '0' + minutes : minutes;
    if (secondsElem) secondsElem.innerText = seconds < 10 ? '0' + seconds : seconds;
}, 1000);

// 6. Funciones de Copiado al Portapapeles
window.copyToClipboard = function(text, label = 'Información') {
    navigator.clipboard.writeText(text).then(() => {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: '¡Copiado con éxito!',
                text: `${label} (${text}) ha sido copiado al portapapeles.`,
                icon: 'success',
                confirmButtonColor: '#ec4899',
                confirmButtonText: 'Entendido',
                customClass: {
                    popup: 'rounded-3xl'
                }
            });
        } else {
            alert(`${label} copiado: ${text}`);
        }
    }).catch(err => {
        console.error('Error al copiar: ', err);
    });
};

window.copyAddress = function(address) {
    window.copyToClipboard(address, 'La dirección');
};

// 7. Formulario RSVP e Integración con WhatsApp
const rsvpForm = document.getElementById('rsvp-form');
if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('guest-name').value.trim();
        const attendance = document.getElementById('attendance-status').value;
        const count = document.getElementById('guest-count').value;
        const message = document.getElementById('guest-message').value.trim();

        if (!name) {
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    title: 'Por favor ingresa tu nombre',
                    text: 'Necesitamos saber quién confirma su asistencia.',
                    icon: 'warning',
                    confirmButtonColor: '#ec4899'
                });
            }
            return;
        }

        // Lanzar confeti por confirmación
        triggerConfetti();

        // Construir mensaje de WhatsApp
        let waMessage = `¡Hola! 👋 Soy *${name}*.\n\n`;
        waMessage += `📌 *Asistencia:* ${attendance}\n`;
        waMessage += `👥 *Acompañantes:* ${count}\n`;
        if (message) {
            waMessage += `💬 *Mensaje:* "${message}"\n`;
        }
        waMessage += `\n✨ Confirmado para el Baby Shower de Killari Cataleya (26 Sept 2026 - Jr. Tarapacá #146).`;

        const phoneNumber = '51952763941'; // Número de confirmación WhatsApp
        const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(waMessage)}`;

        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: '¡Gracias por confirmar!',
                text: 'Te redirigiremos a WhatsApp para enviar tu mensaje de confirmación.',
                icon: 'success',
                showCancelButton: true,
                confirmButtonColor: '#25D366',
                cancelButtonColor: '#94a3b8',
                confirmButtonText: 'Abrir WhatsApp 💬',
                cancelButtonText: 'Cerrar',
                customClass: {
                    popup: 'rounded-3xl'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    window.open(waUrl, '_blank');
                }
            });
        } else {
            window.open(waUrl, '_blank');
        }
    });
}

// 8. Efecto Confeti Celebratorio (Paleta Vino y Dorado)
function triggerConfetti() {
    if (typeof confetti === 'function') {
        // Ráfaga 1: Izquierda y Derecha
        confetti({
            particleCount: 85,
            spread: 75,
            origin: { y: 0.6 },
            colors: ['#722f37', '#881337', '#be123c', '#d4af37', '#ffffff']
        });

        setTimeout(() => {
            confetti({
                particleCount: 55,
                angle: 60,
                spread: 60,
                origin: { x: 0 },
                colors: ['#881337', '#fda4af', '#ffffff']
            });
            confetti({
                particleCount: 55,
                angle: 120,
                spread: 60,
                origin: { x: 1 },
                colors: ['#722f37', '#d4af37', '#ffffff']
            });
        }, 300);
    }
}

// 9. Partículas de Fondo Interactivas (Sparkles & Petals Canvas - Paleta Vino)
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor(width / 25), 45); // Adaptable al ancho de pantalla

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height - height;
            this.size = Math.random() * 4 + 2;
            this.speedY = Math.random() * 1.2 + 0.4;
            this.speedX = Math.random() * 0.6 - 0.3;
            this.opacity = Math.random() * 0.5 + 0.3;
            this.color = Math.random() > 0.4 ? '#fecdd3' : (Math.random() > 0.5 ? '#881337' : '#d4af37');
            this.angle = Math.random() * Math.PI * 2;
            this.spin = Math.random() * 0.02 - 0.01;
        }

        update() {
            this.y += this.speedY;
            this.x += Math.sin(this.angle) * 0.5 + this.speedX;
            this.angle += this.spin;

            if (this.y > height + 20) {
                this.reset();
                this.y = -10;
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    animate();
}

