import { useKV } from '@github/spark/hooks'
import { generateEmailTemplate, generatePlainTextVersion, determineTemplateType } from './email-templates'

export type EmailNotificationConfig = {
  id: string
  recipientEmail: string
  recipientName: string
  enabled: boolean
  createdAt: string
  useHtmlTemplate?: boolean
}

export type EmailPayload = {
  formData: {
    name: string
    email: string
    countryCode: string
    phone: string
    address: string
    interests: string[]
    services: string[]
    modules: string[]
    message: string
  }
  submittedAt: string
  attachmentCount: number
}

export type EmailResult = {
  emailId: string
  recipientEmail: string
  success: boolean
  error?: string
  timestamp: string
  templateType?: string
}

function formatEmailSubject(payload: EmailPayload): string {
  const templateType = determineTemplateType(payload.formData.interests)
  const name = payload.formData.name
  
  switch (templateType) {
    case 'consulting':
      return `💼 Demande Consulting - ${name} | FinancePro`
    case 'formation':
      return `📚 Inscription Formation - ${name} | FinancePro`
    case 'combined':
      return `⭐ Client Premium - ${name} (Consulting + Formation) | FinancePro`
    default:
      return `🔔 Nouveau contact FinancePro: ${name}`
  }
}

export async function sendEmailNotification(
  config: EmailNotificationConfig,
  payload: EmailPayload
): Promise<EmailResult> {
  try {
    const subject = formatEmailSubject(payload)
    const templateType = determineTemplateType(payload.formData.interests)
    
    if (config.useHtmlTemplate) {
      const htmlContent = generateEmailTemplate(payload)
      const blob = new Blob([htmlContent], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      window.open(url, '_blank')
      
      setTimeout(() => URL.revokeObjectURL(url), 100)
    } else {
      const body = generatePlainTextVersion(payload)
      const mailtoLink = `mailto:${config.recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      
      if (isMobile) {
        window.location.href = mailtoLink
      } else {
        window.open(mailtoLink, '_blank')
      }
    }
    
    return {
      emailId: config.id,
      recipientEmail: config.recipientEmail,
      success: true,
      timestamp: new Date().toISOString(),
      templateType,
    }
  } catch (error) {
    return {
      emailId: config.id,
      recipientEmail: config.recipientEmail,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }
  }
}

export async function sendToAllEmailRecipients(
  configs: EmailNotificationConfig[],
  payload: EmailPayload
): Promise<EmailResult[]> {
  const enabledConfigs = configs.filter(c => c.enabled)
  
  if (enabledConfigs.length === 0) {
    return []
  }

  const results = await Promise.allSettled(
    enabledConfigs.map(config => sendEmailNotification(config, payload))
  )

  const emailResults = results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value
    } else {
      return {
        emailId: enabledConfigs[index].id,
        recipientEmail: enabledConfigs[index].recipientEmail,
        success: false,
        error: result.reason?.message || 'Promise rejected',
        timestamp: new Date().toISOString(),
      }
    }
  })

  await saveEmailLogs(emailResults)

  return emailResults
}

async function saveEmailLogs(results: EmailResult[]) {
  try {
    const existingLogs = await window.spark.kv.get<EmailResult[]>('email-notification-logs') || []
    const updatedLogs = [...existingLogs, ...results].slice(-100)
    await window.spark.kv.set('email-notification-logs', updatedLogs)
  } catch (error) {
    console.error('Failed to save email logs:', error)
  }
}

export function useEmailNotifications() {
  return useKV<EmailNotificationConfig[]>('email-notifications', [])
}
