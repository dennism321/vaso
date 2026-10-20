import {
  Briefcase,
  Cpu,
  Handshake,
  House,
  Landmark,
  Lock,
  Scale,
  Target,
  UserRound,
  Users,
  type LucideProps,
} from "lucide-react";

const areaIcons = {
  scale: Scale,
  briefcase: Briefcase,
  landmark: Landmark,
  users: Users,
  home: House,
  cpu: Cpu,
  building: Landmark,
  handshake: Handshake,
  user: UserRound,
  target: Target,
  lock: Lock,
} as const;

export function AreaIcon({ name, ...props }: { name: string } & LucideProps) {
  const Icon = areaIcons[name as keyof typeof areaIcons] ?? Scale;
  return <Icon strokeWidth={1.5} {...props} />;
}

export function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13.5 21v-7.5h2.53l.38-2.94H13.5V8.69c0-.85.24-1.43 1.46-1.43h1.56V4.63A20.9 20.9 0 0 0 14.25 4.5c-2.25 0-3.79 1.37-3.79 3.9v2.16H7.92v2.94h2.54V21h3.04Z" />
    </svg>
  );
}

export function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M21.58 7.19a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.82.42A2.5 2.5 0 0 0 2.42 7.2 26.2 26.2 0 0 0 2 12a26.2 26.2 0 0 0 .42 4.81 2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.82-.42a2.5 2.5 0 0 0 1.76-1.77A26.2 26.2 0 0 0 22 12a26.2 26.2 0 0 0-.42-4.81ZM10 15V9l5.2 3L10 15Z" />
    </svg>
  );
}

export function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3A1.97 1.97 0 1 0 5.25 7a1.97 1.97 0 0 0 0-4ZM20.44 13.4c0-3.1-1.65-4.55-3.86-4.55a3.33 3.33 0 0 0-3.02 1.66V8.5h-3.37V20h3.37v-5.7c0-1.5.29-2.95 2.14-2.95 1.83 0 1.85 1.71 1.85 3.05V20h3.39v-6.6Z" />
    </svg>
  );
}

export function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.78L17.75 3Zm-1.08 16.17h1.7L7.4 4.74H5.58l11.09 14.43Z" />
    </svg>
  );
}

export function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <div className={className} aria-label={`Βαθμολογία ${rating} στα 5`} role="img">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <svg
            key={i}
            viewBox="0 0 20 20"
            className={i <= Math.round(rating) ? "size-4 text-gold-400" : "size-4 text-current opacity-25"}
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M10 1.5l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L1.4 7.8l6-.8L10 1.5z" />
          </svg>
        ))}
      </div>
    </div>
  );
}
