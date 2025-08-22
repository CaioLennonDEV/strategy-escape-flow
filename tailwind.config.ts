
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Cores Unimed
				unimed: {
					primary: 'hsl(var(--unimed-primary))',
					light: 'hsl(var(--unimed-light))',
					dark: 'hsl(var(--unimed-dark))',
					orange: 'hsl(var(--unimed-orange))',
					support: 'hsl(var(--unimed-support))',
					info: 'hsl(var(--unimed-info))'
				},
				// Cores dos pilares
				pillar: {
					financial: 'hsl(var(--pillar-financial))',
					market: 'hsl(var(--pillar-market))',
					process: 'hsl(var(--pillar-process))',
					growth: 'hsl(var(--pillar-growth))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'door-open': {
					from: {
						transform: 'perspective(1200px) rotateY(0deg)',
						transformOrigin: 'left center'
					},
					to: {
						transform: 'perspective(1200px) rotateY(-85deg)',
						transformOrigin: 'left center'
					}
				},
				'glow-pulse': {
					'0%, 100%': {
						boxShadow: '0 0 20px hsl(var(--unimed-primary) / 0.3)'
					},
					'50%': {
						boxShadow: '0 0 40px hsl(var(--unimed-primary) / 0.6)'
					}
				},
				'slide-up': {
					from: {
						transform: 'translateY(20px)',
						opacity: '0'
					},
					to: {
						transform: 'translateY(0)',
						opacity: '1'
					}
				},
				'fade-in': {
					from: {
						opacity: '0'
					},
					to: {
						opacity: '1'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'door-open': 'door-open 0.8s ease-out',
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
				'slide-up': 'slide-up 0.4s ease-out',
				'fade-in': 'fade-in 0.3s ease-out'
			},
			fontFamily: {
				inter: ['Inter', 'sans-serif'],
				poppins: ['Poppins', 'sans-serif'],
				orbitron: ['Orbitron', 'monospace']
			},
			backgroundImage: {
				'metallic-gradient': 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
				'unimed-gradient': 'linear-gradient(135deg, hsl(var(--unimed-primary)) 0%, hsl(var(--unimed-light)) 100%)',
				'door-gradient': 'linear-gradient(145deg, #ffffff 0%, #f0f4f8 50%, #e2e8f0 100%)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
