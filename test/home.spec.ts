describe('trace testing', () => {
    describe('Home Page', () => {
        beforeEach(async () => {
            await browser.url('/home'); // trace log is created
        });

        it('should load the home page', async () => {
            // check the title of the page
            const title = await browser.getTitle();
            expect(title).toEqual('Tracing - Scratch');
        });
    })
});