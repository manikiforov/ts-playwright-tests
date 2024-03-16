import { Page } from "@playwright/test";

export class NaviagtionPage {

    readonly page: Page

    constructor(page: Page) {

        this.page = page

    }

    async formLayoutsPage () {

        await this.page.getByText('Forms').click()
        await this.page.getByText('Form Layout').click()
    }

}