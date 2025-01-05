export interface DobDecodeResponse {
  jsonrpc: string
  result: string
  id: number
}

export interface DobDecodeResult {
  dob_content: {
    dna: string
    block_number: number
    cell_id: number
    id: string
  }
  render_output: RenderOutput[] | string
}

export interface RenderOutput {
  name: string
  traits: { String?: string; Number?: number }[]
}
