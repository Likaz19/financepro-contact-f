import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Phone, WhatsappLogo, X } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"

export function FloatingContactButton() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex flex-col gap-3 mb-3"
          >
            <motion.a
              href="tel:+221764644290"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 bg-primary text-primary-foreground px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-shadow group"
            >
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center group-hover:bg-primary-foreground/30 transition-colors">
                <Phone size={20} weight="bold" />
              </div>
              <span className="font-semibold text-sm whitespace-nowrap">Appeler maintenant</span>
            </motion.a>

            <motion.a
              href="https://wa.me/221764644290"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 bg-[#25D366] text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-shadow group"
            >
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <WhatsappLogo size={20} weight="bold" />
              </div>
              <span className="font-semibold text-sm whitespace-nowrap">WhatsApp</span>
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={toggleMenu}
          size="lg"
          className="w-16 h-16 rounded-full shadow-2xl hover:shadow-xl transition-all duration-300 p-0"
          aria-label={isOpen ? "Fermer le menu de contact" : "Ouvrir le menu de contact"}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={28} weight="bold" />
              </motion.div>
            ) : (
              <motion.div
                key="phone"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Phone size={28} weight="bold" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>
    </div>
  )
}
