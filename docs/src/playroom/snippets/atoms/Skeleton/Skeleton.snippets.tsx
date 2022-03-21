import * as React from 'react'

import { Skeleton } from '@ensdomains/thorin'

import { Snippet } from '../../../types'

export const snippets: Snippet[] = [
  {
    name: 'Basic',
    code: <Skeleton loading>_</Skeleton>,
  },
]
