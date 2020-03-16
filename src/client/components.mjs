import { E } from './dom.mjs'

export const Form = ({ onSubmit }, children) =>
  E(
    'form',
    {
      onSubmit: e => {
        e.preventDefault()
        onSubmit(e)
      },
    },
    children
  )

export const Input = ({ autofocus, id, value, placeholder }) =>
  E('input', {
    autofocus,
    id,
    value,
    placeholder,
  })

export const Button = ({ text, onClick, disabled }) => E('button', { text, onClick, disabled })
