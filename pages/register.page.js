const { Selector, t, ClientFunction } = require('testcafe');
const path = require('path');

class RegisterPage {
    constructor() {
        this.url = 'https://demo.automationtesting.in/Register.html';
        this.firstName = Selector('input[placeholder="First Name"]');
        this.lastName = Selector('input[placeholder="Last Name"]');
        this.address = Selector('textarea[ng-model="Adress"]');
        this.email = Selector('input[ng-model="EmailAdress"]');
        this.phone = Selector('input[ng-model="Phone"]');
        this.genderMale = Selector('input[value="Male"]');
        this.genderFemale = Selector('input[value="FeMale"]');
        this.hobbyCheckbox = value => Selector('input[type="checkbox"]').withAttribute('value', value);
        this.languagesDropdown = Selector('#msdd');
        this.languageOption = text => this.languagesDropdown.find('a').withText(text);
        this.skills = Selector('#Skills');
        this.country = Selector('#countries');
        this.selectCountrySearch = Selector('.select2-container');
        this.dobYear = Selector('#yearbox');
        this.dobMonth = Selector('select[placeholder="Month"]');
        this.dobDay = Selector('#daybox');
        this.password = Selector('#firstpassword');
        this.confirmPassword = Selector('#secondpassword');
        this.photo = Selector('input[type="file"]');
        this.submitBtn = Selector('#submitbtn');
        this.refreshBtn = Selector('#Button1');
        this.footer = Selector('footer');
        this.facebookLink = Selector('a').withAttribute('href', 'https://www.facebook.com/automationtesting2016/');
        this.twitterLink = Selector('a').withAttribute('href', 'https://twitter.com/krishnasakinala');
        this.linkedinLink = Selector('a').withAttribute('href', 'https://www.linkedin.com/nhome/?trk=hb_signin');
        this.googleLink = Selector('a').withAttribute('href', 'https://plus.google.com/105286300926085335367');
        this.youtubeLink = Selector('a').withAttribute('href', 'https://www.youtube.com/channel/UCmQRa3pWM9zsB474URz8ESg');
    }

    // ClientFunction to set input/select values directly in the page DOM
    setValueFn = ClientFunction((selector, value) => {
        const el = document.querySelector(selector);
        if (!el) return false;
        el.focus();
        if ('value' in el) el.value = value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
    });

    async open() {
        await t.navigateTo(this.url);
    }

    async fillForm(data) {
        // set values directly to avoid obstructions from overlays/iframes
        const waitMs = parseInt(process.env.SLOW_WAIT_MS || '0', 10);
        const shouldWait = !!process.env.SLOW && waitMs > 0;

        await t.expect(this.firstName.exists).ok({ timeout: 5000 });
        await this.setValueFn('input[placeholder="First Name"]', data.firstName);
        if (shouldWait) await t.wait(waitMs);
        await this.setValueFn('input[placeholder="Last Name"]', data.lastName);
        if (shouldWait) await t.wait(waitMs);
        await this.setValueFn('textarea[ng-model="Adress"]', data.address);
        if (shouldWait) await t.wait(waitMs);
        await this.setValueFn('input[ng-model="EmailAdress"]', data.email);
        if (shouldWait) await t.wait(waitMs);
        await this.setValueFn('input[ng-model="Phone"]', data.phone);
        if (shouldWait) await t.wait(waitMs);

        if (data.gender === 'Male') await t.click(this.genderMale);
        else await t.click(this.genderFemale);
        if (shouldWait) await t.wait(waitMs);

        if (data.hobbies && data.hobbies.length) {
            for (const h of data.hobbies) {
                await t.click(this.hobbyCheckbox(h));
                if (shouldWait) await t.wait(waitMs);
            }
        }

        if (data.languages && data.languages.length) {
            // open the languages multi-select and pick each requested language
            await t.click(this.languagesDropdown);
            await t.wait(300);

            for (const lang of data.languages) {
                const option = Selector('#msdd').find('a').withText(lang).filterVisible();
                const global = Selector('a').withText(lang).filterVisible();
                if (await option.exists) await t.click(option);
                else if (await global.exists) await t.click(global);
                // small wait between selections
                if (shouldWait) await t.wait(waitMs);
            }

            // click outside to close dropdown
            await t.click(Selector('body'));
            if (shouldWait) await t.wait(waitMs);
        }

        if (data.skill) {
            const skillOption = this.skills.find('option').withText(data.skill);
            if (await skillOption.exists) {
                await t.click(this.skills).click(skillOption);
            } else {
                // fallback: pick first option if desired option not present
                const firstOpt = this.skills.find('option').nth(0);
                if (await firstOpt.exists) await t.click(this.skills).click(firstOpt);
            }
            if (shouldWait) await t.wait(waitMs);
        }

        if (data.country) {
            const countryOption = this.country.find('option').withText(data.country);
            if (await countryOption.exists) {
                await t.click(this.country).click(countryOption);
            } else {
                const select2 = Selector('.select2-selection');
                if (await select2.exists) {
                    await t.click(select2);
                    const searchInput = Selector('.select2-search__field');
                    if (await searchInput.exists) {
                        await t.typeText(searchInput, data.country).pressKey('enter');
                    } else {
                        const choice = Selector('.select2-results__option').withText(data.country).filterVisible();
                        if (await choice.exists) await t.click(choice);
                    }
                }
            }
            if (shouldWait) await t.wait(waitMs);
        }

        // Also handle the Select Country (select2) input if provided (some pages have both)
        if (data.selectCountry) {
            const select2Container = Selector('.select2-container');
            if (await select2Container.exists) {
                await t.click(select2Container);
                const searchInput = Selector('.select2-search__field');
                if (await searchInput.exists) {
                    await t.typeText(searchInput, data.selectCountry).pressKey('enter');
                }
                if (shouldWait) await t.wait(waitMs);
            }
        }

        if (data.year) {
            const yearOption = this.dobYear.find('option').withText(data.year);
            if (await yearOption.exists) {
                await t.click(this.dobYear).click(yearOption);
            } else {
                const firstYear = this.dobYear.find('option').nth(0);
                if (await firstYear.exists) await t.click(this.dobYear).click(firstYear);
            }
            if (shouldWait) await t.wait(waitMs);
        }

        if (data.month) {
            const monthOption = this.dobMonth.find('option').withText(data.month);
            if (await monthOption.exists) {
                await t.click(this.dobMonth).click(monthOption);
            } else {
                const firstMonth = this.dobMonth.find('option').nth(0);
                if (await firstMonth.exists) await t.click(this.dobMonth).click(firstMonth);
            }
            if (shouldWait) await t.wait(waitMs);
        }

        if (data.day) {
            const dayOption = this.dobDay.find('option').withText(data.day);
            if (await dayOption.exists) {
                await t.click(this.dobDay).click(dayOption);
            } else {
                const firstDay = this.dobDay.find('option').nth(0);
                if (await firstDay.exists) await t.click(this.dobDay).click(firstDay);
            }
            if (shouldWait) await t.wait(waitMs);
        }

        if (data.password) {
            await t
                .typeText(this.password, data.password, { replace: true })
                .typeText(this.confirmPassword, data.password, { replace: true });
            if (shouldWait) await t.wait(waitMs);
        }

        if (data.photo) {
            const photoPath = path.isAbsolute(data.photo) ? data.photo : path.join(process.cwd(), data.photo);
            await t.setFilesToUpload(this.photo, photoPath);
            if (shouldWait) await t.wait(waitMs);
        }
    }
}

module.exports = new RegisterPage();
