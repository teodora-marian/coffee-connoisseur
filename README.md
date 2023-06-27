This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
Also available at: https://coffee-connoisseur-eosin.vercel.app/

## Description:

The home page by default displays a grid view of 6 coffee shops from a pre-selected location. Each coffee shop is rendered on an individual card, with name & photo. The names of the coffee shops are being called with "getStaticProps" via Foursquare API using the "coffee" string for query, geolocation coordinates, and a limit set to 6 results. The photos are called via Unsplash API using "coffee shop" for query.

The home page also includes: a background created at meshgradient.com, a hero image provided in the resources of the course, a banner which holds the title of the app inside an `<h1>`, a simple `<p>` element for subtitle and a `<button>` element. The button enables the user to locate coffee stores near their own location (should they accept to provide it).

From the home page, you can navigate dynamically with the use of "getStaticPaths" to pages for each individual coffee store, by clicking a card from the grid. Once open, the new dynamic route displays a new grid : on the left, a "back to home" link, the name of the selected coffee store and its photo; on the righ, a card with the exact address of the coffee store, the city where it's located, number of votes it received and a button for upvoting. 

This button allows the user to upvote their favourite coffee shops, and the votes add up to the existing number instantaneously. The button does not have a usage limit (user can upvote as many times as they desire). Voting functionality and record keeping are done with an internal API and the Airtable database.
