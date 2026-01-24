// --- TRANSLATIONS FOR SHARED UI (Nav/Footer ONLY) ---
// This only translates the parts loaded via components.js
const uiTranslations = {
    sr: {
        nav_home: "Početna", nav_about: "O nama", nav_projects: "Projekti", nav_contact: "Kontakt",
        footer_rights: "Sva prava zadržana.", back_link: "Nazad"
    },
    en: {
        nav_home: "Home", nav_about: "About Us", nav_projects: "Projects", nav_contact: "Contact",
        footer_rights: "All rights reserved.", back_link: "Back"
    },
    es: {
        nav_home: "Inicio", nav_about: "Sobre Nosotros", nav_projects: "Proyectos", nav_contact: "Contacto",
        footer_rights: "Todos los derechos reservados.", back_link: "Volver"
    }
};

function changeLang(lang) {
    // 1. Save preference
    localStorage.setItem('lang', lang);

    // 2. Update Shared UI (Nav/Footer)
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (uiTranslations[lang] && uiTranslations[lang][key]) {
            el.innerHTML = uiTranslations[lang][key];
        }
    });

    // 3. Highlight Buttons
    ['sr', 'es', 'en'].forEach(l => {
        const btn = document.getElementById(`btn-${l}`);
        if(btn) {
            btn.classList.toggle('text-brand-red', l === lang);
            btn.classList.toggle('bg-gray-100', l === lang);
            btn.classList.toggle('text-gray-400', l !== lang);
        }
    });

    // 4. SMART REDIRECT SYSTEM
    const path = window.location.pathname;
    let filename = path.split('/').pop();
    if (!filename || filename === "") filename = "index.html"; // Handle root

    // Detect current page language based on suffix
    let currentFileLang = 'sr'; // Default to Serbian (for index.html, about.html)
    if (filename.includes('-en.html')) currentFileLang = 'en';
    if (filename.includes('-es.html')) currentFileLang = 'es';
    // If you used -sr.html explicitly in projects:
    if (filename.includes('-sr.html')) currentFileLang = 'sr';

    // Only redirect if we are on the wrong file for the selected language
    if (currentFileLang !== lang) {
        
        // Strip existing suffix to find the "Base Name"
        // e.g., "about-en.html" -> "about"
        // e.g., "about.html" -> "about"
        let baseName = filename.replace(/-en.html|-es.html|-sr.html|.html/g, "");
        
        let newFilename;
        
        // RULE: Core pages (index, about, contact) use .html for Serbian.
        // Project pages use -sr.html for Serbian (from previous step).
        // We check if it's a core page base name:
        const isCorePage = ['index', 'about', 'contact'].includes(baseName);

        if (lang === 'sr') {
            if (isCorePage) {
                newFilename = baseName + ".html"; // about.html
            } else {
                newFilename = baseName + "-sr.html"; // 2024-sr.html
            }
        } else {
            newFilename = baseName + "-" + lang + ".html"; // about-en.html
        }

        // Execute Redirect
        window.location.href = path.replace(filename, newFilename);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const savedLang = localStorage.getItem('lang') || 'sr';
    changeLang(savedLang);
});