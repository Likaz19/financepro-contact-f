import { useKV } from '@github/spark/hooks'

export type WebhookConfig = {
  id: string
  name: string
  url: string
  enabled: boolean
  headers?: Record<string, string>
  createdAt: string
}

export type WebhookPayload = {
  formData: {
    name: string
    email: string
    countryCode: string
    phone: string
    interests: string[]
    services: string[]
    modules: string[]
    message: string
  }
  submittedAt: string
  attachmentCount: number
}

export type WebhookResult = {
  webhookId: string
  webhookName: string
  success: boolean
  statusCode?: number
  error?: string
  timestamp: string
}

export async function sendToWebhook(
  webhook: WebhookConfig,
  payload: WebhookPayload
): Promise<WebhookResult> {
  const startTime = Date.now()
  
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...webhook.headers,
    }

    const response = await fetch(webhook.url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    })

    return {
      webhookId: webhook.id,
      webhookName: webhook.name,
      success: response.ok,
      statusCode: response.status,
      error: response.ok ? undefined : `HTTP ${response.status}: ${response.statusText}`,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    return {
      webhookId: webhook.id,
      webhookName: webhook.name,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }
  }
}

export async function sendToAllWebhooks(
  webhooks: WebhookConfig[],
  payload: WebhookPayload
): Promise<WebhookResult[]> {
  const enabledWebhooks = webhooks.filter(w => w.enabled)
  
  if (enabledWebhooks.length === 0) {
    return []
  }

  const results = await Promise.allSettled(
    enabledWebhooks.map(webhook => sendToWebhook(webhook, payload))
  )

  const webhookResults = results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value
    } else {
      return {
        webhookId: enabledWebhooks[index].id,
        webhookName: enabledWebhooks[index].name,
        success: false,
        error: result.reason?.message || 'Promise rejected',
        timestamp: new Date().toISOString(),
      }
    }
  })

  await saveWebhookLogs(webhookResults)

  return webhookResults
}

async function saveWebhookLogs(results: WebhookResult[]) {
  try {
    const existingLogs = await window.spark.kv.get<WebhookResult[]>('webhook-logs') || []
    const updatedLogs = [...existingLogs, ...results].slice(-100)
    await window.spark.kv.set('webhook-logs', updatedLogs)
  } catch (error) {
    console.error('Failed to save webhook logs:', error)
  }
}

export function useWebhooks() {
  return useKV<WebhookConfig[]>('webhooks', [])
}
