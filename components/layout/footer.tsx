import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-primary">The Perfect Lie</h3>
            <p className="text-sm text-muted-foreground">
              Your hub for the GSPro golf simulator community.
            </p>
            <p className="text-xs text-muted-foreground">
              Built with ⛳ for the GSPro community
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Browse</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/courses"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Course Directory
                </Link>
              </li>
              <li>
                <Link
                  href="/flyovers"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Video Flyovers
                </Link>
              </li>
              <li>
                <Link
                  href="/resources"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Community</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://pakmanstudios.com/gspro-course-list/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Pakman Studios
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/@EaglesAndBirdies"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Eagles & Birdies
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">About</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/culturata/the-perfect-lie"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} The Perfect Lie. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
