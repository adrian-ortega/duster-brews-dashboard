/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const NAVIGATION_BUTTON = { text: '', icon: null, iconOnly: false, onClick: NOOP, children: [] };
const NAVIGATION_BUTTONS = [
    {
        text: 'Refresh',
        iconOnly: true,
        icon: ICON_RELOAD,
        onClick(e) {
            e.preventDefault();
            fireCustomEvent('ShowWidgets', null, e.target);
        }
    }, {
        text: 'Settings',
        iconOnly: true,
        icon: ICON_DOTS_HORZ,
        children: [
            {
                title: "Beer"
            }, {
                text: "Add Beer",
                onClick(e) {
                    e.preventDefault();
                }
            }, {
                text: "Edit Beers",
                onClick(e) {
                    e.preventDefault();
                }
            }, {
                title: "Breweries"
            }, {
                text: "Add Brewery",
                onClick(e) {
                    e.preventDefault();
                }
            }, {
                text: "Edit Breweries",
                onClick(e) {
                    e.preventDefault();
                }
            }, {
                title: ""
            }, {
                text: "Settings",
                onClick(e) {
                    e.preventDefault();
                    fireCustomEvent('ShowSettings', null, e.target);
                }
            }
        ]
    }
].map(b => ({ ...NAVIGATION_BUTTON, id: makeId(), ...b }));

const createNavLogo = () => {
    return createElementFromTemplate(`<div class="nav-item logo">${imgTemplate('/images/logo-duster_brews-dashboard.svg', 'Logo')}</div>`)
}

const createNavButton = (options) => {
    if (typeof options.title !== "undefined") {
        console.log(options);
        return options.title !== ""
            ? createElementFromTemplate(`<h3>${options.title}</h3>`)
            : createElementFromTemplate('<hr/>')
    }

    const $button = createElementFromTemplate(`<button class="button nav-button" title="${options.text}"></button>`);

    if (options.icon) {
        const $buttonIcon = document.createElement('span');
        $buttonIcon.classList.add('icon');
        $button.appendChild($buttonIcon);
        $buttonIcon.innerHTML = options.icon;
    }

    if (!options.iconOnly) {
        $button.appendChild(createElementFromTemplate(`<span class="text">${options.text}</span>`));
    }

    if (options.onClick) {
        $button.addEventListener('click', (...args) => options.onClick.apply($button, args));
    }

    return $button;
}

const createNavButtons = () => {
    const $nav = createElementFromTemplate('<div class="nav-item nav-buttons"></div>');

    NAVIGATION_BUTTONS.forEach(b => {
        const $button = createNavButton(b);

        if (isArray(b.children) && b.children.length > 0) {
            const close = () => {
                const $children = $nav.querySelector(`[data-parent="${b.id}"]`);
                console.log($children);
                $nav.removeChild($children);
                document.removeEventListener('click', outsideClickHandler, false);
                document.removeEventListener('keydown', escKeyHandler);
            }
            const outsideClickHandler = (e) => {
                if (e.target !== $button || !$button.contains(e.target) && !$nav.contains(e.target)) {
                    console.log(e.target);
                    close();
                }
            };
            const escKeyHandler = (e) => e.keyCode === 27 && close();
            $button.addEventListener('click', (e) => {
                e.preventDefault();
                const $children = createElementFromTemplate(`<div class="nav-sub" data-parent="${b.id}"></div>`);
                b.children.forEach(child => {
                    $children.appendChild(createNavButton(child));
                });

                $nav.appendChild($children);
                setTimeout(() => {
                    document.addEventListener('click', outsideClickHandler, false);
                    document.addEventListener('keydown', escKeyHandler, false);
                }, 1);
            })
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
    if (!$container) {
        // Something went wrong
        return;
    }

    let $navContainer = $container.querySelector('.nav');
    if (!$navContainer) {
        $navContainer = createElementFromTemplate('<nav class="nav"></nav>');
        $container.appendChild($navContainer);
    }

    createNavElements($navContainer);
}
