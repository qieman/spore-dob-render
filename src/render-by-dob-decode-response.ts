import type { DobDecodeResult, RenderOutput } from './types'
import type { ParsedTrait } from './traits-parser'
import { traitsParser } from './traits-parser'
import { renderTextParamsParser } from './render-text-params-parser'
import type { RenderProps } from './render-text-svg'
import { renderTextSvg } from './render-text-svg'
import { renderImageSvg } from './render-image-svg'

function getPrevType(traits: ParsedTrait[]): 'image' | 'text' {
  const prevTypeOutput = traits.find((trait) => trait.name === 'prev.type')
  return (prevTypeOutput?.value as 'image' | 'text') || 'text'
}

export function renderByDobDecodeResponse(
  dob0Data: DobDecodeResult | string,
  props?: Pick<RenderProps, 'font'> & {
    outputType?: 'svg'
  },
) {
  if (typeof dob0Data === 'string') {
    dob0Data = JSON.parse(dob0Data) as DobDecodeResult
  }
  if (typeof dob0Data.render_output === 'string') {
    dob0Data.render_output = JSON.parse(
      dob0Data.render_output,
    ) as RenderOutput[]
  }

  const { traits, indexVarRegister } = traitsParser(dob0Data.render_output)
  if (getPrevType(traits) === 'image') {
    return renderImageSvg(traits)
  }
  const renderOptions = renderTextParamsParser(traits, indexVarRegister)
  return renderTextSvg({ ...renderOptions, font: props?.font })
}
