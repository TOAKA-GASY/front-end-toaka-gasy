export const config = {
  matcher: ['/img/:path*', '/logo/:path*', '/vd/:path*'],
}

const OWN_HOSTS = new Set(['toakagasy.com', 'www.toakagasy.com'])

export default function middleware(request) {
  const referer = request.headers.get('referer')
  if (!referer) return

  let refererHost = ''
  try {
    refererHost = new URL(referer).hostname
  } catch {
    return
  }

  const requestHost = new URL(request.url).hostname
  const isOwnSite = OWN_HOSTS.has(refererHost) || refererHost === requestHost

  if (!isOwnSite) {
    return new Response('Hotlinking not allowed', { status: 403 })
  }
}
