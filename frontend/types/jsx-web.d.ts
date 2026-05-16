import type { DetailedHTMLProps, IframeHTMLAttributes } from 'react'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      iframe: DetailedHTMLProps<IframeHTMLAttributes<HTMLIFrameElement>, HTMLIFrameElement>
    }
  }
}

export {}
