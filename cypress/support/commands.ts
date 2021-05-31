
declare namespace Cypress {
    interface Chainable {
        /**
         * Custom command to select DOM element by data-cy attribute.
         * @example cy.getBySel('greeting')
         */
        getBySel(value: string): Chainable<Element>;
        login(): Chainable<Element>;
        logout(): Chainable<Element>;
    }
}

Cypress.Commands.add('getBySel', (selector, ...args) => {
    return cy.get(`[data-cy="${selector}"]`, ...args);
});

Cypress.Commands.add('logout', () => {
    cy.visit('/api/auth/signout');
    return cy.get('form').submit();
});

Cypress.Commands.add('login', () => {
    cy.log(`Visiting ${Cypress.env('SITE_NAME')}`);
    cy.visit('/');
    const username = Cypress.env('GITHUB_USER');
    const password = Cypress.env('GITHUB_PW');
    const loginUrl = Cypress.env('SITE_NAME');
    const cookieName = Cypress.env('COOKIE_NAME');
    const socialLoginOptions = {
        username,
        password,
        loginUrl,
        headless: true,
        logs: true,
        isPopup: true,
        loginSelector: '[data-cy=sign-in]',
        postLoginSelector: '[data-cy=user-menu]'
    };

    return cy
        .task('GitHubSocialLogin', socialLoginOptions)
        .then(({ cookies }) => {
            cy.clearCookies();

            const cookie = cookies
                .filter(cookie => cookie.name === cookieName)
                .pop();
            if (cookie) {
                cy.setCookie(cookie.name, cookie.value, {
                    domain: cookie.domain,
                    expiry: cookie.expires,
                    httpOnly: cookie.httpOnly,
                    path: cookie.path,
                    secure: cookie.secure,
                });

                Cypress.Cookies.defaults({
                    preserve: cookieName,
                });
            }
        });
});