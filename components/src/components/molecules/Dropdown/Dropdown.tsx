import * as React from 'react'

import * as styles from './styles.css'

import { Box, BoxProps } from '../..'

export type DropdownItem = {
  label: string
  onClick(): void
  color?: BoxProps['color']
  disabled?: boolean
}

export type BaseProps = {
  items: DropdownItem[]
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  children: React.ReactNode
  inner?: boolean
}

type DropdownMenuProps = {
  items: DropdownItem[]
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  width?: string
  inner: boolean
}

const DropdownMenu = ({
  items,
  setIsOpen,
  isOpen,
  width,
  inner,
}: DropdownMenuProps) => (
  <Box
    className={styles.variants({ opened: isOpen, inner })}
    style={{
      width:
        width && parseInt(width) > 100
          ? inner
            ? `${parseInt(width) + 0}px`
            : width
          : '150px',
    }}
  >
    {items.map(({ label, color, disabled, onClick }: DropdownItem) => (
      <Box
        as="button"
        className={styles.menuButton({ inner, hasColor: !!color })}
        color={color}
        disabled={disabled}
        key={label}
        onClick={() => Promise.resolve(setIsOpen(false)).then(onClick)}
      >
        {label}
      </Box>
    ))}
  </Box>
)

export const Dropdown = ({
  items,
  isOpen,
  setIsOpen,
  children,
  inner = false,
}: BaseProps) => {
  const dropdownRef = React.useRef<any>()

  const handleClickOutside = (e: any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false)
    }
  }

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dropdownRef, isOpen])

  return (
    <Box maxWidth="max" position="relative" ref={dropdownRef}>
      {children}
      <DropdownMenu
        inner={inner}
        isOpen={isOpen}
        items={items}
        setIsOpen={setIsOpen}
        width={dropdownRef.current && dropdownRef.current.offsetWidth}
      />
    </Box>
  )
}

Dropdown.displayName = 'Dropdown'
