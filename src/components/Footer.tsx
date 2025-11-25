import { Phone, Envelope, MapPin, WhatsappLogo, FacebookLogo, LinkedinLogo, InstagramLogo } from "@phosphor-icons/react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card border-t border-border mt-12">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">FinancePro</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Consulting • Formation • Accompagnement professionnel
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">Contact</h3>
            <div className="space-y-3">
              <a
                href="tel:+221764644290"
                className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors group"
              >
                <Phone size={18} weight="bold" className="text-primary group-hover:scale-110 transition-transform" />
                <span>+221 76 464 42 90</span>
              </a>
              <a
                href="https://wa.me/221764644290"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors group"
              >
                <WhatsappLogo size={18} weight="bold" className="text-primary group-hover:scale-110 transition-transform" />
                <span>WhatsApp</span>
              </a>
              <a
                href="mailto:financeprofirst@gmail.com"
                className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors group"
              >
                <Envelope size={18} weight="bold" className="text-primary group-hover:scale-110 transition-transform" />
                <span>financeprofirst@gmail.com</span>
              </a>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin size={18} weight="bold" className="text-primary" />
                <span>Touba Khayra, Sénégal</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">Suivez-nous</h3>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <FacebookLogo size={20} weight="bold" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn"
              >
                <LinkedinLogo size={20} weight="bold" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <InstagramLogo size={20} weight="bold" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} FinancePro. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}
