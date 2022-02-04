export enum MessageType {
  HYPER_SPACE = 'hyper-space',
  UNKNOWN = 'unknown'
}

// side, isContentBeside, actuallyNeedSpace
export const hyperSpace = {
  'before-true-true': '内联代码左侧和其它内容之间应该有一个空格',
  'before-true-false': '内联代码左侧和其它内容之间不应该有空格',
  'after-true-true': '内联代码右侧和其它内容之间应该有一个空格',
  'after-true-false': '内联代码右侧和其它内容之间不应该有空格',
  'before-false-false': '内联代码左侧没有其它内容，不应该有空格',
  'after-false-false': '内联代码右侧没有其它内容，不应该有空格',
  inside: 'Markdown 标记的内部不应该出现空格',
  outside: 'Markdown 标记的外部应该出现一个空格'
}
