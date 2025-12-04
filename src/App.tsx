import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, Warning, PencilSimple, UploadSimple, FilePdf, FileDoc, FileImage, File as FileIcon, Trash, CaretUpDown, Check, GearSix, MapPin } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Toaster, toast } from "sonner"
import { Footer } from "@/components/Footer"
import { FloatingContactButton } from "@/components/FloatingContactButton"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { sendToAllWebhooks, useWebhooks, type WebhookPayload } from "@/lib/webhooks"
import { WebhookSettings } from "@/components/WebhookSettings"
import { sendToAllEmailRecipients, useEmailNotifications, type EmailPayload } from "@/lib/email-notifications"
import { EmailNotificationSettings } from "@/components/EmailNotificationSettings"
import { EmailNotificationLogs } from "@/components/EmailNotificationLogs"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GooglePlacesApiConfig } from "@/components/GooglePlacesApiConfig"
import { ClientsViewer } from "@/components/ClientsViewer"
import { FormSubmissionTest } from "@/components/FormSubmissionTest"
import { useKV } from "@github/spark/hooks"
import { useGooglePlaces, useAutocomplete, type PlaceResult } from "@/hooks/use-google-places"

type FormData = {
  name: string
  email: string
  countryCode: string
  phone: string
  address: string
  interests: string[]
  services: string[]
  modules: string[]
  message: string
  attachments: File[]
}

type ValidationErrors = {
  name?: string
  email?: string
  phone?: string
  message?: string
  interests?: string
  attachments?: string
}

type CountryCode = {
  code: string
  name: string
  flag: string
  pattern: RegExp
  format: string
}

type SubmissionState = "idle" | "submitting" | "success" | "error"

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

