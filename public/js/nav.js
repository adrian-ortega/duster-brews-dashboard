/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const NAVIGATION_BUTTON = { text: '', icon: null, iconOnly: false, onClick: NOOP };
const NAVIGATION_BUTTONS = [{
    text: 'Settings',
    onClick (e) {
        e.preventDefault();
        fireCustomEvent('ShowSettings', null, e.target);
    }
}, {
    text: 'Refresh',
    iconOnly: true,
    icon: ICON_RELOAD,
    onClick (e) {
        e.preventDefault();
        fireCustomEvent('ShowWidgets', null, e.target);
    }
}].map(b => ({ ...NAVIGATION_BUTTON, ...b }));

const createNavLogo = () => {
    return createElementFromTemplate(`<div class="nav-item logo">${imgTemplate('/images/logo-duster_brews-dashboard.svg', 'Logo')}</div>`)
}

const createNavButtons = () => {    
    const $nav = createElementFromTemplate('<div class="nav-item nav-buttons"></div>');
    NAVIGATION_BUTTONS.forEach(b => {
        const $button = document.createElement('button');
        const $buttonText = document.createElement('span');
        $buttonText.classList.add('text');
        const $buttonIcon = document.createElement('span');
        $buttonIcon.classList.add('icon');
        
        $button.appendChild($buttonText);
        $button.classList.add('button');
        $button.classList.add('nav-button');
        $button.setAttribute('title', b.text);

        if(b.icon) {
            $button.appendChild($buttonIcon);
            $buttonIcon.innerHTML = b.icon;
        }

        if (!b.iconOnly) {
            $buttonText.innerText = b.text;
        }

        if (b.onClick) {
            $button.addEventListener('click', (...args) => b.onClick.apply($button, args));
        }
        $nav.appendChild($button);
    });

    return $nav;
}

const createNavElements = ($nav) => {
    let $left = createElementFromTemplate('<div class="nav-left"></div>');
    let $right = createElementFromTemplate('<div class="nav-right"></div>');

    $left.appendChild(createNavLogo());
    $right.appendChild(createNavButtons());

    $nav.appendChild($left);
    $nav.appendChild($right);
}

const initializeNav = () => {
    const $container = getDomContainer();
    if(!$container) {
        // Something went wrong
        return;
    }

    let $navContainer = $container.querySelector('.nav');
    if(!$navContainer) {
        $navContainer = createElementFromTemplate('<nav class="nav"></nav>');
        $container.appendChild($navContainer);
    }

    createNavElements($navContainer);
}
