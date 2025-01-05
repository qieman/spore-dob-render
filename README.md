# Spore DOB render SDK

## Installation
```bash
npm i @nervina-labs/dob-render
```

## Usage

### Examples
[SDK Docs](./packages/sdk/README.md)

[Browser Example](../../examples/browser-env)

[NodeJs Example](../../examples/node-env)


### Render by token key
[Preview](https://app.joy.id/nft/dc19e68af1793924845e2a4dbc23598ed919dcfe44d3f9cd90964fe590efb0e4)
```ts
import { renderByTokenKey } from '@nervina-labs/dob-render'

const tokenKey = 'dc19e68af1793924845e2a4dbc23598ed919dcfe44d3f9cd90964fe590efb0e4'
await renderByTokenKey(tokenKey) // <svg .../>
```

### Render by dob decode server
```ts
import { renderByDobDecodeResponse } from '@nervina-labs/dob-render'

const tokenKey = 'dc19e68af1793924845e2a4dbc23598ed919dcfe44d3f9cd90964fe590efb0e4'
const response = await fetch('https://dob-decoder.rgbpp.io', {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    id: 2,
    jsonrpc: "2.0",
    method: "dob_decode",
    params: [tokenKey],
  }),
});
const dobDecodeResult = response.json();
await renderByDobDecodeResponse(dobDecodeResult.result) // <svg ... />
```

### Custom font
```ts
import { renderByTokenKey } from '@nervina-labs/dob-render'

const fetchFont = async (url: string) => fetch(url).then((res) => res.arrayBuffer())
const [regular, italic, bold, boldItalic] = await Promise.all([
  fetchFont('/fonts/TurretRoad-Medium.ttf'),
  fetchFont('/fonts/TurretRoad-Medium.ttf'),
  fetchFont('/fonts/TurretRoad-Bold.ttf'),
  fetchFont('/fonts/TurretRoad-Bold.ttf'),
])

const tokenKey = 'dc19e68af1793924845e2a4dbc23598ed919dcfe44d3f9cd90964fe590efb0e4'
await renderByTokenKey(tokenKey, {
  font: {
    regular,
    italic,
    bold,
    boldItalic,
  }
}) // <svg .../>
```

### Config
#### Config DOB Decode server

[DOB Decode server source code](https://github.com/sporeprotocol/dob-decoder-standalone-server)
```ts
import { 
  config, // step1: import
  renderByTokenKey,
} from '@nervina-labs/dob-render'

// step2: set
config.setDobDecodeServerURL('https://dob-decoder.rgbpp.io')

const tokenKey = 'dc19e68af1793924845e2a4dbc23598ed919dcfe44d3f9cd90964fe590efb0e4'
await renderByTokenKey(tokenKey) // this function will query the configured decode service to read the data required for rendering
```

#### Config `btcfs` query function
```ts
import { 
  config, // step1: import
  renderByTokenKey,
} from '@nervina-labs/dob-render'

// step2: set
config.setQueryBtcFsFn(async (uri) => {
  const response = await fetch(`https://api.joy.id/api/v1/wallet/dob_imgs?uri=${uri}`)
  return response.json()
})

const tokenKey = 'dc19e68af1793924845e2a4dbc23598ed919dcfe44d3f9cd90964fe590efb0e4'
await renderByTokenKey(tokenKey) // this function will use the configured btcfs function
```

##### API
```ts
export interface BtcFsResult {
  content: string
  content_type: string
}

export type BtcFsURI = `btcfs://${string}`

export type QueryBtcFsFn = (uri: BtcFsURI) => Promise<BtcFsResult>
```

### TraitsParser
```ts
import { traitsParser } from '@nervina-labs/dob-render' 

const { traits, indexVarRegister } = traitsParser([
  {
    name: 'var',
    traits: [
      {
        String: `4<_>`,
      },
    ],
  },
  {
    name: 'prev.bgcolor',
    traits: [
      {
        String: `(%var):['#FFFF00', '#0000FF', '#FF00FF', '#FF0000', '#000000']`,
      },
    ],
  },
])

const trait = traits.find(({ name }) => name === 'prev.bgcolor').value // is '#000000'
indexVarRegister['var'] // is 4
```

[More example](./src/test/traits-parser.test.ts)

#### API
```ts
interface RenderOutput {
  name: string;
  traits: {
    String?: string;
    Number?: number;
  }[];
}

interface ParsedTrait {
  name: string;
  value: number | string;
}

function traitsParser(items: RenderOutput[]): {
  traits: ParsedTrait[];
  indexVarRegister: Record<string, number>;
};
```