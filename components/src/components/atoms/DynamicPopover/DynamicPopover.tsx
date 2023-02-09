import * as React from 'react'
import styled, { css } from 'styled-components'
import { createPortal } from 'react-dom'
import { TransitionState, useTransition } from 'react-transition-state'

import { mq } from '@/src/utils/responsiveHelpers'

export type DynamicPopoverSide = 'top' | 'right' | 'bottom' | 'left'

export type DynamicPopoverAlignment = 'start' | 'center' | 'end'

const ANIMATION_DURATION = 350

export type DynamicPopoverAnimationFunc = (
  horizonalClearance: number,
  verticalClearance: number,
  side: DynamicPopoverSide,
  mobileSide: DynamicPopoverSide,
) => { translate: string; mobileTranslate: string }

export type DynamicPopoverButtonProps = {
  pressed?: boolean
  onClick?: React.MouseEventHandler<HTMLElement>
}

export interface DynamicPopoverProps {
  /** A react node that has includes the styling and content of the popover */
  popover: React.ReactNode
  /** The side and alignment of the popover in relation to the target */
  placement?: DynamicPopoverSide
  /** The side and alignment of the popover in relation to the target on mobile screen sizes */
  mobilePlacement?: DynamicPopoverSide
  /** A function that returns string of the css state for open and closed popover */
  animationFn?: DynamicPopoverAnimationFunc
  /** A React reference to the tooltip element */
  tooltipRef?: React.RefObject<HTMLDivElement>
  /** The id of the target element the tooltip will emerge from */
  targetId: string
  /** Function that will be called when the DynamicPopover is shown */
  onShowCallback?: () => void
  /** Width of the DynamicPopover*/
  width?: number
  /** Width of the DynamicPopover on mobile*/
  mobileWidth?: number
  /** Dynamic popover will switch sides if there is not enough room*/
  useIdealSide?: boolean
  /** Add to the default gap between the popover and its target */
  additionalGap?: number
}

/**
 * @desc Calculates the amount of space available at each of the different sides and returns the side that has space
 */
const computeIdealSide = (
  side: DynamicPopoverSide,
  referenceRect: DOMRect,
  floatingRect: DOMRect,
  padding: number,
  offset: number,
): DynamicPopoverSide => {
  const top = referenceRect.top - floatingRect.height - padding - offset
  const left = referenceRect.left - floatingRect.width - padding - offset
  const right =
    window.innerWidth -
    referenceRect.left -
    referenceRect.width -
    floatingRect.width -
    padding -
    offset
  const bottom =
    window.innerHeight -
    referenceRect.top -
    referenceRect.height -
    floatingRect.height -
    padding -
    offset

  if (side === 'top' && top < 0 && bottom > top) return 'bottom'
  if (side === 'right' && right < 0 && left > right) return 'left'
  if (side === 'bottom' && bottom < 0 && top > bottom) return 'top'
  if (side === 'left' && left < 0 && right > left) return 'right'
  return side
}

/**
 * @desc default function for computing the animation keyframes based on the side
 */
const defaultAnimationFunc: DynamicPopoverAnimationFunc = (
  horizontalClearance: number,
  verticalClearance: number,
  side: string,
  mobileSide: string,
) => {
  let translate = ''
  if (side === 'top') translate = `translate(0, -${verticalClearance}px)`
  else if (side === 'right')
    translate = `translate(${horizontalClearance * -1 + 10}px, 0)`
  else if (side === 'bottom') translate = `translate(0, ${verticalClearance}px)`
  else translate = `translate(${horizontalClearance - 10}px, 0);`

  let mobileTranslate = ''
  if (mobileSide === 'top')
    mobileTranslate = `translate(0, -${verticalClearance}px)`
  else if (mobileSide === 'right')
    mobileTranslate = `translate(${horizontalClearance * -1 + 10}px, 0)`
  else if (mobileSide === 'bottom')
    mobileTranslate = `translate(0, ${verticalClearance}px)`
  else mobileTranslate = `translate(${horizontalClearance - 10}px, 0);`

  return { translate, mobileTranslate }
}

const PopoverContainer = styled.div<{
  $state: TransitionState
  $translate: string
  $mobileTranslate: string
  $width: number
  $mobileWidth: number
  $x: number
  $y: number
}>(({ $state, $translate, $mobileTranslate, $width, $mobileWidth, $x, $y }) => [
  css`
    /* stylelint-disable */
    -webkit-backface-visibility: hidden;
    -moz-backface-visibility: hidden;
    -webkit-transform: translate3d(0, 0, 0);
    -moz-transform: translate3d(0, 0, 0);
    /* stylelint-enable */

    /* Default state is unmounted */
    display: block;
    box-sizing: border-box;
    visibility: hidden;
    position: absolute;
    z-index: 20;
    width: ${$mobileWidth}px;
    transform: translate3d(0, 0, 0) ${$mobileTranslate};
    transition: none;
    opacity: 0;
    transition-duration: 0;
    pointer-events: none;
    top: 0;
    left: 0;

    ${$state === 'preEnter' &&
    css`
      display: block;
      visibility: visible;
      top: ${$y}px;
      left: ${$x}px;
    `}

    ${$state === 'entering' &&
    css`
      display: block;
      visibility: visible;
      opacity: 1;
      transition: opacity ${ANIMATION_DURATION}ms ease-in-out;
      top: ${$y}px;
      left: ${$x}px;
    `}

      ${$state === 'entered' &&
    css`
      display: block;
      visibility: visible;
      opacity: 1;
      transition: opacity ${ANIMATION_DURATION}ms ease-in-out;
      top: ${$y}px;
      left: ${$x}px;
    `}

      ${$state === 'exiting' &&
    css`
      display: block;
      visibility: visible;
      opacity: 0;
      transition: all ${ANIMATION_DURATION}ms ease-in-out;
      top: ${$y}px;
      left: ${$x}px;
    `}
  `,
  mq.md.min(css`
    width: ${$width}px;
    transform: translate(0, 0, 0) ${$translate};
  `),
])

