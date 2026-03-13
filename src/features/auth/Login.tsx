import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/boards');
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors duration-200">
      <header className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
          <span className="material-symbols-outlined text-2xl">pinboard</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Trello Mini</h1>
      </header>

      <div className="w-full max-w-[440px] rounded-xl bg-white dark:bg-slate-900 p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 z-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Chào mừng trở lại</h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Vui lòng nhập thông tin để đăng nhập.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="email">Địa chỉ Email</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">mail</span>
              <input
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-3 pl-11 pr-4 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-400"
                id="email"
                name="email"
                placeholder="name@company.com"
                type="email"
                defaultValue="name@company.com"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="password">Mật khẩu</label>
              <a className="text-sm font-medium text-primary hover:underline" href="#">Quên mật khẩu?</a>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock</span>
              <input
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-3 pl-11 pr-4 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-400"
                id="password"
                name="password"
                placeholder="••••••••"
                type="password"
                defaultValue="password123"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary" id="remember" type="checkbox" />
            <label className="text-sm text-slate-600 dark:text-slate-400" htmlFor="remember">Lưu đăng nhập trong 30 ngày</label>
          </div>

          <button className="w-full rounded-lg bg-primary py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all focus:outline-none focus:ring-4 focus:ring-primary/30" type="submit">
            Đăng Nhập
          </button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200 dark:border-slate-700"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-900 px-2 text-slate-500 dark:text-slate-400">Hoặc tiếp tục với</span>
            </div>
          </div>

          <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all" type="button" onClick={() => navigate('/boards')}>
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
            Google
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-slate-500 dark:text-slate-400">Chưa có tài khoản?</span>
          <a className="ml-1 font-bold text-primary hover:underline" href="#">Đăng ký miễn phí</a>
        </div>
      </div>

      <div className="absolute top-0 right-0 -z-10 h-64 w-64 opacity-10 dark:opacity-5">
        <div className="h-full w-full bg-primary rounded-full blur-3xl"></div>
      </div>
      <div className="absolute bottom-0 left-0 -z-10 h-64 w-64 opacity-10 dark:opacity-5">
        <div className="h-full w-full bg-primary rounded-full blur-3xl"></div>
      </div>

      <footer className="mt-12 flex gap-6 text-xs text-slate-400 dark:text-slate-500 z-10">
        <a className="hover:text-slate-600 dark:hover:text-slate-300" href="#">Chính sách bảo mật</a>
        <a className="hover:text-slate-600 dark:hover:text-slate-300" href="#">Điều khoản dịch vụ</a>
        <a className="hover:text-slate-600 dark:hover:text-slate-300" href="#">Trung tâm trợ giúp</a>
      </footer>
    </div>
  );
};

export default Login;
