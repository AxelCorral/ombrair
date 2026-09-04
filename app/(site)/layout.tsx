import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Header />
      <div className="flex flex-1 flex-col">{children}</div>
      <Footer />
    </>
  );
}
