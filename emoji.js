const mainCat = document.getElementById('main-cat');
const counter = document.getElementById('counter');
let catCount = 0;
let clickCount = 0;
let clickTimer = null;
let post20ClickCount = 0;

const catComments = [
    "¡Miau!", "oh, aparecio otro?", "¿Tienes comida?",
    "¡Mira qué bigotes!", "¡Que divertido!, no crees?",
    "WooW, ahora soy un gato", "Quiero atún ",
    "¿Viste mi infinito?", "Este es mi lugar ahora",
    "¡Saltar, correr y arrastrarse ...!", "NO hay escapatoria",
    "¿Me recordarán?", "Tengo sueño...", "Zzz...",
    "Ella es la única luz en la luna",
    "El número / 8 / horizontal es un infinito",
    "¡No!", "Quiero salir... o no", "¿Dónde está mi... ?",
    "Esto es el..."
];

// Gato principal
mainCat.addEventListener('click', function () {
    clickCount++;

    if (clickCount === 1) {
        clickTimer = setTimeout(() => {
            clickCount = 0;
        }, 300);
    } else if (clickCount === 2) {
        clearTimeout(clickTimer);
        clickCount = 0;

        if (catCount < 20) {
            createRandomCat();
        } else {
            post20ClickCount++;
            if (post20ClickCount === 3) {
                triggerLightCircle();
            }
        }
    }
});

function createRandomCat() {
    catCount++;
    counter.style.display = 'block';
    counter.textContent = `Gatos: ${catCount}/20`;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const randomLeft = Math.random() * (windowWidth - 120);
    const randomTop = Math.random() * (windowHeight - 120);

    const catContainer = document.createElement('div');
    catContainer.className = 'cat-container';
    catContainer.style.left = `${randomLeft}px`;
    catContainer.style.top = `${randomTop}px`;

    const catEmoji = document.createElement('div');
    catEmoji.className = 'emoji cat-emoji';
    catEmoji.textContent = '🐱';

    const catComment = document.createElement('div');
    catComment.className = 'cat-comment';
    catComment.textContent = catComments[catCount - 1];

    catEmoji.addEventListener('click', function (e) {
        e.stopPropagation();
        clickCount++;
        if (clickCount === 1) {
            clickTimer = setTimeout(() => {
                clickCount = 0;
            }, 300);
        } else if (clickCount === 2) {
            clearTimeout(clickTimer);
            clickCount = 0;
            if (catCount < 20) {
                createRandomCat();
            }
        }
    });

    catContainer.appendChild(catEmoji);
    catContainer.appendChild(catComment);
    document.body.appendChild(catContainer);

    catContainer.style.transform = 'scale(0)';
    setTimeout(() => {
        catContainer.style.transition = 'transform 0.3s';
        catContainer.style.transform = 'scale(1)';
    }, 10);
}

function triggerLightCircle() {
    if (document.querySelector('.expanding-circle')) return;

    const circle = document.createElement('div');
    circle.className = 'expanding-circle';
    document.body.appendChild(circle);

    void circle.offsetWidth;

    const pageHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    const pageWidth = Math.max(document.body.scrollWidth, document.documentElement.scrollWidth);
    const diagonal = Math.sqrt(pageWidth ** 2 + pageHeight ** 2);
    const scaleFactor = diagonal / 20;

    circle.style.transform = `translate(-50%, -50%) scale(${scaleFactor})`;

    setTimeout(showPasswordOverlay, 2000); // Mostrar después de la luz
}

function showPasswordOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'password-overlay';

    overlay.innerHTML = `
        <div class="password-box">
            <h2>Ingresa la contraseña</h2>
            <input type="text" id="password-input" maxlength="4" inputmode="numeric" />
            <br />
            <button onclick="checkPassword()">Entrar</button>
            <div id="error-msg"></div>
        </div>
    `;

    document.body.appendChild(overlay);
}

function checkPassword() {
    const input = document.getElementById('password-input').value;
    const errorMsg = document.getElementById('error-msg');

    if (!/^\d{4}$/.test(input)) {
        errorMsg.textContent = 'Solo números de 4 cifras';
        return;
    }

    if (input === '4208') {
        window.location.href = 'https://docs.google.com/document/d/1frLTDZkaTiwsrVQwuYfcwhMIsYJ9VabylIrAgpQZSEk/edit?usp=drivesdk'; // cambia esto por tu URL real
    } else {
        errorMsg.textContent = 'Contraseña incorrecta';
    }
}


