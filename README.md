# Nextstep Wellbeing Compass

Build a simple mobile-friendly web app called "NextStep" for a mental wellbeing platform (YourDOST). Use only fictional data. No login.

Flow:

1. Welcome screen: "Not sure what to do next? Answer 4 quick questions." Show a note: "This is not a diagnosis. For emergencies, call a helpline."

2. Four one-tap questions:

   - How are you feeling most days lately? (Calm / Stressed / Low / Overwhelmed)

   - How long has this been going on? (Few days / Few weeks / Months)

   - Is it affecting your sleep or work? (Not really / A little / A lot)

   - What would help right now? (Talk to someone / Learn something / Just relax / Not sure)

3. Optional text box: "Anything else you want to share?" (not saved).

4. Result screen with ONE main next step, a one-line "Why this was suggested", and a "Pick something else" button showing 2 other options.

   Options: Book a counselor session, Watch a 5-minute breathing video, Take a stress self-assessment, Join a 7-day gratitude program.

5. Rules (hard-coded):

   - If the text contains words like suicide, self-harm, end my life, or the user picks "Overwhelmed" + "Months" + "A lot", skip the AI and show a calm screen: "You deserve support from a person right now" with a "Talk to a counselor now" button and a helpline number placeholder.

   - Never store the text answers.

6. After the result, ask: "Was this helpful?" (Yes / No).

Use the Claude API to write the "Why this was suggested" line in simple, warm language (max 2 sentences). Style: calm colors, large buttons, lots of space.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://nextstep-wellbeing-compass.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/801da75a-5ef5-41b0-87ec-0d675b20d5eb).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
