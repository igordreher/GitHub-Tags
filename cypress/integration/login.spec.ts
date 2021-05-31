describe('Login page', () => {
    before(() => {
        cy.log(`Visiting ${Cypress.env('SITE_NAME')}`);
        cy.visit('/');
    });
    it('Login with GitHub', () => {
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
            loginSelector: cy.getBySel('sign-in'),
            postLoginSelector: cy.getBySel('user-menu'),
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

                    cy.visit('/api/auth/signout');
                    cy.get('form').submit();
                }
            });
    });
})