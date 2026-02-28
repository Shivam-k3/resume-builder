import type { Resume } from '../../types/resume';

interface TemplateProps {
  resume: Resume;
}

const CreativeTemplate = ({ resume }: TemplateProps) => {
  return (
    <div className="bg-white shadow-lg" style={{ width: '210mm', minHeight: '297mm' }}>
      <div className="flex">
        {/* Sidebar */}
        <div className="w-1/3 bg-gradient-to-b from-purple-600 to-pink-600 text-white p-6">
          <div className="mb-6">
            <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center text-purple-600 text-3xl font-bold">
              {resume.personalInfo.fullName?.charAt(0) || 'Y'}
            </div>
            <h1 className="text-2xl font-bold text-center">
              {resume.personalInfo.fullName || 'Your Name'}
            </h1>
            <p className="text-center text-purple-100 mt-1">
              {resume.personalInfo.title || 'Professional Title'}
            </p>
          </div>

          <div className="space-y-4 text-sm">
            {resume.personalInfo.email && (
              <div>
                <h3 className="font-bold mb-1">EMAIL</h3>
                <p className="text-purple-100">{resume.personalInfo.email}</p>
              </div>
            )}
            {resume.personalInfo.phone && (
              <div>
                <h3 className="font-bold mb-1">PHONE</h3>
                <p className="text-purple-100">{resume.personalInfo.phone}</p>
              </div>
            )}
            {resume.personalInfo.location && (
              <div>
                <h3 className="font-bold mb-1">LOCATION</h3>
                <p className="text-purple-100">{resume.personalInfo.location}</p>
              </div>
            )}
          </div>

          {resume.skills.length > 0 && (
            <div className="mt-6">
              <h2 className="font-bold text-lg mb-3 border-b border-purple-400 pb-2">
                SKILLS
              </h2>
              {resume.skills.map((skillGroup) => (
                <div key={skillGroup.id} className="mb-3">
                  <h3 className="font-semibold text-sm mb-1">{skillGroup.category}</h3>
                  <div className="space-y-1">
                    {skillGroup.skills.map((skill, idx) => (
                      <div key={idx} className="text-xs text-purple-100">
                        • {skill}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {resume.links.length > 0 && (
            <div className="mt-6">
              <h2 className="font-bold text-lg mb-3 border-b border-purple-400 pb-2">
                LINKS
              </h2>
              {resume.links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  className="block text-sm text-purple-100 hover:text-white mb-2"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="w-2/3 p-6">
          {resume.personalInfo.summary && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-purple-600 mb-3">About Me</h2>
              <p className="text-gray-700 leading-relaxed">{resume.personalInfo.summary}</p>
            </div>
          )}

          {resume.sectionOrder.map((section) => {
            if (section === 'experience' && resume.experience.length > 0) {
              return (
                <div key={section} className="mb-6">
                  <h2 className="text-xl font-bold text-purple-600 mb-3">Experience</h2>
                  {resume.experience.map((exp) => (
                    <div key={exp.id} className="mb-4 border-l-4 border-purple-300 pl-4">
                      <h3 className="font-bold text-gray-900">{exp.position}</h3>
                      <p className="text-purple-600 text-sm">{exp.company}</p>
                      <p className="text-gray-500 text-xs mb-2">
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate} | {exp.location}
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
                  <h2 className="text-xl font-bold text-purple-600 mb-3">Education</h2>
                  {resume.education.map((edu) => (
                    <div key={edu.id} className="mb-3 border-l-4 border-purple-300 pl-4">
                      <h3 className="font-bold text-gray-900">
                        {edu.degree} in {edu.field}
                      </h3>
                      <p className="text-purple-600 text-sm">{edu.institution}</p>
                      <p className="text-gray-500 text-xs">
                        {edu.startDate} - {edu.endDate}
                        {edu.gpa && ` | GPA: ${edu.gpa}`}
                      </p>
                    </div>
                  ))}
                </div>
              );
            }

            if (section === 'projects' && resume.projects.length > 0) {
              return (
                <div key={section} className="mb-6">
                  <h2 className="text-xl font-bold text-purple-600 mb-3">Projects</h2>
                  {resume.projects.map((project) => (
                    <div key={project.id} className="mb-3 border-l-4 border-purple-300 pl-4">
                      <h3 className="font-bold text-gray-900">{project.name}</h3>
                      <p className="text-gray-700 text-sm">{project.description}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {project.technologies.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full"
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

            if (section === 'certifications' && resume.certifications.length > 0) {
              return (
                <div key={section} className="mb-6">
                  <h2 className="text-xl font-bold text-purple-600 mb-3">Certifications</h2>
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
                  <h2 className="text-xl font-bold text-purple-600 mb-3">Achievements</h2>
                  {resume.achievements.map((achievement) => (
                    <div key={achievement.id} className="mb-2">
                      <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                      <p className="text-gray-700 text-sm">{achievement.description}</p>
                    </div>
                  ))}
                </div>
              );
            }

            return null;
          })}
        </div>
      </div>
    </div>
  );
};

export default CreativeTemplate;
