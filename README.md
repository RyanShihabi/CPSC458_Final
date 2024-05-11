Ryan Shihabi

Run instructions:
1. Install packages `npm i`
2. `npm run dev`

- What are the design principles of your site? (Color palette, fonts, layout, etc.)
    - Font: Cash Currency
    - Color palette: Monochrome
    - Layout: Flex column

- What is the purpose of your site? Why does it need to exist?
    - The purpose of the site is to remind people of the physical size of money. We hear all of the time about companies and debt reaching astronomical values. It means nothing to most as we have never seen that much money in our lives. It provides a new perspective on the size of money.

- Does your site look good on multiple screen sizes
    - The site is responsive for desktop and mobile
    - The font size and flex layout changes with view size

- What is the Netlify URL of your site
    - https://sizeofmoney.netlify.app/

- How does your site use state to keep track of user interaction?
    - The site keeps track of five states:
        1. Amount of money inputted from the client
        2. The object name inputted from the client
        3. The money object storing length, width, and height
        4. The returned dimensions of the object from the API
        5. The name of the object returned from the API

- Does your site fetch data from an internal source or a third party API?
    - The site fetches data from my web scraping API
- Does your site persist data using a third-party tool or database
    - No database of API exists regarding retrieving dimensions of physical objects
    - I created my own API that returns results of webscraping from a search query from dimensions.com.
