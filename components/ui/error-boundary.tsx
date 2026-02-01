'use client'

import { Component, ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Button } from './button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Card className="m-4">
          <CardHeader>
            <CardTitle>שגיאה</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600 mb-4">
              {this.state.error?.message || 'אירעה שגיאה'}
            </p>
            <Button onClick={() => this.setState({ hasError: false, error: null })}>
              נסה שוב
            </Button>
          </CardContent>
        </Card>
      )
    }

    return this.props.children
  }
}
