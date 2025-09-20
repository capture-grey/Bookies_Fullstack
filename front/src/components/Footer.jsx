// src/components/Footer.jsx
import { Github, Mail, SquareArrowOutUpRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-white shadow-md border-t border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col items-center gap-4 text-gray-700 text-sm">
        {/* Github */}
        <a
          href="https://github.com/capture-grey/Bookies_Fullstack"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-green-500 transition-colors"
        >
          <Github className="w-4 h-4" />
          <span className="font-semibold">Find this project on GitHub</span>
        </a>

        {/* Email */}
        <a
          href="mailto:capturegrey@gmail.com"
          className="flex items-center gap-2 hover:text-blue-600 transition-colors"
        >
          <Mail className="w-4 h-4" />
          <span>
            <b>Feedback:</b> capturegrey@gmail.com
          </span>
        </a>

        {/* Ongoing UI */}
        <a
          href="https://bookies-with-api.vercel.app/"
          className="flex items-center gap-2 hover:text-purple-600 transition-colors"
        >
          <SquareArrowOutUpRight className="w-4 h-4" />
          <span>
            An ongoing work on <b>New UI !</b>
          </span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
