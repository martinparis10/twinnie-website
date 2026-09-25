// Source: docs/alpha/legal/*.md. Keep downloadable copies in public/alpha/legal in sync.
export const legalDocuments = {
  terms: {
    title: "Twinnie Alpha Terms of Use",
    subtitle:
      "Draft for review • September 25, 2026 • Applies to the current local alpha preview",
    sections: [
      {
        title: "1. Who we are and what these Terms cover",
        paragraphs: [
          'Twinnie Inc. ("Twinnie," "we," "us") provides this early virtual try-on experience. These Terms cover your use of the current alpha preview. By accepting them, you agree to these Terms and acknowledge the Privacy Policy. Participation is limited to adults aged 18 or older located in the United States.',
        ],
      },
      {
        title: "2. An early product",
        paragraphs: [
          "Features may change, fail, or be unavailable. The current preview lets you enter details, select or capture photos and a video, and explore a sample body and garment controls. It does not currently upload your captures, reconstruct your body, fit garments, verify your phone number, or place orders. The sample body is not a representation of you. Do not rely on a preview as a guarantee of garment fit, measurements, or appearance.",
        ],
      },
      {
        title: "3. Your captures and safe use",
        paragraphs: [
          "Provide only your own information and images that you have the right to use. Keep clothing on, exclude other people, and avoid including private documents or identifying details in the background. Place your device securely, make space to step back and turn, and stop if an instruction is uncomfortable or unsafe. You can choose an existing file instead of opening the camera. Twinnie does not require you to stand on furniture or place your phone in an unsafe location.",
        ],
      },
      {
        title: "4. Your content and permission to process it",
        paragraphs: [
          "You retain your rights in your photos, videos, and other content. You allow Twinnie’s software to access, temporarily process, and display the content you select or capture solely to provide the features you request in the current browser session. This permission does not authorize advertising use, public display, sale, or training general-purpose models on your content. A future upload or reconstruction service will require updated disclosures and any additional consent required by law before it processes your content.",
        ],
      },
      {
        title: "5. Acceptable use and our intellectual property",
        paragraphs: [
          "You may use the alpha for your personal evaluation. Do not use it to impersonate someone, submit another person’s images without permission, violate someone’s rights, introduce malicious software, or interfere with the service. Twinnie and its licensors retain their rights in the software, branding, and sample assets. These Terms grant no ownership in those materials. You may send voluntary product feedback; do not include personal captures or confidential third-party information in that feedback.",
        ],
      },
      {
        title: "6. Privacy and communications",
        paragraphs: [
          "The Privacy Policy explains the current handling of information. Your acceptance of these Terms is not consent to marketing texts, sale of personal information, or biometric processing for identification. No message is sent when you enter a phone number in this preview. Camera permission is requested separately by your browser.",
        ],
      },
      {
        title: "7. Availability and ending use",
        paragraphs: [
          "You can stop using the alpha at any time. Twinnie may change or end access to this free early product, including for misuse or security reasons. Closing or reloading the preview clears its in-memory form and capture state; original files you selected remain on your device. These Terms do not promise that preview state or results will be retained.",
        ],
      },
      {
        title: "8. Disclaimers and responsibility",
        paragraphs: [
          "To the extent permitted by applicable law, the alpha is provided as available, without warranties of accuracy, uninterrupted availability, merchantability, fitness for a particular purpose, or non-infringement. It does not provide medical advice. Nothing in these Terms excludes or limits a right, warranty, remedy, or liability that cannot lawfully be excluded or limited, including mandatory consumer protections. These draft Terms do not impose mandatory arbitration, a class-action waiver, or a monetary liability cap.",
        ],
      },
      {
        title: "9. Changes and questions",
        paragraphs: [
          "We will identify revised Terms by their version date and present material changes before asking you to accept them. Changes will not retroactively expand permission to use your previously supplied content. For questions, including privacy requests, email conor@trytwinnie.com. The terms and disclosures for a hosted, connected alpha will be finalized before that version is released.",
        ],
      },
    ],
  },
  privacy: {
    title: "Twinnie Alpha Privacy Policy",
    subtitle:
      "Draft for review • September 25, 2026 • Applies to the current local alpha preview",
    sections: [
      {
        title: "1. Scope",
        paragraphs: [
          'Twinnie Inc. ("Twinnie," "we," "us") provides this alpha preview. The alpha is for adults located in the United States. This Policy describes the current implementation, not a future hosted reconstruction service. The current alpha processes the form details and captures described below in your browser. It does not send them to a Twinnie backend. Separate communications you send to the team, such as email or feedback, are received through the channel you use.',
        ],
      },
      {
        title: "2. Information you provide",
        paragraphs: [
          "The flow asks for your full name, phone number, acceptance of the Terms, optional preference to receive Twinnie updates, height, weight, and gender selection. It also lets you select or capture a front photo, a side photo, and a short turning video. Your garment and size selections are held with the rest of the preview state. Providing body images can reveal sensitive details about your appearance, so include only yourself and keep private surroundings out of the frame.",
        ],
      },
      {
        title: "3. Camera access",
        paragraphs: [
          "The camera starts only after you choose Open camera and grant browser permission. A separate tap starts a 10-second countdown. Photos are captured after that countdown; the turning video records for 15 seconds after the countdown. In-app recording requests video only and does not request or record microphone audio. An existing video you select may already contain audio. The camera is stopped when you finish or cancel capture, leave the capture screen, or move the page into the background. You can revoke camera permission in your browser or device settings and use the file picker instead.",
        ],
      },
      {
        title: "4. How the preview uses information",
        paragraphs: [
          "Your entries support moving through the flow, validating fields, displaying your selected captures, and maintaining selections within the session. No personal twin is generated from your captures in this version. The preview does not analyze your face geometry, identify you using biometrics, train a model on your captures, or send promotional messages. The optional updates checkbox is held only in page memory and does not subscribe you to messages in this preview. Acceptance of these documents is not permission for those activities.",
        ],
      },
      {
        title: "5. Storage, retention, and deletion",
        paragraphs: [
          "Form entries and selected or captured media are held in page memory. This flow does not save them to local storage, a database, or a server. Replacing or removing a capture releases the old preview reference. Closing or reloading the page clears the flow state; browser history restoration may preserve a page session in some circumstances. To reset a session, reload the page. This does not delete original files from your photo library, files you chose from your device, or copies you made yourself. Your browser and operating system control their own memory and caches; we cannot promise forensic erasure from your device.",
        ],
      },
      {
        title: "6. Sharing and technical information",
        paragraphs: [
          "The current alpha does not upload, sell, share for advertising, or distribute the form details or captures. Loading the website still involves technical requests such as the page, fonts, scripts, and images. A hosted version’s provider may receive connection information such as an IP address, browser details, request time, and requested URL. This local-preview Policy does not specify an unselected hosting provider’s logging or retention practices. Those practices must be disclosed for the actual hosted release. This alpha flow does not add advertising trackers or analytics cookies.",
        ],
      },
      {
        title: "7. Your choices and requests",
        paragraphs: [
          "You can edit your entries, replace or remove captures, cancel the camera, revoke camera permission, reload the page to clear the session, or stop participating. Because this version does not send your entries or captures to Twinnie, the team cannot retrieve them from a server. For questions about information you separately sent to the team, email conor@trytwinnie.com. Rights such as access, correction, deletion, objection, or withdrawal of consent depend on your location and the relevant processing; nothing in this Policy limits rights provided by applicable law.",
        ],
      },
      {
        title: "8. Adults only",
        paragraphs: [
          "The alpha is intended for people aged 18 and over located in the United States. Do not submit images of children. If you believe a child’s information has been sent to the Twinnie team, email conor@trytwinnie.com so it can be addressed.",
        ],
      },
      {
        title: "9. Future connected alpha and changes",
        paragraphs: [
          "Before enabling upload, account storage, body reconstruction, human review, or additional uses, Twinnie must update this Policy to identify the actual processing, recipients, retention periods, applicable rights, and contact details. Where a use requires separate consent, that consent must be obtained before the use begins. This Policy is not a biometric release or consent to future processing. Material changes will be presented before the changed processing starts.",
        ],
      },
      {
        title: "10. Proposed retention for the connected alpha",
        paragraphs: [
          "The following is a draft retention direction for the future connected service; it does not change the browser-only storage described above or authorize an upload. Subject to applicable law, Twinnie intends to keep account details and a generated twin while an account is active and the information remains reasonably necessary to provide, maintain, or regenerate the participant’s requested try-on experience. Source photos and videos may be kept during that period only while they remain reasonably necessary for the disclosed reconstruction, correction, or regeneration purpose. Keeping an account open alone is not a reason to keep every capture indefinitely.",
          "Twinnie will delete or deidentify information when it is no longer needed for those purposes, an applicable retention limit is reached, or a valid deletion request requires deletion, whichever applies first. Any legally required retention will be limited to the particular records and duration that the law requires. Specific inactivity, backup-expiry, and deletion execution periods must be selected and implemented before uploads begin. Longer storage for unrelated research or model training is not authorized by these draft documents. Contact conor@trytwinnie.com with retention or deletion questions.",
        ],
      },
    ],
  },
} as const;
