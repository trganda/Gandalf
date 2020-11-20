window.onload = (() => {
    let mobile_menu_toggle = document.getElementById('mobile-menu-toggle');
    let mobile_menu = document.getElementById('mobile-header-menu');

    mobile_menu_toggle.onclick = (()=>{
        mobile_menu.classList.toggle('active');
    });
})