import type { Resume } from '../../types/resume';

interface TemplateProps {
  resume: Resume;
}

const ModernTemplate = ({ resume }: TemplateProps) => {
  return (
    <div className="bg-white p-8 shadow-lg" style={{ width: '210mm', minHeight: '297mm' }}>
      {/* Personal Info */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {resume.personalInfo.fullName || 'Your Name'}
        </h1>
        <p className="text-xl text-blue-600 mb-3">
          {resume.personalInfo.title || 'Professional Title'}
        </p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
          {resume.personalInfo.phone && <span>• {resume.personalInfo.phone}</span>}
          {resume.personalInfo.location && <span>• {resume.personalInfo.location}</span>}
        </div>
        {resume.personalInfo.summary && (
          <p className="mt-3 text-gray-700 leading-relaxed">
            {resume.personalInfo.summary}
          </p>
        )}
      </div>

      {/* Render sections in order */}
      {resume.sectionOrder.map((section) => {
        if (section === 'experience' && resume.experience.length > 0 && resume.profileType === 'professional') {
          return (
            <div key={section} className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-blue-600 pb-2 mb-4">
                Experience
              </h2>
              {resume.experience.map((exp) => (
                <div key={exp.id} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                      <p className="text-blue-600">{exp.company}</p>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <p>{exp.location}</p>
                      <p>
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </p>
                    </div>
                  </div>
                  <ul className="mt-2 list-disc list-inside space-y-1 text-gray-700">
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
              <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-blue-600 pb-2 mb-4">
                Education
              </h2>
              {resume.education.map((edu) => (
                <div key={edu.id} className="mb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {edu.degree} in {edu.field}
                      </h3>
                      <p className="text-blue-600">{edu.institution}</p>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <p>
                        {edu.startDate} - {edu.endDate}
                      </p>
                      {edu.gpa && <p>GPA: {edu.gpa}</p>}
                    </div>
                  </div>
                  {edu.description && <p className="mt-1 text-gray-700">{edu.description}</p>}
                </div>
              ))}
            </div>
          );
        }

        if (section === 'projects' && resume.projects.length > 0) {
          return (
            <div key={section} className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-blue-600 pb-2 mb-4">
                Projects
              </h2>
              {resume.projects.map((project) => (
                <div key={project.id} className="mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                  <p className="text-gray-700 mt-1">{project.description}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {project.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          );
        }

        if (section === 'skills' && resume.skills.length > 0) {
          return (
            <div key={section} className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-blue-600 pb-2 mb-4">
                Skills
              </h2>
              {resume.skills.map((skillGroup) => (
                <div key={skillGroup.id} className="mb-2">
                  <span className="font-semibold text-gray-900">{skillGroup.category}: </span>
                  <span className="text-gray-700">{skillGroup.skills.join(', ')}</span>
                </div>
              ))}
            </div>
          );
        }

        if (section === 'certifications' && resume.certifications.length > 0) {
          return (
            <div key={section} className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-blue-600 pb-2 mb-4">
                Certifications
              </h2>
              {resume.certifications.map((cert) => (
                <div key={cert.id} className="mb-2">
                  <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                  <p className="text-gray-600 text-sm">
                    {cert.issuer} • {cert.date}
                  </p>
                </div>
              ))}
            </div>
          );
        }

        if (section === 'achievements' && resume.achievements.length > 0) {
          return (
            <div key={section} className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-blue-600 pb-2 mb-4">
                Achievements
              </h2>
              {resume.achievements.map((achievement) => (
                <div key={achievement.id} className="mb-2">
                  <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                  <p className="text-gray-700 text-sm">{achievement.description}</p>
                </div>
              ))}
            </div>
          );
        }

        if (section === 'links' && resume.links.length > 0) {
          return (
            <div key={section} className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-blue-600 pb-2 mb-4">
                Links
              </h2>
              <div className="flex flex-wrap gap-3">
                {resume.links.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    className="text-blue-600 hover:underline"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          );
        }

        return null;
      })}

      {/* Custom Sections */}
      {resume.customSections.map((section) => (
        <div key={section.id} className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-blue-600 pb-2 mb-4">
            {section.title}
          </h2>
          <div className="text-gray-700 whitespace-pre-wrap">{section.content}</div>
        </div>
      ))}
    </div>
  );
};

export default ModernTemplate;
