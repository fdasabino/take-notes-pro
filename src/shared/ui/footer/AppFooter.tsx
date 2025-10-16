import { CiMail } from "react-icons/ci";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaGlobe, FaHeart } from "react-icons/fa";

const AppFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-10 w-full bg-background border-t border-muted/20">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="flex items-center flex-col md:flex-row gap-1 text-foreground/80">
            <span className="flex items-center gap-1">
              © {currentYear} Take Notes Pro. Made with{" "}
              <FaHeart className="h-4 w-4 text-red-500 fill-red-500" />
            </span>
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="mailto:fdasabino@gmail.com"
              className="text-foreground/80 hover:text-active transition-colors"
              aria-label="Email">
              <CiMail className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/francisco-sabino/"
              className="text-foreground/80 hover:text-active transition-colors"
              aria-label="LinkedIn">
              <FaLinkedin className="h-5 w-5" />
            </a>
            <a
              href="https://github.com/fdasabino"
              className="text-foreground/80 hover:text-active transition-colors"
              aria-label="GitHub">
              <FaGithub className="h-5 w-5" />
            </a>
            <a
              href="https://franciscosabino.vercel.app"
              className="text-foreground/80 hover:text-active transition-colors"
              aria-label="Website">
              <FaGlobe className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
