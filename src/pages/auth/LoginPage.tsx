import { useNavigate, Navigate } from "react-router-dom";
import { useAuthStore } from "../../features/auth/store/useAuthStore";
import { useForm } from "../../hooks/useForm";

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { values, handleChange, handleSubmit } = useForm({
    initialValues: {
      email: "name@company.com",
      password: "password123",
    },
    validate: (values) => {
      const newErrors: Record<string, string> = {};
      if (!values.email) newErrors.email = "Email is required";
      if (!values.password) newErrors.password = "Password is required";
      return newErrors;
    },
    onSubmit: (values) => {
      login(values.email); // Chú ý login hiện tại trong store chỉ nhận 1 tham số
      navigate("/boards");
    },
  });

  // Đã đăng nhập thì tự động chuyển hướng về trang chủ
  if (isAuthenticated) {
    return <Navigate to="/boards" replace />;
  }



  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors duration-200">
      <header className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
          <span className="material-symbols-outlined text-2xl">pinboard</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Trello Mini
        </h1>
      </header>

      <div className="w-full max-w-[440px] rounded-xl bg-white dark:bg-slate-900 p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 z-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Chào mừng trở lại
          </h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Vui lòng nhập thông tin để đăng nhập.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col gap-2">
            <label
              className="text-sm font-semibold text-slate-700 dark:text-slate-300"
              htmlFor="email"
            >
              Địa chỉ Email
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                mail
              </span>
              <input
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-3 pl-11 pr-4 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-400"
                id="email"
                name="email"
                placeholder="name@company.com"
                type="email"
                value={values.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label
                className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                htmlFor="password"
              >
                Mật khẩu
              </label>
              <a
                className="text-sm font-medium text-primary hover:underline"
                href="#"
              >
                Quên mật khẩu?
              </a>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                lock
              </span>
              <input
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-3 pl-11 pr-4 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-400"
                id="password"
                name="password"
                placeholder="••••••••"
                type="password"
                value={values.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
              id="remember"
              type="checkbox"
            />
          </div>

          <button
            className="w-full rounded-lg bg-primary py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all focus:outline-none focus:ring-4 focus:ring-primary/30"
            type="submit"
          >
            Đăng Nhập
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-slate-500 dark:text-slate-400">
            Chưa có tài khoản?
          </span>
          <a className="ml-1 font-bold text-primary hover:underline" href="#">
            Đăng ký miễn phí
          </a>
        </div>
      </div>

      <div className="absolute top-0 right-0 -z-10 h-64 w-64 opacity-10 dark:opacity-5">
        <div className="h-full w-full bg-primary rounded-full blur-3xl"></div>
      </div>
      <div className="absolute bottom-0 left-0 -z-10 h-64 w-64 opacity-10 dark:opacity-5">
        <div className="h-full w-full bg-primary rounded-full blur-3xl"></div>
      </div>

      <footer className="mt-12 flex gap-6 text-xs text-slate-400 dark:text-slate-500 z-10">
        <a className="hover:text-slate-600 dark:hover:text-slate-300" href="#">
          Chính sách bảo mật
        </a>
        <a className="hover:text-slate-600 dark:hover:text-slate-300" href="#">
          Điều khoản dịch vụ
        </a>
        <a className="hover:text-slate-600 dark:hover:text-slate-300" href="#">
          Trung tâm trợ giúp
        </a>
      </footer>
    </div>
  );
};

export default Login;
