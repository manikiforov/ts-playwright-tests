import {test, expect} from '@playwright/test'

test.beforeEach (async ({page}) => {
    await page.goto('http://localhost:4200/')
    await page.getByText('Forms').click()
    await page.getByText('Form Layout').click()
})

test ('Locator Syntax Rules', async({page}) => {
    // by Tag Name
    page.locator('input')

    // by ID
    await page.locator('#inputEmail1').click()

    // by Class Value
    page.locator('.shape-rectangle')

    // by Attribute
    page.locator('[placeholder="Email"]')

    // by Class Value (full)
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

    // by Combination of Selectors
    page.locator('input[placeholder="Email"][nbinput]')

    // by XPath (NOT Recommended)
    page.locator('//*[id="inputEmail1"]')

    // by Partial Text Match
    page.locator(':text("Using")') 

    // by Exact Text Match
    page.locator(':text-is("Using the Grid")')
})

test ('User facing locators', async({page}) => {
    await page.getByRole('textbox', {name: "Email"}).first().click()
    await page.getByRole('button', {name: "Sign in"}).first().click()

    await page.getByLabel('Email').first().click()

    await page.getByPlaceholder('Jane Doe').click()

    await page.getByText('Using the Grid').click()

    //await page.getByTitle('IoT Dashboard').click()

    await page.getByTestId('SignIn').click()
})

test ('Locating child elements', async({page}) => {
    await page.locator('nb-card nb-radio :text-is("Option 1")').click()
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click()

    await page.locator('nb-card').getByRole('button', {name: "Sign in"}).first().click()

    await page.locator('nb-card').nth(3).getByRole('button').click()
})

test ('Locating parent elements', async ({page}) => {
    await page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"}).click()
    await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('textbox', {name: "Email"}).click()

    await page.locator('nb-card').filter({hasText: "Basic Form"}).getByRole('textbox', {name: "Email"}).click()
    await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', {name: "Password"}).click()

    await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: "Sign In"})
        .getByRole('textbox', {name: "Email"}).click()

    await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', {name: "Email"}).click() //XPath approach
})

test ('Reusing the locators', async ({page}) => {
    const basicForm = page.locator('nb-card').filter({hasText: "Basic Form"})
    const emailField = basicForm.getByRole('textbox', {name: "Email"})
    
    await emailField.fill('test@test.com')
    await basicForm.getByRole('textbox', {name: "Password"}).fill('Welcome123')
    await basicForm.locator('nb-checkbox').click()
    await basicForm.getByRole('button', {name: "Submit"}).click()

    await expect(emailField).toHaveValue('test@test.com')
})

test ('Extracting Values', async ({page}) => {
    // Single Text Value
    const basicForm = page.locator('nb-card').filter({hasText: "Basic Form"})
    const buttonText = await basicForm.locator('button').textContent()
    expect(buttonText).toEqual('Submit')

    // All Text Values
    const allRadioButtonsValues = await page.locator('nb-radio').allTextContents()
    expect(allRadioButtonsValues).toContain("Option 1")

    // Input Value
    const emailField = basicForm.getByRole('textbox', {name: "Email"})
    await emailField.fill('test@test.com')
    const emailValue = await emailField.inputValue()
    expect(emailValue).toEqual('test@test.com')

    // Attribute Value
    const placeholderValue = await emailField.getAttribute('placeholder')
    expect(placeholderValue).toEqual('Email')

})

test('Assertions', async({page}) => {
    
    const basicFormButton = page.locator('nb-card').filter({hasText: "Basic Form"}).locator('button')
    
    // General Assertions
    const value = 5
    expect(value).toEqual(5)

    const text = await basicFormButton.textContent()
    expect(text).toEqual("Submit")

    // Locator Assertion
    await expect(basicFormButton).toHaveText('Submit')

    // Soft Assertion
    await expect.soft(basicFormButton).toHaveText('Submit')
    await basicFormButton.click()

})

