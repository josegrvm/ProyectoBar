// ...imports...
export default function LoginBar(){
  const nav = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = React.useState({ email:"", password:"" });
  const [error, setError] = React.useState("");

  const onSubmit = async (e) => {
    e.preventDefault();                 // 👈
    setError("");

    const parsed = LoginSchema.safeParse(form);
    if(!parsed.success){ setError(parsed.error.errors[0].message); return; }

    try {
      await login(form);
      nav("/home");
    } catch (err) {
      setError(err?.response?.data?.error || "Error al iniciar sesión");
    }
  };

  return (
    <form onSubmit={onSubmit} className="form">  {/* 👈 */}
      <input className="input" placeholder="Email"
        value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
      <input className="input" type="password" placeholder="Contraseña"
        value={form.password} onChange={e=>setForm({...form, password:e.target.value})}/>
      <button type="submit" className="btn-primary">Entrar</button> {/* 👈 */}
    </form>
  );
}
