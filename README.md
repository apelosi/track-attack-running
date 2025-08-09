# Track Attack Running

Static site powered by [Astro](https://astro.build/).

## Contact form

This project uses [Netlify Forms](https://docs.netlify.com/forms/setup/) with reCAPTCHA v2 for contact submissions.

1. Include a form on the site with `data-netlify="true"` and a `name` of `contact`.
2. Add `<div data-netlify-recaptcha="true"></div>` inside the form to enable reCAPTCHA v2.
3. Deploy the site. Forms appear in Netlify after the first successful submission.
4. In Netlify, enable email notifications: Forms → select "contact" → Notifications → Email → recipient `tony@trackattackrunning.com`.

