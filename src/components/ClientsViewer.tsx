import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Users, CheckCircle, DownloadSimple, FileCsv, FileXls } from "@phosphor-icons/react"
import { toast } from "sonner"
import { useKV } from "@github/spark/hooks"

type StoredSubmission = {
  id: string
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

export function ClientsViewer() {
  const [submissions] = useKV<StoredSubmission[]>("form-submissions", [])

  const exportToCSV = () => {
    if (!submissions || submissions.length === 0) {
      toast.error("Aucune donnée à exporter")
      return
    }

    const headers = [
      "Nom",
      "Email",
      "Code Pays",
      "Téléphone",
      "Adresse",
      "Intérêts",
      "Services",
      "Modules",
      "Message",
      "Pièces jointes",
      "Date de soumission"
    ]

    const csvRows = [
      headers.join(","),
      ...submissions.map(sub => [
        `"${sub.formData.name || ''}"`,
        `"${sub.formData.email || ''}"`,
        `"${sub.formData.countryCode || ''}"`,
        `"${sub.formData.phone || ''}"`,
        `"${(sub.formData.address || '').replace(/"/g, '""')}"`,
        `"${(sub.formData.interests || []).join('; ')}"`,
        `"${(sub.formData.services || []).join('; ')}"`,
        `"${(sub.formData.modules || []).join('; ')}"`,
        `"${(sub.formData.message || '').replace(/"/g, '""')}"`,
        `"${sub.attachmentCount || 0} fichier(s)"`,
        `"${new Date(sub.submittedAt).toLocaleString('fr-FR')}"`
      ].join(","))
    ]

    const csvContent = csvRows.join("\n")
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    
    link.setAttribute("href", url)
    link.setAttribute("download", `soumissions_financepro_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast.success(`${submissions.length} soumissions exportées en CSV`)
  }

  const exportToExcel = () => {
    if (!submissions || submissions.length === 0) {
      toast.error("Aucune donnée à exporter")
      return
    }

    const headers = [
      "Nom",
      "Email", 
      "Code Pays",
      "Téléphone",
      "Adresse",
      "Intérêts",
      "Services",
      "Modules",
      "Message",
      "Pièces jointes",
      "Date de soumission"
    ]

    let excelContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Soumissions</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
          table { border-collapse: collapse; width: 100%; }
          th { background-color: #4472C4; color: white; font-weight: bold; padding: 8px; border: 1px solid #ddd; }
          td { padding: 8px; border: 1px solid #ddd; }
          tr:nth-child(even) { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <table>
          <thead>
            <tr>
              ${headers.map(h => `<th>${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${submissions.map(sub => `
              <tr>
                <td>${sub.formData.name || ''}</td>
                <td>${sub.formData.email || ''}</td>
                <td>${sub.formData.countryCode || ''}</td>
                <td>${sub.formData.phone || ''}</td>
                <td>${sub.formData.address || ''}</td>
                <td>${(sub.formData.interests || []).join('; ')}</td>
                <td>${(sub.formData.services || []).join('; ')}</td>
                <td>${(sub.formData.modules || []).join('; ')}</td>
                <td>${sub.formData.message || ''}</td>
                <td>${sub.attachmentCount || 0} fichier(s)</td>
                <td>${new Date(sub.submittedAt).toLocaleString('fr-FR')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `

    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    
    link.setAttribute("href", url)
    link.setAttribute("download", `soumissions_financepro_${new Date().toISOString().split('T')[0]}.xls`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast.success(`${submissions.length} soumissions exportées en Excel`)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={24} weight="bold" className="text-primary" />
          <h3 className="text-lg font-semibold">Soumissions du formulaire</h3>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                disabled={!submissions || submissions.length === 0}
                size="sm"
                variant="default"
                className="gap-2"
              >
                <DownloadSimple size={16} weight="bold" />
                Exporter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={exportToCSV} className="gap-2 cursor-pointer">
                <FileCsv size={18} weight="bold" />
                Exporter en CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToExcel} className="gap-2 cursor-pointer">
                <FileXls size={18} weight="bold" />
                Exporter en Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {(!submissions || submissions.length === 0) && (
        <Alert>
          <CheckCircle size={16} weight="bold" />
          <AlertDescription>
            Aucune soumission enregistrée pour le moment. Les données sont stockées localement dans votre navigateur.
          </AlertDescription>
        </Alert>
      )}

      {submissions && submissions.length > 0 && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Adresse</TableHead>
                  <TableHead>Intérêts</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium">{sub.formData.name}</TableCell>
                    <TableCell>{sub.formData.email}</TableCell>
                    <TableCell>
                      {sub.formData.phone ? `${sub.formData.countryCode || ''} ${sub.formData.phone}` : '-'}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {sub.formData.address || '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {sub.formData.interests?.map((interest) => (
                          <Badge key={interest} variant="secondary" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(sub.submittedAt).toLocaleDateString('fr-FR')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="p-4 border-t bg-muted/30">
            <p className="text-sm text-muted-foreground">
              {submissions.length} soumission{submissions.length > 1 ? 's' : ''} trouvée{submissions.length > 1 ? 's' : ''}
            </p>
          </div>
        </Card>
      )}

      <div className="mt-4 p-4 bg-muted/30 rounded-lg">
        <h4 className="text-sm font-semibold mb-2">💾 Stockage local</h4>
        <p className="text-xs text-muted-foreground">
          Les soumissions sont enregistrées localement dans votre navigateur à l'aide du système de persistance Spark KV.
          Les données persistent entre les sessions et peuvent être exportées en CSV ou Excel.
        </p>
      </div>
    </div>
  )
}
