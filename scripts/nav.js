document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar')
    if (!navbar) {
        return
    }

    const burger = navbar.querySelector('.burger')
    const nav = navbar.querySelector('nav')

    if (!burger || !nav) {
        return
    }

    function closeMenu() {
        nav.classList.remove('open')
        burger.setAttribute('aria-expanded', 'false')
        document.body.classList.remove('sidebar-open')
    }

    burger.addEventListener('click', function () {
        const isOpen = nav.classList.toggle('open')
        burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false')

        if (isOpen) {
            document.body.classList.add('sidebar-open')
        } else {
            document.body.classList.remove('sidebar-open')
        }
    })

    const links = nav.querySelectorAll('a')
    for (let i = 0; i < links.length; i++) {
        links[i].addEventListener('click', closeMenu)
    }

    window.addEventListener('resize', () => {
        if (window.innerWidth > 600) {
            closeMenu()
        }
    })
})