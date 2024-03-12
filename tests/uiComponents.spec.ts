import {test, expect} from '@playwright/test'
import { subscribeToIterable } from 'rxjs/internal-compatibility'

test.beforeEach (async ({page}) => {

    await page.goto('http://localhost:4200/')

})

test.describe ('Form Layouts page', () => {
    test.beforeEach( async ({page}) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layout').click()
    })

    test ('Input Fields', async ({page}) => {
        const usingTheGridEmailInput = page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"})
        
        await usingTheGridEmailInput.fill("test@test.com")
        await usingTheGridEmailInput.clear()
        await usingTheGridEmailInput.pressSequentially("test2@test.com", {delay: 500})

        // generic assertion
        const inputValue = await usingTheGridEmailInput.inputValue()
        expect(inputValue).toEqual("test2@test.com")

        // locator assertion
        await expect(usingTheGridEmailInput).toHaveValue("test2@test.com")

    })

    test ('Radio Buttons', async ({page}) => {
        const usingTheGridForm = page.locator('nb-card', {hasText: "Using the Grid"})

        //await usingTheGridForm.getByLabel('Option 1').check({force: true})
        await usingTheGridForm.getByRole('radio', {name: "Option 1"}).check({force: true})

        // generic assertions
        const radioStatus = await usingTheGridForm.getByRole('radio', {name: 'Option 1'}).isChecked()
        expect(radioStatus).toBeTruthy()

        //locator assertion
        expect(usingTheGridForm.getByRole('radio', {name: 'Option 1'})).toBeChecked()

        await usingTheGridForm.getByRole('radio', {name: "Option 2"}).check({force: true})
        expect(await usingTheGridForm.getByRole('radio', {name: 'Option 1'}).isChecked()).toBeFalsy()
        expect(await usingTheGridForm.getByRole('radio', {name: 'Option 2'}).isChecked()).toBeTruthy()
    })
})

test('Checkboxes', async({page}) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Toastr').click()

    await page.getByRole('checkbox', {name: "Hide on click"}).uncheck({force: true})
    await page.getByRole('checkbox', {name: "Prevent arising of duplicate toast"}).check({force: true})

    const allBoxes = page.getByRole('checkbox')

    for (const box of await allBoxes.all()) {
        await box.uncheck({force: true})
        expect(await box.isChecked()).toBeFalsy()
    }

})

test ('Lists and dropdowns', async ({page}) => {
    const dropDownMenu = page.locator('ngx-header nb-select')
    await dropDownMenu.click()

    page.getByRole('list') // when the list has UL tag
    page.getByRole('listitem') // when the list has LI tag

    //const optionsList = page.getByRole('list').locator('nb-option')
    const optionsList = page.locator('nb-option-list nb-option')

    await expect(optionsList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"])
    await optionsList.filter({hasText: "Cosmic"}).click()
    const header = page.locator('nb-layout-header')
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

    const colours = {
        "Light": "rgb(255, 255, 255)",
        "Dark": "rgb(34, 43, 69)",
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)"
    }

    
    await dropDownMenu.click()
    for (const colour in colours) {
        await optionsList.filter({hasText: colour}).click()
        await expect(header).toHaveCSS('background-color', colours[colour])
        if (colour != "Corporate")
        await dropDownMenu.click()
    }
})

test ('Tooltips', async({page}) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Tooltip').click()

    const toolTipCard = page.locator('nb-card', {hasText: "Tooltip Placements"})
    await toolTipCard.getByRole('button', {name: "Top"}).hover()

    page.getByRole('tooltip') // only applicable if you have 'tooltip' role created

    const tooltip = await page.locator('nb-tooltip').textContent()

    await expect(tooltip).toEqual('This is a tooltip')
})

test ('Dialog Boxes', async({page}) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?')
        dialog.accept()
    })

    await page.getByRole('table').locator('tr', {hasText: "mdo@gmail.com"}).locator('.nb-trash').click()
    await expect(page.locator('tabe tr').first()).not.toHaveText('mdo@gmail.com')
})

test ('Web Tables', async({page}) => {

    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    // 01 Get the row by any text in this raw
    const targetRow = page.getByRole('row', {name: "twitter@outlook.com"})
    await targetRow.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('Age').clear()
    await page.locator('input-editor').getByPlaceholder('Age').fill('35')
    await page.locator('.nb-checkmark').click()

    // 02 Get the row based on the value in a specific colimn
    await page.locator('.ng2-smart-pagination-nav').getByText('2').click()
    const targetRowById = page.getByRole('row', {name: '11'}).filter({has: page.locator('td').nth(1).getByText('11')})
    await targetRowById.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('E-mail').clear()
    await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com')
    await page.locator('.nb-checkmark').click()
    await expect(targetRowById.locator('td').nth(5)).toHaveText('test@test.com')

    // 03 Test filter on the table
    const ages = ['20', '30', '40', '200']

    for (let age of ages) {

        await page.locator('input-filter').getByPlaceholder('Age').clear()
        await page.locator('input-filter').getByPlaceholder('Age').fill(age)
        await page.waitForTimeout(500)
        const ageRows = page.locator('tbody tr')

        for (let row of await ageRows.all()) {

            const cellValue = await row.locator('td').last().textContent()

            if (age == '200') {
                
                expect(await page.getByRole('table').textContent()).toContain('No data found')
            } else {
                
                expect(cellValue).toEqual(age)

            }

        }

    }

})