import type { RichTextField, SliceZone } from '@prismicio/types';
import type { DribbbleSliderProps } from '../slices/DribbbleSlider';
import parseDribbbleShots from './dribbble';
import screenshots from './screenshots';

const hydrateSlices = async (slices: SliceZone): Promise<SliceZone> => {
  const newSlices = await Promise.all(
    slices.map(async (slice) => {
      if (slice.slice_type === 'dribbble_slider') {
        const newSlice = { ...slice };

        newSlice.items = await parseDribbbleShots(
          slice.items as DribbbleSliderProps['items']
        );

        return newSlice;
      }

      if (slice.slice_type === 'rich_text') {
        await screenshots(slice.primary.content as RichTextField);
      }

      return slice;
    })
  );

  return newSlices as SliceZone;
};

export default hydrateSlices;
