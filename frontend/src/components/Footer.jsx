import { Link } from "react-router-dom";
export const Footer = () => {
  return (
    <footer className="relative z-20 bg-[#02303f] text-white px-6 pt-12 pb-4 mt-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <div className="flex items-center gap-2 mb-2 ml-[-12px]">
            <img src="/Logo.png" alt="Materna logo" className="w-15 h-15 object-contain" />
            <h2 className="text-xl font-semibold">Materna</h2>
          </div>
          <p className="text-sm text-white/80 max-w-xs mb-4">
            Built to support mothers, not overlook them.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" aria-label="Instagram">
              {/* Instagram icon (Lucide/other) */}
              <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24">
                <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5zm5 1.25a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
              </svg>
            </a>
            <a href="#" aria-label="LinkedIn">
              {/* LinkedIn icon (more open, centered "in" glyph) */}
              <svg className="w-10 h-10 fill-white" viewBox="0 0 32 32">
                <path d="M8 12h4v12H8zm2-6a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm6 6h3.6v1.8h.05c.5-.95 1.8-1.8 3.4-1.8 3.6 0 4.4 2.4 4.4 5.5V24h-4v-5.6c0-1.4 0-3.4-2.2-3.4s-2.5 1.6-2.5 3.3V24h-4V12z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="flex gap-16">
          <div>
            <h3 className="font-semibold mb-2">Site Map</h3>
            <ul className="space-y-1 text-sm text-white/90">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/journal">Symptom Tracker</Link></li>
              <li><Link to="/normal">Emergency Symptom Help</Link></li>
              <li><Link to="/wellness">Wellness Hub</Link></li>
              <li><Link to="/community">Community Forum</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Legal</h3>
            <ul className="space-y-1 text-sm text-white/90">
              <li><Link to="/privacy">Privacy policy</Link></li>
              <li><Link to="/terms">Terms of services</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center py-2 text-sm text-[#e1a9a0]">
        &copy; {new Date().getFullYear()}, Materna. All rights reserved.
      </div>
    </footer>
  );
};
