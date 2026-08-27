const GITHUB_API = 'https://api.github.com'
const MAX_REF_UPDATE_ATTEMPTS = 3

function repoSlug() {
  const repo = process.env.GITHUB_REPO
  if (!repo) throw new Error('GITHUB_REPO is not configured')
  return repo
}

function branch() {
  return process.env.GITHUB_BRANCH || 'main'
}

function authHeaders() {
  const token = process.env.GITHUB_TOKEN
  if (!token) throw new Error('GITHUB_TOKEN is not configured')
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
}

async function githubFetch(path, options = {}) {
  const res = await fetch(`${GITHUB_API}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers || {}) },
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`GitHub API ${options.method || 'GET'} ${path} failed: ${res.status} ${body}`)
  }
  return res.json()
}

export async function getFileText(path) {
  const data = await githubFetch(`/repos/${repoSlug()}/contents/${encodeURIComponent(path)}?ref=${branch()}`)
  return Buffer.from(data.content, 'base64').toString('utf8')
}

/**
 * Commits one or more files as a SINGLE atomic commit via the Git Data API
 * (blobs -> tree -> commit -> ref update), so an admin "Valider" that touches
 * en.js + fr.js + nl.js together never leaves the repo in a half-updated state.
 * Retries a bounded number of times if the branch moved between read and write.
 */
export async function commitFiles(files, message) {
  const slug = repoSlug()
  const branchName = branch()

  for (let attempt = 0; attempt < MAX_REF_UPDATE_ATTEMPTS; attempt++) {
    const ref = await githubFetch(`/repos/${slug}/git/ref/heads/${branchName}`)
    const baseCommitSha = ref.object.sha
    const baseCommit = await githubFetch(`/repos/${slug}/git/commits/${baseCommitSha}`)

    const blobs = await Promise.all(
      files.map(async (file) => {
        const blob = await githubFetch(`/repos/${slug}/git/blobs`, {
          method: 'POST',
          body: JSON.stringify({ content: file.content, encoding: 'utf-8' }),
        })
        return { path: file.path, mode: '100644', type: 'blob', sha: blob.sha }
      }),
    )

    const tree = await githubFetch(`/repos/${slug}/git/trees`, {
      method: 'POST',
      body: JSON.stringify({ base_tree: baseCommit.tree.sha, tree: blobs }),
    })

    const commit = await githubFetch(`/repos/${slug}/git/commits`, {
      method: 'POST',
      body: JSON.stringify({ message, tree: tree.sha, parents: [baseCommitSha] }),
    })

    const updateRes = await fetch(`${GITHUB_API}/repos/${slug}/git/refs/heads/${branchName}`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ sha: commit.sha, force: false }),
    })

    if (updateRes.ok) {
      return commit
    }

    if (updateRes.status !== 409 && updateRes.status !== 422) {
      const body = await updateRes.text().catch(() => '')
      throw new Error(`Failed to update ref: ${updateRes.status} ${body}`)
    }
    // Branch moved since we read it — loop around and retry against the new tip.
  }

  throw new Error('CONFLICT: quelqu’un d’autre vient de publier, veuillez recharger et réessayer')
}
