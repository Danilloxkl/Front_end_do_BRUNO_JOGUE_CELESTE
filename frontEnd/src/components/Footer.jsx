export default function Footer() {
  return (
    <footer className="site-footer footer-rich">
      <div className="footer-top">
        <div className="footer-brand-block">
          <div>
            <span className="footer-brand">HabitRecorderr</span>
            <p className="footer-description">
              Seu espaço para acompanhar hábitos, progresso e rotina com mais
              clareza.
            </p>
          </div>

          <div className="footer-socials" aria-label="Redes sociais">
            <a href="#" className="footer-social-link" aria-label="Facebook">
              <i className="pi pi-facebook" />
            </a>
            <a href="#" className="footer-social-link" aria-label="Instagram">
              <i className="pi pi-instagram" />
            </a>
            <a href="#" className="footer-social-link" aria-label="Twitter">
              <i className="pi pi-twitter" />
            </a>
          </div>
        </div>

        <div className="footer-links-block">
          <h4>Links Rápidos</h4>
          <div className="footer-links">
            <a href="#" className="footer-link">
              Sobre Nós
            </a>
            <a href="#" className="footer-link">
              Termos de Serviço
            </a>
            <a href="#" className="footer-link">
              Política de Privacidade
            </a>
          </div>
        </div>
      </div>

      <div className="footer-divider" />

      <div className="footer-bottom">
        <div className="footer-status">
          <i className="pi pi-info-circle" />
          <span>Protótipo MVP :D</span>
        </div>

        <div className="footer-actions">
          <a
            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            target="_blank"
            rel="noopener noreferrer"
            className="secondary-button footer-contact"
          >
            <i className="pi pi-envelope" />
            <span>Nosso Contato</span>
          </a>

          <button
            type="button"
            className="text-link footer-top-link"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <i className="pi pi-arrow-up" />
            <span>Voltar ao Topo</span>
          </button>
        </div>
      </div>

      <div className="footer-copy">
        © {new Date().getFullYear()} HabitRecorderr. Todos os direitos
        reservados.
      </div>
    </footer>
  )
}
