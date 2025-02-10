/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
    theme: {
    	extend: {
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		colors: {
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
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
    			}
    		}
    	}
    },
	safelist: [
		// Contenedor principal
		"rbc-calendar",
		"rbc-off-range",
		"rbc-off-range-bg",
		"rbc-today",
		"rbc-event",
		"rbc-event-label",
		"rbc-event-content",
		"rbc-show-more",
		"rbc-header",
		"rbc-day-bg",
		"rbc-row",
		"rbc-row-segment",
		"rbc-date-cell",
		"rbc-button-link",
		"rbc-label",

		//Agenda
		"rbc-agenda-view",
		"rbc-agenda-time",
		"rbc-agenda-date",
		
		// Vista de Mes
		"rbc-month-view",
		"rbc-month-row",
		"rbc-date-cell",
		"rbc-now",
	
		// Vista de Semana / Día
		"rbc-time-view",
		"rbc-time-view-resources",
		"rbc-time-header",
		"rbc-time-header-content",
		"rbc-time-header-gutter",
		"rbc-time-header-cell",
		"rbc-time-content",
		"rbc-time-gutter",
		"rbc-timeslot-group",
		"rbc-time-slot",
		"rbc-day-slot",
		"rbc-time-header-content",
	
		// Barra de Herramientas (Toolbar)
		"rbc-toolbar",
		"rbc-toolbar-label",
		"rbc-btn-group",
		"rbc-toolbar button",
	
		// Día y Hora actual
		"rbc-current-time-indicator",
		"rbc-background-event",
		"rbc-allday-cell",
		"rbc-overlay-header",
		"rbc-overlay",
		"rbc-show-more"
	  ],
    plugins: [require("tailwindcss-animate")],
  }
  