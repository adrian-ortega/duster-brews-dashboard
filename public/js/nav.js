const $ = createElementFromTemplate
const createNavLogo = () => {
    return $(`<div class="nav-item logo">${imgTemplate('/images/logo-duster_brews-dashboard.svg', 'Logo')}</div>`)
}

const createNavElements = ($nav) => {
    let $left = $('<div class="nav-left"></div>')
    let $right = $('<div class="nav-right"></div>')

    $left.appendChild(createNavLogo())

    $nav.appendChild($left)
    $nav.appendChild($right)
}

const initializeNav = () => {
    const $container = getDomContainer();
    if(!$container) {
        // Something went wrong
        return;
    }

    let $navContainer = $container.querySelector('.nav');
    if(!$navContainer) {
        $navContainer = $('<nav class="nav"></nav>');
        $container.appendChild($navContainer);
    }

    createNavElements($navContainer);
}
