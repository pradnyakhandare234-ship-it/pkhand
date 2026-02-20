const RegisterPage = require('../pages/register.page');
const { ClientFunction } = require('testcafe');

fixture('Footer Validation').page(RegisterPage.url)
    .clientScripts({ content: "window.angular = window.angular || { module: function(){ return { controller: function(){ return this; }, directive: function(){ return this; }, service: function(){ return this; }, factory: function(){ return this; } }; } };" });

test('Footer links and copyright validation', async t => {
    await RegisterPage.open();

    // Link existence
    await t
        .expect(RegisterPage.facebookLink.exists).ok()
        .expect(RegisterPage.twitterLink.exists).ok()
        .expect(RegisterPage.linkedinLink.exists).ok()
        .expect(RegisterPage.googleLink.exists).ok()
        .expect(RegisterPage.youtubeLink.exists).ok();

    // Each link should contain some visible child element (icon/img/span/svg)
    const fbHasIcon = await RegisterPage.facebookLink.find('*').filterVisible().exists;
    const twHasIcon = await RegisterPage.twitterLink.find('*').filterVisible().exists;
    const liHasIcon = await RegisterPage.linkedinLink.find('*').filterVisible().exists;
    const ggHasIcon = await RegisterPage.googleLink.find('*').filterVisible().exists;
    const ytHasIcon = await RegisterPage.youtubeLink.find('*').filterVisible().exists;

    await t
        .expect(fbHasIcon).ok('Facebook link should contain a visible child')
        .expect(twHasIcon).ok('Twitter link should contain a visible child')
        .expect(liHasIcon).ok('LinkedIn link should contain a visible child')
        .expect(ggHasIcon).ok('Google link should contain a visible child')
        .expect(ytHasIcon).ok('YouTube link should contain a visible child');

    // Helper to set link target to _self and click then verify navigation
    const setTargetSelfByHref = ClientFunction(href => {
        const anchors = Array.from(document.querySelectorAll('a'));
        const el = anchors.find(a => a.getAttribute('href') === href || a.href === href || a.href.indexOf(href) !== -1);
        if (el) { el.setAttribute('target', '_self'); return true; }
        return false;
    });
    const getLocation = ClientFunction(() => location.href);

    async function clickAndVerify(linkSelector, expectedHost) {
        const href = await linkSelector.getAttribute('href');
        await t.expect(href).ok();
        await setTargetSelfByHref(href);
        const originalLocation = await getLocation();
        await t.click(linkSelector);
        const newLocation = await getLocation();
        await t.expect(newLocation).notEql(originalLocation);
        // return to original page
        await t.navigateTo(RegisterPage.url);
    }

    // Click each footer icon link and verify navigation
    await clickAndVerify(RegisterPage.facebookLink);
    await clickAndVerify(RegisterPage.twitterLink);
    await clickAndVerify(RegisterPage.linkedinLink);
    await clickAndVerify(RegisterPage.googleLink);
    await clickAndVerify(RegisterPage.youtubeLink);

    // Copyright text
    await t.expect(RegisterPage.footer.innerText).contains('All Rights Reserved');
});
