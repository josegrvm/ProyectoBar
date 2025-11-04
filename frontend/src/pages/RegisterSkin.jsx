// ...imports...
export default function RegisterBar(){
  const nav = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = React.useState({ name:"", email:"", password:"" });
  const [error, setError] = React.useState("");
  const [ok, setOk] = React.useState("");

  const onSubmit = async (e) => {
    e.preventDefault();                 // 👈 Asegúrate de recibir el "e"
    setError(""); setOk("");

    const parsed = RegisterSchema.safeParse(form);
    if(!parsed.success){ setError(parsed.error.errors[0].message); return; }

    try {
      await register(form);
      setOk("Registro exitoso. Ahora inicia sesión.");
      nav("/login");
    } catch (err) {
      setError(err?.response?.data?.error || "Error al registrarse");
    }
  };

  return (
    <form onSubmit={onSubmit} className="form">  {/* 👈 NO llames onSubmit() */}
      <input className="input" placeholder="Nombre"
        value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
      <input className="input" placeholder="Email"
        value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
      <input className="input" type="password" placeholder="Contraseña"
        value={form.password} onChange={e=>setForm({...form, password:e.target.value})}/>
      <button type="submit" className="btn-primary">Registrarme</button> {/* 👈 type="submit" */}
    </form>
  );
}
