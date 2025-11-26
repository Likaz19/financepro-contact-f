import { useKV } from '@github/spark/hooks'

export type EmailNotificationConfig = {
  id: string
  recipientEmail: string
  recipientName: string
  enabled: boolean
  createdAt: string
}

export type EmailPayload = {
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

export type EmailResult = {
  emailId: string
  recipientEmail: string
  success: boolean
  error?: string
  timestamp: string
}

function formatEmailBody(payload: EmailPayload): string {
  const { formData, submittedAt, attachmentCount } = payload
  
  let body = `📋 NOUVEAU FORMULAIRE DE CONTACT - FINANCEPRO\n\n`
  body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`
  
  body += `👤 INFORMATIONS DE CONTACT\n`
  body += `   Nom: ${formData.name}\n`
  body += `   Email: ${formData.email}\n`
  if (formData.phone) {
    body += `   Téléphone: ${formData.countryCode} ${formData.phone}\n`
  }
  body += `\n`
  
  body += `💼 INTÉRÊTS\n`
  body += `   ${formData.interests.join(', ')}\n`
  body += `\n`
  
  if (formData.services.length > 0) {
    body += `🔧 SERVICES CONSULTING SÉLECTIONNÉS\n`
    formData.services.forEach(service => {
      body += `   • ${service}\n`
    })
    body += `\n`
  }
  
  if (formData.modules.length > 0) {
    body += `📚 MODULES FORMATION SÉLECTIONNÉS\n`
    formData.modules.forEach(module => {
      body += `   • ${module}\n`
    })
    body += `\n`
  }
  
  if (formData.message) {
    body += `💬 MESSAGE\n`
    body += `   ${formData.message}\n`
    body += `\n`
  }
  
  if (attachmentCount > 0) {
    body += `📎 FICHIERS JOINTS: ${attachmentCount}\n`
    body += `\n`
  }
  
  body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
  body += `🕐 Soumis le: ${new Date(submittedAt).toLocaleString('fr-FR', {
    dateStyle: 'full',
    timeStyle: 'short'
  })}\n`
  
  return body
}

function formatEmailSubject(payload: EmailPayload): string {
  const interests = payload.formData.interests.join(' & ')
  return `🔔 Nouveau contact FinancePro: ${payload.formData.name} - ${interests}`
}

export async function sendEmailNotification(
  config: EmailNotificationConfig,
  payload: EmailPayload
): Promise<EmailResult> {
  try {
    const subject = formatEmailSubject(payload)
    const body = formatEmailBody(payload)
    
    const mailtoLink = `mailto:${config.recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    
    if (isMobile) {
      window.location.href = mailtoLink
    } else {
      window.open(mailtoLink, '_blank')
    }
    
    return {
      emailId: config.id,
      recipientEmail: config.recipientEmail,
      success: true,
      timestamp: new Date().toISOString(),
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
