// Type definitions for Tailwind color structure
export interface ColorVariantHover {
	textColor: string;
	bgColor: string;
	bgColorHalfOpacity: string;
	borderColor: string;
	outlineColor: string;
}

export interface ColorVariantFocus {
	outlineColor: string;
	borderColor: string;
}

export interface ColorVariant {
	textColor: string;
	bgColor: string;
	bgColorHalfOpacity: string;
	borderColor: string;
	outlineColor: string;
	hexColor: string;
	hover: ColorVariantHover;
	focus: ColorVariantFocus;
}

// Type for a color family (e.g., all shades of 'slate')
export type ColorShades = Record<string, ColorVariant>;

// Type for the entire TAILWIND_COLORS_OBJ
export type TailwindColorsObj = Record<string, ColorShades>;

export const TAILWIND_COLORS_OBJ: TailwindColorsObj = {
    "slate": {
        "slate-50": {
            "textColor": "text-slate-50",
            "bgColor": "bg-slate-50",
            "bgColorHalfOpacity": "bg-slate-50/50",
            "borderColor": "border-slate-50",
            "outlineColor": "outline-slate-50",
            "hexColor": "#f8fafc",
            "hover": {
                "textColor": "hover:text-slate-50",
                "bgColor": "hover:bg-slate-50",
                "bgColorHalfOpacity": "hover:bg-slate-50/50",
                "borderColor": "hover:border-slate-50",
                "outlineColor": "hover:outline-slate-50"
            },
            "focus": {
                "outlineColor": "focus:outline-slate-50",
                "borderColor": "focus:border-slate-50"
            }
        },
        "slate-100": {
            "textColor": "text-slate-100",
            "bgColor": "bg-slate-100",
            "bgColorHalfOpacity": "bg-slate-100/50",
            "borderColor": "border-slate-100",
            "outlineColor": "outline-slate-100",
            "hexColor": "#f1f5f9",
            "hover": {
                "textColor": "hover:text-slate-100",
                "bgColor": "hover:bg-slate-100",
                "bgColorHalfOpacity": "hover:bg-slate-100/50",
                "borderColor": "hover:border-slate-100",
                "outlineColor": "hover:outline-slate-100"
            },
            "focus": {
                "outlineColor": "focus:outline-slate-100",
                "borderColor": "focus:border-slate-100"
            }
        },
        "slate-200": {
            "textColor": "text-slate-200",
            "bgColor": "bg-slate-200",
            "bgColorHalfOpacity": "bg-slate-200/50",
            "borderColor": "border-slate-200",
            "outlineColor": "outline-slate-200",
            "hexColor": "#e2e8f0",
            "hover": {
                "textColor": "hover:text-slate-200",
                "bgColor": "hover:bg-slate-200",
                "bgColorHalfOpacity": "hover:bg-slate-200/50",
                "borderColor": "hover:border-slate-200",
                "outlineColor": "hover:outline-slate-200"
            },
            "focus": {
                "outlineColor": "focus:outline-slate-200",
                "borderColor": "focus:border-slate-200"
            }
        },
        "slate-300": {
            "textColor": "text-slate-300",
            "bgColor": "bg-slate-300",
            "bgColorHalfOpacity": "bg-slate-300/50",
            "borderColor": "border-slate-300",
            "outlineColor": "outline-slate-300",
            "hexColor": "#cbd5e1",
            "hover": {
                "textColor": "hover:text-slate-300",
                "bgColor": "hover:bg-slate-300",
                "bgColorHalfOpacity": "hover:bg-slate-300/50",
                "borderColor": "hover:border-slate-300",
                "outlineColor": "hover:outline-slate-300"
            },
            "focus": {
                "outlineColor": "focus:outline-slate-300",
                "borderColor": "focus:border-slate-300"
            }
        },
        "slate-400": {
            "textColor": "text-slate-400",
            "bgColor": "bg-slate-400",
            "bgColorHalfOpacity": "bg-slate-400/50",
            "borderColor": "border-slate-400",
            "outlineColor": "outline-slate-400",
            "hexColor": "#94a3b8",
            "hover": {
                "textColor": "hover:text-slate-400",
                "bgColor": "hover:bg-slate-400",
                "bgColorHalfOpacity": "hover:bg-slate-400/50",
                "borderColor": "hover:border-slate-400",
                "outlineColor": "hover:outline-slate-400"
            },
            "focus": {
                "outlineColor": "focus:outline-slate-400",
                "borderColor": "focus:border-slate-400"
            }
        },
        "slate-500": {
            "textColor": "text-slate-500",
            "bgColor": "bg-slate-500",
            "bgColorHalfOpacity": "bg-slate-500/50",
            "borderColor": "border-slate-500",
            "outlineColor": "outline-slate-500",
            "hexColor": "#64748b",
            "hover": {
                "textColor": "hover:text-slate-500",
                "bgColor": "hover:bg-slate-500",
                "bgColorHalfOpacity": "hover:bg-slate-500/50",
                "borderColor": "hover:border-slate-500",
                "outlineColor": "hover:outline-slate-500"
            },
            "focus": {
                "outlineColor": "focus:outline-slate-500",
                "borderColor": "focus:border-slate-500"
            }
        },
        "slate-600": {
            "textColor": "text-slate-600",
            "bgColor": "bg-slate-600",
            "bgColorHalfOpacity": "bg-slate-600/50",
            "borderColor": "border-slate-600",
            "outlineColor": "outline-slate-600",
            "hexColor": "#475569",
            "hover": {
                "textColor": "hover:text-slate-600",
                "bgColor": "hover:bg-slate-600",
                "bgColorHalfOpacity": "hover:bg-slate-600/50",
                "borderColor": "hover:border-slate-600",
                "outlineColor": "hover:outline-slate-600"
            },
            "focus": {
                "outlineColor": "focus:outline-slate-600",
                "borderColor": "focus:border-slate-600"
            }
        },
        "slate-700": {
            "textColor": "text-slate-700",
            "bgColor": "bg-slate-700",
            "bgColorHalfOpacity": "bg-slate-700/50",
            "borderColor": "border-slate-700",
            "outlineColor": "outline-slate-700",
            "hexColor": "#334155",
            "hover": {
                "textColor": "hover:text-slate-700",
                "bgColor": "hover:bg-slate-700",
                "bgColorHalfOpacity": "hover:bg-slate-700/50",
                "borderColor": "hover:border-slate-700",
                "outlineColor": "hover:outline-slate-700"
            },
            "focus": {
                "outlineColor": "focus:outline-slate-700",
                "borderColor": "focus:border-slate-700"
            }
        },
        "slate-800": {
            "textColor": "text-slate-800",
            "bgColor": "bg-slate-800",
            "bgColorHalfOpacity": "bg-slate-800/50",
            "borderColor": "border-slate-800",
            "outlineColor": "outline-slate-800",
            "hexColor": "#1e293b",
            "hover": {
                "textColor": "hover:text-slate-800",
                "bgColor": "hover:bg-slate-800",
                "bgColorHalfOpacity": "hover:bg-slate-800/50",
                "borderColor": "hover:border-slate-800",
                "outlineColor": "hover:outline-slate-800"
            },
            "focus": {
                "outlineColor": "focus:outline-slate-800",
                "borderColor": "focus:border-slate-800"
            }
        },
        "slate-900": {
            "textColor": "text-slate-900",
            "bgColor": "bg-slate-900",
            "bgColorHalfOpacity": "bg-slate-900/50",
            "borderColor": "border-slate-900",
            "outlineColor": "outline-slate-900",
            "hexColor": "#0f172a",
            "hover": {
                "textColor": "hover:text-slate-900",
                "bgColor": "hover:bg-slate-900",
                "bgColorHalfOpacity": "hover:bg-slate-900/50",
                "borderColor": "hover:border-slate-900",
                "outlineColor": "hover:outline-slate-900"
            },
            "focus": {
                "outlineColor": "focus:outline-slate-900",
                "borderColor": "focus:border-slate-900"
            }
        },
        "slate-950": {
            "textColor": "text-slate-950",
            "bgColor": "bg-slate-950",
            "bgColorHalfOpacity": "bg-slate-950/50",
            "borderColor": "border-slate-950",
            "outlineColor": "outline-slate-950",
            "hexColor": "#020617",
            "hover": {
                "textColor": "hover:text-slate-950",
                "bgColor": "hover:bg-slate-950",
                "bgColorHalfOpacity": "hover:bg-slate-950/50",
                "borderColor": "hover:border-slate-950",
                "outlineColor": "hover:outline-slate-950"
            },
            "focus": {
                "outlineColor": "focus:outline-slate-950",
                "borderColor": "focus:border-slate-950"
            }
        }
    },
    "gray": {
        "gray-50": {
            "textColor": "text-gray-50",
            "bgColor": "bg-gray-50",
            "bgColorHalfOpacity": "bg-gray-50/50",
            "borderColor": "border-gray-50",
            "outlineColor": "outline-gray-50",
            "hexColor": "#f9fafb",
            "hover": {
                "textColor": "hover:text-gray-50",
                "bgColor": "hover:bg-gray-50",
                "bgColorHalfOpacity": "hover:bg-gray-50/50",
                "borderColor": "hover:border-gray-50",
                "outlineColor": "hover:outline-gray-50"
            },
            "focus": {
                "outlineColor": "focus:outline-gray-50",
                "borderColor": "focus:border-gray-50"
            }
        },
        "gray-100": {
            "textColor": "text-gray-100",
            "bgColor": "bg-gray-100",
            "bgColorHalfOpacity": "bg-gray-100/50",
            "borderColor": "border-gray-100",
            "outlineColor": "outline-gray-100",
            "hexColor": "#f3f4f6",
            "hover": {
                "textColor": "hover:text-gray-100",
                "bgColor": "hover:bg-gray-100",
                "bgColorHalfOpacity": "hover:bg-gray-100/50",
                "borderColor": "hover:border-gray-100",
                "outlineColor": "hover:outline-gray-100"
            },
            "focus": {
                "outlineColor": "focus:outline-gray-100",
                "borderColor": "focus:border-gray-100"
            }
        },
        "gray-200": {
            "textColor": "text-gray-200",
            "bgColor": "bg-gray-200",
            "bgColorHalfOpacity": "bg-gray-200/50",
            "borderColor": "border-gray-200",
            "outlineColor": "outline-gray-200",
            "hexColor": "#e5e7eb",
            "hover": {
                "textColor": "hover:text-gray-200",
                "bgColor": "hover:bg-gray-200",
                "bgColorHalfOpacity": "hover:bg-gray-200/50",
                "borderColor": "hover:border-gray-200",
                "outlineColor": "hover:outline-gray-200"
            },
            "focus": {
                "outlineColor": "focus:outline-gray-200",
                "borderColor": "focus:border-gray-200"
            }
        },
        "gray-300": {
            "textColor": "text-gray-300",
            "bgColor": "bg-gray-300",
            "bgColorHalfOpacity": "bg-gray-300/50",
            "borderColor": "border-gray-300",
            "outlineColor": "outline-gray-300",
            "hexColor": "#d1d5db",
            "hover": {
                "textColor": "hover:text-gray-300",
                "bgColor": "hover:bg-gray-300",
                "bgColorHalfOpacity": "hover:bg-gray-300/50",
                "borderColor": "hover:border-gray-300",
                "outlineColor": "hover:outline-gray-300"
            },
            "focus": {
                "outlineColor": "focus:outline-gray-300",
                "borderColor": "focus:border-gray-300"
            }
        },
        "gray-400": {
            "textColor": "text-gray-400",
            "bgColor": "bg-gray-400",
            "bgColorHalfOpacity": "bg-gray-400/50",
            "borderColor": "border-gray-400",
            "outlineColor": "outline-gray-400",
            "hexColor": "#9ca3af",
            "hover": {
                "textColor": "hover:text-gray-400",
                "bgColor": "hover:bg-gray-400",
                "bgColorHalfOpacity": "hover:bg-gray-400/50",
                "borderColor": "hover:border-gray-400",
                "outlineColor": "hover:outline-gray-400"
            },
            "focus": {
                "outlineColor": "focus:outline-gray-400",
                "borderColor": "focus:border-gray-400"
            }
        },
        "gray-500": {
            "textColor": "text-gray-500",
            "bgColor": "bg-gray-500",
            "bgColorHalfOpacity": "bg-gray-500/50",
            "borderColor": "border-gray-500",
            "outlineColor": "outline-gray-500",
            "hexColor": "#6b7280",
            "hover": {
                "textColor": "hover:text-gray-500",
                "bgColor": "hover:bg-gray-500",
                "bgColorHalfOpacity": "hover:bg-gray-500/50",
                "borderColor": "hover:border-gray-500",
                "outlineColor": "hover:outline-gray-500"
            },
            "focus": {
                "outlineColor": "focus:outline-gray-500",
                "borderColor": "focus:border-gray-500"
            }
        },
        "gray-600": {
            "textColor": "text-gray-600",
            "bgColor": "bg-gray-600",
            "bgColorHalfOpacity": "bg-gray-600/50",
            "borderColor": "border-gray-600",
            "outlineColor": "outline-gray-600",
            "hexColor": "#4b5563",
            "hover": {
                "textColor": "hover:text-gray-600",
                "bgColor": "hover:bg-gray-600",
                "bgColorHalfOpacity": "hover:bg-gray-600/50",
                "borderColor": "hover:border-gray-600",
                "outlineColor": "hover:outline-gray-600"
            },
            "focus": {
                "outlineColor": "focus:outline-gray-600",
                "borderColor": "focus:border-gray-600"
            }
        },
        "gray-700": {
            "textColor": "text-gray-700",
            "bgColor": "bg-gray-700",
            "bgColorHalfOpacity": "bg-gray-700/50",
            "borderColor": "border-gray-700",
            "outlineColor": "outline-gray-700",
            "hexColor": "#374151",
            "hover": {
                "textColor": "hover:text-gray-700",
                "bgColor": "hover:bg-gray-700",
                "bgColorHalfOpacity": "hover:bg-gray-700/50",
                "borderColor": "hover:border-gray-700",
                "outlineColor": "hover:outline-gray-700"
            },
            "focus": {
                "outlineColor": "focus:outline-gray-700",
                "borderColor": "focus:border-gray-700"
            }
        },
        "gray-800": {
            "textColor": "text-gray-800",
            "bgColor": "bg-gray-800",
            "bgColorHalfOpacity": "bg-gray-800/50",
            "borderColor": "border-gray-800",
            "outlineColor": "outline-gray-800",
            "hexColor": "#1f2937",
            "hover": {
                "textColor": "hover:text-gray-800",
                "bgColor": "hover:bg-gray-800",
                "bgColorHalfOpacity": "hover:bg-gray-800/50",
                "borderColor": "hover:border-gray-800",
                "outlineColor": "hover:outline-gray-800"
            },
            "focus": {
                "outlineColor": "focus:outline-gray-800",
                "borderColor": "focus:border-gray-800"
            }
        },
        "gray-900": {
            "textColor": "text-gray-900",
            "bgColor": "bg-gray-900",
            "bgColorHalfOpacity": "bg-gray-900/50",
            "borderColor": "border-gray-900",
            "outlineColor": "outline-gray-900",
            "hexColor": "#111827",
            "hover": {
                "textColor": "hover:text-gray-900",
                "bgColor": "hover:bg-gray-900",
                "bgColorHalfOpacity": "hover:bg-gray-900/50",
                "borderColor": "hover:border-gray-900",
                "outlineColor": "hover:outline-gray-900"
            },
            "focus": {
                "outlineColor": "focus:outline-gray-900",
                "borderColor": "focus:border-gray-900"
            }
        },
        "gray-950": {
            "textColor": "text-gray-950",
            "bgColor": "bg-gray-950",
            "bgColorHalfOpacity": "bg-gray-950/50",
            "borderColor": "border-gray-950",
            "outlineColor": "outline-gray-950",
            "hexColor": "#030712",
            "hover": {
                "textColor": "hover:text-gray-950",
                "bgColor": "hover:bg-gray-950",
                "bgColorHalfOpacity": "hover:bg-gray-950/50",
                "borderColor": "hover:border-gray-950",
                "outlineColor": "hover:outline-gray-950"
            },
            "focus": {
                "outlineColor": "focus:outline-gray-950",
                "borderColor": "focus:border-gray-950"
            }
        }
    },
    "zinc": {
        "zinc-50": {
            "textColor": "text-zinc-50",
            "bgColor": "bg-zinc-50",
            "bgColorHalfOpacity": "bg-zinc-50/50",
            "borderColor": "border-zinc-50",
            "outlineColor": "outline-zinc-50",
            "hexColor": "#fafafa",
            "hover": {
                "textColor": "hover:text-zinc-50",
                "bgColor": "hover:bg-zinc-50",
                "bgColorHalfOpacity": "hover:bg-zinc-50/50",
                "borderColor": "hover:border-zinc-50",
                "outlineColor": "hover:outline-zinc-50"
            },
            "focus": {
                "outlineColor": "focus:outline-zinc-50",
                "borderColor": "focus:border-zinc-50"
            }
        },
        "zinc-100": {
            "textColor": "text-zinc-100",
            "bgColor": "bg-zinc-100",
            "bgColorHalfOpacity": "bg-zinc-100/50",
            "borderColor": "border-zinc-100",
            "outlineColor": "outline-zinc-100",
            "hexColor": "#f4f4f5",
            "hover": {
                "textColor": "hover:text-zinc-100",
                "bgColor": "hover:bg-zinc-100",
                "bgColorHalfOpacity": "hover:bg-zinc-100/50",
                "borderColor": "hover:border-zinc-100",
                "outlineColor": "hover:outline-zinc-100"
            },
            "focus": {
                "outlineColor": "focus:outline-zinc-100",
                "borderColor": "focus:border-zinc-100"
            }
        },
        "zinc-200": {
            "textColor": "text-zinc-200",
            "bgColor": "bg-zinc-200",
            "bgColorHalfOpacity": "bg-zinc-200/50",
            "borderColor": "border-zinc-200",
            "outlineColor": "outline-zinc-200",
            "hexColor": "#e4e4e7",
            "hover": {
                "textColor": "hover:text-zinc-200",
                "bgColor": "hover:bg-zinc-200",
                "bgColorHalfOpacity": "hover:bg-zinc-200/50",
                "borderColor": "hover:border-zinc-200",
                "outlineColor": "hover:outline-zinc-200"
            },
            "focus": {
                "outlineColor": "focus:outline-zinc-200",
                "borderColor": "focus:border-zinc-200"
            }
        },
        "zinc-300": {
            "textColor": "text-zinc-300",
            "bgColor": "bg-zinc-300",
            "bgColorHalfOpacity": "bg-zinc-300/50",
            "borderColor": "border-zinc-300",
            "outlineColor": "outline-zinc-300",
            "hexColor": "#d4d4d8",
            "hover": {
                "textColor": "hover:text-zinc-300",
                "bgColor": "hover:bg-zinc-300",
                "bgColorHalfOpacity": "hover:bg-zinc-300/50",
                "borderColor": "hover:border-zinc-300",
                "outlineColor": "hover:outline-zinc-300"
            },
            "focus": {
                "outlineColor": "focus:outline-zinc-300",
                "borderColor": "focus:border-zinc-300"
            }
        },
        "zinc-400": {
            "textColor": "text-zinc-400",
            "bgColor": "bg-zinc-400",
            "bgColorHalfOpacity": "bg-zinc-400/50",
            "borderColor": "border-zinc-400",
            "outlineColor": "outline-zinc-400",
            "hexColor": "#a1a1aa",
            "hover": {
                "textColor": "hover:text-zinc-400",
                "bgColor": "hover:bg-zinc-400",
                "bgColorHalfOpacity": "hover:bg-zinc-400/50",
                "borderColor": "hover:border-zinc-400",
                "outlineColor": "hover:outline-zinc-400"
            },
            "focus": {
                "outlineColor": "focus:outline-zinc-400",
                "borderColor": "focus:border-zinc-400"
            }
        },
        "zinc-500": {
            "textColor": "text-zinc-500",
            "bgColor": "bg-zinc-500",
            "bgColorHalfOpacity": "bg-zinc-500/50",
            "borderColor": "border-zinc-500",
            "outlineColor": "outline-zinc-500",
            "hexColor": "#71717a",
            "hover": {
                "textColor": "hover:text-zinc-500",
                "bgColor": "hover:bg-zinc-500",
                "bgColorHalfOpacity": "hover:bg-zinc-500/50",
                "borderColor": "hover:border-zinc-500",
                "outlineColor": "hover:outline-zinc-500"
            },
            "focus": {
                "outlineColor": "focus:outline-zinc-500",
                "borderColor": "focus:border-zinc-500"
            }
        },
        "zinc-600": {
            "textColor": "text-zinc-600",
            "bgColor": "bg-zinc-600",
            "bgColorHalfOpacity": "bg-zinc-600/50",
            "borderColor": "border-zinc-600",
            "outlineColor": "outline-zinc-600",
            "hexColor": "#52525b",
            "hover": {
                "textColor": "hover:text-zinc-600",
                "bgColor": "hover:bg-zinc-600",
                "bgColorHalfOpacity": "hover:bg-zinc-600/50",
                "borderColor": "hover:border-zinc-600",
                "outlineColor": "hover:outline-zinc-600"
            },
            "focus": {
                "outlineColor": "focus:outline-zinc-600",
                "borderColor": "focus:border-zinc-600"
            }
        },
        "zinc-700": {
            "textColor": "text-zinc-700",
            "bgColor": "bg-zinc-700",
            "bgColorHalfOpacity": "bg-zinc-700/50",
            "borderColor": "border-zinc-700",
            "outlineColor": "outline-zinc-700",
            "hexColor": "#3f3f46",
            "hover": {
                "textColor": "hover:text-zinc-700",
                "bgColor": "hover:bg-zinc-700",
                "bgColorHalfOpacity": "hover:bg-zinc-700/50",
                "borderColor": "hover:border-zinc-700",
                "outlineColor": "hover:outline-zinc-700"
            },
            "focus": {
                "outlineColor": "focus:outline-zinc-700",
                "borderColor": "focus:border-zinc-700"
            }
        },
        "zinc-800": {
            "textColor": "text-zinc-800",
            "bgColor": "bg-zinc-800",
            "bgColorHalfOpacity": "bg-zinc-800/50",
            "borderColor": "border-zinc-800",
            "outlineColor": "outline-zinc-800",
            "hexColor": "#27272a",
            "hover": {
                "textColor": "hover:text-zinc-800",
                "bgColor": "hover:bg-zinc-800",
                "bgColorHalfOpacity": "hover:bg-zinc-800/50",
                "borderColor": "hover:border-zinc-800",
                "outlineColor": "hover:outline-zinc-800"
            },
            "focus": {
                "outlineColor": "focus:outline-zinc-800",
                "borderColor": "focus:border-zinc-800"
            }
        },
        "zinc-900": {
            "textColor": "text-zinc-900",
            "bgColor": "bg-zinc-900",
            "bgColorHalfOpacity": "bg-zinc-900/50",
            "borderColor": "border-zinc-900",
            "outlineColor": "outline-zinc-900",
            "hexColor": "#18181b",
            "hover": {
                "textColor": "hover:text-zinc-900",
                "bgColor": "hover:bg-zinc-900",
                "bgColorHalfOpacity": "hover:bg-zinc-900/50",
                "borderColor": "hover:border-zinc-900",
                "outlineColor": "hover:outline-zinc-900"
            },
            "focus": {
                "outlineColor": "focus:outline-zinc-900",
                "borderColor": "focus:border-zinc-900"
            }
        },
        "zinc-950": {
            "textColor": "text-zinc-950",
            "bgColor": "bg-zinc-950",
            "bgColorHalfOpacity": "bg-zinc-950/50",
            "borderColor": "border-zinc-950",
            "outlineColor": "outline-zinc-950",
            "hexColor": "#09090b",
            "hover": {
                "textColor": "hover:text-zinc-950",
                "bgColor": "hover:bg-zinc-950",
                "bgColorHalfOpacity": "hover:bg-zinc-950/50",
                "borderColor": "hover:border-zinc-950",
                "outlineColor": "hover:outline-zinc-950"
            },
            "focus": {
                "outlineColor": "focus:outline-zinc-950",
                "borderColor": "focus:border-zinc-950"
            }
        }
    },
    "neutral": {
        "neutral-50": {
            "textColor": "text-neutral-50",
            "bgColor": "bg-neutral-50",
            "bgColorHalfOpacity": "bg-neutral-50/50",
            "borderColor": "border-neutral-50",
            "outlineColor": "outline-neutral-50",
            "hexColor": "#fafafa",
            "hover": {
                "textColor": "hover:text-neutral-50",
                "bgColor": "hover:bg-neutral-50",
                "bgColorHalfOpacity": "hover:bg-neutral-50/50",
                "borderColor": "hover:border-neutral-50",
                "outlineColor": "hover:outline-neutral-50"
            },
            "focus": {
                "outlineColor": "focus:outline-neutral-50",
                "borderColor": "focus:border-neutral-50"
            }
        },
        "neutral-100": {
            "textColor": "text-neutral-100",
            "bgColor": "bg-neutral-100",
            "bgColorHalfOpacity": "bg-neutral-100/50",
            "borderColor": "border-neutral-100",
            "outlineColor": "outline-neutral-100",
            "hexColor": "#f5f5f5",
            "hover": {
                "textColor": "hover:text-neutral-100",
                "bgColor": "hover:bg-neutral-100",
                "bgColorHalfOpacity": "hover:bg-neutral-100/50",
                "borderColor": "hover:border-neutral-100",
                "outlineColor": "hover:outline-neutral-100"
            },
            "focus": {
                "outlineColor": "focus:outline-neutral-100",
                "borderColor": "focus:border-neutral-100"
            }
        },
        "neutral-200": {
            "textColor": "text-neutral-200",
            "bgColor": "bg-neutral-200",
            "bgColorHalfOpacity": "bg-neutral-200/50",
            "borderColor": "border-neutral-200",
            "outlineColor": "outline-neutral-200",
            "hexColor": "#e5e5e5",
            "hover": {
                "textColor": "hover:text-neutral-200",
                "bgColor": "hover:bg-neutral-200",
                "bgColorHalfOpacity": "hover:bg-neutral-200/50",
                "borderColor": "hover:border-neutral-200",
                "outlineColor": "hover:outline-neutral-200"
            },
            "focus": {
                "outlineColor": "focus:outline-neutral-200",
                "borderColor": "focus:border-neutral-200"
            }
        },
        "neutral-300": {
            "textColor": "text-neutral-300",
            "bgColor": "bg-neutral-300",
            "bgColorHalfOpacity": "bg-neutral-300/50",
            "borderColor": "border-neutral-300",
            "outlineColor": "outline-neutral-300",
            "hexColor": "#d4d4d4",
            "hover": {
                "textColor": "hover:text-neutral-300",
                "bgColor": "hover:bg-neutral-300",
                "bgColorHalfOpacity": "hover:bg-neutral-300/50",
                "borderColor": "hover:border-neutral-300",
                "outlineColor": "hover:outline-neutral-300"
            },
            "focus": {
                "outlineColor": "focus:outline-neutral-300",
                "borderColor": "focus:border-neutral-300"
            }
        },
        "neutral-400": {
            "textColor": "text-neutral-400",
            "bgColor": "bg-neutral-400",
            "bgColorHalfOpacity": "bg-neutral-400/50",
            "borderColor": "border-neutral-400",
            "outlineColor": "outline-neutral-400",
            "hexColor": "#a3a3a3",
            "hover": {
                "textColor": "hover:text-neutral-400",
                "bgColor": "hover:bg-neutral-400",
                "bgColorHalfOpacity": "hover:bg-neutral-400/50",
                "borderColor": "hover:border-neutral-400",
                "outlineColor": "hover:outline-neutral-400"
            },
            "focus": {
                "outlineColor": "focus:outline-neutral-400",
                "borderColor": "focus:border-neutral-400"
            }
        },
        "neutral-500": {
            "textColor": "text-neutral-500",
            "bgColor": "bg-neutral-500",
            "bgColorHalfOpacity": "bg-neutral-500/50",
            "borderColor": "border-neutral-500",
            "outlineColor": "outline-neutral-500",
            "hexColor": "#737373",
            "hover": {
                "textColor": "hover:text-neutral-500",
                "bgColor": "hover:bg-neutral-500",
                "bgColorHalfOpacity": "hover:bg-neutral-500/50",
                "borderColor": "hover:border-neutral-500",
                "outlineColor": "hover:outline-neutral-500"
            },
            "focus": {
                "outlineColor": "focus:outline-neutral-500",
                "borderColor": "focus:border-neutral-500"
            }
        },
        "neutral-600": {
            "textColor": "text-neutral-600",
            "bgColor": "bg-neutral-600",
            "bgColorHalfOpacity": "bg-neutral-600/50",
            "borderColor": "border-neutral-600",
            "outlineColor": "outline-neutral-600",
            "hexColor": "#525252",
            "hover": {
                "textColor": "hover:text-neutral-600",
                "bgColor": "hover:bg-neutral-600",
                "bgColorHalfOpacity": "hover:bg-neutral-600/50",
                "borderColor": "hover:border-neutral-600",
                "outlineColor": "hover:outline-neutral-600"
            },
            "focus": {
                "outlineColor": "focus:outline-neutral-600",
                "borderColor": "focus:border-neutral-600"
            }
        },
        "neutral-700": {
            "textColor": "text-neutral-700",
            "bgColor": "bg-neutral-700",
            "bgColorHalfOpacity": "bg-neutral-700/50",
            "borderColor": "border-neutral-700",
            "outlineColor": "outline-neutral-700",
            "hexColor": "#404040",
            "hover": {
                "textColor": "hover:text-neutral-700",
                "bgColor": "hover:bg-neutral-700",
                "bgColorHalfOpacity": "hover:bg-neutral-700/50",
                "borderColor": "hover:border-neutral-700",
                "outlineColor": "hover:outline-neutral-700"
            },
            "focus": {
                "outlineColor": "focus:outline-neutral-700",
                "borderColor": "focus:border-neutral-700"
            }
        },
        "neutral-800": {
            "textColor": "text-neutral-800",
            "bgColor": "bg-neutral-800",
            "bgColorHalfOpacity": "bg-neutral-800/50",
            "borderColor": "border-neutral-800",
            "outlineColor": "outline-neutral-800",
            "hexColor": "#262626",
            "hover": {
                "textColor": "hover:text-neutral-800",
                "bgColor": "hover:bg-neutral-800",
                "bgColorHalfOpacity": "hover:bg-neutral-800/50",
                "borderColor": "hover:border-neutral-800",
                "outlineColor": "hover:outline-neutral-800"
            },
            "focus": {
                "outlineColor": "focus:outline-neutral-800",
                "borderColor": "focus:border-neutral-800"
            }
        },
        "neutral-900": {
            "textColor": "text-neutral-900",
            "bgColor": "bg-neutral-900",
            "bgColorHalfOpacity": "bg-neutral-900/50",
            "borderColor": "border-neutral-900",
            "outlineColor": "outline-neutral-900",
            "hexColor": "#171717",
            "hover": {
                "textColor": "hover:text-neutral-900",
                "bgColor": "hover:bg-neutral-900",
                "bgColorHalfOpacity": "hover:bg-neutral-900/50",
                "borderColor": "hover:border-neutral-900",
                "outlineColor": "hover:outline-neutral-900"
            },
            "focus": {
                "outlineColor": "focus:outline-neutral-900",
                "borderColor": "focus:border-neutral-900"
            }
        },
        "neutral-950": {
            "textColor": "text-neutral-950",
            "bgColor": "bg-neutral-950",
            "bgColorHalfOpacity": "bg-neutral-950/50",
            "borderColor": "border-neutral-950",
            "outlineColor": "outline-neutral-950",
            "hexColor": "#0a0a0a",
            "hover": {
                "textColor": "hover:text-neutral-950",
                "bgColor": "hover:bg-neutral-950",
                "bgColorHalfOpacity": "hover:bg-neutral-950/50",
                "borderColor": "hover:border-neutral-950",
                "outlineColor": "hover:outline-neutral-950"
            },
            "focus": {
                "outlineColor": "focus:outline-neutral-950",
                "borderColor": "focus:border-neutral-950"
            }
        }
    },
    "stone": {
        "stone-50": {
            "textColor": "text-stone-50",
            "bgColor": "bg-stone-50",
            "bgColorHalfOpacity": "bg-stone-50/50",
            "borderColor": "border-stone-50",
            "outlineColor": "outline-stone-50",
            "hexColor": "#fafaf9",
            "hover": {
                "textColor": "hover:text-stone-50",
                "bgColor": "hover:bg-stone-50",
                "bgColorHalfOpacity": "hover:bg-stone-50/50",
                "borderColor": "hover:border-stone-50",
                "outlineColor": "hover:outline-stone-50"
            },
            "focus": {
                "outlineColor": "focus:outline-stone-50",
                "borderColor": "focus:border-stone-50"
            }
        },
        "stone-100": {
            "textColor": "text-stone-100",
            "bgColor": "bg-stone-100",
            "bgColorHalfOpacity": "bg-stone-100/50",
            "borderColor": "border-stone-100",
            "outlineColor": "outline-stone-100",
            "hexColor": "#f5f5f4",
            "hover": {
                "textColor": "hover:text-stone-100",
                "bgColor": "hover:bg-stone-100",
                "bgColorHalfOpacity": "hover:bg-stone-100/50",
                "borderColor": "hover:border-stone-100",
                "outlineColor": "hover:outline-stone-100"
            },
            "focus": {
                "outlineColor": "focus:outline-stone-100",
                "borderColor": "focus:border-stone-100"
            }
        },
        "stone-200": {
            "textColor": "text-stone-200",
            "bgColor": "bg-stone-200",
            "bgColorHalfOpacity": "bg-stone-200/50",
            "borderColor": "border-stone-200",
            "outlineColor": "outline-stone-200",
            "hexColor": "#e7e5e4",
            "hover": {
                "textColor": "hover:text-stone-200",
                "bgColor": "hover:bg-stone-200",
                "bgColorHalfOpacity": "hover:bg-stone-200/50",
                "borderColor": "hover:border-stone-200",
                "outlineColor": "hover:outline-stone-200"
            },
            "focus": {
                "outlineColor": "focus:outline-stone-200",
                "borderColor": "focus:border-stone-200"
            }
        },
        "stone-300": {
            "textColor": "text-stone-300",
            "bgColor": "bg-stone-300",
            "bgColorHalfOpacity": "bg-stone-300/50",
            "borderColor": "border-stone-300",
            "outlineColor": "outline-stone-300",
            "hexColor": "#d6d3d1",
            "hover": {
                "textColor": "hover:text-stone-300",
                "bgColor": "hover:bg-stone-300",
                "bgColorHalfOpacity": "hover:bg-stone-300/50",
                "borderColor": "hover:border-stone-300",
                "outlineColor": "hover:outline-stone-300"
            },
            "focus": {
                "outlineColor": "focus:outline-stone-300",
                "borderColor": "focus:border-stone-300"
            }
        },
        "stone-400": {
            "textColor": "text-stone-400",
            "bgColor": "bg-stone-400",
            "bgColorHalfOpacity": "bg-stone-400/50",
            "borderColor": "border-stone-400",
            "outlineColor": "outline-stone-400",
            "hexColor": "#a8a29e",
            "hover": {
                "textColor": "hover:text-stone-400",
                "bgColor": "hover:bg-stone-400",
                "bgColorHalfOpacity": "hover:bg-stone-400/50",
                "borderColor": "hover:border-stone-400",
                "outlineColor": "hover:outline-stone-400"
            },
            "focus": {
                "outlineColor": "focus:outline-stone-400",
                "borderColor": "focus:border-stone-400"
            }
        },
        "stone-500": {
            "textColor": "text-stone-500",
            "bgColor": "bg-stone-500",
            "bgColorHalfOpacity": "bg-stone-500/50",
            "borderColor": "border-stone-500",
            "outlineColor": "outline-stone-500",
            "hexColor": "#78716c",
            "hover": {
                "textColor": "hover:text-stone-500",
                "bgColor": "hover:bg-stone-500",
                "bgColorHalfOpacity": "hover:bg-stone-500/50",
                "borderColor": "hover:border-stone-500",
                "outlineColor": "hover:outline-stone-500"
            },
            "focus": {
                "outlineColor": "focus:outline-stone-500",
                "borderColor": "focus:border-stone-500"
            }
        },
        "stone-600": {
            "textColor": "text-stone-600",
            "bgColor": "bg-stone-600",
            "bgColorHalfOpacity": "bg-stone-600/50",
            "borderColor": "border-stone-600",
            "outlineColor": "outline-stone-600",
            "hexColor": "#57534e",
            "hover": {
                "textColor": "hover:text-stone-600",
                "bgColor": "hover:bg-stone-600",
                "bgColorHalfOpacity": "hover:bg-stone-600/50",
                "borderColor": "hover:border-stone-600",
                "outlineColor": "hover:outline-stone-600"
            },
            "focus": {
                "outlineColor": "focus:outline-stone-600",
                "borderColor": "focus:border-stone-600"
            }
        },
        "stone-700": {
            "textColor": "text-stone-700",
            "bgColor": "bg-stone-700",
            "bgColorHalfOpacity": "bg-stone-700/50",
            "borderColor": "border-stone-700",
            "outlineColor": "outline-stone-700",
            "hexColor": "#44403c",
            "hover": {
                "textColor": "hover:text-stone-700",
                "bgColor": "hover:bg-stone-700",
                "bgColorHalfOpacity": "hover:bg-stone-700/50",
                "borderColor": "hover:border-stone-700",
                "outlineColor": "hover:outline-stone-700"
            },
            "focus": {
                "outlineColor": "focus:outline-stone-700",
                "borderColor": "focus:border-stone-700"
            }
        },
        "stone-800": {
            "textColor": "text-stone-800",
            "bgColor": "bg-stone-800",
            "bgColorHalfOpacity": "bg-stone-800/50",
            "borderColor": "border-stone-800",
            "outlineColor": "outline-stone-800",
            "hexColor": "#292524",
            "hover": {
                "textColor": "hover:text-stone-800",
                "bgColor": "hover:bg-stone-800",
                "bgColorHalfOpacity": "hover:bg-stone-800/50",
                "borderColor": "hover:border-stone-800",
                "outlineColor": "hover:outline-stone-800"
            },
            "focus": {
                "outlineColor": "focus:outline-stone-800",
                "borderColor": "focus:border-stone-800"
            }
        },
        "stone-900": {
            "textColor": "text-stone-900",
            "bgColor": "bg-stone-900",
            "bgColorHalfOpacity": "bg-stone-900/50",
            "borderColor": "border-stone-900",
            "outlineColor": "outline-stone-900",
            "hexColor": "#1c1917",
            "hover": {
                "textColor": "hover:text-stone-900",
                "bgColor": "hover:bg-stone-900",
                "bgColorHalfOpacity": "hover:bg-stone-900/50",
                "borderColor": "hover:border-stone-900",
                "outlineColor": "hover:outline-stone-900"
            },
            "focus": {
                "outlineColor": "focus:outline-stone-900",
                "borderColor": "focus:border-stone-900"
            }
        },
        "stone-950": {
            "textColor": "text-stone-950",
            "bgColor": "bg-stone-950",
            "bgColorHalfOpacity": "bg-stone-950/50",
            "borderColor": "border-stone-950",
            "outlineColor": "outline-stone-950",
            "hexColor": "#0c0a09",
            "hover": {
                "textColor": "hover:text-stone-950",
                "bgColor": "hover:bg-stone-950",
                "bgColorHalfOpacity": "hover:bg-stone-950/50",
                "borderColor": "hover:border-stone-950",
                "outlineColor": "hover:outline-stone-950"
            },
            "focus": {
                "outlineColor": "focus:outline-stone-950",
                "borderColor": "focus:border-stone-950"
            }
        }
    },
    "red": {
        "red-50": {
            "textColor": "text-red-50",
            "bgColor": "bg-red-50",
            "bgColorHalfOpacity": "bg-red-50/50",
            "borderColor": "border-red-50",
            "outlineColor": "outline-red-50",
            "hexColor": "#fef2f2",
            "hover": {
                "textColor": "hover:text-red-50",
                "bgColor": "hover:bg-red-50",
                "bgColorHalfOpacity": "hover:bg-red-50/50",
                "borderColor": "hover:border-red-50",
                "outlineColor": "hover:outline-red-50"
            },
            "focus": {
                "outlineColor": "focus:outline-red-50",
                "borderColor": "focus:border-red-50"
            }
        },
        "red-100": {
            "textColor": "text-red-100",
            "bgColor": "bg-red-100",
            "bgColorHalfOpacity": "bg-red-100/50",
            "borderColor": "border-red-100",
            "outlineColor": "outline-red-100",
            "hexColor": "#fee2e2",
            "hover": {
                "textColor": "hover:text-red-100",
                "bgColor": "hover:bg-red-100",
                "bgColorHalfOpacity": "hover:bg-red-100/50",
                "borderColor": "hover:border-red-100",
                "outlineColor": "hover:outline-red-100"
            },
            "focus": {
                "outlineColor": "focus:outline-red-100",
                "borderColor": "focus:border-red-100"
            }
        },
        "red-200": {
            "textColor": "text-red-200",
            "bgColor": "bg-red-200",
            "bgColorHalfOpacity": "bg-red-200/50",
            "borderColor": "border-red-200",
            "outlineColor": "outline-red-200",
            "hexColor": "#fecaca",
            "hover": {
                "textColor": "hover:text-red-200",
                "bgColor": "hover:bg-red-200",
                "bgColorHalfOpacity": "hover:bg-red-200/50",
                "borderColor": "hover:border-red-200",
                "outlineColor": "hover:outline-red-200"
            },
            "focus": {
                "outlineColor": "focus:outline-red-200",
                "borderColor": "focus:border-red-200"
            }
        },
        "red-300": {
            "textColor": "text-red-300",
            "bgColor": "bg-red-300",
            "bgColorHalfOpacity": "bg-red-300/50",
            "borderColor": "border-red-300",
            "outlineColor": "outline-red-300",
            "hexColor": "#fca5a5",
            "hover": {
                "textColor": "hover:text-red-300",
                "bgColor": "hover:bg-red-300",
                "bgColorHalfOpacity": "hover:bg-red-300/50",
                "borderColor": "hover:border-red-300",
                "outlineColor": "hover:outline-red-300"
            },
            "focus": {
                "outlineColor": "focus:outline-red-300",
                "borderColor": "focus:border-red-300"
            }
        },
        "red-400": {
            "textColor": "text-red-400",
            "bgColor": "bg-red-400",
            "bgColorHalfOpacity": "bg-red-400/50",
            "borderColor": "border-red-400",
            "outlineColor": "outline-red-400",
            "hexColor": "#f87171",
            "hover": {
                "textColor": "hover:text-red-400",
                "bgColor": "hover:bg-red-400",
                "bgColorHalfOpacity": "hover:bg-red-400/50",
                "borderColor": "hover:border-red-400",
                "outlineColor": "hover:outline-red-400"
            },
            "focus": {
                "outlineColor": "focus:outline-red-400",
                "borderColor": "focus:border-red-400"
            }
        },
        "red-500": {
            "textColor": "text-red-500",
            "bgColor": "bg-red-500",
            "bgColorHalfOpacity": "bg-red-500/50",
            "borderColor": "border-red-500",
            "outlineColor": "outline-red-500",
            "hexColor": "#ef4444",
            "hover": {
                "textColor": "hover:text-red-500",
                "bgColor": "hover:bg-red-500",
                "bgColorHalfOpacity": "hover:bg-red-500/50",
                "borderColor": "hover:border-red-500",
                "outlineColor": "hover:outline-red-500"
            },
            "focus": {
                "outlineColor": "focus:outline-red-500",
                "borderColor": "focus:border-red-500"
            }
        },
        "red-600": {
            "textColor": "text-red-600",
            "bgColor": "bg-red-600",
            "bgColorHalfOpacity": "bg-red-600/50",
            "borderColor": "border-red-600",
            "outlineColor": "outline-red-600",
            "hexColor": "#dc2626",
            "hover": {
                "textColor": "hover:text-red-600",
                "bgColor": "hover:bg-red-600",
                "bgColorHalfOpacity": "hover:bg-red-600/50",
                "borderColor": "hover:border-red-600",
                "outlineColor": "hover:outline-red-600"
            },
            "focus": {
                "outlineColor": "focus:outline-red-600",
                "borderColor": "focus:border-red-600"
            }
        },
        "red-700": {
            "textColor": "text-red-700",
            "bgColor": "bg-red-700",
            "bgColorHalfOpacity": "bg-red-700/50",
            "borderColor": "border-red-700",
            "outlineColor": "outline-red-700",
            "hexColor": "#b91c1c",
            "hover": {
                "textColor": "hover:text-red-700",
                "bgColor": "hover:bg-red-700",
                "bgColorHalfOpacity": "hover:bg-red-700/50",
                "borderColor": "hover:border-red-700",
                "outlineColor": "hover:outline-red-700"
            },
            "focus": {
                "outlineColor": "focus:outline-red-700",
                "borderColor": "focus:border-red-700"
            }
        },
        "red-800": {
            "textColor": "text-red-800",
            "bgColor": "bg-red-800",
            "bgColorHalfOpacity": "bg-red-800/50",
            "borderColor": "border-red-800",
            "outlineColor": "outline-red-800",
            "hexColor": "#991b1b",
            "hover": {
                "textColor": "hover:text-red-800",
                "bgColor": "hover:bg-red-800",
                "bgColorHalfOpacity": "hover:bg-red-800/50",
                "borderColor": "hover:border-red-800",
                "outlineColor": "hover:outline-red-800"
            },
            "focus": {
                "outlineColor": "focus:outline-red-800",
                "borderColor": "focus:border-red-800"
            }
        },
        "red-900": {
            "textColor": "text-red-900",
            "bgColor": "bg-red-900",
            "bgColorHalfOpacity": "bg-red-900/50",
            "borderColor": "border-red-900",
            "outlineColor": "outline-red-900",
            "hexColor": "#7f1d1d",
            "hover": {
                "textColor": "hover:text-red-900",
                "bgColor": "hover:bg-red-900",
                "bgColorHalfOpacity": "hover:bg-red-900/50",
                "borderColor": "hover:border-red-900",
                "outlineColor": "hover:outline-red-900"
            },
            "focus": {
                "outlineColor": "focus:outline-red-900",
                "borderColor": "focus:border-red-900"
            }
        },
        "red-950": {
            "textColor": "text-red-950",
            "bgColor": "bg-red-950",
            "bgColorHalfOpacity": "bg-red-950/50",
            "borderColor": "border-red-950",
            "outlineColor": "outline-red-950",
            "hexColor": "#450a0a",
            "hover": {
                "textColor": "hover:text-red-950",
                "bgColor": "hover:bg-red-950",
                "bgColorHalfOpacity": "hover:bg-red-950/50",
                "borderColor": "hover:border-red-950",
                "outlineColor": "hover:outline-red-950"
            },
            "focus": {
                "outlineColor": "focus:outline-red-950",
                "borderColor": "focus:border-red-950"
            }
        }
    },
    "orange": {
        "orange-50": {
            "textColor": "text-orange-50",
            "bgColor": "bg-orange-50",
            "bgColorHalfOpacity": "bg-orange-50/50",
            "borderColor": "border-orange-50",
            "outlineColor": "outline-orange-50",
            "hexColor": "#fff7ed",
            "hover": {
                "textColor": "hover:text-orange-50",
                "bgColor": "hover:bg-orange-50",
                "bgColorHalfOpacity": "hover:bg-orange-50/50",
                "borderColor": "hover:border-orange-50",
                "outlineColor": "hover:outline-orange-50"
            },
            "focus": {
                "outlineColor": "focus:outline-orange-50",
                "borderColor": "focus:border-orange-50"
            }
        },
        "orange-100": {
            "textColor": "text-orange-100",
            "bgColor": "bg-orange-100",
            "bgColorHalfOpacity": "bg-orange-100/50",
            "borderColor": "border-orange-100",
            "outlineColor": "outline-orange-100",
            "hexColor": "#ffedd5",
            "hover": {
                "textColor": "hover:text-orange-100",
                "bgColor": "hover:bg-orange-100",
                "bgColorHalfOpacity": "hover:bg-orange-100/50",
                "borderColor": "hover:border-orange-100",
                "outlineColor": "hover:outline-orange-100"
            },
            "focus": {
                "outlineColor": "focus:outline-orange-100",
                "borderColor": "focus:border-orange-100"
            }
        },
        "orange-200": {
            "textColor": "text-orange-200",
            "bgColor": "bg-orange-200",
            "bgColorHalfOpacity": "bg-orange-200/50",
            "borderColor": "border-orange-200",
            "outlineColor": "outline-orange-200",
            "hexColor": "#fed7aa",
            "hover": {
                "textColor": "hover:text-orange-200",
                "bgColor": "hover:bg-orange-200",
                "bgColorHalfOpacity": "hover:bg-orange-200/50",
                "borderColor": "hover:border-orange-200",
                "outlineColor": "hover:outline-orange-200"
            },
            "focus": {
                "outlineColor": "focus:outline-orange-200",
                "borderColor": "focus:border-orange-200"
            }
        },
        "orange-300": {
            "textColor": "text-orange-300",
            "bgColor": "bg-orange-300",
            "bgColorHalfOpacity": "bg-orange-300/50",
            "borderColor": "border-orange-300",
            "outlineColor": "outline-orange-300",
            "hexColor": "#fdba74",
            "hover": {
                "textColor": "hover:text-orange-300",
                "bgColor": "hover:bg-orange-300",
                "bgColorHalfOpacity": "hover:bg-orange-300/50",
                "borderColor": "hover:border-orange-300",
                "outlineColor": "hover:outline-orange-300"
            },
            "focus": {
                "outlineColor": "focus:outline-orange-300",
                "borderColor": "focus:border-orange-300"
            }
        },
        "orange-400": {
            "textColor": "text-orange-400",
            "bgColor": "bg-orange-400",
            "bgColorHalfOpacity": "bg-orange-400/50",
            "borderColor": "border-orange-400",
            "outlineColor": "outline-orange-400",
            "hexColor": "#fb923c",
            "hover": {
                "textColor": "hover:text-orange-400",
                "bgColor": "hover:bg-orange-400",
                "bgColorHalfOpacity": "hover:bg-orange-400/50",
                "borderColor": "hover:border-orange-400",
                "outlineColor": "hover:outline-orange-400"
            },
            "focus": {
                "outlineColor": "focus:outline-orange-400",
                "borderColor": "focus:border-orange-400"
            }
        },
        "orange-500": {
            "textColor": "text-orange-500",
            "bgColor": "bg-orange-500",
            "bgColorHalfOpacity": "bg-orange-500/50",
            "borderColor": "border-orange-500",
            "outlineColor": "outline-orange-500",
            "hexColor": "#f97316",
            "hover": {
                "textColor": "hover:text-orange-500",
                "bgColor": "hover:bg-orange-500",
                "bgColorHalfOpacity": "hover:bg-orange-500/50",
                "borderColor": "hover:border-orange-500",
                "outlineColor": "hover:outline-orange-500"
            },
            "focus": {
                "outlineColor": "focus:outline-orange-500",
                "borderColor": "focus:border-orange-500"
            }
        },
        "orange-600": {
            "textColor": "text-orange-600",
            "bgColor": "bg-orange-600",
            "bgColorHalfOpacity": "bg-orange-600/50",
            "borderColor": "border-orange-600",
            "outlineColor": "outline-orange-600",
            "hexColor": "#ea580c",
            "hover": {
                "textColor": "hover:text-orange-600",
                "bgColor": "hover:bg-orange-600",
                "bgColorHalfOpacity": "hover:bg-orange-600/50",
                "borderColor": "hover:border-orange-600",
                "outlineColor": "hover:outline-orange-600"
            },
            "focus": {
                "outlineColor": "focus:outline-orange-600",
                "borderColor": "focus:border-orange-600"
            }
        },
        "orange-700": {
            "textColor": "text-orange-700",
            "bgColor": "bg-orange-700",
            "bgColorHalfOpacity": "bg-orange-700/50",
            "borderColor": "border-orange-700",
            "outlineColor": "outline-orange-700",
            "hexColor": "#c2410c",
            "hover": {
                "textColor": "hover:text-orange-700",
                "bgColor": "hover:bg-orange-700",
                "bgColorHalfOpacity": "hover:bg-orange-700/50",
                "borderColor": "hover:border-orange-700",
                "outlineColor": "hover:outline-orange-700"
            },
            "focus": {
                "outlineColor": "focus:outline-orange-700",
                "borderColor": "focus:border-orange-700"
            }
        },
        "orange-800": {
            "textColor": "text-orange-800",
            "bgColor": "bg-orange-800",
            "bgColorHalfOpacity": "bg-orange-800/50",
            "borderColor": "border-orange-800",
            "outlineColor": "outline-orange-800",
            "hexColor": "#9a3412",
            "hover": {
                "textColor": "hover:text-orange-800",
                "bgColor": "hover:bg-orange-800",
                "bgColorHalfOpacity": "hover:bg-orange-800/50",
                "borderColor": "hover:border-orange-800",
                "outlineColor": "hover:outline-orange-800"
            },
            "focus": {
                "outlineColor": "focus:outline-orange-800",
                "borderColor": "focus:border-orange-800"
            }
        },
        "orange-900": {
            "textColor": "text-orange-900",
            "bgColor": "bg-orange-900",
            "bgColorHalfOpacity": "bg-orange-900/50",
            "borderColor": "border-orange-900",
            "outlineColor": "outline-orange-900",
            "hexColor": "#7c2d12",
            "hover": {
                "textColor": "hover:text-orange-900",
                "bgColor": "hover:bg-orange-900",
                "bgColorHalfOpacity": "hover:bg-orange-900/50",
                "borderColor": "hover:border-orange-900",
                "outlineColor": "hover:outline-orange-900"
            },
            "focus": {
                "outlineColor": "focus:outline-orange-900",
                "borderColor": "focus:border-orange-900"
            }
        },
        "orange-950": {
            "textColor": "text-orange-950",
            "bgColor": "bg-orange-950",
            "bgColorHalfOpacity": "bg-orange-950/50",
            "borderColor": "border-orange-950",
            "outlineColor": "outline-orange-950",
            "hexColor": "#431407",
            "hover": {
                "textColor": "hover:text-orange-950",
                "bgColor": "hover:bg-orange-950",
                "bgColorHalfOpacity": "hover:bg-orange-950/50",
                "borderColor": "hover:border-orange-950",
                "outlineColor": "hover:outline-orange-950"
            },
            "focus": {
                "outlineColor": "focus:outline-orange-950",
                "borderColor": "focus:border-orange-950"
            }
        }
    },
    "amber": {
        "amber-50": {
            "textColor": "text-amber-50",
            "bgColor": "bg-amber-50",
            "bgColorHalfOpacity": "bg-amber-50/50",
            "borderColor": "border-amber-50",
            "outlineColor": "outline-amber-50",
            "hexColor": "#fffbeb",
            "hover": {
                "textColor": "hover:text-amber-50",
                "bgColor": "hover:bg-amber-50",
                "bgColorHalfOpacity": "hover:bg-amber-50/50",
                "borderColor": "hover:border-amber-50",
                "outlineColor": "hover:outline-amber-50"
            },
            "focus": {
                "outlineColor": "focus:outline-amber-50",
                "borderColor": "focus:border-amber-50"
            }
        },
        "amber-100": {
            "textColor": "text-amber-100",
            "bgColor": "bg-amber-100",
            "bgColorHalfOpacity": "bg-amber-100/50",
            "borderColor": "border-amber-100",
            "outlineColor": "outline-amber-100",
            "hexColor": "#fef3c7",
            "hover": {
                "textColor": "hover:text-amber-100",
                "bgColor": "hover:bg-amber-100",
                "bgColorHalfOpacity": "hover:bg-amber-100/50",
                "borderColor": "hover:border-amber-100",
                "outlineColor": "hover:outline-amber-100"
            },
            "focus": {
                "outlineColor": "focus:outline-amber-100",
                "borderColor": "focus:border-amber-100"
            }
        },
        "amber-200": {
            "textColor": "text-amber-200",
            "bgColor": "bg-amber-200",
            "bgColorHalfOpacity": "bg-amber-200/50",
            "borderColor": "border-amber-200",
            "outlineColor": "outline-amber-200",
            "hexColor": "#fde68a",
            "hover": {
                "textColor": "hover:text-amber-200",
                "bgColor": "hover:bg-amber-200",
                "bgColorHalfOpacity": "hover:bg-amber-200/50",
                "borderColor": "hover:border-amber-200",
                "outlineColor": "hover:outline-amber-200"
            },
            "focus": {
                "outlineColor": "focus:outline-amber-200",
                "borderColor": "focus:border-amber-200"
            }
        },
        "amber-300": {
            "textColor": "text-amber-300",
            "bgColor": "bg-amber-300",
            "bgColorHalfOpacity": "bg-amber-300/50",
            "borderColor": "border-amber-300",
            "outlineColor": "outline-amber-300",
            "hexColor": "#fcd34d",
            "hover": {
                "textColor": "hover:text-amber-300",
                "bgColor": "hover:bg-amber-300",
                "bgColorHalfOpacity": "hover:bg-amber-300/50",
                "borderColor": "hover:border-amber-300",
                "outlineColor": "hover:outline-amber-300"
            },
            "focus": {
                "outlineColor": "focus:outline-amber-300",
                "borderColor": "focus:border-amber-300"
            }
        },
        "amber-400": {
            "textColor": "text-amber-400",
            "bgColor": "bg-amber-400",
            "bgColorHalfOpacity": "bg-amber-400/50",
            "borderColor": "border-amber-400",
            "outlineColor": "outline-amber-400",
            "hexColor": "#fbbf24",
            "hover": {
                "textColor": "hover:text-amber-400",
                "bgColor": "hover:bg-amber-400",
                "bgColorHalfOpacity": "hover:bg-amber-400/50",
                "borderColor": "hover:border-amber-400",
                "outlineColor": "hover:outline-amber-400"
            },
            "focus": {
                "outlineColor": "focus:outline-amber-400",
                "borderColor": "focus:border-amber-400"
            }
        },
        "amber-500": {
            "textColor": "text-amber-500",
            "bgColor": "bg-amber-500",
            "bgColorHalfOpacity": "bg-amber-500/50",
            "borderColor": "border-amber-500",
            "outlineColor": "outline-amber-500",
            "hexColor": "#f59e0b",
            "hover": {
                "textColor": "hover:text-amber-500",
                "bgColor": "hover:bg-amber-500",
                "bgColorHalfOpacity": "hover:bg-amber-500/50",
                "borderColor": "hover:border-amber-500",
                "outlineColor": "hover:outline-amber-500"
            },
            "focus": {
                "outlineColor": "focus:outline-amber-500",
                "borderColor": "focus:border-amber-500"
            }
        },
        "amber-600": {
            "textColor": "text-amber-600",
            "bgColor": "bg-amber-600",
            "bgColorHalfOpacity": "bg-amber-600/50",
            "borderColor": "border-amber-600",
            "outlineColor": "outline-amber-600",
            "hexColor": "#d97706",
            "hover": {
                "textColor": "hover:text-amber-600",
                "bgColor": "hover:bg-amber-600",
                "bgColorHalfOpacity": "hover:bg-amber-600/50",
                "borderColor": "hover:border-amber-600",
                "outlineColor": "hover:outline-amber-600"
            },
            "focus": {
                "outlineColor": "focus:outline-amber-600",
                "borderColor": "focus:border-amber-600"
            }
        },
        "amber-700": {
            "textColor": "text-amber-700",
            "bgColor": "bg-amber-700",
            "bgColorHalfOpacity": "bg-amber-700/50",
            "borderColor": "border-amber-700",
            "outlineColor": "outline-amber-700",
            "hexColor": "#b45309",
            "hover": {
                "textColor": "hover:text-amber-700",
                "bgColor": "hover:bg-amber-700",
                "bgColorHalfOpacity": "hover:bg-amber-700/50",
                "borderColor": "hover:border-amber-700",
                "outlineColor": "hover:outline-amber-700"
            },
            "focus": {
                "outlineColor": "focus:outline-amber-700",
                "borderColor": "focus:border-amber-700"
            }
        },
        "amber-800": {
            "textColor": "text-amber-800",
            "bgColor": "bg-amber-800",
            "bgColorHalfOpacity": "bg-amber-800/50",
            "borderColor": "border-amber-800",
            "outlineColor": "outline-amber-800",
            "hexColor": "#92400e",
            "hover": {
                "textColor": "hover:text-amber-800",
                "bgColor": "hover:bg-amber-800",
                "bgColorHalfOpacity": "hover:bg-amber-800/50",
                "borderColor": "hover:border-amber-800",
                "outlineColor": "hover:outline-amber-800"
            },
            "focus": {
                "outlineColor": "focus:outline-amber-800",
                "borderColor": "focus:border-amber-800"
            }
        },
        "amber-900": {
            "textColor": "text-amber-900",
            "bgColor": "bg-amber-900",
            "bgColorHalfOpacity": "bg-amber-900/50",
            "borderColor": "border-amber-900",
            "outlineColor": "outline-amber-900",
            "hexColor": "#78350f",
            "hover": {
                "textColor": "hover:text-amber-900",
                "bgColor": "hover:bg-amber-900",
                "bgColorHalfOpacity": "hover:bg-amber-900/50",
                "borderColor": "hover:border-amber-900",
                "outlineColor": "hover:outline-amber-900"
            },
            "focus": {
                "outlineColor": "focus:outline-amber-900",
                "borderColor": "focus:border-amber-900"
            }
        },
        "amber-950": {
            "textColor": "text-amber-950",
            "bgColor": "bg-amber-950",
            "bgColorHalfOpacity": "bg-amber-950/50",
            "borderColor": "border-amber-950",
            "outlineColor": "outline-amber-950",
            "hexColor": "#451a03",
            "hover": {
                "textColor": "hover:text-amber-950",
                "bgColor": "hover:bg-amber-950",
                "bgColorHalfOpacity": "hover:bg-amber-950/50",
                "borderColor": "hover:border-amber-950",
                "outlineColor": "hover:outline-amber-950"
            },
            "focus": {
                "outlineColor": "focus:outline-amber-950",
                "borderColor": "focus:border-amber-950"
            }
        }
    },
    "yellow": {
        "yellow-50": {
            "textColor": "text-yellow-50",
            "bgColor": "bg-yellow-50",
            "bgColorHalfOpacity": "bg-yellow-50/50",
            "borderColor": "border-yellow-50",
            "outlineColor": "outline-yellow-50",
            "hexColor": "#fefce8",
            "hover": {
                "textColor": "hover:text-yellow-50",
                "bgColor": "hover:bg-yellow-50",
                "bgColorHalfOpacity": "hover:bg-yellow-50/50",
                "borderColor": "hover:border-yellow-50",
                "outlineColor": "hover:outline-yellow-50"
            },
            "focus": {
                "outlineColor": "focus:outline-yellow-50",
                "borderColor": "focus:border-yellow-50"
            }
        },
        "yellow-100": {
            "textColor": "text-yellow-100",
            "bgColor": "bg-yellow-100",
            "bgColorHalfOpacity": "bg-yellow-100/50",
            "borderColor": "border-yellow-100",
            "outlineColor": "outline-yellow-100",
            "hexColor": "#fef9c3",
            "hover": {
                "textColor": "hover:text-yellow-100",
                "bgColor": "hover:bg-yellow-100",
                "bgColorHalfOpacity": "hover:bg-yellow-100/50",
                "borderColor": "hover:border-yellow-100",
                "outlineColor": "hover:outline-yellow-100"
            },
            "focus": {
                "outlineColor": "focus:outline-yellow-100",
                "borderColor": "focus:border-yellow-100"
            }
        },
        "yellow-200": {
            "textColor": "text-yellow-200",
            "bgColor": "bg-yellow-200",
            "bgColorHalfOpacity": "bg-yellow-200/50",
            "borderColor": "border-yellow-200",
            "outlineColor": "outline-yellow-200",
            "hexColor": "#fef08a",
            "hover": {
                "textColor": "hover:text-yellow-200",
                "bgColor": "hover:bg-yellow-200",
                "bgColorHalfOpacity": "hover:bg-yellow-200/50",
                "borderColor": "hover:border-yellow-200",
                "outlineColor": "hover:outline-yellow-200"
            },
            "focus": {
                "outlineColor": "focus:outline-yellow-200",
                "borderColor": "focus:border-yellow-200"
            }
        },
        "yellow-300": {
            "textColor": "text-yellow-300",
            "bgColor": "bg-yellow-300",
            "bgColorHalfOpacity": "bg-yellow-300/50",
            "borderColor": "border-yellow-300",
            "outlineColor": "outline-yellow-300",
            "hexColor": "#fde047",
            "hover": {
                "textColor": "hover:text-yellow-300",
                "bgColor": "hover:bg-yellow-300",
                "bgColorHalfOpacity": "hover:bg-yellow-300/50",
                "borderColor": "hover:border-yellow-300",
                "outlineColor": "hover:outline-yellow-300"
            },
            "focus": {
                "outlineColor": "focus:outline-yellow-300",
                "borderColor": "focus:border-yellow-300"
            }
        },
        "yellow-400": {
            "textColor": "text-yellow-400",
            "bgColor": "bg-yellow-400",
            "bgColorHalfOpacity": "bg-yellow-400/50",
            "borderColor": "border-yellow-400",
            "outlineColor": "outline-yellow-400",
            "hexColor": "#facc15",
            "hover": {
                "textColor": "hover:text-yellow-400",
                "bgColor": "hover:bg-yellow-400",
                "bgColorHalfOpacity": "hover:bg-yellow-400/50",
                "borderColor": "hover:border-yellow-400",
                "outlineColor": "hover:outline-yellow-400"
            },
            "focus": {
                "outlineColor": "focus:outline-yellow-400",
                "borderColor": "focus:border-yellow-400"
            }
        },
        "yellow-500": {
            "textColor": "text-yellow-500",
            "bgColor": "bg-yellow-500",
            "bgColorHalfOpacity": "bg-yellow-500/50",
            "borderColor": "border-yellow-500",
            "outlineColor": "outline-yellow-500",
            "hexColor": "#eab308",
            "hover": {
                "textColor": "hover:text-yellow-500",
                "bgColor": "hover:bg-yellow-500",
                "bgColorHalfOpacity": "hover:bg-yellow-500/50",
                "borderColor": "hover:border-yellow-500",
                "outlineColor": "hover:outline-yellow-500"
            },
            "focus": {
                "outlineColor": "focus:outline-yellow-500",
                "borderColor": "focus:border-yellow-500"
            }
        },
        "yellow-600": {
            "textColor": "text-yellow-600",
            "bgColor": "bg-yellow-600",
            "bgColorHalfOpacity": "bg-yellow-600/50",
            "borderColor": "border-yellow-600",
            "outlineColor": "outline-yellow-600",
            "hexColor": "#ca8a04",
            "hover": {
                "textColor": "hover:text-yellow-600",
                "bgColor": "hover:bg-yellow-600",
                "bgColorHalfOpacity": "hover:bg-yellow-600/50",
                "borderColor": "hover:border-yellow-600",
                "outlineColor": "hover:outline-yellow-600"
            },
            "focus": {
                "outlineColor": "focus:outline-yellow-600",
                "borderColor": "focus:border-yellow-600"
            }
        },
        "yellow-700": {
            "textColor": "text-yellow-700",
            "bgColor": "bg-yellow-700",
            "bgColorHalfOpacity": "bg-yellow-700/50",
            "borderColor": "border-yellow-700",
            "outlineColor": "outline-yellow-700",
            "hexColor": "#a16207",
            "hover": {
                "textColor": "hover:text-yellow-700",
                "bgColor": "hover:bg-yellow-700",
                "bgColorHalfOpacity": "hover:bg-yellow-700/50",
                "borderColor": "hover:border-yellow-700",
                "outlineColor": "hover:outline-yellow-700"
            },
            "focus": {
                "outlineColor": "focus:outline-yellow-700",
                "borderColor": "focus:border-yellow-700"
            }
        },
        "yellow-800": {
            "textColor": "text-yellow-800",
            "bgColor": "bg-yellow-800",
            "bgColorHalfOpacity": "bg-yellow-800/50",
            "borderColor": "border-yellow-800",
            "outlineColor": "outline-yellow-800",
            "hexColor": "#854d0e",
            "hover": {
                "textColor": "hover:text-yellow-800",
                "bgColor": "hover:bg-yellow-800",
                "bgColorHalfOpacity": "hover:bg-yellow-800/50",
                "borderColor": "hover:border-yellow-800",
                "outlineColor": "hover:outline-yellow-800"
            },
            "focus": {
                "outlineColor": "focus:outline-yellow-800",
                "borderColor": "focus:border-yellow-800"
            }
        },
        "yellow-900": {
            "textColor": "text-yellow-900",
            "bgColor": "bg-yellow-900",
            "bgColorHalfOpacity": "bg-yellow-900/50",
            "borderColor": "border-yellow-900",
            "outlineColor": "outline-yellow-900",
            "hexColor": "#713f12",
            "hover": {
                "textColor": "hover:text-yellow-900",
                "bgColor": "hover:bg-yellow-900",
                "bgColorHalfOpacity": "hover:bg-yellow-900/50",
                "borderColor": "hover:border-yellow-900",
                "outlineColor": "hover:outline-yellow-900"
            },
            "focus": {
                "outlineColor": "focus:outline-yellow-900",
                "borderColor": "focus:border-yellow-900"
            }
        },
        "yellow-950": {
            "textColor": "text-yellow-950",
            "bgColor": "bg-yellow-950",
            "bgColorHalfOpacity": "bg-yellow-950/50",
            "borderColor": "border-yellow-950",
            "outlineColor": "outline-yellow-950",
            "hexColor": "#422006",
            "hover": {
                "textColor": "hover:text-yellow-950",
                "bgColor": "hover:bg-yellow-950",
                "bgColorHalfOpacity": "hover:bg-yellow-950/50",
                "borderColor": "hover:border-yellow-950",
                "outlineColor": "hover:outline-yellow-950"
            },
            "focus": {
                "outlineColor": "focus:outline-yellow-950",
                "borderColor": "focus:border-yellow-950"
            }
        }
    },
    "lime": {
        "lime-50": {
            "textColor": "text-lime-50",
            "bgColor": "bg-lime-50",
            "bgColorHalfOpacity": "bg-lime-50/50",
            "borderColor": "border-lime-50",
            "outlineColor": "outline-lime-50",
            "hexColor": "#f7fee7",
            "hover": {
                "textColor": "hover:text-lime-50",
                "bgColor": "hover:bg-lime-50",
                "bgColorHalfOpacity": "hover:bg-lime-50/50",
                "borderColor": "hover:border-lime-50",
                "outlineColor": "hover:outline-lime-50"
            },
            "focus": {
                "outlineColor": "focus:outline-lime-50",
                "borderColor": "focus:border-lime-50"
            }
        },
        "lime-100": {
            "textColor": "text-lime-100",
            "bgColor": "bg-lime-100",
            "bgColorHalfOpacity": "bg-lime-100/50",
            "borderColor": "border-lime-100",
            "outlineColor": "outline-lime-100",
            "hexColor": "#ecfccb",
            "hover": {
                "textColor": "hover:text-lime-100",
                "bgColor": "hover:bg-lime-100",
                "bgColorHalfOpacity": "hover:bg-lime-100/50",
                "borderColor": "hover:border-lime-100",
                "outlineColor": "hover:outline-lime-100"
            },
            "focus": {
                "outlineColor": "focus:outline-lime-100",
                "borderColor": "focus:border-lime-100"
            }
        },
        "lime-200": {
            "textColor": "text-lime-200",
            "bgColor": "bg-lime-200",
            "bgColorHalfOpacity": "bg-lime-200/50",
            "borderColor": "border-lime-200",
            "outlineColor": "outline-lime-200",
            "hexColor": "#d9f99d",
            "hover": {
                "textColor": "hover:text-lime-200",
                "bgColor": "hover:bg-lime-200",
                "bgColorHalfOpacity": "hover:bg-lime-200/50",
                "borderColor": "hover:border-lime-200",
                "outlineColor": "hover:outline-lime-200"
            },
            "focus": {
                "outlineColor": "focus:outline-lime-200",
                "borderColor": "focus:border-lime-200"
            }
        },
        "lime-300": {
            "textColor": "text-lime-300",
            "bgColor": "bg-lime-300",
            "bgColorHalfOpacity": "bg-lime-300/50",
            "borderColor": "border-lime-300",
            "outlineColor": "outline-lime-300",
            "hexColor": "#bef264",
            "hover": {
                "textColor": "hover:text-lime-300",
                "bgColor": "hover:bg-lime-300",
                "bgColorHalfOpacity": "hover:bg-lime-300/50",
                "borderColor": "hover:border-lime-300",
                "outlineColor": "hover:outline-lime-300"
            },
            "focus": {
                "outlineColor": "focus:outline-lime-300",
                "borderColor": "focus:border-lime-300"
            }
        },
        "lime-400": {
            "textColor": "text-lime-400",
            "bgColor": "bg-lime-400",
            "bgColorHalfOpacity": "bg-lime-400/50",
            "borderColor": "border-lime-400",
            "outlineColor": "outline-lime-400",
            "hexColor": "#a3e635",
            "hover": {
                "textColor": "hover:text-lime-400",
                "bgColor": "hover:bg-lime-400",
                "bgColorHalfOpacity": "hover:bg-lime-400/50",
                "borderColor": "hover:border-lime-400",
                "outlineColor": "hover:outline-lime-400"
            },
            "focus": {
                "outlineColor": "focus:outline-lime-400",
                "borderColor": "focus:border-lime-400"
            }
        },
        "lime-500": {
            "textColor": "text-lime-500",
            "bgColor": "bg-lime-500",
            "bgColorHalfOpacity": "bg-lime-500/50",
            "borderColor": "border-lime-500",
            "outlineColor": "outline-lime-500",
            "hexColor": "#84cc16",
            "hover": {
                "textColor": "hover:text-lime-500",
                "bgColor": "hover:bg-lime-500",
                "bgColorHalfOpacity": "hover:bg-lime-500/50",
                "borderColor": "hover:border-lime-500",
                "outlineColor": "hover:outline-lime-500"
            },
            "focus": {
                "outlineColor": "focus:outline-lime-500",
                "borderColor": "focus:border-lime-500"
            }
        },
        "lime-600": {
            "textColor": "text-lime-600",
            "bgColor": "bg-lime-600",
            "bgColorHalfOpacity": "bg-lime-600/50",
            "borderColor": "border-lime-600",
            "outlineColor": "outline-lime-600",
            "hexColor": "#65a30d",
            "hover": {
                "textColor": "hover:text-lime-600",
                "bgColor": "hover:bg-lime-600",
                "bgColorHalfOpacity": "hover:bg-lime-600/50",
                "borderColor": "hover:border-lime-600",
                "outlineColor": "hover:outline-lime-600"
            },
            "focus": {
                "outlineColor": "focus:outline-lime-600",
                "borderColor": "focus:border-lime-600"
            }
        },
        "lime-700": {
            "textColor": "text-lime-700",
            "bgColor": "bg-lime-700",
            "bgColorHalfOpacity": "bg-lime-700/50",
            "borderColor": "border-lime-700",
            "outlineColor": "outline-lime-700",
            "hexColor": "#4d7c0f",
            "hover": {
                "textColor": "hover:text-lime-700",
                "bgColor": "hover:bg-lime-700",
                "bgColorHalfOpacity": "hover:bg-lime-700/50",
                "borderColor": "hover:border-lime-700",
                "outlineColor": "hover:outline-lime-700"
            },
            "focus": {
                "outlineColor": "focus:outline-lime-700",
                "borderColor": "focus:border-lime-700"
            }
        },
        "lime-800": {
            "textColor": "text-lime-800",
            "bgColor": "bg-lime-800",
            "bgColorHalfOpacity": "bg-lime-800/50",
            "borderColor": "border-lime-800",
            "outlineColor": "outline-lime-800",
            "hexColor": "#3f6212",
            "hover": {
                "textColor": "hover:text-lime-800",
                "bgColor": "hover:bg-lime-800",
                "bgColorHalfOpacity": "hover:bg-lime-800/50",
                "borderColor": "hover:border-lime-800",
                "outlineColor": "hover:outline-lime-800"
            },
            "focus": {
                "outlineColor": "focus:outline-lime-800",
                "borderColor": "focus:border-lime-800"
            }
        },
        "lime-900": {
            "textColor": "text-lime-900",
            "bgColor": "bg-lime-900",
            "bgColorHalfOpacity": "bg-lime-900/50",
            "borderColor": "border-lime-900",
            "outlineColor": "outline-lime-900",
            "hexColor": "#365314",
            "hover": {
                "textColor": "hover:text-lime-900",
                "bgColor": "hover:bg-lime-900",
                "bgColorHalfOpacity": "hover:bg-lime-900/50",
                "borderColor": "hover:border-lime-900",
                "outlineColor": "hover:outline-lime-900"
            },
            "focus": {
                "outlineColor": "focus:outline-lime-900",
                "borderColor": "focus:border-lime-900"
            }
        },
        "lime-950": {
            "textColor": "text-lime-950",
            "bgColor": "bg-lime-950",
            "bgColorHalfOpacity": "bg-lime-950/50",
            "borderColor": "border-lime-950",
            "outlineColor": "outline-lime-950",
            "hexColor": "#1a2e05",
            "hover": {
                "textColor": "hover:text-lime-950",
                "bgColor": "hover:bg-lime-950",
                "bgColorHalfOpacity": "hover:bg-lime-950/50",
                "borderColor": "hover:border-lime-950",
                "outlineColor": "hover:outline-lime-950"
            },
            "focus": {
                "outlineColor": "focus:outline-lime-950",
                "borderColor": "focus:border-lime-950"
            }
        }
    },
    "green": {
        "green-50": {
            "textColor": "text-green-50",
            "bgColor": "bg-green-50",
            "bgColorHalfOpacity": "bg-green-50/50",
            "borderColor": "border-green-50",
            "outlineColor": "outline-green-50",
            "hexColor": "#f0fdf4",
            "hover": {
                "textColor": "hover:text-green-50",
                "bgColor": "hover:bg-green-50",
                "bgColorHalfOpacity": "hover:bg-green-50/50",
                "borderColor": "hover:border-green-50",
                "outlineColor": "hover:outline-green-50"
            },
            "focus": {
                "outlineColor": "focus:outline-green-50",
                "borderColor": "focus:border-green-50"
            }
        },
        "green-100": {
            "textColor": "text-green-100",
            "bgColor": "bg-green-100",
            "bgColorHalfOpacity": "bg-green-100/50",
            "borderColor": "border-green-100",
            "outlineColor": "outline-green-100",
            "hexColor": "#dcfce7",
            "hover": {
                "textColor": "hover:text-green-100",
                "bgColor": "hover:bg-green-100",
                "bgColorHalfOpacity": "hover:bg-green-100/50",
                "borderColor": "hover:border-green-100",
                "outlineColor": "hover:outline-green-100"
            },
            "focus": {
                "outlineColor": "focus:outline-green-100",
                "borderColor": "focus:border-green-100"
            }
        },
        "green-200": {
            "textColor": "text-green-200",
            "bgColor": "bg-green-200",
            "bgColorHalfOpacity": "bg-green-200/50",
            "borderColor": "border-green-200",
            "outlineColor": "outline-green-200",
            "hexColor": "#bbf7d0",
            "hover": {
                "textColor": "hover:text-green-200",
                "bgColor": "hover:bg-green-200",
                "bgColorHalfOpacity": "hover:bg-green-200/50",
                "borderColor": "hover:border-green-200",
                "outlineColor": "hover:outline-green-200"
            },
            "focus": {
                "outlineColor": "focus:outline-green-200",
                "borderColor": "focus:border-green-200"
            }
        },
        "green-300": {
            "textColor": "text-green-300",
            "bgColor": "bg-green-300",
            "bgColorHalfOpacity": "bg-green-300/50",
            "borderColor": "border-green-300",
            "outlineColor": "outline-green-300",
            "hexColor": "#86efac",
            "hover": {
                "textColor": "hover:text-green-300",
                "bgColor": "hover:bg-green-300",
                "bgColorHalfOpacity": "hover:bg-green-300/50",
                "borderColor": "hover:border-green-300",
                "outlineColor": "hover:outline-green-300"
            },
            "focus": {
                "outlineColor": "focus:outline-green-300",
                "borderColor": "focus:border-green-300"
            }
        },
        "green-400": {
            "textColor": "text-green-400",
            "bgColor": "bg-green-400",
            "bgColorHalfOpacity": "bg-green-400/50",
            "borderColor": "border-green-400",
            "outlineColor": "outline-green-400",
            "hexColor": "#4ade80",
            "hover": {
                "textColor": "hover:text-green-400",
                "bgColor": "hover:bg-green-400",
                "bgColorHalfOpacity": "hover:bg-green-400/50",
                "borderColor": "hover:border-green-400",
                "outlineColor": "hover:outline-green-400"
            },
            "focus": {
                "outlineColor": "focus:outline-green-400",
                "borderColor": "focus:border-green-400"
            }
        },
        "green-500": {
            "textColor": "text-green-500",
            "bgColor": "bg-green-500",
            "bgColorHalfOpacity": "bg-green-500/50",
            "borderColor": "border-green-500",
            "outlineColor": "outline-green-500",
            "hexColor": "#22c55e",
            "hover": {
                "textColor": "hover:text-green-500",
                "bgColor": "hover:bg-green-500",
                "bgColorHalfOpacity": "hover:bg-green-500/50",
                "borderColor": "hover:border-green-500",
                "outlineColor": "hover:outline-green-500"
            },
            "focus": {
                "outlineColor": "focus:outline-green-500",
                "borderColor": "focus:border-green-500"
            }
        },
        "green-600": {
            "textColor": "text-green-600",
            "bgColor": "bg-green-600",
            "bgColorHalfOpacity": "bg-green-600/50",
            "borderColor": "border-green-600",
            "outlineColor": "outline-green-600",
            "hexColor": "#16a34a",
            "hover": {
                "textColor": "hover:text-green-600",
                "bgColor": "hover:bg-green-600",
                "bgColorHalfOpacity": "hover:bg-green-600/50",
                "borderColor": "hover:border-green-600",
                "outlineColor": "hover:outline-green-600"
            },
            "focus": {
                "outlineColor": "focus:outline-green-600",
                "borderColor": "focus:border-green-600"
            }
        },
        "green-700": {
            "textColor": "text-green-700",
            "bgColor": "bg-green-700",
            "bgColorHalfOpacity": "bg-green-700/50",
            "borderColor": "border-green-700",
            "outlineColor": "outline-green-700",
            "hexColor": "#15803d",
            "hover": {
                "textColor": "hover:text-green-700",
                "bgColor": "hover:bg-green-700",
                "bgColorHalfOpacity": "hover:bg-green-700/50",
                "borderColor": "hover:border-green-700",
                "outlineColor": "hover:outline-green-700"
            },
            "focus": {
                "outlineColor": "focus:outline-green-700",
                "borderColor": "focus:border-green-700"
            }
        },
        "green-800": {
            "textColor": "text-green-800",
            "bgColor": "bg-green-800",
            "bgColorHalfOpacity": "bg-green-800/50",
            "borderColor": "border-green-800",
            "outlineColor": "outline-green-800",
            "hexColor": "#166534",
            "hover": {
                "textColor": "hover:text-green-800",
                "bgColor": "hover:bg-green-800",
                "bgColorHalfOpacity": "hover:bg-green-800/50",
                "borderColor": "hover:border-green-800",
                "outlineColor": "hover:outline-green-800"
            },
            "focus": {
                "outlineColor": "focus:outline-green-800",
                "borderColor": "focus:border-green-800"
            }
        },
        "green-900": {
            "textColor": "text-green-900",
            "bgColor": "bg-green-900",
            "bgColorHalfOpacity": "bg-green-900/50",
            "borderColor": "border-green-900",
            "outlineColor": "outline-green-900",
            "hexColor": "#14532d",
            "hover": {
                "textColor": "hover:text-green-900",
                "bgColor": "hover:bg-green-900",
                "bgColorHalfOpacity": "hover:bg-green-900/50",
                "borderColor": "hover:border-green-900",
                "outlineColor": "hover:outline-green-900"
            },
            "focus": {
                "outlineColor": "focus:outline-green-900",
                "borderColor": "focus:border-green-900"
            }
        },
        "green-950": {
            "textColor": "text-green-950",
            "bgColor": "bg-green-950",
            "bgColorHalfOpacity": "bg-green-950/50",
            "borderColor": "border-green-950",
            "outlineColor": "outline-green-950",
            "hexColor": "#052e16",
            "hover": {
                "textColor": "hover:text-green-950",
                "bgColor": "hover:bg-green-950",
                "bgColorHalfOpacity": "hover:bg-green-950/50",
                "borderColor": "hover:border-green-950",
                "outlineColor": "hover:outline-green-950"
            },
            "focus": {
                "outlineColor": "focus:outline-green-950",
                "borderColor": "focus:border-green-950"
            }
        }
    },
    "emerald": {
        "emerald-50": {
            "textColor": "text-emerald-50",
            "bgColor": "bg-emerald-50",
            "bgColorHalfOpacity": "bg-emerald-50/50",
            "borderColor": "border-emerald-50",
            "outlineColor": "outline-emerald-50",
            "hexColor": "#ecfdf5",
            "hover": {
                "textColor": "hover:text-emerald-50",
                "bgColor": "hover:bg-emerald-50",
                "bgColorHalfOpacity": "hover:bg-emerald-50/50",
                "borderColor": "hover:border-emerald-50",
                "outlineColor": "hover:outline-emerald-50"
            },
            "focus": {
                "outlineColor": "focus:outline-emerald-50",
                "borderColor": "focus:border-emerald-50"
            }
        },
        "emerald-100": {
            "textColor": "text-emerald-100",
            "bgColor": "bg-emerald-100",
            "bgColorHalfOpacity": "bg-emerald-100/50",
            "borderColor": "border-emerald-100",
            "outlineColor": "outline-emerald-100",
            "hexColor": "#d1fae5",
            "hover": {
                "textColor": "hover:text-emerald-100",
                "bgColor": "hover:bg-emerald-100",
                "bgColorHalfOpacity": "hover:bg-emerald-100/50",
                "borderColor": "hover:border-emerald-100",
                "outlineColor": "hover:outline-emerald-100"
            },
            "focus": {
                "outlineColor": "focus:outline-emerald-100",
                "borderColor": "focus:border-emerald-100"
            }
        },
        "emerald-200": {
            "textColor": "text-emerald-200",
            "bgColor": "bg-emerald-200",
            "bgColorHalfOpacity": "bg-emerald-200/50",
            "borderColor": "border-emerald-200",
            "outlineColor": "outline-emerald-200",
            "hexColor": "#a7f3d0",
            "hover": {
                "textColor": "hover:text-emerald-200",
                "bgColor": "hover:bg-emerald-200",
                "bgColorHalfOpacity": "hover:bg-emerald-200/50",
                "borderColor": "hover:border-emerald-200",
                "outlineColor": "hover:outline-emerald-200"
            },
            "focus": {
                "outlineColor": "focus:outline-emerald-200",
                "borderColor": "focus:border-emerald-200"
            }
        },
        "emerald-300": {
            "textColor": "text-emerald-300",
            "bgColor": "bg-emerald-300",
            "bgColorHalfOpacity": "bg-emerald-300/50",
            "borderColor": "border-emerald-300",
            "outlineColor": "outline-emerald-300",
            "hexColor": "#6ee7b7",
            "hover": {
                "textColor": "hover:text-emerald-300",
                "bgColor": "hover:bg-emerald-300",
                "bgColorHalfOpacity": "hover:bg-emerald-300/50",
                "borderColor": "hover:border-emerald-300",
                "outlineColor": "hover:outline-emerald-300"
            },
            "focus": {
                "outlineColor": "focus:outline-emerald-300",
                "borderColor": "focus:border-emerald-300"
            }
        },
        "emerald-400": {
            "textColor": "text-emerald-400",
            "bgColor": "bg-emerald-400",
            "bgColorHalfOpacity": "bg-emerald-400/50",
            "borderColor": "border-emerald-400",
            "outlineColor": "outline-emerald-400",
            "hexColor": "#34d399",
            "hover": {
                "textColor": "hover:text-emerald-400",
                "bgColor": "hover:bg-emerald-400",
                "bgColorHalfOpacity": "hover:bg-emerald-400/50",
                "borderColor": "hover:border-emerald-400",
                "outlineColor": "hover:outline-emerald-400"
            },
            "focus": {
                "outlineColor": "focus:outline-emerald-400",
                "borderColor": "focus:border-emerald-400"
            }
        },
        "emerald-500": {
            "textColor": "text-emerald-500",
            "bgColor": "bg-emerald-500",
            "bgColorHalfOpacity": "bg-emerald-500/50",
            "borderColor": "border-emerald-500",
            "outlineColor": "outline-emerald-500",
            "hexColor": "#10b981",
            "hover": {
                "textColor": "hover:text-emerald-500",
                "bgColor": "hover:bg-emerald-500",
                "bgColorHalfOpacity": "hover:bg-emerald-500/50",
                "borderColor": "hover:border-emerald-500",
                "outlineColor": "hover:outline-emerald-500"
            },
            "focus": {
                "outlineColor": "focus:outline-emerald-500",
                "borderColor": "focus:border-emerald-500"
            }
        },
        "emerald-600": {
            "textColor": "text-emerald-600",
            "bgColor": "bg-emerald-600",
            "bgColorHalfOpacity": "bg-emerald-600/50",
            "borderColor": "border-emerald-600",
            "outlineColor": "outline-emerald-600",
            "hexColor": "#059669",
            "hover": {
                "textColor": "hover:text-emerald-600",
                "bgColor": "hover:bg-emerald-600",
                "bgColorHalfOpacity": "hover:bg-emerald-600/50",
                "borderColor": "hover:border-emerald-600",
                "outlineColor": "hover:outline-emerald-600"
            },
            "focus": {
                "outlineColor": "focus:outline-emerald-600",
                "borderColor": "focus:border-emerald-600"
            }
        },
        "emerald-700": {
            "textColor": "text-emerald-700",
            "bgColor": "bg-emerald-700",
            "bgColorHalfOpacity": "bg-emerald-700/50",
            "borderColor": "border-emerald-700",
            "outlineColor": "outline-emerald-700",
            "hexColor": "#047857",
            "hover": {
                "textColor": "hover:text-emerald-700",
                "bgColor": "hover:bg-emerald-700",
                "bgColorHalfOpacity": "hover:bg-emerald-700/50",
                "borderColor": "hover:border-emerald-700",
                "outlineColor": "hover:outline-emerald-700"
            },
            "focus": {
                "outlineColor": "focus:outline-emerald-700",
                "borderColor": "focus:border-emerald-700"
            }
        },
        "emerald-800": {
            "textColor": "text-emerald-800",
            "bgColor": "bg-emerald-800",
            "bgColorHalfOpacity": "bg-emerald-800/50",
            "borderColor": "border-emerald-800",
            "outlineColor": "outline-emerald-800",
            "hexColor": "#065f46",
            "hover": {
                "textColor": "hover:text-emerald-800",
                "bgColor": "hover:bg-emerald-800",
                "bgColorHalfOpacity": "hover:bg-emerald-800/50",
                "borderColor": "hover:border-emerald-800",
                "outlineColor": "hover:outline-emerald-800"
            },
            "focus": {
                "outlineColor": "focus:outline-emerald-800",
                "borderColor": "focus:border-emerald-800"
            }
        },
        "emerald-900": {
            "textColor": "text-emerald-900",
            "bgColor": "bg-emerald-900",
            "bgColorHalfOpacity": "bg-emerald-900/50",
            "borderColor": "border-emerald-900",
            "outlineColor": "outline-emerald-900",
            "hexColor": "#064e3b",
            "hover": {
                "textColor": "hover:text-emerald-900",
                "bgColor": "hover:bg-emerald-900",
                "bgColorHalfOpacity": "hover:bg-emerald-900/50",
                "borderColor": "hover:border-emerald-900",
                "outlineColor": "hover:outline-emerald-900"
            },
            "focus": {
                "outlineColor": "focus:outline-emerald-900",
                "borderColor": "focus:border-emerald-900"
            }
        },
        "emerald-950": {
            "textColor": "text-emerald-950",
            "bgColor": "bg-emerald-950",
            "bgColorHalfOpacity": "bg-emerald-950/50",
            "borderColor": "border-emerald-950",
            "outlineColor": "outline-emerald-950",
            "hexColor": "#022c22",
            "hover": {
                "textColor": "hover:text-emerald-950",
                "bgColor": "hover:bg-emerald-950",
                "bgColorHalfOpacity": "hover:bg-emerald-950/50",
                "borderColor": "hover:border-emerald-950",
                "outlineColor": "hover:outline-emerald-950"
            },
            "focus": {
                "outlineColor": "focus:outline-emerald-950",
                "borderColor": "focus:border-emerald-950"
            }
        }
    },
    "teal": {
        "teal-50": {
            "textColor": "text-teal-50",
            "bgColor": "bg-teal-50",
            "bgColorHalfOpacity": "bg-teal-50/50",
            "borderColor": "border-teal-50",
            "outlineColor": "outline-teal-50",
            "hexColor": "#f0fdfa",
            "hover": {
                "textColor": "hover:text-teal-50",
                "bgColor": "hover:bg-teal-50",
                "bgColorHalfOpacity": "hover:bg-teal-50/50",
                "borderColor": "hover:border-teal-50",
                "outlineColor": "hover:outline-teal-50"
            },
            "focus": {
                "outlineColor": "focus:outline-teal-50",
                "borderColor": "focus:border-teal-50"
            }
        },
        "teal-100": {
            "textColor": "text-teal-100",
            "bgColor": "bg-teal-100",
            "bgColorHalfOpacity": "bg-teal-100/50",
            "borderColor": "border-teal-100",
            "outlineColor": "outline-teal-100",
            "hexColor": "#ccfbf1",
            "hover": {
                "textColor": "hover:text-teal-100",
                "bgColor": "hover:bg-teal-100",
                "bgColorHalfOpacity": "hover:bg-teal-100/50",
                "borderColor": "hover:border-teal-100",
                "outlineColor": "hover:outline-teal-100"
            },
            "focus": {
                "outlineColor": "focus:outline-teal-100",
                "borderColor": "focus:border-teal-100"
            }
        },
        "teal-200": {
            "textColor": "text-teal-200",
            "bgColor": "bg-teal-200",
            "bgColorHalfOpacity": "bg-teal-200/50",
            "borderColor": "border-teal-200",
            "outlineColor": "outline-teal-200",
            "hexColor": "#99f6e4",
            "hover": {
                "textColor": "hover:text-teal-200",
                "bgColor": "hover:bg-teal-200",
                "bgColorHalfOpacity": "hover:bg-teal-200/50",
                "borderColor": "hover:border-teal-200",
                "outlineColor": "hover:outline-teal-200"
            },
            "focus": {
                "outlineColor": "focus:outline-teal-200",
                "borderColor": "focus:border-teal-200"
            }
        },
        "teal-300": {
            "textColor": "text-teal-300",
            "bgColor": "bg-teal-300",
            "bgColorHalfOpacity": "bg-teal-300/50",
            "borderColor": "border-teal-300",
            "outlineColor": "outline-teal-300",
            "hexColor": "#5eead4",
            "hover": {
                "textColor": "hover:text-teal-300",
                "bgColor": "hover:bg-teal-300",
                "bgColorHalfOpacity": "hover:bg-teal-300/50",
                "borderColor": "hover:border-teal-300",
                "outlineColor": "hover:outline-teal-300"
            },
            "focus": {
                "outlineColor": "focus:outline-teal-300",
                "borderColor": "focus:border-teal-300"
            }
        },
        "teal-400": {
            "textColor": "text-teal-400",
            "bgColor": "bg-teal-400",
            "bgColorHalfOpacity": "bg-teal-400/50",
            "borderColor": "border-teal-400",
            "outlineColor": "outline-teal-400",
            "hexColor": "#2dd4bf",
            "hover": {
                "textColor": "hover:text-teal-400",
                "bgColor": "hover:bg-teal-400",
                "bgColorHalfOpacity": "hover:bg-teal-400/50",
                "borderColor": "hover:border-teal-400",
                "outlineColor": "hover:outline-teal-400"
            },
            "focus": {
                "outlineColor": "focus:outline-teal-400",
                "borderColor": "focus:border-teal-400"
            }
        },
        "teal-500": {
            "textColor": "text-teal-500",
            "bgColor": "bg-teal-500",
            "bgColorHalfOpacity": "bg-teal-500/50",
            "borderColor": "border-teal-500",
            "outlineColor": "outline-teal-500",
            "hexColor": "#14b8a6",
            "hover": {
                "textColor": "hover:text-teal-500",
                "bgColor": "hover:bg-teal-500",
                "bgColorHalfOpacity": "hover:bg-teal-500/50",
                "borderColor": "hover:border-teal-500",
                "outlineColor": "hover:outline-teal-500"
            },
            "focus": {
                "outlineColor": "focus:outline-teal-500",
                "borderColor": "focus:border-teal-500"
            }
        },
        "teal-600": {
            "textColor": "text-teal-600",
            "bgColor": "bg-teal-600",
            "bgColorHalfOpacity": "bg-teal-600/50",
            "borderColor": "border-teal-600",
            "outlineColor": "outline-teal-600",
            "hexColor": "#0d9488",
            "hover": {
                "textColor": "hover:text-teal-600",
                "bgColor": "hover:bg-teal-600",
                "bgColorHalfOpacity": "hover:bg-teal-600/50",
                "borderColor": "hover:border-teal-600",
                "outlineColor": "hover:outline-teal-600"
            },
            "focus": {
                "outlineColor": "focus:outline-teal-600",
                "borderColor": "focus:border-teal-600"
            }
        },
        "teal-700": {
            "textColor": "text-teal-700",
            "bgColor": "bg-teal-700",
            "bgColorHalfOpacity": "bg-teal-700/50",
            "borderColor": "border-teal-700",
            "outlineColor": "outline-teal-700",
            "hexColor": "#0f766e",
            "hover": {
                "textColor": "hover:text-teal-700",
                "bgColor": "hover:bg-teal-700",
                "bgColorHalfOpacity": "hover:bg-teal-700/50",
                "borderColor": "hover:border-teal-700",
                "outlineColor": "hover:outline-teal-700"
            },
            "focus": {
                "outlineColor": "focus:outline-teal-700",
                "borderColor": "focus:border-teal-700"
            }
        },
        "teal-800": {
            "textColor": "text-teal-800",
            "bgColor": "bg-teal-800",
            "bgColorHalfOpacity": "bg-teal-800/50",
            "borderColor": "border-teal-800",
            "outlineColor": "outline-teal-800",
            "hexColor": "#115e59",
            "hover": {
                "textColor": "hover:text-teal-800",
                "bgColor": "hover:bg-teal-800",
                "bgColorHalfOpacity": "hover:bg-teal-800/50",
                "borderColor": "hover:border-teal-800",
                "outlineColor": "hover:outline-teal-800"
            },
            "focus": {
                "outlineColor": "focus:outline-teal-800",
                "borderColor": "focus:border-teal-800"
            }
        },
        "teal-900": {
            "textColor": "text-teal-900",
            "bgColor": "bg-teal-900",
            "bgColorHalfOpacity": "bg-teal-900/50",
            "borderColor": "border-teal-900",
            "outlineColor": "outline-teal-900",
            "hexColor": "#134e4a",
            "hover": {
                "textColor": "hover:text-teal-900",
                "bgColor": "hover:bg-teal-900",
                "bgColorHalfOpacity": "hover:bg-teal-900/50",
                "borderColor": "hover:border-teal-900",
                "outlineColor": "hover:outline-teal-900"
            },
            "focus": {
                "outlineColor": "focus:outline-teal-900",
                "borderColor": "focus:border-teal-900"
            }
        },
        "teal-950": {
            "textColor": "text-teal-950",
            "bgColor": "bg-teal-950",
            "bgColorHalfOpacity": "bg-teal-950/50",
            "borderColor": "border-teal-950",
            "outlineColor": "outline-teal-950",
            "hexColor": "#042f2e",
            "hover": {
                "textColor": "hover:text-teal-950",
                "bgColor": "hover:bg-teal-950",
                "bgColorHalfOpacity": "hover:bg-teal-950/50",
                "borderColor": "hover:border-teal-950",
                "outlineColor": "hover:outline-teal-950"
            },
            "focus": {
                "outlineColor": "focus:outline-teal-950",
                "borderColor": "focus:border-teal-950"
            }
        }
    },
    "cyan": {
        "cyan-50": {
            "textColor": "text-cyan-50",
            "bgColor": "bg-cyan-50",
            "bgColorHalfOpacity": "bg-cyan-50/50",
            "borderColor": "border-cyan-50",
            "outlineColor": "outline-cyan-50",
            "hexColor": "#ecfeff",
            "hover": {
                "textColor": "hover:text-cyan-50",
                "bgColor": "hover:bg-cyan-50",
                "bgColorHalfOpacity": "hover:bg-cyan-50/50",
                "borderColor": "hover:border-cyan-50",
                "outlineColor": "hover:outline-cyan-50"
            },
            "focus": {
                "outlineColor": "focus:outline-cyan-50",
                "borderColor": "focus:border-cyan-50"
            }
        },
        "cyan-100": {
            "textColor": "text-cyan-100",
            "bgColor": "bg-cyan-100",
            "bgColorHalfOpacity": "bg-cyan-100/50",
            "borderColor": "border-cyan-100",
            "outlineColor": "outline-cyan-100",
            "hexColor": "#cffafe",
            "hover": {
                "textColor": "hover:text-cyan-100",
                "bgColor": "hover:bg-cyan-100",
                "bgColorHalfOpacity": "hover:bg-cyan-100/50",
                "borderColor": "hover:border-cyan-100",
                "outlineColor": "hover:outline-cyan-100"
            },
            "focus": {
                "outlineColor": "focus:outline-cyan-100",
                "borderColor": "focus:border-cyan-100"
            }
        },
        "cyan-200": {
            "textColor": "text-cyan-200",
            "bgColor": "bg-cyan-200",
            "bgColorHalfOpacity": "bg-cyan-200/50",
            "borderColor": "border-cyan-200",
            "outlineColor": "outline-cyan-200",
            "hexColor": "#a5f3fc",
            "hover": {
                "textColor": "hover:text-cyan-200",
                "bgColor": "hover:bg-cyan-200",
                "bgColorHalfOpacity": "hover:bg-cyan-200/50",
                "borderColor": "hover:border-cyan-200",
                "outlineColor": "hover:outline-cyan-200"
            },
            "focus": {
                "outlineColor": "focus:outline-cyan-200",
                "borderColor": "focus:border-cyan-200"
            }
        },
        "cyan-300": {
            "textColor": "text-cyan-300",
            "bgColor": "bg-cyan-300",
            "bgColorHalfOpacity": "bg-cyan-300/50",
            "borderColor": "border-cyan-300",
            "outlineColor": "outline-cyan-300",
            "hexColor": "#67e8f9",
            "hover": {
                "textColor": "hover:text-cyan-300",
                "bgColor": "hover:bg-cyan-300",
                "bgColorHalfOpacity": "hover:bg-cyan-300/50",
                "borderColor": "hover:border-cyan-300",
                "outlineColor": "hover:outline-cyan-300"
            },
            "focus": {
                "outlineColor": "focus:outline-cyan-300",
                "borderColor": "focus:border-cyan-300"
            }
        },
        "cyan-400": {
            "textColor": "text-cyan-400",
            "bgColor": "bg-cyan-400",
            "bgColorHalfOpacity": "bg-cyan-400/50",
            "borderColor": "border-cyan-400",
            "outlineColor": "outline-cyan-400",
            "hexColor": "#22d3ee",
            "hover": {
                "textColor": "hover:text-cyan-400",
                "bgColor": "hover:bg-cyan-400",
                "bgColorHalfOpacity": "hover:bg-cyan-400/50",
                "borderColor": "hover:border-cyan-400",
                "outlineColor": "hover:outline-cyan-400"
            },
            "focus": {
                "outlineColor": "focus:outline-cyan-400",
                "borderColor": "focus:border-cyan-400"
            }
        },
        "cyan-500": {
            "textColor": "text-cyan-500",
            "bgColor": "bg-cyan-500",
            "bgColorHalfOpacity": "bg-cyan-500/50",
            "borderColor": "border-cyan-500",
            "outlineColor": "outline-cyan-500",
            "hexColor": "#06b6d4",
            "hover": {
                "textColor": "hover:text-cyan-500",
                "bgColor": "hover:bg-cyan-500",
                "bgColorHalfOpacity": "hover:bg-cyan-500/50",
                "borderColor": "hover:border-cyan-500",
                "outlineColor": "hover:outline-cyan-500"
            },
            "focus": {
                "outlineColor": "focus:outline-cyan-500",
                "borderColor": "focus:border-cyan-500"
            }
        },
        "cyan-600": {
            "textColor": "text-cyan-600",
            "bgColor": "bg-cyan-600",
            "bgColorHalfOpacity": "bg-cyan-600/50",
            "borderColor": "border-cyan-600",
            "outlineColor": "outline-cyan-600",
            "hexColor": "#0891b2",
            "hover": {
                "textColor": "hover:text-cyan-600",
                "bgColor": "hover:bg-cyan-600",
                "bgColorHalfOpacity": "hover:bg-cyan-600/50",
                "borderColor": "hover:border-cyan-600",
                "outlineColor": "hover:outline-cyan-600"
            },
            "focus": {
                "outlineColor": "focus:outline-cyan-600",
                "borderColor": "focus:border-cyan-600"
            }
        },
        "cyan-700": {
            "textColor": "text-cyan-700",
            "bgColor": "bg-cyan-700",
            "bgColorHalfOpacity": "bg-cyan-700/50",
            "borderColor": "border-cyan-700",
            "outlineColor": "outline-cyan-700",
            "hexColor": "#0e7490",
            "hover": {
                "textColor": "hover:text-cyan-700",
                "bgColor": "hover:bg-cyan-700",
                "bgColorHalfOpacity": "hover:bg-cyan-700/50",
                "borderColor": "hover:border-cyan-700",
                "outlineColor": "hover:outline-cyan-700"
            },
            "focus": {
                "outlineColor": "focus:outline-cyan-700",
                "borderColor": "focus:border-cyan-700"
            }
        },
        "cyan-800": {
            "textColor": "text-cyan-800",
            "bgColor": "bg-cyan-800",
            "bgColorHalfOpacity": "bg-cyan-800/50",
            "borderColor": "border-cyan-800",
            "outlineColor": "outline-cyan-800",
            "hexColor": "#155e75",
            "hover": {
                "textColor": "hover:text-cyan-800",
                "bgColor": "hover:bg-cyan-800",
                "bgColorHalfOpacity": "hover:bg-cyan-800/50",
                "borderColor": "hover:border-cyan-800",
                "outlineColor": "hover:outline-cyan-800"
            },
            "focus": {
                "outlineColor": "focus:outline-cyan-800",
                "borderColor": "focus:border-cyan-800"
            }
        },
        "cyan-900": {
            "textColor": "text-cyan-900",
            "bgColor": "bg-cyan-900",
            "bgColorHalfOpacity": "bg-cyan-900/50",
            "borderColor": "border-cyan-900",
            "outlineColor": "outline-cyan-900",
            "hexColor": "#164e63",
            "hover": {
                "textColor": "hover:text-cyan-900",
                "bgColor": "hover:bg-cyan-900",
                "bgColorHalfOpacity": "hover:bg-cyan-900/50",
                "borderColor": "hover:border-cyan-900",
                "outlineColor": "hover:outline-cyan-900"
            },
            "focus": {
                "outlineColor": "focus:outline-cyan-900",
                "borderColor": "focus:border-cyan-900"
            }
        },
        "cyan-950": {
            "textColor": "text-cyan-950",
            "bgColor": "bg-cyan-950",
            "bgColorHalfOpacity": "bg-cyan-950/50",
            "borderColor": "border-cyan-950",
            "outlineColor": "outline-cyan-950",
            "hexColor": "#083344",
            "hover": {
                "textColor": "hover:text-cyan-950",
                "bgColor": "hover:bg-cyan-950",
                "bgColorHalfOpacity": "hover:bg-cyan-950/50",
                "borderColor": "hover:border-cyan-950",
                "outlineColor": "hover:outline-cyan-950"
            },
            "focus": {
                "outlineColor": "focus:outline-cyan-950",
                "borderColor": "focus:border-cyan-950"
            }
        }
    },
    "sky": {
        "sky-50": {
            "textColor": "text-sky-50",
            "bgColor": "bg-sky-50",
            "bgColorHalfOpacity": "bg-sky-50/50",
            "borderColor": "border-sky-50",
            "outlineColor": "outline-sky-50",
            "hexColor": "#f0f9ff",
            "hover": {
                "textColor": "hover:text-sky-50",
                "bgColor": "hover:bg-sky-50",
                "bgColorHalfOpacity": "hover:bg-sky-50/50",
                "borderColor": "hover:border-sky-50",
                "outlineColor": "hover:outline-sky-50"
            },
            "focus": {
                "outlineColor": "focus:outline-sky-50",
                "borderColor": "focus:border-sky-50"
            }
        },
        "sky-100": {
            "textColor": "text-sky-100",
            "bgColor": "bg-sky-100",
            "bgColorHalfOpacity": "bg-sky-100/50",
            "borderColor": "border-sky-100",
            "outlineColor": "outline-sky-100",
            "hexColor": "#e0f2fe",
            "hover": {
                "textColor": "hover:text-sky-100",
                "bgColor": "hover:bg-sky-100",
                "bgColorHalfOpacity": "hover:bg-sky-100/50",
                "borderColor": "hover:border-sky-100",
                "outlineColor": "hover:outline-sky-100"
            },
            "focus": {
                "outlineColor": "focus:outline-sky-100",
                "borderColor": "focus:border-sky-100"
            }
        },
        "sky-200": {
            "textColor": "text-sky-200",
            "bgColor": "bg-sky-200",
            "bgColorHalfOpacity": "bg-sky-200/50",
            "borderColor": "border-sky-200",
            "outlineColor": "outline-sky-200",
            "hexColor": "#bae6fd",
            "hover": {
                "textColor": "hover:text-sky-200",
                "bgColor": "hover:bg-sky-200",
                "bgColorHalfOpacity": "hover:bg-sky-200/50",
                "borderColor": "hover:border-sky-200",
                "outlineColor": "hover:outline-sky-200"
            },
            "focus": {
                "outlineColor": "focus:outline-sky-200",
                "borderColor": "focus:border-sky-200"
            }
        },
        "sky-300": {
            "textColor": "text-sky-300",
            "bgColor": "bg-sky-300",
            "bgColorHalfOpacity": "bg-sky-300/50",
            "borderColor": "border-sky-300",
            "outlineColor": "outline-sky-300",
            "hexColor": "#7dd3fc",
            "hover": {
                "textColor": "hover:text-sky-300",
                "bgColor": "hover:bg-sky-300",
                "bgColorHalfOpacity": "hover:bg-sky-300/50",
                "borderColor": "hover:border-sky-300",
                "outlineColor": "hover:outline-sky-300"
            },
            "focus": {
                "outlineColor": "focus:outline-sky-300",
                "borderColor": "focus:border-sky-300"
            }
        },
        "sky-400": {
            "textColor": "text-sky-400",
            "bgColor": "bg-sky-400",
            "bgColorHalfOpacity": "bg-sky-400/50",
            "borderColor": "border-sky-400",
            "outlineColor": "outline-sky-400",
            "hexColor": "#38bdf8",
            "hover": {
                "textColor": "hover:text-sky-400",
                "bgColor": "hover:bg-sky-400",
                "bgColorHalfOpacity": "hover:bg-sky-400/50",
                "borderColor": "hover:border-sky-400",
                "outlineColor": "hover:outline-sky-400"
            },
            "focus": {
                "outlineColor": "focus:outline-sky-400",
                "borderColor": "focus:border-sky-400"
            }
        },
        "sky-500": {
            "textColor": "text-sky-500",
            "bgColor": "bg-sky-500",
            "bgColorHalfOpacity": "bg-sky-500/50",
            "borderColor": "border-sky-500",
            "outlineColor": "outline-sky-500",
            "hexColor": "#0ea5e9",
            "hover": {
                "textColor": "hover:text-sky-500",
                "bgColor": "hover:bg-sky-500",
                "bgColorHalfOpacity": "hover:bg-sky-500/50",
                "borderColor": "hover:border-sky-500",
                "outlineColor": "hover:outline-sky-500"
            },
            "focus": {
                "outlineColor": "focus:outline-sky-500",
                "borderColor": "focus:border-sky-500"
            }
        },
        "sky-600": {
            "textColor": "text-sky-600",
            "bgColor": "bg-sky-600",
            "bgColorHalfOpacity": "bg-sky-600/50",
            "borderColor": "border-sky-600",
            "outlineColor": "outline-sky-600",
            "hexColor": "#0284c7",
            "hover": {
                "textColor": "hover:text-sky-600",
                "bgColor": "hover:bg-sky-600",
                "bgColorHalfOpacity": "hover:bg-sky-600/50",
                "borderColor": "hover:border-sky-600",
                "outlineColor": "hover:outline-sky-600"
            },
            "focus": {
                "outlineColor": "focus:outline-sky-600",
                "borderColor": "focus:border-sky-600"
            }
        },
        "sky-700": {
            "textColor": "text-sky-700",
            "bgColor": "bg-sky-700",
            "bgColorHalfOpacity": "bg-sky-700/50",
            "borderColor": "border-sky-700",
            "outlineColor": "outline-sky-700",
            "hexColor": "#0369a1",
            "hover": {
                "textColor": "hover:text-sky-700",
                "bgColor": "hover:bg-sky-700",
                "bgColorHalfOpacity": "hover:bg-sky-700/50",
                "borderColor": "hover:border-sky-700",
                "outlineColor": "hover:outline-sky-700"
            },
            "focus": {
                "outlineColor": "focus:outline-sky-700",
                "borderColor": "focus:border-sky-700"
            }
        },
        "sky-800": {
            "textColor": "text-sky-800",
            "bgColor": "bg-sky-800",
            "bgColorHalfOpacity": "bg-sky-800/50",
            "borderColor": "border-sky-800",
            "outlineColor": "outline-sky-800",
            "hexColor": "#075985",
            "hover": {
                "textColor": "hover:text-sky-800",
                "bgColor": "hover:bg-sky-800",
                "bgColorHalfOpacity": "hover:bg-sky-800/50",
                "borderColor": "hover:border-sky-800",
                "outlineColor": "hover:outline-sky-800"
            },
            "focus": {
                "outlineColor": "focus:outline-sky-800",
                "borderColor": "focus:border-sky-800"
            }
        },
        "sky-900": {
            "textColor": "text-sky-900",
            "bgColor": "bg-sky-900",
            "bgColorHalfOpacity": "bg-sky-900/50",
            "borderColor": "border-sky-900",
            "outlineColor": "outline-sky-900",
            "hexColor": "#0c4a6e",
            "hover": {
                "textColor": "hover:text-sky-900",
                "bgColor": "hover:bg-sky-900",
                "bgColorHalfOpacity": "hover:bg-sky-900/50",
                "borderColor": "hover:border-sky-900",
                "outlineColor": "hover:outline-sky-900"
            },
            "focus": {
                "outlineColor": "focus:outline-sky-900",
                "borderColor": "focus:border-sky-900"
            }
        },
        "sky-950": {
            "textColor": "text-sky-950",
            "bgColor": "bg-sky-950",
            "bgColorHalfOpacity": "bg-sky-950/50",
            "borderColor": "border-sky-950",
            "outlineColor": "outline-sky-950",
            "hexColor": "#082f49",
            "hover": {
                "textColor": "hover:text-sky-950",
                "bgColor": "hover:bg-sky-950",
                "bgColorHalfOpacity": "hover:bg-sky-950/50",
                "borderColor": "hover:border-sky-950",
                "outlineColor": "hover:outline-sky-950"
            },
            "focus": {
                "outlineColor": "focus:outline-sky-950",
                "borderColor": "focus:border-sky-950"
            }
        }
    },
    "blue": {
        "blue-50": {
            "textColor": "text-blue-50",
            "bgColor": "bg-blue-50",
            "bgColorHalfOpacity": "bg-blue-50/50",
            "borderColor": "border-blue-50",
            "outlineColor": "outline-blue-50",
            "hexColor": "#eff6ff",
            "hover": {
                "textColor": "hover:text-blue-50",
                "bgColor": "hover:bg-blue-50",
                "bgColorHalfOpacity": "hover:bg-blue-50/50",
                "borderColor": "hover:border-blue-50",
                "outlineColor": "hover:outline-blue-50"
            },
            "focus": {
                "outlineColor": "focus:outline-blue-50",
                "borderColor": "focus:border-blue-50"
            }
        },
        "blue-100": {
            "textColor": "text-blue-100",
            "bgColor": "bg-blue-100",
            "bgColorHalfOpacity": "bg-blue-100/50",
            "borderColor": "border-blue-100",
            "outlineColor": "outline-blue-100",
            "hexColor": "#dbeafe",
            "hover": {
                "textColor": "hover:text-blue-100",
                "bgColor": "hover:bg-blue-100",
                "bgColorHalfOpacity": "hover:bg-blue-100/50",
                "borderColor": "hover:border-blue-100",
                "outlineColor": "hover:outline-blue-100"
            },
            "focus": {
                "outlineColor": "focus:outline-blue-100",
                "borderColor": "focus:border-blue-100"
            }
        },
        "blue-200": {
            "textColor": "text-blue-200",
            "bgColor": "bg-blue-200",
            "bgColorHalfOpacity": "bg-blue-200/50",
            "borderColor": "border-blue-200",
            "outlineColor": "outline-blue-200",
            "hexColor": "#bfdbfe",
            "hover": {
                "textColor": "hover:text-blue-200",
                "bgColor": "hover:bg-blue-200",
                "bgColorHalfOpacity": "hover:bg-blue-200/50",
                "borderColor": "hover:border-blue-200",
                "outlineColor": "hover:outline-blue-200"
            },
            "focus": {
                "outlineColor": "focus:outline-blue-200",
                "borderColor": "focus:border-blue-200"
            }
        },
        "blue-300": {
            "textColor": "text-blue-300",
            "bgColor": "bg-blue-300",
            "bgColorHalfOpacity": "bg-blue-300/50",
            "borderColor": "border-blue-300",
            "outlineColor": "outline-blue-300",
            "hexColor": "#93c5fd",
            "hover": {
                "textColor": "hover:text-blue-300",
                "bgColor": "hover:bg-blue-300",
                "bgColorHalfOpacity": "hover:bg-blue-300/50",
                "borderColor": "hover:border-blue-300",
                "outlineColor": "hover:outline-blue-300"
            },
            "focus": {
                "outlineColor": "focus:outline-blue-300",
                "borderColor": "focus:border-blue-300"
            }
        },
        "blue-400": {
            "textColor": "text-blue-400",
            "bgColor": "bg-blue-400",
            "bgColorHalfOpacity": "bg-blue-400/50",
            "borderColor": "border-blue-400",
            "outlineColor": "outline-blue-400",
            "hexColor": "#60a5fa",
            "hover": {
                "textColor": "hover:text-blue-400",
                "bgColor": "hover:bg-blue-400",
                "bgColorHalfOpacity": "hover:bg-blue-400/50",
                "borderColor": "hover:border-blue-400",
                "outlineColor": "hover:outline-blue-400"
            },
            "focus": {
                "outlineColor": "focus:outline-blue-400",
                "borderColor": "focus:border-blue-400"
            }
        },
        "blue-500": {
            "textColor": "text-blue-500",
            "bgColor": "bg-blue-500",
            "bgColorHalfOpacity": "bg-blue-500/50",
            "borderColor": "border-blue-500",
            "outlineColor": "outline-blue-500",
            "hexColor": "#3b82f6",
            "hover": {
                "textColor": "hover:text-blue-500",
                "bgColor": "hover:bg-blue-500",
                "bgColorHalfOpacity": "hover:bg-blue-500/50",
                "borderColor": "hover:border-blue-500",
                "outlineColor": "hover:outline-blue-500"
            },
            "focus": {
                "outlineColor": "focus:outline-blue-500",
                "borderColor": "focus:border-blue-500"
            }
        },
        "blue-600": {
            "textColor": "text-blue-600",
            "bgColor": "bg-blue-600",
            "bgColorHalfOpacity": "bg-blue-600/50",
            "borderColor": "border-blue-600",
            "outlineColor": "outline-blue-600",
            "hexColor": "#2563eb",
            "hover": {
                "textColor": "hover:text-blue-600",
                "bgColor": "hover:bg-blue-600",
                "bgColorHalfOpacity": "hover:bg-blue-600/50",
                "borderColor": "hover:border-blue-600",
                "outlineColor": "hover:outline-blue-600"
            },
            "focus": {
                "outlineColor": "focus:outline-blue-600",
                "borderColor": "focus:border-blue-600"
            }
        },
        "blue-700": {
            "textColor": "text-blue-700",
            "bgColor": "bg-blue-700",
            "bgColorHalfOpacity": "bg-blue-700/50",
            "borderColor": "border-blue-700",
            "outlineColor": "outline-blue-700",
            "hexColor": "#1d4ed8",
            "hover": {
                "textColor": "hover:text-blue-700",
                "bgColor": "hover:bg-blue-700",
                "bgColorHalfOpacity": "hover:bg-blue-700/50",
                "borderColor": "hover:border-blue-700",
                "outlineColor": "hover:outline-blue-700"
            },
            "focus": {
                "outlineColor": "focus:outline-blue-700",
                "borderColor": "focus:border-blue-700"
            }
        },
        "blue-800": {
            "textColor": "text-blue-800",
            "bgColor": "bg-blue-800",
            "bgColorHalfOpacity": "bg-blue-800/50",
            "borderColor": "border-blue-800",
            "outlineColor": "outline-blue-800",
            "hexColor": "#1e40af",
            "hover": {
                "textColor": "hover:text-blue-800",
                "bgColor": "hover:bg-blue-800",
                "bgColorHalfOpacity": "hover:bg-blue-800/50",
                "borderColor": "hover:border-blue-800",
                "outlineColor": "hover:outline-blue-800"
            },
            "focus": {
                "outlineColor": "focus:outline-blue-800",
                "borderColor": "focus:border-blue-800"
            }
        },
        "blue-900": {
            "textColor": "text-blue-900",
            "bgColor": "bg-blue-900",
            "bgColorHalfOpacity": "bg-blue-900/50",
            "borderColor": "border-blue-900",
            "outlineColor": "outline-blue-900",
            "hexColor": "#1e3a8a",
            "hover": {
                "textColor": "hover:text-blue-900",
                "bgColor": "hover:bg-blue-900",
                "bgColorHalfOpacity": "hover:bg-blue-900/50",
                "borderColor": "hover:border-blue-900",
                "outlineColor": "hover:outline-blue-900"
            },
            "focus": {
                "outlineColor": "focus:outline-blue-900",
                "borderColor": "focus:border-blue-900"
            }
        },
        "blue-950": {
            "textColor": "text-blue-950",
            "bgColor": "bg-blue-950",
            "bgColorHalfOpacity": "bg-blue-950/50",
            "borderColor": "border-blue-950",
            "outlineColor": "outline-blue-950",
            "hexColor": "#172554",
            "hover": {
                "textColor": "hover:text-blue-950",
                "bgColor": "hover:bg-blue-950",
                "bgColorHalfOpacity": "hover:bg-blue-950/50",
                "borderColor": "hover:border-blue-950",
                "outlineColor": "hover:outline-blue-950"
            },
            "focus": {
                "outlineColor": "focus:outline-blue-950",
                "borderColor": "focus:border-blue-950"
            }
        }
    },
    "indigo": {
        "indigo-50": {
            "textColor": "text-indigo-50",
            "bgColor": "bg-indigo-50",
            "bgColorHalfOpacity": "bg-indigo-50/50",
            "borderColor": "border-indigo-50",
            "outlineColor": "outline-indigo-50",
            "hexColor": "#eef2ff",
            "hover": {
                "textColor": "hover:text-indigo-50",
                "bgColor": "hover:bg-indigo-50",
                "bgColorHalfOpacity": "hover:bg-indigo-50/50",
                "borderColor": "hover:border-indigo-50",
                "outlineColor": "hover:outline-indigo-50"
            },
            "focus": {
                "outlineColor": "focus:outline-indigo-50",
                "borderColor": "focus:border-indigo-50"
            }
        },
        "indigo-100": {
            "textColor": "text-indigo-100",
            "bgColor": "bg-indigo-100",
            "bgColorHalfOpacity": "bg-indigo-100/50",
            "borderColor": "border-indigo-100",
            "outlineColor": "outline-indigo-100",
            "hexColor": "#e0e7ff",
            "hover": {
                "textColor": "hover:text-indigo-100",
                "bgColor": "hover:bg-indigo-100",
                "bgColorHalfOpacity": "hover:bg-indigo-100/50",
                "borderColor": "hover:border-indigo-100",
                "outlineColor": "hover:outline-indigo-100"
            },
            "focus": {
                "outlineColor": "focus:outline-indigo-100",
                "borderColor": "focus:border-indigo-100"
            }
        },
        "indigo-200": {
            "textColor": "text-indigo-200",
            "bgColor": "bg-indigo-200",
            "bgColorHalfOpacity": "bg-indigo-200/50",
            "borderColor": "border-indigo-200",
            "outlineColor": "outline-indigo-200",
            "hexColor": "#c7d2fe",
            "hover": {
                "textColor": "hover:text-indigo-200",
                "bgColor": "hover:bg-indigo-200",
                "bgColorHalfOpacity": "hover:bg-indigo-200/50",
                "borderColor": "hover:border-indigo-200",
                "outlineColor": "hover:outline-indigo-200"
            },
            "focus": {
                "outlineColor": "focus:outline-indigo-200",
                "borderColor": "focus:border-indigo-200"
            }
        },
        "indigo-300": {
            "textColor": "text-indigo-300",
            "bgColor": "bg-indigo-300",
            "bgColorHalfOpacity": "bg-indigo-300/50",
            "borderColor": "border-indigo-300",
            "outlineColor": "outline-indigo-300",
            "hexColor": "#a5b4fc",
            "hover": {
                "textColor": "hover:text-indigo-300",
                "bgColor": "hover:bg-indigo-300",
                "bgColorHalfOpacity": "hover:bg-indigo-300/50",
                "borderColor": "hover:border-indigo-300",
                "outlineColor": "hover:outline-indigo-300"
            },
            "focus": {
                "outlineColor": "focus:outline-indigo-300",
                "borderColor": "focus:border-indigo-300"
            }
        },
        "indigo-400": {
            "textColor": "text-indigo-400",
            "bgColor": "bg-indigo-400",
            "bgColorHalfOpacity": "bg-indigo-400/50",
            "borderColor": "border-indigo-400",
            "outlineColor": "outline-indigo-400",
            "hexColor": "#818cf8",
            "hover": {
                "textColor": "hover:text-indigo-400",
                "bgColor": "hover:bg-indigo-400",
                "bgColorHalfOpacity": "hover:bg-indigo-400/50",
                "borderColor": "hover:border-indigo-400",
                "outlineColor": "hover:outline-indigo-400"
            },
            "focus": {
                "outlineColor": "focus:outline-indigo-400",
                "borderColor": "focus:border-indigo-400"
            }
        },
        "indigo-500": {
            "textColor": "text-indigo-500",
            "bgColor": "bg-indigo-500",
            "bgColorHalfOpacity": "bg-indigo-500/50",
            "borderColor": "border-indigo-500",
            "outlineColor": "outline-indigo-500",
            "hexColor": "#6366f1",
            "hover": {
                "textColor": "hover:text-indigo-500",
                "bgColor": "hover:bg-indigo-500",
                "bgColorHalfOpacity": "hover:bg-indigo-500/50",
                "borderColor": "hover:border-indigo-500",
                "outlineColor": "hover:outline-indigo-500"
            },
            "focus": {
                "outlineColor": "focus:outline-indigo-500",
                "borderColor": "focus:border-indigo-500"
            }
        },
        "indigo-600": {
            "textColor": "text-indigo-600",
            "bgColor": "bg-indigo-600",
            "bgColorHalfOpacity": "bg-indigo-600/50",
            "borderColor": "border-indigo-600",
            "outlineColor": "outline-indigo-600",
            "hexColor": "#4f46e5",
            "hover": {
                "textColor": "hover:text-indigo-600",
                "bgColor": "hover:bg-indigo-600",
                "bgColorHalfOpacity": "hover:bg-indigo-600/50",
                "borderColor": "hover:border-indigo-600",
                "outlineColor": "hover:outline-indigo-600"
            },
            "focus": {
                "outlineColor": "focus:outline-indigo-600",
                "borderColor": "focus:border-indigo-600"
            }
        },
        "indigo-700": {
            "textColor": "text-indigo-700",
            "bgColor": "bg-indigo-700",
            "bgColorHalfOpacity": "bg-indigo-700/50",
            "borderColor": "border-indigo-700",
            "outlineColor": "outline-indigo-700",
            "hexColor": "#4338ca",
            "hover": {
                "textColor": "hover:text-indigo-700",
                "bgColor": "hover:bg-indigo-700",
                "bgColorHalfOpacity": "hover:bg-indigo-700/50",
                "borderColor": "hover:border-indigo-700",
                "outlineColor": "hover:outline-indigo-700"
            },
            "focus": {
                "outlineColor": "focus:outline-indigo-700",
                "borderColor": "focus:border-indigo-700"
            }
        },
        "indigo-800": {
            "textColor": "text-indigo-800",
            "bgColor": "bg-indigo-800",
            "bgColorHalfOpacity": "bg-indigo-800/50",
            "borderColor": "border-indigo-800",
            "outlineColor": "outline-indigo-800",
            "hexColor": "#3730a3",
            "hover": {
                "textColor": "hover:text-indigo-800",
                "bgColor": "hover:bg-indigo-800",
                "bgColorHalfOpacity": "hover:bg-indigo-800/50",
                "borderColor": "hover:border-indigo-800",
                "outlineColor": "hover:outline-indigo-800"
            },
            "focus": {
                "outlineColor": "focus:outline-indigo-800",
                "borderColor": "focus:border-indigo-800"
            }
        },
        "indigo-900": {
            "textColor": "text-indigo-900",
            "bgColor": "bg-indigo-900",
            "bgColorHalfOpacity": "bg-indigo-900/50",
            "borderColor": "border-indigo-900",
            "outlineColor": "outline-indigo-900",
            "hexColor": "#312e81",
            "hover": {
                "textColor": "hover:text-indigo-900",
                "bgColor": "hover:bg-indigo-900",
                "bgColorHalfOpacity": "hover:bg-indigo-900/50",
                "borderColor": "hover:border-indigo-900",
                "outlineColor": "hover:outline-indigo-900"
            },
            "focus": {
                "outlineColor": "focus:outline-indigo-900",
                "borderColor": "focus:border-indigo-900"
            }
        },
        "indigo-950": {
            "textColor": "text-indigo-950",
            "bgColor": "bg-indigo-950",
            "bgColorHalfOpacity": "bg-indigo-950/50",
            "borderColor": "border-indigo-950",
            "outlineColor": "outline-indigo-950",
            "hexColor": "#1e1b4b",
            "hover": {
                "textColor": "hover:text-indigo-950",
                "bgColor": "hover:bg-indigo-950",
                "bgColorHalfOpacity": "hover:bg-indigo-950/50",
                "borderColor": "hover:border-indigo-950",
                "outlineColor": "hover:outline-indigo-950"
            },
            "focus": {
                "outlineColor": "focus:outline-indigo-950",
                "borderColor": "focus:border-indigo-950"
            }
        }
    },
    "violet": {
        "violet-50": {
            "textColor": "text-violet-50",
            "bgColor": "bg-violet-50",
            "bgColorHalfOpacity": "bg-violet-50/50",
            "borderColor": "border-violet-50",
            "outlineColor": "outline-violet-50",
            "hexColor": "#f5f3ff",
            "hover": {
                "textColor": "hover:text-violet-50",
                "bgColor": "hover:bg-violet-50",
                "bgColorHalfOpacity": "hover:bg-violet-50/50",
                "borderColor": "hover:border-violet-50",
                "outlineColor": "hover:outline-violet-50"
            },
            "focus": {
                "outlineColor": "focus:outline-violet-50",
                "borderColor": "focus:border-violet-50"
            }
        },
        "violet-100": {
            "textColor": "text-violet-100",
            "bgColor": "bg-violet-100",
            "bgColorHalfOpacity": "bg-violet-100/50",
            "borderColor": "border-violet-100",
            "outlineColor": "outline-violet-100",
            "hexColor": "#ede9fe",
            "hover": {
                "textColor": "hover:text-violet-100",
                "bgColor": "hover:bg-violet-100",
                "bgColorHalfOpacity": "hover:bg-violet-100/50",
                "borderColor": "hover:border-violet-100",
                "outlineColor": "hover:outline-violet-100"
            },
            "focus": {
                "outlineColor": "focus:outline-violet-100",
                "borderColor": "focus:border-violet-100"
            }
        },
        "violet-200": {
            "textColor": "text-violet-200",
            "bgColor": "bg-violet-200",
            "bgColorHalfOpacity": "bg-violet-200/50",
            "borderColor": "border-violet-200",
            "outlineColor": "outline-violet-200",
            "hexColor": "#ddd6fe",
            "hover": {
                "textColor": "hover:text-violet-200",
                "bgColor": "hover:bg-violet-200",
                "bgColorHalfOpacity": "hover:bg-violet-200/50",
                "borderColor": "hover:border-violet-200",
                "outlineColor": "hover:outline-violet-200"
            },
            "focus": {
                "outlineColor": "focus:outline-violet-200",
                "borderColor": "focus:border-violet-200"
            }
        },
        "violet-300": {
            "textColor": "text-violet-300",
            "bgColor": "bg-violet-300",
            "bgColorHalfOpacity": "bg-violet-300/50",
            "borderColor": "border-violet-300",
            "outlineColor": "outline-violet-300",
            "hexColor": "#c4b5fd",
            "hover": {
                "textColor": "hover:text-violet-300",
                "bgColor": "hover:bg-violet-300",
                "bgColorHalfOpacity": "hover:bg-violet-300/50",
                "borderColor": "hover:border-violet-300",
                "outlineColor": "hover:outline-violet-300"
            },
            "focus": {
                "outlineColor": "focus:outline-violet-300",
                "borderColor": "focus:border-violet-300"
            }
        },
        "violet-400": {
            "textColor": "text-violet-400",
            "bgColor": "bg-violet-400",
            "bgColorHalfOpacity": "bg-violet-400/50",
            "borderColor": "border-violet-400",
            "outlineColor": "outline-violet-400",
            "hexColor": "#a78bfa",
            "hover": {
                "textColor": "hover:text-violet-400",
                "bgColor": "hover:bg-violet-400",
                "bgColorHalfOpacity": "hover:bg-violet-400/50",
                "borderColor": "hover:border-violet-400",
                "outlineColor": "hover:outline-violet-400"
            },
            "focus": {
                "outlineColor": "focus:outline-violet-400",
                "borderColor": "focus:border-violet-400"
            }
        },
        "violet-500": {
            "textColor": "text-violet-500",
            "bgColor": "bg-violet-500",
            "bgColorHalfOpacity": "bg-violet-500/50",
            "borderColor": "border-violet-500",
            "outlineColor": "outline-violet-500",
            "hexColor": "#8b5cf6",
            "hover": {
                "textColor": "hover:text-violet-500",
                "bgColor": "hover:bg-violet-500",
                "bgColorHalfOpacity": "hover:bg-violet-500/50",
                "borderColor": "hover:border-violet-500",
                "outlineColor": "hover:outline-violet-500"
            },
            "focus": {
                "outlineColor": "focus:outline-violet-500",
                "borderColor": "focus:border-violet-500"
            }
        },
        "violet-600": {
            "textColor": "text-violet-600",
            "bgColor": "bg-violet-600",
            "bgColorHalfOpacity": "bg-violet-600/50",
            "borderColor": "border-violet-600",
            "outlineColor": "outline-violet-600",
            "hexColor": "#7c3aed",
            "hover": {
                "textColor": "hover:text-violet-600",
                "bgColor": "hover:bg-violet-600",
                "bgColorHalfOpacity": "hover:bg-violet-600/50",
                "borderColor": "hover:border-violet-600",
                "outlineColor": "hover:outline-violet-600"
            },
            "focus": {
                "outlineColor": "focus:outline-violet-600",
                "borderColor": "focus:border-violet-600"
            }
        },
        "violet-700": {
            "textColor": "text-violet-700",
            "bgColor": "bg-violet-700",
            "bgColorHalfOpacity": "bg-violet-700/50",
            "borderColor": "border-violet-700",
            "outlineColor": "outline-violet-700",
            "hexColor": "#6d28d9",
            "hover": {
                "textColor": "hover:text-violet-700",
                "bgColor": "hover:bg-violet-700",
                "bgColorHalfOpacity": "hover:bg-violet-700/50",
                "borderColor": "hover:border-violet-700",
                "outlineColor": "hover:outline-violet-700"
            },
            "focus": {
                "outlineColor": "focus:outline-violet-700",
                "borderColor": "focus:border-violet-700"
            }
        },
        "violet-800": {
            "textColor": "text-violet-800",
            "bgColor": "bg-violet-800",
            "bgColorHalfOpacity": "bg-violet-800/50",
            "borderColor": "border-violet-800",
            "outlineColor": "outline-violet-800",
            "hexColor": "#5b21b6",
            "hover": {
                "textColor": "hover:text-violet-800",
                "bgColor": "hover:bg-violet-800",
                "bgColorHalfOpacity": "hover:bg-violet-800/50",
                "borderColor": "hover:border-violet-800",
                "outlineColor": "hover:outline-violet-800"
            },
            "focus": {
                "outlineColor": "focus:outline-violet-800",
                "borderColor": "focus:border-violet-800"
            }
        },
        "violet-900": {
            "textColor": "text-violet-900",
            "bgColor": "bg-violet-900",
            "bgColorHalfOpacity": "bg-violet-900/50",
            "borderColor": "border-violet-900",
            "outlineColor": "outline-violet-900",
            "hexColor": "#4c1d95",
            "hover": {
                "textColor": "hover:text-violet-900",
                "bgColor": "hover:bg-violet-900",
                "bgColorHalfOpacity": "hover:bg-violet-900/50",
                "borderColor": "hover:border-violet-900",
                "outlineColor": "hover:outline-violet-900"
            },
            "focus": {
                "outlineColor": "focus:outline-violet-900",
                "borderColor": "focus:border-violet-900"
            }
        },
        "violet-950": {
            "textColor": "text-violet-950",
            "bgColor": "bg-violet-950",
            "bgColorHalfOpacity": "bg-violet-950/50",
            "borderColor": "border-violet-950",
            "outlineColor": "outline-violet-950",
            "hexColor": "#2e1065",
            "hover": {
                "textColor": "hover:text-violet-950",
                "bgColor": "hover:bg-violet-950",
                "bgColorHalfOpacity": "hover:bg-violet-950/50",
                "borderColor": "hover:border-violet-950",
                "outlineColor": "hover:outline-violet-950"
            },
            "focus": {
                "outlineColor": "focus:outline-violet-950",
                "borderColor": "focus:border-violet-950"
            }
        }
    },
    "purple": {
        "purple-50": {
            "textColor": "text-purple-50",
            "bgColor": "bg-purple-50",
            "bgColorHalfOpacity": "bg-purple-50/50",
            "borderColor": "border-purple-50",
            "outlineColor": "outline-purple-50",
            "hexColor": "#faf5ff",
            "hover": {
                "textColor": "hover:text-purple-50",
                "bgColor": "hover:bg-purple-50",
                "bgColorHalfOpacity": "hover:bg-purple-50/50",
                "borderColor": "hover:border-purple-50",
                "outlineColor": "hover:outline-purple-50"
            },
            "focus": {
                "outlineColor": "focus:outline-purple-50",
                "borderColor": "focus:border-purple-50"
            }
        },
        "purple-100": {
            "textColor": "text-purple-100",
            "bgColor": "bg-purple-100",
            "bgColorHalfOpacity": "bg-purple-100/50",
            "borderColor": "border-purple-100",
            "outlineColor": "outline-purple-100",
            "hexColor": "#f3e8ff",
            "hover": {
                "textColor": "hover:text-purple-100",
                "bgColor": "hover:bg-purple-100",
                "bgColorHalfOpacity": "hover:bg-purple-100/50",
                "borderColor": "hover:border-purple-100",
                "outlineColor": "hover:outline-purple-100"
            },
            "focus": {
                "outlineColor": "focus:outline-purple-100",
                "borderColor": "focus:border-purple-100"
            }
        },
        "purple-200": {
            "textColor": "text-purple-200",
            "bgColor": "bg-purple-200",
            "bgColorHalfOpacity": "bg-purple-200/50",
            "borderColor": "border-purple-200",
            "outlineColor": "outline-purple-200",
            "hexColor": "#e9d5ff",
            "hover": {
                "textColor": "hover:text-purple-200",
                "bgColor": "hover:bg-purple-200",
                "bgColorHalfOpacity": "hover:bg-purple-200/50",
                "borderColor": "hover:border-purple-200",
                "outlineColor": "hover:outline-purple-200"
            },
            "focus": {
                "outlineColor": "focus:outline-purple-200",
                "borderColor": "focus:border-purple-200"
            }
        },
        "purple-300": {
            "textColor": "text-purple-300",
            "bgColor": "bg-purple-300",
            "bgColorHalfOpacity": "bg-purple-300/50",
            "borderColor": "border-purple-300",
            "outlineColor": "outline-purple-300",
            "hexColor": "#d8b4fe",
            "hover": {
                "textColor": "hover:text-purple-300",
                "bgColor": "hover:bg-purple-300",
                "bgColorHalfOpacity": "hover:bg-purple-300/50",
                "borderColor": "hover:border-purple-300",
                "outlineColor": "hover:outline-purple-300"
            },
            "focus": {
                "outlineColor": "focus:outline-purple-300",
                "borderColor": "focus:border-purple-300"
            }
        },
        "purple-400": {
            "textColor": "text-purple-400",
            "bgColor": "bg-purple-400",
            "bgColorHalfOpacity": "bg-purple-400/50",
            "borderColor": "border-purple-400",
            "outlineColor": "outline-purple-400",
            "hexColor": "#c084fc",
            "hover": {
                "textColor": "hover:text-purple-400",
                "bgColor": "hover:bg-purple-400",
                "bgColorHalfOpacity": "hover:bg-purple-400/50",
                "borderColor": "hover:border-purple-400",
                "outlineColor": "hover:outline-purple-400"
            },
            "focus": {
                "outlineColor": "focus:outline-purple-400",
                "borderColor": "focus:border-purple-400"
            }
        },
        "purple-500": {
            "textColor": "text-purple-500",
            "bgColor": "bg-purple-500",
            "bgColorHalfOpacity": "bg-purple-500/50",
            "borderColor": "border-purple-500",
            "outlineColor": "outline-purple-500",
            "hexColor": "#a855f7",
            "hover": {
                "textColor": "hover:text-purple-500",
                "bgColor": "hover:bg-purple-500",
                "bgColorHalfOpacity": "hover:bg-purple-500/50",
                "borderColor": "hover:border-purple-500",
                "outlineColor": "hover:outline-purple-500"
            },
            "focus": {
                "outlineColor": "focus:outline-purple-500",
                "borderColor": "focus:border-purple-500"
            }
        },
        "purple-600": {
            "textColor": "text-purple-600",
            "bgColor": "bg-purple-600",
            "bgColorHalfOpacity": "bg-purple-600/50",
            "borderColor": "border-purple-600",
            "outlineColor": "outline-purple-600",
            "hexColor": "#9333ea",
            "hover": {
                "textColor": "hover:text-purple-600",
                "bgColor": "hover:bg-purple-600",
                "bgColorHalfOpacity": "hover:bg-purple-600/50",
                "borderColor": "hover:border-purple-600",
                "outlineColor": "hover:outline-purple-600"
            },
            "focus": {
                "outlineColor": "focus:outline-purple-600",
                "borderColor": "focus:border-purple-600"
            }
        },
        "purple-700": {
            "textColor": "text-purple-700",
            "bgColor": "bg-purple-700",
            "bgColorHalfOpacity": "bg-purple-700/50",
            "borderColor": "border-purple-700",
            "outlineColor": "outline-purple-700",
            "hexColor": "#7e22ce",
            "hover": {
                "textColor": "hover:text-purple-700",
                "bgColor": "hover:bg-purple-700",
                "bgColorHalfOpacity": "hover:bg-purple-700/50",
                "borderColor": "hover:border-purple-700",
                "outlineColor": "hover:outline-purple-700"
            },
            "focus": {
                "outlineColor": "focus:outline-purple-700",
                "borderColor": "focus:border-purple-700"
            }
        },
        "purple-800": {
            "textColor": "text-purple-800",
            "bgColor": "bg-purple-800",
            "bgColorHalfOpacity": "bg-purple-800/50",
            "borderColor": "border-purple-800",
            "outlineColor": "outline-purple-800",
            "hexColor": "#6b21a8",
            "hover": {
                "textColor": "hover:text-purple-800",
                "bgColor": "hover:bg-purple-800",
                "bgColorHalfOpacity": "hover:bg-purple-800/50",
                "borderColor": "hover:border-purple-800",
                "outlineColor": "hover:outline-purple-800"
            },
            "focus": {
                "outlineColor": "focus:outline-purple-800",
                "borderColor": "focus:border-purple-800"
            }
        },
        "purple-900": {
            "textColor": "text-purple-900",
            "bgColor": "bg-purple-900",
            "bgColorHalfOpacity": "bg-purple-900/50",
            "borderColor": "border-purple-900",
            "outlineColor": "outline-purple-900",
            "hexColor": "#581c87",
            "hover": {
                "textColor": "hover:text-purple-900",
                "bgColor": "hover:bg-purple-900",
                "bgColorHalfOpacity": "hover:bg-purple-900/50",
                "borderColor": "hover:border-purple-900",
                "outlineColor": "hover:outline-purple-900"
            },
            "focus": {
                "outlineColor": "focus:outline-purple-900",
                "borderColor": "focus:border-purple-900"
            }
        },
        "purple-950": {
            "textColor": "text-purple-950",
            "bgColor": "bg-purple-950",
            "bgColorHalfOpacity": "bg-purple-950/50",
            "borderColor": "border-purple-950",
            "outlineColor": "outline-purple-950",
            "hexColor": "#3b0764",
            "hover": {
                "textColor": "hover:text-purple-950",
                "bgColor": "hover:bg-purple-950",
                "bgColorHalfOpacity": "hover:bg-purple-950/50",
                "borderColor": "hover:border-purple-950",
                "outlineColor": "hover:outline-purple-950"
            },
            "focus": {
                "outlineColor": "focus:outline-purple-950",
                "borderColor": "focus:border-purple-950"
            }
        }
    },
    "fuchsia": {
        "fuchsia-50": {
            "textColor": "text-fuchsia-50",
            "bgColor": "bg-fuchsia-50",
            "bgColorHalfOpacity": "bg-fuchsia-50/50",
            "borderColor": "border-fuchsia-50",
            "outlineColor": "outline-fuchsia-50",
            "hexColor": "#fdf4ff",
            "hover": {
                "textColor": "hover:text-fuchsia-50",
                "bgColor": "hover:bg-fuchsia-50",
                "bgColorHalfOpacity": "hover:bg-fuchsia-50/50",
                "borderColor": "hover:border-fuchsia-50",
                "outlineColor": "hover:outline-fuchsia-50"
            },
            "focus": {
                "outlineColor": "focus:outline-fuchsia-50",
                "borderColor": "focus:border-fuchsia-50"
            }
        },
        "fuchsia-100": {
            "textColor": "text-fuchsia-100",
            "bgColor": "bg-fuchsia-100",
            "bgColorHalfOpacity": "bg-fuchsia-100/50",
            "borderColor": "border-fuchsia-100",
            "outlineColor": "outline-fuchsia-100",
            "hexColor": "#fae8ff",
            "hover": {
                "textColor": "hover:text-fuchsia-100",
                "bgColor": "hover:bg-fuchsia-100",
                "bgColorHalfOpacity": "hover:bg-fuchsia-100/50",
                "borderColor": "hover:border-fuchsia-100",
                "outlineColor": "hover:outline-fuchsia-100"
            },
            "focus": {
                "outlineColor": "focus:outline-fuchsia-100",
                "borderColor": "focus:border-fuchsia-100"
            }
        },
        "fuchsia-200": {
            "textColor": "text-fuchsia-200",
            "bgColor": "bg-fuchsia-200",
            "bgColorHalfOpacity": "bg-fuchsia-200/50",
            "borderColor": "border-fuchsia-200",
            "outlineColor": "outline-fuchsia-200",
            "hexColor": "#f5d0fe",
            "hover": {
                "textColor": "hover:text-fuchsia-200",
                "bgColor": "hover:bg-fuchsia-200",
                "bgColorHalfOpacity": "hover:bg-fuchsia-200/50",
                "borderColor": "hover:border-fuchsia-200",
                "outlineColor": "hover:outline-fuchsia-200"
            },
            "focus": {
                "outlineColor": "focus:outline-fuchsia-200",
                "borderColor": "focus:border-fuchsia-200"
            }
        },
        "fuchsia-300": {
            "textColor": "text-fuchsia-300",
            "bgColor": "bg-fuchsia-300",
            "bgColorHalfOpacity": "bg-fuchsia-300/50",
            "borderColor": "border-fuchsia-300",
            "outlineColor": "outline-fuchsia-300",
            "hexColor": "#f0abfc",
            "hover": {
                "textColor": "hover:text-fuchsia-300",
                "bgColor": "hover:bg-fuchsia-300",
                "bgColorHalfOpacity": "hover:bg-fuchsia-300/50",
                "borderColor": "hover:border-fuchsia-300",
                "outlineColor": "hover:outline-fuchsia-300"
            },
            "focus": {
                "outlineColor": "focus:outline-fuchsia-300",
                "borderColor": "focus:border-fuchsia-300"
            }
        },
        "fuchsia-400": {
            "textColor": "text-fuchsia-400",
            "bgColor": "bg-fuchsia-400",
            "bgColorHalfOpacity": "bg-fuchsia-400/50",
            "borderColor": "border-fuchsia-400",
            "outlineColor": "outline-fuchsia-400",
            "hexColor": "#e879f9",
            "hover": {
                "textColor": "hover:text-fuchsia-400",
                "bgColor": "hover:bg-fuchsia-400",
                "bgColorHalfOpacity": "hover:bg-fuchsia-400/50",
                "borderColor": "hover:border-fuchsia-400",
                "outlineColor": "hover:outline-fuchsia-400"
            },
            "focus": {
                "outlineColor": "focus:outline-fuchsia-400",
                "borderColor": "focus:border-fuchsia-400"
            }
        },
        "fuchsia-500": {
            "textColor": "text-fuchsia-500",
            "bgColor": "bg-fuchsia-500",
            "bgColorHalfOpacity": "bg-fuchsia-500/50",
            "borderColor": "border-fuchsia-500",
            "outlineColor": "outline-fuchsia-500",
            "hexColor": "#d946ef",
            "hover": {
                "textColor": "hover:text-fuchsia-500",
                "bgColor": "hover:bg-fuchsia-500",
                "bgColorHalfOpacity": "hover:bg-fuchsia-500/50",
                "borderColor": "hover:border-fuchsia-500",
                "outlineColor": "hover:outline-fuchsia-500"
            },
            "focus": {
                "outlineColor": "focus:outline-fuchsia-500",
                "borderColor": "focus:border-fuchsia-500"
            }
        },
        "fuchsia-600": {
            "textColor": "text-fuchsia-600",
            "bgColor": "bg-fuchsia-600",
            "bgColorHalfOpacity": "bg-fuchsia-600/50",
            "borderColor": "border-fuchsia-600",
            "outlineColor": "outline-fuchsia-600",
            "hexColor": "#c026d3",
            "hover": {
                "textColor": "hover:text-fuchsia-600",
                "bgColor": "hover:bg-fuchsia-600",
                "bgColorHalfOpacity": "hover:bg-fuchsia-600/50",
                "borderColor": "hover:border-fuchsia-600",
                "outlineColor": "hover:outline-fuchsia-600"
            },
            "focus": {
                "outlineColor": "focus:outline-fuchsia-600",
                "borderColor": "focus:border-fuchsia-600"
            }
        },
        "fuchsia-700": {
            "textColor": "text-fuchsia-700",
            "bgColor": "bg-fuchsia-700",
            "bgColorHalfOpacity": "bg-fuchsia-700/50",
            "borderColor": "border-fuchsia-700",
            "outlineColor": "outline-fuchsia-700",
            "hexColor": "#a21caf",
            "hover": {
                "textColor": "hover:text-fuchsia-700",
                "bgColor": "hover:bg-fuchsia-700",
                "bgColorHalfOpacity": "hover:bg-fuchsia-700/50",
                "borderColor": "hover:border-fuchsia-700",
                "outlineColor": "hover:outline-fuchsia-700"
            },
            "focus": {
                "outlineColor": "focus:outline-fuchsia-700",
                "borderColor": "focus:border-fuchsia-700"
            }
        },
        "fuchsia-800": {
            "textColor": "text-fuchsia-800",
            "bgColor": "bg-fuchsia-800",
            "bgColorHalfOpacity": "bg-fuchsia-800/50",
            "borderColor": "border-fuchsia-800",
            "outlineColor": "outline-fuchsia-800",
            "hexColor": "#86198f",
            "hover": {
                "textColor": "hover:text-fuchsia-800",
                "bgColor": "hover:bg-fuchsia-800",
                "bgColorHalfOpacity": "hover:bg-fuchsia-800/50",
                "borderColor": "hover:border-fuchsia-800",
                "outlineColor": "hover:outline-fuchsia-800"
            },
            "focus": {
                "outlineColor": "focus:outline-fuchsia-800",
                "borderColor": "focus:border-fuchsia-800"
            }
        },
        "fuchsia-900": {
            "textColor": "text-fuchsia-900",
            "bgColor": "bg-fuchsia-900",
            "bgColorHalfOpacity": "bg-fuchsia-900/50",
            "borderColor": "border-fuchsia-900",
            "outlineColor": "outline-fuchsia-900",
            "hexColor": "#701a75",
            "hover": {
                "textColor": "hover:text-fuchsia-900",
                "bgColor": "hover:bg-fuchsia-900",
                "bgColorHalfOpacity": "hover:bg-fuchsia-900/50",
                "borderColor": "hover:border-fuchsia-900",
                "outlineColor": "hover:outline-fuchsia-900"
            },
            "focus": {
                "outlineColor": "focus:outline-fuchsia-900",
                "borderColor": "focus:border-fuchsia-900"
            }
        },
        "fuchsia-950": {
            "textColor": "text-fuchsia-950",
            "bgColor": "bg-fuchsia-950",
            "bgColorHalfOpacity": "bg-fuchsia-950/50",
            "borderColor": "border-fuchsia-950",
            "outlineColor": "outline-fuchsia-950",
            "hexColor": "#4a044e",
            "hover": {
                "textColor": "hover:text-fuchsia-950",
                "bgColor": "hover:bg-fuchsia-950",
                "bgColorHalfOpacity": "hover:bg-fuchsia-950/50",
                "borderColor": "hover:border-fuchsia-950",
                "outlineColor": "hover:outline-fuchsia-950"
            },
            "focus": {
                "outlineColor": "focus:outline-fuchsia-950",
                "borderColor": "focus:border-fuchsia-950"
            }
        }
    },
    "pink": {
        "pink-50": {
            "textColor": "text-pink-50",
            "bgColor": "bg-pink-50",
            "bgColorHalfOpacity": "bg-pink-50/50",
            "borderColor": "border-pink-50",
            "outlineColor": "outline-pink-50",
            "hexColor": "#fdf2f8",
            "hover": {
                "textColor": "hover:text-pink-50",
                "bgColor": "hover:bg-pink-50",
                "bgColorHalfOpacity": "hover:bg-pink-50/50",
                "borderColor": "hover:border-pink-50",
                "outlineColor": "hover:outline-pink-50"
            },
            "focus": {
                "outlineColor": "focus:outline-pink-50",
                "borderColor": "focus:border-pink-50"
            }
        },
        "pink-100": {
            "textColor": "text-pink-100",
            "bgColor": "bg-pink-100",
            "bgColorHalfOpacity": "bg-pink-100/50",
            "borderColor": "border-pink-100",
            "outlineColor": "outline-pink-100",
            "hexColor": "#fce7f3",
            "hover": {
                "textColor": "hover:text-pink-100",
                "bgColor": "hover:bg-pink-100",
                "bgColorHalfOpacity": "hover:bg-pink-100/50",
                "borderColor": "hover:border-pink-100",
                "outlineColor": "hover:outline-pink-100"
            },
            "focus": {
                "outlineColor": "focus:outline-pink-100",
                "borderColor": "focus:border-pink-100"
            }
        },
        "pink-200": {
            "textColor": "text-pink-200",
            "bgColor": "bg-pink-200",
            "bgColorHalfOpacity": "bg-pink-200/50",
            "borderColor": "border-pink-200",
            "outlineColor": "outline-pink-200",
            "hexColor": "#fbcfe8",
            "hover": {
                "textColor": "hover:text-pink-200",
                "bgColor": "hover:bg-pink-200",
                "bgColorHalfOpacity": "hover:bg-pink-200/50",
                "borderColor": "hover:border-pink-200",
                "outlineColor": "hover:outline-pink-200"
            },
            "focus": {
                "outlineColor": "focus:outline-pink-200",
                "borderColor": "focus:border-pink-200"
            }
        },
        "pink-300": {
            "textColor": "text-pink-300",
            "bgColor": "bg-pink-300",
            "bgColorHalfOpacity": "bg-pink-300/50",
            "borderColor": "border-pink-300",
            "outlineColor": "outline-pink-300",
            "hexColor": "#f9a8d4",
            "hover": {
                "textColor": "hover:text-pink-300",
                "bgColor": "hover:bg-pink-300",
                "bgColorHalfOpacity": "hover:bg-pink-300/50",
                "borderColor": "hover:border-pink-300",
                "outlineColor": "hover:outline-pink-300"
            },
            "focus": {
                "outlineColor": "focus:outline-pink-300",
                "borderColor": "focus:border-pink-300"
            }
        },
        "pink-400": {
            "textColor": "text-pink-400",
            "bgColor": "bg-pink-400",
            "bgColorHalfOpacity": "bg-pink-400/50",
            "borderColor": "border-pink-400",
            "outlineColor": "outline-pink-400",
            "hexColor": "#f472b6",
            "hover": {
                "textColor": "hover:text-pink-400",
                "bgColor": "hover:bg-pink-400",
                "bgColorHalfOpacity": "hover:bg-pink-400/50",
                "borderColor": "hover:border-pink-400",
                "outlineColor": "hover:outline-pink-400"
            },
            "focus": {
                "outlineColor": "focus:outline-pink-400",
                "borderColor": "focus:border-pink-400"
            }
        },
        "pink-500": {
            "textColor": "text-pink-500",
            "bgColor": "bg-pink-500",
            "bgColorHalfOpacity": "bg-pink-500/50",
            "borderColor": "border-pink-500",
            "outlineColor": "outline-pink-500",
            "hexColor": "#ec4899",
            "hover": {
                "textColor": "hover:text-pink-500",
                "bgColor": "hover:bg-pink-500",
                "bgColorHalfOpacity": "hover:bg-pink-500/50",
                "borderColor": "hover:border-pink-500",
                "outlineColor": "hover:outline-pink-500"
            },
            "focus": {
                "outlineColor": "focus:outline-pink-500",
                "borderColor": "focus:border-pink-500"
            }
        },
        "pink-600": {
            "textColor": "text-pink-600",
            "bgColor": "bg-pink-600",
            "bgColorHalfOpacity": "bg-pink-600/50",
            "borderColor": "border-pink-600",
            "outlineColor": "outline-pink-600",
            "hexColor": "#db2777",
            "hover": {
                "textColor": "hover:text-pink-600",
                "bgColor": "hover:bg-pink-600",
                "bgColorHalfOpacity": "hover:bg-pink-600/50",
                "borderColor": "hover:border-pink-600",
                "outlineColor": "hover:outline-pink-600"
            },
            "focus": {
                "outlineColor": "focus:outline-pink-600",
                "borderColor": "focus:border-pink-600"
            }
        },
        "pink-700": {
            "textColor": "text-pink-700",
            "bgColor": "bg-pink-700",
            "bgColorHalfOpacity": "bg-pink-700/50",
            "borderColor": "border-pink-700",
            "outlineColor": "outline-pink-700",
            "hexColor": "#be185d",
            "hover": {
                "textColor": "hover:text-pink-700",
                "bgColor": "hover:bg-pink-700",
                "bgColorHalfOpacity": "hover:bg-pink-700/50",
                "borderColor": "hover:border-pink-700",
                "outlineColor": "hover:outline-pink-700"
            },
            "focus": {
                "outlineColor": "focus:outline-pink-700",
                "borderColor": "focus:border-pink-700"
            }
        },
        "pink-800": {
            "textColor": "text-pink-800",
            "bgColor": "bg-pink-800",
            "bgColorHalfOpacity": "bg-pink-800/50",
            "borderColor": "border-pink-800",
            "outlineColor": "outline-pink-800",
            "hexColor": "#9d174d",
            "hover": {
                "textColor": "hover:text-pink-800",
                "bgColor": "hover:bg-pink-800",
                "bgColorHalfOpacity": "hover:bg-pink-800/50",
                "borderColor": "hover:border-pink-800",
                "outlineColor": "hover:outline-pink-800"
            },
            "focus": {
                "outlineColor": "focus:outline-pink-800",
                "borderColor": "focus:border-pink-800"
            }
        },
        "pink-900": {
            "textColor": "text-pink-900",
            "bgColor": "bg-pink-900",
            "bgColorHalfOpacity": "bg-pink-900/50",
            "borderColor": "border-pink-900",
            "outlineColor": "outline-pink-900",
            "hexColor": "#831843",
            "hover": {
                "textColor": "hover:text-pink-900",
                "bgColor": "hover:bg-pink-900",
                "bgColorHalfOpacity": "hover:bg-pink-900/50",
                "borderColor": "hover:border-pink-900",
                "outlineColor": "hover:outline-pink-900"
            },
            "focus": {
                "outlineColor": "focus:outline-pink-900",
                "borderColor": "focus:border-pink-900"
            }
        },
        "pink-950": {
            "textColor": "text-pink-950",
            "bgColor": "bg-pink-950",
            "bgColorHalfOpacity": "bg-pink-950/50",
            "borderColor": "border-pink-950",
            "outlineColor": "outline-pink-950",
            "hexColor": "#500724",
            "hover": {
                "textColor": "hover:text-pink-950",
                "bgColor": "hover:bg-pink-950",
                "bgColorHalfOpacity": "hover:bg-pink-950/50",
                "borderColor": "hover:border-pink-950",
                "outlineColor": "hover:outline-pink-950"
            },
            "focus": {
                "outlineColor": "focus:outline-pink-950",
                "borderColor": "focus:border-pink-950"
            }
        }
    },
    "rose": {
        "rose-50": {
            "textColor": "text-rose-50",
            "bgColor": "bg-rose-50",
            "bgColorHalfOpacity": "bg-rose-50/50",
            "borderColor": "border-rose-50",
            "outlineColor": "outline-rose-50",
            "hexColor": "#fff1f2",
            "hover": {
                "textColor": "hover:text-rose-50",
                "bgColor": "hover:bg-rose-50",
                "bgColorHalfOpacity": "hover:bg-rose-50/50",
                "borderColor": "hover:border-rose-50",
                "outlineColor": "hover:outline-rose-50"
            },
            "focus": {
                "outlineColor": "focus:outline-rose-50",
                "borderColor": "focus:border-rose-50"
            }
        },
        "rose-100": {
            "textColor": "text-rose-100",
            "bgColor": "bg-rose-100",
            "bgColorHalfOpacity": "bg-rose-100/50",
            "borderColor": "border-rose-100",
            "outlineColor": "outline-rose-100",
            "hexColor": "#ffe4e6",
            "hover": {
                "textColor": "hover:text-rose-100",
                "bgColor": "hover:bg-rose-100",
                "bgColorHalfOpacity": "hover:bg-rose-100/50",
                "borderColor": "hover:border-rose-100",
                "outlineColor": "hover:outline-rose-100"
            },
            "focus": {
                "outlineColor": "focus:outline-rose-100",
                "borderColor": "focus:border-rose-100"
            }
        },
        "rose-200": {
            "textColor": "text-rose-200",
            "bgColor": "bg-rose-200",
            "bgColorHalfOpacity": "bg-rose-200/50",
            "borderColor": "border-rose-200",
            "outlineColor": "outline-rose-200",
            "hexColor": "#fecdd3",
            "hover": {
                "textColor": "hover:text-rose-200",
                "bgColor": "hover:bg-rose-200",
                "bgColorHalfOpacity": "hover:bg-rose-200/50",
                "borderColor": "hover:border-rose-200",
                "outlineColor": "hover:outline-rose-200"
            },
            "focus": {
                "outlineColor": "focus:outline-rose-200",
                "borderColor": "focus:border-rose-200"
            }
        },
        "rose-300": {
            "textColor": "text-rose-300",
            "bgColor": "bg-rose-300",
            "bgColorHalfOpacity": "bg-rose-300/50",
            "borderColor": "border-rose-300",
            "outlineColor": "outline-rose-300",
            "hexColor": "#fda4af",
            "hover": {
                "textColor": "hover:text-rose-300",
                "bgColor": "hover:bg-rose-300",
                "bgColorHalfOpacity": "hover:bg-rose-300/50",
                "borderColor": "hover:border-rose-300",
                "outlineColor": "hover:outline-rose-300"
            },
            "focus": {
                "outlineColor": "focus:outline-rose-300",
                "borderColor": "focus:border-rose-300"
            }
        },
        "rose-400": {
            "textColor": "text-rose-400",
            "bgColor": "bg-rose-400",
            "bgColorHalfOpacity": "bg-rose-400/50",
            "borderColor": "border-rose-400",
            "outlineColor": "outline-rose-400",
            "hexColor": "#fb7185",
            "hover": {
                "textColor": "hover:text-rose-400",
                "bgColor": "hover:bg-rose-400",
                "bgColorHalfOpacity": "hover:bg-rose-400/50",
                "borderColor": "hover:border-rose-400",
                "outlineColor": "hover:outline-rose-400"
            },
            "focus": {
                "outlineColor": "focus:outline-rose-400",
                "borderColor": "focus:border-rose-400"
            }
        },
        "rose-500": {
            "textColor": "text-rose-500",
            "bgColor": "bg-rose-500",
            "bgColorHalfOpacity": "bg-rose-500/50",
            "borderColor": "border-rose-500",
            "outlineColor": "outline-rose-500",
            "hexColor": "#f43f5e",
            "hover": {
                "textColor": "hover:text-rose-500",
                "bgColor": "hover:bg-rose-500",
                "bgColorHalfOpacity": "hover:bg-rose-500/50",
                "borderColor": "hover:border-rose-500",
                "outlineColor": "hover:outline-rose-500"
            },
            "focus": {
                "outlineColor": "focus:outline-rose-500",
                "borderColor": "focus:border-rose-500"
            }
        },
        "rose-600": {
            "textColor": "text-rose-600",
            "bgColor": "bg-rose-600",
            "bgColorHalfOpacity": "bg-rose-600/50",
            "borderColor": "border-rose-600",
            "outlineColor": "outline-rose-600",
            "hexColor": "#e11d48",
            "hover": {
                "textColor": "hover:text-rose-600",
                "bgColor": "hover:bg-rose-600",
                "bgColorHalfOpacity": "hover:bg-rose-600/50",
                "borderColor": "hover:border-rose-600",
                "outlineColor": "hover:outline-rose-600"
            },
            "focus": {
                "outlineColor": "focus:outline-rose-600",
                "borderColor": "focus:border-rose-600"
            }
        },
        "rose-700": {
            "textColor": "text-rose-700",
            "bgColor": "bg-rose-700",
            "bgColorHalfOpacity": "bg-rose-700/50",
            "borderColor": "border-rose-700",
            "outlineColor": "outline-rose-700",
            "hexColor": "#be123c",
            "hover": {
                "textColor": "hover:text-rose-700",
                "bgColor": "hover:bg-rose-700",
                "bgColorHalfOpacity": "hover:bg-rose-700/50",
                "borderColor": "hover:border-rose-700",
                "outlineColor": "hover:outline-rose-700"
            },
            "focus": {
                "outlineColor": "focus:outline-rose-700",
                "borderColor": "focus:border-rose-700"
            }
        },
        "rose-800": {
            "textColor": "text-rose-800",
            "bgColor": "bg-rose-800",
            "bgColorHalfOpacity": "bg-rose-800/50",
            "borderColor": "border-rose-800",
            "outlineColor": "outline-rose-800",
            "hexColor": "#9f1239",
            "hover": {
                "textColor": "hover:text-rose-800",
                "bgColor": "hover:bg-rose-800",
                "bgColorHalfOpacity": "hover:bg-rose-800/50",
                "borderColor": "hover:border-rose-800",
                "outlineColor": "hover:outline-rose-800"
            },
            "focus": {
                "outlineColor": "focus:outline-rose-800",
                "borderColor": "focus:border-rose-800"
            }
        },
        "rose-900": {
            "textColor": "text-rose-900",
            "bgColor": "bg-rose-900",
            "bgColorHalfOpacity": "bg-rose-900/50",
            "borderColor": "border-rose-900",
            "outlineColor": "outline-rose-900",
            "hexColor": "#881337",
            "hover": {
                "textColor": "hover:text-rose-900",
                "bgColor": "hover:bg-rose-900",
                "bgColorHalfOpacity": "hover:bg-rose-900/50",
                "borderColor": "hover:border-rose-900",
                "outlineColor": "hover:outline-rose-900"
            },
            "focus": {
                "outlineColor": "focus:outline-rose-900",
                "borderColor": "focus:border-rose-900"
            }
        },
        "rose-950": {
            "textColor": "text-rose-950",
            "bgColor": "bg-rose-950",
            "bgColorHalfOpacity": "bg-rose-950/50",
            "borderColor": "border-rose-950",
            "outlineColor": "outline-rose-950",
            "hexColor": "#4c0519",
            "hover": {
                "textColor": "hover:text-rose-950",
                "bgColor": "hover:bg-rose-950",
                "bgColorHalfOpacity": "hover:bg-rose-950/50",
                "borderColor": "hover:border-rose-950",
                "outlineColor": "hover:outline-rose-950"
            },
            "focus": {
                "outlineColor": "focus:outline-rose-950",
                "borderColor": "focus:border-rose-950"
            }
        }
    }
};
