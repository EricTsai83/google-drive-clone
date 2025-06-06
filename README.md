# Google Drive Clone

## TODO

#### Theo taught me. [Reference](https://www.youtube.com/watch?v=c-hKSbzooAg)

- [x] Set up the database and data model
- [x] Move the folder open state to the URL
- [x] Add authentication
- [x] Add file uploading
- [x] Add analytics
- [x] Make sure sort order is consistent
- [x] Implement file deletions
- [x] Create a real homepage and onboarding process

---

#### I learned on my own.

- [x] Nested folder deletions
- [x] Add last modified time
- [x] Folder creations
- [x] Rename folders and files
- [x] Access control: Verify that the user is the owner before displaying the folder page
- [x] Create a "File View" page (focused on displaying images)
- [x] Add a delete button and a description card on the "File View" page.
- [x] Gray out a row while it's being deleted
- [x] Disable file clicks for opening the file view page, except for images.
- [x] Ensure that when a user changes the file extension, our application displays a "can't view" message.
- [x] Ensure that even if the image upload has not completed, we can leave the page, return later, and display a toast notification.
- [x] Implement the dropzone
- [x] Convert file sizes into a readable format
- [x] Redesign the theme
- [x] Prettify the upload toast
- [x] Enhance the responsiveness of the call-to-action button by using useFormStatus with a server action
- [x] Improve the UX by optimizing data fetching strategies
- [x] Create a theme mode toggle component
- [x] Enhance the table with React Suspense by displaying a skeleton loader while fetching data
- [x] Prettify website style
- [x] Add infinite scroll using Cursor-based pagination and trpc
- [x] Implement upload rate limiting
- [x] Set up a webhook with ngrok for Clerk
- [x] Implement per-user upload limit
- [x] Implement attribute-based access control (ABAC) to allow admin users to bypass the upload limit
- [ ] Refactor the async code using the tryCatch utility function
- [ ] Improve the error handling stuff
- [ ] Block some extensions like .exe, .sh, etc.
- [ ] Fix carousel in mobile view
- [ ] close the dropdown menu when a menu item is clicked
- [ ] Implement the search functionality
- [ ] Add favicon
- [ ] Generate open graph (OG) Image [Reference](https://vercel.com/docs/og-image-generation)
- [ ] Image prefetching
- [ ] Image preview [Reference](https://ui.aceternity.com/components/link-preview)
- [ ] Build custom sign-in-or-up page
- [ ] Improve the UX of the file view page
- [ ] Improve error messages [Reference](https://wix-ux.com/when-life-gives-you-lemons-write-better-error-messages-46c5223e1a2f)
- [ ] Implement mobile layout
- [ ] Manage SVG sprites in React [Reference](https://kurtextrem.de/posts/svg-in-js)
- [ ] Fix the animation for the theme mode SVG button on the homepage
- [ ] Simplify code
- [ ] Add hcaptcha [Reference](https://www.hcaptcha.com)
- [ ] Use [Effect](https://effect.website/docs/getting-started/why-effect/) to create a service that automatically deletes all files from the database and the UploadThing server one day after a normal user uploads them
- [ ] Use [imagekit](https://imagekit.io/) to remove backgrounds, enhance low-resolution images, and generate AI-based tags
- [ ] Use Vercel's [List deployments API service](https://vercel.com/docs/rest-api/reference/endpoints/deployments/list-deployments)  to display a notification toast that prompts the current user to refresh the page after a new deployment is made