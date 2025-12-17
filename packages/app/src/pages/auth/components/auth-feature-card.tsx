interface AuthFeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function AuthFeatureCard({ icon, title, description }: AuthFeatureCardProps) {
  return (
    <div className="flex items-start gap-3">
      {icon}
      <div>
        <h2 className="font-semibold text-white">{title}</h2>
        <p className="text-sm opacity-90">{description}</p>
      </div>
    </div>
  );
}
