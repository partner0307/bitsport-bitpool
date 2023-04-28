import { Lock } from "@/public/icons";
import Link from "next/link";
import { useRouter } from "next/router";

const items = [
  { title: "Terms of User", url: "/terms" },
  { title: "Privacy", url: "/privacy" },
  { title: "Disclaimer", url: "/disclaimer" },
];

const Footer = () => {
  const router = useRouter();
  const isNftRoute = router.route.includes("/nft");
  return (
    <>
      <footer
        key={0}
        className="hidden mt-56 py-6 container mx-auto lg:flex lg:justify-between lg:items-center border-t border-primary-600"
      >
        <div className="font-Poppins text-primary-650 text-xl">
          BitPool @ 2023 By BitSport
        </div>
        <div className="flex items-center gap-8">
          {items.map((item) => (
            <Link
              key={item.title}
              href={item.url}
              className="font-Poppins text-primary-650 text-lg"
            >
              {item.title}
            </Link>
          ))}
        </div>
      </footer>

      <footer
        key={1}
        className={`lg:hidden flex justify-center ${
          isNftRoute ? "mt-80" : "mt-20"
        }`}
      >
        <Lock />
      </footer>
    </>
  );
};

export default Footer;
