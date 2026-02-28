import type { Resume } from '../../types/resume';

interface TemplateProps {
  resume: Resume;
}

const MinimalistTemplate = ({ resume }: TemplateProps) => {
  return (
    <div className="bg-white p-10" style={{ width: '210mm', minHeight: '297mm' }}>
      {/* Personal Info */}
      <div className="mb-8 pb-6 border-b-2 border-gray-300">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          {resume.personalInfo.fullName || 'Your Name'}
        </h1>
        <p className="text-sm text-gray-600 uppercase tracking-wide mb-3">
          {resume.personalInfo.title || 'Professional Title'}
        </p>
        <div className="flex flex-wrap gap-3 text-xs text-gray-600">
          {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
          {resume.personalInfo.phone && <span>|</span>}
          {resume.personalInfo.phone && <span>{resume.personalInfo.phone}</span>}
          {resume.personalInfo.location && <span>|</span>}
          {resume.personalInfo.location && <span>{resume.personalInfo.location}</span>}
        </div>
        {resume.personalInfo.summary && (
          <p className="mt-4 text-sm text-gray-700 leading-relaxed max-w-3xl">
            {resume.personalInfo.summary}
          </p>
        )}
      </div>

      {/* Experience Section */}
      {resume.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">
            Experience
          </h2>
          {resume.experience.map((exp) => (
            <div key={exp.id} className="mb-5">
              <div className="flex justify-between items-baseline">
                <h3 className="text-sm font-semibold text-gray-900">
                  {exp.position}
                </h3>
                <span className="text-xs text-gray-600">
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-1">
                {exp.company} • {exp.location}
              </p>
              <ul className="text-xs text-gray-700 space-y-1 mt-1">
                {exp.description.map((desc, idx) => (
                  <li key={idx} className="flex">
                    <span className="mr-2">•</span>
                    <span>{desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Education Section */}
      {resume.education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">
            Education
          </h2>
          {resume.education.map((edu) => (
            <div key={edu.id} className="mb-4">
              <div className="flex justify-between items-baseline">
                <h3 className="text-sm font-semibold text-gray-900">
                  {edu.degree} in {edu.field}
                </h3>
                <span className="text-xs text-gray-600">{edu.endDate}</span>
              </div>
              <p className="text-xs text-gray-600">
                {edu.institution}
                {edu.gpa && ` • GPA: ${edu.gpa}`}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Skills Section */}
      {resume.skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3">
            Skills
          </h2>
          <div className="text-xs text-gray-700 leading-relaxed">
            {resume.skills.map((skillGroup) => (
              <span key={skillGroup.id}>
                <strong>{skillGroup.category}:</strong> {skillGroup.skills.join(' • ')}
                <br />
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects Section */}
      {resume.projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">
            Projects
          </h2>
          {resume.projects.map((project) => (
            <div key={project.id} className="mb-4">
              <h3 className="text-sm font-semibold text-gray-900">
                {project.name}
              </h3>
              <p className="text-xs text-gray-700 mt-1">{project.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Certifications Section */}
      {resume.certifications.length > 0 && (
        <div>
          <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3">
            Certifications
          </h2>
          <div className="text-xs text-gray-700 space-y-1">
            {resume.certifications.map((cert) => (
              <p key={cert.id}>{cert.name} • {cert.issuer}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MinimalistTemplate;
