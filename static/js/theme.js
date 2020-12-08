class Util {
    forEach(elements, handler) {
        elements = elements || [];
        for (let i=0; i<elements.length; i++) {
            handler(elements[i])
        }
    }

    animateCSS(element, animation, reserved, callback) {
        if (!Array.isArray(animation)) animation = [animation];
        element.classList.add('animated', ...animation);
        const handler = () => {
            element.classList.remove('animated', ...animation);
            element.removeEventListener('animationend', handler);
            if (typeof callback === 'function') callback();
        };
        if (!reserved) element.addEventListener('animationend', handler, false);
    }
}

class Themes {
    constructor() {
        this.util = new Util();
        this.config = window.config;
        this.resizeEventSet = new Set();
        this.scrollEventSet = new Set();
        // this.data = this.config.data;
    }

    init() {
        try {
            this.initToc();
            this.initMobileMenu();
            this.InitHighlight();
            this.initProfile();
            this.onResize();
            this.onScroll();
        } catch (err) {
            console.error(err);
        }
    }

    initMobileMenu() {
        // Openning menu while using mobil device
        let mobile_menu_toggle = document.getElementById('mobile-menu-toggle');
        let mobile_menu = document.getElementById('mobile-header-menu');

        mobile_menu_toggle.onclick = (()=>{
            mobile_menu.classList.toggle('active');
        });
    }

    InitHighlight() {
        this.util.forEach(document.querySelectorAll('.highlight > .chroma'), $chroma => {
            const $codeElements = $chroma.querySelectorAll('pre.chroma > code');
            if ($codeElements.length) {
                const $code = $codeElements[$codeElements.length - 1];
                const $header = document.createElement('div');
                $header.className = 'code-header ' + $code.className.toLowerCase();

                // Title of code space
                const $title = document.createElement('span');
                $title.insertAdjacentHTML('afterbegin', '<i class="arrow fas fa-chevron-right fa-fw"></i>');
                $title.classList.add('code-title');
                $title.addEventListener('click', () => {
                    $chroma.classList.toggle('open');
                }, false);
                $header.appendChild($title);
                // Showed on title while code is shrinking
                const $ellipses = document.createElement('span');
                $ellipses.insertAdjacentHTML('afterbegin', '<i class="fas fa-ellipsis-h fa-fw"></i>');
                $ellipses.classList.add('ellipses');
                $ellipses.addEventListener('click', () => {
                    $chroma.classList.toggle('open');
                }, false);
                $header.appendChild($ellipses);
                // Copy button
                const $copy = document.createElement('span');
                $copy.insertAdjacentHTML('afterbegin', '<i class="far fa-copy fa-fw"></i>');
                $copy.classList.add('copy');
                const code = $code.innerText;
                // if (this.config.code.maxShownLines < 0 
                //     || code.split('\n').lenght < this.config.code.maxShownLines + 2) {
                //     $chroma.classList.add('open');
                // }
                // if (this.config.code.copyTitle) {
                //     $copy.setAttribute('data-clipboard-text', code);
                //     $copy.title = this.config.code.copyTitle;
                //     const clipboard = new ClipboardJS($copy);
                //     clipboard.on('success', _e => {
                //         this.util.animateCSS($code, 'flash');
                //     });
                //     $header.appendChild($copy);
                // }
                $header.appendChild($copy);
                $chroma.insertBefore($header, $chroma.firstChild);
            }
        });

        this.util.forEach(document.querySelectorAll('.container table'), $table => {
            const $wrapper = document.createElement('div');
            $wrapper.className = 'table-wrapper';
            $table.parentElement.replaceChild($wrapper, $table);
            $wrapper.append($table);
        });
    }

