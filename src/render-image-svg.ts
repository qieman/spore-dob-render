import satori from 'satori'
import type { ParsedTrait } from './traits-parser'
import { config } from './config'
import { hexToBase64, isBtcFs } from './utils/string'
import { backgroundColorParser } from './background-color-parser'

export async function renderImageSvg(traits: ParsedTrait[]): Promise<string> {
  const prevBg = traits.find((trait) => trait.name === 'prev.bg')
  const bgColor = backgroundColorParser(traits, { defaultColor: '#000' })

  let bgImage = ''
  if (prevBg?.value && typeof prevBg.value === 'string') {
    if (isBtcFs(prevBg.value)) {
      const btcFsResult = await config.queryBtcFsFn(prevBg.value)
      bgImage = `data:${btcFsResult.content_type};base64,${hexToBase64(btcFsResult.content)}`
    } else if (prevBg.value.startsWith('https://')) {
      bgImage = prevBg.value
    }
  }

  return satori(
    {
      key: 'container',
      type: 'div',
      props: {
        style: {
          display: 'flex',
          width: '500px',
          background: bgColor ?? '#000',
          color: '#fff',
          height: '500px',
        },
        children: [
          bgImage
            ? {
                key: 'bg_image',
                type: 'img',
                props: {
                  src: bgImage,
                  width: '500px',
                  height: '500px',
                  style: {
                    width: '100%',
                    height: '100%',
                  },
                },
              }
            : null,
        ],
      },
    },
    { width: 500, height: 500, fonts: [] },
  )
}
