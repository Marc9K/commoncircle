export const useRouter = () => ({
  push: (href: string) => {
    console.log("Navigation push:", href);
  },
  replace: (href: string) => {
    console.log("Navigation replace:", href);
  },
  back: () => {
    console.log("Navigation back");
  },
  forward: () => {
    console.log("Navigation forward");
  },
  refresh: () => {
    console.log("Navigation refresh");
  },
});

export const useParams = () => ({});

export const usePathname = () => "/";

export const useSearchParams = () => new URLSearchParams();