export const DynamicPopover = ({
  popover,
  placement = 'top',
  mobilePlacement = 'top',
  animationFn: _animationFn,
  tooltipRef,
  targetId,
  onShowCallback,
  width = 250,
  mobileWidth = 150,
  useIdealSide = false,
  additionalGap = 0,
}: DynamicPopoverProps) => {
  const popoverContainerRef = React.useRef<HTMLDivElement>(null)

  const [positionState, setPositionState] = React.useState<{
    top: number
    left: number
    horizontalClearance: number
    verticalClearance: number
    idealPlacement: 'top' | 'right' | 'bottom' | 'left'
    idealMobilePlacement: 'top' | 'right' | 'bottom' | 'left'
  }>({
    top: 100,
    left: 100,
    horizontalClearance: 100,
    verticalClearance: 100,
    idealPlacement: placement,
    idealMobilePlacement: mobilePlacement,
  })

  const setPosition = React.useCallback(() => {
    const targetElement = document.getElementById(targetId)
    const targetRect = targetElement?.getBoundingClientRect()
    const popoverElement = popoverContainerRef?.current
    const popoverRect = popoverElement?.getBoundingClientRect()

    if (!popoverRect || !targetRect) {
      return
    }

    const top =
      window.scrollY +
      targetRect.y +
      targetRect.height / 2 -
      popoverRect.height / 2
    const left = targetRect.x + targetRect.width / 2 - popoverRect.width / 2
    const horizontalClearance =
      -popoverRect.width + (targetRect.left - left) - additionalGap
    const verticalClearance = popoverRect.height + additionalGap

    const idealPlacement = computeIdealSide(
      placement,
      targetRect,
      popoverRect,
      0,
      0,
    )

    const idealMobilePlacement = computeIdealSide(
      mobilePlacement,
      targetRect,
      popoverRect,
      0,
      0,
    )

    setPositionState({
      top,
      left,
      horizontalClearance,
      verticalClearance,
      idealPlacement,
      idealMobilePlacement,
    })
  }, [targetId, placement, mobilePlacement, additionalGap])

  const animationFn = React.useMemo(() => {
    if (_animationFn) {
      return (
        horizontalClearance: number,
        verticalClearance: number,
        side: DynamicPopoverSide,
        mobileSide: DynamicPopoverSide,
      ) =>
        _animationFn(horizontalClearance, verticalClearance, side, mobileSide)
    }
    return (
      horizontalClearance: number,
      verticalClearance: number,
      side: DynamicPopoverSide,
      mobileSide: DynamicPopoverSide,
    ) =>
      defaultAnimationFunc(
        horizontalClearance,
        verticalClearance,
        side,
        mobileSide,
      )
  }, [_animationFn])

  React.useEffect(() => {
    const targetElement = document.getElementById(targetId)

    setPosition()

    const handleMouseenter = () => {
      toggle(true)
    }

    const handleMouseleave = () => {
      toggle(false)
    }

    const handleResize = () => {
      setPosition()
    }

    targetElement?.addEventListener('mouseenter', handleMouseenter)
    targetElement?.addEventListener('mouseleave', handleMouseleave)
    addEventListener('resize', handleResize)

    return () => {
      targetElement?.removeEventListener('mouseenter', handleMouseenter)
      targetElement?.removeEventListener('mouseleave', handleMouseleave)
      removeEventListener('resize', handleResize)
    }
  }, [
    setPosition,
    additionalGap,
    mobilePlacement,
    onShowCallback,
    placement,
    targetId,
    tooltipRef,
  ])

  const [state, toggle] = useTransition({
    preEnter: true,
    exit: true,
    mountOnEnter: true,
    unmountOnExit: true,
    timeout: {
      enter: ANIMATION_DURATION,
      exit: ANIMATION_DURATION,
    },
  })

  const { translate, mobileTranslate } = animationFn(
    positionState.horizontalClearance,
    positionState.verticalClearance,
    useIdealSide ? positionState.idealPlacement : placement,
    useIdealSide ? positionState.idealMobilePlacement : mobilePlacement,
  )

  return createPortal(
    <PopoverContainer
      $mobileTranslate={mobileTranslate}
      $mobileWidth={mobileWidth}
      $state={state}
      $translate={translate}
      $width={width}
      $x={positionState.left}
      $y={positionState.top}
      data-testid="popoverContainer"
      id="popoverContainer"
      ref={popoverContainerRef}
    >
      {popover}
    </PopoverContainer>,
    document?.body,
  )
}

DynamicPopover.displayName = 'DynamicPopover'
