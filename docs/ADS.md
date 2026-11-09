# Ad measurement

Everything needed to run Meta and Google ads is built and waiting. The owner
hands over IDs; there is no tagging project.

Nothing is on. `metaPixelId`, `adsApply`, and `adsContact` in `app.js` are
empty, so no ad script loads, no request is made to an ad network, and
visitors never see the ads toggle.

## What is already wired

The site's own event seam (`trackEvent()` in `app.js`) translates to both
platforms:

| What someone did              | Meta event    | Google Ads slot |
| ----------------------------- | ------------- | --------------- |
| Submitted the apply form      | `Lead`        | `adsApply`      |
| Submitted a preapproval form  | `Lead`        | `adsApply`      |
| Submitted a contact form      | `Lead`        | `adsContact`    |
| Tapped the phone number       | `Contact`     | —               |
| Tapped the email address      | `Contact`     | —               |
| Started toward apply          | custom event  | —               |
| Viewed any page (opted in)    | `PageView`    | —               |

### The conversion is a submitted form

Preapproval and contact forms are the money events, so **`Lead` is the
event the ad account optimises on**. It carries only the two routing labels
(`lead_channel`, `form_id`). No name, email, phone, address, or financial
detail leaves the page: params pass an allowlist, and UTM values captured
for attribution stay in first-party session storage.

Ads measurement is a separate opt-in from analytics, default off. It runs
only on logan.loans public routes, and stays off under Global Privacy
Control, automated browsers, and QA sessions.

## Turning it on

Meta:

1. Events Manager → Data sources → copy the Pixel ID.
2. Set `metaPixelId` in `app.js` and redeploy.
3. In Events Manager → Test events, allow ads measurement on the live site,
   submit the preapproval form, and confirm a `Lead` event arrives.

Google Ads:

1. In the Ads account, create one conversion action for apply submits and
   one for contact submits; copy each conversion ID (`AW-…`).
2. Set `adsApply` and `adsContact` in `app.js` and redeploy. The GTM
   container (`GTM-MTWF64T2`) must carry a matching Google Ads Conversion
   tag for each ID.
3. Submit each form once and confirm both conversions arrive.

To turn everything off again, empty the IDs and redeploy.
