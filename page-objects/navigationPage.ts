import { Page } from "@playwright/test";

export class NaviagtionPage {

    readonly page: Page

    constructor(page: Page) {

        this.page = page

    }

    async formLayoutsPage () {

        await this.selectGroupMenuitem('Forms')
        await this.page.getByText('Form Layout').click()
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