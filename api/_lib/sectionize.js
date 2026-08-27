/**
 * Groups a parsed locale tree into "sections" — one per natural content
 * chunk, each meant to get its own Valider button in the editor.
 *
 * Recursive rule: keep descending into an object node as long as ALL of its
 * immediate children are themselves objects. As soon as a node has at least
 * one leaf (string/string-array) child, that node becomes a section — its
 * full subtree (however deep) is flattened into editable fields.
 *
 * This naturally yields one section per simple top-level key (nav, footer, ...),
 * one per seo.<page>, and one per data.products/cocktails/events.<id>.
 */
export function collectSections(node, sections = []) {
  if (node.type !== 'object') return sections

  const childValues = Object.values(node.children)
  if (childValues.length === 0) return sections

  const hasLeafChild = childValues.some((child) => child.type === 'leaf')
  const hasObjectChild = childValues.some((child) => child.type === 'object')

  if (hasLeafChild || !hasObjectChild) {
    sections.push(node)
    return sections
  }

  for (const child of childValues) collectSections(child, sections)
  return sections
}
