import type * as React from 'react';

export type IconName = 'home'|'search'|'menu'|'close'|'user'|'cart'|'calendar'|'clock'|'phone'|'chat'|'map-pin'|'check'|'alert'|'info'|'chevron-right'|'chevron-left'|'chevron-down'|'arrow-right'|'plus'|'minus'|'filter'|'heart'|'tag'|'shield'|'moto'|'motocarro'|'wrench'|'toolbox'|'tire'|'nut'|'oil';
export type Tone = 'neutral'|'brand'|'solid'|'success'|'warning'|'info'|'dark';

export interface IconProps extends React.SVGAttributes<SVGSVGElement> { name: IconName; size?: 16|20|24|number; title?: string }
export declare function Icon(props: IconProps): React.ReactElement;

export interface LogoProps { variant?: 'horizontal'|'stacked'|'emblem'|'badge'; tone?: 'light'|'dark'|'mono'; height?: number; label?: string; className?: string }
export declare function Logo(props: LogoProps): React.ReactElement;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: 'primary'|'secondary'|'ghost'|'dark'|'light'; size?: 'md'|'sm'; block?: boolean; iconStart?: IconName; iconEnd?: IconName; loading?: boolean; href?: string }
export declare function Button(props: ButtonProps): React.ReactElement;

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { icon: IconName; label: string; variant?: 'ghost'|'secondary'|'dark'|'on-dark'; badge?: number|string; href?: string }
export declare function IconButton(props: IconButtonProps): React.ReactElement;

export interface BadgeProps { tone?: Tone; icon?: IconName; children?: React.ReactNode }
export declare function Badge(props: BadgeProps): React.ReactElement;

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { selected?: boolean; icon?: IconName; count?: number }
export declare function Chip(props: ChipProps): React.ReactElement;

export interface SegmentedControlProps { options: { value: string; label: string }[]; value: string; onChange?: (value: string) => void; label: string; name?: string }
export declare function SegmentedControl(props: SegmentedControlProps): React.ReactElement;

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> { label: string; hint?: string; error?: string; iconStart?: IconName; suffix?: string; options?: (string | { value: string; label: string; disabled?: boolean })[] }
export declare function TextField(props: TextFieldProps): React.ReactElement;

export interface QuantityStepperProps { value: number; min?: number; max?: number; onChange?: (value: number) => void; label?: string }
export declare function QuantityStepper(props: QuantityStepperProps): React.ReactElement;

export declare function formatCOP(value: number): string;
export interface PriceProps { value: number; oldValue?: number; note?: string; size?: 'md'|'sm' }
export declare function Price(props: PriceProps): React.ReactElement;

export interface ProductCardProps { title: string; category?: string; kind?: 'moto'|'motocarro'|'repuesto'|'accesorio'; price: number; oldPrice?: number; priceNote?: string; image?: string; imageAlt?: string; badges?: { tone?: Tone; label: string; icon?: IconName }[]; specs?: string[]; href?: string; actionLabel?: string; onAction?: () => void; onFavorite?: () => void; favorite?: boolean; layout?: 'vertical'|'horizontal' }
export declare function ProductCard(props: ProductCardProps): React.ReactElement;

export interface ServiceCardProps { icon?: IconName; title: string; description?: string; meta?: string; actionLabel?: string; href?: string; onAction?: () => void; tone?: 'light'|'dark' }
export declare function ServiceCard(props: ServiceCardProps): React.ReactElement;

export interface SectionHeaderProps { eyebrow?: string; title: string; actionLabel?: string; href?: string; as?: 'h1'|'h2'|'h3'; tone?: 'light'|'dark' }
export declare function SectionHeader(props: SectionHeaderProps): React.ReactElement;

interface HeroAction { label: string; href?: string; onClick?: () => void; icon?: IconName }
export interface HeroProps { eyebrow?: string; title: string; body?: string; primary?: HeroAction; secondary?: HeroAction; image?: string; imageAlt?: string }
export declare function Hero(props: HeroProps): React.ReactElement;

export interface TopBarProps { variant?: 'app'|'web'; tone?: 'dark'|'light'; title?: string; onBack?: () => void; backLabel?: string; actions?: { icon: IconName; label: string; badge?: number; href?: string; onClick?: () => void }[]; links?: { label: string; href?: string; active?: boolean }[]; cta?: { label: string; href?: string; onClick?: () => void }; onMenu?: () => void }
export declare function TopBar(props: TopBarProps): React.ReactElement;

export interface BottomNavProps { items: { icon: IconName; label: string; href?: string; active?: boolean; badge?: number }[]; fixed?: boolean; label?: string }
export declare function BottomNav(props: BottomNavProps): React.ReactElement;

export interface AlertProps { tone?: 'info'|'success'|'warning'|'danger'; title?: string; children?: React.ReactNode; action?: string; onAction?: () => void }
export declare function Alert(props: AlertProps): React.ReactElement;

export interface TimeSlotsProps { days: { id: string; weekday: string; date: string; disabled?: boolean }[]; slots: { time: string; disabled?: boolean }[]; day?: string; time?: string; onDayChange?: (id: string) => void; onTimeChange?: (time: string) => void; name?: string }
export declare function TimeSlots(props: TimeSlotsProps): React.ReactElement;

export interface StatusTimelineProps { steps: { label: string; detail?: string; state?: 'done'|'current'|'todo' }[]; label?: string }
export declare function StatusTimeline(props: StatusTimelineProps): React.ReactElement;

declare global { interface Window { Mocana: { Icon: typeof Icon; Logo: typeof Logo; Button: typeof Button; IconButton: typeof IconButton; Badge: typeof Badge; Chip: typeof Chip; SegmentedControl: typeof SegmentedControl; TextField: typeof TextField; QuantityStepper: typeof QuantityStepper; Price: typeof Price; formatCOP: typeof formatCOP; ProductCard: typeof ProductCard; ServiceCard: typeof ServiceCard; SectionHeader: typeof SectionHeader; Hero: typeof Hero; TopBar: typeof TopBar; BottomNav: typeof BottomNav; Alert: typeof Alert; TimeSlots: typeof TimeSlots; StatusTimeline: typeof StatusTimeline } } }
