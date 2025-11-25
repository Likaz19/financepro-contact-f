import { CheckCircle, Warning, Clock } from "@phosphor-icons/react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useKV } from '@github/spark/hooks'
import type { WebhookResult } from "@/lib/webhooks"

export function WebhookLogs() {
  const [logs] = useKV<WebhookResult[]>('webhook-logs', [])

  if (!logs || logs.length === 0) {
    return (
      <Alert>
        <Clock className="h-4 w-4" />
        <AlertDescription>
          Aucun webhook envoyé pour le moment. Les logs apparaîtront ici après la soumission du formulaire.
        </AlertDescription>
      </Alert>
    )
  }

  const recentLogs = logs.slice(-20).reverse()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Affichage des {recentLogs.length} derniers envois
        </p>
      </div>
      <ScrollArea className="h-[400px]">
        <div className="space-y-3 pr-4">
          {recentLogs.map((log, index) => (
            <Card key={`${log.webhookId}-${log.timestamp}-${index}`} className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {log.success ? (
                    <CheckCircle size={20} weight="fill" className="text-green-600" />
                  ) : (
                    <Warning size={20} weight="fill" className="text-destructive" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-foreground">{log.webhookName}</h4>
                    <Badge variant={log.success ? "default" : "destructive"} className="text-xs">
                      {log.success ? "Succès" : "Échec"}
                    </Badge>
                    {log.statusCode && (
                      <Badge variant="outline" className="text-xs">
                        {log.statusCode}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(log.timestamp).toLocaleString('fr-FR', {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </p>
                  {log.error && (
                    <p className="text-sm text-destructive mt-2">{log.error}</p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
