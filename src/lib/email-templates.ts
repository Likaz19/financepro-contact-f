import type { EmailPayload } from './email-notifications'

export type EmailTemplateType = 'consulting' | 'formation' | 'combined'

export function determineTemplateType(interests: string[]): EmailTemplateType {
  const hasConsulting = interests.includes('Consulting')
  const hasFormation = interests.includes('Formation')
  
  if (hasConsulting && hasFormation) {
    return 'combined'
  } else if (hasConsulting) {
    return 'consulting'
  } else if (hasFormation) {
    return 'formation'
  }
  
  return 'combined'
}

function generateConsultingTemplate(payload: EmailPayload): string {
  const { formData, submittedAt, attachmentCount } = payload
  
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Demande de Consulting - FinancePro</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; background-color: #f7f7f7;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #2d4aa7 0%, #4a68d4 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">
                💼 Nouvelle Demande de Consulting
              </h1>
              <p style="margin: 10px 0 0; color: #e8eef9; font-size: 15px;">
                Un client potentiel vous a contacté
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              
              <!-- Client Info -->
              <div style="background-color: #f8f9fd; border-left: 4px solid #2d4aa7; padding: 20px; margin-bottom: 25px; border-radius: 6px;">
                <h2 style="margin: 0 0 15px; color: #2d4aa7; font-size: 18px; font-weight: 600;">
                  👤 Informations Client
                </h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #555; font-size: 14px; font-weight: 600; width: 120px;">Nom:</td>
                    <td style="padding: 8px 0; color: #333; font-size: 14px;">${formData.name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #555; font-size: 14px; font-weight: 600;">Email:</td>
                    <td style="padding: 8px 0;">
                      <a href="mailto:${formData.email}" style="color: #2d4aa7; text-decoration: none; font-size: 14px;">
                        ${formData.email}
                      </a>
                    </td>
                  </tr>
                  ${formData.phone ? `
                  <tr>
                    <td style="padding: 8px 0; color: #555; font-size: 14px; font-weight: 600;">Téléphone:</td>
                    <td style="padding: 8px 0;">
                      <a href="tel:${formData.countryCode}${formData.phone}" style="color: #2d4aa7; text-decoration: none; font-size: 14px;">
                        ${formData.countryCode} ${formData.phone}
                      </a>
                    </td>
                  </tr>
                  ` : ''}
                </table>
              </div>
              
              <!-- Services Requested -->
              ${formData.services.length > 0 ? `
              <div style="background-color: #fff8e6; border-left: 4px solid #f2da6b; padding: 20px; margin-bottom: 25px; border-radius: 6px;">
                <h2 style="margin: 0 0 15px; color: #b8930d; font-size: 18px; font-weight: 600;">
                  🔧 Services de Consulting Demandés
                </h2>
                <ul style="margin: 0; padding-left: 20px; color: #555;">
                  ${formData.services.map(service => `
                    <li style="margin: 8px 0; font-size: 14px; line-height: 1.5;">
                      <strong style="color: #333;">${service}</strong>
                    </li>
                  `).join('')}
                </ul>
              </div>
              ` : ''}
              
              <!-- Message -->
              ${formData.message ? `
              <div style="background-color: #f0f4ff; border-left: 4px solid #6b8ef2; padding: 20px; margin-bottom: 25px; border-radius: 6px;">
                <h2 style="margin: 0 0 15px; color: #2d4aa7; font-size: 18px; font-weight: 600;">
                  💬 Message du Client
                </h2>
                <p style="margin: 0; color: #333; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">
                  ${formData.message}
                </p>
              </div>
              ` : ''}
              
              <!-- Attachments -->
              ${attachmentCount > 0 ? `
              <div style="background-color: #f0f9ff; border-left: 4px solid #4a9fd4; padding: 20px; margin-bottom: 25px; border-radius: 6px;">
                <h2 style="margin: 0; color: #2d6a8a; font-size: 18px; font-weight: 600;">
                  📎 Fichiers Joints: ${attachmentCount}
                </h2>
              </div>
              ` : ''}
              
              <!-- CTA -->
              <div style="text-align: center; margin-top: 35px; padding-top: 30px; border-top: 2px solid #e8eef9;">
                <a href="mailto:${formData.email}" style="display: inline-block; background: linear-gradient(135deg, #2d4aa7 0%, #4a68d4 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 8px rgba(45,74,167,0.25);">
                  📧 Répondre au Client
                </a>
              </div>
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fd; padding: 25px 30px; text-align: center; border-top: 1px solid #e8eef9;">
              <p style="margin: 0 0 8px; color: #888; font-size: 13px;">
                🕐 Reçu le ${new Date(submittedAt).toLocaleString('fr-FR', {
                  dateStyle: 'full',
                  timeStyle: 'short'
                })}
              </p>
              <p style="margin: 0; color: #aaa; font-size: 12px;">
                FinancePro - Consulting Professionnel
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function generateFormationTemplate(payload: EmailPayload): string {
  const { formData, submittedAt, attachmentCount } = payload
  
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Demande de Formation - FinancePro</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; background-color: #f7f7f7;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e8a4f 0%, #2db36d 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">
                📚 Nouvelle Demande de Formation
              </h1>
              <p style="margin: 10px 0 0; color: #d4f5e3; font-size: 15px;">
                Un candidat souhaite s'inscrire à vos formations
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              
              <!-- Candidate Info -->
              <div style="background-color: #f0fdf7; border-left: 4px solid #1e8a4f; padding: 20px; margin-bottom: 25px; border-radius: 6px;">
                <h2 style="margin: 0 0 15px; color: #1e8a4f; font-size: 18px; font-weight: 600;">
                  👤 Informations Candidat
                </h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #555; font-size: 14px; font-weight: 600; width: 120px;">Nom:</td>
                    <td style="padding: 8px 0; color: #333; font-size: 14px;">${formData.name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #555; font-size: 14px; font-weight: 600;">Email:</td>
                    <td style="padding: 8px 0;">
                      <a href="mailto:${formData.email}" style="color: #1e8a4f; text-decoration: none; font-size: 14px;">
                        ${formData.email}
                      </a>
                    </td>
                  </tr>
                  ${formData.phone ? `
                  <tr>
                    <td style="padding: 8px 0; color: #555; font-size: 14px; font-weight: 600;">Téléphone:</td>
                    <td style="padding: 8px 0;">
                      <a href="tel:${formData.countryCode}${formData.phone}" style="color: #1e8a4f; text-decoration: none; font-size: 14px;">
                        ${formData.countryCode} ${formData.phone}
                      </a>
                    </td>
                  </tr>
                  ` : ''}
                </table>
              </div>
              
              <!-- Modules Requested -->
              ${formData.modules.length > 0 ? `
              <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 20px; margin-bottom: 25px; border-radius: 6px;">
                <h2 style="margin: 0 0 15px; color: #b45309; font-size: 18px; font-weight: 600;">
                  📖 Modules de Formation Sélectionnés
                </h2>
                <ul style="margin: 0; padding-left: 20px; color: #555;">
                  ${formData.modules.map(module => `
                    <li style="margin: 8px 0; font-size: 14px; line-height: 1.5;">
                      <strong style="color: #333;">${module}</strong>
                    </li>
                  `).join('')}
                </ul>
              </div>
              ` : ''}
              
              <!-- Message -->
              ${formData.message ? `
              <div style="background-color: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; margin-bottom: 25px; border-radius: 6px;">
                <h2 style="margin: 0 0 15px; color: #0369a1; font-size: 18px; font-weight: 600;">
                  💬 Message du Candidat
                </h2>
                <p style="margin: 0; color: #333; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">
                  ${formData.message}
                </p>
              </div>
              ` : ''}
              
              <!-- Attachments -->
              ${attachmentCount > 0 ? `
              <div style="background-color: #fef3f2; border-left: 4px solid #ef4444; padding: 20px; margin-bottom: 25px; border-radius: 6px;">
                <h2 style="margin: 0; color: #991b1b; font-size: 18px; font-weight: 600;">
                  📎 Documents Fournis: ${attachmentCount}
                </h2>
              </div>
              ` : ''}
              
              <!-- Learning Path Suggestion -->
              <div style="background-color: #faf5ff; border-left: 4px solid #a855f7; padding: 20px; margin-bottom: 25px; border-radius: 6px;">
                <h2 style="margin: 0 0 10px; color: #7e22ce; font-size: 16px; font-weight: 600;">
                  💡 Actions Recommandées
                </h2>
                <ul style="margin: 0; padding-left: 20px; color: #555; font-size: 13px;">
                  <li style="margin: 6px 0;">Évaluer le niveau actuel du candidat</li>
                  <li style="margin: 6px 0;">Proposer un parcours de formation personnalisé</li>
                  <li style="margin: 6px 0;">Envoyer le calendrier des sessions disponibles</li>
                  <li style="margin: 6px 0;">Discuter des modalités (présentiel/distanciel)</li>
                </ul>
              </div>
              
              <!-- CTA -->
              <div style="text-align: center; margin-top: 35px; padding-top: 30px; border-top: 2px solid #e8f5ed;">
                <a href="mailto:${formData.email}" style="display: inline-block; background: linear-gradient(135deg, #1e8a4f 0%, #2db36d 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 8px rgba(30,138,79,0.25);">
                  📧 Contacter le Candidat
                </a>
              </div>
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f0fdf7; padding: 25px 30px; text-align: center; border-top: 1px solid #d1fae5;">
              <p style="margin: 0 0 8px; color: #888; font-size: 13px;">
                🕐 Reçu le ${new Date(submittedAt).toLocaleString('fr-FR', {
                  dateStyle: 'full',
                  timeStyle: 'short'
                })}
              </p>
              <p style="margin: 0; color: #aaa; font-size: 12px;">
                FinancePro - Formations Professionnelles
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function generateCombinedTemplate(payload: EmailPayload): string {
  const { formData, submittedAt, attachmentCount } = payload
  
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Demande Consulting & Formation - FinancePro</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; background-color: #f7f7f7;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #6b21a8 0%, #a855f7 50%, #2d4aa7 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">
                ⭐ Demande Consulting & Formation
              </h1>
              <p style="margin: 10px 0 0; color: #f3e8ff; font-size: 15px;">
                Un client souhaite nos services complets
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              
              <!-- Client Info -->
              <div style="background: linear-gradient(to right, #faf5ff, #f0f9ff); border-left: 4px solid #a855f7; padding: 20px; margin-bottom: 25px; border-radius: 6px;">
                <h2 style="margin: 0 0 15px; color: #6b21a8; font-size: 18px; font-weight: 600;">
                  👤 Informations Client
                </h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #555; font-size: 14px; font-weight: 600; width: 120px;">Nom:</td>
                    <td style="padding: 8px 0; color: #333; font-size: 14px;">${formData.name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #555; font-size: 14px; font-weight: 600;">Email:</td>
                    <td style="padding: 8px 0;">
                      <a href="mailto:${formData.email}" style="color: #6b21a8; text-decoration: none; font-size: 14px;">
                        ${formData.email}
                      </a>
                    </td>
                  </tr>
                  ${formData.phone ? `
                  <tr>
                    <td style="padding: 8px 0; color: #555; font-size: 14px; font-weight: 600;">Téléphone:</td>
                    <td style="padding: 8px 0;">
                      <a href="tel:${formData.countryCode}${formData.phone}" style="color: #6b21a8; text-decoration: none; font-size: 14px;">
                        ${formData.countryCode} ${formData.phone}
                      </a>
                    </td>
                  </tr>
                  ` : ''}
                </table>
              </div>
              
              <div style="background-color: #fef9e7; border: 2px solid #f2da6b; padding: 15px; margin-bottom: 25px; border-radius: 6px; text-align: center;">
                <p style="margin: 0; color: #856404; font-size: 14px; font-weight: 600;">
                  🌟 Client Premium - Intéressé par Consulting ET Formation
                </p>
              </div>
              
              <!-- Services Consulting -->
              ${formData.services.length > 0 ? `
              <div style="background-color: #f0f4ff; border-left: 4px solid #2d4aa7; padding: 20px; margin-bottom: 25px; border-radius: 6px;">
                <h2 style="margin: 0 0 15px; color: #2d4aa7; font-size: 18px; font-weight: 600;">
                  💼 Services de Consulting
                </h2>
                <ul style="margin: 0; padding-left: 20px; color: #555;">
                  ${formData.services.map(service => `
                    <li style="margin: 8px 0; font-size: 14px; line-height: 1.5;">
                      <strong style="color: #333;">${service}</strong>
                    </li>
                  `).join('')}
                </ul>
              </div>
              ` : ''}
              
              <!-- Modules Formation -->
              ${formData.modules.length > 0 ? `
              <div style="background-color: #f0fdf7; border-left: 4px solid #1e8a4f; padding: 20px; margin-bottom: 25px; border-radius: 6px;">
                <h2 style="margin: 0 0 15px; color: #1e8a4f; font-size: 18px; font-weight: 600;">
                  📚 Modules de Formation
                </h2>
                <ul style="margin: 0; padding-left: 20px; color: #555;">
                  ${formData.modules.map(module => `
                    <li style="margin: 8px 0; font-size: 14px; line-height: 1.5;">
                      <strong style="color: #333;">${module}</strong>
                    </li>
                  `).join('')}
                </ul>
              </div>
              ` : ''}
              
              <!-- Message -->
              ${formData.message ? `
              <div style="background-color: #fff7ed; border-left: 4px solid #f97316; padding: 20px; margin-bottom: 25px; border-radius: 6px;">
                <h2 style="margin: 0 0 15px; color: #c2410c; font-size: 18px; font-weight: 600;">
                  💬 Message du Client
                </h2>
                <p style="margin: 0; color: #333; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">
                  ${formData.message}
                </p>
              </div>
              ` : ''}
              
              <!-- Attachments -->
              ${attachmentCount > 0 ? `
              <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin-bottom: 25px; border-radius: 6px;">
                <h2 style="margin: 0; color: #991b1b; font-size: 18px; font-weight: 600;">
                  📎 Documents Joints: ${attachmentCount}
                </h2>
              </div>
              ` : ''}
              
              <!-- Premium Recommendations -->
              <div style="background: linear-gradient(135deg, #fef9e7 0%, #fff7ed 100%); border: 2px solid #f2da6b; padding: 20px; margin-bottom: 25px; border-radius: 6px;">
                <h2 style="margin: 0 0 10px; color: #92400e; font-size: 16px; font-weight: 600;">
                  🎯 Approche Recommandée
                </h2>
                <ul style="margin: 0; padding-left: 20px; color: #555; font-size: 13px;">
                  <li style="margin: 6px 0;">Proposer un package Consulting + Formation intégré</li>
                  <li style="margin: 6px 0;">Programmer un appel de découverte approfondi</li>
                  <li style="margin: 6px 0;">Préparer une offre personnalisée sur mesure</li>
                  <li style="margin: 6px 0;">Présenter les synergies entre nos deux services</li>
                </ul>
              </div>
              
              <!-- CTA -->
              <div style="text-align: center; margin-top: 35px; padding-top: 30px; border-top: 2px solid #e9d5ff;">
                <a href="mailto:${formData.email}" style="display: inline-block; background: linear-gradient(135deg, #6b21a8 0%, #a855f7 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 8px rgba(107,33,168,0.25);">
                  📧 Contacter ce Client Premium
                </a>
              </div>
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background: linear-gradient(to right, #faf5ff, #f0f9ff); padding: 25px 30px; text-align: center; border-top: 1px solid #e9d5ff;">
              <p style="margin: 0 0 8px; color: #888; font-size: 13px;">
                🕐 Reçu le ${new Date(submittedAt).toLocaleString('fr-FR', {
                  dateStyle: 'full',
                  timeStyle: 'short'
                })}
              </p>
              <p style="margin: 0; color: #aaa; font-size: 12px;">
                FinancePro - Solutions Complètes en Finance
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function generateEmailTemplate(payload: EmailPayload): string {
  const templateType = determineTemplateType(payload.formData.interests)
  
  switch (templateType) {
    case 'consulting':
      return generateConsultingTemplate(payload)
    case 'formation':
      return generateFormationTemplate(payload)
    case 'combined':
      return generateCombinedTemplate(payload)
    default:
      return generateCombinedTemplate(payload)
  }
}

export function generatePlainTextVersion(payload: EmailPayload): string {
  const { formData, submittedAt, attachmentCount } = payload
  const templateType = determineTemplateType(formData.interests)
  
  let header = ''
  switch (templateType) {
    case 'consulting':
      header = '💼 NOUVELLE DEMANDE DE CONSULTING - FINANCEPRO'
      break
    case 'formation':
      header = '📚 NOUVELLE DEMANDE DE FORMATION - FINANCEPRO'
      break
    case 'combined':
      header = '⭐ DEMANDE CONSULTING & FORMATION - FINANCEPRO'
      break
  }
  
  let body = `${header}\n\n`
  body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`
  
  body += `👤 INFORMATIONS CLIENT\n`
  body += `   Nom: ${formData.name}\n`
  body += `   Email: ${formData.email}\n`
  if (formData.phone) {
    body += `   Téléphone: ${formData.countryCode} ${formData.phone}\n`
  }
  body += `\n`
  
  if (formData.services.length > 0) {
    body += `💼 SERVICES CONSULTING DEMANDÉS\n`
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
