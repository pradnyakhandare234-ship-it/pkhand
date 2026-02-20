const RegisterPage = require('../pages/register.page');
const { ClientFunction, Selector } = require('testcafe');

fixture('Footer Tabs Validation').page(RegisterPage.url)
    .clientScripts({ content: "window.angular = window.angular || { module: function(){ return { controller: function(){ return this; }, directive: function(){ return this; }, service: function(){ return this; }, factory: function(){ return this; } }; } };" });

test('Open each footer link in a new window/tab and validate', async t => {
    await RegisterPage.open();

    const anchors = RegisterPage.footer.find('a');
    const count = await anchors.count;

    const getLocation = ClientFunction(() => location.href);

    // capture original window to return to
    const originalWindow = await t.getCurrentWindow();

    for (let i = 0; i < count; i++) {
        const anchor = anchors.nth(i);
        const href = await anchor.getAttribute('href');

        // skip anchors without absolute href
        if (!href || !(href.startsWith('http://') || href.startsWith('https://'))) continue;

            // set link to open in same tab and click
            const setTargetSelfByHref = ClientFunction(href => {
                const anchors = Array.from(document.querySelectorAll('a'));
                const el = anchors.find(a => a.getAttribute('href') === href || a.href === href || a.href.indexOf(href) !== -1);
                if (el) { el.setAttribute('target', '_self'); return true; }
                return false;
            });

            await setTargetSelfByHref(href);
            const original = await getLocation();
            const navigateToHref = ClientFunction(h => { location.href = h; });
            await navigateToHref(href);
            await t.wait(800);
            const currentLocation = await getLocation();
            await t.expect(currentLocation).ok();
            await t.expect(currentLocation).notEql(original);

            // return to original page
            await t.navigateTo(RegisterPage.url);
            await t.wait(300);
    }
});
