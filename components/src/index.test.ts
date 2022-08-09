import * as Exports from './'

const exportedKeys = Object.keys(Exports)

const expectedExportedKeys = [
  'mq',
  'tokens',
  'baseTheme',
  'lightTheme',
  'darkTheme',
  'Components',
  // atoms
  'Avatar',
  'BackdropSurface',
  'Button',
  'Card',
  'DynamicPopover',
  'Field',
  'FileInput',
  'Heading',
  'Portal',
  'ScrollBox',
  'Skeleton',
  'Spinner',
  'Tag',
  'ThorinGlobalStyles',
  'Typography',
  'VisuallyHidden',
  // molecules
  'Backdrop',
  'Checkbox',
  'CountdownCircle',
  'Dropdown',
  'FieldSet',
  'Helper',
  'Input',
  'Modal',
  'Profile',
  'PageButtons',
  'RadioButton',
  'RadioButtonGroup',
  'Select',
  'SkeletonGroup',
  'Slider',
  'Textarea',
  'Tooltip',
  // organisms
  'Dialog',
  'Toast',
  'ChevronLeftSVG',
  'AlertSVG',
  'ArrowCircleSVG',
  'ArrowRightSVG',
  'ArrowUpSVG',
  'BookOpenSVG',
  'CancelCircleSVG',
  'CheckSVG',
  'ChevronDownSVG',
  'ChevronRightSVG',
  'ChevronUpSVG',
  'CloseSVG',
  'CodeSVG',
  'CogSVG',
  'CollectionSVG',
  'CopySVG',
  'DocumentsSVG',
  'DotsVerticalSVG',
  'DownIndicatorSVG',
  'DuplicateSVG',
  'EthSVG',
  'EthTransparentSVG',
  'EthTransparentInvertedSVG',
  'ExclamationSVG',
  'ExitSVG',
  'FlagSVG',
  'GradientSVG',
  'GridSVG',
  'GridSolidSVG',
  'HandSVG',
  'InfoSVG',
  'LinkSVG',
  'ListSVG',
  'LockClosedSVG',
  'LogoSVG',
  'MenuSVG',
  'MoonSVG',
  'PencilSVG',
  'PlusSVG',
  'PlusSmallSVG',
  'RefreshSVG',
  'SearchSVG',
  'SplitSVG',
  'SunSVG',
  'TokensSVG',
  'TrendingUpSVG',
  'UploadSVG',
  'UserSolidSVG',
  'UsersSolidSVG',
  'WalletSVG',
]

it('should expose correct exports', () => {
  expect(exportedKeys.sort()).toEqual(expectedExportedKeys.sort())
})
