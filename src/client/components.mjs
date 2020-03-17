import { E } from './dom.mjs'

export const Button = ({ text, onClick, disabled }) => E('button', { text, onClick, disabled })
