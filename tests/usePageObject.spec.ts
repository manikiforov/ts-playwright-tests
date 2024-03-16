import {test, expect} from '@playwright/test'
import { NaviagtionPage } from '../page-objects/navigationPage'


test.beforeEach (async ({page}) => {

    await page.goto('http://localhost:4200/')

})

test('Navigate to the `Forms` page', async({page}) => {

    const navigateTo = new NaviagtionPage(page)
    await navigateTo.formLayoutsPage()
    await navigateTo.datePickerPage()
    await navigateTo.smartTablePage()
    await navigateTo.toastrPage()
    await navigateTo.tooltippage()

})