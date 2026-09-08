/**
 * Best-effort map of each editable field's CURRENT look on the live site
 * (font + color), read off the actual CSS files. This only feeds the admin
 * editor's preview (so text reads in-context instead of plain black) — it
 * never ships to the public site, which already renders from its real CSS.
 *
 * A few fields render in more than one place with different colors (e.g. the
 * shared `nav.*` links); in those cases the most representative context wins.
 * This is an approximation aid, not a pixel-perfect mirror of every page.
 */
const FIELD_STYLES = {
  'nav.home': { font: 'cinzel', color: '#69431D' },
  'nav.ourStory': { font: 'cinzel', color: '#69431D' },
  'nav.ourRums': { font: 'cinzel', color: '#69431D' },
  'nav.contact': { font: 'cinzel', color: '#69431D' },

  'footer.newsletterHeading': { font: 'cinzel', color: '#ECD8C4' },
  'footer.newsletterBtnIdle': { font: 'cinzel', color: '#ECD8C4' },
  'footer.popupTitle': { font: 'cinzel', color: '#3a2e22' },
  'footer.popupLine1': { font: 'simonetta', color: '#69431D' },
  'footer.popupLine2': { font: 'simonetta', color: '#69431D' },
  'footer.popupLine3': { font: 'simonetta', color: '#69431D' },
  'footer.close': { font: 'cinzel', color: '#f3e6d8' },
  'footer.colPrivacy': { font: 'cinzel', color: '#ECD8C4' },
  'footer.linkReturns': { font: 'simonetta', color: '#ECD8C4' },
  'footer.linkSupport': { font: 'simonetta', color: '#ECD8C4' },
  'footer.colRead': { font: 'cinzel', color: '#ECD8C4' },
  'footer.linkContact': { font: 'simonetta', color: '#ECD8C4' },
  'footer.linkBlog': { font: 'simonetta', color: '#ECD8C4' },
  'footer.colCollaborate': { font: 'cinzel', color: '#ECD8C4' },
  'footer.linkPartner': { font: 'simonetta', color: '#ECD8C4' },
  'footer.linkInfluence': { font: 'simonetta', color: '#ECD8C4' },

  'home.s2Eyebrow': { font: 'cinzel', color: '#F4EADB' },
  'home.s2TitleLine1': { font: 'cinzel', color: '#F4EADB' },
  'home.s2TitleLine2': { font: 'cinzel', color: '#F4EADB' },
  'home.s2Text': { font: 'simonetta', color: '#F4EADB' },
  'home.s2Cta': { font: 'cinzel', color: '#F4EADB' },
  'home.s2bEyebrow': { font: 'cinzel', color: '#F4EADB' },
  'home.s2bTitle': { font: 'cinzel', color: '#3A1D08' },
  'home.s2bText': { font: 'simonetta', color: '#3A1D08' },
  'home.s2bCta': { font: 'cinzel', color: '#3A1D08' },
  'home.s4Eyebrow': { font: 'cinzel', color: '#ffffff' },
  'home.s4TitleLine1': { font: 'cinzel', color: '#ffffff' },
  'home.s4TitleLine2': { font: 'cinzel', color: '#ffffff' },
  'home.s4Text': { font: 'simonetta', color: '#ffffff' },
  'home.rizEyebrow': { font: 'cinzel', color: '#3A1D08' },
  'home.rizTitleLine1': { font: 'cinzel', color: '#3A1D08' },
  'home.rizTitleLine2': { font: 'cinzel', color: '#3A1D08' },
  'home.followSubtitle': { font: 'simonetta', color: '#6e4008' },

  'ourStory.heroKicker': { font: 'cinzel', color: '#b48d46' },
  'ourStory.heroTitleLine1': { font: 'cinzel', color: '#8a96ab' },
  'ourStory.heroTitleLine2': { font: 'cinzel', color: '#8a96ab' },
  'ourStory.heroBody': { font: 'simonetta', color: '#69431D' },
  'ourStory.legendTitleLine1': { font: 'cinzel', color: '#8a96ab' },
  'ourStory.legendTitleLine2': { font: 'cinzel', color: '#8a96ab' },
  'ourStory.legendBody1': { font: 'simonetta', color: '#69431D' },
  'ourStory.legendBody2': { font: 'simonetta', color: '#69431D' },
  'ourStory.aboutTitle': { font: 'cinzel', color: '#69431D' },
  'ourStory.aboutBody': { font: 'simonetta', color: '#1f0e06' },
  'ourStory.narindraBio': { font: 'simonetta', color: '#3a2e22' },
  'ourStory.gerbenBio': { font: 'simonetta', color: '#3a2e22' },
  'ourStory.nathalieBio': { font: 'simonetta', color: '#3a2e22' },

  'ourRums.collectionEyebrow': { font: 'cinzel', color: '#F4EADB' },
  'ourRums.collectionTitleLine1': { font: 'cinzel', color: '#F4EADB' },
  'ourRums.collectionTitleLine2': { font: 'cinzel', color: '#F4EADB' },
  'ourRums.discoverMore': { font: 'cinzel', color: '#F4EADB' },
  'ourRums.perfectServesTitle': { font: 'cinzel', color: '#522A0C' },
  'ourRums.perfectServesDesc': { font: 'simonetta', color: '#522A0C' },
  'ourRums.viewRecipe': { font: 'cinzel', color: '#F5EADB' },

  'product.specType': { font: 'cinzel', color: '#5b3507' },
  'product.specVolume': { font: 'cinzel', color: '#5b3507' },
  'product.specAbv': { font: 'cinzel', color: '#5b3507' },
  'product.specCharacter': { font: 'cinzel', color: '#5b3507' },
  'product.specIngredients': { font: 'cinzel', color: '#5b3507' },
  'product.tasteProfile': { font: 'cinzel', color: '#5b3507' },
  'product.tagline': { font: 'cinzel', color: '#3A1D08' },
  'product.notFound': { font: 'simonetta', color: '#ECD8C4' },
  'product.backHome': { font: 'cinzel', color: '#ECD8C4' },

  'recipe.ingredients': { font: 'cinzel', color: '#522A0C' },
  'recipe.method': { font: 'cinzel', color: '#522A0C' },
  'recipe.enjoyResponsibly': { font: 'simonetta', color: '#522A0C' },
  'recipe.notFound': { font: 'simonetta', color: '#ECD8C4' },
  'recipe.backLink': { font: 'cinzel', color: '#ECD8C4' },

  'contact.title': { font: 'cinzel', color: '#69431D' },
  'contact.subtitleLine1': { font: 'simonetta', color: '#69431D' },
  'contact.subtitleLine2': { font: 'simonetta', color: '#69431D' },
  'contact.founderNarindraAddress': { font: 'simonetta', color: '#69431D' },
  'contact.founderGerbenAddress': { font: 'simonetta', color: '#69431D' },

  'contactForm.sending': { font: 'cinzel', color: '#ffffff' },
  'contactForm.submit': { font: 'cinzel', color: '#ffffff' },
  'contactForm.popupTitle': { font: 'cinzel', color: '#69431D' },
  'contactForm.popupLine1': { font: 'simonetta', color: '#69431D' },
  'contactForm.popupLine2': { font: 'simonetta', color: '#69431D' },
  'contactForm.close': { font: 'cinzel', color: '#ffffff' },

  'ageGate.title': { font: 'cinzel', color: '#31271d' },
  'ageGate.text': { font: 'simonetta', color: '#31271d' },
  'ageGate.dobLabel': { font: 'cinzel', color: '#8E602B' },
  'ageGate.yearLabel': { font: 'cinzel', color: '#6e5a42' },
  'ageGate.monthLabel': { font: 'cinzel', color: '#6e5a42' },
  'ageGate.rememberMe': { font: 'simonetta', color: '#6e5a42' },
  'ageGate.enter': { font: 'cinzel', color: '#31271d' },

  'eventsSection.title': { font: 'cinzel', color: '#3a2e22' },
}