const COUNTRY_CODES: CountryCode[] = [
  { code: "+221", name: "Sénégal", flag: "🇸🇳", pattern: /^[0-9]{9}$/, format: "XX XXX XX XX" },
  { code: "+33", name: "France", flag: "🇫🇷", pattern: /^[0-9]{9}$/, format: "X XX XX XX XX" },
  { code: "+1", name: "États-Unis/Canada", flag: "🇺🇸", pattern: /^[0-9]{10}$/, format: "XXX XXX XXXX" },
  { code: "+44", name: "Royaume-Uni", flag: "🇬🇧", pattern: /^[0-9]{10}$/, format: "XXXX XXX XXX" },
  { code: "+49", name: "Allemagne", flag: "🇩🇪", pattern: /^[0-9]{10,11}$/, format: "XXX XXXXXXX" },
  { code: "+32", name: "Belgique", flag: "🇧🇪", pattern: /^[0-9]{9}$/, format: "XXX XX XX XX" },
  { code: "+41", name: "Suisse", flag: "🇨🇭", pattern: /^[0-9]{9}$/, format: "XX XXX XX XX" },
  { code: "+34", name: "Espagne", flag: "🇪🇸", pattern: /^[0-9]{9}$/, format: "XXX XX XX XX" },
  { code: "+212", name: "Maroc", flag: "🇲🇦", pattern: /^[0-9]{9}$/, format: "XX XXX XXXX" },
  { code: "+225", name: "Côte d'Ivoire", flag: "🇨🇮", pattern: /^[0-9]{10}$/, format: "XX XX XX XX XX" },
  { code: "+213", name: "Algérie", flag: "🇩🇿", pattern: /^[0-9]{9}$/, format: "XX XXX XX XX" },
  { code: "+216", name: "Tunisie", flag: "🇹🇳", pattern: /^[0-9]{8}$/, format: "XX XXX XXX" },
  { code: "+220", name: "Gambie", flag: "🇬🇲", pattern: /^[0-9]{7}$/, format: "XXX XXXX" },
  { code: "+223", name: "Mali", flag: "🇲🇱", pattern: /^[0-9]{8}$/, format: "XX XX XX XX" },
  { code: "+224", name: "Guinée", flag: "🇬🇳", pattern: /^[0-9]{9}$/, format: "XXX XX XX XX" },
  { code: "+226", name: "Burkina Faso", flag: "🇧🇫", pattern: /^[0-9]{8}$/, format: "XX XX XX XX" },
  { code: "+227", name: "Niger", flag: "🇳🇪", pattern: /^[0-9]{8}$/, format: "XX XX XX XX" },
  { code: "+228", name: "Togo", flag: "🇹🇬", pattern: /^[0-9]{8}$/, format: "XX XX XX XX" },
  { code: "+229", name: "Bénin", flag: "🇧🇯", pattern: /^[0-9]{8}$/, format: "XX XX XX XX" },
  { code: "+230", name: "Maurice", flag: "🇲🇺", pattern: /^[0-9]{8}$/, format: "XXXX XXXX" },
  { code: "+231", name: "Libéria", flag: "🇱🇷", pattern: /^[0-9]{7,9}$/, format: "XXX XXXX" },
  { code: "+234", name: "Nigéria", flag: "🇳🇬", pattern: /^[0-9]{10}$/, format: "XXX XXX XXXX" },
  { code: "+235", name: "Tchad", flag: "🇹🇩", pattern: /^[0-9]{8}$/, format: "XX XX XX XX" },
  { code: "+236", name: "Rép. Centrafricaine", flag: "🇨🇫", pattern: /^[0-9]{8}$/, format: "XX XX XX XX" },
  { code: "+237", name: "Cameroun", flag: "🇨🇲", pattern: /^[0-9]{9}$/, format: "XXX XX XX XX" },
  { code: "+238", name: "Cap-Vert", flag: "🇨🇻", pattern: /^[0-9]{7}$/, format: "XXX XXXX" },
  { code: "+239", name: "São Tomé-et-Príncipe", flag: "🇸🇹", pattern: /^[0-9]{7}$/, format: "XXX XXXX" },
  { code: "+240", name: "Guinée équatoriale", flag: "🇬🇶", pattern: /^[0-9]{9}$/, format: "XXX XXX XXX" },
  { code: "+241", name: "Gabon", flag: "🇬🇦", pattern: /^[0-9]{7,8}$/, format: "XX XX XX XX" },
  { code: "+242", name: "Congo", flag: "🇨🇬", pattern: /^[0-9]{9}$/, format: "XX XXX XXXX" },
  { code: "+243", name: "RD Congo", flag: "🇨🇩", pattern: /^[0-9]{9}$/, format: "XXX XXX XXX" },
  { code: "+244", name: "Angola", flag: "🇦🇴", pattern: /^[0-9]{9}$/, format: "XXX XXX XXX" },
  { code: "+245", name: "Guinée-Bissau", flag: "🇬🇼", pattern: /^[0-9]{7}$/, format: "XXX XXXX" },
  { code: "+248", name: "Seychelles", flag: "🇸🇨", pattern: /^[0-9]{7}$/, format: "X XXX XXX" },
  { code: "+249", name: "Soudan", flag: "🇸🇩", pattern: /^[0-9]{9}$/, format: "XX XXX XXXX" },
  { code: "+250", name: "Rwanda", flag: "🇷🇼", pattern: /^[0-9]{9}$/, format: "XXX XXX XXX" },
  { code: "+251", name: "Éthiopie", flag: "🇪🇹", pattern: /^[0-9]{9}$/, format: "XX XXX XXXX" },
  { code: "+252", name: "Somalie", flag: "🇸🇴", pattern: /^[0-9]{8}$/, format: "XX XXX XXX" },
  { code: "+253", name: "Djibouti", flag: "🇩🇯", pattern: /^[0-9]{8}$/, format: "XX XX XX XX" },
  { code: "+254", name: "Kenya", flag: "🇰🇪", pattern: /^[0-9]{10}$/, format: "XXX XXX XXX" },
  { code: "+255", name: "Tanzanie", flag: "🇹🇿", pattern: /^[0-9]{9}$/, format: "XXX XXX XXX" },
  { code: "+256", name: "Ouganda", flag: "🇺🇬", pattern: /^[0-9]{9}$/, format: "XXX XXX XXX" },
  { code: "+257", name: "Burundi", flag: "🇧🇮", pattern: /^[0-9]{8}$/, format: "XX XX XX XX" },
  { code: "+258", name: "Mozambique", flag: "🇲🇿", pattern: /^[0-9]{9}$/, format: "XX XXX XXXX" },
  { code: "+260", name: "Zambie", flag: "🇿🇲", pattern: /^[0-9]{9}$/, format: "XX XXX XXXX" },
  { code: "+261", name: "Madagascar", flag: "🇲🇬", pattern: /^[0-9]{9}$/, format: "XX XX XXX XX" },
  { code: "+262", name: "Réunion/Mayotte", flag: "🇷🇪", pattern: /^[0-9]{9}$/, format: "XXX XX XX XX" },
  { code: "+263", name: "Zimbabwe", flag: "🇿🇼", pattern: /^[0-9]{9}$/, format: "XX XXX XXXX" },
  { code: "+264", name: "Namibie", flag: "🇳🇦", pattern: /^[0-9]{9}$/, format: "XX XXX XXXX" },
  { code: "+265", name: "Malawi", flag: "🇲🇼", pattern: /^[0-9]{9}$/, format: "XXX XX XX XX" },
  { code: "+266", name: "Lesotho", flag: "🇱🇸", pattern: /^[0-9]{8}$/, format: "XX XXX XXX" },
  { code: "+267", name: "Botswana", flag: "🇧🇼", pattern: /^[0-9]{8}$/, format: "XX XXX XXX" },
  { code: "+268", name: "Eswatini", flag: "🇸🇿", pattern: /^[0-9]{8}$/, format: "XX XXX XXX" },
  { code: "+269", name: "Comores", flag: "🇰🇲", pattern: /^[0-9]{7}$/, format: "XXX XXXX" },
  { code: "+27", name: "Afrique du Sud", flag: "🇿🇦", pattern: /^[0-9]{9}$/, format: "XX XXX XXXX" },
  { code: "+20", name: "Égypte", flag: "🇪🇬", pattern: /^[0-9]{10}$/, format: "XXX XXX XXXX" },
  { code: "+211", name: "Soudan du Sud", flag: "🇸🇸", pattern: /^[0-9]{9}$/, format: "XX XXX XXXX" },
  { code: "+30", name: "Grèce", flag: "🇬🇷", pattern: /^[0-9]{10}$/, format: "XXX XXX XXXX" },
  { code: "+31", name: "Pays-Bas", flag: "🇳🇱", pattern: /^[0-9]{9}$/, format: "X XX XX XX XX" },
  { code: "+351", name: "Portugal", flag: "🇵🇹", pattern: /^[0-9]{9}$/, format: "XXX XXX XXX" },
  { code: "+352", name: "Luxembourg", flag: "🇱🇺", pattern: /^[0-9]{9}$/, format: "XXX XXX XXX" },
  { code: "+353", name: "Irlande", flag: "🇮🇪", pattern: /^[0-9]{9}$/, format: "XX XXX XXXX" },
  { code: "+354", name: "Islande", flag: "🇮🇸", pattern: /^[0-9]{7}$/, format: "XXX XXXX" },
  { code: "+355", name: "Albanie", flag: "🇦🇱", pattern: /^[0-9]{9}$/, format: "XX XXX XXXX" },
  { code: "+356", name: "Malte", flag: "🇲🇹", pattern: /^[0-9]{8}$/, format: "XXXX XXXX" },
  { code: "+357", name: "Chypre", flag: "🇨🇾", pattern: /^[0-9]{8}$/, format: "XX XXX XXX" },
  { code: "+358", name: "Finlande", flag: "🇫🇮", pattern: /^[0-9]{9,10}$/, format: "XX XXX XXXX" },
  { code: "+359", name: "Bulgarie", flag: "🇧🇬", pattern: /^[0-9]{9}$/, format: "XX XXX XXXX" },
  { code: "+36", name: "Hongrie", flag: "🇭🇺", pattern: /^[0-9]{9}$/, format: "XX XXX XXXX" },
  { code: "+370", name: "Lituanie", flag: "🇱🇹", pattern: /^[0-9]{8}$/, format: "XXX XXXXX" },
  { code: "+371", name: "Lettonie", flag: "🇱🇻", pattern: /^[0-9]{8}$/, format: "XX XXX XXX" },
  { code: "+372", name: "Estonie", flag: "🇪🇪", pattern: /^[0-9]{7,8}$/, format: "XXX XXXX" },
  { code: "+373", name: "Moldavie", flag: "🇲🇩", pattern: /^[0-9]{8}$/, format: "XX XXX XXX" },
  { code: "+374", name: "Arménie", flag: "🇦🇲", pattern: /^[0-9]{8}$/, format: "XX XXX XXX" },
  { code: "+375", name: "Biélorussie", flag: "🇧🇾", pattern: /^[0-9]{9}$/, format: "XX XXX XX XX" },
  { code: "+376", name: "Andorre", flag: "🇦🇩", pattern: /^[0-9]{6}$/, format: "XXX XXX" },
  { code: "+377", name: "Monaco", flag: "🇲🇨", pattern: /^[0-9]{8,9}$/, format: "XX XX XX XX" },
  { code: "+378", name: "Saint-Marin", flag: "🇸🇲", pattern: /^[0-9]{10}$/, format: "XXXX XXXXXX" },
  { code: "+380", name: "Ukraine", flag: "🇺🇦", pattern: /^[0-9]{9}$/, format: "XX XXX XX XX" },
  { code: "+381", name: "Serbie", flag: "🇷🇸", pattern: /^[0-9]{8,9}$/, format: "XX XXX XXXX" },
  { code: "+382", name: "Monténégro", flag: "🇲🇪", pattern: /^[0-9]{8}$/, format: "XX XXX XXX" },
  { code: "+383", name: "Kosovo", flag: "🇽🇰", pattern: /^[0-9]{8}$/, format: "XX XXX XXX" },
  { code: "+385", name: "Croatie", flag: "🇭🇷", pattern: /^[0-9]{9}$/, format: "XX XXX XXXX" },
  { code: "+386", name: "Slovénie", flag: "🇸🇮", pattern: /^[0-9]{8}$/, format: "XX XXX XXX" },
  { code: "+387", name: "Bosnie-Herzégovine", flag: "🇧🇦", pattern: /^[0-9]{8}$/, format: "XX XXX XXX" },
  { code: "+389", name: "Macédoine du Nord", flag: "🇲🇰", pattern: /^[0-9]{8}$/, format: "XX XXX XXX" },
  { code: "+39", name: "Italie", flag: "🇮🇹", pattern: /^[0-9]{9,10}$/, format: "XXX XXX XXXX" },
  { code: "+40", name: "Roumanie", flag: "🇷🇴", pattern: /^[0-9]{9}$/, format: "XXX XXX XXX" },
  { code: "+420", name: "Tchéquie", flag: "🇨🇿", pattern: /^[0-9]{9}$/, format: "XXX XXX XXX" },
  { code: "+421", name: "Slovaquie", flag: "🇸🇰", pattern: /^[0-9]{9}$/, format: "XXX XXX XXX" },
  { code: "+423", name: "Liechtenstein", flag: "🇱🇮", pattern: /^[0-9]{7}$/, format: "XXX XXXX" },
  { code: "+43", name: "Autriche", flag: "🇦🇹", pattern: /^[0-9]{10,11}$/, format: "XXX XXXXXXX" },
  { code: "+45", name: "Danemark", flag: "🇩🇰", pattern: /^[0-9]{8}$/, format: "XX XX XX XX" },
  { code: "+46", name: "Suède", flag: "🇸🇪", pattern: /^[0-9]{9}$/, format: "XX XXX XX XX" },
  { code: "+47", name: "Norvège", flag: "🇳🇴", pattern: /^[0-9]{8}$/, format: "XXX XX XXX" },
  { code: "+48", name: "Pologne", flag: "🇵🇱", pattern: /^[0-9]{9}$/, format: "XXX XXX XXX" },
  { code: "+60", name: "Malaisie", flag: "🇲🇾", pattern: /^[0-9]{9,10}$/, format: "XX XXXX XXXX" },
  { code: "+61", name: "Australie", flag: "🇦🇺", pattern: /^[0-9]{9}$/, format: "XXX XXX XXX" },
  { code: "+62", name: "Indonésie", flag: "🇮🇩", pattern: /^[0-9]{9,11}$/, format: "XXX XXXX XXXX" },
  { code: "+63", name: "Philippines", flag: "🇵🇭", pattern: /^[0-9]{10}$/, format: "XXX XXX XXXX" },
  { code: "+64", name: "Nouvelle-Zélande", flag: "🇳🇿", pattern: /^[0-9]{9,10}$/, format: "XX XXX XXXX" },
  { code: "+65", name: "Singapour", flag: "🇸🇬", pattern: /^[0-9]{8}$/, format: "XXXX XXXX" },
  { code: "+66", name: "Thaïlande", flag: "🇹🇭", pattern: /^[0-9]{9}$/, format: "XX XXX XXXX" },
  { code: "+81", name: "Japon", flag: "🇯🇵", pattern: /^[0-9]{10}$/, format: "XXX XXXX XXXX" },
  { code: "+82", name: "Corée du Sud", flag: "🇰🇷", pattern: /^[0-9]{9,10}$/, format: "XX XXXX XXXX" },
  { code: "+84", name: "Viêt Nam", flag: "🇻🇳", pattern: /^[0-9]{9,10}$/, format: "XXX XXX XXXX" },
  { code: "+86", name: "Chine", flag: "🇨🇳", pattern: /^[0-9]{11}$/, format: "XXX XXXX XXXX" },
  { code: "+90", name: "Turquie", flag: "🇹🇷", pattern: /^[0-9]{10}$/, format: "XXX XXX XXXX" },
  { code: "+91", name: "Inde", flag: "🇮🇳", pattern: /^[0-9]{10}$/, format: "XXXXX XXXXX" },
  { code: "+92", name: "Pakistan", flag: "🇵🇰", pattern: /^[0-9]{10}$/, format: "XXX XXX XXXX" },
  { code: "+93", name: "Afghanistan", flag: "🇦🇫", pattern: /^[0-9]{9}$/, format: "XX XXX XXXX" },
  { code: "+94", name: "Sri Lanka", flag: "🇱🇰", pattern: /^[0-9]{9}$/, format: "XX XXX XXXX" },
  { code: "+95", name: "Myanmar", flag: "🇲🇲", pattern: /^[0-9]{9,10}$/, format: "XX XXX XXXX" },
  { code: "+966", name: "Arabie Saoudite", flag: "🇸🇦", pattern: /^[0-9]{9}$/, format: "XX XXX XXXX" },
  { code: "+967", name: "Yémen", flag: "🇾🇪", pattern: /^[0-9]{9}$/, format: "XXX XXX XXX" },
  { code: "+968", name: "Oman", flag: "🇴🇲", pattern: /^[0-9]{8}$/, format: "XXXX XXXX" },
  { code: "+970", name: "Palestine", flag: "🇵🇸", pattern: /^[0-9]{9}$/, format: "XXX XXX XXX" },
  { code: "+971", name: "Émirats Arabes Unis", flag: "🇦🇪", pattern: /^[0-9]{9}$/, format: "XX XXX XXXX" },
  { code: "+972", name: "Israël", flag: "🇮🇱", pattern: /^[0-9]{9}$/, format: "XX XXX XXXX" },
  { code: "+973", name: "Bahreïn", flag: "🇧🇭", pattern: /^[0-9]{8}$/, format: "XXXX XXXX" },
  { code: "+974", name: "Qatar", flag: "🇶🇦", pattern: /^[0-9]{8}$/, format: "XXXX XXXX" },
  { code: "+975", name: "Bhoutan", flag: "🇧🇹", pattern: /^[0-9]{8}$/, format: "XX XXX XXX" },
  { code: "+976", name: "Mongolie", flag: "🇲🇳", pattern: /^[0-9]{8}$/, format: "XX XX XXXX" },
  { code: "+977", name: "Népal", flag: "🇳🇵", pattern: /^[0-9]{10}$/, format: "XXX XXX XXXX" },
  { code: "+98", name: "Iran", flag: "🇮🇷", pattern: /^[0-9]{10}$/, format: "XXX XXX XXXX" },
  { code: "+992", name: "Tadjikistan", flag: "🇹🇯", pattern: /^[0-9]{9}$/, format: "XX XXX XXXX" },
  { code: "+993", name: "Turkménistan", flag: "🇹🇲", pattern: /^[0-9]{8}$/, format: "XX XXX XXX" },
  { code: "+994", name: "Azerbaïdjan", flag: "🇦🇿", pattern: /^[0-9]{9}$/, format: "XX XXX XX XX" },
  { code: "+995", name: "Géorgie", flag: "🇬🇪", pattern: /^[0-9]{9}$/, format: "XXX XXX XXX" },
  { code: "+996", name: "Kirghizistan", flag: "🇰🇬", pattern: /^[0-9]{9}$/, format: "XXX XXX XXX" },
  { code: "+998", name: "Ouzbékistan", flag: "🇺🇿", pattern: /^[0-9]{9}$/, format: "XX XXX XX XX" },
  { code: "+52", name: "Mexique", flag: "🇲🇽", pattern: /^[0-9]{10}$/, format: "XXX XXX XXXX" },
  { code: "+54", name: "Argentine", flag: "🇦🇷", pattern: /^[0-9]{10}$/, format: "XX XXXX XXXX" },
  { code: "+55", name: "Brésil", flag: "🇧🇷", pattern: /^[0-9]{10,11}$/, format: "XX XXXXX XXXX" },
  { code: "+56", name: "Chili", flag: "🇨🇱", pattern: /^[0-9]{9}$/, format: "X XXXX XXXX" },
  { code: "+57", name: "Colombie", flag: "🇨🇴", pattern: /^[0-9]{10}$/, format: "XXX XXX XXXX" },
  { code: "+58", name: "Venezuela", flag: "🇻🇪", pattern: /^[0-9]{10}$/, format: "XXX XXX XXXX" },
  { code: "+591", name: "Bolivie", flag: "🇧🇴", pattern: /^[0-9]{8}$/, format: "X XXX XXXX" },
  { code: "+592", name: "Guyana", flag: "🇬🇾", pattern: /^[0-9]{7}$/, format: "XXX XXXX" },
  { code: "+593", name: "Équateur", flag: "🇪🇨", pattern: /^[0-9]{9}$/, format: "XX XXX XXXX" },
  { code: "+594", name: "Guyane française", flag: "🇬🇫", pattern: /^[0-9]{9}$/, format: "XXX XX XX XX" },
  { code: "+595", name: "Paraguay", flag: "🇵🇾", pattern: /^[0-9]{9}$/, format: "XXX XXX XXX" },
  { code: "+596", name: "Martinique", flag: "🇲🇶", pattern: /^[0-9]{9}$/, format: "XXX XX XX XX" },
  { code: "+597", name: "Suriname", flag: "🇸🇷", pattern: /^[0-9]{7}$/, format: "XXX XXXX" },
  { code: "+598", name: "Uruguay", flag: "🇺🇾", pattern: /^[0-9]{8}$/, format: "XX XXX XXX" },
  { code: "+502", name: "Guatemala", flag: "🇬🇹", pattern: /^[0-9]{8}$/, format: "XXXX XXXX" },
  { code: "+503", name: "Salvador", flag: "🇸🇻", pattern: /^[0-9]{8}$/, format: "XXXX XXXX" },
  { code: "+504", name: "Honduras", flag: "🇭🇳", pattern: /^[0-9]{8}$/, format: "XXXX XXXX" },
  { code: "+505", name: "Nicaragua", flag: "🇳🇮", pattern: /^[0-9]{8}$/, format: "XXXX XXXX" },
  { code: "+506", name: "Costa Rica", flag: "🇨🇷", pattern: /^[0-9]{8}$/, format: "XXXX XXXX" },
  { code: "+507", name: "Panama", flag: "🇵🇦", pattern: /^[0-9]{8}$/, format: "XXXX XXXX" },
  { code: "+509", name: "Haïti", flag: "🇭🇹", pattern: /^[0-9]{8}$/, format: "XX XX XXXX" },
  { code: "+51", name: "Pérou", flag: "🇵🇪", pattern: /^[0-9]{9}$/, format: "XXX XXX XXX" },
  { code: "+53", name: "Cuba", flag: "🇨🇺", pattern: /^[0-9]{8}$/, format: "X XXX XXXX" },
]

