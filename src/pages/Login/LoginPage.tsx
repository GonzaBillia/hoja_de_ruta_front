import { LoginForm } from "@/components/modules/login/login-form-container"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <div className="flex justify-center md:justify-end absolute z-10">
            <img
              src="../../../Logo_blanco_.png"
              alt="Image"
              className="w-[40%]"
            />
          </div>
        <img
          src="../../../login-bg.webp"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.7]"
        />
      </div>
    </div>
  )
}
