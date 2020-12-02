window.onload = (() => {
    // Openning menu while using mobil device
    let mobile_menu_toggle = document.getElementById('mobile-menu-toggle');
    let mobile_menu = document.getElementById('mobile-header-menu');

    mobile_menu_toggle.onclick = (()=>{
        mobile_menu.classList.toggle('active');
    });

    // Auto Toc
    const auto_toc = document.getElementById('toc-auto');
    const post = document.getElementsByClassName('post')[0];
    const rect = post.getBoundingClientRect();
    // Attach the toc to the right of post content
    auto_toc.style.left = `${rect.left + rect.width + 20}px`
    auto_toc.style.maxWidth = `${rect.left - 20}px`;
    auto_toc.style.visibility = "visible";
    window.addEventListener('resize', () => {
        let currentRect = post.getBoundingClientRect();
        // Attach the toc to the right of post content
        auto_toc.style.left = `${currentRect.left + currentRect.width + 20}px`
        auto_toc.style.maxWidth = `${currentRect.left - 20}px`;
        auto_toc.style.visibility = "visible";
    }, false);

    // Keep toc follow the content
    const headerHeight = document.getElementById('header-desktop').offsetHeight;
    const footerTop = document.getElementById('post-footer').offsetTop;
    const topSpacing = 20 + headerHeight;
    const minTocTop = auto_toc.offsetTop;
    const minScrollTop = minTocTop - topSpacing;
    const maxTocTop = footerTop - auto_toc.getBoundingClientRect().height;
    const maxScrollTop = maxTocTop - topSpacing;

    window.addEventListener('scroll', () => {
        const currentScrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
        if (currentScrollTop < minScrollTop) {
            auto_toc.style.position = 'absolute';
            auto_toc.style.top = `${minTocTop}px`;
        } else if (currentScrollTop > maxScrollTop) {
            auto_toc.style.position = 'absolute';
            auto_toc.style.top = `${maxTocTop}px`;
        } else {
            auto_toc.style.position = 'fixed';
            auto_toc.style.top = `${topSpacing}px`;
        }
    }, false);
})