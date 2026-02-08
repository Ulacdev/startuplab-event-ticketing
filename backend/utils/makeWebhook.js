const MAKE_WEBHOOK_URL = process.env.MAKE_WEBHOOK_URL
const MAKE_WEBHOOK_API_KEY = process.env.MAKE_WEBHOOK_API_KEY

export async function sendMakeNotification(body) {
  // Add metadata to the payload root if available in meta
  if (body?.meta) {
    if (body.meta.eventLocation && !body.locationText) body.locationText = body.meta.eventLocation;
    if (body.meta.streamingPlatform && !body.streamingPlatform) body.streamingPlatform = body.meta.streamingPlatform;
    if (body.meta.locationType && !body.locationType) body.locationType = body.meta.locationType;
    if (body.meta.inviteLink && !body.inviteLink) body.inviteLink = body.meta.inviteLink;
    if (body.meta.role && !body.role) body.role = body.meta.role;
  }

  if (!MAKE_WEBHOOK_URL) return { ok: false, skipped: true, reason: 'MAKE_WEBHOOK_URL missing' }
  const headers = {
    'Content-Type': 'application/json',
    ...(MAKE_WEBHOOK_API_KEY ? { 'x-api-key': MAKE_WEBHOOK_API_KEY } : {})
  }
  try {
    const res = await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      console.error('Make.com webhook failed', res.status, text)
      return { ok: false, status: res.status, text }
    }
    return { ok: true, status: res.status }
  } catch (err) {
    console.error('Make.com webhook error', err)
    return { ok: false, error: err?.message || 'unknown error' }
  }
}
