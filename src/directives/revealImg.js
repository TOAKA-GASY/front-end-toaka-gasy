/**
 * `v-reveal-img="'group-key'"` hides an image (opacity: 0) until every
 * image sharing the same group key on the current page has finished
 * loading, then reveals them all together in one fade — instead of each
 * image popping in on its own as soon as it happens to be ready.
 *
 * Scope the group key per page/section (e.g. 'home-hero', 'our-story-hero')
 * so unrelated images never wait on each other. Only use this for the
 * images visible in the first screen — preloading everything below the
 * fold this way would turn it into a disguised full-page loader.
 */
const groups = new Map()

function getGroup(key) {
  let group = groups.get(key)
  if (!group) {
    group = { els: new Set(), pending: new Set(), revealed: false, timer: null }
    groups.set(key, group)
  }
  return group
}

function reveal(group) {
  if (group.revealed) return
  group.revealed = true
  clearTimeout(group.timer)
  group.els.forEach((el) => el.classList.add('reveal-img--ready'))
}

function settle(el, group) {
  group.pending.delete(el)
  if (group.pending.size === 0) reveal(group)
}

function track(el, key) {
  const group = getGroup(key)
  group.els.add(el)
  el.classList.add('reveal-img')

  if (el.complete) {
    // Already cached/decoded: nothing to wait for.
    settle(el, group)
    return
  }

  group.pending.add(el)
  const onSettle = () => settle(el, group)
  el.addEventListener('load', onSettle, { once: true })
  // A broken image must never block the rest of the group from revealing.
  el.addEventListener('error', onSettle, { once: true })

  // Safety net: a slow image on a bad connection should never leave the
  // whole group invisible indefinitely.
  if (!group.timer) {
    group.timer = setTimeout(() => reveal(group), 2500)
  }
}

function untrack(el, key) {
  const group = groups.get(key)
  if (!group) return
  group.els.delete(el)
  group.pending.delete(el)
  if (group.els.size === 0) {
    clearTimeout(group.timer)
    groups.delete(key)
  }
}

export const revealImgDirective = {
  mounted(el, binding) {
    track(el, binding.value || 'default')
  },
  unmounted(el, binding) {
    untrack(el, binding.value || 'default')
  },
}
