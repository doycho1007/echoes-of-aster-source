# 별의 잔향 · Echoes of Aster

A playable Korean-language JRPG prototype. Explore three pixel-art regions, recruit Luna, recover a star fragment, and defeat the Moonfall Guardian.

## Run locally

Requires Node.js 22.13 or newer.

1. Run npm install.
2. Run npm run dev:node.
3. Open http://127.0.0.1:5174/preview/.

This portable Node preview uses the same React application and combat engine as the hosted Worker. The normal npm run dev uses the Cloudflare Workers runtime; the Node option is available for Windows hosts where workerd fails to start.

## Controls

- WASD / arrow keys: move.
- Click terrain: walk there. Click a person or object: approach and interact.
- E / Space: interact or continue dialogue.
- The quest's 목표로 이동 button walks to and interacts with the next objective.
- Attack: 20 damage. Magic: 38 damage for 8 MP. Guard: quarter damage and 10 MP recovery. Potion: 55 HP.
- Luna supports every turn for 7 damage. The guardian uses a heavy attack every third turn.

## Implementation

- React + TypeScript + Canvas 2D; procedural pixel art without external image dependencies.
- Vinext on Cloudflare Workers. POST /api/battle validates turn input and calculates combat outcomes.
- Save data is browser-local localStorage, versioned and validated on load. No account sync or cloud saves. Combat requests carry client state; this prototype does not provide anti-cheat or multiplayer authority.
- Three regions, NPC dialogue, companion, loot, recovery crystals, two optional encounters, one boss, and a chapter ending.
- Basic synthesized music is opt-in. Reduced-motion preference disables map animation.

## Checks

- npm run test:game
- npx tsc --noEmit --incremental false
- npm run build

The source contains Sites hosting configuration for the existing private deployment. Preserve its project ID when updating the same site; omit the identity when deliberately creating a separate site.
