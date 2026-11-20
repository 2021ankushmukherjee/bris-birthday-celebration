# Feature inventory

| Feature | Purpose and ownership | State/data/assets | Interactions and dependencies |
| --- | --- | --- | --- |
| Countdown gate | Locks the surprise until local birthday midnight. `Countdown.tsx` | `birthday.date`, local timer | Updates each second and calls `onEnter` at zero; Framer Motion entry fade. |
| Invitation | Presents the birthday reveal. `BirthdayExperience.tsx` | local `entered`; inline balloon configuration | Opens the room; each balloon has timed pop, hide, and return states. |
| 3D birthday room | WebGL celebration scene. `BirthdayRoom.tsx` | room/candle/cake/effect props | Orbit controls, room lights, candles/smoke, balloons, confetti, sparkler effects, camera move. React Three Fiber/Drei/Three. |
| Cake atelier | Selects the cake shown in the preview and room. `BirthdayExperience.tsx`, `cake-options.ts`, `cake.types.ts` | flavour, shape, tiers, candles, petals; 6/4/3/3/3 option sets | Modal buttons update parent state; heart shape forces one candle; live 3D preview supports orbit and zoom. |
| Cake ceremony | Coordinates candle, room, sound, effects and avatar sequence. `BirthdayExperience.tsx` | ceremony, cut, avatar, popper, sparkle state/timers | Cut button starts timed steps at 650, 2600, and 3200 ms. |
| Music | Browser-generated birthday melody. `BirthdayExperience.tsx` | AudioContext and interval refs | Starts only after an interaction; reset/unmount closes and clears resources. |
| Gift content | Letter, memories, promise and wishes. `BirthdayExperience.tsx`, `birthday.ts` | active modal and gallery photo index; birthday copy/photos | Escape closes; arrow keys navigate the memories gallery. |
| Finale | Displays final photo and wishes. `BirthdayExperience.tsx`, `birthday.ts` | finale state, finale copy, public photo | Relive action resets the celebration. |

`globals.css` contains the full visual contract for the experience. Its selectors and values were not changed in this refactor.