    initToc() {
        const $tocCore = document.getElementById('TableOfContents');
        if ($tocCore === null)
            return;
        // Auto Toc
        const auto_toc = document.getElementById('toc-auto');
        const post = document.getElementsByClassName('post')[0];
        const rect = post.getBoundingClientRect();
        // Attach the toc to the right side of post content
        auto_toc.style.left = `${rect.left + rect.width + 20}px`
        auto_toc.style.maxWidth = `${rect.left - 20}px`;
        auto_toc.style.visibility = 'visible';

        this._tocOnResize = (() => {
            let currentRect = post.getBoundingClientRect();
            // Attach the toc automatically to the right side of post content
            auto_toc.style.left = `${currentRect.left + currentRect.width + 20}px`
            auto_toc.style.maxWidth = `${currentRect.left - 20}px`;
        });
        this.resizeEventSet.add(this._tocOnResize);

        // Keep toc follow the content
        const headerHeight = document.getElementById('header-desktop').offsetHeight;
        const footerTop = document.getElementById('post-footer').offsetTop;
        const topSpacing = 20 + headerHeight;
        const minTocTop = auto_toc.offsetTop;
        const minScrollTop = minTocTop - topSpacing;
        const maxTocTop = footerTop - auto_toc.getBoundingClientRect().height;
        const maxScrollTop = maxTocTop - topSpacing;

        this._tocOnScroll = (() => {
            const currentScrollTop = (document.documentElement 
                && document.documentElement.scrollTop) || document.body.scrollTop;
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
        });
        this.scrollEventSet.add(this._tocOnScroll);
    }

    initProfile() {
        // Profile on the home page
        const profile_aside = document.getElementById('profile-auto');
        if (profile_aside === null)
            return;
        const summary = document.getElementsByClassName('container-summarys')[0];
        const summary_rect = summary.getBoundingClientRect();
        // Attach the profile to the right side of summary
        profile_aside.style.left = `${summary_rect.left + summary_rect.width + 20}px`;
        profile_aside.style.maxWidth = `${summary_rect.left - 20}px`;
        profile_aside.style.visibility = 'visible';

        this._profileOnResize = (() => {
            let currentRect = summary.getBoundingClientRect();
            // Attach the profile automatically to the right side of summary
            profile_aside.style.left = `${currentRect.left + currentRect.width + 20}px`;
            profile_aside.style.maxWidth = `${currentRect.left - 20}px`;
        });
        this.resizeEventSet.add(this._profileOnResize);

        // Keep profile follow the summary
        const headerHeight = document.getElementById('header-desktop').offsetHeight;
        const footerTop = document.getElementsByClassName('footer')[0].offsetTop;
        const topSpacing = 20 + headerHeight;
        const minTocTop = profile_aside.offsetTop;
        const minScrollTop = minTocTop - topSpacing;
        const maxTocTop = footerTop - profile_aside.getBoundingClientRect().height;
        const maxScrollTop = maxTocTop - topSpacing;

        this._profileOnScroll = (() => {
            const currentScrollTop = (document.documentElement 
                && document.documentElement.scrollTop) || document.body.scrollTop;
            if (currentScrollTop < minScrollTop) {
                profile_aside.style.position = 'absolute';
                profile_aside.style.top = `${minTocTop}px`;
            } else if (currentScrollTop > maxScrollTop) {
                profile_aside.style.position = 'absolute';
                profile_aside.style.top = `${maxTocTop}px`;
            } else {
                profile_aside.style.position = 'fixed';
                profile_aside.style.top = `${topSpacing}px`;
            }
        });
        this.scrollEventSet.add(this._profileOnScroll);
    }

    onResize() {
        window.addEventListener('resize', () => {
            for (let event of this.resizeEventSet) {
                event();
            }
        }, false);
    }

    onScroll() {
        window.addEventListener('scroll', () => {
            for (let event of this.scrollEventSet) {
                event();
            }
        }, false);
    }
}

const themeInit = () => {
    const theme = new Themes();
    theme.init();
}

if (document.readyState !== 'loading') {
    themeInit();
} else {
    document.addEventListener('DOMContentLoaded', themeInit, false);
}