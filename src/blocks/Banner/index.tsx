import type { BannerBlock as BannerBlockType, Media } from '@/cms-types';
import Banner from '@/components/Banner';

interface Props extends BannerBlockType{
}

export function BannerBlock(props: Props) {
  const { title, image } = props;
  return <Banner title={title || " "} backgroundUrl={(image as Media).url || '/placeholder.svg'} />;
} 