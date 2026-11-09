// @vitest-environment jsdom
import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { SecretInput } from './SecretInput'

function Harness() {
  const [value, setValue] = useState('JBSWY3DPEHPK3PXP')

  return <SecretInput value={value} onChange={setValue} error={null} />
}

describe('SecretInput', () => {
  it('returns focus to the secret input after clearing', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    const input = screen.getByLabelText('Secret key')
    await user.click(screen.getByRole('button', { name: 'Clear secret key' }))

    expect((input as HTMLInputElement).value).toBe('')
    expect(document.activeElement).toBe(input)
  })
})
