function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function parseResumeWithOcr(file: File): Promise<{ name: string; skills: string[]; experience: string }> {
  await wait(900);

  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (!['pdf', 'doc', 'docx'].includes(ext)) {
    throw new Error('Only PDF, DOC, and DOCX files are allowed.');
  }

  const rawName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' ').trim();
  const normalizedName = rawName
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(' ');

  return {
    name: normalizedName || 'Freelancer Candidate',
    skills: ['React', 'TypeScript', 'REST APIs', 'Communication'],
    experience:
      'Experienced freelancer with delivery across web product builds, stakeholder communication, and iterative feature launches.',
  };
}
