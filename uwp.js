'use strict';

window.addEventListener('load', function() {
    app.uwp_mode = true;
    document.body.classList.add("UWPMode");
    if (app.uwpBarHeight) {
        document.getElementById("header-content-block").style.transform = "translateY("+app.uwpBarHeight+"px)";
        document.getElementById("main").style.transform = "translateY("+app.uwpBarHeight+"px)";
        document.getElementById("sidebar-header").style.marginTop = app.uwpBarHeight+"px";
        let m = document.createElement("div");
        m.id = "uwpFakeTopLine";
        m.style.height = app.uwpBarHeight+"px";
        document.body.appendChild(m);
        let l = document.createElement("style");
        l.innerHTML = ".centration-div {position: inherit;}";
        document.head.appendChild(l);
    }
    document.getElementById("menu-hamburger").innerHTML = "&#xE700;";

    document.querySelector("#dialogs-sidebar icon").innerHTML = "&#xE8BD;";
    document.querySelector("#friends-sidebar icon").innerHTML = "&#xE716;";
    document.querySelector("[onclick=\"settings.open()\"] icon").innerHTML = "&#xE713;";
    document.querySelector("[onclick=\"_.prototype.toggle();\"] icon").innerHTML = "&#xE775;";
    document.querySelector("[onclick=\"auth.logout(1);\"] icon").innerHTML = "&#xE7E8;";
});