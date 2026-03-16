import { BannerCarousel } from "@/components/BannerCarousel";
import { Carousel } from "@/components/Carousel";
import { TourSearchBoxHorizontal } from "@/components/leftPanelSearch";
import { BASEURL } from "@/lib2/config";

export async function CarouselHero() {
  const response = await fetch(
    `${BASEURL}/api/destinations?limit=100&depth=1&sort=createdAt`,
  );
  const data = await response.json();
  return (
    <div className="relative w-full">
      <Carousel>
        {data.docs.map(
          (item: {
            id: number;
            name: string;
            carouselItemDestination?: { url?: string | null } | null;
          }) => {
            if (!item.carouselItemDestination) {
              return (
                <BannerCarousel
                  key={item.id}
                  title={item.name}
                  backgroundUrl={"/placeholder.svg"}
                  alt={"aoe"}
                />
              );
            }

            return (
              <BannerCarousel
                key={item.id}
                title={item.name}
                backgroundUrl={
                  item.carouselItemDestination.url || "/placeholder.svg"
                }
                alt={"aoe"}
              />
            );
          },
        )}
      </Carousel>
      <div className="absolute bottom-20 w-full flex justify-center">
        <TourSearchBoxHorizontal />
      </div>
      <div className="h-4 w-full grid grid-cols-4 relative">
        <div className="bg-blue-600"></div>
        <div className="bg-[#3eae64]"></div>
        <div className="bg-yellow-500"></div>
        <div className="bg-purple-600"></div>
      </div>
    </div>
  );
}
