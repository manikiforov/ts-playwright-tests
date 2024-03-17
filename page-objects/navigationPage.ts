import { Page } from "@playwright/test"
import { HelperBase } from "./helperBase"

export class NaviagtionPage extends HelperBase {

    constructor(page: Page) {

        super(page)

    }

    async formLayoutsPage () {

        await this.selectGroupMenuitem('Forms')
        await this.page.getByText('Form Layout').click()
        await this.waitForNumberOfSeconds(2)
    }

    async datePickerPage() {

        await this.selectGroupMenuitem('Forms')
        await this.page.getByText('Datepicker').click()

    }

    async smartTablePage() {

        await this.selectGroupMenuitem('Tables & Data')
        await this.page.getByText('Smart Table').click()

    }

    async toastrPage() {
        
        await this.selectGroupMenuitem('Modal & Overlays')
        await this.page.getByText('Toastr').click()

    }

    async tooltippage() {

        await this.selectGroupMenuitem('Modal & Overlays')
        await this.page.getByText('Tooltip').click()

    }

    private async selectGroupMenuitem(groupItemTitle: string) {

        const groupMenuItem = this.page.getByTitle(groupItemTitle)
        const expandedState = await groupMenuItem.getAttribute('aria-expanded')

        if (expandedState == "false") {

            await groupMenuItem.click()
        }

    }
 
}