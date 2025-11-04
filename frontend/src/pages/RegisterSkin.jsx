import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from './api/axios'

export default function Register() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const navigate = useNavigate()

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const validate = () => {
    const e = {}
    if (!form.firstName.trim() || form.firstName.length < 3) e.firstName = 'Nombre mínimo 3'
    if (!form.lastName.trim()  || form.lastName.length  < 3) e.lastName  = 'Apellido mínimo 3'
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Correo inválido'
    if (!form.password || form.password.length < 8) e.password = 'Contraseña mínima 8'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Las contraseñas no coinciden'
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
      await api.post('/auth/register', form)
      navigate('/peliculas')
    } catch (err) {
      const be = err?.response?.data
      if (be?.errors) setErrors(be.errors)
      setServerError(be?.message || 'Error al registrarse')
    }
  }

  return (
    <div className="auth">
      <h2>Registro</h2>
      <form className="form" onSubmit={onSubmit} noValidate>
        <div className="row">
          <label>Nombre</label>
          <input name="firstName" value={form.firstName} onChange={onChange} />
          {submitted && errors.firstName && <div className="error">{errors.firstName}</div>}
        </div>
        <div className="row">
          <label>Apellido</label>
          <input name="lastName" value={form.lastName} onChange={onChange} />
          {submitted && errors.lastName && <div className="error">{errors.lastName}</div>}
        </div>
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
        <div className="row">
          <label>Confirmar contraseña</label>
          <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={onChange} />
          {submitted && errors.confirmPassword && <div className="error">{errors.confirmPassword}</div>}
        </div>
        {serverError && <div className="error-global">{serverError}</div>}
        <button className="btn btn-primary">Registrarse</button>
      </form>
    </div>
  )
}
