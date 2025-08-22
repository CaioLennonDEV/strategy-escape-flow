import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white/95 group-[.toaster]:text-unimed-dark group-[.toaster]:border-unimed-primary/20 group-[.toaster]:shadow-xl group-[.toaster]:backdrop-blur-md group-[.toaster]:rounded-2xl group-[.toaster]:border-2",
          description: "group-[.toast]:text-slate-600 group-[.toast]:font-medium",
          actionButton:
            "group-[.toast]:bg-unimed-primary group-[.toast]:text-white group-[.toast]:font-bold group-[.toast]:rounded-xl group-[.toast]:hover:bg-unimed-primary/90",
          cancelButton:
            "group-[.toast]:bg-slate-100 group-[.toast]:text-slate-600 group-[.toast]:font-medium group-[.toast]:rounded-xl group-[.toast]:hover:bg-slate-200",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
