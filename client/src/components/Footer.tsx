import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[auto_auto_auto_auto] md:justify-between">
          <div className="space-y-2 md:-mt-5">
            <div className="flex items-center">
              <img src={logo} alt="PurePixels" className="h-10 w-auto" />
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <span className="block">Fast</span>
              <span className="block">Accurate</span>
              <span className="block">Affordable</span>
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm text-foreground mb-3">Product</h4>
            <div className="space-y-2">
              <Link to="/dashboard" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
              <Link to="/pricing" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
              <Link to="/api-docs" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">API</Link>
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm text-foreground mb-3">Use Cases</h4>
            <div className="space-y-2">
              <span className="block text-sm text-muted-foreground">E-commerce</span>
              <span className="block text-sm text-muted-foreground">Social Media</span>
              <span className="block text-sm text-muted-foreground">Marketing</span>
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm text-foreground mb-3">Legal</h4>
            <div className="space-y-2">
              <span className="block text-sm text-muted-foreground">Privacy Policy</span>
              <span className="block text-sm text-muted-foreground">Terms of Service</span>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-y-3 border-t border-border pt-8 text-center text-sm text-muted-foreground md:grid-cols-4">
          <span className="md:col-span-2">
            &copy; {new Date().getFullYear()} PurePixels. All rights reserved.
          </span>
          <span className="md:col-span-2">
            Developed by{" "}
            <a
              href="https://github.com/parinith-web"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-pixel hover:text-pixel-dark transition-colors"
            >
              Parinith
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
