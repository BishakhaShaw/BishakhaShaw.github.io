/* ==========================================================================
   Mobile menu
   ========================================================================== */

let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

function toggleMenu(){
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
}

menuIcon.addEventListener('click', toggleMenu);
menuIcon.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        toggleMenu();
    }
});

// close mobile menu after a nav link is tapped
document.querySelectorAll('.navbar a').forEach(link => {
    link.addEventListener('click', () => {
        menuIcon.classList.remove('bx-x');
        navbar.classList.remove('active');
    });
});

/* ==========================================================================
   Scroll spy + sticky header
   ========================================================================== */

let sections = document.querySelectorAll('section');
let navlinks = document.querySelectorAll('header nav a');
let header = document.querySelector('header');

window.addEventListener('scroll', () => {
    let top = window.scrollY;

    sections.forEach(sec => {
        let offset = sec.offsetTop - 120;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if(top >= offset && top < offset + height) {
            navlinks.forEach(link => link.classList.remove('active'));
            let activeLink = document.querySelector('header nav a[href="#' + id + '"]');
            if(activeLink) activeLink.classList.add('active');
        }
    });

    header.classList.toggle('sticky', window.scrollY > 80);
});

/* ==========================================================================
   Terminal boot sequence (hero signature element)
   ========================================================================== */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const bootLines = [
    { text: '$ ssh deploy@bishakha.dev', cls: 'ln-prompt' },
    { text: 'Authenticating... done', cls: 'ln-ok' },
    { text: 'Last login: Jul 2025 from Digit Insurance', cls: '' },
    { text: '$ status --check --all-services', cls: 'ln-prompt' },
    { text: 'Compiling profile summary...', cls: '' },
];

function runBootSequence(){
    const linesEl = document.getElementById('terminalLines');
    const statusGrid = document.getElementById('statusGrid');

    if(!linesEl || !statusGrid) return;

    if(prefersReducedMotion){
        linesEl.innerHTML = bootLines.map(l => `<span class="${l.cls}">${l.text}</span>`).join('\n');
        statusGrid.classList.add('is-visible');
        return;
    }

    let lineIndex = 0;
    let charIndex = 0;
    let currentLineSpan = null;

    function typeNextChar(){
        if(lineIndex >= bootLines.length){
            statusGrid.classList.add('is-visible');
            return;
        }

        const line = bootLines[lineIndex];

        if(charIndex === 0){
            currentLineSpan = document.createElement('span');
            currentLineSpan.className = line.cls;
            linesEl.appendChild(currentLineSpan);
        }

        if(charIndex < line.text.length){
            currentLineSpan.textContent += line.text.charAt(charIndex);
            charIndex++;
            setTimeout(typeNextChar, 16 + Math.random() * 18);
        } else {
            linesEl.appendChild(document.createTextNode('\n'));
            lineIndex++;
            charIndex = 0;
            setTimeout(typeNextChar, 220);
        }
    }

    typeNextChar();
}

// kick off boot sequence once the hero terminal scrolls/loads into view
const terminalPanel = document.querySelector('.terminal-panel');
if(terminalPanel){
    const bootObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                runBootSequence();
                obs.disconnect();
            }
        });
    }, { threshold: 0.3 });

    bootObserver.observe(terminalPanel);
}

/* ==========================================================================
   Scroll reveal
   ========================================================================== */

const revealEls = document.querySelectorAll('[data-reveal]');

if(prefersReducedMotion){
    revealEls.forEach(el => el.classList.add('is-visible'));
} else {
    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealEls.forEach(el => revealObserver.observe(el));
}