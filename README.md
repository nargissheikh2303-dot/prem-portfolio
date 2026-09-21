# Portfolio landing page

Nine sections, top to bottom.

## Run it

Double-click `start-windows.bat` or `start-mac.command`, which refreshes the image list and opens http://localhost:5500.
Opening `index.html` directly works too.

## What's on the page

    1  hero          192 frames redrawn on a canvas as you scroll, with the typed welcome
    2  services strip  scrolling marquee of services
    3  about me      intro, plus animated stats
    4  services      four service cards
    5  thumbnails    a folder that opens into a draggable deck — YouTube Thumbnails
    6  graphics      a folder that opens into a justified grid — Graphic Design
    7  logos         a folder that opens into a fan — Logo Design
    8  process       five-step stepper
    9  contact       contact icons + form (emails bamneleprem@gmail.com via FormSubmit; change TO_EMAIL in the last script)

## Fonts

    Playfair Display   headings / titles   (regular, italic, up to 900)
    Inter              body text / paragraphs / UI

Both are self-hosted in `/fonts`, so nothing is fetched from Google. The CSS tokens
`--display` and `--body` at the top of the `<style>` block are the only two places a font
is named. Italic Playfair in the brand green is the accent for single words
(`.script` class) — the same treatment as "Creativity" on the brand board.

Playfair's default numerals are old-style; `body{font-variant-numeric:lining-nums}`
switches them to lining figures.

## Order of sections

The order is the order of the `<section>` blocks inside `<main>`, each marked with a
comment (`<!-- 5 · YOUTUBE THUMBNAILS -->` and so on). To move one, cut its block
and paste it somewhere else — the styles and scripts don't depend on position.

The three work folders are all the same object: dark back panel with a raised tab, frosted
front, the work tucked behind it so it blurs through the glass. What differs is what each one
opens into, and that follows the work. A thumbnail is judged in sequence, so it gets a
deck you scrub through. A poster is a composition, so the grid keeps every piece's own
proportions. A logo is a mark judged on its own, so it gets a fan of equal cards.

Styles sit in the single `<style>` block, the markup is one `<section>` per part inside
`<main>`, and the scripts are separate `<script>` tags at the end. Class names are kept
apart: the hero owns `.stage`, the deck uses `.deck`, graphics classes start with `gal-`,
logo ones with `logo-`.

## Where the pictures come from

Hero frames are in `/frames` (they load in the background after the name loader), at 1280x720, drawn at native size so they stay sharp.

Work images live in three folders:

    images/youtube-thumbnail/   YouTube Thumbnails section
    images/graphic-design/      Graphic Design section
    images/logo/                Logo Design section

Upload a file to a folder and it appears in that section, newest first. `build-images.js`
reads the folders and writes `images.js`; Cloudflare Pages runs it on every deploy
(build command `node build-images.js`, output directory `/`). The start scripts run it too
when testing locally. While the thumbnail or logo folder is empty, the section shows the
old images from the WordPress site so it never looks empty.

Thumbnails and logos are pulled from the live site:

    var BASE = "https://portfolio.mydigitalsavvy.com/wp-content/uploads/2026/08/";

For production it's worth serving those from here too — drop the files in `/work` and
change the entries to `{ src: "work/name.png", alt: "" }`. That survives the media
library being reorganised, and they load from the same server as the page.

## Settings worth knowing

Hero, first script:

    WELCOME_LINES = ["Welcome to", "my portfolio"]
    WELCOME_HOLD  = 0.12    stays solid until here
    WELCOME_OUT   = 0.30    fully gone by here
    TYPE_MS       = 370     ten seconds across both lines
    MAX_SCALE     = 1       1 keeps the frames pixel-sharp

Scroll length is at the end of that script: 640vh desktop, 380 mobile.

## The hero on a phone

A 16:9 frame on a portrait screen can only ever be as tall as 56vw — about 220px on a
typical phone. Fitting it whole inside a full-height stage left a thin strip floating in
a screen of black, which is what it was doing.

Two things now happen below 860px in portrait. The stage is cut down to the picture plus
room for the welcome line — roughly 434px instead of 844 — and the frame is allowed to
grow past a whole-frame fit and lose a little off each side:

    var FILL = 1.34;

At 1 the frame sits untouched as a letterbox strip. At 1.34 it's about a third taller
and loses roughly 13% off each edge, which the composition survives — the type is inside
that margin and so is the portrait. Push it much higher and you start cutting into both.

The mobile run was shortened to 380vh to match, since a smaller picture doesn't need as
much scrolling to play through.

Thumbnails, second script:

    SPREAD = 0.78       gap between neighbours, as a share of card width
    SHUT_SCALE = 0.6    how small the tucked-away cards sit
    backRise()          58 desktop, 44 phone — must match the CSS

Graphics, third script:

    FIRST_BATCH = 12    how many show before "Show all"
    rowTarget()         row height: 250 desktop, 210 tablet, 170 phone
    GRID_GAP = 30       air between the grid and the folder below it

Logos, fourth script:

    perFan()            8 / 6 / 4 / 3 in the fan, by width
    SPREAD = 0.72       how far apart they sit — lower means more overlap
    setBounds()         shares the marks evenly between the sets

## Contact form

The form posts to FormSubmit (formsubmit.co), which forwards each message to
bamneleprem@gmail.com. The first message ever sent triggers an "Activate form"
email to that inbox; click the button in it once and the form is live. After that
every message arrives with the visitor's email as reply-to, so hitting Reply
answers them directly. To use a different inbox, change TO_EMAIL in the last
<script> of index.html.
