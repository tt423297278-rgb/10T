import { heroGroupPortrait as currentHeroGroupPortrait } from './imageSources'

export const heroGroupPortrait = {
  desktopSrc: currentHeroGroupPortrait.desktopSrc,
  tabletSrc: currentHeroGroupPortrait.desktopSrc,
  mobileSrc: currentHeroGroupPortrait.mobileSrc,
  lowQualitySrc: currentHeroGroupPortrait.mobileSrc,
  alt: currentHeroGroupPortrait.alt,
  source: currentHeroGroupPortrait.sourceLabel,
  focalPoint: currentHeroGroupPortrait.objectPosition ?? 'center center',
  copyrightNote: currentHeroGroupPortrait.copyrightNote,
}
