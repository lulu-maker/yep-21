export function CompanyAvatar({ name, logoUrl }: { name: string; logoUrl?: string }) {
  if (logoUrl) {
    return <img src={logoUrl} alt={`${name} logo`} className="company-avatar" />;
  }

  return <div className="company-avatar fallback">{name.slice(0, 1).toUpperCase()}</div>;
}
