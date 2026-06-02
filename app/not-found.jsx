import Link from "next/link";
import { Button } from "./components/shared";
const NotFoundPage = () => {
  return (
    <section>
      <div className="bg-linear-to-r from-purple-300 to-blue-200">
        <div className="m-auto flex min-h-screen w-9/12 items-center justify-center py-16">
          <div className="overflow-hidden bg-white pb-8 shadow sm:rounded-lg">
            <div className="border-t border-gray-200 pt-8 text-center">
              <h1 className="text-9xl font-bold text-purple-400">404</h1>
              <h1 className="py-8 text-6xl font-medium">
                oops! Page not found
              </h1>
              <p className="px-12 pb-8 text-2xl font-medium">
                Oops! The page you are looking for does not exist. It might have
                been moved or deleted.
              </p>
              <Link href="/" className="mr-6">
                <Button>HOME</Button>
              </Link>
              <a
                href="https://calendly.com/yafoundations/45min"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button>Book Consultation</Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;