// Per-item dynamic content (data.products.<slug>.*, data.cocktails.<slug>.*,
// data.events.<id>.*) shares the same look across every item, so these are
// matched by the trailing key path rather than one entry per product/slug.
const PRODUCT_FIELD_STYLES = {
  kicker: { font: 'cinzel', color: '#F4EADB' },
  shortName: { font: 'cinzel', color: '#3A1D08' },
  name: { font: 'cinzel', color: '#F4EADB' },
  tagline: { font: 'simonetta', color: '#F4EADB' },
  desc: { font: 'simonetta', color: '#F4EADB' },
  badge: { font: 'cinzel', color: '#F4EADB' },
  tags: { font: 'simonetta', color: '#3A1D08' },
  pageDesc: { font: 'simonetta', color: '#3A1D08' },
  closing: { font: 'cinzel', color: '#3A1D08' },
  'fiche.subtitle': { font: 'simonetta', color: '#5b3507' },
  'fiche.type': { font: 'simonetta', color: '#5b3507' },
  'fiche.volume': { font: 'simonetta', color: '#5b3507' },
  'fiche.abv': { font: 'simonetta', color: '#5b3507' },
  'fiche.character': { font: 'simonetta', color: '#5b3507' },
  'fiche.ingredients': { font: 'simonetta', color: '#5b3507' },
  'fiche.taste': { font: 'simonetta', color: '#5b3507' },
  'moment.title': { font: 'cinzel', color: '#3A1D08' },
  'moment.text': { font: 'simonetta', color: '#5b3507' },
  'enjoy.title': { font: 'cinzel', color: '#3A1D08' },
  'enjoy.text': { font: 'simonetta', color: '#5b3507' },
  'notes.title': { font: 'cinzel', color: '#3A1D08' },
  'notes.text': { font: 'simonetta', color: '#5b3507' },
}

const COCKTAIL_FIELD_STYLES = {
  title: { font: 'cinzel', color: '#ECD8C4' },
  subtitle: { font: 'simonetta', color: '#ECD8C4' },
  ingredients: { font: 'simonetta', color: '#522A0C' },
  steps: { font: 'simonetta', color: '#522A0C' },
}

const EVENT_FIELD_STYLES = {
  title: { font: 'cinzel', color: '#3a2e22' },
  location: { font: 'cinzel', color: '#3a2e22' },
  desc: { font: 'simonetta', color: '#3a2e22' },
  date: { font: 'cinzel', color: '#C9A050' },
}

const FALLBACK_STYLE = { font: 'simonetta', color: '#3a2e22' }

function matchDynamic(path, prefix, table) {
  if (!path.startsWith(prefix)) return null
  const rest = path.slice(prefix.length)
  const dot = rest.indexOf('.')
  if (dot === -1) return null
  const key = rest.slice(dot + 1)
  return table[key] || null
}

export function getDefaultStyle(path) {
  return (
    FIELD_STYLES[path] ||
    matchDynamic(path, 'data.products.', PRODUCT_FIELD_STYLES) ||
    matchDynamic(path, 'data.cocktails.', COCKTAIL_FIELD_STYLES) ||
    matchDynamic(path, 'data.events.', EVENT_FIELD_STYLES) ||
    FALLBACK_STYLE
  )
}
