const RegisterPage = require('../pages/register.page');
const { Selector } = require('testcafe');

fixture('Register Feature')
    .page(RegisterPage.url)
    .clientScripts({ content: "window.angular = window.angular || { module: function(){ return { controller: function(){ return this; }, directive: function(){ return this; }, service: function(){ return this; }, factory: function(){ return this; } }; } };" });

fixture('Register Feature').page('https://demo.automationtesting.in/Index.html')
.clientScripts({ content: "window.angular = window.angular || { module: function(){ return { controller: function(){ return this; }, directive: function(){ return this; }, service: function(){ return this; }, factory: function(){ return this; } }; } };" });

test('Complete register form and validate footer', async t => {
    // Start at Index then navigate to Register page
    await t.navigateTo('https://demo.automationtesting.in/Index.html');
    await t.navigateTo(RegisterPage.url);

    const data = {
        firstName: 'Pradnya',
        lastName: 'Khandare',
        address: 'FC Pune',
        email: 'pradnya.khandare' + Date.now() + '@example.com',
        phone: '1234567890',
        gender: 'Female',
        hobbies: ['Cricket', 'Movies', 'Hockey'],
        languages: ['English'],
        skill: 'Java',
        country: 'India',
        selectCountry: 'India',
        year: '1998',
        month: 'September',
        day: '2',
        password: 'Password123',
        photo: 'tests/fixtures/sample.txt'
    };

    await RegisterPage.fillForm(data);

    // fallback: if first name didn't populate (overlay/ads), set it again
    if ((await RegisterPage.firstName.value) !== data.firstName) {
        await RegisterPage.setValueFn('input[placeholder="First Name"]', data.firstName);
        await t.wait(300);
    }

    await t
        .expect(RegisterPage.firstName.value).eql(data.firstName, { timeout: 5000 })
        .expect(RegisterPage.email.value).contains('@')
        .click(RegisterPage.submitBtn);

    // Footer link validations
    await t
        .expect(RegisterPage.facebookLink.exists).ok()
        .expect(RegisterPage.twitterLink.exists).ok()
        .expect(RegisterPage.linkedinLink.exists).ok()
        .expect(RegisterPage.googleLink.exists).ok()
        .expect(RegisterPage.youtubeLink.exists).ok();

    // Validate each footer link has an image/icon inside
    const fbHasIcon = await RegisterPage.facebookLink.find('*').filterVisible().exists;
    const twHasIcon = await RegisterPage.twitterLink.find('*').filterVisible().exists;
    const liHasIcon = await RegisterPage.linkedinLink.find('*').filterVisible().exists;
    const ggHasIcon = await RegisterPage.googleLink.find('*').filterVisible().exists;
    const ytHasIcon = await RegisterPage.youtubeLink.find('*').filterVisible().exists;

    await t
        .expect(fbHasIcon).ok('Facebook link should contain an icon or image')
        .expect(twHasIcon).ok('Twitter link should contain an icon or image')
        .expect(liHasIcon).ok('LinkedIn link should contain an icon or image')
        .expect(ggHasIcon).ok('Google link should contain an icon or image')
        .expect(ytHasIcon).ok('YouTube link should contain an icon or image');

    // Copyright / footer message validation
    await t.expect(RegisterPage.footer.innerText).contains('All Rights Reserved');

    // Refresh page
    await t.click(RegisterPage.refreshBtn);

    // Open each footer link in a new tab/window sequentially
    const originalWindow = await t.getCurrentWindow();
    const footerLinks = [
        RegisterPage.facebookLink,
        RegisterPage.twitterLink,
        RegisterPage.linkedinLink,
        RegisterPage.googleLink,
        RegisterPage.youtubeLink
    ];

    for (const link of footerLinks) {
        const href = await link.getAttribute('href');
        if (!href) continue;
        await t.openWindow(href);
        await t.wait(700);
        // return to original to open the next link
        await t.switchToWindow(originalWindow);
    }
});
