# Little World website

Static English, Japanese and Simplified Chinese homepage, privacy policy, terms and support pages. No build dependencies, JavaScript, tracking, forms or external fonts.

## Public routes after the existing GitHub Pages deployment

- Marketing: https://www.makexyz.app/littleworld/
- Support: https://www.makexyz.app/littleworld/support.html
- Privacy: https://www.makexyz.app/littleworld/privacy-policy.html
- Terms: https://www.makexyz.app/littleworld/terms-of-service.html
- Japanese: `/littleworld/ja/` + same document filenames
- Chinese: `/littleworld/zh/` + same document filenames

Other storefront languages can use the English pages. Keep URLs blank in App Store Connect until public endpoints are deployed and checked.

## Content provenance

Legal document bodies exactly mirror `WithPPPPi/code/Localization/ui-settings.json` (English, Japanese, Simplified Chinese), as displayed in `Features/AboutPages.swift`, edition 1.0 dated 2026-09-01. Web edition 2026-10-10 adds contact details, Apple service disclosures, website hosting details, and standard Apple EULA / subscription links without replacing the existing App Store EULA.

Verified against SpeechClient.swift (Apple recognition may be server based), WeatherClient.swift (WeatherKit), CloudSavePolicy.swift (private iCloud projection, Screen Time stays local), and StoreSheet.swift. No promise that all speech is on-device. Disabling sync/uninstalling does not delete cloud backups; uninstalling does not cancel a subscription.

Assets are real application screenshots and the app icon, resized for web delivery. Share image reuses the prepared English store header. Artwork credited to PPPi🍎. This website does not imply the unreleased App Store version is already downloadable.

Review app policy / entitlement changes when updating these pages. Do not independently change trial quotas or payment promises here.