function App() {
  const [currentStep, setCurrentStep] = useState(0)
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle")
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [apiError, setApiError] = useState<string>("")
  const [countryCodeOpen, setCountryCodeOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [webhooks] = useWebhooks()
  const [emailNotifications] = useEmailNotifications()
  const [googleApiKey] = useKV<string | null>("google-places-api-key", null)
  const [submissions, setSubmissions] = useKV<StoredSubmission[]>("form-submissions", [])
  const addressInputRef = useRef<HTMLInputElement>(null)
  const { isLoaded: isPlacesLoaded } = useGooglePlaces(googleApiKey ?? null)
  
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    countryCode: "+221",
    phone: "",
    address: "",
    interests: [],
    services: [],
    modules: [],
    message: "",
    attachments: [],
  })

  const getCountryCodeFromPlace = useCallback((place: PlaceResult): string | null => {
    if (!place.address_components) return null
    
    const countryComponent = place.address_components.find(component =>
      component.types.includes('country')
    )
    
    if (!countryComponent) return null
    
    const countryCodeMap: Record<string, string> = {
      'SN': '+221',
      'FR': '+33',
      'US': '+1',
      'CA': '+1',
      'GB': '+44',
      'DE': '+49',
      'BE': '+32',
      'CH': '+41',
      'ES': '+34',
      'MA': '+212',
      'CI': '+225',
      'DZ': '+213',
      'TN': '+216',
      'GM': '+220',
      'ML': '+223',
      'GN': '+224',
      'BF': '+226',
      'NE': '+227',
      'TG': '+228',
      'BJ': '+229',
      'MU': '+230',
      'LR': '+231',
      'NG': '+234',
      'TD': '+235',
      'CF': '+236',
      'CM': '+237',
      'CV': '+238',
      'ST': '+239',
      'GQ': '+240',
      'GA': '+241',
      'CG': '+242',
      'CD': '+243',
      'AO': '+244',
      'GW': '+245',
      'SC': '+248',
      'SD': '+249',
      'RW': '+250',
      'ET': '+251',
      'SO': '+252',
      'DJ': '+253',
      'KE': '+254',
      'TZ': '+255',
      'UG': '+256',
      'BI': '+257',
      'MZ': '+258',
      'ZM': '+260',
      'MG': '+261',
      'RE': '+262',
      'YT': '+262',
      'ZW': '+263',
      'NA': '+264',
      'MW': '+265',
      'LS': '+266',
      'BW': '+267',
      'SZ': '+268',
      'KM': '+269',
      'ZA': '+27',
      'EG': '+20',
      'SS': '+211',
      'GR': '+30',
      'NL': '+31',
      'PT': '+351',
      'LU': '+352',
      'IE': '+353',
      'IS': '+354',
      'AL': '+355',
      'MT': '+356',
      'CY': '+357',
      'FI': '+358',
      'BG': '+359',
      'HU': '+36',
      'LT': '+370',
      'LV': '+371',
      'EE': '+372',
      'MD': '+373',
      'AM': '+374',
      'BY': '+375',
      'AD': '+376',
      'MC': '+377',
      'SM': '+378',
      'UA': '+380',
      'RS': '+381',
      'ME': '+382',
      'XK': '+383',
      'HR': '+385',
      'SI': '+386',
      'BA': '+387',
      'MK': '+389',
      'IT': '+39',
      'RO': '+40',
      'CZ': '+420',
      'SK': '+421',
      'LI': '+423',
      'AT': '+43',
      'DK': '+45',
      'SE': '+46',
      'NO': '+47',
      'PL': '+48',
      'MY': '+60',
      'AU': '+61',
      'ID': '+62',
      'PH': '+63',
      'NZ': '+64',
      'SG': '+65',
      'TH': '+66',
      'JP': '+81',
      'KR': '+82',
      'VN': '+84',
      'CN': '+86',
      'TR': '+90',
      'IN': '+91',
      'PK': '+92',
      'AF': '+93',
      'LK': '+94',
      'MM': '+95',
      'SA': '+966',
      'YE': '+967',
      'OM': '+968',
      'PS': '+970',
      'AE': '+971',
      'IL': '+972',
      'BH': '+973',
      'QA': '+974',
      'BT': '+975',
      'MN': '+976',
      'NP': '+977',
      'IR': '+98',
      'TJ': '+992',
      'TM': '+993',
      'AZ': '+994',
      'GE': '+995',
      'KG': '+996',
      'UZ': '+998',
      'MX': '+52',
      'AR': '+54',
      'BR': '+55',
      'CL': '+56',
      'CO': '+57',
      'VE': '+58',
      'BO': '+591',
      'GY': '+592',
      'EC': '+593',
      'GF': '+594',
      'PY': '+595',
      'MQ': '+596',
      'SR': '+597',
      'UY': '+598',
      'GT': '+502',
      'SV': '+503',
      'HN': '+504',
      'NI': '+505',
      'CR': '+506',
      'PA': '+507',
      'HT': '+509',
      'PE': '+51',
      'CU': '+53',
    }
    
    return countryCodeMap[countryComponent.short_name] || null
  }, [])

  const handlePlaceSelected = useCallback((place: PlaceResult) => {
    const detectedCountryCode = getCountryCodeFromPlace(place)
    
    setFormData((prev) => ({
      ...prev,
      address: place.formatted_address,
      countryCode: detectedCountryCode || prev.countryCode,
    }))
    
    if (detectedCountryCode) {
      const country = COUNTRY_CODES.find(c => c.code === detectedCountryCode)
      toast.success(`Adresse sélectionnée • Code pays: ${country?.flag} ${detectedCountryCode}`)
    } else {
      toast.success("Adresse sélectionnée")
    }
  }, [getCountryCodeFromPlace])

  useAutocomplete(addressInputRef, handlePlaceSelected, isPlacesLoaded)

  const totalSteps = 6
  const progress = ((currentStep + 1) / totalSteps) * 100

  const validateStep = (step: number): boolean => {
    const newErrors: ValidationErrors = {}

    if (step === 0) {
      if (!formData.name.trim() || formData.name.trim().length < 2) {
        newErrors.name = "Le nom doit contenir au moins 2 caractères"
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!formData.email.trim() || !emailRegex.test(formData.email)) {
        newErrors.email = "Veuillez entrer une adresse email valide"
      }

      if (formData.phone.trim()) {
        const selectedCountry = COUNTRY_CODES.find(c => c.code === formData.countryCode)
        const phoneDigits = formData.phone.replace(/\D/g, "")
        
        if (!selectedCountry) {
          newErrors.phone = "Veuillez sélectionner un code pays valide"
        } else if (!selectedCountry.pattern.test(phoneDigits)) {
          const expectedLength = selectedCountry.pattern.source.match(/\{(\d+)(,\d+)?\}/)?.[1] || "N"
          newErrors.phone = `Format invalide. Attendu: ${selectedCountry.format} (${phoneDigits.length} chiffres saisis)`
        }
      }
    }

    if (step === 1) {
      if (formData.interests.length === 0) {
        newErrors.interests = "Veuillez sélectionner au moins un intérêt"
      }
    }

    if (step === 3) {
      if (formData.message.trim() && formData.message.trim().length < 10) {
        newErrors.message = "Le message doit contenir au moins 10 caractères"
      }
      if (formData.message.trim().length > 1000) {
        newErrors.message = "Le message ne peut pas dépasser 1000 caractères"
      }
    }

    if (step === 4) {
      if (formData.attachments.length > 5) {
        newErrors.attachments = "Vous ne pouvez joindre que 5 fichiers maximum"
      }
      const maxSize = 10 * 1024 * 1024
      const hasOversizedFile = formData.attachments.some(file => file.size > maxSize)
      if (hasOversizedFile) {
        newErrors.attachments = "Chaque fichier ne doit pas dépasser 10 Mo"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setErrors({})
      if (currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const handlePrev = () => {
    setErrors({})
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleEditStep = (step: number) => {
    setCurrentStep(step)
    setErrors({})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep(currentStep)) {
      return
    }

    setSubmissionState("submitting")
    setApiError("")

    try {
      const submissionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      const submission: StoredSubmission = {
        id: submissionId,
        formData: {
          name: formData.name,
          email: formData.email,
          countryCode: formData.countryCode,
          phone: formData.phone,
          address: formData.address,
          interests: formData.interests,
          services: formData.services,
          modules: formData.modules,
          message: formData.message,
        },
        submittedAt: new Date().toISOString(),
        attachmentCount: formData.attachments.length,
      }

      setSubmissions((currentSubmissions) => [...(currentSubmissions || []), submission])

      if (webhooks && webhooks.length > 0) {
        const webhookPayload: WebhookPayload = {
          formData: {
            name: formData.name,
            email: formData.email,
            countryCode: formData.countryCode,
            phone: formData.phone,
            address: formData.address,
            interests: formData.interests,
            services: formData.services,
            modules: formData.modules,
            message: formData.message,
          },
          submittedAt: submission.submittedAt,
          attachmentCount: formData.attachments.length,
        }

        const webhookResults = await sendToAllWebhooks(webhooks, webhookPayload)
        
        const failedWebhooks = webhookResults.filter(r => !r.success)
        if (failedWebhooks.length > 0) {
          console.warn("Certains webhooks ont échoué:", failedWebhooks)
          failedWebhooks.forEach(result => {
            const errorMsg = result.error?.includes('Connection refused') || result.error?.includes('Failed to fetch')
              ? 'URL non accessible (vérifiez que le serveur est en ligne)'
              : result.error || 'Erreur inconnue'
            toast.warning(`Webhook "${result.webhookName}" non livré`, {
              description: errorMsg,
              duration: 5000
            })
          })
        }
        
        const successWebhooks = webhookResults.filter(r => r.success)
        if (successWebhooks.length > 0) {
          console.log(`${successWebhooks.length} webhook(s) envoyé(s) avec succès`)
        }
      }

      if (emailNotifications && emailNotifications.length > 0) {
        const emailPayload: EmailPayload = {
          formData: {
            name: formData.name,
            email: formData.email,
            countryCode: formData.countryCode,
            phone: formData.phone,
            address: formData.address,
            interests: formData.interests,
            services: formData.services,
            modules: formData.modules,
            message: formData.message,
          },
          submittedAt: submission.submittedAt,
          attachmentCount: formData.attachments.length,
        }

        const emailResults = await sendToAllEmailRecipients(emailNotifications, emailPayload)
        
        const successEmails = emailResults.filter(r => r.success)
        if (successEmails.length > 0) {
          console.log(`${successEmails.length} notification(s) email ouvertes`)
          toast.success(`${successEmails.length} notification(s) email préparée(s)`)
        }
      }

      console.log("Formulaire soumis avec succès:", submission)
      
      setSubmissionState("success")
      toast.success("Message envoyé avec succès!")
    } catch (error) {
      console.error("Erreur lors de la soumission:", error)
      setSubmissionState("error")
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Une erreur est survenue lors de l'envoi. Veuillez réessayer."
      
      setApiError(errorMessage)
      toast.error(errorMessage)
    }
  }

  const updateField = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const toggleService = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }))
  }

  const toggleModule = (module: string) => {
    setFormData((prev) => ({
      ...prev,
      modules: prev.modules.includes(module)
        ? prev.modules.filter((m) => m !== module)
        : [...prev.modules, module],
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newFiles = Array.from(files)
    const currentFiles = formData.attachments
    const totalFiles = currentFiles.length + newFiles.length

    if (totalFiles > 5) {
      toast.error("Vous ne pouvez joindre que 5 fichiers maximum")
      return
    }

    const maxSize = 10 * 1024 * 1024
    const oversizedFiles = newFiles.filter(file => file.size > maxSize)
    
    if (oversizedFiles.length > 0) {
      toast.error("Chaque fichier ne doit pas dépasser 10 Mo")
      return
    }

    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...newFiles],
    }))
    
    if (errors.attachments) {
      setErrors({ ...errors, attachments: undefined })
    }
  }

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }))
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'pdf':
        return <FilePdf size={24} weight="fill" className="text-destructive" />
      case 'doc':
      case 'docx':
        return <FileDoc size={24} weight="fill" className="text-primary" />
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FileImage size={24} weight="fill" className="text-accent-foreground" />
      default:
        return <FileIcon size={24} weight="fill" className="text-muted-foreground" />
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const showConsulting = formData.interests.includes("Consulting")
  const showFormation = formData.interests.includes("Formation")

  if (submissionState === "success") {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center bg-background p-4">
          <Card className="w-full max-w-2xl shadow-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="p-12 text-center"
            >
              <div className="checkmark-circle w-24 h-24 rounded-full border-[5px] border-primary flex items-center justify-center mx-auto mb-6">
                <CheckCircle
                  className="checkmark-icon text-primary"
                  size={52}
                  weight="bold"
                />
              </div>
              <h2 className="text-3xl font-semibold text-primary mb-3">
                Message envoyé !
              </h2>
              <p className="text-lg text-foreground">
                Merci pour votre confiance. Notre équipe vous contactera
                rapidement.
              </p>
            </motion.div>
          </Card>
        </div>
        <Footer />
        <FloatingContactButton />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center bg-background p-4">
        <Toaster position="top-center" richColors />
        <Card className="w-full max-w-2xl shadow-2xl">
          <div className="p-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-3xl font-semibold text-primary">
                Contactez FinancePro
              </h2>
              <p className="text-foreground mt-1">
                Consulting • Formation • Accompagnement professionnel
              </p>
            </div>
            <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 -mt-1 relative">
                  <GearSix size={20} weight="bold" />
                  Paramètres
                  {((webhooks && webhooks.filter(w => w.enabled).length > 0) || 
                    (emailNotifications && emailNotifications.filter(e => e.enabled).length > 0) ||
                    googleApiKey) && (
                    <Badge variant="default" className="absolute -top-1 -right-1 h-5 min-w-5 px-1 text-xs">
                      {(webhooks?.filter(w => w.enabled).length || 0) + 
                       (emailNotifications?.filter(e => e.enabled).length || 0) +
                       (googleApiKey ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Configuration</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="test" className="w-full">
                  <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="test">Tests</TabsTrigger>
                    <TabsTrigger value="email">Emails</TabsTrigger>
                    <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
                    <TabsTrigger value="places">Adresses</TabsTrigger>
                    <TabsTrigger value="submissions">Soumissions</TabsTrigger>
                    <TabsTrigger value="logs">Historique</TabsTrigger>
                  </TabsList>
                  <TabsContent value="test" className="mt-6">
                    <FormSubmissionTest />
                  </TabsContent>
                  <TabsContent value="email" className="mt-6">
                    <EmailNotificationSettings />
                  </TabsContent>
                  <TabsContent value="webhooks" className="mt-6">
                    <WebhookSettings />
                  </TabsContent>
                  <TabsContent value="places" className="mt-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Google Places API</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Activez l'autocomplétion d'adresse avec Google Places API pour faciliter la saisie des adresses.
                        </p>
                      </div>
                      <GooglePlacesApiConfig />
                      <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                        <h4 className="text-sm font-semibold mb-2">Comment obtenir une clé API ?</h4>
                        <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                          <li>Accédez à <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google Cloud Console</a></li>
                          <li>Créez un nouveau projet ou sélectionnez un projet existant</li>
                          <li>Activez l'API "Places API" dans la bibliothèque d'API</li>
                          <li>Créez des identifiants (Clé API) dans "Identifiants"</li>
                          <li>Copiez la clé et collez-la ci-dessus</li>
                        </ol>
                        <p className="text-xs text-muted-foreground mt-3">
                          Note: Google Places API nécessite une facturation activée, mais offre 200$ de crédit gratuit par mois.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="submissions" className="mt-6">
                    <ClientsViewer />
                  </TabsContent>
                  <TabsContent value="logs" className="mt-6">
                    <EmailNotificationLogs />
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </div>

          <Progress value={progress} className="mb-8 h-2.5" />

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <div>
                    <Label htmlFor="name" className="text-base font-semibold">
                      Nom complet <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        updateField("name", e.target.value)
                        if (errors.name) setErrors({ ...errors, name: undefined })
                      }}
                      className={`mt-2 ${errors.name ? "border-destructive" : ""}`}
                    />
                    {errors.name && (
                      <p className="text-destructive text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-base font-semibold">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        updateField("email", e.target.value)
                        if (errors.email) setErrors({ ...errors, email: undefined })
                      }}
                      className={`mt-2 ${errors.email ? "border-destructive" : ""}`}
                    />
                    {errors.email && (
                      <p className="text-destructive text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-base font-semibold">
                      Téléphone
                    </Label>
                    <div className="flex gap-2 mt-2">
                      <Popover open={countryCodeOpen} onOpenChange={setCountryCodeOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={countryCodeOpen}
                            className={`w-[180px] justify-between ${errors.phone ? "border-destructive" : ""}`}
                          >
                            <span className="flex items-center gap-2 truncate">
                              <span>{COUNTRY_CODES.find(c => c.code === formData.countryCode)?.flag}</span>
                              <span>{formData.countryCode}</span>
                            </span>
                            <CaretUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0" align="start">
                          <Command>
                            <CommandInput placeholder="Rechercher un pays..." />
                            <CommandList>
                              <CommandEmpty>Aucun pays trouvé.</CommandEmpty>
                              <CommandGroup>
                                {COUNTRY_CODES.map((country) => (
                                  <CommandItem
                                    key={country.code}
                                    value={`${country.name} ${country.code}`}
                                    onSelect={() => {
                                      setFormData({ ...formData, countryCode: country.code })
                                      if (errors.phone) setErrors({ ...errors, phone: undefined })
                                      setCountryCodeOpen(false)
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        formData.countryCode === country.code ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    <span className="flex items-center gap-2">
                                      <span>{country.flag}</span>
                                      <span className="flex-1">{country.name}</span>
                                      <span className="text-muted-foreground">{country.code}</span>
                                    </span>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => {
                          updateField("phone", e.target.value)
                          if (errors.phone) setErrors({ ...errors, phone: undefined })
                        }}
                        placeholder={COUNTRY_CODES.find(c => c.code === formData.countryCode)?.format || "XX XXX XX XX"}
                        className={`flex-1 ${errors.phone ? "border-destructive" : ""}`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-destructive text-sm mt-1">{errors.phone}</p>
                    )}
                    {formData.phone && !errors.phone && (
                      <p className="text-muted-foreground text-xs mt-1">
                        Numéro complet: {formData.countryCode} {formData.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="address" className="text-base font-semibold flex items-center gap-2">
                      Adresse
                      {isPlacesLoaded && (
                        <Badge variant="secondary" className="text-xs gap-1">
                          <MapPin size={12} weight="fill" />
                          Auto
                        </Badge>
                      )}
                    </Label>
                    <div className="relative">
                      <Input
                        ref={addressInputRef}
                        id="address"
                        type="text"
                        value={formData.address}
                        onChange={(e) => updateField("address", e.target.value)}
                        placeholder={isPlacesLoaded ? "Commencez à taper une adresse..." : "Ville, Pays"}
                        className="mt-2"
                      />
                      {isPlacesLoaded && (
                        <MapPin 
                          size={20} 
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none mt-1" 
                          weight="duotone"
                        />
                      )}
                    </div>
                    {isPlacesLoaded && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Sélectionnez une suggestion ou tapez manuellement
                      </p>
                    )}
                  </div>

                  <Button
                    type="button"
                    onClick={handleNext}
                    size="lg"
                    className="w-full mt-6 text-lg"
                  >
                    Suivant
                  </Button>
                </motion.div>
              )}

              {currentStep === 1 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <div>
                    <Label className="text-base font-semibold">
                      Votre intérêt <span className="text-destructive">*</span>
                    </Label>
                    <div className="space-y-3 mt-3">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="consulting"
                          checked={formData.interests.includes("Consulting")}
                          onCheckedChange={() => {
                            toggleInterest("Consulting")
                            if (errors.interests) setErrors({ ...errors, interests: undefined })
                          }}
                        />
                        <label
                          htmlFor="consulting"
                          className="text-base cursor-pointer select-none"
                        >
                          Consulting
                        </label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="formation"
                          checked={formData.interests.includes("Formation")}
                          onCheckedChange={() => {
                            toggleInterest("Formation")
                            if (errors.interests) setErrors({ ...errors, interests: undefined })
                          }}
                        />
                        <label
                          htmlFor="formation"
                          className="text-base cursor-pointer select-none"
                        >
                          Formation
                        </label>
                      </div>
                    </div>
                    {errors.interests && (
                      <p className="text-destructive text-sm mt-2">{errors.interests}</p>
                    )}
                  </div>

                  <div className="space-y-3 pt-2">
                    <Button
                      type="button"
                      onClick={handleNext}
                      size="lg"
                      className="w-full text-lg"
                    >
                      Suivant
                    </Button>
                    <Button
                      type="button"
                      onClick={handlePrev}
                      variant="secondary"
                      size="lg"
                      className="w-full text-lg bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      Retour
                    </Button>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {showConsulting && (
                    <div>
                      <Label className="text-base font-semibold">
                        Services Consulting
                      </Label>
                      <div className="space-y-3 mt-3">
                        {[
                          "Audit financier",
                          "Conseil stratégique",
                          "Optimisation fiscale",
                          "Gestion de trésorerie",
                        ].map((service) => (
                          <div
                            key={service}
                            className="flex items-center space-x-3"
                          >
                            <Checkbox
                              id={service}
                              checked={formData.services.includes(service)}
                              onCheckedChange={() => toggleService(service)}
                            />
                            <label
                              htmlFor={service}
                              className="text-base cursor-pointer select-none"
                            >
                              {service}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {showFormation && (
                    <div>
                      <Label className="text-base font-semibold">
                        Modules Formation
                      </Label>
                      <div className="space-y-3 mt-3">
                        {[
                          "Comptabilité fondamentale",
                          "Analyse financière",
                          "Gestion financière",
                          "Stratégie & reporting",
                        ].map((module) => (
                          <div
                            key={module}
                            className="flex items-center space-x-3"
                          >
                            <Checkbox
                              id={module}
                              checked={formData.modules.includes(module)}
                              onCheckedChange={() => toggleModule(module)}
                            />
                            <label
                              htmlFor={module}
                              className="text-base cursor-pointer select-none"
                            >
                              {module}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {!showConsulting && !showFormation && (
                    <div className="text-center py-8 text-muted-foreground">
                      Veuillez sélectionner au moins un intérêt dans l'étape
                      précédente.
                    </div>
                  )}

                  <div className="space-y-3 pt-2">
                    <Button
                      type="button"
                      onClick={handleNext}
                      size="lg"
                      className="w-full text-lg"
                    >
                      Suivant
                    </Button>
                    <Button
                      type="button"
                      onClick={handlePrev}
                      variant="secondary"
                      size="lg"
                      className="w-full text-lg bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      Retour
                    </Button>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <div>
                    <Label
                      htmlFor="message"
                      className="text-base font-semibold"
                    >
                      Message (optionnel)
                    </Label>
                    <Textarea
                      id="message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => {
                        updateField("message", e.target.value)
                        if (errors.message) setErrors({ ...errors, message: undefined })
                      }}
                      className={`mt-2 ${errors.message ? "border-destructive" : ""}`}
                      placeholder="Décrivez brièvement vos besoins... (10-1000 caractères)"
                      maxLength={1000}
                    />
                    <div className="flex justify-between items-center mt-1">
                      {errors.message ? (
                        <p className="text-destructive text-sm">{errors.message}</p>
                      ) : (
                        <p className="text-muted-foreground text-sm">
                          {formData.message.length}/1000 caractères
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <Button
                      type="button"
                      onClick={handleNext}
                      size="lg"
                      className="w-full text-lg"
                    >
                      Suivant
                    </Button>
                    <Button
                      type="button"
                      onClick={handlePrev}
                      variant="secondary"
                      size="lg"
                      className="w-full text-lg bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      Retour
                    </Button>
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <div>
                    <Label className="text-base font-semibold">
                      Joindre des fichiers (optionnel)
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1 mb-3">
                      Vous pouvez joindre jusqu'à 5 fichiers (max. 10 Mo chacun)
                    </p>
                    
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer bg-muted/20">
                      <input
                        type="file"
                        id="file-upload"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt,.xlsx,.xls"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                          <UploadSimple size={32} weight="bold" className="text-primary" />
                        </div>
                        <div>
                          <p className="text-base font-semibold text-foreground">
                            Cliquez pour sélectionner des fichiers
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            PDF, Word, Images, etc.
                          </p>
                        </div>
                      </label>
                    </div>

                    {errors.attachments && (
                      <p className="text-destructive text-sm mt-2">{errors.attachments}</p>
                    )}

                    {formData.attachments.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <p className="text-sm font-semibold text-foreground">
                          Fichiers joints ({formData.attachments.length}/5)
                        </p>
                        {formData.attachments.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 bg-muted rounded-lg group hover:bg-muted/80 transition-colors"
                          >
                            <div className="flex-shrink-0">
                              {getFileIcon(file.name)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {file.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatFileSize(file.size)}
                              </p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                              className="flex-shrink-0 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash size={18} weight="bold" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 pt-2">
                    <Button
                      type="button"
                      onClick={handleNext}
                      size="lg"
                      className="w-full text-lg"
                    >
                      Suivant
                    </Button>
                    <Button
                      type="button"
                      onClick={handlePrev}
                      variant="secondary"
                      size="lg"
                      className="w-full text-lg bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      Retour
                    </Button>
                  </div>
                </motion.div>
              )}

              {currentStep === 5 && (
                <motion.div
                  key="step6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-primary mb-4">
                      Récapitulatif de votre demande
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Vérifiez vos informations avant l'envoi
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-foreground">Informations de contact</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditStep(0)}
                          className="h-8 gap-1"
                        >
                          <PencilSimple size={16} />
                          Modifier
                        </Button>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Nom:</span> {formData.name}</p>
                        <p><span className="font-medium">Email:</span> {formData.email}</p>
                        {formData.phone && <p><span className="font-medium">Téléphone:</span> {formData.countryCode} {formData.phone}</p>}
                        {formData.address && <p><span className="font-medium">Adresse:</span> {formData.address}</p>}
                      </div>
                    </div>

                    <div className="border-l-4 border-secondary pl-4 py-2">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-foreground">Intérêts</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditStep(1)}
                          className="h-8 gap-1"
                        >
                          <PencilSimple size={16} />
                          Modifier
                        </Button>
                      </div>
                      <div className="text-sm">
                        <p>{formData.interests.join(", ")}</p>
                      </div>
                    </div>

                    {(formData.services.length > 0 || formData.modules.length > 0) && (
                      <div className="border-l-4 border-accent pl-4 py-2">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-foreground">Services sélectionnés</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditStep(2)}
                            className="h-8 gap-1"
                          >
                            <PencilSimple size={16} />
                            Modifier
                          </Button>
                        </div>
                        <div className="text-sm space-y-1">
                          {formData.services.length > 0 && (
                            <p><span className="font-medium">Consulting:</span> {formData.services.join(", ")}</p>
                          )}
                          {formData.modules.length > 0 && (
                            <p><span className="font-medium">Formation:</span> {formData.modules.join(", ")}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {formData.message && (
                      <div className="border-l-4 border-muted pl-4 py-2">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-foreground">Message</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditStep(3)}
                            className="h-8 gap-1"
                          >
                            <PencilSimple size={16} />
                            Modifier
                          </Button>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{formData.message}</p>
                      </div>
                    )}

                    {formData.attachments.length > 0 && (
                      <div className="border-l-4 border-secondary pl-4 py-2">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-foreground">Fichiers joints</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditStep(4)}
                            className="h-8 gap-1"
                          >
                            <PencilSimple size={16} />
                            Modifier
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {formData.attachments.map((file, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <div className="flex-shrink-0">
                                {getFileIcon(file.name)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="truncate">{file.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {formatFileSize(file.size)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {apiError && (
                    <Alert variant="destructive">
                      <Warning className="h-4 w-4" />
                      <AlertDescription>{apiError}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-3 pt-2">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full text-lg"
                      disabled={submissionState === "submitting"}
                    >
                      {submissionState === "submitting" ? "Envoi en cours..." : "Confirmer et envoyer"}
                    </Button>
                    <Button
                      type="button"
                      onClick={handlePrev}
                      variant="secondary"
                      size="lg"
                      className="w-full text-lg bg-accent text-accent-foreground hover:bg-accent/90"
                      disabled={submissionState === "submitting"}
                    >
                      Retour
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
          </div>
        </Card>
      </div>
      <Footer />
      <FloatingContactButton />
    </div>
  )
}

export default App