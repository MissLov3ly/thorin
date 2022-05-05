import * as React from 'react'
import styled from 'styled-components'

import { Modal, Typography } from '../..'

import { Props as CardProps } from '../../atoms/Card/Card'
import { tokens } from '@/src/tokens'

const Title = styled(Typography)`
  font-size: ${tokens.fontSizes['headingTwo']};
  font-weight: ${tokens.fontWeights['bold']};
`

const SubTitle = styled(Typography)`
  font-size: ${tokens.fontSizes['headingThree']};
  font-weight: ${tokens.fontWeights['normal']};
`

const Container = styled.div<{ $center?: boolean }>`
  ${({ $center }) => `
    flex-direction: ${$center ? 'column' : 'row'};
    gap: ${tokens.space['2']};
  `}
  display: flex;
  align-items: center;
  justify-content: space-between;
`

type Props = {
  title?: string | React.ReactNode
  subtitle?: string | React.ReactNode
  trailing?: React.ReactNode
  leading?: React.ReactNode
  center?: boolean
  children: React.ReactNode
  backdropSurface?: React.ElementType
  onDismiss?: () => void
  open: boolean
} & CardProps

export const Dialog = ({
  title,
  subtitle,
  trailing,
  leading,
  center,
  children,
  ...cardProps
}: Props) => (
  <Modal {...cardProps}>
    <div style={{ minWidth: 64 }}>
      <div style={{ marginBottom: 4 }}>
        {title &&
          ((typeof title !== 'string' && title) || <Title>{title}</Title>)}
        {subtitle &&
          ((typeof subtitle !== 'string' && subtitle) || (
            <SubTitle>{subtitle}</SubTitle>
          ))}
      </div>
      {children}
      {(leading || trailing) && (
        <div style={{ marginTop: 4 }}>
          <Container {...{ $center: center }}>
            {leading || (!center && <div style={{ flexGrow: 1 }} />)}
            {trailing || (!center && <div style={{ flexGrow: 1 }} />)}
          </Container>
        </div>
      )}
    </div>
  </Modal>
)
