import Link from "next/link";
import { Button } from "@/components/ui";
import { NOT_FOUND_CONTENT as CONTENT } from "@/data";

const NotFoundPage = () => {
  return (
    <section>
      <div className="bg-linear-to-r from-purple-300 to-blue-200">
        <div className="m-auto flex min-h-screen w-9/12 items-center justify-center py-16">
          <div className="overflow-hidden bg-white pb-8 shadow sm:rounded-lg">
            <div className="border-t border-gray-200 pt-8 text-center">
              <h1 className="text-9xl font-bold text-purple-400">{CONTENT.code}</h1>
              <h1 className="py-8 text-6xl font-medium">{CONTENT.title}</h1>
              <p className="px-12 pb-8 text-2xl font-medium">{CONTENT.description}</p>

              {CONTENT.actions.map((action) =>
                action.external ? (
                  <a
                    key={action.label}
                    href={action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button>{action.label}</Button>
                  </a>
                ) : (
                  <Link key={action.label} href={action.href} className="mr-6">
                    <Button>{action.label}</Button>
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;
