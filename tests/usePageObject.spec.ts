import {test, expect} from '@playwright/test'
import { NaviagtionPage } from '../page-objects/navigationPage'
import { FormLayoutsPage } from '../page-objects/formLayoutsPage'
import { DatePickerPage } from '../page-objects/datePickerPage'


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

test('Parametrized methods', async({page}) => {

    const navigateTo = new NaviagtionPage(page)
    const onFormLayoutsPage = new FormLayoutsPage(page)
    const onDatePickerPage = new DatePickerPage(page)

    await navigateTo.formLayoutsPage()
    await onFormLayoutsPage.submitUsingTheGridFormWithCredentialsAndSelectOption('test@test.com', 'welcome1', 'Option 2')
    await onFormLayoutsPage.submitInlineFormWithNameEmailAndCheckbox('John Smith', 'john@test.com', false)

    await navigateTo.datePickerPage()
    await onDatePickerPage.selectCommonDatePickerDateFromToday(10)
    await onDatePickerPage.selectDatePickerWithRangeFromToday(6, 15)

})