// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { CodeDisplay } from './CodeDisplay'

afterEach(cleanup)

function renderDisplay() {
  return render(
    <CodeDisplay
      code="123456"
      nextCode="654321"
      digits={6}
      secondsLeft={20}
      progress={2 / 3}
      isWarning={false}
      isCritical={false}
    />,
  )
}

describe('CodeDisplay', () => {
  it('copies the current code when the digits are tapped', async () => {
    const user = userEvent.setup()
    renderDisplay()

    await user.click(screen.getByRole('button', { name: /copy current code/i }))

    await expect(navigator.clipboard.readText()).resolves.toBe('123456')
  })

  it('shows the next code alongside the current code', () => {
    renderDisplay()

    expect(
      screen.getByRole('group', { name: 'Next code 6 5 4 3 2 1' }),
    ).toBeTruthy()
  })

  it('offers a tap-to-copy hint', () => {
    renderDisplay()

    expect(screen.getByText('Tap to copy')).toBeTruthy()
  })
})
