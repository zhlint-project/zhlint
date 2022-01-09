const replaceBlocks = (str, blocks) => {
  const pieces = blocks.reduce((pieces, block, index) => {
    const { start, end } = block
    const lastPiece = pieces[pieces.length - 1]
    const nextStart = lastPiece ? lastPiece.end : 0
    if (nextStart < start) {
      // TODO: any
      const nonBlockPiece: any = {
        nonBlock: true,
        start: nextStart,
        end: start,
      }
      nonBlockPiece.value = str.substring(nonBlockPiece.start, nonBlockPiece.end)
      pieces.push(nonBlockPiece)
    }
    pieces.push(block)
    if (index === blocks.length - 1 && end !== str.length) {
      // TODO: any
      const nonBlockPiece: any = {
        nonBlock: true,
        start: end,
        end: str.length
      }
      nonBlockPiece.value = str.substring(nonBlockPiece.start, nonBlockPiece.end)
      pieces.push(nonBlockPiece)
    }
    return pieces
  }, [])
  return pieces.map(({ value }) => value).join('')
}

export default replaceBlocks
