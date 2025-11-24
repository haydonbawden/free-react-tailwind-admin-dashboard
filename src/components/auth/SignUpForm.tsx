import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import { useSupabaseAuth } from "../../hooks/useSupabaseAuth";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(true);
  const [email, setEmail] = useState("legalops@example.com");
  const [password, setPassword] = useState("SecurePass!23");
  const [tenant, setTenant] = useState("Acme Legal");
  const navigate = useNavigate();
  const { signUp, loading, error } = useSupabaseAuth();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await signUp(email, password, tenant);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Create a tenant, invite your team later, and secure your Supabase JWT with tenant_id claims.
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <Label>
                  Tenant name<span className="text-error-500">*</span>
                </Label>
                <Input
                  type="text"
                  value={tenant}
                  onChange={(event) => setTenant(event.target.value)}
                  placeholder="Company or client name"
                />
              </div>
              <div>
                <Label>
                  Email<span className="text-error-500">*</span>
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              <div>
                <Label>
                  Password<span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox className="w-5 h-5" checked={isChecked} onChange={setIsChecked} />
                <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                  By creating an account you agree to scoped access via RLS and the platform Terms & Privacy Policy.
                </p>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-60"
                  disabled={loading}
                >
                  {loading ? "Creating tenant..." : "Sign Up"}
                </button>
                {error && <p className="mt-2 text-sm text-error-500">{error}</p>}
              </div>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Already have an account? {""}
              <Link to="/signin" className="text-brand-500 hover:text-brand-600 dark:text-brand-400">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
