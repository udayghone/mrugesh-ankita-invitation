SAKHARPUDA INVITATION – DEPLOY ON VERCEL (free, ~5 minutes, no coding)

1. Go to https://vercel.com/signup and sign up with your Google account (or email).
2. Choose one of the two routes below.

   A) GitHub route (works for everyone)
      - Create a free account at github.com -> "New repository" -> name it ankita-mrugesh-invitation
      - "uploading an existing file" -> drag ALL files/folders from this unzipped folder -> Commit
      - On vercel.com/new click "Import" next to that repository
      - Project Name: mrugesh-ankita-engagement-invitation   (Framework Preset: Other, leave the rest) -> Deploy

   B) Vercel CLI (if you are comfortable with a terminal)
      npm i -g vercel
      cd <this folder>
      vercel --prod      (when asked for the project name type: mrugesh-ankita-engagement-invitation)

3. Your link will be  https://mrugesh-ankita-engagement-invitation.vercel.app
   If Vercel says the name is taken it will suggest another (e.g. ...-invitation-1). In that case open index.html,
   find the two lines containing  mrugesh-ankita-engagement-invitation.vercel.app  (the og:image line) and replace
   with your real link, then upload again. This only affects the preview picture shown when the link is shared on WhatsApp.

Music: assets/music.mp3 (synthesised instrumental). To use your own song, replace that file keeping the same name.
Card for sharing: assets/invitation-card.jpg (WhatsApp) / invitation-card.png (high-res).
