import { EnvelopeClosedIcon, LockClosedIcon } from '@radix-ui/react-icons'
import { Input } from './input'
import { cn } from '@/shared/lib'

type AuthInputProps = React.ComponentProps<typeof Input> & {
  icon?: 'email' | 'lock'
}

export function AuthInput({ icon, className, ...props }: AuthInputProps) {
  return (
    <div className="relative">
      {icon && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          {icon === 'email' ? (
            <EnvelopeClosedIcon className="size-4 text-[var(--text-3)]" />
          ) : (
            <LockClosedIcon className="size-4 text-[var(--text-3)]" />
          )}
        </div>
      )}
      <Input 
        className={cn('h-11', icon ? 'pl-10' : '', className)} 
        {...props} 
      />
    </div>
  )
}