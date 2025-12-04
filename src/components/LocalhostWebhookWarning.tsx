import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Warning, X } from "@phosphor-icons/react"
import { useState } from "react"

type LocalhostWebhookWarningProps = {
  webhookCount: number
  onDisableAll?: () => void
}

export function LocalhostWebhookWarning({ webhookCount, onDisableAll }: LocalhostWebhookWarningProps) {
  const [isDismissed, setIsDismissed] = useState(false)

  if (isDismissed || webhookCount === 0) {
    return null
  }

  return (
    <Alert variant="destructive" className="relative">
      <Warning className="h-4 w-4" />
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 h-6 w-6 p-0"
        onClick={() => setIsDismissed(true)}
      >
        <X size={16} />
      </Button>
      <AlertDescription>
        <div className="pr-8">
          <p className="font-semibold mb-2">
            ⚠️ {webhookCount} webhook{webhookCount > 1 ? 's' : ''} avec URL localhost détecté{webhookCount > 1 ? 's' : ''}
          </p>
          <p className="text-sm mb-3">
            Les webhooks localhost ne peuvent pas fonctionner dans une application web. 
            Ils seront automatiquement ignorés lors des soumissions.
          </p>
          <div className="space-y-2">
            <p className="text-sm font-semibold">Solutions recommandées:</p>
            <ul className="text-sm space-y-1 ml-4 list-disc">
              <li>Utilisez <a href="https://webhook.site" target="_blank" rel="noopener noreferrer" className="underline font-semibold">webhook.site</a> (gratuit, instantané)</li>
              <li>Configurez un webhook Zapier ou Make.com</li>
              <li>Désactivez ou supprimez les webhooks localhost dans les paramètres</li>
            </ul>
          </div>
          {onDisableAll && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDisableAll}
              className="mt-3 bg-white text-destructive hover:bg-white/90"
            >
              Désactiver tous les webhooks localhost
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  )
}
