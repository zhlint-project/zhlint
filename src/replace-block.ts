import type { ParsedBlock } from './hypers/types.js'

export type Piece = ParsedBlock | NonBlock

export type NonBlock = {
  nonBlock: true
  start: number
  end: number
  value: string
}

export const isBlock = (piece: Piece): piece is ParsedBlock => {
  return !('nonBlock' in piece)
}

const replaceBlocks = (
  str: string,
  blocks: ParsedBlock[]
): {
  value: string
  pieces: Piece[]
} => {
  if (blocks.length === 0) {
    return {
      value: str,
      pieces: [{ value: str, start: 0, end: str.length, nonBlock: true }]
    }
  }

  const pieces = blocks.reduce((pieces: Piece[], block, index) => {
    const { start, end } = block
    const lastPiece = pieces[pieces.length - 1]
    const nextStart = lastPiece ? lastPiece.end : 0

    // non-block piece before the current block.
    if (nextStart < start) {
      const nonBlockPiece: NonBlock = {
        nonBlock: true,
        start: nextStart,
        end: start,
        value: ''
      }
      nonBlockPiece.value = str.substring(
        nonBlockPiece.start,
        nonBlockPiece.end
      )
      pieces.push(nonBlockPiece)
    }

    // The current block piece.
    pieces.push(block)

    // Tailing non-block piece.
    if (index === blocks.length - 1 && end !== str.length) {
      const nonBlockPiece: NonBlock = {
        nonBlock: true,
        start: end,
        end: str.length,
        value: ''
      }
      nonBlockPiece.value = str.substring(
        nonBlockPiece.start,
        nonBlockPiece.end
      )
      pieces.push(nonBlockPiece)
    }
    return pieces
  }, [])

  const value = pieces.map(({ value }) => value).join('')

  return { value, pieces }
}

export default replaceBlocks
