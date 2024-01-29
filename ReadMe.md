# Open React Map

Compatible Map component supports Geo services with **Freedom** or **Open API**, based on [TypeScript][1], [MobX][2] & [React][3].

[![MobX compatibility](https://img.shields.io/badge/Compatible-1?logo=mobx&label=MobX%206%2F7)][2]
[![NPM Dependency](https://img.shields.io/librariesio/github/idea2app/OpenReactMap.svg)][4]
[![CI & CD](https://github.com/idea2app/OpenReactMap/actions/workflows/main.yml/badge.svg)][5]

[![NPM](https://nodei.co/npm/open-react-map.png?downloads=true&downloadRank=true&stars=true)][6]

## Versions

| SemVer  |    status    | ES decorator |    MobX     |
| :-----: | :----------: | :----------: | :---------: |
| `>=0.8` | ✅developing |   stage-3    |  `>=6.11`   |
| `<0.8`  | ❌deprecated |   stage-2    | `>=4 <6.11` |

## Usage

Preview site: https://idea2app.github.io/OpenReactMap/preview/

### Installation

#### Command

```shell
npm i open-react-map mobx mobx-react react react-dom
```

#### `tsconfig.json`

Compatible with MobX 6/7:

```json
{
    "compilerOptions": {
        "target": "ES6",
        "moduleResolution": "Node",
        "useDefineForClassFields": true,
        "experimentalDecorators": false,
        "jsx": "react-jsx"
    }
}
```

#### `index.html`

```html
<html>
    <head>
        <link
            rel="stylesheet"
            href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />
    </head>
</html>
```

### Third-party Tile provider

[China map in China Open-source Map project][7]

```tsx
import { FC } from 'react';
import { OpenReactMap, OpenReactMapProps, TileLayer } from 'open-react-map';

const ChinaMap: FC<OpenReactMapProps> = props => (
    <OpenReactMap
        className="vh-100"
        center={[34.32, 108.55]}
        zoom={4}
        renderTileLayer={() => <TileLayer vendor="GaoDe" />}
        {...props}
    />
);
export default ChinaMap;
```

### Use in Next.js

```tsx
import dynamic from 'next/dynamic';

const ChinaMap = dynamic(() => import('./ChinaMap'), { ssr: false });

export default function ExampleMap() {
    return (
        <ChinaMap
            markers={[
                {
                    position: [34.32, 108.55],
                    tooltip: 'Geo Center of China'
                }
            ]}
            onMarkerClick={console.log}
        />
    );
}
```

[1]: https://www.typescriptlang.org/
[2]: https://mobx.js.org/
[3]: https://react.dev/
[4]: https://libraries.io/npm/open-react-map
[5]: https://github.com/idea2app/OpenReactMap/actions/workflows/main.yml
[6]: https://nodei.co/npm/open-react-map/
[7]: https://github.com/kaiyuanshe/kaiyuanshe.github.io/blob/ba8e396aa190896aaa8a3dee0f9eac654dfce5b3/components/ChinaMap.tsx
