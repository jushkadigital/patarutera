import { Media, TxtIconContentBlockType } from "@/cms-types";
import PayloadImage from "@/components/PayloadImage";
import RichText from "@/components/RichText";
import { Subtitle } from "@/components/Subtitle";
import { cn } from "@/lib2/utils";

interface Props extends TxtIconContentBlockType {
  context?: {
    nameCollection: string;
  } | null;
}

export async function TextIconContentBlock(props: Props) {
  const { iconImage, blockTitle, description, descriptionAlignment } = props;
  const classessDescription = cn(`text-${descriptionAlignment}`, `py-0!`);
  const iconMedia =
    iconImage && typeof iconImage === "object" ? (iconImage as Media) : null;

  return (
    <div className="mt-10">
      <div className="flex justify-center">
        {iconMedia ? (
          <div className="relative h-[30px] w-[30px]">
            <PayloadImage media={iconMedia} fill className="object-contain" />
          </div>
        ) : (
          <div className="h-[30px] w-[30px]" aria-hidden="true" />
        )}
      </div>
      <Subtitle titleGroup={blockTitle} className="pb-1!" />
      <div>
        <RichText data={description} className={classessDescription} />
      </div>
    </div>
  );
}
