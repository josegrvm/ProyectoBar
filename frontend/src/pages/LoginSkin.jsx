import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from './api/axios'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const navigate = useNavigate()

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const validate = () => {
    const e = {}
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Correo inválido'
    if (!form.password || form.password.length < 6) e.password = 'Mínimo 6 caracteres'
    return e
  }

  const onSubmit = async ev => {
    ev.preventDefault()
    setSubmitted(true)
    setServerError('')
    const v = validate()
    setErrors(v)
    if (Object.keys(v).length) return
    try {
      await api.post('/auth/login', form) // cookie llega sola
      navigate('/peliculas')
    } catch (err) {
      setServerError(err?.response?.data?.message || 'Credenciales inválidas')
    }

  }

  return (
    <div className="auth">
      <h2>Iniciar sesión</h2>
      <form className="form" onSubmit={onSubmit} noValidate>
        <div className="row">
          <label>Correo electrónico</label>
          <input name="email" value={form.email} onChange={onChange} />
          {submitted && errors.email && <div className="error">{errors.email}</div>}
        </div>
        <div className="row">
          <label>Contraseña</label>
          <input type="password" name="password" value={form.password} onChange={onChange} />
          {submitted && errors.password && <div className="error">{errors.password}</div>}
        </div>
        {serverError && <div className="error-global">{serverError}</div>}
        <button className="btn btn-primary">Entrar</button>
      </form>
    </div>
  )
}
