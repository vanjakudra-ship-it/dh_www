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
        nav_proj_archive: "Arhiva",
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
        nav_proj_archive: "Archive",
        nav_proj_other: "Other Projects",

        footer_rights: "All rights reserved.",
        back_link: "Back"
    },
    es: {
        nav_home: "Inicio",
        nav_about: "Sobre Nosotros",
        nav_projects: "Proyectos",
        nav_contact: "Contacto",
        // Dropdown Items
        nav_proj_overview: "Resumen",
        nav_proj_2026: "Escuela de Verano 2026",
        nav_proj_archive: "Archivo",
        nav_proj_other: "Otros Proyectos",

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