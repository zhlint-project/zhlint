import { Block } from './hypers/types'

type Piece = Block & {
  nonBlock?: boolean
}

const replaceBlocks = (str: string, blocks: Block[]): string => {
  const pieces = blocks.reduce((pieces: Piece[], block, index) => {
    const { start, end } = block
    const lastPiece = pieces[pieces.length - 1]
    const nextStart = lastPiece ? lastPiece.end : 0

    // non-block piece before the current block.
    if (nextStart < start) {
      const nonBlockPiece = {
        nonBlock: true,
        start: nextStart,
        end: start
      } as Piece
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
      const nonBlockPiece = {
        nonBlock: true,
        start: end,
        end: str.length
      } as Piece
      nonBlockPiece.value = str.substring(
        nonBlockPiece.start,
        nonBlockPiece.end
      )
      pieces.push(nonBlockPiece)
    }
    return pieces
  }, [])

  return pieces.map(({ value }) => value).join('')
}

export default replaceBlocks
