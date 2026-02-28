import type { Resume } from '../../types/resume';

interface TemplateProps {
  resume: Resume;
}

const CorporateTemplate = ({ resume }: TemplateProps) => {
  return (
    <div className="bg-white p-8 shadow-lg" style={{ width: '210mm', minHeight: '297mm' }}>
      {/* Header */}
      <div className="bg-gray-800 text-white p-6 -m-8 mb-6">
        <h1 className="text-3xl font-bold mb-1">
          {resume.personalInfo.fullName || 'Your Name'}
        </h1>
        <p className="text-lg text-gray-300 mb-3">
          {resume.personalInfo.title || 'Professional Title'}
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
          {resume.personalInfo.phone && <span>| {resume.personalInfo.phone}</span>}
          {resume.personalInfo.location && <span>| {resume.personalInfo.location}</span>}
        </div>
      </div>

      {resume.personalInfo.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 uppercase mb-2">
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">{resume.personalInfo.summary}</p>
        </div>
      )}

      {/* Render sections */}
      {resume.sectionOrder.map((section) => {
        if (section === 'experience' && resume.experience.length > 0) {
          return (
            <div key={section} className="mb-6">
              <h2 className="text-lg font-bold text-gray-800 uppercase mb-3">
                Professional Experience
              </h2>
              {resume.experience.map((exp) => (
                <div key={exp.id} className="mb-4">
                  <div className="flex justify-between">
                    <h3 className="font-bold text-gray-900">{exp.position}</h3>
                    <span className="text-sm text-gray-600">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-1">
                    {exp.company} | {exp.location}
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                    {exp.description.map((desc, idx) => (
                      <li key={idx}>{desc}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          );
        }

        if (section === 'education' && resume.education.length > 0) {
          return (
            <div key={section} className="mb-6">
              <h2 className="text-lg font-bold text-gray-800 uppercase mb-3">Education</h2>
              {resume.education.map((edu) => (
                <div key={edu.id} className="mb-3">
                  <div className="flex justify-between">
                    <h3 className="font-bold text-gray-900">
                      {edu.degree} in {edu.field}
                    </h3>
                    <span className="text-sm text-gray-600">
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                  <p className="text-gray-700">{edu.institution}</p>
                  {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          );
        }

        if (section === 'skills' && resume.skills.length > 0) {
          return (
            <div key={section} className="mb-6">
              <h2 className="text-lg font-bold text-gray-800 uppercase mb-3">Skills</h2>
              {resume.skills.map((skillGroup) => (
                <div key={skillGroup.id} className="mb-2">
                  <span className="font-bold text-gray-900">{skillGroup.category}: </span>
                  <span className="text-gray-700">{skillGroup.skills.join(' • ')}</span>
                </div>
              ))}
            </div>
          );
        }

        if (section === 'projects' && resume.projects.length > 0) {
          return (
            <div key={section} className="mb-6">
              <h2 className="text-lg font-bold text-gray-800 uppercase mb-3">Projects</h2>
              {resume.projects.map((project) => (
                <div key={project.id} className="mb-3">
                  <h3 className="font-bold text-gray-900">{project.name}</h3>
                  <p className="text-gray-700 text-sm">{project.description}</p>
                  <p className="text-gray-600 text-xs mt-1">
                    Technologies: {project.technologies.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          );
        }

        if (section === 'certifications' && resume.certifications.length > 0) {
          return (
            <div key={section} className="mb-6">
              <h2 className="text-lg font-bold text-gray-800 uppercase mb-3">
                Certifications
              </h2>
              {resume.certifications.map((cert) => (
                <div key={cert.id} className="mb-2">
                  <h3 className="font-bold text-gray-900">{cert.name}</h3>
                  <p className="text-gray-600 text-sm">
                    {cert.issuer} | {cert.date}
                  </p>
                </div>
              ))}
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};

export default CorporateTemplate;
