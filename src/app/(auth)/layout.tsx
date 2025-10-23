export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12'>
      <div className='w-full max-w-md'>{children}</div>
    </div>
  )
}

