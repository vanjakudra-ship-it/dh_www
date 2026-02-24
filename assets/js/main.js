// --- TRANSLATIONS (Now includes Dropdown Items) ---
const uiTranslations = {
    sr: {
        nav_home: "Početna",
        nav_about: "O nama",
        nav_projects: "Projekti",
        nav_contact: "Kontakt",
        // Dropdown Items
        nav_proj_overview: "Pregled",
        nav_proj_2026: "Letnja škola 2026",
        nav_proj_archive: "Prethodne škole",
        nav_proj_other: "Ostali Projekti",
        
        footer_rights: "Sva prava zadržana.",
        back_link: "Nazad"
    },
    en: {
        nav_home: "Home",
        nav_about: "About Us",
        nav_projects: "Projects",
        nav_contact: "Contact",
        // Dropdown Items
        nav_proj_overview: "Overview",
        nav_proj_2026: "Summer School 2026",
        nav_proj_archive: "Previous Schools",
        nav_proj_other: "Other Projects",

        footer_rights: "All rights reserved.",
        back_link: "Back"
    },
    es: {
        nav_home: "Inicio",
        nav_about: "Sobre nosotros",
        nav_projects: "Proyectos",
        nav_contact: "Contacto",
        // Dropdown Items
        nav_proj_overview: "Resumen",
        nav_proj_2026: "Escuela de Verano 2026",
        nav_proj_archive: "Previas escuelas",
        nav_proj_other: "Otros proyectos",

        footer_rights: "Todos los derechos reservados.",
        back_link: "Volver"
    }
};

function changeLang(lang) {
    localStorage.setItem('lang', lang);

    // 1. Update Text
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (uiTranslations[lang] && uiTranslations[lang][key]) {
            el.innerHTML = uiTranslations[lang][key];
        }
    });

    // 2. Update Buttons
    ['sr', 'es', 'en'].forEach(l => {
        const btn = document.getElementById(`btn-${l}`);
        if(btn) {
            btn.classList.toggle('text-brand-red', l === lang);
            btn.classList.toggle('bg-gray-100', l === lang);
            btn.classList.toggle('text-gray-400', l !== lang);
        }
    });

    // 3. SMART REDIRECT (Preserves #Anchors now)
    const path = window.location.pathname;
    let filename = path.split('/').pop() || "index.html";

    // Logic to detect current file language
    let currentFileLang = 'sr'; 
    if (filename.includes('-en.html')) currentFileLang = 'en';
    if (filename.includes('-es.html')) currentFileLang = 'es';
    if (filename.includes('-sr.html')) currentFileLang = 'sr';

    if (currentFileLang !== lang) {
        let baseName = filename.replace(/-en.html|-es.html|-sr.html|.html/g, "");
        let newFilename;
        const isCorePage = ['index', 'about', 'contact'].includes(baseName);

        if (lang === 'sr') {
            newFilename = isCorePage ? baseName + ".html" : baseName + "-sr.html";
        } else {
            newFilename = baseName + "-" + lang + ".html";
        }

        // REDIRECT with Hash preserved (e.g., #archive)
        window.location.href = path.replace(filename, newFilename) + window.location.hash;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const savedLang = localStorage.getItem('lang') || 'sr';
    changeLang(savedLang);
});

/* =========================================
   LIGHTBOX / GALLERY LOGIC
   ========================================= */
let currentImageIndex = 0;
let galleryImages = [];

function initLightbox() {
    // 1. Find all gallery images on the page
    const images = document.querySelectorAll('.gallery-item');
    
    if (images.length > 0) {
        // Save sources to array
        galleryImages = Array.from(images).map(img => img.src);

        // 2. Inject the Modal HTML into the body (if not already there)
        if (!document.getElementById('lightbox-modal')) {
            const modalHTML = `
                <div id="lightbox-modal" class="fixed inset-0 z-[100] bg-black/95 hidden flex items-center justify-center opacity-0 transition-opacity duration-300">
                    
                    <button onclick="closeLightbox()" class="absolute top-6 right-6 text-white hover:text-brand-red transition z-50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>

                    <button onclick="changeSlide(-1)" class="absolute left-4 md:left-8 text-white hover:text-brand-red transition p-2 bg-black/50 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>

                    <img id="lightbox-img" src="" class="max-h-[90vh] max-w-[90vw] object-contain rounded-md shadow-2xl transform scale-95 transition-transform duration-300">

                    <button onclick="changeSlide(1)" class="absolute right-4 md:right-8 text-white hover:text-brand-red transition p-2 bg-black/50 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                    
                    <div id="lightbox-counter" class="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-gray-400 text-sm font-heading tracking-widest">
                        1 / 5
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }

        // 3. Add click events to the images
        images.forEach((img, index) => {
            img.style.cursor = 'zoom-in';
            img.onclick = () => openLightbox(index);
        });
    }
}

function openLightbox(index) {
    currentImageIndex = index;
    const modal = document.getElementById('lightbox-modal');
    const img = document.getElementById('lightbox-img');
    
    // Update Content
    updateLightboxImage();
    
    // Show Modal
    modal.classList.remove('hidden');
    // Small delay to allow display:block to apply before opacity transition
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        img.classList.remove('scale-95');
        img.classList.add('scale-100');
    }, 10);
    
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const modal = document.getElementById('lightbox-modal');
    const img = document.getElementById('lightbox-img');
    
    modal.classList.add('opacity-0');
    img.classList.add('scale-95');
    img.classList.remove('scale-100');
    
    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }, 300);
}

function changeSlide(step) {
    currentImageIndex += step;
    
    // Loop navigation
    if (currentImageIndex >= galleryImages.length) currentImageIndex = 0;
    if (currentImageIndex < 0) currentImageIndex = galleryImages.length - 1;
    
    updateLightboxImage();
}

function updateLightboxImage() {
    const img = document.getElementById('lightbox-img');
    const counter = document.getElementById('lightbox-counter');
    
    img.src = galleryImages[currentImageIndex];
    counter.innerText = `${currentImageIndex + 1} / ${galleryImages.length}`;
}

// Close on Escape Key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') changeSlide(-1);
    if (e.key === 'ArrowRight') changeSlide(1);
});

// Initialize on load
document.addEventListener('DOMContentLoaded', initLightbox);