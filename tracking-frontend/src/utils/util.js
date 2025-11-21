import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Bus, Eye, EyeOff, ArrowLeft } from 'lucide-react';
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}