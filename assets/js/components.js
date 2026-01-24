document.addEventListener("DOMContentLoaded", function() {
    // Load Header
    fetch('/assets/includes/header.html')
        .then(res => res.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            // Re-apply language to the newly loaded header
            const savedLang = localStorage.getItem('lang') || 'sr';
            if(window.changeLang) window.changeLang(savedLang);
            if(window.lucide) lucide.createIcons();
        });

    // Load Footer
    fetch('/assets/includes/footer.html')
        .then(res => res.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
            const savedLang = localStorage.getItem('lang') || 'sr';
            if(window.changeLang) window.changeLang(savedLang);
            if(window.lucide) lucide.createIcons();
        });
});